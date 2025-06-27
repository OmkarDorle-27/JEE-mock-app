# Mock Test Application

## Overview

This is a full-stack web application for conducting JEE-style mock tests. The application provides a comprehensive test interface similar to the NTA exam portal, supporting PDF upload for question generation, real-time test taking with timer functionality, and detailed result analysis.

## System Architecture

The application follows a modern full-stack architecture:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: React hooks with local storage persistence
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based (infrastructure ready)
- **API**: RESTful endpoints (to be implemented)
- **File Handling**: PDF parsing for question extraction

### Data Storage
- **Primary Database**: PostgreSQL via Neon Database
- **ORM**: Drizzle ORM with type-safe queries
- **Local Storage**: Test state persistence for recovery
- **Session Storage**: User authentication sessions

## Key Components

### Database Schema
- **Users Table**: User authentication and management
- **Mock Tests Table**: Test metadata and questions storage
- **Test Attempts Table**: Individual test sessions and results
- Questions stored as JSONB for flexibility
- Support for multiple question types (MCQ, numerical, multi-correct)

### Frontend Components
- **PDF Upload Interface**: File upload with drag-and-drop support
- **Test Interface**: Main test-taking environment
- **Question Display**: Adaptive rendering for different question types
- **Timer Component**: Real-time countdown with auto-submit
- **Question Grid**: Visual question palette with status indicators
- **Calculator Keypad**: For numerical answer input
- **Results Modal**: Detailed test analysis and scoring

### Test State Management
- Persistent test state with auto-save functionality
- Local storage backup for recovery
- Real-time answer tracking
- Mark for review functionality
- Subject-wise navigation

## Data Flow

1. **PDF Upload Flow**:
   - User uploads PDF → Frontend parses with PDF.js → Questions extracted → Test initialized
   
2. **Test Taking Flow**:
   - Questions loaded → User navigates/answers → State auto-saved → Timer management → Submit/auto-submit
   
3. **Persistence Flow**:
   - Test state → Local storage (immediate) → Database (periodic) → Recovery on reload

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React, Wouter for routing
- **Component Libraries**: Radix UI primitives, Shadcn/ui components
- **Styling**: Tailwind CSS, class-variance-authority
- **Data Fetching**: TanStack Query for server state
- **PDF Processing**: PDF.js for client-side PDF parsing
- **Icons**: Lucide React icons
- **Forms**: React Hook Form with Zod validation

### Backend Dependencies
- **Server**: Express.js with TypeScript
- **Database**: Drizzle ORM, Neon Database serverless PostgreSQL
- **Development**: TSX for TypeScript execution, Vite for frontend bundling
- **Build**: ESBuild for server bundling

### Development Dependencies
- **TypeScript**: Full type safety across the stack
- **PostCSS**: CSS processing with Autoprefixer
- **Replit Integration**: Custom plugins for development environment

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 runtime
- **Database**: PostgreSQL 16 module enabled
- **Auto-reload**: Vite HMR for frontend, TSX for backend
- **Port Configuration**: Server on port 5000, external port 80

### Production Build
- **Frontend**: Vite production build to `dist/public`
- **Backend**: ESBuild bundle to `dist/index.js`
- **Database**: Drizzle migrations for schema management
- **Deployment**: Autoscale deployment target on Replit

### Database Management
- **Migrations**: Drizzle Kit for schema versioning
- **Environment**: DATABASE_URL configuration required
- **Schema**: Located in `shared/schema.ts` for type sharing

## Changelog

- June 27, 2025 - **Test Name System**: Added test naming with organized file structure (Test Name - Question Paper/Solution/Answer Key)
- June 27, 2025 - **Question Type Toggles**: Added enable/disable switches for single-correct, multi-correct, and numerical questions per subject
- June 27, 2025 - **Excel Integration Enhancement**: Completed comprehensive Excel answer key parsing with multi-format support and validation
- June 27, 2025 - **Website Rename**: Changed from "JEE Mock Test Platform" to "JEE Mock Test Generator" 
- June 27, 2025 - **Platform Simplification**: Removed January analysis and percentile calculator pages, focused on core mock test functionality
- June 27, 2025 - **Marking System Clarification**: Multi-correct questions award +4 when all correct options selected, +1 per correct option otherwise, -2 for any wrong selection
- June 27, 2025 - **Major System Overhaul**: Integrated existing website content with comprehensive mock test system
- June 27, 2025 - **PDF Viewer Integration**: Replaced question parsing with direct PDF viewing approach for better accuracy
- June 27, 2025 - **Advanced Configuration**: Added question range selection, custom marking schemes, and test duration settings
- June 27, 2025 - **Multi-page Website**: Added January attempt analysis, percentile calculator, and navigation system
- June 27, 2025 - **Professional Interface**: Created JEE Mains Analysis Hub with topic-wise data and performance insights
- June 27, 2025 - **Test Configuration**: Question type ranges (single-correct, multi-correct, numerical) with custom marks
- June 27, 2025 - **PDF Controls**: Zoom, rotate, download functionality with question navigation
- June 27, 2025 - Enhanced PDF parsing with better question detection and option extraction
- June 27, 2025 - Added professional home page with navigation and feature overview
- June 27, 2025 - Fixed routing system to support both home page and mock test interface
- June 27, 2025 - Improved question type detection (MCQ vs numerical) with keyword analysis
- June 27, 2025 - Added debugging and error handling for PDF processing
- June 27, 2025 - Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.