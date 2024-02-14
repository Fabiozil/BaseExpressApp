import { EErrorMessage, ESuccessMessage } from "../enums/index.enum";
import { CustomError, CustomResponse } from "../handlers/index.handler";

/**
 * Handle processes related with HealthCheck
 */
class HealthCheckService {
    constructor() {}

    /**
     * Executes healthcheck process
     * @returns CustomResponse indicating the result of the HealthCheck
     */
    public async getHealthCheck(): Promise<CustomResponse> {
        const response = new CustomResponse(ESuccessMessage.HEALTH_CHECK_OK);
        return response;
    }

    /**
     * Executes healthcheck process and throws error to test error logger
     * @returns CustomError indicating HEALTH_CHECK_ERROR
     */
    public async getHealthCheckError(): Promise<CustomError> {
        try {
            throw new CustomError(EErrorMessage.HEALTH_CHECK_ERROR);
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(EErrorMessage.UNKNOWN_INTERNAL_ERROR);
        }
    }
}

export default HealthCheckService;
