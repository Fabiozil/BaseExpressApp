import {
    EDefaultSuccessDetail,
    ESuccessCode,
    ESuccessMessage,
} from "../enums/index.enum";

/**
 * Class to handle CustomResponse standard response
 */
export class CustomResponse {
    public statusCode: number;
    public message: string;
    public detail: string;
    public data: Object;

    /**
     *  Constructor to initialize required properties of a CustomError
     * @param success Success message as SuccessMessage enum to initialize statusCode
     * @param detail Optional success detail, overwrited by default detail if not provided
     */
    constructor(success: ESuccessMessage, data: Object = {}, detail?: string) {
        this.statusCode = ESuccessCode[success];
        this.message = ESuccessMessage[success];
        this.detail = detail || this.getDefaultSuccessDetail(this.statusCode);
        this.data = data;
    }

    /**
     * Helper function to initialize the standard error code for a Custom Error object
     * @param code Status code to filter for standard error detail
     * @returns Error detail based on status code
     */
    private getDefaultSuccessDetail(code: number): EDefaultSuccessDetail {
        if (code > 199999 && code < 300000) {
            return EDefaultSuccessDetail.SUCCESS_RESPONSE;
        } else {
            return EDefaultSuccessDetail.UNKNOWN_RESPONSE;
        }
    }

    /**
     * Helper function to get the response status code from the response status code
     * @returns Response status code for response by sustring the statusCode prop
     */
    public getStatusCode(): number {
        return parseInt(this.statusCode.toString().substring(0, 3));
    }
}
