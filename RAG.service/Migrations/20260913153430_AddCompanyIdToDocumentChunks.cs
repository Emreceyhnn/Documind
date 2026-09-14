using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RAG.service.Migrations
{
    /// <inheritdoc />
    public partial class AddCompanyIdToDocumentChunks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "DocumentChunks",
                newName: "CompanyId");

            migrationBuilder.RenameIndex(
                name: "IX_DocumentChunks_UserId",
                table: "DocumentChunks",
                newName: "IX_DocumentChunks_CompanyId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CompanyId",
                table: "DocumentChunks",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_DocumentChunks_CompanyId",
                table: "DocumentChunks",
                newName: "IX_DocumentChunks_UserId");
        }
    }
}
