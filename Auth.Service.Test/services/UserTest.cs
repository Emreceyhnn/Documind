using System;
using System.Threading.Tasks;
using Auth.Service.Data;
using Auth.Service.Models;
using Auth.Service.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Moq;
using Xunit;

namespace Auth.Service.Test.Services
{
    public class UserTest
    {
        private AppDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .ConfigureWarnings(x => x.Ignore(InMemoryEventId.TransactionIgnoredWarning))
                .Options;
            return new AppDbContext(options);
        }

        [Fact]
        public async Task RegisterAsync_WithValidData_ReturnsAuthResponseDto()
        {
            using var context = GetInMemoryDbContext();
            var mockTokenService = new Mock<ITokenService>();
            var mockConfiguration = new Mock<IConfiguration>();

            mockTokenService.Setup(s => s.GenerateRefreshToken()).Returns("refresh-token");
            mockTokenService.Setup(s => s.GenerateJwtToken(It.IsAny<User>())).Returns("access-token");
            mockConfiguration.Setup(s => s["JwtSettings:ExpiryInMinutes"]).Returns("60");

            var userService = new UserService(context, mockTokenService.Object, mockConfiguration.Object);

            var registerDto = new RegisterDto
            {
                Email = "test@example.com",
                Password = "password321!",
                Name = "John",
                Surname = "Doe",
                NewCompanyName = "Test Company"
            };

            var result = await userService.RegisterAsync(registerDto);

            Assert.NotNull(result);
            Assert.Equal("access-token", result.Token);
            Assert.Equal("refresh-token", result.RefreshToken);
            Assert.Equal(registerDto.Email, result.Email);
            Assert.Equal(registerDto.Name, result.Name);
            Assert.Equal(registerDto.Surname, result.Surname);
        }

        [Fact]
        public async Task RegisterAsync_WithExistingUser_ThrowsException()
        {
            using var context = GetInMemoryDbContext();
            var mockTokenService = new Mock<ITokenService>();
            var mockConfiguration = new Mock<IConfiguration>();

            context.Users.Add(new User
            {
                Id = Guid.NewGuid(),
                Email = "existing@example.com",
                Name = "John",
                Surname = "Doe"
            });
            await context.SaveChangesAsync();

            var userService = new UserService(context, mockTokenService.Object, mockConfiguration.Object);

            var registerDto = new RegisterDto
            {
                Email = "existing@example.com",
                Password = "password321!",
                Name = "John",
                Surname = "Doe"
            };

            await Assert.ThrowsAsync<InvalidOperationException>(() => userService.RegisterAsync(registerDto));
        }

        [Fact]
        public async Task LoginAsync_WithValidData_ReturnsAuthResponseDto()
        {
            using var context = GetInMemoryDbContext();
            var mockTokenService = new Mock<ITokenService>();
            var mockConfiguration = new Mock<IConfiguration>();

            mockTokenService.Setup(s => s.GenerateRefreshToken()).Returns("refresh-token");
            mockTokenService.Setup(s => s.GenerateJwtToken(It.IsAny<User>())).Returns("access-token");
            mockConfiguration.Setup(s => s["JwtSettings:ExpiryInMinutes"]).Returns("60");

            var userService = new UserService(context, mockTokenService.Object, mockConfiguration.Object);

            var registerDto = new RegisterDto
            {
                Email = "login@example.com",
                Password = "password321!",
                Name = "John",
                Surname = "Doe",
                NewCompanyName = "Login Co"
            };

            await userService.RegisterAsync(registerDto);

            var loginDto = new LoginDto
            {
                Email = "login@example.com",
                Password = "password321!"
            };

            var result = await userService.LoginAsync(loginDto);

            Assert.NotNull(result);
            Assert.Equal("access-token", result.Token);
            Assert.Equal("refresh-token", result.RefreshToken);
            Assert.Equal(registerDto.Email, result.Email);
        }

        [Fact]
        public async Task RefreshTokenAsync_WithInvalidToken_ThrowsException()
        {
            using var context = GetInMemoryDbContext();
            var mockTokenService = new Mock<ITokenService>();
            var mockConfiguration = new Mock<IConfiguration>();

            var userService = new UserService(context, mockTokenService.Object, mockConfiguration.Object);

            await Assert.ThrowsAsync<UnauthorizedAccessException>(() => userService.RefreshTokenAsync("invalid-token"));
        }
    }
}