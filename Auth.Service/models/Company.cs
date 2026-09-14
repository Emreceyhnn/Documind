using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Auth.Service.Models;

public class Company{
    public Guid Id {get;set;} = Guid.NewGuid();
    [MaxLength(50)]
    public string CompanyName {get;set;} = string.Empty;
    public Guid? CompanyAdminId {get;set;}
    public User? CompanyAdmin {get;set;}
    public ICollection<User> CompanyMembers {get;set;} = new List<User>();
    public ICollection<CompanyInvite> Invites {get;set;} = new List<CompanyInvite>();
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;
}

public class CompanyInvite {
    public Guid Id {get;set;} = Guid.NewGuid();
    public Guid CompanyId {get;set;}
    public Company? Company {get;set;}
    [MaxLength(50)]
    public string Email {get;set;} = string.Empty;
    public DateTime CreatedDate {get;set;} = DateTime.UtcNow;
}

public class AddCompanyDto{
    [Required(ErrorMessage = "Company name is required.")]
    [MaxLength(50)]
    public string CompanyName {get;set;} = string.Empty;
}

public class EditCompanyDto{
    [Required(ErrorMessage = "Company name is required.")]
    [MaxLength(50)]
    public string CompanyName {get;set;} = string.Empty;
    [Required(ErrorMessage = "Company admin is required.")]
    public Guid CompanyAdminId {get;set;}
}

public class AddMemberToCompanyDto{
    [Required(ErrorMessage = "Company ID is required.")]
    public Guid CompanyId {get;set;}    
    [Required(ErrorMessage = "User email is required.")]
    public string UserEmail {get;set;} = string.Empty;
}

public class RemoveMemberFromCompanyDto{
    [Required(ErrorMessage = "Company ID is required.")]
    public Guid CompanyId {get;set;}    
    [Required(ErrorMessage = "User ID is required.")]
    public Guid UserId {get;set;} 
}

public class CompanyResponseDto{
    public Guid Id {get;set;}
    public string CompanyName {get;set;} = string.Empty;
    public Guid CompanyAdminId {get;set;}
    public ICollection<UserDto> CompanyMembers {get;set;} = new List<UserDto>();
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;
}

public class PendingInviteDto{
    public Guid CompanyId {get;set;}
    public string CompanyName {get;set;} = string.Empty;
}

public class CompanyMemberResponseDto{
    public Guid Id {get;set;}
    public string Name {get;set;} = string.Empty;
    public string Surname {get;set;} = string.Empty;
    public string Email {get;set;} = string.Empty;
    public string Role {get;set;} = string.Empty;
    public bool IsActive {get;set;}
}
