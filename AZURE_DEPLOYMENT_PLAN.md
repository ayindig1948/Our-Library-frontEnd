# Azure Static Web Apps + Functions Deployment Plan - LibaryDemo

**Document Version:** 2.0  
**Last Updated:** 2026-06-14  
**Application:** LibaryDemo (React + Vite + C# Backend)  
**Deployment Target:** Azure Static Web Apps + Azure Functions

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Phase 1: Frontend Setup (SWA)](#phase-1-frontend-setup-swa)
5. [Phase 2: Backend Setup (Functions)](#phase-2-backend-setup-functions)
6. [Configuration Files](#configuration-files)
7. [Environment Variables](#environment-variables)
8. [Deployment Methods](#deployment-methods)
9. [Post-Deployment](#post-deployment)
10. [Troubleshooting](#troubleshooting)
11. [Cost Estimation](#cost-estimation)

---

## Overview

### Why SWA + Azure Functions?

- ✅ **Ultra-Low Cost:** ~$0-5/month vs $20/month with App Service
- ✅ **Zero Maintenance:** Fully managed services
- ✅ **Auto Scaling:** Handles traffic spikes automatically
- ✅ **Built-in CORS:** No manual configuration needed
- ✅ **GitHub Integration:** Automatic deployments on push
- ✅ **Quick Cold Start:** Functions warm up fast
- ✅ **Easy C# Backend:** Azure Functions natively support C#

### Technology Stack

- **Frontend:** React 19 + Vite (Static Web Apps)
- **Backend:** C# Azure Functions
- **Styling:** Tailwind CSS
- **Authentication:** Auth0
- **Routing:** React Router v7
- **Database:** Azure SQL / Cosmos DB (optional)

---

## Prerequisites

### Local Development

- [ ] Node.js 18.x or 20.x LTS
- [ ] npm (comes with Node.js)
- [ ] .NET 8 SDK (for local C# development/testing)
- [ ] Visual Studio Code
- [ ] Git installed and configured
- [ ] Azure CLI: `az` command available

### Azure Requirements

- [ ] Azure subscription (Free tier works)
- [ ] Azure CLI installed: `choco install azure-cli`
- [ ] Logged in to Azure: `az login`
- [ ] GitHub account with repository access

### Accounts & Credentials

- [ ] Auth0 Domain
- [ ] Auth0 Client ID
- [ ] GitHub Personal Access Token (for SWA integration)
- [ ] C# backend code ready

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│           Client Browser / Mobile                           │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS
        ┌────────────▼──────────────┐
        │  Azure Static Web Apps    │
        │  (React Vite Frontend)    │
        │                           │
        │ - index.html              │
        │ - JS/CSS Bundles          │
        │ - React Router SPA        │
        └────────────┬──────────────┘
                     │ API Calls (/api/...)
        ┌────────────▼──────────────┐
        │  Azure Functions          │
        │  (C# Backend APIs)        │
        │                           │
        │ - GetBooks()              │
        │ - AddBook()               │
        │ - UpdateBook()            │
        │ - DeleteBook()            │
        └────────────┬──────────────┘
                     │
        ┌────────────▼──────────────┐
        │    Azure SQL Database     │
        │    (Optional)             │
        └───────────────────────────┘
```

---

## Phase 1: Frontend Setup (SWA)

### Step 1.1: Create Static Web App Resource

```powershell
# Create resource group
az group create `
  --name "librarydemo-rg" `
  --location "eastus"

# Create Static Web App
az staticwebapp create `
  --name "librarydemo-swa" `
  --resource-group "librarydemo-rg" `
  --source https://github.com/YOUR_USERNAME/LibaryDemo `
  --branch main `
  --app-location "src" `
  --output-location "dist" `
  --token YOUR_GITHUB_TOKEN
```

### Step 1.2: Configure Build Settings

The SWA will auto-detect Vite, but you can create `staticwebapp.config.json`:

```json
{
  "auth": {
    "identityProviders": {
      "customOpenIdConnectProviders": {}
    }
  },
  "globalHeaders": {
    "content-security-policy": "default-src 'self' https://YOUR_AUTH0_DOMAIN"
  },
  "navigationFallback": {
    "rewriteRules": [
      {
        "source": "/*",
        "destination": "/index.html"
      }
    ]
  },
  "miseFeatures": {
    "enforcedRoutePrefix": "/api"
  }
}
```

### Step 1.3: Set Environment Variables in SWA

```powershell
az staticwebapp appsettings set `
  --name "librarydemo-swa" `
  --resource-group "librarydemo-rg" `
  --setting-names VITE_AUTH0_DOMAIN VITE_AUTH0_CLIENT_ID VITE_API_URL `
  --values "your-domain.auth0.com" "your-client-id" "https://librarydemo-api.azurewebsites.net"
```

### Step 1.4: GitHub Actions (Auto-Generated)

SWA automatically creates `.github/workflows/azure-static-web-apps-*.yml`

No additional setup needed! Just push to main branch and it deploys automatically.

---

## Phase 2: Backend Setup (Functions)

### Step 2.1: Create Azure Function App

```powershell
# Create Storage Account (required for Functions)
az storage account create `
  --name "librarydemostore" `
  --resource-group "librarydemo-rg" `
  --location "eastus"

# Create Function App
az functionapp create `
  --resource-group "librarydemo-rg" `
  --consumption-plan-location "eastus" `
  --runtime "dotnet-isolated" `
  --runtime-version "8.0" `
  --functions-version 4 `
  --name "librarydemo-api" `
  --storage-account "librarydemostore"
```

### Step 2.2: Create Local Function Project Structure

```powershell
# Create functions directory in project
mkdir api
cd api

# Create C# function project
func init --dotnet-version 8.0 --worker-runtime dotnet-isolated --model V4
```

### Step 2.3: Create HTTP Trigger Functions

Create function for getting books:

```bash
func new --name GetBooks --template "HTTP trigger"
func new --name AddBook --template "HTTP trigger"
func new --name UpdateBook --template "HTTP trigger"
func new --name DeleteBook --template "HTTP trigger"
```

### Step 2.4: Implement C# Functions

**GetBooks Function (api/GetBooks/GetBooks.cs):**

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;

namespace LibraryDemo.Api
{
    public class GetBooks
    {
        private readonly ILogger<GetBooks> _logger;

        public GetBooks(ILogger<GetBooks> logger)
        {
            _logger = logger;
        }

        [Function("GetBooks")]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "books")] HttpRequestData req)
        {
            _logger.LogInformation("Getting books list");

            // TODO: Get books from database
            var books = new[]
            {
                new { id = 1, title = "The Great Gatsby", author = "F. Scott Fitzgerald" },
                new { id = 2, title = "To Kill a Mockingbird", author = "Harper Lee" }
            };

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(books);
            return response;
        }
    }
}
```

**AddBook Function (api/AddBook/AddBook.cs):**

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;

namespace LibraryDemo.Api
{
    public class AddBook
    {
        private readonly ILogger<AddBook> _logger;

        public AddBook(ILogger<AddBook> logger)
        {
            _logger = logger;
        }

        [Function("AddBook")]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "books")] HttpRequestData req)
        {
            _logger.LogInformation("Adding new book");

            try
            {
                var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                var book = JsonSerializer.Deserialize<dynamic>(requestBody);

                // TODO: Save to database
                // TODO: Add validation

                var response = req.CreateResponse(HttpStatusCode.Created);
                await response.WriteAsJsonAsync(new { id = 3, ...book });
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error adding book: {ex.Message}");
                var errorResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                await errorResponse.WriteAsJsonAsync(new { error = ex.Message });
                return errorResponse;
            }
        }
    }
}
```

### Step 2.5: Configure CORS for SWA

**local.settings.json:**

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated"
  },
  "Host": {
    "CORS": {
      "AllowedOrigins": [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://librarydemo-swa.azurestaticapps.net"
      ]
    }
  }
}
```

### Step 2.6: Setup Function App Settings

```powershell
az functionapp config appsettings set `
  --name "librarydemo-api" `
  --resource-group "librarydemo-rg" `
  --settings `
    "VITE_AUTH0_DOMAIN=your-domain.auth0.com" `
    "VITE_AUTH0_CLIENT_ID=your-client-id" `
    "DATABASE_CONNECTION=your-connection-string"
```

---

## Configuration Files

### Root: `staticwebapp.config.json`

```json
{
  "routes": [
    {
      "route": "/api/*",
      "rewrite": "/.auth/me"
    },
    {
      "route": "/*",
      "serve": "/index.html",
      "statusCode": 200
    }
  ],
  "navigationFallback": {
    "rewriteRules": [
      {
        "source": "/*",
        "destination": "/index.html"
      }
    ]
  },
  "auth": {
    "identityProviders": {
      "customOpenIdConnectProviders": {}
    }
  },
  "responseOverrides": {
    "404": {
      "rewrite": "/index.html"
    }
  }
}
```

### Frontend: `api-config.js`

Create in `src/api-config.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? 'http://localhost:7071' : 'https://librarydemo-api.azurewebsites.net');

export const API_ENDPOINTS = {
  BOOKS: `${API_BASE_URL}/api/books`,
  ADD_BOOK: `${API_BASE_URL}/api/books`,
  UPDATE_BOOK: (id) => `${API_BASE_URL}/api/books/${id}`,
  DELETE_BOOK: (id) => `${API_BASE_URL}/api/books/${id}`
};

export default API_BASE_URL;
```

### Update `src/api.js` to Use Functions

```javascript
import API_BASE_URL from './api-config.js';

// Get all books
export const getBooks = async () => {
  const response = await fetch(`${API_BASE_URL}/api/books`);
  if (!response.ok) throw new Error('Failed to fetch books');
  return response.json();
};

// Add book
export const addBook = async (book) => {
  const response = await fetch(`${API_BASE_URL}/api/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book)
  });
  if (!response.ok) throw new Error('Failed to add book');
  return response.json();
};

// Update book
export const updateBook = async (id, book) => {
  const response = await fetch(`${API_BASE_URL}/api/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book)
  });
  if (!response.ok) throw new Error('Failed to update book');
  return response.json();
};

// Delete book
export const deleteBook = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/books/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete book');
  return response.json();
};
```

---

## Environment Variables

### Frontend (.env.local & SWA Settings)

```env
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_API_URL=https://librarydemo-api.azurewebsites.net
```

### Backend (Function App Settings)

```
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
DATABASE_CONNECTION_STRING=your-db-connection
ASPNETCORE_ENVIRONMENT=Production
```

### Auth0 Configuration

**Allowed Callback URLs:**
```
http://localhost:3000
http://localhost:5173
https://librarydemo-swa.azurestaticapps.net
```

**Allowed Logout URLs:**
```
http://localhost:3000
http://localhost:5173
https://librarydemo-swa.azurestaticapps.net
```

**Allowed Web Origins:**
```
http://localhost:3000
http://localhost:5173
https://librarydemo-swa.azurestaticapps.net
```

---

## Deployment Methods

### Method 1: GitHub Actions (Recommended - Fully Automatic)

SWA automatically creates workflow. Push code and it deploys:

```powershell
# Frontend + Backend deployment (both in same repo)
git add .
git commit -m "Deploy to Azure SWA + Functions"
git push origin main

# Both frontend and backend deploy automatically!
```

**Project Structure:**
```
LibaryDemo/
├── src/                    # React frontend
├── api/                    # C# Functions
├── package.json
├── vite.config.js
└── staticwebapp.config.json
```

### Method 2: Manual Azure CLI Deployment

**Frontend:**
```powershell
# Build React app
npm run build

# Deploy to SWA
az staticwebapp enterprise edge deploy `
  --name "librarydemo-swa" `
  --resource-group "librarydemo-rg" `
  --folder "dist"
```

**Backend:**
```powershell
# Go to api folder
cd api

# Publish Functions
func azure functionapp publish librarydemo-api
```

### Method 3: VS Code Azure Tools

1. Install Azure Tools extension in VS Code
2. Right-click project → Deploy to Static Web App
3. Right-click Functions → Deploy to Function App

---

## Post-Deployment

### Step 1: Verify Deployment

```powershell
# Get SWA URL
az staticwebapp show `
  --name "librarydemo-swa" `
  --resource-group "librarydemo-rg" `
  --query "defaultHostname"

# Get Functions URL
az functionapp show `
  --resource-group "librarydemo-rg" `
  --name "librarydemo-api" `
  --query "defaultHostName"
```

### Step 2: Test API Connection

```powershell
# Test function endpoint
curl https://librarydemo-api.azurewebsites.net/api/books
```

### Step 3: Monitor & Logs

```powershell
# View Function logs
az webapp log tail `
  --resource-group "librarydemo-rg" `
  --name "librarydemo-api"

# View SWA logs
az staticwebapp show `
  --name "librarydemo-swa" `
  --resource-group "librarydemo-rg"
```

### Step 4: Setup Application Insights (Optional)

```powershell
# Create Insights
az monitor app-insights component create `
  --app "librarydemo-insights" `
  --location "eastus" `
  --resource-group "librarydemo-rg" `
  --query "instrumentationKey"

# Link to Function App
az functionapp config appsettings set `
  --name "librarydemo-api" `
  --resource-group "librarydemo-rg" `
  --settings "APPINSIGHTS_INSTRUMENTATIONKEY=your-key"
```

### Step 5: Setup Database (Optional)

```powershell
# Create SQL Server
az sql server create `
  --name "librarydemo-db" `
  --resource-group "librarydemo-rg" `
  --admin-user "adminuser" `
  --admin-password "SecurePass123!"

# Create Database
az sql db create `
  --resource-group "librarydemo-rg" `
  --server "librarydemo-db" `
  --name "librarydb"
```

---

## Troubleshooting

### Issue: Functions return 404

**Solution:** Check route matches function name
```csharp
[HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "books")] 
// Will be: /api/books
```

### Issue: CORS errors in browser

**Solution:** CORS is auto-handled by SWA for `/api/*` routes

Check `staticwebapp.config.json` has:
```json
{
  "routes": [
    {
      "route": "/api/*",
      "rewrite": "/.auth/me"
    }
  ]
}
```

### Issue: Environment variables not working

**Solution:** Rebuild frontend to inject env vars

```powershell
# Rebuild with env vars
npm run build

# Or redeploy
git push origin main
```

### Issue: Cold start delay on Functions

**Solution:** This is normal (~2-3 seconds first call)
- Premium plan eliminates cold starts (~$75/month)
- Usually acceptable for most apps

### Issue: "Function app appears to be down" error

```powershell
# Check function status
az functionapp show `
  --name "librarydemo-api" `
  --resource-group "librarydemo-rg" `
  --query "state"

# Restart if needed
az functionapp restart `
  --name "librarydemo-api" `
  --resource-group "librarydemo-rg"
```

### Issue: Database connection failing

```powershell
# Check connection string in settings
az functionapp config appsettings list `
  --name "librarydemo-api" `
  --resource-group "librarydemo-rg"
```

---

## Cost Estimation

### Monthly Breakdown

| Service | Tier | Cost |
|---------|------|------|
| **Static Web Apps** | Free | $0 |
| **Azure Functions** | Consumption (1M executions) | $0.20 |
| **Storage Account** | Standard | $0.024/GB (~$1-2) |
| **Azure SQL** | Basic (optional) | $5-15 |
| **Application Insights** | Free (1 GB/month) | $0 |
| **Total** | | **~$0-20/month** |

### Cost Comparison

| Architecture | Monthly |
|-------------|---------|
| 2x App Service (B1) | ~$20 |
| **SWA + Functions** | **~$0-5** |
| **Savings** | **$15-20/month** |

### Scaling Scenarios

- **1,000 books, 100 users/day:** Free tier (~$0)
- **10,000 books, 1,000 users/day:** ~$1-2/month
- **High traffic:** Premium plan if needed (~$75/month)

---

## Deployment Checklist

### Before Deployment

- [ ] Node.js 18+ installed
- [ ] .NET 8 SDK installed
- [ ] React app builds: `npm run build`
- [ ] C# Functions compile locally: `dotnet build`
- [ ] Functions run locally: `func start`
- [ ] Auth0 configured
- [ ] GitHub repository created with main branch
- [ ] GitHub Personal Access Token created

### During Deployment

- [ ] Create resource group
- [ ] Create Storage Account
- [ ] Create Static Web App (connected to GitHub)
- [ ] Create Function App
- [ ] Create C# function project in `/api`
- [ ] Create HTTP trigger functions
- [ ] Set environment variables
- [ ] Push to GitHub (triggers auto-deploy)

### After Deployment

- [ ] Access SWA URL in browser
- [ ] Test login/authentication
- [ ] Call `/api/books` endpoint
- [ ] Test add/update/delete operations
- [ ] Check logs for errors
- [ ] Set up Application Insights
- [ ] Configure custom domain (optional)
- [ ] Set up database if needed

---

## Quick Reference Commands

```powershell
# Setup
az login
az group create --name "librarydemo-rg" --location "eastus"
az storage account create --name "librarydemostore" --resource-group "librarydemo-rg" --location "eastus"

# Static Web App
az staticwebapp create --name "librarydemo-swa" --resource-group "librarydemo-rg" `
  --source https://github.com/USERNAME/LibaryDemo --branch main `
  --app-location "src" --output-location "dist" --token YOUR_GITHUB_TOKEN

# Function App
az functionapp create --resource-group "librarydemo-rg" `
  --consumption-plan-location "eastus" --runtime "dotnet-isolated" `
  --runtime-version "8.0" --functions-version 4 `
  --name "librarydemo-api" --storage-account "librarydemostore"

# Set Variables
az staticwebapp appsettings set --name "librarydemo-swa" --resource-group "librarydemo-rg" `
  --setting-names VITE_API_URL --values "https://librarydemo-api.azurewebsites.net"

# Deploy
git push origin main  # Auto-deploys both frontend and backend

# View Logs
az webapp log tail --resource-group "librarydemo-rg" --name "librarydemo-api"

# Cleanup
az group delete --name "librarydemo-rg" --yes
```

---

## Resources

- **Azure Static Web Apps:** https://docs.microsoft.com/en-us/azure/static-web-apps/
- **Azure Functions C#:** https://docs.microsoft.com/en-us/azure/azure-functions/functions-dotnet-class-library
- **SWA + Functions:** https://docs.microsoft.com/en-us/azure/static-web-apps/apis-overview
- **Vite Deployment:** https://vitejs.dev/guide/build.html
- **Auth0 Docs:** https://auth0.com/docs
- **Azure Pricing Calculator:** https://azure.microsoft.com/en-us/pricing/calculator/

---

## Architecture Comparison Summary

### Static Web Apps + Functions ✅ **RECOMMENDED**

```
✅ Cost: $0-5/month
✅ Auto-scaling: Yes
✅ GitHub CI/CD: Built-in
✅ CORS: Auto-handled
✅ Setup: Easy
⚠️ Cold start: 2-3 sec (first call)
```

### vs App Service (Both)

```
❌ Cost: $20+/month
✅ No cold start
❌ Complex setup
❌ Manual scaling
❌ CORS manual config
```

---

**Document End**

*Last Updated: 2026-06-14*  
*Status: Ready for deployment with SWA + Functions*  
*Recommended: Use this architecture for optimal cost/performance*
