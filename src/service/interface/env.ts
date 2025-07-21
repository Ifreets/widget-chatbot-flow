export interface Env {
    bbh_widget: {
        /**mã bí mật của widget */
        chatbox_secret_key: string
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
        /** url server của widget sdk */
        widget_sdk?: Record<'APP' | 'WIDGET' | 'CHATBOT' | 'APP_V2', string>
    }
    /**host của link ảnh */
    img_host: string
}