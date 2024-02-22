import type { CustomerInfo } from 'bbh-chatbox-widget/build/interface'

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCommonStore = defineStore('common_store', () => {
    /**toggle loading toàn trang */
    const is_loading_full_screen = ref(false)
    /**dữ liệu từ sdk bbh */
    const conversation_info = ref<CustomerInfo>()

    return {
        is_loading_full_screen,
        conversation_info,
    }
})