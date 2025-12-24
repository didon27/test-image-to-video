import { FFmpegKit, FFmpegKitConfig, ReturnCode } from 'ffmpeg-kit-react-native-alt';
import type { Statistics } from 'ffmpeg-kit-react-native-alt';
import { Paths, File, Directory } from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { Platform } from 'react-native';

import { SelectedImage, ExportSettings, TransitionType } from '@/types';
import { RESOLUTIONS, TRANSITION_DURATION, VIDEO_FPS, VIDEO_BITRATE } from '@/constants';

export interface RenderCallbacks {
  onProgress: (progress: number) => void;
  onComplete: (outputUri: string) => void;
  onError: (error: string) => void;
}

class VideoRendererService {
  private currentSessionId: number | null = null;
  private isCancelled = false;
  private isRendering = false;

  async renderVideo(
    images: SelectedImage[],
    settings: ExportSettings,
    callbacks: RenderCallbacks
  ): Promise<void> {
    this.isCancelled = false;
    this.isRendering = true;
    this.currentSessionId = null;
    const { resolution, imageDuration, transitionType } = settings;
    const { width, height } = RESOLUTIONS[resolution];

    let tempDir: Directory | null = null;

    try {
      // Create temp directory for processing
      const timestamp = Date.now();
      tempDir = new Directory(Paths.cache, `video_render_${timestamp}`);
      tempDir.create();

      // Prepare images - copy to temp with proper naming
      const preparedImages = await this.prepareImages(images, tempDir);

      if (this.isCancelled) {
        this.cleanup(tempDir);
        return;
      }

      // Build FFmpeg command based on transition type
      const outputFile = new File(tempDir, 'output.mp4');
      // FFmpeg needs absolute path without file:// prefix
      let outputPath = outputFile.uri;
      if (outputPath.startsWith('file://')) {
        outputPath = outputPath.substring(7);
      }
      console.log('Output path:', outputPath);
      const command = this.buildFFmpegCommand(
        preparedImages,
        outputPath,
        width,
        height,
        imageDuration,
        transitionType
      );

      // Enable statistics callback for progress
      const totalDuration = images.length * imageDuration;
      FFmpegKitConfig.enableStatisticsCallback((statistics: Statistics) => {
        const time = statistics.getTime() / 1000; // Convert to seconds
        const progress = Math.min((time / totalDuration) * 100, 99);
        callbacks.onProgress(progress);
      });

      // Execute FFmpeg command
      console.log('FFmpeg command:', command);
      const session = await FFmpegKit.execute(command);
      this.currentSessionId = session.getSessionId();

      const returnCode = await session.getReturnCode();

      if (this.isCancelled) {
        this.cleanup(tempDir);
        return;
      }

      if (ReturnCode.isSuccess(returnCode)) {
        // Move output to permanent location
        const finalOutputFile = new File(Paths.document, `slideshow_${timestamp}.mp4`);
        outputFile.move(finalOutputFile);

        this.cleanup(tempDir);
        this.isRendering = false;
        callbacks.onProgress(100);
        callbacks.onComplete(finalOutputFile.uri);
      } else if (ReturnCode.isCancel(returnCode)) {
        console.log('FFmpeg was cancelled');
        this.cleanup(tempDir);
        this.isRendering = false;
        return;
      } else {
        const logs = await session.getAllLogsAsString();
        // Extract only the error part, skip the configuration info
        const errorLines = logs.split('\n');
        const errorStart = errorLines.findIndex((line: string) =>
          line.includes('Error') || line.includes('error') || line.includes('Invalid') || line.includes('No such file')
        );
        const relevantLogs = errorStart >= 0
          ? errorLines.slice(errorStart).join('\n').substring(0, 500)
          : logs.substring(logs.length - 500);
        throw new Error(`FFmpeg error: ${relevantLogs}`);
      }
    } catch (error) {
      if (tempDir) {
        this.cleanup(tempDir);
      }
      this.isRendering = false;
      if (!this.isCancelled) {
        callbacks.onError(error instanceof Error ? error.message : 'Unknown error occurred');
      }
    }
  }

