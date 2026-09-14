using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Auth.Service.Data;
using Auth.Service.Models;

namespace Auth.Service.Services
{
    public interface ITokenService
    {
        string GenerateJwtToken(User user);
        string GenerateRefreshToken();
    }

    public class TokenService : ITokenService
    {
        private readonly IConfiguration _configuration;

        public TokenService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateJwtToken(User user)
        {
            var secretKey = _configuration["JwtSettings:SecretKey"] 
                ?? _configuration["JwtSettings"]
                ?? throw new InvalidOperationException("JwtSettings:SecretKey is missing.");
            var issuer = _configuration["JwtSettings:Issuer"] ?? _configuration["Issuer"] ?? "documind";
            var audience = _configuration["JwtSettings:Audience"] ?? _configuration["Audience"] ?? "documind-api";
            var expirationStr = _configuration["JwtSettings:ExpiryInMinutes"] ?? _configuration["ExpiryInMinutes"];
            var expiration = int.TryParse(expirationStr, out var min) ? min : 60;

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("companyId", user.CompanyId.ToString())
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(expiration),
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = credentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }

    public interface IUserService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
        Task<UserDto> GetCurrentUserAsync(Guid userId);
        Task LogOutAsync(Guid userId, string refreshToken);
        Task<UserDto> UpdateUserAsync(Guid userId, UpdateUserDto updateUserDto);
        Task DeleteUserAsync(Guid userId);
        Task<AuthResponseDto> RefreshTokenAsync(string refreshToken);
    }

    public class UserService : IUserService
    {
        private static readonly PasswordHasher<User> _passwordHasher = new();
        private readonly AppDbContext _context;
        private readonly ITokenService _tokenService;
        private readonly IConfiguration _configuration;

        public UserService(AppDbContext context, ITokenService tokenService, IConfiguration configuration)
        {
            _context = context;
            _tokenService = tokenService;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
        {
            var existingUser = await _context.Users.AnyAsync(u => u.Email.ToLower() == registerDto.Email.ToLower());
            if (existingUser)
            {
                throw new InvalidOperationException("User with this email already exists.");
            }

            var normalizedEmail = registerDto.Email.Trim().ToLower();
            var pendingInvite = await _context.CompanyInvites
                .FirstOrDefaultAsync(i => i.Email.ToLower() == normalizedEmail);

            var isNewCompany = pendingInvite == null && !string.IsNullOrWhiteSpace(registerDto.NewCompanyName);

            Guid companyId;
            if (pendingInvite != null)
            {
                companyId = pendingInvite.CompanyId;
            }
            else if (isNewCompany)
            {
                companyId = Guid.Empty;
            }
            else if (registerDto.CompanyId.HasValue && registerDto.CompanyId != Guid.Empty)
            {
                var companyExists = await _context.Companies.AnyAsync(c => c.Id == registerDto.CompanyId);
                if (!companyExists)
                {
                    throw new InvalidOperationException("Company not found.");
                }
                companyId = registerDto.CompanyId.Value;
            }
            else
            {
                throw new InvalidOperationException("You must either provide a company to join, create a new company, or be invited by an existing company.");
            }

            var user = new User
            {
                Name = registerDto.Name,
                Surname = registerDto.Surname,
                Email = registerDto.Email,
                Role = isNewCompany ? UserRoles.Admin : UserRoles.User,
                CompanyId = companyId
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, registerDto.Password);

            var refreshToken = _tokenService.GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(GetRefreshTokenExpiryDays());

            if (isNewCompany)
            {
                await using var transaction = await _context.Database.BeginTransactionAsync();

                var company = new Company
                {
                    CompanyName = registerDto.NewCompanyName!
                };
                _context.Companies.Add(company);
                await _context.SaveChangesAsync();

                user.CompanyId = company.Id;
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                company.CompanyAdminId = user.Id;
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
            }
            else
            {
                _context.Users.Add(user);

                if (pendingInvite != null)
                {
                    _context.CompanyInvites.Remove(pendingInvite);
                }

                await _context.SaveChangesAsync();
            }

            var jwtToken = _tokenService.GenerateJwtToken(user);
            var companyName = isNewCompany
                ? registerDto.NewCompanyName!
                : (await _context.Companies.FirstOrDefaultAsync(c => c.Id == user.CompanyId))?.CompanyName ?? string.Empty;

            return BuildAuthResponse(user, jwtToken, refreshToken, companyName);
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
        {
            var user = await _context.Users.Include(u => u.Company).FirstOrDefaultAsync(u => u.Email.ToLower() == loginDto.Email.ToLower());
            if (user == null || _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, loginDto.Password) == PasswordVerificationResult.Failed)
            {
                throw new UnauthorizedAccessException("Invalid email or password.");
            }

            if (!user.IsActive)
            {
                throw new UnauthorizedAccessException("This account is inactive.");
            }

            var jwtToken = _tokenService.GenerateJwtToken(user);
            var refreshToken = _tokenService.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(GetRefreshTokenExpiryDays());

            await _context.SaveChangesAsync();

            return BuildAuthResponse(user, jwtToken, refreshToken, user.Company?.CompanyName ?? string.Empty);
        }

        public async Task<AuthResponseDto> RefreshTokenAsync(string refreshToken)
        {
            var user = await _context.Users.Include(u => u.Company).FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);
            if (user == null || user.RefreshTokenExpiryTime == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                throw new UnauthorizedAccessException("Invalid or expired refresh token.");
            }

            if (!user.IsActive)
            {
                throw new UnauthorizedAccessException("This account is inactive.");
            }

            var jwtToken = _tokenService.GenerateJwtToken(user);
            var newRefreshToken = _tokenService.GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(GetRefreshTokenExpiryDays());

            await _context.SaveChangesAsync();

            return BuildAuthResponse(user, jwtToken, newRefreshToken, user.Company?.CompanyName ?? string.Empty);
        }

