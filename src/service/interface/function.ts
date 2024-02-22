/**
 * hàm callback cơ bản, trả về lỗi và kết quả
 */
export interface Cb<Type = any> {
    (error?: any, result?: Type): void
}
/**
 * hàm callback chỉ trả về lỗi nếu có
 */
export interface CbError {
    (error?: any): void
}