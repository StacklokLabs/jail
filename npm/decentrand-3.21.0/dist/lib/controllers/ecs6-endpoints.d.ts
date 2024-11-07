import { Router } from '@well-known-components/http-server';
import { PreviewComponents } from '../Preview';
import { ContentMapping } from '@dcl/schemas';
export declare function setupEcs6Endpoints(components: PreviewComponents, router: Router<PreviewComponents>): void;
export declare function getFilesFromFolder({ folder, addOriginalPath, ignorePattern, customHashMaker }: {
    folder: string;
    addOriginalPath?: boolean;
    ignorePattern?: string;
    customHashMaker?: (str: string) => string;
}): ContentMapping[];
//# sourceMappingURL=ecs6-endpoints.d.ts.map