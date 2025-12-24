# Image to Video

React Native Expo app for converting images into slideshow videos with transitions.

## Features

- Select 3-5 images from device gallery
- Configure resolution (720p/1080p), duration (2-4s per image), transitions
- Transition effects: Crossfade, Ken Burns (zoom/pan), Slide
- Real-time rendering progress
- Save to gallery or share

## Tech Stack

- React Native + Expo SDK 54
- TypeScript
- Zustand (state management)
- FFmpeg (ffmpeg-kit-react-native-alt)
- React Navigation

## Project Structure

```
src/
├── components/       # Reusable UI (Button, ProgressBar, ImageThumbnail, OptionSelector)
├── constants/        # App constants and colors
├── navigation/       # React Navigation config
├── screens/          # Screen components
├── services/         # Video rendering logic
├── store/            # Zustand store with slices
├── types/            # TypeScript definitions
└── utils/            # Helper functions
```

## Path Aliases

Import aliases configured via babel-plugin-module-resolver:

```typescript
import { Button } from '@/components';
import { colors } from '@/constants';
import { videoRenderer } from '@/services';
import { useAppStore } from '@/store';
```

## Setup

```bash
# Install dependencies
npm install

# Prebuild native code (required for FFmpeg)
npx expo prebuild

# Run iOS
npx expo run:ios

# Run Android
npx expo run:android
```

> Requires development build. Expo Go does not support FFmpeg.

## Scripts

```bash
npm start           # Start dev server
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint issues
npm run format      # Format with Prettier
npx tsc --noEmit    # Type check
```

## Video Rendering

Uses h264_videotoolbox (iOS hardware encoder):

1. Images copied to temp directory
2. FFmpeg filter_complex builds transitions
3. xfade filters for crossfade/slide effects
4. zoompan filter for Ken Burns effect
5. Output: H.264 MP4 @ 30fps
