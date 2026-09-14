using System;
using System.Security.Claims;
using Auth.Service.Controllers;
using Auth.Service.Models;
using Auth.Service.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Auth.Service.Test.Controller;

public class UserTest
{
    private UserController _controller;
    private Mock<IUserService> _userService;

    public UserTest()
    {
        _userService = new Mock<IUserService>();
        _controller = new UserController(_userService.Object);

        var userId = Guid.NewGuid();
        var identity = new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
        });
        var principal = new ClaimsPrincipal(identity);
        var context = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = principal
            }
        };

        _controller.ControllerContext = context;
    }

    [Fact]
    public async Task RegisterAsync_WithValidData_ReturnsOk()
    {
        var data = new RegisterDto
        {
            Email = "test@test.com",
            Password = "password321!",
            Name = "John",
            Surname = "Doe"
        };

        var response = new AuthResponseDto
        {
            Token = "access-token",
            RefreshToken = "refresh-token",
            UserId = Guid.NewGuid(),
            Email = "test@test.com",
            Name = "John",
            Surname = "Doe"
        };
        
        _userService.Setup(s => s.RegisterAsync(It.IsAny<RegisterDto>())).ReturnsAsync(response);
        var result = await _controller.RegisterAsync(data);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);

        var val = okResult.Value;
        var successProp = val.GetType().GetProperty("success")?.GetValue(val);
        var messageProp = val.GetType().GetProperty("message")?.GetValue(val);
        var responseProp = val.GetType().GetProperty("response")?.GetValue(val);

        Assert.Equal(true, successProp);
        Assert.Equal("User registered successfully.", messageProp);
        Assert.NotNull(responseProp);

        var responseVal = Assert.IsType<AuthResponseDto>(responseProp);
        Assert.Equal(response.Token, responseVal.Token);
        Assert.Equal(response.RefreshToken, responseVal.RefreshToken);
        Assert.Equal(response.Email, responseVal.Email);

        _userService.Verify(s => s.RegisterAsync(It.IsAny<RegisterDto>()), Times.Once);
    }

    [Fact]
    public async Task LoginAsync_WithValidData_ReturnsOk()
    {
        var data = new LoginDto
        {
            Email = "test@test.com",
            Password = "password321!"
        };

        var response = new AuthResponseDto
        {
            Token = "access-token",
            RefreshToken = "refresh-token",
            UserId = Guid.NewGuid(),
            Email = "test@test.com",
            Name = "John",
            Surname = "Doe"
        };
        
        _userService.Setup(s => s.LoginAsync(It.IsAny<LoginDto>())).ReturnsAsync(response);
        var result = await _controller.LoginAsync(data);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);

        var val = okResult.Value;
        var successProp = val.GetType().GetProperty("success")?.GetValue(val);
        var messageProp = val.GetType().GetProperty("message")?.GetValue(val);
        var responseProp = val.GetType().GetProperty("response")?.GetValue(val);

        Assert.Equal(true, successProp);
        Assert.Equal("User logged in successfully.", messageProp);
        Assert.NotNull(responseProp);

        var responseVal = Assert.IsType<AuthResponseDto>(responseProp);
        Assert.Equal(response.Token, responseVal.Token);
        Assert.Equal(response.RefreshToken, responseVal.RefreshToken);
        Assert.Equal(response.Email, responseVal.Email);

        _userService.Verify(s => s.LoginAsync(It.IsAny<LoginDto>()), Times.Once);
    }

    [Fact]
    public async Task RefreshTokenAsync_WithValidToken_ReturnsOk()
    {
        var data = new RefreshTokenDto
        {
            RefreshToken = "refresh-token"
        };

        var response = new AuthResponseDto
        {
            Token = "access-token",
            RefreshToken = "refresh-token",
            UserId = Guid.NewGuid(),
            Email = "test@test.com",
            Name = "John",
            Surname = "Doe"
        };
        
        _userService.Setup(s => s.RefreshTokenAsync(It.IsAny<string>())).ReturnsAsync(response);
        var result = await _controller.RefreshTokenAsync(data);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);

        var val = okResult.Value;
        var successProp = val.GetType().GetProperty("success")?.GetValue(val);
        var messageProp = val.GetType().GetProperty("message")?.GetValue(val);
        var responseProp = val.GetType().GetProperty("response")?.GetValue(val);

        Assert.Equal(true, successProp);
        Assert.Equal("Token refreshed successfully.", messageProp);
        Assert.NotNull(responseProp);

        var responseVal = Assert.IsType<AuthResponseDto>(responseProp);
        Assert.Equal(response.Token, responseVal.Token);
        Assert.Equal(response.RefreshToken, responseVal.RefreshToken);
        Assert.Equal(response.Email, responseVal.Email);

        _userService.Verify(s => s.RefreshTokenAsync(It.IsAny<string>()), Times.Once);
    }

    [Fact]
    public async Task GetCurrentUserAsync_WithValidToken_ReturnsOk()
    {
        var response = new UserDto
        {
            Id = Guid.NewGuid(),
            Email = "test@test.com",
            Name = "John",
            Surname = "Doe"
        };
        
        _userService.Setup(s => s.GetCurrentUserAsync(It.IsAny<Guid>())).ReturnsAsync(response);
        var result = await _controller.GetCurrentUserAsync();

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);

        var val = okResult.Value;
        var successProp = val.GetType().GetProperty("success")?.GetValue(val);
        var messageProp = val.GetType().GetProperty("message")?.GetValue(val);
        var responseProp = val.GetType().GetProperty("response")?.GetValue(val);

        Assert.Equal(true, successProp);
        Assert.Equal("User fetched successfully.", messageProp);
        Assert.NotNull(responseProp);

        var responseVal = Assert.IsType<UserDto>(responseProp);
        Assert.Equal(response.Id, responseVal.Id);
        Assert.Equal(response.Email, responseVal.Email);
        Assert.Equal(response.Name, responseVal.Name);
        Assert.Equal(response.Surname, responseVal.Surname);

        _userService.Verify(s => s.GetCurrentUserAsync(It.IsAny<Guid>()), Times.Once);
    }

    [Fact]
    public async Task UpdateUserAsync_WithValidData_ReturnsOk()
    {
        var data = new UpdateUserDto
        {
            Name = "John",
            Surname = "Doe"
        };

        var response = new UserDto
        {
            Id = Guid.NewGuid(),
            Email = "test@test.com",
            Name = "John",
            Surname = "Doe"
        };
        
        _userService.Setup(s => s.UpdateUserAsync(It.IsAny<Guid>(), It.IsAny<UpdateUserDto>())).ReturnsAsync(response);
        var result = await _controller.UpdateUserAsync(data);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);

        var val = okResult.Value;
        var successProp = val.GetType().GetProperty("success")?.GetValue(val);
        var messageProp = val.GetType().GetProperty("message")?.GetValue(val);
        var responseProp = val.GetType().GetProperty("response")?.GetValue(val);

        Assert.Equal(true, successProp);
        Assert.Equal("User updated successfully.", messageProp);
        Assert.NotNull(responseProp);

        var responseVal = Assert.IsType<UserDto>(responseProp);
        Assert.Equal(response.Id, responseVal.Id);
        Assert.Equal(response.Email, responseVal.Email);
        Assert.Equal(response.Name, responseVal.Name);
        Assert.Equal(response.Surname, responseVal.Surname);

        _userService.Verify(s => s.UpdateUserAsync(It.IsAny<Guid>(), It.IsAny<UpdateUserDto>()), Times.Once);
    }

    [Fact]
    public async Task DeleteUserAsync_WithValidToken_ReturnsOk()
    {
        _userService.Setup(s => s.DeleteUserAsync(It.IsAny<Guid>())).Returns(Task.CompletedTask);
        var result = await _controller.DeleteUserAsync();

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);

        var val = okResult.Value;
        var successProp = val.GetType().GetProperty("success")?.GetValue(val);
        var messageProp = val.GetType().GetProperty("message")?.GetValue(val);

        Assert.Equal(true, successProp);
        Assert.Equal("User deleted successfully.", messageProp);

        _userService.Verify(s => s.DeleteUserAsync(It.IsAny<Guid>()), Times.Once);
    }
}