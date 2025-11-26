# Sanity CMS Setup Guide for Video Hosting

## Why Sanity Assets?

✅ **Built-in media library** - Manage videos alongside your content  
✅ **CDN delivery** - Fast, optimized video delivery  
✅ **CORS-enabled** - Works perfectly with WebGL shaders  
✅ **Free tier**: 10GB storage, 100GB bandwidth/month  
✅ **Integrated CMS** - Videos managed in Sanity Studio  
✅ **GROQ queries** - Powerful querying for your content  

## Step 1: Create Sanity Project

1. Go to [sanity.io](https://www.sanity.io) and sign up/login
2. Click **"Create new project"**
3. Choose a project name (e.g., "SECTA Portfolio")
4. Choose a dataset name (default: "production")
5. Copy your **Project ID** (you'll need this)

## Step 2: Set Environment Variables

Create `.env.local` in the `portfolio/` directory:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
```

**Important:** Never commit this file! It's already in `.gitignore`

## Step 3: Initialize Sanity Studio (One-time setup)

Run this command to authenticate:

```bash
npm run studio
```

This will:
- Open Sanity Studio at `http://localhost:3333`
- Prompt you to authenticate with Sanity
- Create the necessary config files

## Step 4: Upload Your Video

### Option A: Via Sanity Studio (Recommended)

1. Run `npm run studio`
2. Navigate to `http://localhost:3333`
3. Click **"Hero Video"** in the sidebar
4. Click **"Create"** → **"Hero Video"**
5. Fill in:
   - **Title**: "Homepage Hero Video" (or any name)
   - **Video File**: Click to upload your MP4
   - **Thumbnail** (optional): Upload a thumbnail image
6. Click **"Publish"**

### Option B: Via API (Programmatic)

The video will be stored in Sanity and accessible via GROQ queries.

## Step 5: Use the Video in Your App

### Option 1: Query from Sanity (Recommended for CMS integration)

```typescript
import { getHeroVideo } from '@/lib/sanity'

// In a Server Component or API route
const heroVideo = await getHeroVideo()
const videoUrl = heroVideo?.videoUrl // Direct CDN URL
```

### Option 2: Use Direct URL (Quick test)

Once uploaded, you can get the URL from Sanity Studio:
1. Open your Hero Video document
2. Click on the video file
3. Copy the **URL** from the asset details
4. Use it directly in your `videoUrl` config

The URL will look like:
```
https://cdn.sanity.io/files/[project-id]/[dataset]/[file-id].mp4
```

## Step 6: Update Your Components

The `ShaderVideoBackground` component already supports direct URLs, so Sanity CDN URLs will work immediately!

For full CMS integration, update `LandingPage.tsx` to fetch from Sanity:

```typescript
import { getHeroVideo } from '@/lib/sanity'

// In your component or page
const heroVideo = await getHeroVideo()
const videoUrl = heroVideo?.videoUrl || '/fallback-video.mp4'
```

## Step 7: Deploy

When deploying to Vercel:
1. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
2. Deploy!

## Sanity Studio Access

- **Local**: `npm run studio` → `http://localhost:3333`
- **Production**: Add `/studio` route to your deployed site (already configured!)

## Video Format Recommendations

- **Codec**: H.264 (MP4)
- **Resolution**: 1920x1080 or higher
- **Bitrate**: 5-10 Mbps for quality
- **File size**: Keep under 50MB for faster loading

## Pricing

- **Free Tier**: 10GB storage, 100GB bandwidth/month
- **Team**: $99/month (unlimited storage, 1TB bandwidth)
- Perfect for portfolio videos!

## Troubleshooting

- **"Project ID not found"**: Check `.env.local` has `NEXT_PUBLIC_SANITY_PROJECT_ID`
- **Studio won't start**: Run `npm run studio` and authenticate
- **CORS errors**: Sanity CDN URLs are CORS-enabled by default ✅
- **Video won't play**: Check file format (MP4/H.264 recommended)

## Migration from Vercel Blob

If you already have videos in Vercel Blob:
1. Download them locally
2. Upload to Sanity Studio
3. Update your `videoUrl` references
4. Done! 🎉



