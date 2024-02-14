import { expect } from "chai";
import { HealthCheckService } from "../src/services/index.service";
import { CustomResponse } from "../src/handlers/CustomResponse";
import { ESuccessMessage } from "../src/enums/index.enum";

describe("HealthCheckService.ts", () => {
    describe("#getHealthCheck", () => {
        it("Should return sucess when process is executed correctly", async () => {
            const healthCheckService = new HealthCheckService();
            const response = await healthCheckService.getHealthCheck();

            expect(response).to.eql(
                new CustomResponse(ESuccessMessage.HEALTH_CHECK_OK)
            );
        });
    });
});
