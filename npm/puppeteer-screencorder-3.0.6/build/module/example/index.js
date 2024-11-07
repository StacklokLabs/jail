import puppeteer from 'puppeteer';
import { PuppeteerScreenRecorder } from '../lib/PuppeteerScreenRecorder';
/** @ignore */
function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}
/** @ignore */
async function testStartMethod(format) {
    const executablePath = process.env['PUPPETEER_EXECUTABLE_PATH'];
    const browser = await puppeteer.launch({
        ...(executablePath ? { executablePath: executablePath } : {}),
        headless: false,
    });
    const page = await browser.newPage();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recorder = new PuppeteerScreenRecorder(page);
    await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
    });
    await recorder.start(format);
    await page.goto('https://developer.mozilla.org/en-US/docs/Web/CSS/animation');
    await sleep(10 * 1000);
    await recorder.stop();
    await browser.close();
}
async function executeSample(format) {
    return testStartMethod(format);
}
executeSample('./report/video/simple1.mp4').then(() => {
    console.log('completed');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZXhhbXBsZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsTUFBTSxXQUFXLENBQUM7QUFFbEMsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFFekUsY0FBYztBQUNkLFNBQVMsS0FBSyxDQUFDLElBQVk7SUFDekIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1FBQzdCLFVBQVUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDNUIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsY0FBYztBQUNkLEtBQUssVUFBVSxlQUFlLENBQUMsTUFBYztJQUMzQyxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUM7SUFDaEUsTUFBTSxPQUFPLEdBQUcsTUFBTSxTQUFTLENBQUMsTUFBTSxDQUFDO1FBQ3JDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDN0QsUUFBUSxFQUFFLEtBQUs7S0FDaEIsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxJQUFJLEdBQUcsTUFBTSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDckMsOERBQThEO0lBQzlELE1BQU0sUUFBUSxHQUFHLElBQUksdUJBQXVCLENBQUMsSUFBVyxDQUFDLENBQUM7SUFDMUQsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ3JCLEtBQUssRUFBRSxJQUFJO1FBQ1gsTUFBTSxFQUFFLElBQUk7UUFDWixpQkFBaUIsRUFBRSxDQUFDO0tBQ3JCLENBQUMsQ0FBQztJQUVILE1BQU0sUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUU3QixNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsNERBQTRELENBQUMsQ0FBQztJQUM5RSxNQUFNLEtBQUssQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFFdkIsTUFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDdEIsTUFBTSxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDeEIsQ0FBQztBQUVELEtBQUssVUFBVSxhQUFhLENBQUMsTUFBTTtJQUNqQyxPQUFPLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNqQyxDQUFDO0FBRUQsYUFBYSxDQUFDLDRCQUE0QixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtJQUNwRCxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzNCLENBQUMsQ0FBQyxDQUFDIn0=