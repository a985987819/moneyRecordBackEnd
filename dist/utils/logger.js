class Logger {
    static instance;
    isDev;
    constructor() {
        this.isDev = process.env.NODE_ENV !== 'production';
    }
    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
    formatTimestamp() {
        return new Date().toISOString();
    }
    formatLog(entry) {
        const { timestamp, level, message, context, error } = entry;
        let logString = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
        if (context && Object.keys(context).length > 0) {
            logString += `\n  Context: ${JSON.stringify(context, null, 2)}`;
        }
        if (error) {
            logString += `\n  Error: ${error.message}`;
            if (error.stack) {
                logString += `\n  Stack: ${error.stack}`;
            }
        }
        return logString;
    }
    log(level, message, context, error) {
        const entry = {
            timestamp: this.formatTimestamp(),
            level,
            message,
            context,
            error,
        };
        const formattedLog = this.formatLog(entry);
        switch (level) {
            case 'debug':
                if (this.isDev) {
                    console.debug(formattedLog);
                }
                break;
            case 'info':
                console.info(formattedLog);
                break;
            case 'warn':
                console.warn(formattedLog);
                break;
            case 'error':
                console.error(formattedLog);
                break;
        }
    }
    debug(message, context) {
        this.log('debug', message, context);
    }
    info(message, context) {
        this.log('info', message, context);
    }
    warn(message, context) {
        this.log('warn', message, context);
    }
    error(message, error, context) {
        this.log('error', message, context, error);
    }
    request(method, path, statusCode, duration, userId) {
        this.info(`HTTP ${method} ${path} - ${statusCode} - ${duration}ms`, {
            method,
            path,
            statusCode,
            duration,
            userId,
        });
    }
}
export const logger = Logger.getInstance();
//# sourceMappingURL=logger.js.map