# SECTA Portfolio Website - Stack & Design Outline

## Technology Stack

### Core Framework
- **Next.js 16.0.3** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript 5** - Type-safe JavaScript

### Styling & Design System
- **Tailwind CSS v4** - Utility-first CSS framework
- **PostCSS** - CSS processing with Tailwind plugin
- **CSS Custom Properties** - Theme variables for colors and fonts
- **Dark Mode Support** - System preference-based dark/light mode

### Animation & Motion
- **GSAP 3.13.0** - Animation library for smooth transitions
- **GSAP ScrollTrigger** - Scroll-based animations
- **Split-Type 0.3.4** - Text splitting for animations

### Icons & UI Components
- **Lucide React 0.553.0** - Icon library

### Validation & Type Safety
- **Zod 4.1.12** - Schema validation for data

### Development Tools
- **ESLint 9** - Code linting with Next.js configs
- **TypeScript** - Strict type checking enabled

### External Image Sources
- **Unsplash** - Image hosting (configured in Next.js)
- **Pexels** - Image hosting (configured in Next.js)

---

## Design System

### Typography

#### Font Families
1. **Geist Sans** (`--font-geist-sans`)
   - Primary sans-serif font
   - Used for body text and UI elements

2. **Geist Mono** (`--font-geist-mono`)
   - Monospace font
   - Available for code/technical content

3. **Cormorant Infant** (`--font-cormorant-infant`)
   - Weight: 300 (Light)
   - Used for logo/branding (100px, line-height: 1)
   - Elegant serif display font

4. **Host Grotesk** (`--font-host-grotesk`)
   - Used for navigation buttons (24px)
   - Modern sans-serif for UI elements

#### Font Loading
- Google Fonts via Next.js font optimization
- All fonts loaded with variable CSS custom properties

### Color System

#### Light Mode
- **Background**: `#ffffff` (white)
- **Foreground**: `#171717` (near-black)

#### Dark Mode (System Preference)
- **Background**: `#0a0a0a` (near-black)
- **Foreground**: `#ededed` (near-white)

#### UI Colors
- **White**: Primary text/UI color on dark backgrounds
- **Black**: Primary background color
- **Overlays**: `bg-black/20` for video overlays
- **Hover States**: `bg-white/10` for interactive elements

### Layout & Spacing

#### Grid System
- Responsive breakpoints via Tailwind
- Max-width containers: `max-w-[1600px]`
- Padding: `px-6 md:px-12` (responsive horizontal padding)

#### Z-Index Layers
- **Video Background**: `z-0`
- **Video Overlay**: `z-10`
- **Thumbnails**: `z-40`
- **Navigation**: `z-50`
- **Controls**: Various z-index values for layering

### Component Patterns

#### Navigation
- Fixed positioning (`fixed top-0`)
- Logo: Large serif text (100px) top-left
- Navigation buttons: Rounded pill buttons (`rounded-full`)
- Button style: `border-2 border-white` with hover states
- Button dimensions: `w-[150px] h-10 md:h-12`

#### Video Components
- Full-screen background videos
- Smooth fade transitions (GSAP-powered)
- Auto-play, loop, muted by default
- Thumbnail carousel at bottom
- Custom scrollbar hiding for thumbnail container

#### Interactive Elements
- Hover states: `hover:opacity-80`, `hover:bg-white/10`
- Transition classes: `transition-opacity`, `transition-all`
- Smooth video transitions: `opacity 0.5s ease-in-out`

---

## Architecture

### File Structure

```
portfolio/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with fonts
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles & theme
│   ├── work/              # Work listing page
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   └── project/[slug]/    # Dynamic project detail pages
│
├── components/            # React components
│   ├── Navigation.tsx     # Top navigation bar
│   ├── HomePage.tsx       # Home page component
│   ├── VideoBackground.tsx # Full-screen video background
│   ├── VideoThumbnail.tsx # Video thumbnail carousel items
│   ├── VideoControls.tsx  # Video playback controls
│   ├── WorkGrid.tsx       # Project grid layout
│   ├── ProjectDetail.tsx  # Project detail view
│   └── ...                # Other UI components
│
├── lib/                   # Utilities & helpers
│   ├── animation.ts       # GSAP animation utilities
│   └── data.ts            # Project data management
│
└── types/                 # TypeScript type definitions
    └── project.ts         # Project interface
```

### Routing Structure

- `/` - Home page with video carousel
- `/work` - All projects grid view
- `/about` - About page
- `/contact` - Contact page
- `/project/[slug]` - Individual project detail pages

### Component Architecture

#### Server vs Client Components
- **Server Components**: Default (pages, layouts)
- **Client Components**: Marked with `'use client'` directive
  - Interactive components (video players, navigation)
  - Components using hooks (useState, useEffect)
  - Components using browser APIs

#### Component Patterns
- **Modular Design**: Each component is self-contained
- **Named Exports**: All components use named exports
- **TypeScript Interfaces**: Strong typing for all props
- **Functional Components**: No class components

### Data Management

