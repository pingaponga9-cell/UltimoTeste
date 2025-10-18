# Design Guidelines: Educallis Fake News Detector

## Design Approach
**System-Based Approach** using clean, professional UI patterns optimized for educational tools. Drawing from Material Design principles for credibility indicators and Tailwind's utility-first approach for rapid, consistent implementation.

**Key Principles:**
- Trust & Credibility: Professional appearance to match the serious nature of fact-checking
- Clarity: Clear communication of analysis results
- Educational: Help users understand *why* content might be problematic

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Primary: 200 85% 45% (Educational blue from logo)
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Success (Trusted): 142 76% 36%
- Warning (Questionable): 38 92% 50%
- Danger (Suspicious): 0 84% 60%
- Text Primary: 220 13% 13%
- Text Secondary: 220 9% 46%

**Dark Mode:**
- Primary: 200 85% 55%
- Background: 222 47% 11%
- Surface: 217 33% 17%
- Success: 142 71% 45%
- Warning: 38 92% 60%
- Danger: 0 84% 70%
- Text Primary: 210 20% 98%
- Text Secondary: 215 16% 65%

### B. Typography
- **Primary Font:** Inter (Google Fonts) - clean, professional, excellent readability
- **Headings:** Font weights 700-800, sizes from text-2xl to text-4xl
- **Body:** Font weight 400, text-base to text-lg
- **Labels/Captions:** Font weight 500-600, text-sm

### C. Layout System
**Spacing Units:** Consistently use 4, 6, 8, 12, 16, 24 (p-4, p-6, p-8, m-12, py-16, py-24)
- Container: max-w-4xl for main content, max-w-6xl for wide layouts
- Section padding: py-16 on desktop, py-12 on mobile
- Card spacing: p-6 to p-8
- Grid gaps: gap-6 for card grids

### D. Component Library

**Header:**
- Fixed navigation with Educallis logo (left-aligned)
- Clean white/dark background with subtle shadow
- Team credits link in navigation (right side)
- Height: h-16 to h-20

**Hero Section:**
- Centered layout with gradient background (primary color subtle gradient)
- Main heading explaining the tool's purpose
- Subheading about fighting misinformation
- URL input form prominently featured
- No hero image (utility-focused tool)

**URL Analysis Form:**
- Large text input with placeholder "Digite a URL do site para análise..."
- Prominent "Analisar" button (primary color, rounded-lg)
- Loading state with spinner during analysis
- Form container with elevated card styling (shadow-lg)

**Results Display:**
- Color-coded header based on trust score:
  - Green: "Confiável" (70-100%)
  - Yellow: "Questionável" (40-69%)
  - Red: "Suspeito" (0-39%)
- Trust score displayed as large percentage with circular progress indicator
- Grid of indicator cards (grid-cols-1 md:grid-cols-2 gap-6):
  - Author presence ✓/✗
  - Publication date ✓/✗
  - Sources cited ✓/✗
  - Sensationalist language detected ✓/✗
- Each indicator card: icon, label, status, brief explanation
- Detailed findings section with expandable accordion items

**Credits Section:**
- Footer placement or dedicated modal/sidebar
- List all team members with equal prominence
- Clean typography, grouped presentation
- Subtle background differentiation

**Footer:**
- Educational disclaimer about the tool's limitations
- Links to methodology explanation
- Copyright/attribution
- Dark subtle background

### E. Animations
- Minimal, purposeful animations only:
- Form submission: Button loading state (spinner)
- Results appearance: Subtle fade-in (duration-300)
- Accordion expansion: Smooth height transition
- No decorative animations

## Images
**No hero images needed.** This is a utility-focused tool where function trumps visual storytelling. The logo provides brand identity, and the clean interface should speak for itself.

**Icon Strategy:** Use Heroicons (via CDN) for all interface icons - checkmarks, X marks, warning triangles, info circles, etc.

## Special Considerations
- Responsive design: Mobile-first approach, stacks to single column on small screens
- Accessibility: Proper ARIA labels for screen readers, color isn't sole indicator of status
- Performance: Fast loading, instant feedback for user actions
- Brazilian Portuguese: All copy in PT-BR, culturally appropriate tone