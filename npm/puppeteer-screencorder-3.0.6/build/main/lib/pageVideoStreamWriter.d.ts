/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { EventEmitter } from 'events';
import { Writable } from 'stream';
import { pageScreenFrame, VideoOptions } from './pageVideoStreamTypes';
/**
 * @ignore
 */
export default class PageVideoStreamWriter extends EventEmitter {
    private readonly screenLimit;
    private screenCastFrames;
    duration: string;
    frameGain: number;
    frameLoss: number;
    private status;
    private options;
    private videoMediatorStream;
    private writerPromise;
    constructor(destinationSource: string | Writable, options?: VideoOptions);
    private get videoFrameSize();
    private get autopad();
    private getFfmpegPath;
    private getDestinationPathExtension;
    private configureFFmPegPath;
    private isWritableStream;
    private configureVideoFile;
    private configureVideoWritableStream;
    private getOutputOption;
    private addVideoMetadata;
    private getDestinationStream;
    private handleWriteStreamError;
    private findSlot;
    insert(frame: pageScreenFrame): void;
    private trimFrame;
    private processFrameBeforeWrite;
    write(data: Buffer, durationSeconds?: number): void;
    private drainFrames;
    stop(stoppedTime?: number): Promise<boolean>;
}
