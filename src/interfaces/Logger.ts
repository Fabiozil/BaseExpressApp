import { LoggerOptions } from "pino";

export interface ILoggerOptions extends LoggerOptions {
    direction?: string;
}
