using System;
using System.Security.Claims;
using Auth.Service.Controllers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace Auth.Service.Test.Controller
{
    public class BaseApiControllerTest
    {
        // BaseApiController abstract bir sınıf olduğu ve GetUserId protected olduğu için test amaçlı kalıtım alan concrete bir test sınıfı oluşturuyoruz.
        private class TestableBaseApiController : BaseApiController
        {
            public Guid PublicGetUserId() => GetUserId();
        }

        private static TestableBaseApiController CreateControllerWithClaims(params Claim[] claims)
        {
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            var httpContext = new DefaultHttpContext
            {
                User = claimsPrincipal
            };

            return new TestableBaseApiController
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = httpContext
                }
            };
        }

        [Fact]
        public void GetUserId_WithValidNameIdentifierClaim_ReturnsUserId()
        {
            // Arrange
            var expectedUserId = Guid.NewGuid();
            var controller = CreateControllerWithClaims(
                new Claim(ClaimTypes.NameIdentifier, expectedUserId.ToString())
            );

            // Act
            var actualUserId = controller.PublicGetUserId();

            // Assert
            Assert.Equal(expectedUserId, actualUserId);
        }

        [Fact]
        public void GetUserId_WithValidSubClaim_ReturnsUserId()
        {
            // Arrange
            var expectedUserId = Guid.NewGuid();
            var controller = CreateControllerWithClaims(
                new Claim("sub", expectedUserId.ToString())
            );

            // Act
            var actualUserId = controller.PublicGetUserId();

            // Assert
            Assert.Equal(expectedUserId, actualUserId);
        }

        [Fact]
        public void GetUserId_WithNoUserClaims_ThrowsUnauthorizedAccessException()
        {
            // Arrange
            var controller = CreateControllerWithClaims();

            // Act & Assert
            var exception = Assert.Throws<UnauthorizedAccessException>(() => controller.PublicGetUserId());
            Assert.Equal("Invalid user token.", exception.Message);
        }

        [Fact]
        public void GetUserId_WithInvalidGuidClaim_ThrowsUnauthorizedAccessException()
        {
            // Arrange
            var controller = CreateControllerWithClaims(
                new Claim(ClaimTypes.NameIdentifier, "invalid-guid-string")
            );

            // Act & Assert
            var exception = Assert.Throws<UnauthorizedAccessException>(() => controller.PublicGetUserId());
            Assert.Equal("Invalid user token.", exception.Message);
        }
    }
}
