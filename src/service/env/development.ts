/**
 * .env.dev
 */

import type { Env } from '@/service/interface'

const ENV: Env = {
    bbh_widget: {
        is_debug: false,
        chatbox_secret_key: '04b37e24e5664360b1dcbdda1895c1c8',
        type_config: 'CRM',
        brand_name: 'BBH',
    },
    local_storage: {
        prefix: 'chatbot_'
    },
    host: {
        chatbot: 'https://dev.sellingpage.net/v1/chatbot/n3_service',
    },
    img_host: 'https://dev.sellingpage.net/v1/n6_static/app/facebook/avatar'
}

export default ENV