# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**"Learn German"** is a comprehensive mobile language learning application built with React Native and Expo. The app teaches German language through four main sections:
- **Das Alphabet**: Learn German letters and pronunciation with audio
- **Vocabulary**: Chapter-based vocabulary learning with organized topics
- **Grammar**: German grammar lessons with markdown content
- **Quiz**: Interactive quizzes for both vocabulary and grammar practice

## Development Commands

```bash
# Start development server
bun start

# Run on specific platforms
bun run android    # Run on Android device/emulator
bun run ios        # Run on iOS device/simulator
bun run web        # Run in web browser

# Code quality
bun run lint       # Run ESLint

# Reset project (use with caution)
bun run reset-project
```

## Technology Stack

- **Expo SDK 54** with React Native 0.81.4 and TypeScript
- **Expo Router 6.0.12** for file-based routing
- **NativeWind 4.2.1** for Tailwind CSS styling
- **TanStack React Query 5.90.3** for server state management
- **Expo Audio 1.0.13** for alphabet pronunciation audio
- **Llama.rn 0.8.0-rc.0** for on-device AI features

## Architecture Overview

### Routing Structure
The app uses Expo Router with a nested tab navigation structure:
```
app/
├── _layout.tsx              # Root layout with theme and query providers
├── (tabs)/                  # Tab navigation group
│   ├── index.tsx           # Alphabet learning
│   ├── vocabulary.tsx      # Vocabulary chapters list
│   ├── grammar.tsx         # Grammar lessons list
│   └── quiz.tsx           # Quiz selection
├── vocabulary/[id].tsx     # Dynamic vocabulary chapters
├── grammar/[id].tsx        # Dynamic grammar lessons
├── quiz/vocab.tsx         # Vocabulary quiz
└── quiz/grammar.tsx       # Grammar quiz
```

### Key Directories

- **`/components/`** - Reusable UI components (Header, TabBar, Cards, etc.)
- **`/hooks/`** - Custom React Query hooks for API calls
- **`/services/`** - API client and AI service integration
- **`/theme/`** - Custom theming system with "amber" and "ocean" themes
- **`/types/`** - TypeScript type definitions
- **`/constant/`** - Static data including German alphabet with audio
- **`/assets/audio/alphabet/`** - Local pronunciation audio files

### Data Flow

1. **API Integration**: Connects to `https://learn-german-web-9tno.vercel.app/api`
2. **State Management**: React Query for server state, local state for UI
3. **Audio System**: Local audio files for alphabet pronunciation via Expo Audio
4. **AI Integration**: Llama.rn for advanced quiz question generation

## Key Implementation Details

### Theme System
- Dynamic theme switching between amber and ocean
- Theme-aware components using custom theme context
- Comprehensive color tokens with dark/light support

### Audio Features
- Local audio files for each German letter pronunciation
- Expo Audio integration with playback controls
- Text-to-speech support for additional practice

### Quiz System
- Multiple choice questions for vocabulary and grammar
- AI-powered question generation
- Performance tracking and immediate feedback

### Styling Approach
- NativeWind for utility-first styling
- Gradient backgrounds and card-based UI design
- Consistent spacing using Tailwind CSS classes
- Custom component library for reusable UI elements

## API Integration

The app fetches data from a Vercel-hosted backend with React Query for:
- Vocabulary chapters and words
- Grammar lessons content
- Quiz question generation

Type safety is maintained throughout the API layer with comprehensive TypeScript interfaces.
