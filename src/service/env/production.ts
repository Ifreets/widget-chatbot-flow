/**
 * .env.dev
 */

import type { Env } from '@/service/interface'

const ENV: Env = {
    bbh_widget: {
        chatbox_secret_key: '04b37e24e5664360b1dcbdda1895c1c8',
    },
    local_storage: {
        prefix: 'chatbot_'
    },
    host: {
        chatbot: 'https://chatbot-api.botbanhang.vn',
        chatbot_v3: 'https://chatbox-service-v3.botbanhang.vn',
    },
    img_host: 'https://chatbox-static-v3.botbanhang.vn/app/facebook/avatar'
}

export default ENV