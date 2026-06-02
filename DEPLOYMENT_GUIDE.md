# Deployment Guide - Kavosh AI

This document contains all the configuration details needed to deploy this application to Cloudflare Workers/Pages and Render.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Environment Variables](#environment-variables)
3. [Cloudflare Deployment](#cloudflare-deployment)
4. [Render Deployment](#render-deployment)
5. [Troubleshooting](#troubleshooting)

---

## Project Overview

**Project Name:** Kavosh AI  
**Framework:** React + Vite + TypeScript  
**AI Provider:** Google Gemini API (@google/genai)  
**Build Output:** Static files in `dist/` folder

### Project Structure
```
/
├── components/          # React components
├── services/            # API services (geminiService.ts)
├── types/               # TypeScript type definitions
├── constants/           # App constants and prompts
├── public/              # Static assets
├── index.html           # Entry HTML file
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies and scripts
└── wrangler.toml        # Cloudflare Workers config (if using Workers)
```

---

## Environment Variables

### Required Variables

| Variable Name | Description | Where to Get It | Required For |
|---------------|-------------|-----------------|--------------|
| `API_KEY` | Google Gemini API Key | Google AI Studio (https://aistudio.google.com/apikey) | Server-side AI calls |
| `VITE_API_KEY` | Same Gemini API Key (for client) | Same as above | Client-side access |
| `GEMINI_API_KEY` | Alternative name for Gemini key | Same as above | Some configurations |
| `VITE_GEMINI_API_KEY` | Alternative client-side key | Same as above | Some configurations |
| `NODE_VERSION` | Node.js version to use | Set to `22` or `20` | Build process |

### Important Notes on Environment Variables

1. **API_KEY vs VITE_API_KEY**: 
   - Variables prefixed with `VITE_` are exposed to the client-side browser code
   - Non-prefixed variables are only available during build/server-side
   - For security, prefer using non-prefixed `API_KEY` for server-side operations

2. **Security Warning**: 
   - Never commit API keys to your repository
   - Always use environment variables/secrets in your deployment platform
   - The Gemini API key should have appropriate quotas set in Google Cloud Console

---

## Cloudflare Deployment

### Option A: Cloudflare Pages (Recommended for Static Sites)

#### Step 1: Connect Repository
1. Go to Cloudflare Dashboard > Workers & Pages
2. Click "Create application" > "Pages"
3. Connect your GitHub repository
4. Select the repository: `natal-hadson-treatment/natal-hadson-...-Empty-compassion-number-3yoitube-clubhouse-analysis`

#### Step 2: Build Settings

| Setting | Value | Description |
|---------|-------|-------------|
| **Framework preset** | Vite | Auto-detects Vite configuration |
| **Build command** | `npm run build` | Compiles TypeScript and bundles with Vite |
| **Build output directory** | `dist` | Where Vite outputs the built files |
| **Root directory** | `/` | Project root (leave as default) |
| **Node.js version** | `22` | Required for modern dependencies |

#### Step 3: Environment Variables (In Cloudflare Dashboard)

Add these in Settings > Environment Variables:

```
API_KEY=your_gemini_api_key_here
VITE_API_KEY=your_gemini_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
NODE_VERSION=22
```

**Important**: Mark all API keys as "Encrypted" for security.

#### Step 4: Deploy
- Click "Save and Deploy"
- Wait for build to complete (usually 30-60 seconds)
- Your site will be available at `your-project.pages.dev`

---

### Option B: Cloudflare Workers (For Server-Side Rendering)

#### wrangler.toml Configuration

Create or update `wrangler.toml` in your project root:

```toml
name = "kavosh-ai"
main = "dist/worker.js"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

[site]
bucket = "./dist"

[vars]
NODE_VERSION = "22"

# Don't put secrets here - use wrangler secret put
```

#### Deploy Commands

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Set secrets (don't commit these!)
wrangler secret put API_KEY
wrangler secret put GEMINI_API_KEY

# Deploy
wrangler deploy
```

---

## Render Deployment

### Step 1: Create New Web Service
1. Go to Render Dashboard (https://dashboard.render.com)
2. Click "New" > "Static Site" (for this React app)
3. Connect your GitHub repository

### Step 2: Build & Deploy Settings

| Setting | Value | Description |
|---------|-------|-------------|
| **Name** | `kavosh-ai` | Your service name |
| **Branch** | `main` | Branch to deploy from |
| **Build Command** | `npm install && npm run build` | Install deps and build |
| **Publish Directory** | `dist` | Vite output folder |
| **Node Version** | Set in Environment | Use NODE_VERSION env var |

### Step 3: Environment Variables (In Render Dashboard)

Add these in Environment > Environment Variables:

| Key | Value | Type |
|-----|-------|------|
| `NODE_VERSION` | `22` | Plain |
| `API_KEY` | `your_gemini_key` | Secret |
| `VITE_API_KEY` | `your_gemini_key` | Secret |
| `GEMINI_API_KEY` | `your_gemini_key` | Secret |
| `VITE_GEMINI_API_KEY` | `your_gemini_key` | Secret |

### Step 4: Deploy
- Click "Create Static Site"
- Render will automatically build and deploy
- Your site will be at `your-service.onrender.com`

### Render-Specific Settings

#### render.yaml (Optional - Infrastructure as Code)

Create `render.yaml` in your project root for automatic configuration:

```yaml
services:
  - type: web
    name: kavosh-ai
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    envVars:
      - key: NODE_VERSION
        value: "22"
      - key: API_KEY
        sync: false  # Must be set manually in dashboard
      - key: VITE_API_KEY
        sync: false
      - key: GEMINI_API_KEY
        sync: false
      - key: VITE_GEMINI_API_KEY
        sync: false
```

---

## Build Commands Reference

### package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `npm run dev` | Start development server | Local development |
| `npm run build` | Build for production | Deployment (runs TypeScript compiler + Vite) |
| `npm run preview` | Preview production build | Testing build locally |

---

## Troubleshooting

### Common Build Errors

#### Error: "Expected corresponding JSX closing tag"
- **Cause**: Unclosed JSX tags in React components
- **Solution**: Check the file mentioned in the error, ensure all tags are properly closed

#### Error: "Object is possibly 'undefined'"
- **Cause**: TypeScript strict null checking
- **Solution**: Add null checks or use optional chaining (`?.`)

#### Error: "'response.text' is possibly 'undefined'"
- **Cause**: Gemini SDK response.text can be undefined
- **Solution**: Use `response.text || ''` as fallback

### Environment Variable Issues

#### Variables not working in client code
- **Cause**: Variable not prefixed with `VITE_`
- **Solution**: Rename to `VITE_YOUR_VAR` for client-side access

#### API calls failing in production
- **Cause**: API key not set in deployment platform
- **Solution**: Double-check environment variables are set and encrypted

### Cloudflare-Specific Issues

#### Build fails with Node version error
- **Solution**: Add `NODE_VERSION=22` to environment variables

#### Site shows blank page
- **Cause**: Build output directory incorrect
- **Solution**: Ensure "Build output directory" is set to `dist`

### Render-Specific Issues

#### Build timeout
- **Cause**: Build taking too long
- **Solution**: Upgrade to paid plan or optimize build

#### Static files not serving
- **Cause**: Wrong publish directory
- **Solution**: Ensure "Publish Directory" is `dist`

---

## Quick Deployment Checklist

### Before Deploying
- [ ] All TypeScript errors fixed (`npm run build` succeeds locally)
- [ ] Environment variables documented
- [ ] API keys ready (not committed to repo)
- [ ] `.gitignore` includes `node_modules/`, `dist/`, `.env`

### Cloudflare Pages Setup
- [ ] Repository connected
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] NODE_VERSION: `22`
- [ ] All API keys added as encrypted variables

### Render Setup
- [ ] Repository connected
- [ ] Build command: `npm install && npm run build`
- [ ] Publish directory: `dist`
- [ ] NODE_VERSION: `22`
- [ ] All API keys added as secrets

---

## Getting Your Gemini API Key

1. Go to https://aistudio.google.com/apikey
2. Click "Create API Key"
3. Select or create a Google Cloud project
4. Copy the generated key
5. Add it to your deployment platform as `API_KEY` and `VITE_API_KEY`

**Important**: Set usage quotas in Google Cloud Console to prevent unexpected charges.

---

## Support

For issues with:
- **Cloudflare**: https://developers.cloudflare.com/pages/
- **Render**: https://render.com/docs
- **Vite**: https://vitejs.dev/guide/
- **Google Gemini**: https://ai.google.dev/docs

---

*Last Updated: December 2024*
