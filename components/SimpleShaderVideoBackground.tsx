'use client'

import { useRef, useEffect, useState } from 'react'
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
      vec3 c1 = vec3(0.05, 0.05, 0.05);
      vec3 c2 = vec3(0.8, 0.3, 0.1);
      vec3 c3 = vec3(0.95, 0.9, 0.8);
      col = lum < 0.5 ? mix(c1, c2, lum * 2.0) : mix(c2, c3, (lum - 0.5) * 2.0);
    } 
    else if (uEffect == 2) {
      // Split-tone
      vec3 shadow = vec3(0.1, 0.2, 0.4);
      vec3 highlight = vec3(1.0, 0.8, 0.4);
      col = mix(shadow, highlight, lum);
      col = mix(tex.rgb, col, 0.7);
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
      // Cyanotype
      vec3 prussian = vec3(0.0, 0.18, 0.33);
      vec3 paper = vec3(0.96, 0.98, 1.0);
      float c = smoothstep(0.1, 0.9, lum);
      col = mix(prussian, paper, c);
    }

    gl_FragColor = vec4(col, 1.0);
  }
`

function VideoShader({ videoElement, effect }: { videoElement: HTMLVideoElement, effect: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()
  
  const texture = useRef<THREE.VideoTexture | null>(null)
  const material = useRef<THREE.ShaderMaterial | null>(null)

  useEffect(() => {
    if (!videoElement) return
    
    // Create video texture
    texture.current = new THREE.VideoTexture(videoElement)
    texture.current.minFilter = THREE.LinearFilter
    texture.current.magFilter = THREE.LinearFilter
    texture.current.format = THREE.RGBAFormat

    // Create shader material
    material.current = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: { value: texture.current },
        uEffect: { value: effect }
      }
    })

    if (meshRef.current) {
      meshRef.current.material = material.current
    }

    console.log('✅ Video shader initialized')
  }, [videoElement])

  useFrame(() => {
    if (texture.current) {
      texture.current.needsUpdate = true
    }
    if (material.current) {
      material.current.uniforms.uEffect.value = effect
    }
  })

  // Calculate scale to cover viewport
  const videoAspect = 16 / 9
  const viewAspect = viewport.width / viewport.height
  
  let width = viewport.width
  let height = viewport.height
  
  if (viewAspect > videoAspect) {
    height = width / videoAspect
  } else {
    width = height * videoAspect
  }

  if (width < viewport.width) {
    width = viewport.width
    height = width / videoAspect
  }
  if (height < viewport.height) {
    height = viewport.height
    width = height * videoAspect
  }

  return (
    <mesh ref={meshRef} scale={[width, height, 1]}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  )
}

export function SimpleShaderVideoBackground({ 
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

  useEffect(() => {
    console.log('🎬 SimpleShaderVideoBackground mounting')
    console.log('   URL:', videoUrl)
    console.log('   Effect:', effect)
    console.log('   Is Sanity CDN?', videoUrl.includes('cdn.sanity.io'))
  }, [videoUrl, effect])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted
    }
  }, [isMuted])

  return (
    <>
      {/* HTML5 Video Element - Always visible when effect is 0 */}
      {effect === 0 && (
        <div className="fixed inset-0 w-full h-full bg-black" style={{ zIndex: 0 }}>
          <video
            ref={videoRef}
            src={videoUrl}
            autoPlay
            loop
            playsInline
            muted={isMuted}
            crossOrigin="anonymous"
            className="w-full h-full object-cover"
            onLoadedData={() => {
              console.log('✅ Video loaded and ready:', videoUrl)
              setVideoReady(true)
            }}
            onError={(e) => {
              console.error('❌ Video error:', videoUrl)
              if (videoRef.current) {
                console.error('Video error details:', videoRef.current.error)
              }
            }}
            onCanPlay={() => console.log('✅ Video can play:', videoUrl)}
            onPlay={() => console.log('▶️ Video started playing:', videoUrl)}
          />
        </div>
      )}
      
      {/* Debug overlay */}
      <div className="fixed top-4 left-4 bg-red-500 text-white p-2 text-xs" style={{ zIndex: 9999 }}>
        Effect: {effect} | Ready: {videoReady ? 'Y' : 'N'}
      </div>
      
      {/* WebGL Shader Canvas (only when effect > 0) */}
      {effect > 0 && videoReady && videoRef.current && (
        <div className="absolute inset-0 w-full h-full">
          <Canvas camera={{ position: [0, 0, 1] }} style={{ width: '100%', height: '100%' }}>
            <VideoShader videoElement={videoRef.current} effect={effect} />
          </Canvas>
        </div>
      )}
    </div>
  )
}

