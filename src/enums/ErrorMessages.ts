export enum EErrorMessage {
    APP_INITIALIZATION_ERROR = "APP_INITIALIZATION_ERROR",
    HEALTH_CHECK_ERROR = "HEALTH_CHECK_ERROR",
    UNKNOWN_INTERNAL_ERROR = "UNKNOWN_INTERNAL_ERROR",
}

export enum EErrorCode {
    APP_INITIALIZATION_ERROR = 500001,
    HEALTH_CHECK_ERROR = 500002,
    UNKNOWN_INTERNAL_ERROR = 500000,
}

export enum EDefaultErrorDetail {
    CLIENT_ERROR = "Client Request Error",
    SERVER_ERROR = "Internal Server Error",
}
