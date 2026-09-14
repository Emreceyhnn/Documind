using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Auth.Service.Models;
using Auth.Service.Services;

namespace Auth.Service.Controllers
{
    [Route("api/users")]
    public class UserController : BaseApiController
    {
        private readonly IUserService _userService;


        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [EnableRateLimiting("auth")]
        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync([FromBody] RegisterDto data)
        {
            var response = await _userService.RegisterAsync(data);
            return Ok(new { success = true, message = "User registered successfully.", response });
        }

        [EnableRateLimiting("auth")]
        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync([FromBody] LoginDto data)
        {
            var response = await _userService.LoginAsync(data);
            return Ok(new { success = true, message = "User logged in successfully.", response });
        }

        [EnableRateLimiting("auth")]
        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshTokenAsync([FromBody] RefreshTokenDto data)
        {
            var response = await _userService.RefreshTokenAsync(data.RefreshToken);
            return Ok(new { success = true, message = "Token refreshed successfully.", response });
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUserAsync()
        {
            var response = await _userService.GetCurrentUserAsync(GetUserId());
            return Ok(new { success = true, message = "User fetched successfully.", response });
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> LogOutAsync([FromBody] LogoutDto data)
        {
            await _userService.LogOutAsync(GetUserId(), data.RefreshToken);
            return Ok(new { success = true, message = "User logged out successfully." });
        }

        [Authorize]
        [HttpPut("me")]
        public async Task<IActionResult> UpdateUserAsync([FromBody] UpdateUserDto data)
        {
            var response = await _userService.UpdateUserAsync(GetUserId(), data);
            return Ok(new { success = true, message = "User updated successfully.", response });
        }

        [Authorize]
        [HttpDelete("me")]
        public async Task<IActionResult> DeleteUserAsync()
        {
            await _userService.DeleteUserAsync(GetUserId());
            return Ok(new { success = true, message = "User deleted successfully." });
        }
    }
}