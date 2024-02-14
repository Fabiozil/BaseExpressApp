import pino, { Logger } from "pino";
import { ILoggerOptions } from "../interfaces/index.interface";
import { NextFunction, Request } from "express";
import crypto from "crypto";

const redact = process.env.LOG_REDACT?.split(/\s*,\/s*/);

/**
 * Generator for Pino logger with given options and application standard params
 * @param config Custom configuration for Pino logger
 * @returns Pino logger with given configuration and standard params
 */
export function createLogger(config: ILoggerOptions = {}): Logger {
    const { level, name = "APPLICATION_LOGGER", direction, ...rest } = config;

    const options: ILoggerOptions = {
        base: { application: process.env.MICROSERVICE, name },
        ...rest,
        redact,
    };

    return pino(options);
}

/**
 * Get Incoming Handler Middleware used for each INCOMING request to log request data
 * @returns The middleware of incoming logs to be applied to express app
 */
export function getLogIncomingMiddleware() {
    const incomingRequestLogger = createLogger({ name: "INCOMING_REQUEST" });

    return function (req: Request, _res: Response, next: NextFunction) {
        try {
            const { headers, ip, method, hostname, path, params, query, body } =
                req;

            const processUid = crypto.randomUUID();

            req.headers["process_uid"] = processUid;

            incomingRequestLogger.info(
                {
                    process_uid: processUid,
                    headers,
                    ip,
                    method,
                    hostname,
                    path,
                    params,
                    query,
                    body,
                    full_message: `INCOMING REQUEST: ${method} ${path}`,
                    direction: "INCOMING",
                },
                `INCOMING HTTP REQUEST`
            );

            next();
        } catch (error) {
            next();
        }
    };
}

/**
 * Get Outcoming Handler Middleware, replace the res.json function used for each OUTCOMING request to log response body
 * @returns The middleware of outcoming logs to be applied to express app
 */
export function getLogOutcomingMiddleware() {
    const incomingRequestLogger = createLogger({ name: "OUTCOMING_RESPONSE" });

    return function (
        req: Request,
        res: { json: (...args: any[]) => void },
        next: NextFunction
    ) {
        const oldJsonResponse = res.json;
        res.json = function (...args) {
            const { headers, method, path } = req;

            incomingRequestLogger.info(
                {
                    process_uid: headers.process_uid,
                    headers,
                    body: args[0],
                    full_message: `OUTCOMING RESPONSE: ${method} ${path}`,
                    direction: "OUTCOMING",
                },
                `OUTCOMING HTTP RESPONSE`
            );

            oldJsonResponse.apply(res, args);
        };
        next();
    };
}
