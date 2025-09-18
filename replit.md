# Sarathi - The Treasure Hunter's Path

## Overview

Sarathi is an offline-first Progressive Web App (PWA) designed as "The Treasure Hunter's Path" - a gamified learning platform for rural education. Each subject is a "Treasure Map" and each topic is a "Small Treasure". Students follow a "Clue Trail" of lessons, completing mini-game challenges to collect clues. After gathering all clues for a topic, they face a final challenge to unlock the treasure. The platform combines interactive educational content with adventure-game elements to engage students in subjects like Biology, with comprehensive progress tracking and achievement systems.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Components**: Radix UI primitives with shadcn/ui component system for accessible, customizable components
- **Styling**: Tailwind CSS with CSS custom properties for theming and responsive design
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database ORM**: Drizzle ORM with PostgreSQL for type-safe database operations
- **Database Provider**: Neon serverless PostgreSQL for scalable cloud database hosting
- **API Design**: RESTful APIs with structured error handling and request logging middleware
- **Session Management**: Express sessions with PostgreSQL session storage

### Progressive Web App Features
- **Service Worker**: Cache-first strategy for offline functionality
- **Web App Manifest**: Full PWA support with installable app experience
- **Offline Storage**: Browser-based caching for educational content and user progress
- **Connection Awareness**: Real-time online/offline status indicators

### Game Engine Integration
- **Game Framework**: Phaser.js for interactive educational simulations
- **Game Architecture**: Modular scene-based system for different educational topics
- **Asset Management**: Optimized loading and caching of game assets

### Data Management
- **Schema Design**: Comprehensive user progress tracking with missions, phases, and scoring
- **Content Structure**: JSON-based educational content for easy updates and localization
- **Progress Persistence**: Local storage with server synchronization when online
- **User Analytics**: XP, streak tracking, badge systems, and level progression

### External Dependencies

- **Database**: Neon PostgreSQL serverless database for persistent data storage
- **UI Components**: Radix UI ecosystem for accessible component primitives
- **Game Engine**: Phaser.js for interactive educational simulations
- **Build Tools**: Vite for development server and production builds
- **TypeScript**: Static type checking for enhanced code quality
- **Validation**: Zod for runtime type validation and schema parsing
- **Styling**: Tailwind CSS for utility-first styling approach

The architecture prioritizes offline functionality, educational engagement, and scalability while maintaining simplicity for rural deployment scenarios with intermittent internet connectivity.