import { ESuccessMessage } from "../enums/SuccessMessages";
import { CustomResponse } from "../handlers/CustomResponse";

class HealthCheckService {
    constructor() {}

    public async getHealthCheck(): Promise<CustomResponse> {
        const response = new CustomResponse(ESuccessMessage.HEALTH_CHECK_OK);
        return response;
    }
}

export default HealthCheckService;
