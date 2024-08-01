/**
 * .env.dev
 */

import type { Env } from '@/service/interface'

const ENV: Env = {
    bbh_widget: {
        is_debug: false,
        chatbox_secret_key: 'b057d99e40a748518c73cf9a5d36ea17',
        type_config: 'CRM',
        brand_name: 'BBH',
    },
    local_storage: {
        prefix: 'chatbot_'
    },
    host: {
        // chatbot: 'https://dev.sellingpage.net/v1/chatbot/n3_service',
        chatbot: 'https://chatbot-api.botbanhang.vn',
    },
    // img_host: 'https://dev.sellingpage.net/v1/n6_static/app/facebook/avatar'
    img_host: 'https://chatbox-static-v3.botbanhang.vn/app/facebook/avatar'
}

export default ENV