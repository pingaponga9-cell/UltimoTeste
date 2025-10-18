# Educallis Fake News Detector

## Overview

The Educallis Fake News Detector is an educational web application designed to help students analyze the credibility of news websites and detect potential misinformation. Built for Colégio Educallis, the application accepts a URL, fetches and analyzes the website content, and provides a trust score along with detailed indicators of credibility. The tool focuses on teaching critical thinking skills by highlighting various credibility markers such as authorship, publication dates, sensationalist language, and contact information.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework**: React with TypeScript
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Routing**: Wouter (lightweight routing library)
- **State Management**: TanStack Query (React Query) for server state
- **Form Handling**: React Hook Form with Zod validation

**Design System:**
The application implements a comprehensive design system defined in `design_guidelines.md` with:
- Custom color palette supporting both light and dark modes
- Educational blue primary color (200 85% 45%)
- Trust-level colors: Success/Green (trusted), Warning/Orange (questionable), Danger/Red (suspicious)
- Inter font family for professional appearance
- Consistent spacing units (4, 6, 8, 12, 16, 24)
- Component variants using class-variance-authority

**Component Structure:**
- Modular UI components in `/client/src/components/ui/` following Shadcn conventions
- Feature components: `AnalysisForm`, `ResultsDisplay`, `Header`, `ThemeToggle`
- Theme provider for dark/light mode switching
- Toast notifications for user feedback

### Backend Architecture

**Technology Stack:**
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ES Modules
- **Build Tool**: esbuild for production builds
- **Development**: tsx for hot-reloading during development

**API Design:**
The backend exposes a single REST endpoint:
- `POST /api/analyze` - Accepts a URL and returns comprehensive analysis results

**Analysis Engine:**
Located in `/server/analyzer.ts`, the analysis engine:
- Fetches website content using native fetch API with 10-second timeout
- Parses HTML using Cheerio
- Evaluates multiple credibility indicators:
  - Author identification (meta tags, byline elements)
  - Publication date presence and recency
  - Sensationalist language detection (Portuguese keywords)
  - Contact information availability
  - Content structure and organization
- Calculates weighted trust score (0-100)
- Categorizes websites as "trusted", "questionable", or "suspicious"

**Data Validation:**
- Zod schemas in `/shared/schema.ts` for type-safe validation
- Shared between frontend and backend for consistency
- Request validation before processing
- Response validation before sending to client

### Data Storage

**Current Implementation:**
The application uses an in-memory storage implementation (`MemStorage` in `/server/storage.ts`) with a user management interface. While user CRUD operations are defined, the current application flow focuses on URL analysis without persistent user sessions.

**Database Configuration:**
The project is configured for PostgreSQL integration via Drizzle ORM:
- Drizzle configuration in `drizzle.config.ts`
- Schema definition path: `/shared/schema.ts`
- Migration output directory: `/migrations`
- Connection via `DATABASE_URL` environment variable
- Uses `@neondatabase/serverless` for serverless PostgreSQL support

**Design Decision:**
The in-memory storage approach was chosen for rapid prototyping and educational purposes, allowing the application to run without database dependencies. The Drizzle configuration provides a path for future persistence if needed.

### Development Experience

**Build Process:**
- **Development**: Vite dev server with HMR for frontend, tsx watch mode for backend
- **Production**: Vite builds frontend to `/dist/public`, esbuild bundles backend to `/dist`
- **Type Checking**: TypeScript strict mode with path aliases

**Development Tools:**
- Replit-specific plugins for error overlay and cartographer (development only)
- Runtime error modal for better debugging experience
- Automatic reload on file changes

**Path Aliases:**
Configured in both `tsconfig.json` and `vite.config.ts`:
- `@/*` → `/client/src/*`
- `@shared/*` → `/shared/*`
- `@assets/*` → `/attached_assets/*`

### Portuguese Language Support

The application is fully localized for Brazilian Portuguese (`pt-BR`):
- HTML lang attribute set to "pt-BR"
- All UI text and messages in Portuguese
- Sensationalist word detection tailored to Portuguese news patterns
- Date pattern recognition for Portuguese date formats

## External Dependencies

### Third-Party UI Libraries

**Radix UI Primitives:**
The application heavily relies on Radix UI for accessible, unstyled component primitives:
- Dialog, Alert Dialog, Dropdown Menu, Popover for overlays
- Accordion, Tabs, Collapsible for content organization
- Form controls: Checkbox, Radio Group, Select, Slider, Switch
- Navigation Menu, Tooltip, Toast for user interaction
- All components wrapped with custom styling via Shadcn/ui pattern

**Rationale:** Radix UI provides production-ready accessibility and keyboard navigation out of the box, allowing the team to focus on educational content rather than low-level UI implementation.

### Data Fetching and State Management

**TanStack Query (React Query):**
Handles all server state management with features:
- Automatic request deduplication
- Background refetching disabled (`refetchOnWindowFocus: false`)
- Infinite stale time for educational context
- Mutation handling for analysis requests

**Cheerio:**
Server-side HTML parsing library used to extract content from analyzed websites. Chosen for its jQuery-like API familiar to developers and efficient DOM manipulation.

### Form Management

**React Hook Form + Zod:**
- React Hook Form provides performant form state management
- Zod integration via `@hookform/resolvers` for schema validation
- Type-safe form values derived from Zod schemas

### Database Integration (Configured but Optional)

**Drizzle ORM:**
- Type-safe SQL query builder
- PostgreSQL dialect configured
- Schema-first approach with `drizzle-zod` for automatic Zod schema generation
- Migration support via `drizzle-kit`

**Neon Database:**
- Serverless PostgreSQL provider via `@neondatabase/serverless`
- Supports connection pooling and edge deployments
- Compatible with Drizzle ORM

### Styling and Theming

**Tailwind CSS:**
- Utility-first CSS framework
- Custom configuration extending base theme
- CSS variables for theme switching
- PostCSS with Autoprefixer for vendor prefixes

**Additional Utilities:**
- `clsx` and `tailwind-merge` (via `cn` utility) for conditional class composition
- `class-variance-authority` for component variant management

### Date and Time

**date-fns:**
Provides date formatting and manipulation utilities for displaying publication dates in the analysis results.

### Development Dependencies

- **Vite**: Modern frontend build tool with instant HMR
- **esbuild**: Fast JavaScript bundler for production backend builds
- **tsx**: TypeScript execution for development server
- **TypeScript**: Static typing with strict mode enabled

### Fonts

**Google Fonts - Inter:**
Loaded via CDN in `client/index.html` for professional, readable typography across all weights (300-800).