using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using SmartHelpAI.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var dataDirectory = Path.Combine(builder.Environment.ContentRootPath, "..", "data");
    await DbSeeder.SeedAsync(db, dataDirectory);
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
