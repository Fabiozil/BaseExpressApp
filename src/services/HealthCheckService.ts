import { ESuccessMessage } from "../enums/index.enum";
import { CustomResponse } from "../handlers/index.handler";

class HealthCheckService {
    constructor() {}

    public async getHealthCheck(): Promise<CustomResponse> {
        const response = new CustomResponse(ESuccessMessage.HEALTH_CHECK_OK);
        return response;
    }
}

export default HealthCheckService;
