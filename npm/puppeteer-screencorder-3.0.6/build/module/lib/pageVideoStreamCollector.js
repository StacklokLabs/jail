import { EventEmitter } from 'events';
/**
 * @ignore
 */
export class pageVideoStreamCollector extends EventEmitter {
    page;
    options;
    sessionsStack = [];
    isStreamingEnded = false;
    isFrameAckReceived;
    constructor(page, options) {
        super();
        this.page = page;
        this.options = options;
    }
    get shouldFollowPopupWindow() {
        return this.options.followNewTab;
    }
    async getPageSession(page) {
        try {
            const context = page.target();
            return await context.createCDPSession();
        }
        catch (error) {
            console.log('Failed to create CDP Session', error);
            return null;
        }
    }
    getCurrentSession() {
        return this.sessionsStack[this.sessionsStack.length - 1];
    }
    addListenerOnTabOpens(page) {
        page.on('popup', (newPage) => this.registerTabListener(newPage));
    }
    removeListenerOnTabClose(page) {
        page.off('popup', (newPage) => this.registerTabListener(newPage));
    }
    async registerTabListener(newPage) {
        await this.startSession(newPage);
        newPage.once('close', async () => await this.endSession());
    }
    async startScreenCast(shouldDeleteSessionOnFailure = false) {
        const currentSession = this.getCurrentSession();
        const quality = Number.isNaN(this.options.quality)
            ? 100
            : Math.max(Math.min(this.options.quality, 100), 0);
        try {
            await currentSession.send('Animation.setPlaybackRate', {
                playbackRate: 1,
            });
            await currentSession.send('Page.startScreencast', {
                everyNthFrame: 1,
                format: this.options.format || 'jpeg',
                quality: quality,
            });
        }
        catch (e) {
            if (shouldDeleteSessionOnFailure) {
                this.endSession();
            }
        }
    }
    async stopScreenCast() {
        const currentSession = this.getCurrentSession();
        if (!currentSession) {
            return;
        }
        await currentSession.send('Page.stopScreencast');
    }
    async startSession(page) {
        const pageSession = await this.getPageSession(page);
        if (!pageSession) {
            return;
        }
        await this.stopScreenCast();
        this.sessionsStack.push(pageSession);
        this.handleScreenCastFrame(pageSession);
        await this.startScreenCast(true);
    }
    async handleScreenCastFrame(session) {
        this.isFrameAckReceived = new Promise((resolve) => {
            session.on('Page.screencastFrame', async ({ metadata, data, sessionId }) => {
                if (!metadata.timestamp || this.isStreamingEnded) {
                    return resolve();
                }
                const ackPromise = session.send('Page.screencastFrameAck', {
                    sessionId: sessionId,
                });
                this.emit('pageScreenFrame', {
                    blob: Buffer.from(data, 'base64'),
                    timestamp: metadata.timestamp,
                });
                try {
                    await ackPromise;
                }
                catch (error) {
                    console.error('Error in sending Acknowledgment for PageScreenCast', error.message);
                }
            });
        });
    }
    async endSession() {
        this.sessionsStack.pop();
        await this.startScreenCast();
    }
    async start() {
        await this.startSession(this.page);
        this.page.once('close', async () => await this.endSession());
        if (this.shouldFollowPopupWindow) {
            this.addListenerOnTabOpens(this.page);
        }
    }
    async stop() {
        if (this.isStreamingEnded) {
            return this.isStreamingEnded;
        }
        if (this.shouldFollowPopupWindow) {
            this.removeListenerOnTabClose(this.page);
        }
        await Promise.race([
            this.isFrameAckReceived,
            new Promise((resolve) => setTimeout(resolve, 1000)),
        ]);
        this.isStreamingEnded = true;
        try {
            for (const currentSession of this.sessionsStack) {
                await currentSession.detach();
            }
        }
        catch (e) {
            console.warn('Error detaching session', e.message);
        }
        return true;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZVZpZGVvU3RyZWFtQ29sbGVjdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9wYWdlVmlkZW9TdHJlYW1Db2xsZWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLFFBQVEsQ0FBQztBQU10Qzs7R0FFRztBQUNILE1BQU0sT0FBTyx3QkFBeUIsU0FBUSxZQUFZO0lBQ2hELElBQUksQ0FBTztJQUNYLE9BQU8sQ0FBaUM7SUFDeEMsYUFBYSxHQUFrQixFQUFFLENBQUM7SUFDbEMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO0lBRXpCLGtCQUFrQixDQUFnQjtJQUUxQyxZQUFZLElBQVUsRUFBRSxPQUF1QztRQUM3RCxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxJQUFZLHVCQUF1QjtRQUNqQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO0lBQ25DLENBQUM7SUFFTyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQVU7UUFDckMsSUFBSTtZQUNGLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUM5QixPQUFPLE1BQU0sT0FBTyxDQUFDLGdCQUFnQixFQUFFLENBQUM7U0FDekM7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDbkQsT0FBTyxJQUFJLENBQUM7U0FDYjtJQUNILENBQUM7SUFFTyxpQkFBaUI7UUFDdkIsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFTyxxQkFBcUIsQ0FBQyxJQUFV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