# Vercel Blob Setup Guide

## Step 1: Get Your Vercel Blob Token

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (or create one)
3. Go to **Settings** → **Storage** → **Create Database**
4. Select **Blob** (or go directly to [Blob Storage](https://vercel.com/storage/blob))
5. Create a new Blob store
6. Copy the **`BLOB_READ_WRITE_TOKEN`** from the dashboard

## Step 2: Set Environment Variable

Create a `.env.local` file in the `portfolio/` directory:

```bash
BLOB_READ_WRITE_TOKEN=your_token_here
```

**Important:** Never commit this file! It's already in `.gitignore`

## Step 3: Upload Your Video

### Option A: Using the Upload Page (Recommended)
1. Start your dev server: `npm run dev`
2. Navigate to: `http://localhost:3045/upload` (or your port)
3. Select your MP4 file
4. The URL will be copied to your clipboard automatically

### Option B: Using the API Directly

```bash
curl -X POST http://localhost:3045/api/upload-video \
  -F "file=@/path/to/your/video.mp4"
```

## Step 4: Use the URL

Copy the returned URL and paste it into:
- `LandingPage.tsx` → `params.videoUrl`
- Or use it directly in your shader component

The URL will look like:
```
https://[your-blob-store].public.blob.vercel-storage.com/video.mp4
```

## Step 5: Deploy to Vercel

When deploying to Vercel:
1. Go to your project settings
2. Add the `BLOB_READ_WRITE_TOKEN` environment variable in **Settings** → **Environment Variables**
3. Deploy!

## Pricing

- **Free Tier**: 1 GB storage, 100 GB bandwidth/month
- **Pro**: $0.15/GB storage, $0.40/GB bandwidth
- Perfect for portfolio videos!

## Troubleshooting

- **"No token found"**: Make sure `.env.local` exists and has `BLOB_READ_WRITE_TOKEN`
- **CORS errors**: Vercel Blob URLs are CORS-enabled by default ✅
- **Upload fails**: Check file size (free tier has limits)


