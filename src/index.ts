import dotenv from "dotenv";
import {
    validateLocalEnvVariables,
    initializeExpressApp,
} from "./helpers/index.helper";
import { HealthCheckController } from "./controllers/index.controller";
import {
    createLogger,
    getLogIncomingMiddleware,
    getLogOutcomingMiddleware,
} from "./handlers/index.handler";

dotenv.config();

const localEnvs = ["LISTEN_PORT", "MICROSERVICE"];
validateLocalEnvVariables(localEnvs);
const logger = createLogger({ name: "AppInitialization" });

const incomingLogMiddleware = getLogIncomingMiddleware();
const outcomingLogMiddleware = getLogOutcomingMiddleware();

logger.info("Initializing application");

try {
    const app = initializeExpressApp(
        {
            exposedResources: [
                {
                    basePath: `/${process.env.MICROSERVICE}/v1/health-check`,
                    handler: HealthCheckController,
                },
            ],
            beforeResourceMiddlewares: [
                incomingLogMiddleware,
                outcomingLogMiddleware,
            ],
            afterResourceMiddlewares: [],
        },
        logger
    );

    app.listen(process.env.LISTEN_PORT || 8383, () => {
        logger.info(`App listening in port ${process.env.LISTEN_PORT}`);
    });
} catch (error) {
    logger.error("Fatal Error Initializing App");
}
