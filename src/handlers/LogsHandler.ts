import pino, { Logger } from "pino";
import { ILoggerOptions } from "../interfaces/index.interface";
import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import { CustomError } from "./index.handler";

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
 * Get Outcoming Handler Middleware, replace the res.json function used for each OUTCOMING request to log response body, if body matches with an intance of CustomError the OUTCOMING log was already handled by the error logger middleware
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
            if (!(args[0] instanceof CustomError)) {
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
            }
            oldJsonResponse.apply(res, args);
        };
        next();
    };
}

/**
 * Get Outcoming failed gttp request Middleware, middleware that logs the given error and then returns the specific body and status code based on given error
 * @returns The middleware of failed http request logs to be applied to express app
 */
export function getLogOutcomingErrorMiddleware() {
    const incomingRequestLogger = createLogger({ name: "FAILED_HTTP_REQUEST" });

    return function (
        error: CustomError,
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const { headers, ip, method, hostname, path, params, query, body } =
            req;

        incomingRequestLogger.error(
            {
                process_uid: headers["process_uid"],
                headers,
                ip,
                method,
                hostname,
                path,
                params,
                query,
                body,
                full_message: `FAILED REQUEST: ${method} ${path}`,
                direction: "OUTCOMING",
                error: error,
            },
            `FAILED HTTP REQUEST RESPONSE`
        );

        res.status(error.getErrorCode()).json(error);
        next();
    };
}
