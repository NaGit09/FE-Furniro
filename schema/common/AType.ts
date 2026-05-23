
export interface AType {
    code: number
    message: string
}

export interface ApiResponse<T> extends AType {
    data: T
}

export type ApiError = AType