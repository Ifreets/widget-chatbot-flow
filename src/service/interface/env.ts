import type { GetConfigInput } from 'bbh-chatbox-widget/build/interface'

export interface Env {
    bbh_widget: {
        /**bật kiểm thử */
        is_debug: boolean
        /**mã bí mật của widget */
        chatbox_secret_key: string
        /**? */
        type_config: GetConfigInput['type_config']
        /**? */
        brand_name: GetConfigInput['brand_name']
    }
    /**cài đặt cho local */
    local_storage: {
        /**prefix cho tên của local */
        prefix: string
    }
    /**danh sách url các máy chủ */
    host: {
        /**url server chatbot v2 */
        chatbot: string
        /**url server chatbot v3 */
        chatbot_v3: string
    }
    /**host của link ảnh */
    img_host: string
}