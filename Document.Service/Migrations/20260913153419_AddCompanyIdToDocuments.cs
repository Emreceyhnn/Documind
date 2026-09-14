using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Document.Service.Migrations
{
    /// <inheritdoc />
    public partial class AddCompanyIdToDocuments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Documents_UserId_Status",
                table: "Documents");

            migrationBuilder.AddColumn<Guid>(
                name: "CompanyId",
                table: "Documents",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Documents_CompanyId_Status",
                table: "Documents",
                columns: new[] { "CompanyId", "Status" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Documents_CompanyId_Status",
                table: "Documents");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "Documents");

            migrationBuilder.CreateIndex(
                name: "IX_Documents_UserId_Status",
                table: "Documents",
                columns: new[] { "UserId", "Status" });
        }
    }
}