#### Project Data
- Currently stored in `lib/data.ts` as static array
- Project interface defined in `types/project.ts`
- Functions: `getProjects()`, `getProjectBySlug()`, `getFeaturedProjects()`
- Data structure supports:
  - Images (cover, gallery)
  - Videos (main video, thumbnail video)
  - Metadata (client, category, tags, year)
  - Media arrays with type discrimination

#### Future Integration
- Ready for CMS integration (Sanity mentioned in user rules)
- Ready for database integration (Supabase mentioned in user rules)

---

## Animation & Interactions

### GSAP Animations

#### Fade In Up
```typescript
{
  opacity: 0,
  y: 60,
  duration: 1,
  ease: 'power3.out'
}
```

#### Stagger Children
- Configurable delay between child animations
- Default stagger: 0.1s delay, 0.5s total amount

#### Video Transitions
- Opacity fade: `duration: 1, ease: 'power2.out'`
- Smooth transitions between video changes
- 300ms delay for transition state management

### Scroll Behavior
- Smooth scrolling enabled via GSAP
- ScrollTrigger plugin registered for scroll-based animations

---

## Performance Considerations

### Image Optimization
- Next.js Image component (configured for Unsplash/Pexels)
- Remote pattern configuration for external images
- Responsive image loading

### Video Optimization
- `preload="auto"` for video backgrounds
- `playsInline` for mobile compatibility
- Muted autoplay for better UX
- Smooth transitions to prevent jarring switches

### Font Optimization
- Next.js font optimization for Google Fonts
- Variable fonts for better performance
- Subset loading (Latin only)

---

## Responsive Design

### Breakpoints (Tailwind CSS v4)
- **Mobile**: Default (320px+)
- **sm**: 640px (small tablets, large phones)
- **md**: 768px (tablets)
- **lg**: 1024px (small desktops)
- **xl**: 1280px (desktops)
- **2xl**: 1536px+ (large desktops)

### Mobile-First Approach
All components use mobile-first responsive design with progressive enhancement for larger screens.

### Design Tokens (CSS Variables)

#### Responsive Spacing Scale (8px grid system)
- `--spacing-xs`: 4px
- `--spacing-sm`: 8px
- `--spacing-md`: 16px
- `--spacing-lg`: 24px
- `--spacing-xl`: 32px
- `--spacing-2xl`: 48px
- `--spacing-3xl`: 64px

#### Touch Targets
- Minimum touch target size: `--touch-target-min: 44px`
- All interactive elements meet WCAG 2.1 Level AAA requirements
- Touch-friendly spacing between interactive elements

#### Responsive Typography Scale
- Font sizes scale fluidly using `clamp()` CSS function
- Logo: `clamp(2rem, 8vw, 6.25rem)` (32px → 100px)
- Navigation buttons: `clamp(0.875rem, 1.5vw, 1.5rem)` (14px → 24px)
- Headings: `clamp(1.875rem, 5vw, 3.125rem)` (30px → 50px)

### Layout Adaptations

#### Navigation
- **Mobile**: Hamburger menu with full-screen overlay
- **Desktop**: Horizontal navigation buttons
- Logo scales responsively: 32px (mobile) → 100px (desktop)
- Touch-friendly menu items (min 56px height on mobile)

#### Video Components
- **VideoBackground**: Lighter preload on mobile (`metadata` vs `auto`)
- **VideoThumbnail**: Responsive sizing (112px → 176px width)
- Touch-optimized interactions (no hover on touch devices)
- Snap scrolling for thumbnail carousel on mobile

#### Grid Layouts
- **ProjectsGrid**: 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)
- **WorkGrid**: 1 column (mobile) → 2 columns (tablet+)
- Responsive gaps: `gap-3 sm:gap-4 md:gap-6`

#### Spacing Patterns
- Container padding: `px-3 sm:px-4 md:px-6 lg:px-12`
- Section padding: `py-12 sm:py-16 md:py-20`
- Component spacing adapts to viewport size

### Mobile Optimizations

#### Performance
- Reduced video preload on mobile (`metadata` instead of `auto`)
- Lazy loading for video thumbnails
- Intersection Observer for viewport-based loading
- Optimized GSAP animation timings (shorter durations on mobile)

#### Touch Interactions
- `touch-manipulation` CSS for better touch response
- Active states for touch feedback (`active:opacity-70`)
- Swipe-friendly thumbnail carousel with snap points
- Touch event handling separate from hover states

#### Reduced Motion Support
- Respects `prefers-reduced-motion` media query
- Animations disabled or minimized for accessibility
- GSAP animations adapt based on user preference
- Video transitions respect motion preferences

### Animation Adaptations

#### GSAP Mobile Optimizations
- Shorter animation durations on mobile (0.6s vs 1s)
- Reduced Y-offset for fade-in animations (40px vs 60px)
- Faster stagger delays (0.07s vs 0.1s)
- ScrollTrigger start points adjusted for mobile (`top 85%` vs `top 80%`)

