import type { TemplateRequest, TemplateResponse, UseTemplateRequest } from '../types/template';
import type { RecordItem } from '../types/record';
import { BaseService } from '../utils/base.service';
export declare class TemplateService extends BaseService {
    private mapToResponse;
    getAllTemplates(userId: number): Promise<TemplateResponse[]>;
    createTemplate(userId: number, data: TemplateRequest): Promise<TemplateResponse>;
    updateTemplate(userId: number, id: string, data: Partial<TemplateRequest>): Promise<TemplateResponse | null>;
    deleteTemplate(userId: number, id: string): Promise<boolean>;
    useTemplate(userId: number, templateId: string, data: UseTemplateRequest): Promise<RecordItem | null>;
}
export declare const templateService: TemplateService;
//# sourceMappingURL=template.service.d.ts.map