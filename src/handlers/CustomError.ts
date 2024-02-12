import {
    EDefaultErrorDetail,
    EErrorCode,
    EErrorMessage,
} from "../enums/index.enum";

/**
 * Class to handle Custom Error standar structure
 */
export class CustomError {
    public statusCode: number;
    public message: string;
    public detail: string;

    /**
     * Constructor to initialize required properties of a CustomError
     * @param error Error as member of ErrorMessage enum to initialize error details and statusCode
     * @param detail Optional error detail, overwrited by default detail if not provided
     */
    constructor(error: EErrorMessage, detail?: string) {
        this.statusCode = EErrorCode[error];
        this.message = EErrorMessage[error];
        this.detail = detail || this.getDefaultErrorDetail(this.statusCode);
    }

    /**
     * Helper function to initialize the standard error code for a Custom Error object
     * @param code Status code to filter for standard error detail
     * @returns Error detail based on status code
     */
    private getDefaultErrorDetail(code: number): EDefaultErrorDetail {
        if (code > 399999 && code < 500000) {
            return EDefaultErrorDetail.CLIENT_ERROR;
        } else {
            return EDefaultErrorDetail.SERVER_ERROR;
        }
    }
}