        private int GetExpiryInMinutes()
        {
            var expirationStr = _configuration["JwtSettings:ExpiryInMinutes"] ?? _configuration["ExpiryInMinutes"];
            return int.TryParse(expirationStr, out var min) ? min : 60;
        }

        private int GetRefreshTokenExpiryDays()
        {
            var refreshDaysStr = _configuration["JwtSettings:RefreshTokenExpiryDays"] ?? _configuration["RefreshTokenExpiryDays"];
            return int.TryParse(refreshDaysStr, out var days) ? days : 7;
        }

        private AuthResponseDto BuildAuthResponse(User user, string jwtToken, string refreshToken, string companyName)
        {
            return new AuthResponseDto
            {
                Token = jwtToken,
                RefreshToken = refreshToken,
                TokenExpiration = DateTime.UtcNow.AddMinutes(GetExpiryInMinutes()),
                UserId = user.Id,
                Email = user.Email,
                Name = user.Name,
                Surname = user.Surname,
                CompanyId = user.CompanyId,
                CompanyName = companyName
            };
        }

        private static UserDto MapToUserDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Surname = user.Surname,
                Email = user.Email,
                Role = user.Role,
                CompanyId = user.CompanyId,
                CompanyName = user.Company?.CompanyName ?? string.Empty,
                IsActive = user.IsActive
            };
        }

        public async Task<UserDto> GetCurrentUserAsync(Guid userId)
        {
            var user = await _context.Users.Include(u => u.Company).FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                throw new InvalidOperationException("User not found.");
            }

            return MapToUserDto(user);
        }

        public async Task LogOutAsync(Guid userId, string refreshToken)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId && u.RefreshToken == refreshToken);
            if (user == null)
            {
                throw new UnauthorizedAccessException("Invalid refresh token.");
            }

            user.RefreshToken = null;
            user.RefreshTokenExpiryTime = null;

            await _context.SaveChangesAsync();
        }

        public async Task<UserDto> UpdateUserAsync(Guid userId, UpdateUserDto updateUserDto)
        {
            var user = await _context.Users.Include(u => u.Company).FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                throw new InvalidOperationException("User not found.");
            }

            user.Name = updateUserDto.Name;
            user.Surname = updateUserDto.Surname;

            await _context.SaveChangesAsync();

            return MapToUserDto(user);
        }

        public async Task DeleteUserAsync(Guid userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                throw new InvalidOperationException("User not found.");
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }
    }
}