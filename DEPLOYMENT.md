# Cloudflare Pages Deployment Guide

This project is configured for deployment on Cloudflare Pages.

## Deployment Configuration

### Build Settings
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Node version**: 18 or higher

### Environment Variables
You need to set the following environment variables in your Cloudflare Pages project settings:

1. `VITE_SUPABASE_URL` - Your Supabase project URL
2. `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Deploying to Cloudflare Pages

### Option 1: Via Cloudflare Dashboard (Recommended)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**
3. Connect your GitHub/GitLab repository
4. Configure build settings:
   - **Production branch**: `main`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/frontend` (if in monorepo)
5. Add environment variables in the settings
6. Click **Save and Deploy**

### Option 2: Via Wrangler CLI

```bash
# Install Wrangler globally
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
wrangler pages deploy dist --project-name=noah-main-frontend
```

## Local Build Testing

To test the production build locally:

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Preview the build
npm run preview
```

## Features Configured

✅ SPA routing with client-side fallback  
✅ Security headers (X-Frame-Options, X-Content-Type-Options, etc.)  
✅ Asset caching optimization  
✅ TypeScript build optimization  
✅ Code splitting for React vendors  
✅ Node.js version specification  

## Troubleshooting

### Build Fails with TypeScript Errors
- Ensure Node.js 18+ is installed
- Run `npm install` to ensure all dependencies are up to date
- Check that all imported modules exist

### Environment Variables Not Working
- Ensure variables are prefixed with `VITE_`
- Variables must be set in Cloudflare Pages dashboard
- Rebuild after adding/changing environment variables

### 404 Errors on Page Refresh
- The `public/_redirects` file should handle this
- Ensure it's included in the build output
- Verify the file contains: `/* /index.html 200`

### Routing Issues
- Check that BrowserRouter is being used (not HashRouter)
- Verify all routes are properly defined in App.tsx
- Test locally with `npm run preview` after building
