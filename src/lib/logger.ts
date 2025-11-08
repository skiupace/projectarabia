type LogLevel = "info" | "warn" | "error" | "debug";

interface LogContext {
  tag?: string;
  [key: string]: unknown;
}

/**
 * Logger utility for server-side logging
 * Sanitizes sensitive data and provides structured logging
 */
class Logger {
  private sanitize(data: unknown): unknown {
    if (typeof data !== "object" || data === null) {
      return data;
    }

    const sensitiveKeys = [
      "password",
      "secret",
      "token",
      "key",
      "authorization",
      "cookie",
      "session",
      "email",
    ];

    if (Array.isArray(data)) {
      return data.map((item) => this.sanitize(item));
    }

    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      if (sensitiveKeys.some((sk) => lowerKey.includes(sk))) {
        sanitized[key] = "[REDACTED]";
      } else {
        sanitized[key] = this.sanitize(value);
      }
    }
    return sanitized;
  }

  private formatMessage(
    level: LogLevel,
    tag: string,
    context?: LogContext,
  ): string {
    const timestamp = new Date().toISOString();
    const contextStr = context
      ? ` ${JSON.stringify(this.sanitize(context))}`
      : "";
    return `[${timestamp}] [${level.toUpperCase()}] [${tag}]${contextStr}`;
  }

  private log(level: LogLevel, tag: string, context?: LogContext): void {
    const message = this.formatMessage(level, tag, context);

    switch (level) {
      case "error":
        console.error(message);
        break;
      case "warn":
        console.warn(message);
        break;
      case "debug":
        // Only log debug in development
        if (process.env.NODE_ENV !== "production") {
          console.log(message);
        }
        break;
      default:
        console.log(message);
        break;
    }
  }

  info(tag: string, context?: LogContext): void {
    this.log("info", tag, context);
  }

  warn(tag: string, context?: LogContext): void {
    this.log("warn", tag, context);
  }

  error(tag: string, context?: LogContext): void {
    this.log("error", tag, context);
  }

  debug(tag: string, context?: LogContext): void {
    this.log("debug", tag, context);
  }
}

export const logger = new Logger();
