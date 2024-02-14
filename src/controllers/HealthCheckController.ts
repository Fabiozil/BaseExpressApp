import { NextFunction, Request, Response, Router } from "express";
import { HealthCheckService } from "../services/index.service";
import { CustomError } from "../handlers/CustomError";
import { EErrorMessage } from "../enums/ErrorMessages";

const router = Router();

/**
 * HEALTH_CHECK_CONTROLLER
 * PATH: /v1/health-check
 * USAGES: Health Check endpoints
 */

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.headers["process_uid"]);
        const healthCheckService = new HealthCheckService();
        const response = await healthCheckService.getHealthCheck();
        res.status(response.getStatusCode()).json(response);
    } catch (error) {
        if (error instanceof CustomError) next(error);
        next(
            new CustomError(
                EErrorMessage.UNKNOWN_INTERNAL_ERROR,
                'Unknown error when handling "GET /health-check/"'
            )
        );
    }
});

router.get(
    "/error",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log(req.headers["process_uid"]);
            const healthCheckService = new HealthCheckService();
            const response = await healthCheckService.getHealthCheckError();
            res.status(200).json(response);
        } catch (error) {
            if (error instanceof CustomError) next(error);
            next(
                new CustomError(
                    EErrorMessage.UNKNOWN_INTERNAL_ERROR,
                    'Unknown error when handling "GET /health-check/error"'
                )
            );
        }
    }
);

export default router;
