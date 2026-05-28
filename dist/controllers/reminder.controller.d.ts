import type { Context } from 'hono';
export declare class ReminderController {
    getAllReminders(c: Context): Promise<(Response & import("hono").TypedResponse<{
        reminders: {
            id: string;
            type: "daily" | "weekly" | "monthly";
            time: string;
            message?: string | undefined;
            isEnabled: boolean;
            daysOfWeek?: number[] | undefined;
            createdAt: string;
            updatedAt: string;
        }[];
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    createReminder(c: Context): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        reminder: {
            id: string;
            type: "daily" | "weekly" | "monthly";
            time: string;
            message?: string | undefined;
            isEnabled: boolean;
            daysOfWeek?: number[] | undefined;
            createdAt: string;
            updatedAt: string;
        };
        message: string;
    }, 201, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    updateReminder(c: Context): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 404, "json">) | (Response & import("hono").TypedResponse<{
        reminder: {
            id: string;
            type: "daily" | "weekly" | "monthly";
            time: string;
            message?: string | undefined;
            isEnabled: boolean;
            daysOfWeek?: number[] | undefined;
            createdAt: string;
            updatedAt: string;
        };
        message: string;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    deleteReminder(c: Context): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 404, "json">) | (Response & import("hono").TypedResponse<{
        message: string;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    toggleReminder(c: Context): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 404, "json">) | (Response & import("hono").TypedResponse<{
        reminder: {
            id: string;
            type: "daily" | "weekly" | "monthly";
            time: string;
            message?: string | undefined;
            isEnabled: boolean;
            daysOfWeek?: number[] | undefined;
            createdAt: string;
            updatedAt: string;
        };
        message: string;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
}
export declare const reminderController: ReminderController;
//# sourceMappingURL=reminder.controller.d.ts.map