  async cancelRendering(): Promise<void> {
    console.log('Cancelling rendering, sessionId:', this.currentSessionId);
    this.isCancelled = true;
    this.isRendering = false;

    // Cancel all running FFmpeg sessions
    try {
      await FFmpegKit.cancel();
      console.log('FFmpegKit.cancel() called successfully');
    } catch (error) {
      console.warn('Error cancelling FFmpeg:', error);
    }

    this.currentSessionId = null;
  }

  private async prepareImages(images: SelectedImage[], tempDir: Directory): Promise<string[]> {
    const preparedPaths: string[] = [];

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const sourceUri = image.uri.toLowerCase();
      const isHeic = sourceUri.endsWith('.heic') || sourceUri.endsWith('.heif');

      console.log('Processing image:', image.uri, 'isHeic:', isHeic);

      let finalUri: string;

      if (isHeic) {
        // Convert HEIC to JPEG using ImageManipulator
        console.log('Converting HEIC to JPEG...');
        const manipulated = await ImageManipulator.manipulateAsync(
          image.uri,
          [],
          { format: ImageManipulator.SaveFormat.JPEG, compress: 0.9 }
        );
        finalUri = manipulated.uri;
        console.log('Converted to:', finalUri);
      } else {
        finalUri = image.uri;
      }

      const outputFileName = `image_${i.toString().padStart(3, '0')}.jpg`;
      const outputFile = new File(tempDir, outputFileName);

      // Copy image to temp directory
      const sourceFile = new File(finalUri);
      console.log('Source file exists:', sourceFile.exists);

      sourceFile.copy(outputFile);

      console.log('Output file exists:', outputFile.exists, 'size:', outputFile.size);

      // FFmpeg needs absolute path without file:// prefix
      let filePath = outputFile.uri;
      if (filePath.startsWith('file://')) {
        filePath = filePath.substring(7);
      }
      console.log('Prepared image path:', filePath);
      preparedPaths.push(filePath);
    }

