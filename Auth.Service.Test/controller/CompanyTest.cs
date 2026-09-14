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

public class CompannTest{

    private CompanyController _controller;
    private Mock<ICompanyService> _companyServiceMock;

    public CompannTest(){

        _companyServiceMock = new Mock<ICompanyService>();
        _controller = new CompanyController(_companyServiceMock.Object);
        
        var userId = Guid.NewGuid();
        var identity = new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, userId.ToString()) }, "TestAuthType");
        var claimsPrincipal = new ClaimsPrincipal(identity);
        var httpContext = new DefaultHttpContext
        {
            User = claimsPrincipal
        };
        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = httpContext
        };

    }

    [Fact]
    public async Task CreateCompanyAsync_WithValidData_ReturnsOk()
    {
        var data = new AddCompanyDto
        {
            CompanyName = "Test Company"
        };

        var response = new CompanyResponseDto
        {
            Id = Guid.NewGuid(),
            CompanyName = "Test Company",
            CompanyAdminId = Guid.NewGuid(),
            CompanyMembers = new List<UserDto>(),
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        _companyServiceMock.Setup(s => s.CreateCompanyAsync(It.IsAny<Guid>(), It.IsAny<AddCompanyDto>()))
            .ReturnsAsync(response);

        var result = await _controller.CreateCompanyAsync(data);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);

        var val = okResult.Value;
        var successProp = val.GetType().GetProperty("success")?.GetValue(val);
        var messageProp = val.GetType().GetProperty("message")?.GetValue(val);
        var responseProp = val.GetType().GetProperty("response")?.GetValue(val);

        Assert.Equal(true, successProp);
        Assert.Equal("Company created successfully.", messageProp);
        Assert.NotNull(responseProp);
    }

    [Fact]
    public async Task UpdateCompanyAsync_WithValidData_ReturnsOk()
    {
        var data = new EditCompanyDto
        {
            CompanyName = "Test Company",
            CompanyAdminId = Guid.NewGuid()
        };

        var response = new CompanyResponseDto
        {
            Id = Guid.NewGuid(),
            CompanyName = "TEst company2",
            CompanyAdminId =Guid.NewGuid(),
            CompanyMembers = new List<UserDto>(),
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow

        };
        
        _companyServiceMock.Setup(s=>s.UpdateCompanyAsync(It.IsAny<Guid>(),It.IsAny<Guid>(),It.IsAny<EditCompanyDto>())).ReturnsAsync(response);

        var result = await _controller.UpdateCompanyAsync(response.Id,data);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);

        var val = okResult.Value;
        var successProp = val.GetType().GetProperty("success")?.GetValue(val);
        var messageProp = val.GetType().GetProperty("message")?.GetValue(val);
        var responseProp = val.GetType().GetProperty("response")?.GetValue(val);

        Assert.Equal(true, successProp);
        Assert.Equal("Company updated successfully.", messageProp);
        Assert.NotNull(responseProp);

        var responseVal = Assert.IsType<CompanyResponseDto>(responseProp);
        Assert.Equal(response.Id,responseVal.Id);
        Assert.Equal(response.CompanyName,responseVal.CompanyName);
        Assert.Equal(response.CompanyAdminId,responseVal.CompanyAdminId);
        Assert.Equal(response.CompanyMembers,responseVal.CompanyMembers);
        Assert.Equal(response.CreatedDate,responseVal.CreatedDate);
        Assert.Equal(response.UpdatedDate,responseVal.UpdatedDate);

        _companyServiceMock.Verify(s=>s.UpdateCompanyAsync(It.IsAny<Guid>(),It.IsAny<Guid>(),It.IsAny<EditCompanyDto>()),Times.Once);
    }

    [Fact]
    public async Task GetCompanyAsync_WithValidData_ReturnsOk()
    {
        var response = new CompanyResponseDto
        {
            Id = Guid.NewGuid(),
            CompanyName = "Test Company",
            CompanyAdminId = Guid.NewGuid(),
            CompanyMembers = new List<UserDto>(),
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        _companyServiceMock.Setup(s=>s.GetCompanyAsync(It.IsAny<Guid>(),It.IsAny<Guid>())).ReturnsAsync(response);

        var result = await _controller.GetCompanyAsync(response.Id);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);

        var val = okResult.Value;
        var successProp = val.GetType().GetProperty("success")?.GetValue(val);
        var messageProp = val.GetType().GetProperty("message")?.GetValue(val);
        var responseProp = val.GetType().GetProperty("response")?.GetValue(val);

        Assert.Equal(true, successProp);
        Assert.Equal("Company fetched successfully.", messageProp);
        Assert.NotNull(responseProp);

        var responseVal = Assert.IsType<CompanyResponseDto>(responseProp);
        Assert.Equal(response.Id,responseVal.Id);
        Assert.Equal(response.CompanyName,responseVal.CompanyName);
        Assert.Equal(response.CompanyAdminId,responseVal.CompanyAdminId);
        Assert.Equal(response.CompanyMembers,responseVal.CompanyMembers);
        Assert.Equal(response.CreatedDate,responseVal.CreatedDate);
        Assert.Equal(response.UpdatedDate,responseVal.UpdatedDate);

        _companyServiceMock.Verify(s=>s.GetCompanyAsync(It.IsAny<Guid>(),It.IsAny<Guid>()),Times.Once);
    }

    [Fact]
    public async Task DeleteCompanyAsync_WithValidData_ReturnsOk()
    {
        _companyServiceMock.Setup(s=>s.DeleteCompanyAsync(It.IsAny<Guid>(),It.IsAny<Guid>())).Returns(Task.CompletedTask);

        var result = await _controller.DeleteCompanyAsync(Guid.NewGuid());

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);

        var val = okResult.Value;
        var successProp = val.GetType().GetProperty("success")?.GetValue(val);
        var messageProp = val.GetType().GetProperty("message")?.GetValue(val);

        Assert.Equal(true, successProp);
        Assert.Equal("Company deleted successfully.", messageProp);

        _companyServiceMock.Verify(s=>s.DeleteCompanyAsync(It.IsAny<Guid>(),It.IsAny<Guid>()),Times.Once);
    }

    [Fact]
    public async Task AddMemberToCompanyAsync_WithValidData_ReturnsOk()
    {
        var data = new AddMemberToCompanyDto
        {
            CompanyId = Guid.NewGuid(),
            UserEmail = "test@test.com"
        };

        var response = new CompanyResponseDto
        {
            Id = Guid.NewGuid(),
            CompanyName = "Test Company",
            CompanyAdminId = Guid.NewGuid(),
            CompanyMembers = new List<UserDto>(),
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        _companyServiceMock.Setup(s=>s.AddMemberToCompanyAsync(It.IsAny<Guid>(),It.IsAny<AddMemberToCompanyDto>())).ReturnsAsync(response);

        var result = await _controller.AddMemberToCompanyAsync(data);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);

        var val = okResult.Value;
        var successProp = val.GetType().GetProperty("success")?.GetValue(val);
        var messageProp = val.GetType().GetProperty("message")?.GetValue(val);
        var responseProp = val.GetType().GetProperty("response")?.GetValue(val);

        Assert.Equal(true, successProp);
        Assert.Equal("Member added to company successfully.", messageProp);
        Assert.NotNull(responseProp);

        var responseVal = Assert.IsType<CompanyResponseDto>(responseProp);
        Assert.Equal(response.Id,responseVal.Id);
        Assert.Equal(response.CompanyName,responseVal.CompanyName);
        Assert.Equal(response.CompanyAdminId,responseVal.CompanyAdminId);
        Assert.Equal(response.CompanyMembers,responseVal.CompanyMembers);
        Assert.Equal(response.CreatedDate,responseVal.CreatedDate);
        Assert.Equal(response.UpdatedDate,responseVal.UpdatedDate);

        _companyServiceMock.Verify(s=>s.AddMemberToCompanyAsync(It.IsAny<Guid>(),It.IsAny<AddMemberToCompanyDto>()),Times.Once);
    }

    [Fact]
    public async Task RemoveMemberFromCompanyAsync_WithValidData_ReturnsOk()
    {
        var data = new RemoveMemberFromCompanyDto
        {
            CompanyId = Guid.NewGuid(),
            UserId = Guid.NewGuid()
        };

        var response = new CompanyResponseDto
        {
            Id = Guid.NewGuid(),
            CompanyName = "Test Company",
            CompanyAdminId = Guid.NewGuid(),
            CompanyMembers = new List<UserDto>(),
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };

        _companyServiceMock.Setup(s=>s.RemoveMemberFromCompanyAsync(It.IsAny<Guid>(),It.IsAny<RemoveMemberFromCompanyDto>())).ReturnsAsync(response);

        var result = await _controller.RemoveMemberFromCompanyAsync(data);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);

        var val = okResult.Value;
        var successProp = val.GetType().GetProperty("success")?.GetValue(val);
        var messageProp = val.GetType().GetProperty("message")?.GetValue(val);
        var responseProp = val.GetType().GetProperty("response")?.GetValue(val);

        Assert.Equal(true, successProp);
        Assert.Equal("Member removed from company successfully.", messageProp);
        Assert.NotNull(responseProp);

        var responseVal = Assert.IsType<CompanyResponseDto>(responseProp);
        Assert.Equal(response.Id,responseVal.Id);
        Assert.Equal(response.CompanyName,responseVal.CompanyName);
        Assert.Equal(response.CompanyAdminId,responseVal.CompanyAdminId);
        Assert.Equal(response.CompanyMembers,responseVal.CompanyMembers);
        Assert.Equal(response.CreatedDate,responseVal.CreatedDate);
        Assert.Equal(response.UpdatedDate,responseVal.UpdatedDate);

        _companyServiceMock.Verify(s=>s.RemoveMemberFromCompanyAsync(It.IsAny<Guid>(),It.IsAny<RemoveMemberFromCompanyDto>()),Times.Once);
    }
}