# 1. Runtime Stage (Çalıştırma Ortamı)
FROM mcr.microsoft.com/dotnet/aspnet:10.0-alpine AS base
WORKDIR /app
EXPOSE 5083
ENV ASPNETCORE_URLS=http://+:5083

# 2. Build Stage (Derleme Ortamı)
FROM mcr.microsoft.com/dotnet/sdk:10.0-alpine AS build
WORKDIR /src

# Önce sadece .csproj dosyasını kopyalayıp paketleri restore ediyoruz (Docker cache avantajı için)
COPY ["Auth.Service.csproj", "./"]
RUN dotnet restore "Auth.Service.csproj"

# Tüm proje dosyalarını kopyalayıp derliyoruz
COPY . .
RUN dotnet build "Auth.Service.csproj" -c Release -o /app/build

# 3. Publish Stage (Yayınlama Ortamı)
FROM build AS publish
RUN dotnet publish "Auth.Service.csproj" -c Release -o /app/publish /p:UseAppHost=false

# 4. Final Stage (Üretim İmajı)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Auth.Service.dll"]
