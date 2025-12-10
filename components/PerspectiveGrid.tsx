'use client'

import { useRef, useEffect, useCallback } from 'react'

interface PerspectiveGridProps {
  className?: string
  size?: number
  lineColor?: string
  lineWidth?: number
  gridLines?: number
  innerRatio?: number
  maxOffset?: number
  lerpSpeed?: number
  idleReturnDelay?: number
  fillContainer?: boolean
}

export function PerspectiveGrid({
  className = '',
  size = 400,
  lineColor = '#000000',
  lineWidth = 1.5,
  gridLines = 3,
  innerRatio = 0.15,
  maxOffset = 0.35,
  lerpSpeed = 8,
  idleReturnDelay = 3000,
  fillContainer = false,
}: PerspectiveGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  
  // Mouse state
  const mousePos = useRef({ x: 0.5, y: 0.5 })
  const targetPos = useRef({ x: 0.5, y: 0.5 })
  const currentPos = useRef({ x: 0.5, y: 0.5 })
  const lastMoveTime = useRef(Date.now())
  const lastFrameTime = useRef(performance.now())
  const isIdle = useRef(false)
  
  // Zoom state for scroll interaction
  const targetZoom = useRef(1.0)
  const currentZoom = useRef(1.0)
  const isHovering = useRef(false)

  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const dpr = window.devicePixelRatio || 1
    ctx.clearRect(0, 0, width * dpr, height * dpr)
    
    ctx.save()
    ctx.scale(dpr, dpr)
    
    ctx.strokeStyle = lineColor
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'square'
    ctx.lineJoin = 'miter'

    // Outer rectangle (full canvas with small margin)
    const margin = 2
    const outerLeft = margin
    const outerTop = margin
    const outerRight = width - margin
    const outerBottom = height - margin
    const outerWidth = outerRight - outerLeft
    const outerHeight = outerBottom - outerTop

    // Inner rectangle - position based on mouse, size based on zoom
    const zoomedInnerRatio = innerRatio * currentZoom.current
    const innerWidth = outerWidth * zoomedInnerRatio
    const innerHeight = outerHeight * zoomedInnerRatio
    
    // Center position
    const centerX = width / 2
    const centerY = height / 2
    
    // Offset from center based on currentPos (0-1 normalized)
    const offsetX = (currentPos.current.x - 0.5) * 2 * maxOffset * outerWidth
    const offsetY = (currentPos.current.y - 0.5) * 2 * maxOffset * outerHeight
    
    const innerCenterX = centerX + offsetX
    const innerCenterY = centerY + offsetY
    
    const innerLeft = innerCenterX - innerWidth / 2
    const innerTop = innerCenterY - innerHeight / 2
    const innerRight = innerCenterX + innerWidth / 2
    const innerBottom = innerCenterY + innerHeight / 2

    // Draw outer rectangle
    ctx.beginPath()
    ctx.rect(outerLeft, outerTop, outerWidth, outerHeight)
    ctx.stroke()

    // Draw inner rectangle
    ctx.beginPath()
    ctx.rect(innerLeft, innerTop, innerWidth, innerHeight)
    ctx.stroke()

    // Draw corner-to-corner lines (perspective lines)
    ctx.beginPath()
    // Top-left corner to inner top-left
    ctx.moveTo(outerLeft, outerTop)
    ctx.lineTo(innerLeft, innerTop)
    // Top-right corner to inner top-right
    ctx.moveTo(outerRight, outerTop)
    ctx.lineTo(innerRight, innerTop)
    // Bottom-left corner to inner bottom-left
    ctx.moveTo(outerLeft, outerBottom)
    ctx.lineTo(innerLeft, innerBottom)
    // Bottom-right corner to inner bottom-right
    ctx.moveTo(outerRight, outerBottom)
    ctx.lineTo(innerRight, innerBottom)
    ctx.stroke()

    // Draw grid lines - horizontal lines on top and bottom faces
    for (let i = 1; i <= gridLines; i++) {
      const t = i / (gridLines + 1)
      
      // Top face horizontal lines
      const topOuterY = outerTop
      const topInnerY = innerTop
      const topY = topOuterY + (topInnerY - topOuterY) * t
      
      // Calculate X positions at this depth level (perspective interpolation)
      const leftX = outerLeft + (innerLeft - outerLeft) * t
      const rightX = outerRight + (innerRight - outerRight) * t
      
      ctx.beginPath()
      ctx.moveTo(leftX, topY)
      ctx.lineTo(rightX, topY)
      ctx.stroke()

      // Bottom face horizontal lines
      const bottomOuterY = outerBottom
      const bottomInnerY = innerBottom
      const bottomY = bottomOuterY + (bottomInnerY - bottomOuterY) * t
      
      const bottomLeftX = outerLeft + (innerLeft - outerLeft) * t
      const bottomRightX = outerRight + (innerRight - outerRight) * t
      
      ctx.beginPath()
      ctx.moveTo(bottomLeftX, bottomY)
      ctx.lineTo(bottomRightX, bottomY)
      ctx.stroke()
    }

    // Draw grid lines - vertical lines on left and right faces
    for (let i = 1; i <= gridLines; i++) {
      const t = i / (gridLines + 1)
      
      // Left face vertical lines
      const leftOuterX = outerLeft
      const leftInnerX = innerLeft
      const leftX = leftOuterX + (leftInnerX - leftOuterX) * t
      
      const topY = outerTop + (innerTop - outerTop) * t
      const bottomY = outerBottom + (innerBottom - outerBottom) * t
      
      ctx.beginPath()
      ctx.moveTo(leftX, topY)
      ctx.lineTo(leftX, bottomY)
      ctx.stroke()

      // Right face vertical lines
      const rightOuterX = outerRight
      const rightInnerX = innerRight
      const rightX = rightOuterX + (rightInnerX - rightOuterX) * t
      
      const rightTopY = outerTop + (innerTop - outerTop) * t
      const rightBottomY = outerBottom + (innerBottom - outerBottom) * t
      
      ctx.beginPath()
      ctx.moveTo(rightX, rightTopY)
      ctx.lineTo(rightX, rightBottomY)
      ctx.stroke()
    }

    ctx.restore()
  }, [lineColor, lineWidth, gridLines, innerRatio, maxOffset])

  const animate = useCallback((timestamp: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Calculate delta time for frame-rate independent animation
    const deltaTime = (timestamp - lastFrameTime.current) / 1000
    lastFrameTime.current = timestamp

    const dpr = window.devicePixelRatio || 1
    const width = canvas.width / dpr
    const height = canvas.height / dpr

    // Check if idle
    const timeSinceMove = Date.now() - lastMoveTime.current
    if (timeSinceMove > idleReturnDelay) {
      isIdle.current = true
      targetPos.current = { x: 0.5, y: 0.5 }
    }

    // Smooth lerp to target using delta time (frame-rate independent)
    const lerpFactor = 1 - Math.exp(-lerpSpeed * deltaTime)
    currentPos.current.x += (targetPos.current.x - currentPos.current.x) * lerpFactor
    currentPos.current.y += (targetPos.current.y - currentPos.current.y) * lerpFactor
    
    // Smooth zoom lerp
    currentZoom.current += (targetZoom.current - currentZoom.current) * lerpFactor

    draw(ctx, width, height)
    animationRef.current = requestAnimationFrame(animate)
  }, [draw, lerpSpeed, idleReturnDelay])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      
      // Clamp to 0-1 range
      mousePos.current = {
        x: Math.max(0, Math.min(1, x)),
        y: Math.max(0, Math.min(1, y)),
      }
      targetPos.current = mousePos.current
      lastMoveTime.current = Date.now()
      isIdle.current = false
    }

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
    }

    const handleWheel = (e: WheelEvent) => {
      if (!isHovering.current) return
      
      e.preventDefault()
      e.stopPropagation()
      
      // Adjust zoom based on scroll direction
      const zoomDelta = e.deltaY > 0 ? 0.3 : -0.3
      targetZoom.current = Math.max(0.3, Math.min(3.0, targetZoom.current + zoomDelta))
      
      // Reset idle timer
      lastMoveTime.current = Date.now()
      isIdle.current = false
    }

    const handleMouseEnter = () => {
      isHovering.current = true
    }

    const handleMouseLeave = () => {
      isHovering.current = false
    }

    canvas.addEventListener('mouseenter', handleMouseEnter)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    canvas.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)
    
    // Initialize timing and start animation loop
    lastFrameTime.current = performance.now()
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      canvas.removeEventListener('mouseenter', handleMouseEnter)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      canvas.removeEventListener('wheel', handleWheel)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [animate])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={fillContainer ? {
        width: '100%',
        height: '100%',
        aspectRatio: '1 / 1',
        maxWidth: '80%',
        objectFit: 'contain',
      } : {
        width: size,
        height: size,
        maxWidth: '100%',
        aspectRatio: '1 / 1',
      }}
    />
  )
}

