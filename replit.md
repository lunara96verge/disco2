# Discobeak - Funky Disco Vibes & Retro Style

## Overview

Discobeak is a fully static website for a vibrant, fun brand that fuses retro disco culture with modern creativity. The site serves as an e-commerce platform showcasing funky disco-themed merchandise including apparel, accessories, and retro-inspired goods. Built with a playful disco duck mascot and bright, energetic design aesthetics, the website captures the essence of 1970s disco culture while maintaining modern web standards.

The site features a complete product catalog, engaging blog content about disco culture, and a brand story that emphasizes fun, nostalgia, and creative expression. All functionality is client-side only, making it a pure static website suitable for simple hosting solutions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The website uses a **pure static architecture** with no backend dependencies:
- **HTML5** for semantic markup and structure
- **Tailwind CSS** via CDN for utility-first styling
- **Vanilla JavaScript** for interactive features and animations
- **Directory-based routing** using `/folder/index.html` structure to hide file extensions

### Design System
- **Custom disco color palette** defined in CSS variables (disco-pink, disco-purple, disco-gold, etc.)
- **Typography hierarchy** using Google Fonts (Orbitron for headlines, Quicksand for body text)
- **Animated elements** including a disco duck mascot with CSS keyframe animations
- **Responsive design** with mobile-first approach using Tailwind's breakpoint system

### Content Architecture
The site follows a **hierarchical content structure**:
- **Homepage** (`/`) - Brand introduction, product previews, blog teasers
- **About page** (`/about/`) - Brand story and mission
- **Shop section** (`/shop/`) - Product catalog with individual product pages
- **Blog section** (`/blog/`) - Content marketing with disco culture articles
- **Individual product pages** (`/shop/[product-name]/`) - Detailed product information

### Interactive Features
- **Mobile navigation** with JavaScript-driven menu toggle
- **Animated disco duck** mascot with click interactions
- **Mock e-commerce** functionality (visual-only cart buttons)
- **CSS animations** for background patterns and visual effects

### File Organization
- **Assets separated by type** - CSS in `/css/`, JavaScript in `/js/`
- **Content organized by section** - each major section has its own directory
- **SEO-optimized** structure with proper meta descriptions and semantic HTML

## External Dependencies

### CDN Services
- **Tailwind CSS** - Utility-first CSS framework delivered via CDN
- **Font Awesome** - Icon library for UI elements and decorative icons
- **Google Fonts** - Custom typography (Orbitron and Quicksand font families)

### Design Assets
- **Emoji-based mascot** - Uses Unicode duck emoji (🦆) as brand mascot
- **CSS-generated graphics** - All visual effects created with pure CSS (gradients, animations)
- **Placeholder content** - Mock product images and content for demonstration

### Browser APIs
- **DOM Manipulation** - Standard JavaScript for interactive features
- **CSS Animations** - Native browser animation capabilities
- **Responsive Images** - HTML5 responsive image techniques

The architecture prioritizes simplicity, performance, and maintainability while delivering a visually engaging user experience that captures the fun, energetic spirit of disco culture.