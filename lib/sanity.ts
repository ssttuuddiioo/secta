import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'b57ph2jj',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-11-20',
  useCdn: true, // Set to false if statically generating pages, using ISR or using tag-based revalidation
})

// Helper to get video URL from Sanity asset reference
// Accepts either a string URL or a Sanity file reference object
export function getVideoUrl(
  videoAsset: 
    | { _type: 'file'; asset: { _ref: string; _type: 'reference' }; url?: string }
    | { url: string }
    | string 
    | null 
    | undefined
): string | null {
  if (!videoAsset) return null
  
  // If it's already a URL string, return it
  if (typeof videoAsset === 'string') return videoAsset
  
  // If it has a direct url property (from expanded query)
  if ('url' in videoAsset && videoAsset.url) return videoAsset.url
  
  // If it's a Sanity file reference, we need to query for the URL
  // For now, return null - caller should use getVideoAssetWithUrl instead
  return null
}

// Query helper to get video asset with URL expanded
export async function getVideoAssetWithUrl(videoRef: string) {
  const query = `*[_type == "sanity.fileAsset" && _id == $id][0]{
    _id,
    url,
    originalFilename,
    size,
    mimeType
  }`
  return await client.fetch(query, { id: videoRef })
}

// Query helper to get hero video with expanded asset URL
export async function getHeroVideo() {
  const query = `*[_type == "heroVideo"][0]{
    _id,
    title,
    description,
    "videoUrl": video.asset->url,
    "thumbnailUrl": thumbnail.asset->url
  }`
  return await client.fetch(query)
}

// Query helper to get all motion videos with expanded asset URLs
export async function getMotionVideos() {
  const query = `*[_type == "motionVideo"] | order(order asc){
    _id,
    title,
    category,
    year,
    client,
    role,
    briefDescription,
    showProjectLinks,
    projectLinks,
    showChallengeSolution,
    challengeSolution,
    "videoUrl": video.asset->url,
    "thumbnailUrl": thumbnail.asset->url,
    showProjectImages,
    "projectImages": projectImages[]{
      "url": image.asset->url,
      description
    },
    showCredits,
    credits,
    showBehindTheScenes,
    "behindTheScenes": behindTheScenes[]{
      "url": image.asset->url,
      description
    },
    showResultsImpact,
    resultsImpact,
    categoryTags
  }`
  return await client.fetch(query)
}

// Query helper to get all projects with expanded asset URLs
export async function getAllProjects() {
  const query = `*[_type == "project"] | order(order asc){
    _id,
    title,
    slug,
    role,
    briefDescription,
    challengeSolution,
    "projectImages": projectImages[]{
      "url": asset->url,
      "alt": asset->altText
    },
    credits,
    "behindTheScenes": behindTheScenes[]{
      "url": asset->url,
      "alt": asset->altText
    },
    resultsImpact,
    categoryTags,
    year,
    client,
    order
  }`
  return await client.fetch(query)
}

// Query helper to get all stills projects with expanded asset URLs
export async function getStillsProjects() {
  const query = `*[_type == "stillsProject"] | order(order asc){
    _id,
    title,
    "thumbnailUrl": thumbnail.asset->url,
    client,
    description,
    "gallery": gallery[].asset->url,
    year,
    order,
    categoryTags
  }`
  return await client.fetch(query)
}

