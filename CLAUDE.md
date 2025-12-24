# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
npm start

# Run on iOS (requires development build)
npx expo run:ios

# Run on Android (requires development build)
npx expo run:android

# Create native project files
npx expo prebuild

# Type checking
npx tsc --noEmit
```

## Architecture Overview

### State Management (Zustand)

Uses slice pattern for scalable state management:

```
src/store/
├── slices/
│   ├── imagesSlice.ts    # Selected images state
│   ├── settingsSlice.ts  # Export settings state
│   └── renderingSlice.ts # Rendering progress state
└── useAppStore.ts        # Combined store with typed selectors
```

**Best practices followed:**
- Separate slices for different concerns
- Typed selectors for performance (`useImages()`, `useSettings()`, etc.)
- Action selectors to avoid unnecessary re-renders

### Video Rendering Service

`src/services/videoRenderer.ts` handles FFmpeg video encoding:

- Creates temporary directory for image processing
- Builds FFmpeg filter_complex chains for transitions
- Supports progress callbacks and cancellation
- Uses expo-file-system v19 class-based API (`File`, `Directory`, `Paths`)

### Screen Flow

1. **ImageSelectionScreen** - Select 3-5 images
2. **ExportSettingsScreen** - Configure resolution, duration, transition
3. **RenderingScreen** - Progress display with cancel option
4. **ResultScreen** - Preview, save, share

### Key Dependencies

- `@apescoding/ffmpeg-kit-react-native` - Video encoding (community fork with working binaries)
- `expo-file-system` - File operations (v19 class-based API)
- `expo-video` - Video playback
- `expo-image-picker` - Image selection
- `expo-media-library` - Save to gallery
- `expo-sharing` - Native share sheet

## Important Notes

- **Expo Go not supported** - FFmpeg requires native modules, use development build
- **expo-file-system v19** uses new class-based API (`new File()`, `new Directory()`)
- FFmpeg filter chains are space-sensitive - be careful with string formatting
- Original ffmpeg-kit releases removed from GitHub - using @apescoding fork
