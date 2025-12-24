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

Platform-specific video encoders:
- **iOS:** `h264_videotoolbox` (hardware accelerated)
- **Android:** `mpeg4` (software encoder)

1. Images copied to temp directory
2. FFmpeg filter_complex builds transitions
3. xfade filters for crossfade/slide effects
4. zoompan filter for Ken Burns effect
5. Output: MP4 @ 30fps

## FFmpeg Kit Fix (January 2025)

The original `ffmpeg-kit-react-native` package from arthenica was retired and all Maven/CocoaPods artifacts were removed in January 2025. This project uses `ffmpeg-kit-react-native-alt` with a patch to restore functionality.

### Solution

**iOS:** Uses `ffmpeg-kit-react-native-alt@6.0.6` which depends on `ffmpeg-kit-ios-https-alt` (available in CocoaPods).

**Android:** Uses `ffmpeg-kit-react-native-alt` with a patch that:
1. Adds alternative Maven repository: `https://repo.moizhassan.com/releases`
2. Replaces the deleted `com.arthenica:ffmpeg-kit-https:6.0-2` with `com.moizhassan.ffmpeg:ffmpeg-kit-16kb:6.0.0`

### Patch Location

The patch is located at: `patches/ffmpeg-kit-react-native-alt+6.0.6.patch`

### How to Apply

The patch is automatically applied on `npm install` via `patch-package`:

```json
{
  "scripts": {
    "postinstall": "patch-package"
  }
}
```

### Manual Patch Application

If you need to recreate the patch:

```bash
# Make changes to node_modules/ffmpeg-kit-react-native-alt/android/build.gradle
npx patch-package ffmpeg-kit-react-native-alt
```

### Patch Content

Changes to `android/build.gradle`:

```gradle
repositories {
  mavenCentral()
  google()
  // Alternative Maven repository for ffmpeg-kit (arthenica removed original artifacts)
  maven { url 'https://jitpack.io' }
  maven { url 'https://repo.moizhassan.com/releases' }
  // ... rest of repositories
}

dependencies {
  api 'com.facebook.react:react-native:+'
  // Use alternative Maven source (arthenica artifacts were deleted January 2025)
  implementation 'com.moizhassan.ffmpeg:ffmpeg-kit-16kb:6.0.0'
}
```
