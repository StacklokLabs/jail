import { FfmpegCommand } from 'fluent-ffmpeg';
export declare function MP4(preset?: 'ultrafast' | 'superfast' | 'veryfast' | 'faster' | 'fast' | 'medium' | 'slow' | 'slower' | 'veryslow', videoCodec?: string): (ffmpeg: FfmpegCommand) => Promise<void>;
