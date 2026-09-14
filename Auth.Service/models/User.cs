using System;
using System.ComponentModel.DataAnnotations;

namespace Auth.Service.Models
{
    public static class UserRoles
    {
        public const string Admin = "Admin";
        public const string User = "User";
        public const string Manager = "Manager";
    }

    public class User
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;
        [MaxLength(50)]
        public string Surname { get; set; } = string.Empty;
        [MaxLength(50)]
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public string Role { get; set; } = UserRoles.User;
        public Guid CompanyId { get; set; }
        public Company? Company { get; set; }

        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;
    }


    public class RegisterDto
    {
        [Required(ErrorMessage = "Name is required.")]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;
        [Required(ErrorMessage = "Surname is required.")]
        [MaxLength(50)]
        public string Surname { get; set; } = string.Empty;
        [Required(ErrorMessage = "Email is required.")]
        [MaxLength(50)]
        public string Email { get; set; } = string.Empty;
        [Required(ErrorMessage = "Password is required.")]
        [MaxLength(50)]
        public string Password { get; set; } = string.Empty;
        public Guid? CompanyId { get; set; }
        [MaxLength(50)]
        public string? NewCompanyName { get; set; }
    }

    public class LoginDto
    {
        [Required(ErrorMessage = "Email is required.")]
        [MaxLength(50)]
        public string Email { get; set; } = string.Empty;
        [Required(ErrorMessage = "Password is required.")]
        [MaxLength(50)]
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime TokenExpiration { get; set; }
        public Guid UserId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public Guid CompanyId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
    }

    public class LogoutDto
    {
        [Required(ErrorMessage = "Refresh token is required.")]
        public string RefreshToken { get; set; } = string.Empty;
    }

    public class RefreshTokenDto
    {
        [Required(ErrorMessage = "Refresh token is required.")]
        public string RefreshToken { get; set; } = string.Empty;
    }

    public class UpdateUserDto
    {
        [Required(ErrorMessage = "Name is required.")]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;
        [Required(ErrorMessage = "Surname is required.")]
        [MaxLength(50)]
        public string Surname { get; set; } = string.Empty;
    }

    public class UserDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public Guid CompanyId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
}