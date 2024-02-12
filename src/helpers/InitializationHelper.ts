import express, { Express, Response } from "express";
import { EErrorMessage } from "../enums/index.enum";
import { CustomError } from "../handlers/index.handler";
import {
    IAppOptions,
    IResourceDefinition,
} from "../interfaces/index.interface";
import { Logger } from "pino";
import swaggerUi from "swagger-ui-express";

/**
 * Initialices the application with the defined middlewares, configurations and app options.
 * @param appOptions Object indicating routes and middlewares to be implemented in the app
 * @param logger Logger object to log app initialization status
 * @returns An express application ready to start with the given configuration
 */
export function initializeExpressApp(
    appOptions: IAppOptions,
    logger: Logger
): Express {
    try {
        const app: Express = express();
        const {
            exposedResources,
            beforeResourceMiddlewares,
            afterResourceMiddlewares,
        } = appOptions;

        // Set Content-Type
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());

        // Set Swagger Docs Config
        app.use(express.static("public"));
        app.use(
            "/docs",
            swaggerUi.serve,
            swaggerUi.setup(undefined, {
                swaggerOptions: {
                    url: "/swagger.json",
                },
            })
        );

        // Cors
        app.options("*", (_req, res: Response) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
                "Access-Control-Allow-Methods",
                "GET, POST, PUT, PATCH, OPTIONS"
            );
            res.header("Access-Control-Allow-Headers", "*");
            res.send(200);
        });

        // Before
        beforeResourceMiddlewares.forEach((middleware) => app.use(middleware));

        exposedResources.forEach((resource: IResourceDefinition) => {
            logger.info(`Setting up ${resource.basePath}`);
            app.use(resource.basePath, resource.handler);
        });

        afterResourceMiddlewares.forEach((middleware) => {
            app.use(middleware);
        });

        // Security
        app.disable("x-powered-by");
        app.disable("etag");
        return app;
    } catch (error) {
        logger.error(error);
        throw new CustomError(EErrorMessage.APP_INITIALIZATION_ERROR);
    }
}

/**
 * Validates the existence of given env variables, throws error if any is not found
 * @param envVariables - Array with env variables names to validate its existence
 * @returns True if all envs are present, error otherwise
 */
export function validateLocalEnvVariables(envVariables: string[]): boolean {
    try {
        for (const variable of envVariables) {
            if (!process.env[variable]) {
                throw new CustomError(
                    EErrorMessage.APP_INITIALIZATION_ERROR,
                    `Missing ${variable} env variable`
                );
            }
        }
    } catch (err) {}
    return true;
}
