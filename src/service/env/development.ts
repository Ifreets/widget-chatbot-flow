/**
 * .env.dev
 */

import type { Env } from '@/service/interface'

const ENV: Env = {
    bbh_widget: {
        is_debug: false,
        chatbox_secret_key: '0cf4aa6021fc426f9cd72de5d2ae0936',
        type_config: 'CRM',
        brand_name: 'BBH',
    },
    local_storage: {
        prefix: 'chatbot_'
    },
    host: {
        // chatbot: 'https://dev.sellingpage.net/v1/chatbot/n3_service',
        chatbot: 'https://iwc4g8cgs88wc44gwc8gwosk.34.143.225.69.sslip.io/chatbot/v2/n3_service',
        chatbot_v3: 'https://chatbox-service-v3.botbanhang.vn',
    },
    // img_host: 'https://dev.sellingpage.net/v1/n6_static/app/facebook/avatar'
    img_host: 'https://chatbox-static-v3.botbanhang.vn/app/facebook/avatar'
}

export default ENV