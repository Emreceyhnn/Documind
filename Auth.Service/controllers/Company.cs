using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Auth.Service.Models;
using Auth.Service.Services;

namespace Auth.Service.Controllers
{
    [Route("api/companies")]
    [Authorize]
    public class CompanyController : BaseApiController
    {
        private readonly ICompanyService _companyService;

        public CompanyController(ICompanyService companyService)
        {
            _companyService = companyService;
        }

        [HttpGet("invites/check")]
        [AllowAnonymous]
        public async Task<IActionResult> CheckPendingInviteAsync([FromQuery] string email)
        {
            var response = await _companyService.GetPendingInviteAsync(email);
            return Ok(new { success = true, message = "Invite check completed.", response });
        }

        [HttpPost]
        public async Task<IActionResult> CreateCompanyAsync([FromBody] AddCompanyDto data)
        {
            var response = await _companyService.CreateCompanyAsync(GetUserId(), data);
            return Ok(new { success = true, message = "Company created successfully.", response });
        }

        [HttpGet("{companyId:guid}")]
        public async Task<IActionResult> GetCompanyAsync(Guid companyId)
        {
            var response = await _companyService.GetCompanyAsync(GetUserId(), companyId);
            return Ok(new { success = true, message = "Company fetched successfully.", response });
        }

        [HttpPut("{companyId:guid}")]
        public async Task<IActionResult> UpdateCompanyAsync(Guid companyId, [FromBody] EditCompanyDto data)
        {
            var response = await _companyService.UpdateCompanyAsync(GetUserId(), companyId, data);
            return Ok(new { success = true, message = "Company updated successfully.", response });
        }

        [HttpDelete("{companyId:guid}")]
        public async Task<IActionResult> DeleteCompanyAsync(Guid companyId)
        {
            await _companyService.DeleteCompanyAsync(GetUserId(), companyId);
            return Ok(new { success = true, message = "Company deleted successfully." });
        }

        [HttpPost("members")]
        public async Task<IActionResult> AddMemberToCompanyAsync([FromBody] AddMemberToCompanyDto data)
        {
            var response = await _companyService.AddMemberToCompanyAsync(GetUserId(), data);
            return Ok(new { success = true, message = "Member added to company successfully.", response });
        }

        [HttpDelete("members")]
        public async Task<IActionResult> RemoveMemberFromCompanyAsync([FromBody] RemoveMemberFromCompanyDto data)
        {
            var response = await _companyService.RemoveMemberFromCompanyAsync(GetUserId(), data);
            return Ok(new { success = true, message = "Member removed from company successfully.", response });
        }
    }
}
