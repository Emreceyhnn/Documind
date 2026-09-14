using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Auth.Service.Data;
using Auth.Service.Models;

namespace Auth.Service.Services;

public interface ICompanyService
{
    Task<CompanyResponseDto> CreateCompanyAsync(Guid requestingUserId, AddCompanyDto addCompanyDto);
    Task<CompanyResponseDto> GetCompanyAsync(Guid requestingUserId, Guid companyId);
    Task<CompanyResponseDto> UpdateCompanyAsync(Guid requestingUserId, Guid companyId, EditCompanyDto editCompanyDto);
    Task DeleteCompanyAsync(Guid requestingUserId, Guid companyId);
    Task<CompanyResponseDto> AddMemberToCompanyAsync(Guid requestingUserId, AddMemberToCompanyDto addMemberToCompanyDto);
    Task<CompanyResponseDto> RemoveMemberFromCompanyAsync(Guid requestingUserId, RemoveMemberFromCompanyDto removeMemberFromCompanyDto);
    Task<PendingInviteDto?> GetPendingInviteAsync(string email);
}

public class CompanyService : ICompanyService
{
    private readonly AppDbContext _context;

    public CompanyService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<CompanyResponseDto> CreateCompanyAsync(Guid requestingUserId, AddCompanyDto addCompanyDto)
    {
        var admin = await _context.Users.FirstOrDefaultAsync(u => u.Id == requestingUserId);
        if (admin == null)
        {
            throw new InvalidOperationException("Requesting user not found.");
        }

        if (admin.CompanyId != Guid.Empty)
        {
            throw new InvalidOperationException("User already belongs to a company.");
        }

        var company = new Company
        {
            CompanyName = addCompanyDto.CompanyName,
            CompanyAdminId = requestingUserId
        };

        _context.Companies.Add(company);
        await _context.SaveChangesAsync();

        admin.CompanyId = company.Id;
        admin.Role = UserRoles.Admin;
        await _context.SaveChangesAsync();

        return await GetCompanyAsync(requestingUserId, company.Id);
    }

    public async Task<CompanyResponseDto> GetCompanyAsync(Guid requestingUserId, Guid companyId)
    {
        var requester = await _context.Users.AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == requestingUserId);

        if (requester == null || requester.CompanyId != companyId)
        {
            throw new UnauthorizedAccessException("You do not have access to this company.");
        }

        var company = await _context.Companies
            .Include(c => c.CompanyMembers)
            .FirstOrDefaultAsync(c => c.Id == companyId);

        if (company == null)
        {
            throw new InvalidOperationException("Company not found.");
        }

