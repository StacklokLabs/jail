"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const PuppeteerScreenRecorder_1 = require("../lib/PuppeteerScreenRecorder");
/** @ignore */
function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}
/** @ignore */
async function testStartMethod(format) {
    const executablePath = process.env['PUPPETEER_EXECUTABLE_PATH'];
    const browser = await puppeteer_1.default.launch(Object.assign(Object.assign({}, (executablePath ? { executablePath: executablePath } : {})), { headless: false }));
    const page = await browser.newPage();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recorder = new PuppeteerScreenRecorder_1.PuppeteerScreenRecorder(page);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZXhhbXBsZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDBEQUFrQztBQUVsQyw0RUFBeUU7QUFFekUsY0FBYztBQUNkLFNBQVMsS0FBSyxDQUFDLElBQVk7SUFDekIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1FBQzdCLFVBQVUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDNUIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsY0FBYztBQUNkLEtBQUssVUFBVSxlQUFlLENBQUMsTUFBYztJQUMzQyxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUM7SUFDaEUsTUFBTSxPQUFPLEdBQUcsTUFBTSxtQkFBUyxDQUFDLE1BQU0saUNBQ2pDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQzdELFFBQVEsRUFBRSxLQUFLLElBQ2YsQ0FBQztJQUNILE1BQU0sSUFBSSxHQUFHLE1BQU0sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3JDLDhEQUE4RDtJQUM5RCxNQUFNLFFBQVEsR0FBRyxJQUFJLGlEQUF1QixDQUFDLElBQVcsQ0FBQyxDQUFDO0lBQzFELE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUNyQixLQUFLLEVBQUUsSUFBSTtRQUNYLE1BQU0sRUFBRSxJQUFJO1FBQ1osaUJBQWlCLEVBQUUsQ0FBQztLQUNyQixDQUFDLENBQUM7SUFFSCxNQUFNLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFN0IsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLDREQUE0RCxDQUFDLENBQUM7SUFDOUUsTUFBTSxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBRXZCLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3RCLE1BQU0sT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3hCLENBQUM7QUFFRCxLQUFLLFVBQVUsYUFBYSxDQUFDLE1BQU07SUFDakMsT0FBTyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDakMsQ0FBQztBQUVELGFBQWEsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7SUFDcEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUMzQixDQUFDLENBQUMsQ0FBQyJ9