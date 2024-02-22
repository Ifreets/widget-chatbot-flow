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
        chatbot: 'https://chatbot-api.botbanhang.vn',
    },
    img_host: 'https://chatbox-static-v3.botbanhang.vn/app/facebook/avatar'
}

export default ENV