        return MapToResponseDto(company);
    }

    public async Task<CompanyResponseDto> UpdateCompanyAsync(Guid requestingUserId, Guid companyId, EditCompanyDto editCompanyDto)
    {
        var company = await _context.Companies
            .Include(c => c.CompanyMembers)
            .FirstOrDefaultAsync(c => c.Id == companyId);

        if (company == null)
        {
            throw new InvalidOperationException("Company not found.");
        }

        if (company.CompanyAdminId != requestingUserId)
        {
            throw new UnauthorizedAccessException("Only the company admin can update this company.");
        }

        var newAdmin = await _context.Users.FirstOrDefaultAsync(u => u.Id == editCompanyDto.CompanyAdminId);
        if (newAdmin == null || newAdmin.CompanyId != company.Id)
        {
            throw new InvalidOperationException("Company admin must be an existing member of this company.");
        }

        company.CompanyName = editCompanyDto.CompanyName;
        company.CompanyAdminId = editCompanyDto.CompanyAdminId;
        company.UpdatedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToResponseDto(company);
    }

    public async Task DeleteCompanyAsync(Guid requestingUserId, Guid companyId)
    {
        var company = await _context.Companies
            .Include(c => c.CompanyMembers)
            .FirstOrDefaultAsync(c => c.Id == companyId);

        if (company == null)
        {
            throw new InvalidOperationException("Company not found.");
        }

        if (company.CompanyAdminId != requestingUserId)
        {
            throw new UnauthorizedAccessException("Only the company admin can delete this company.");
        }

        if (company.CompanyMembers.Count > 0)
        {
            throw new InvalidOperationException("Cannot delete a company that still has members.");
        }

        _context.Companies.Remove(company);
        await _context.SaveChangesAsync();
    }

    public async Task<CompanyResponseDto> AddMemberToCompanyAsync(Guid requestingUserId, AddMemberToCompanyDto addMemberToCompanyDto)
    {
        var company = await _context.Companies
            .Include(c => c.CompanyMembers)
            .FirstOrDefaultAsync(c => c.Id == addMemberToCompanyDto.CompanyId);

        if (company == null)
        {
            throw new InvalidOperationException("Company not found.");
        }

        if (company.CompanyAdminId != requestingUserId)
        {
            throw new UnauthorizedAccessException("Only the company admin can add members to this company.");
        }

        var normalizedEmail = addMemberToCompanyDto.UserEmail.Trim().ToLower();
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);

        if (user == null)
        {
            var existingInvite = await _context.CompanyInvites
                .FirstOrDefaultAsync(i => i.CompanyId == company.Id && i.Email.ToLower() == normalizedEmail);

            if (existingInvite == null)
            {
                _context.CompanyInvites.Add(new CompanyInvite
                {
                    CompanyId = company.Id,
                    Email = normalizedEmail
                });
                await _context.SaveChangesAsync();
            }

            return MapToResponseDto(company);
        }

        if (user.CompanyId == company.Id)
        {
            throw new InvalidOperationException("User is already a member of this company.");
        }

        user.CompanyId = company.Id;
        await _context.SaveChangesAsync();

        return MapToResponseDto(company);
    }

    public async Task<CompanyResponseDto> RemoveMemberFromCompanyAsync(Guid requestingUserId, RemoveMemberFromCompanyDto removeMemberFromCompanyDto)
    {
        var company = await _context.Companies
            .Include(c => c.CompanyMembers)
            .FirstOrDefaultAsync(c => c.Id == removeMemberFromCompanyDto.CompanyId);

        if (company == null)
        {
            throw new InvalidOperationException("Company not found.");
        }

        if (company.CompanyAdminId != requestingUserId)
        {
            throw new UnauthorizedAccessException("Only the company admin can remove members from this company.");
        }

        var user = company.CompanyMembers.FirstOrDefault(u => u.Id == removeMemberFromCompanyDto.UserId);
        if (user == null)
        {
            throw new InvalidOperationException("User is not a member of this company.");
        }

        if (company.CompanyAdminId == user.Id)
        {
            throw new InvalidOperationException("Cannot remove the company admin. Assign a new admin first.");
        }

        company.CompanyMembers.Remove(user);
        await _context.SaveChangesAsync();

        return MapToResponseDto(company);
    }

    public async Task<PendingInviteDto?> GetPendingInviteAsync(string email)
    {
        var normalizedEmail = email.Trim().ToLower();
        var invite = await _context.CompanyInvites
            .Include(i => i.Company)
            .FirstOrDefaultAsync(i => i.Email.ToLower() == normalizedEmail);

        if (invite == null)
        {
            return null;
        }

        return new PendingInviteDto
        {
            CompanyId = invite.CompanyId,
            CompanyName = invite.Company.CompanyName
        };
    }

    private static CompanyResponseDto MapToResponseDto(Company company)
    {
        return new CompanyResponseDto
        {
            Id = company.Id,
            CompanyName = company.CompanyName,
            CompanyAdminId = company.CompanyAdminId ?? Guid.Empty,
            CompanyMembers = company.CompanyMembers.Select(u => new UserDto
            {
                Id = u.Id,
                Name = u.Name,
                Surname = u.Surname,
                Email = u.Email,
                Role = u.Role,
                CompanyId = u.CompanyId,
                CompanyName = company.CompanyName,
                IsActive = u.IsActive
            }).ToList(),
            CreatedDate = company.CreatedDate,
            UpdatedDate = company.UpdatedDate
        };
    }
}
