import { Request, Response, Router } from "express";
import { HealthCheckService } from "../services/index.service";

const router = Router();

/**
 * HEALTH_CHECK_CONTROLLER
 * PATH: /v1/health-check
 * USAGES: Health Check endpoints
 */

router.get("/", async (req: Request, res: Response) => {
    console.log(req.headers["process_uid"]);
    const healthCheckService = new HealthCheckService();
    const response = await healthCheckService.getHealthCheck();
    res.status(200).json(response);
});

export default router;
