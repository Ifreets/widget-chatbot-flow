import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { CustomerInfoExtend } from '@/service/interface'


export const useCommonStore = defineStore('common_store', () => {
    /**toggle loading toàn trang */
    const is_loading_full_screen = ref(false)
    /**dữ liệu từ sdk bbh */
    const conversation_info = ref<CustomerInfoExtend>()

    return {
        is_loading_full_screen,
        conversation_info,
    }
})