#### Mobile-Specific Animation Config
- `fadeInUp()`: Automatically detects mobile and adjusts timing
- `staggerChildren()`: Reduced stagger amount on mobile
- `getScrollTriggerConfig()`: Mobile-optimized scroll triggers
- Helper functions: `shouldReduceMotion()`, `isMobileDevice()`

### Video Optimization

#### Mobile Video Strategy
- Thumbnail videos disabled on touch devices (images only)
- Background videos use `playsInline` for iOS compatibility
- Lighter preload strategy (`metadata` vs `auto`)
- Intersection Observer for viewport-based playback
- Adaptive fade durations (0.6s mobile, 1s desktop)

### Responsive Typography

#### Font Scaling
- **Geist Sans**: Body text scales with viewport
- **Geist Mono**: Code/technical content scales appropriately
- **Cormorant Infant**: Logo uses fluid scaling (`clamp()`)
- **Host Grotesk**: Navigation buttons scale responsively

#### Typography Breakpoints
- Base font: 16px (mobile) → scales with viewport
- Headings: Use `clamp()` for fluid scaling
- Navigation: Responsive font sizes per breakpoint
- Line heights adjusted for mobile readability

### Component Responsive Patterns

#### Navigation Component
- Mobile menu overlay with centered links
- Desktop horizontal navigation
- Responsive logo sizing
- Touch-friendly button sizes

#### VideoThumbnail Component
- Responsive width: `w-28 sm:w-32 md:w-40 lg:w-44`
- Touch detection for hover state handling
- Active state indicators
- Priority loading for active thumbnail

#### VideoControls Component
- Fixed positioning with responsive offsets
- Minimum 44px touch target
- Responsive icon sizing
- Mobile-friendly positioning

#### SocialIcons Component
- Responsive positioning (`bottom-4 right-4 sm:bottom-6 sm:right-6`)
- Touch-friendly icon sizes
- Minimum 44px touch targets
- Active state feedback

### Testing Considerations

#### Device Testing Matrix
- **Mobile**: iPhone SE (320px) to iPhone Pro Max (428px)
- **Tablet**: iPad (768px) to iPad Pro (1024px)
- **Desktop**: 1280px to 2560px+
- **Orientation**: Portrait and landscape modes

#### Browser Testing
- iOS Safari (iPhone/iPad)
- Chrome Mobile (Android)
- Desktop Chrome, Firefox, Safari, Edge
- Dark/light mode switching on mobile OS level

#### Performance Targets
- LCP < 2.5s on 3G mobile
- No layout shift during video/animation loading
- 60fps GSAP animations on mid-range mobile devices
- Maintain Lighthouse scores or improve

---

## Accessibility

### Current Implementation
- Semantic HTML structure
- Proper heading hierarchy
- Alt text support (via Project interface)
- Keyboard navigation support
- ARIA labels for video controls and interactive elements
- Touch target minimums (44px × 44px)
- Reduced motion support (`prefers-reduced-motion`)
- Focus management for mobile menu
- Screen reader friendly navigation

### Accessibility Features
- **Touch Targets**: All interactive elements meet 44px minimum
- **Reduced Motion**: GSAP animations respect user preferences
- **ARIA Labels**: Video controls, navigation, and thumbnails have descriptive labels
- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Focus Management**: Mobile menu closes on route change
- **Color Contrast**: WCAG AA compliant contrast ratios

### Areas for Enhancement
- Screen reader announcements for video transitions
- Keyboard shortcuts for video navigation
- Focus trap for mobile menu overlay
- Skip to content link

---

## Browser Support

### Modern Browser Features
- CSS Custom Properties
- ES2017+ JavaScript features
- CSS Grid & Flexbox
- Video autoplay (with muted fallback)

### Polyfills
- None currently required
- Modern browser focus

---

## Development Workflow

### Scripts
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run lint` - ESLint checking

### Code Quality
- TypeScript strict mode enabled
- ESLint with Next.js configs
- Prettier formatting (via Tailwind)
- No `any` types allowed (per user rules)

---

## Future Enhancements (Based on User Rules)

### Planned Integrations
- **Sanity CMS** - Content management for projects
- **Supabase** - Database and authentication
- **React Three Fiber** - 3D rendering capabilities
- **Drei** - 3D helpers and utilities

### Testing Strategy
- Unit tests for utilities and hooks
- Integration tests for complex components
- End-to-end tests with Playwright
- Lighthouse performance checks

### Deployment
- Performance thresholds required before deploy
- Lighthouse minimum scores enforced

---

## Design Philosophy

### Visual Style
- **Minimalist**: Clean, uncluttered interfaces
- **Cinematic**: Full-screen video backgrounds
- **Elegant**: Serif logo, refined typography
- **Modern**: Contemporary UI patterns

### User Experience
- **Immersive**: Video-first homepage
- **Intuitive**: Clear navigation and controls
- **Smooth**: GSAP-powered transitions
- **Responsive**: Works across all devices

### Brand Identity
- **SECTA** - Large serif logo (Cormorant Infant)
- **Professional**: Clean, portfolio-focused
- **Creative**: Showcase of visual work
- **Sophisticated**: High-quality production values

