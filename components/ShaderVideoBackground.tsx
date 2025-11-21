'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber'
import { useVideoTexture, Plane } from '@react-three/drei'
import * as THREE from 'three'

// Define the shader material
const VideoShaderMaterial = {
  uniforms: {
    uTexture: { value: null },
    uEffect: { value: 0 }, // 0: None, 1: Tritone, 2: Split, 3: Solar, 4: Screen, 5: Cyano
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2() }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D uTexture;
    uniform int uEffect;
    uniform float uTime;
    uniform vec2 uResolution;
    varying vec2 vUv;

    // Utils
    float getLuminance(vec3 color) {
      return dot(color, vec3(0.299, 0.587, 0.114));
    }

    void main() {
      vec4 tex = texture2D(uTexture, vUv);
      vec3 col = tex.rgb;
      float lum = getLuminance(col);

      // Normal mode - just output the texture as-is
      if (uEffect == 0) {
        col = tex.rgb;
      }
      else if (uEffect == 1) {
        // Tritone (Black, Warm Orange, Cream)
        vec3 c1 = vec3(0.05, 0.05, 0.05); // Dark
        vec3 c2 = vec3(0.8, 0.3, 0.1);    // Mid (Orange)
        vec3 c3 = vec3(0.95, 0.9, 0.8);   // Light (Cream)
        
        if (lum < 0.5) {
          col = mix(c1, c2, lum * 2.0);
        } else {
          col = mix(c2, c3, (lum - 0.5) * 2.0);
        }
      } 
      else if (uEffect == 2) {
        // Split-tone (Cool shadows, Warm highlights)
        vec3 shadow = vec3(0.1, 0.2, 0.4); // Cool Blue
        vec3 highlight = vec3(1.0, 0.8, 0.4); // Warm Gold
        col = mix(shadow, highlight, lum);
        // Blend with original slightly to keep detail
        col = mix(tex.rgb, col, 0.7);
      }
      else if (uEffect == 3) {
        // Solarization / Sabattier
        // Invert curve: |sin(lum * PI)| or similar
        // Let's use a partial inversion
        vec3 solar = col;
        if (lum > 0.4) {
             solar = 1.0 - col;
        }
        // Smooth it out
        col = mix(col, solar, 0.8);
        // Tint slightly psychedelic
        col *= vec3(1.1, 0.9, 1.2);
      }
      else if (uEffect == 4) {
        // Screen Print (CMYK Offset + Halftone-ish)
        vec2 offset = vec2(0.004, 0.004); // Misalignment
        float r = texture2D(uTexture, vUv + offset).r;
        float g = texture2D(uTexture, vUv).g;
        float b = texture2D(uTexture, vUv - offset * 1.5).b;
        
        // Quantize (Posterize)
        float steps = 4.0;
        r = floor(r * steps) / steps;
        g = floor(g * steps) / steps;
        b = floor(b * steps) / steps;
        
        col = vec3(r, g, b);
        // Contrast boost
        col = pow(col, vec3(1.2));
      }
      else if (uEffect == 5) {
        // Cyanotype (Prussian Blue & White)
        vec3 prussian = vec3(0.0, 0.18, 0.33);
        vec3 paper = vec3(0.96, 0.98, 1.0); // Slight blueish white
        
        // High contrast mapping
        float c = smoothstep(0.1, 0.9, lum);
        col = mix(prussian, paper, c);
      }

      gl_FragColor = vec4(col, 1.0);
    }
  `
}

function ShaderPlane({ url, effect, isMuted, onError }: { url: string, effect: number, isMuted: boolean, onError?: () => void }) {
  const [textureError, setTextureError] = useState(false)
  const [textureReady, setTextureReady] = useState(false)
  
  console.log('🎬 ShaderPlane loading video:', url, 'effect:', effect)
  
  const texture = useVideoTexture(url, {
    unsuspend: 'canplay',
    muted: isMuted,
    loop: true,
    start: true,
    crossOrigin: 'Anonymous'
  })

  useEffect(() => {
    if (texture?.image) {
      const video = texture.image as HTMLVideoElement
      video.muted = isMuted
      
      // Add error handling
      const handleError = (e: Event) => {
        console.error('❌ Video error:', url, video.error)
        console.error('Video error details:', {
          code: video.error?.code,
          message: video.error?.message,
          networkState: video.networkState,
          readyState: video.readyState
        })
        setTextureError(true)
        onError?.()
      }
      
      const handleLoaded = () => {
        console.log('✅ Video texture loaded:', url)
        console.log('Video details:', {
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
          duration: video.duration,
          readyState: video.readyState,
          networkState: video.networkState
        })
        setTextureError(false)
        setTextureReady(true)
      }
      
      const handleCanPlay = () => {
        console.log('▶️ Video can play:', url)
      }
      
      video.addEventListener('error', handleError)
      video.addEventListener('loadeddata', handleLoaded)
      video.addEventListener('canplay', handleCanPlay)
      
      // Check if video already has data
      if (video.readyState >= 2) {
        handleLoaded()
      }
      
      return () => {
        video.removeEventListener('error', handleError)
        video.removeEventListener('loadeddata', handleLoaded)
        video.removeEventListener('canplay', handleCanPlay)
      }
    } else {
      console.warn('⏳ Waiting for video texture:', url)
    }
  }, [isMuted, texture, url])

  useEffect(() => {
    if (!texture) {
      console.warn('⏳ Video texture loading...', url)
    }
  }, [texture, url])
  
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { viewport } = useThree()

  // Create a default texture to prevent black screen
  const defaultTexture = useMemo(() => {
    if (typeof document === 'undefined') return null
    const canvas = document.createElement('canvas')
    canvas.width = 2
    canvas.height = 2
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, 2, 2)
    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    return tex
  }, [])

  // Update texture uniform when texture is ready
  useEffect(() => {
    if (materialRef.current) {
      if (texture) {
        console.log('🖼️ Setting texture in shader:', texture.image ? 'has video' : 'no video')
        materialRef.current.uniforms.uTexture.value = texture
        // Force texture update
        texture.needsUpdate = true
        materialRef.current.needsUpdate = true
      } else if (defaultTexture) {
        materialRef.current.uniforms.uTexture.value = defaultTexture
      }
    }
  }, [texture, defaultTexture])

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
      materialRef.current.uniforms.uEffect.value = effect
      
      // Always ensure texture is set and updated
      if (texture) {
        if (materialRef.current.uniforms.uTexture.value !== texture) {
          materialRef.current.uniforms.uTexture.value = texture
          texture.needsUpdate = true
        }
        // Update texture every frame for video
        texture.needsUpdate = true
      } else if (defaultTexture && materialRef.current.uniforms.uTexture.value !== defaultTexture) {
        materialRef.current.uniforms.uTexture.value = defaultTexture
      }
    }
  })

  // Keep aspect ratio cover
  // For simplicity, we just scale the plane to cover viewport
  // A more robust solution would calculate aspect ratio like object-fit: cover
  const scale: [number, number, number] = [viewport.width, viewport.height, 1]
  
  // Adjust UVs if needed for aspect ratio... simplified for now by just stretching or large plane
  // Better: use Drei's <Image> equivalent logic or just make plane huge?
  // Let's try to just match viewport size. Since standard video is 16:9, and viewport might vary.
  // We can scale the plane to be larger dimension.
  
  const videoAspect = 16 / 9
  const viewAspect = viewport.width / viewport.height
  
  let width = viewport.width
  let height = viewport.height
  
  if (viewAspect > videoAspect) {
     height = width / videoAspect
  } else {
     width = height * videoAspect
  }

  // Ensure it covers
  if (width < viewport.width) {
     width = viewport.width
     height = width / videoAspect
  }
  if (height < viewport.height) {
     height = viewport.height
     width = height * videoAspect
  }

  // Don't render if no texture and no default
  if (!texture && !defaultTexture) {
    return null
  }

  const activeTexture = texture || defaultTexture

  return (
    <mesh scale={[width, height, 1]}>
      <planeGeometry args={[1, 1]} />
      {/* Always use shaderMaterial for consistent rendering */}
      <shaderMaterial
        ref={materialRef}
        args={[VideoShaderMaterial]}
        uniforms-uTexture-value={activeTexture}
        uniforms-uEffect-value={effect}
        toneMapped={false}
      />
    </mesh>
  )
}

export function ShaderVideoBackground({ 
  videoUrl, 
  effect = 0,
  isMuted = true
}: { 
  videoUrl: string
  effect: number
  isMuted?: boolean 
}) {
  const [shaderFailed, setShaderFailed] = useState(false)
  
  // Vimeo links can't be used directly in WebGL textures (CORS/iframe limitation)
  const isVimeo = videoUrl.includes('vimeo')
  
  // Build the final URL
  let src = videoUrl
  if (isVimeo) {
    // Use demo video for Vimeo
    src = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
  }
  
  // Use direct URL - ensure CORS is configured in Sanity dashboard
  // Go to https://www.sanity.io/manage -> API -> CORS Origins -> Add http://localhost:3045
  
  // Fallback to regular video if shader fails
  if (shaderFailed) {
    console.warn('⚠️ Shader failed, falling back to regular video')
    return (
      <div className="fixed inset-0 w-full h-full -z-10 bg-black">
        <video
          src={videoUrl}
          autoPlay
          loop
          playsInline
          muted={isMuted}
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-black">
       <Canvas 
         camera={{ position: [0, 0, 1] }} 
         style={{ width: '100%', height: '100%' }}
         gl={{ alpha: true, antialias: false }}
         onError={(error) => {
           console.error('Canvas error:', error)
           setShaderFailed(true)
         }}
       >
         <ShaderPlane 
           url={src} 
           effect={effect} 
           isMuted={isMuted}
           onError={() => setShaderFailed(true)}
         />
       </Canvas>
       {isVimeo && (
         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-white/50 font-mono pointer-events-none z-50">
           Using demo video (Vimeo URLs need direct MP4 for shaders)
         </div>
       )}
    </div>
  )
}