    return preparedPaths;
  }

  private buildFFmpegCommand(
    imagePaths: string[],
    outputPath: string,
    width: number,
    height: number,
    imageDuration: number,
    transitionType: TransitionType
  ): string {
    const inputs = imagePaths.map((path) => `-loop 1 -t ${imageDuration} -i "${path}"`).join(' ');

    let filterComplex: string;

    switch (transitionType) {
      case 'crossfade':
        filterComplex = this.buildCrossfadeFilter(imagePaths.length, width, height, imageDuration);
        break;
      case 'kenburns':
        filterComplex = this.buildKenBurnsFilter(imagePaths.length, width, height, imageDuration);
        break;
      case 'slide':
        filterComplex = this.buildSlideFilter(imagePaths.length, width, height, imageDuration);
        break;
      default:
        filterComplex = this.buildCrossfadeFilter(imagePaths.length, width, height, imageDuration);
    }

    // Use platform-specific encoder: h264_videotoolbox for iOS, mpeg4 for Android (software encoder)
    const encoder = Platform.OS === 'ios' ? 'h264_videotoolbox' : 'mpeg4';
    return `${inputs} -filter_complex "${filterComplex}" -map "[outv]" -c:v ${encoder} -pix_fmt yuv420p -r ${VIDEO_FPS} -b:v ${VIDEO_BITRATE} -y "${outputPath}"`;
  }

  private buildCrossfadeFilter(
    imageCount: number,
    width: number,
    height: number,
    imageDuration: number
  ): string {
    const filters: string[] = [];
    const transitionDuration = TRANSITION_DURATION;

    // Scale and pad each input to target resolution
    for (let i = 0; i < imageCount; i++) {
      filters.push(
        `[${i}:v]scale=${width}:${height}:force_original_aspect_ratio=decrease,` +
          `pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:black,setsar=1[v${i}]`
      );
    }

    // Apply crossfade transitions
    if (imageCount === 1) {
      filters.push(`[v0]copy[outv]`);
    } else {
      let prevOutput = 'v0';
      for (let i = 1; i < imageCount; i++) {
        const offset = i * imageDuration - i * transitionDuration;
        const outputLabel = i === imageCount - 1 ? 'outv' : `cf${i}`;
        filters.push(
          `[${prevOutput}][v${i}]xfade=transition=fade:duration=${transitionDuration}:offset=${offset}[${outputLabel}]`
        );
        prevOutput = outputLabel;
      }
    }

    return filters.join(';');
  }

  private buildKenBurnsFilter(
    imageCount: number,
    width: number,
    height: number,
    imageDuration: number
  ): string {
    const filters: string[] = [];
    const fps = VIDEO_FPS;
    const totalFrames = imageDuration * fps;

    // Ken Burns effect: zoom in or out while panning
    for (let i = 0; i < imageCount; i++) {
      const direction = i % 2 === 0 ? 1 : -1; // Alternate zoom in/out
      const startZoom = direction === 1 ? 1 : 1.2;
      const endZoom = direction === 1 ? 1.2 : 1;

      filters.push(
        `[${i}:v]scale=${width * 2}:${height * 2},` +
          `zoompan=z='${startZoom}+(${endZoom}-${startZoom})*on/${totalFrames}':` +
          `x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':` +
          `d=${totalFrames}:s=${width}x${height}:fps=${fps},setsar=1[v${i}]`
      );
    }

    // Apply crossfade transitions between Ken Burns clips
    if (imageCount === 1) {
      filters.push(`[v0]copy[outv]`);
    } else {
      const transitionDuration = TRANSITION_DURATION;
      let prevOutput = 'v0';
      for (let i = 1; i < imageCount; i++) {
        const offset = i * imageDuration - i * transitionDuration;
        const outputLabel = i === imageCount - 1 ? 'outv' : `cf${i}`;
        filters.push(
          `[${prevOutput}][v${i}]xfade=transition=fade:duration=${transitionDuration}:offset=${offset}[${outputLabel}]`
        );
        prevOutput = outputLabel;
      }
    }

    return filters.join(';');
  }

  private buildSlideFilter(
    imageCount: number,
    width: number,
    height: number,
    imageDuration: number
  ): string {
    const filters: string[] = [];
    const transitionDuration = TRANSITION_DURATION;

    // Scale and pad each input
    for (let i = 0; i < imageCount; i++) {
      filters.push(
        `[${i}:v]scale=${width}:${height}:force_original_aspect_ratio=decrease,` +
          `pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:black,setsar=1[v${i}]`
      );
    }

    // Apply slide transitions
    if (imageCount === 1) {
      filters.push(`[v0]copy[outv]`);
    } else {
      let prevOutput = 'v0';
      const slideTypes = ['slideleft', 'slideright', 'slideup', 'slidedown'];
      for (let i = 1; i < imageCount; i++) {
        const offset = i * imageDuration - i * transitionDuration;
        const outputLabel = i === imageCount - 1 ? 'outv' : `sl${i}`;
        const slideType = slideTypes[i % slideTypes.length];
        filters.push(
          `[${prevOutput}][v${i}]xfade=transition=${slideType}:duration=${transitionDuration}:offset=${offset}[${outputLabel}]`
        );
        prevOutput = outputLabel;
      }
    }

    return filters.join(';');
  }

  private cleanup(tempDir: Directory): void {
    try {
      if (tempDir.exists) {
        tempDir.delete();
      }
    } catch (error) {
      console.warn('Failed to cleanup temp directory:', error);
    }
  }
}

export const videoRenderer = new VideoRendererService();
