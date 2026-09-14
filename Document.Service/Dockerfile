# 1. Runtime Stage (Çalıştırma Ortamı)
FROM mcr.microsoft.com/dotnet/aspnet:10.0-alpine AS base
WORKDIR /app
EXPOSE 5025
ENV ASPNETCORE_URLS=http://+:5025

# 2. Build Stage (Derleme Ortamı)
FROM mcr.microsoft.com/dotnet/sdk:10.0-alpine AS build
# Grpc.Tools (protoc) Linux glibc gerektirdiği için Alpine ortamına gcompat ekliyoruz
RUN apk add --no-cache gcompat
WORKDIR /src

# Önce sadece .csproj dosyasını kopyalayıp restore ediyoruz
COPY ["Document.Service.csproj", "./"]
RUN dotnet restore "Document.Service.csproj"

# Kodları kopyalayıp derliyoruz
COPY . .
RUN dotnet build "Document.Service.csproj" -c Release -o /app/build

# 3. Publish Stage (Yayınlama Ortamı)
FROM build AS publish
RUN dotnet publish "Document.Service.csproj" -c Release -o /app/publish /p:UseAppHost=false

# 4. Final Stage (Üretim İmajı)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Document.Service.dll"]