"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFixture = exports.initFixtureRouter = exports.FixtureRouter = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
class FixtureRouter {
    constructor(baseUrl) {
        this.fixtureRoutes = [];
        this.baseUrl = baseUrl;
    }
    routeFixture(fixtureRoute) {
        this.fixtureRoutes.push(fixtureRoute);
    }
    route(method, route, fixturePath, options = {}) {
        this.routeFixture(createFixture(method, route, fixturePath, options));
    }
    findRoute(method, url) {
        return this.fixtureRoutes.find((fixture) => {
            const route = fixture.route.startsWith('http') ? fixture.route : `${this.baseUrl || ''}${fixture.route}`;
            return method === fixture.method && url.startsWith(route);
        });
    }
}
exports.FixtureRouter = FixtureRouter;
async function initFixtureRouter(page, options = {}) {
    await page.setRequestInterception(true);
    const fixtureRouter = new FixtureRouter(options.baseUrl);
    const fixturePath = options.fixtureBasePath || path_1.default.join(process.cwd(), 'puppeteer/fixtures');
    page.on('request', async (request) => {
        const fixtureRoute = fixtureRouter.findRoute(request.method(), request.url());
        if (fixtureRoute) {
            // check if the fixture exists
            const filePath = path_1.default.join(fixturePath, fixtureRoute.fixturePath);
            const exists = await fs_extra_1.default.pathExists(filePath);
            if (exists) {
                // tslint:disable-next-line: non-literal-fs-path
                const body = await fs_extra_1.default.readFile(filePath);
                console.log('Routing Fixture:', fixtureRoute.route, '=', request.url(), '=>', filePath);
                return request.respond({
                    body: body,
                    contentType: fixtureRoute.options.contentType || 'application/json',
                    status: fixtureRoute.options.status,
                });
            }
            else {
                // continue the request (we'll save it in the response event).
                return request.continue();
            }
        }
        else {
            return request.continue();
        }
    });
    page.on('response', async (response) => {
        const request = response.request();
        const fixtureRoute = fixtureRouter.findRoute(request.method(), request.url());
        if (fixtureRoute) {
            // save fixture if it doesn't exist
            const filePath = path_1.default.join(fixturePath, fixtureRoute.fixturePath);
            const exists = await fs_extra_1.default.pathExists(filePath);
            if (!exists) {
                console.log('Creating new fixture file:', filePath, fixtureRoute.route, request.url());
                // tslint:disable-next-line: non-literal-fs-path
                fs_extra_1.default.writeFile(filePath, await response.buffer());
                return;
            }
        }
    });
    return fixtureRouter;
}
exports.initFixtureRouter = initFixtureRouter;
function createFixture(method, route, fixturePath, options = {}) {
    return {
        fixturePath: fixturePath,
        method: method,
        options: options,
        route: route,
    };
}
exports.createFixture = createFixture;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0RBQTBCO0FBQzFCLGdEQUF3QjtBQW9CeEIsTUFBYSxhQUFhO0lBSXhCLFlBQVksT0FBZ0I7UUFGckIsa0JBQWEsR0FBbUIsRUFBRSxDQUFDO1FBR3hDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQ3pCLENBQUM7SUFFTSxZQUFZLENBQUMsWUFBMEI7UUFDNUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVNLEtBQUssQ0FBQyxNQUFjLEVBQUUsS0FBYSxFQUFFLFdBQW1CLEVBQUUsVUFBK0IsRUFBRTtRQUNoRyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFTSxTQUFTLENBQUMsTUFBYyxFQUFFLEdBQVc7UUFDMUMsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQ3pDLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUV6RyxPQUFPLE1BQU0sS0FBSyxPQUFPLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUF2QkQsc0NBdUJDO0FBRU0sS0FBSyxVQUFVLGlCQUFpQixDQUFDLElBQVUsRUFBRSxVQUFnQyxFQUFFO0lBQ3BGLE1BQU0sSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBRXhDLE1BQU0sYUFBYSxHQUFHLElBQUksYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUV6RCxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsZUFBZSxJQUFJLGNBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLG9CQUFvQixDQUFDLENBQUM7SUFFOUYsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFO1FBQ25DLE1BQU0sWUFBWSxHQUFHLGFBQWEsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBRTlFLElBQUksWUFBWSxFQUFFO1lBQ2hCLDhCQUE4QjtZQUM5QixNQUFNLFFBQVEsR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDbEUsTUFBTSxNQUFNLEdBQUcsTUFBTSxrQkFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM3QyxJQUFJLE1BQU0sRUFBRTtnQkFDVixnREFBZ0Q7Z0JBQ2hELE1BQU0sSUFBSSxHQUFHLE1BQU0sa0JBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBRXpDLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsWUFBWSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFFeEYsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDO29CQUNyQixJQUFJLEVBQUUsSUFBSTtvQkFDVixXQUFXLEVBQUUsWUFBWSxDQUFDLE9BQU8sQ0FBQyxXQUFXLElBQUksa0JBQWtCO29CQUNuRSxNQUFNLEVBQUUsWUFBWSxDQUFDLE9BQU8sQ0FBQyxNQUFNO2lCQUNwQyxDQUFDLENBQUM7YUFDSjtpQkFBTTtnQkFDTCw4REFBOEQ7Z0JBQzlELE9BQU8sT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO2FBQzNCO1NBQ0Y7YUFBTTtZQUNMLE9BQU8sT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQzNCO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUU7UUFDckMsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ25DLE1BQU0sWUFBWSxHQUFHLGFBQWEsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzlFLElBQUksWUFBWSxFQUFFO1lBQ2hCLG1DQUFtQztZQUNuQyxNQUFNLFFBQVEsR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDbEUsTUFBTSxNQUFNLEdBQUcsTUFBTSxrQkFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM3QyxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLEVBQUUsUUFBUSxFQUFFLFlBQVksQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBRXZGLGdEQUFnRDtnQkFDaEQsa0JBQUUsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLE1BQU0sUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7Z0JBRWhELE9BQU87YUFDUjtTQUNGO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLGFBQWEsQ0FBQztBQUN2QixDQUFDO0FBckRELDhDQXFEQztBQUVELFNBQWdCLGFBQWEsQ0FDM0IsTUFBYyxFQUNkLEtBQWEsRUFDYixXQUFtQixFQUNuQixVQUErQixFQUFFO0lBRWpDLE9BQU87UUFDTCxXQUFXLEVBQUUsV0FBVztRQUN4QixNQUFNLEVBQUUsTUFBTTtRQUNkLE9BQU8sRUFBRSxPQUFPO1FBQ2hCLEtBQUssRUFBRSxLQUFLO0tBQ2IsQ0FBQztBQUNKLENBQUM7QUFaRCxzQ0FZQyJ9