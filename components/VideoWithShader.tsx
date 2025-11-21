'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Shader code
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform int uEffect;
  varying vec2 vUv;

  float getLuminance(vec3 color) {
    return dot(color, vec3(0.299, 0.587, 0.114));
  }

  void main() {
    vec4 tex = texture2D(uTexture, vUv);
    vec3 col = tex.rgb;
    float lum = getLuminance(col);

    if (uEffect == 1) {
      // Tritone
      vec3 c1 = vec3(0.05, 0.05, 0.05); // Dark/Black
      vec3 c2 = vec3(0.8, 0.3, 0.1);    // Warm Orange
      vec3 c3 = vec3(0.95, 0.9, 0.8);   // Cream/Beige
      col = lum < 0.5 ? mix(c1, c2, lum * 2.0) : mix(c2, c3, (lum - 0.5) * 2.0);
    } 
    else if (uEffect == 2) {
      // Split-tone
      vec3 shadow = vec3(0.1, 0.2, 0.4);    // Cool Blue/Cyan
      vec3 highlight = vec3(1.0, 0.8, 0.4); // Warm Orange/Sepia
      col = mix(shadow, highlight, lum);
      col = mix(tex.rgb, col, 0.7); // Blend with original for photographic feel
    }
    else if (uEffect == 3) {
      // Solarization
      if (lum > 0.4) col = 1.0 - col;
      col *= vec3(1.1, 0.9, 1.2);
    }
    else if (uEffect == 4) {
      // Screen Print
      vec2 offset = vec2(0.004, 0.004);
      float r = texture2D(uTexture, vUv + offset).r;
      float g = texture2D(uTexture, vUv).g;
      float b = texture2D(uTexture, vUv - offset * 1.5).b;
      float steps = 4.0;
      col = vec3(floor(r * steps) / steps, floor(g * steps) / steps, floor(b * steps) / steps);
      col = pow(col, vec3(1.2));
    }
    else if (uEffect == 5) {
      // Cyanotype (Updated - Custom Orange #E65C38)
      // Duotone: Black -> #E65C38
      vec3 colorBlack = vec3(0.0, 0.0, 0.0);
      vec3 colorCustom = vec3(0.902, 0.361, 0.220); // #E65C38
      
      // High contrast: steeper smoothstep
      float contrastLum = smoothstep(0.3, 0.7, lum); 
      
      // Halftone / Posterization
      float steps = 6.0;
      contrastLum = floor(contrastLum * steps) / steps;

      // Mix colors
      col = mix(colorBlack, colorCustom, contrastLum);
      
      // Vintage grain
      float noise = (fract(sin(dot(vUv * 100.0, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.1;
      col += noise;
    }

    gl_FragColor = vec4(col, 1.0);
  }
`

function VideoShader({ videoElement, effect }: { videoElement: HTMLVideoElement, effect: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()
  
  const texture = useMemo(() => {
    console.log('🎨 Creating video texture from element:', {
      videoWidth: videoElement.videoWidth,
      videoHeight: videoElement.videoHeight,
      readyState: videoElement.readyState,
      paused: videoElement.paused
    })
    const tex = new THREE.VideoTexture(videoElement)
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    tex.format = THREE.RGBAFormat
    console.log('✅ Video texture created:', tex)
    return tex
  }, [videoElement])

  // Dispose texture on unmount
  useEffect(() => {
    return () => {
      texture.dispose()
    }
  }, [texture])

  const uniforms = useMemo(() => ({
    uTexture: { value: texture },
    uEffect: { value: effect }
  }), [texture, effect])

  useFrame(() => {
    if (texture) {
      texture.needsUpdate = true
      // Debug: log occasionally to verify texture is updating
      if (Math.random() < 0.001) { // ~1% of frames
        console.log('🔄 Texture updating:', {
          image: texture.image ? 'present' : 'missing',
          videoWidth: videoElement.videoWidth,
          videoHeight: videoElement.videoHeight,
          paused: videoElement.paused
        })
      }
    }
    if (meshRef.current && meshRef.current.material) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uEffect.value = effect;
      material.uniformsNeedUpdate = true;
    }
  })

  // Calculate scale to cover viewport (contain/cover logic)
  const videoAspect = 16 / 9 // Assuming 16:9, could be dynamic if we read video dimensions
  const viewAspect = viewport.width / viewport.height
  
  let width = viewport.width
  let height = viewport.height
  
  // Cover logic
  if (viewAspect > videoAspect) {
    height = width / videoAspect
  } else {
    width = height * videoAspect
  }

  // Ensure it covers (redundant check but safe)
  if (width < viewport.width) width = viewport.width
  if (height < viewport.height) height = viewport.height

  return (
    <mesh ref={meshRef} scale={[width, height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

export function VideoWithShader({ 
  videoUrl, 
  effect = 0,
  isMuted = true
}: { 
  videoUrl: string
  effect: number
  isMuted?: boolean 
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)
  const [videoError, setVideoError] = useState<string | null>(null)

  useEffect(() => {
    console.log('🎬 VideoWithShader mounting:', { 
      videoUrl,
      effect, 
      isMuted 
    })
  }, [videoUrl, effect, isMuted])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted
      // Ensure video plays - browsers may block autoplay
      const playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Autoplay was prevented, but that's okay - user can interact to start
          console.warn('⚠️ Video autoplay prevented:', error)
        })
      }
    }
  }, [isMuted])

  // Ensure video plays when it loads
  useEffect(() => {
    if (videoRef.current && videoReady) {
      const playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn('⚠️ Video play prevented:', error)
        })
      }
    }
  }, [videoReady])

  // Handle visibility of raw video
  // We keep it in DOM always to drive the texture
  const videoStyle: React.CSSProperties = {
    objectFit: 'cover',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
    pointerEvents: 'none'
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden">
      {/* HTML5 Video Element - Always present, driving the texture */}
      <video
        ref={videoRef}
        src={videoUrl}
        autoPlay
        loop
        playsInline
        muted={isMuted}
        crossOrigin="anonymous"
        style={videoStyle}
        onLoadedData={() => {
          console.log('✅ Video loaded:', videoUrl)
          setVideoReady(true)
          setVideoError(null)
        }}
        onCanPlay={() => {
          console.log('▶️ Video can play')
        }}
        onPlay={() => {
          console.log('▶️ Video playing')
        }}
        onError={(e) => {
            const video = e.target as HTMLVideoElement
            const error = video.error
            
            // Map error codes to messages
            const errorMessages: Record<number, string> = {
              1: 'MEDIA_ERR_ABORTED - Video loading was aborted',
              2: 'MEDIA_ERR_NETWORK - Network error while loading video',
              3: 'MEDIA_ERR_DECODE - Video decoding failed',
              4: 'MEDIA_ERR_SRC_NOT_SUPPORTED - Video format not supported or CORS issue'
            }
            
            if (error) {
              const errorMessage = errorMessages[error.code] || `Unknown error code: ${error.code}`
              console.error('❌ Video loading error:', {
                code: error.code,
                message: error.message || errorMessage,
                url: videoUrl,
                networkState: video.networkState,
                readyState: video.readyState,
                src: video.src,
                currentSrc: video.currentSrc
              })
              console.error('💡 Troubleshooting:', {
                'Error 4 (CORS)': 'Check Sanity CORS settings at https://www.sanity.io/manage',
                'Required CORS': 'http://localhost:3000',
                'Video URL': videoUrl
              })
              setVideoError(errorMessage)
              setVideoReady(false)
            } else {
              console.error('❌ Video error (no error object):', videoUrl)
              setVideoError('Unknown video error')
            }
        }}
      />
      
      {/* Temporary Debug Overlay */}
      {videoError && (
        <div className="absolute top-4 left-4 z-50 bg-red-900/90 text-white p-4 text-xs font-mono max-w-md">
          <div className="font-bold mb-2">🚨 Video Error</div>
          <div className="mb-2">{videoError}</div>
          <div className="text-white/70">
            Check console for troubleshooting tips
          </div>
        </div>
      )}
      
      {!videoReady && !videoError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/50 font-mono text-sm">Loading video...</div>
        </div>
      )}

      {/* WebGL Shader Canvas */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ 
          zIndex: 10,
          pointerEvents: 'none'
        }}
      >
        {/* Always render the shader loop if video is ready */}
        {videoReady && videoRef.current && (
          <Canvas camera={{ position: [0, 0, 1] }} style={{ width: '100%', height: '100%' }} dpr={[1, 2]}>
             <VideoShader videoElement={videoRef.current} effect={effect} />
          </Canvas>
        )}
        {!videoReady && !videoError && (
          <div className="absolute inset-0 flex items-center justify-center text-white/50 font-mono">
            Loading video...
          </div>
        )}
      </div>
    </div>
  )
}
