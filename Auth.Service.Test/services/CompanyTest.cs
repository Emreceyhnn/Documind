using System;
using System.Threading.Tasks;
using Auth.Service.Data;
using Auth.Service.Models;
using Auth.Service.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Auth.Service.Test.Services;

public class CompanyTest
{
    private AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task CreateCompanyAsync_WhenUserNotFound_ThrowsException()
    {
        using var context = GetInMemoryDbContext();
        var companyService = new CompanyService(context);

        var addDto = new AddCompanyDto
        {
            CompanyName = "Test Company"
        };

        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            companyService.CreateCompanyAsync(Guid.NewGuid(), addDto));
    }

    [Fact]
    public async Task GetCompanyAsync_WhenUserNotFound_ThrowsException()
    {
        using var context = GetInMemoryDbContext();
        var companyService = new CompanyService(context);

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            companyService.GetCompanyAsync(Guid.NewGuid(), Guid.NewGuid()));
    }
}