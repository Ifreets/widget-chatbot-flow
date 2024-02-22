import axios from 'axios'
import type { AxiosError, AxiosResponse, Method, AxiosRequestConfig } from 'axios'

/**
 * Kết quả của api
 *
 * @argument e dữ liệu lỗi api trả về
 * @argument r dữ liệu trả về gốc của axios
 * @argument b dữ liệu thành công của api
 */
type RequestCallback = (e?: any, r?: AxiosResponse | AxiosError, b?: any) => void
/**đầu vào khi gọi api */
interface RequestOption {
    /**đường dẫn */
    uri: string
    /**phương thức */
    method: Method
    /**header */
    headers?: {}
    /**param */
    qs?: {}
    /**body json */
    body?: {}
    /**upload */
    form?: FormData
    /**dữ liệu trả về dạng json */
    json?: boolean
}

/**format axios to request.js like callback */
const request = (
    { uri, method, headers, qs, body, form, json }: RequestOption,
    proceed: RequestCallback
) => (async () => {
    try {
        /**dữ liệu truyền vào axios */
        let option: AxiosRequestConfig = { url: uri, method }

        // thêm param nếu tồn tại
        if (qs) option.params = qs

        // thêm body json nếu thoả mãn
        if (json && body) {
            // dánh dấu api dạng json
            option.headers = { 'Content-Type': 'application/json' }

            // thêm body
            option.data = body
        }

        // thêm body dạng upload file
        if (form) {
            // đánh dấu api dạng upload
            option.headers = { 'Content-Type': 'multipart/form-data' }

            // thêm dữ liệu upload
            option.data = form
        }

        // thêm header custom
        if (headers) option.headers = { ...option.headers, ...headers }

        // đánh dấu kiểu dữ liệu trả về
        if (json) option.responseType = 'json'

        const r = await axios(option)

        proceed(undefined, r, r?.data)
    } catch (error: any) {
        let e = error as AxiosError

        proceed(e?.response?.data || e?.message, e)
    }
})()

export default request