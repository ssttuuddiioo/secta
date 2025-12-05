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
      // Cyanotype - Gritty Photocopied Halftone
      vec3 colorBlack = vec3(0.0, 0.0, 0.0);
      vec3 colorCustom = vec3(0.902, 0.361, 0.220); // #E65C38
      
      // STEP 1: Pre-sharpen for crisp detail
      vec2 texelSize = vec2(1.0 / 1920.0, 1.0 / 1080.0);
      float sharpened = lum * 5.0;
      sharpened -= getLuminance(texture2D(uTexture, vUv + vec2(texelSize.x, 0.0)).rgb);
      sharpened -= getLuminance(texture2D(uTexture, vUv - vec2(texelSize.x, 0.0)).rgb);
      sharpened -= getLuminance(texture2D(uTexture, vUv + vec2(0.0, texelSize.y)).rgb);
      sharpened -= getLuminance(texture2D(uTexture, vUv - vec2(0.0, texelSize.y)).rgb);
      lum = clamp(sharpened * 1.3, 0.0, 1.0);
      
      // STEP 2: Enhanced contrast
      lum = smoothstep(0.15, 0.85, lum);
      lum = lum * lum * (3.0 - 2.0 * lum);
      
      // STEP 3: Posterize with good tonal range (5 levels)
      float steps = 5.0;
      float posterized = floor(lum * steps) / steps;
      
      // STEP 4: Fine, irregular halftone pattern with chaos
      float dotSize = 2.5; // Very fine dots
      
      // Add pattern distortion (organic variation)
      vec2 distortion = vec2(
        fract(sin(dot(vUv * 50.0, vec2(12.9898, 78.233))) * 43758.5453),
        fract(sin(dot(vUv * 50.0, vec2(78.233, 12.9898))) * 43758.5453)
      ) * 0.3;
      
      vec2 dotUv = (vUv + distortion * 0.002) * 1000.0 / dotSize;
      vec2 dotCenter = floor(dotUv) + 0.5;
      float dist = distance(dotUv, dotCenter);
      
      // Random dot dropout (creates broken pattern)
      float dropout = fract(sin(dot(floor(dotUv), vec2(127.1, 311.7))) * 43758.5453);
      
      float dotThreshold = posterized * 0.4;
      float halftone = smoothstep(dotThreshold - 0.15, dotThreshold + 0.15, dist);
      
      // Apply dropout to create irregular pattern
      if (dropout > 0.92) halftone = 1.0; // Random white spots
      if (dropout < 0.08) halftone = 0.0; // Random black spots
      
      // Very subtle blend (10%) - mostly posterized tone
      posterized = mix(posterized, halftone, 0.1);
      
      // STEP 5: Rough edges - add noise at tone boundaries
      float edgeNoise = fract(sin(dot(vUv * 700.0, vec2(12.9898, 78.233))) * 43758.5453);
      float edgeDetect = abs(posterized - 0.5); // Detect edges
      if (edgeDetect < 0.2) {
        posterized = mix(posterized, edgeNoise, 0.15); // Rough up edges
      }
      
      // STEP 6: Paper texture overlay
      float paperGrain = fract(sin(dot(vUv * 1200.0, vec2(45.678, 90.123))) * 23456.789);
      float paperPattern = fract(sin(dot(floor(vUv * 300.0), vec2(127.1, 311.7))) * 43758.5453);
      float paper = mix(paperGrain, paperPattern, 0.5);
      posterized = mix(posterized, paper, 0.04);
      
      posterized = clamp(posterized, 0.0, 1.0);
      
      // STEP 7: Mix colors
      col = mix(colorBlack, colorCustom, posterized);
    }

    gl_FragColor = vec4(col, 1.0);
  }
`

function VideoShader({ videoElement, effect }: { videoElement: HTMLVideoElement, effect: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()
  
  const texture = useMemo(() => {
    const tex = new THREE.VideoTexture(videoElement)
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    tex.format = THREE.RGBAFormat
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
    }
    if (meshRef.current && meshRef.current.material) {
      const material = meshRef.current.material as THREE.ShaderMaterial
      material.uniforms.uEffect.value = effect
      material.uniformsNeedUpdate = true
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
  isMuted = true,
  onReady
}: { 
  videoUrl: string
  effect: number
  isMuted?: boolean
  onReady?: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)
  const [videoError, setVideoError] = useState<string | null>(null)
  const hasCalledReady = useRef(false)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted
      const playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented - user can interact to start
        })
      }
    }
  }, [isMuted])

  // Ensure video plays when it loads and notify parent when ready
  useEffect(() => {
    if (videoRef.current && videoReady) {
      const playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Play prevented - user can interact to start
        })
      }
      
      // Notify parent component that video is ready (only once)
      if (onReady && !hasCalledReady.current) {
        // Small delay to ensure shader has rendered at least one frame
        setTimeout(() => {
          onReady()
          hasCalledReady.current = true
        }, 100)
      }
    }
  }, [videoReady, onReady])

  // Handle visibility of raw video
  // We keep it in DOM always to drive the texture but hide it completely
  const videoStyle: React.CSSProperties = {
    objectFit: 'cover',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
    pointerEvents: 'none',
    opacity: 0, // Hide the raw video - only show shader version
    visibility: 'hidden'
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
          setVideoReady(true)
          setVideoError(null)
        }}
        onError={() => {
            // Silently handle transient errors - video usually recovers
            // Only set error state if video hasn't loaded after a delay
            setTimeout(() => {
              if (videoRef.current && videoRef.current.readyState < 2) {
                console.warn('Video failed to load:', videoUrl)
                setVideoError('Video failed to load')
                setVideoReady(false)
              }
            }, 3000)
        }}
      />
      
      {/* Error logging only - no visual overlay */}

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
      </div>
    </div>
  )
}
