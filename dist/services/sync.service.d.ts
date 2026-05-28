import { BaseService } from '../utils/base.service';
import type { SyncData, SyncUploadResponse, SyncDownloadResponse, SyncVersion } from '../types/sync';
export declare class SyncService extends BaseService {
    uploadData(userId: number, data: SyncData): Promise<SyncUploadResponse>;
    downloadData(userId: number, version?: number): Promise<SyncDownloadResponse>;
    getVersions(userId: number): Promise<SyncVersion[]>;
    restoreVersion(userId: number, versionId: string): Promise<SyncDownloadResponse>;
    private getCurrentData;
}
export declare const syncService: SyncService;
//# sourceMappingURL=sync.service.d.ts.map