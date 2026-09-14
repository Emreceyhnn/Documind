using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace Auth.Service.Controllers
{
    [ApiController]
    public abstract class BaseApiController : ControllerBase
    {
        protected Guid GetUserId()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? User.FindFirstValue("sub");
            if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
            {
                throw new UnauthorizedAccessException("Invalid user token.");
            }
            return userId;
        }
    }
}
