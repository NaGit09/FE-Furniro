
export interface AType {
    code: number
    message: string
}

export interface ApiResponse<T> extends AType {
    data: T
}

export interface ApiError extends AType {
}