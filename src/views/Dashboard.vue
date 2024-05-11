<template>
    <div class="flex justify-center items-center w-screen h-screen bg-slate-100">
        <div class="bg-white w-screen h-screen md:w-[400px] md:h-[300px] p-2">
            <div class="relative">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <SearchIcon class="w-4 h-4 text-gray-500" />
                </div>
                <input v-model="search"
                    class="block w-full p-2 ps-10 pe-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 outline-orange-500"
                    :placeholder="$t('v1.common.search_placeholder', { name: commonStore.conversation_info?.public_profile?.client_name })">
                <div class="absolute inset-y-0 end-0 flex items-center pointer-events-none pr-1">
                    <ClientAvatar class="rounded-lg" :client_id="commonStore.conversation_info?.public_profile?.fb_client_id"
                        :page_id="commonStore.conversation_info?.public_profile?.fb_page_id"
                        :staff_id="commonStore.conversation_info?.public_profile?.current_staff_id" size="30" />
                </div>
            </div>
            <div class="mt-2">
                <div v-if="is_over_time" class="text-xs text-center">
                    <div>
                        {{ $t('v1.view.dashboard.overtime') }}
                    </div>
                    <a href="https://developers.facebook.com/docs/messenger-platform/policy/policy-overview/"
                        target="_blank" class="text-blue-500">
                        {{ $t('v1.view.dashboard.view_policy') }}
                    </a>
                </div>
                <VueCard v-else @click="sendFlow(flow)" v-for="flow of list_flow"
                    class="w-full flex items-center p-2 px-3 cursor-pointer text-slate-700 hover:text-orange-500 h-[38px] mt-2">
                    <div class="w-[calc(100%_-_20px)] text-sm truncate mr-2">
                        {{ flow.flow_name }}
                    </div>
                    <SendIcon v-if="!flow.status" class="w-4 h-4" />
                    <Loading v-if="flow.status === 'PROCESS'" type="MINI" />
                    <CheckIcon v-if="flow.status === 'DONE'" class="w-4 h-4 text-green-500" />
                </VueCard>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useCommonStore } from '@/stores'
import { flow } from '@/service/helper/async'
import { read_flow, send_flow } from '@/service/api/chatbot'
import { ref } from 'vue'
import { watch } from 'vue'
import { debounce } from 'lodash'

import ClientAvatar from '@/components/Avatar/ClientAvatar.vue'

import SearchIcon from '@/components/Icons/SearchIcon.vue'
import SendIcon from '@/components/Icons/SendIcon.vue'
import CheckIcon from '@/components/Icons/CheckIcon.vue'
import VueCard from '@/components/Flowbite/VueCard.vue'
import Loading from '@/components/Loading.vue'

import type { CbError, FlowInfo } from '@/service/interface'

const commonStore = useCommonStore()

/**tìm kiếm kịch bản */
const search = ref('')
/**id page hiện tại */
const current_page_id = ref()
/**danh sách kịch bản */
const list_flow = ref<FlowInfo[]>([])
/**có quá 24h không */
const is_over_time = ref(false)

// khi thay đổi conversation_info thì tìm kiếm lại kịch bản
watch(() => commonStore.conversation_info, () => {
    // kiểm tra xem có quá 24h không
    checkOverTime()

    // nếu vẫn là page cũ thì thôi
    if (
        current_page_id.value &&
        commonStore.conversation_info?.public_profile?.fb_page_id === current_page_id.value
    ) return

    // lưu lại id page hiện tại mới
    current_page_id.value = commonStore.conversation_info?.public_profile?.fb_page_id

    // tìm kiếm lại kịch bản
    searchFlow()
})
// lắng nghe tìm kiếm kịch bản
watch(() => search.value, debounce(() => searchFlow(), 300))

/**tính xem có quá 24h không */
function checkOverTime() {
    /**mốc thời gian hiện tại */
    const NOW = Date.now()
    /**thời gian tin nhắn cuối cùng được gửi */
    const LAST_MESS_TIME = commonStore.conversation_info?.conversation_message?.last_message_time || 0
    /**khoảng thời gian */
    const DURATION = NOW - LAST_MESS_TIME
    /**24 giờ */
    const HOUR_24 = 1000 * 60 * 60 * 24

    if (DURATION > HOUR_24) {
        // gắn cờ quá 24h
        is_over_time.value = true

        // dừng tiến trình
        return
    }

    // bỏ gắn cờ quá 24h
    is_over_time.value = false
}
/**tìm kiếm danh sách kịch bản */
function searchFlow() {
    flow([
        // * đọc danh sách kịch bản
        (cb: CbError) => read_flow({
            search: search.value,
            limit: 5,
            select: 'flow_name flow_id'
        }, (e, r) => {
            if (e) return cb(e)

            if (r) list_flow.value = r
            cb()
        })
    ], undefined, true)
}
/**gửi kịch bản cho khách hàng */
function sendFlow(flow: FlowInfo) {
    /**
     * lấy id của client hiện tại
     * - tránh lỗi đang chạy thì client_id bị đổi do người dùng chọn khách hàng 
     * khác
     */
    const CLIENT_ID = commonStore.conversation_info?.public_profile?.fb_client_id

    // chặn khi không có id hoặc đang xử lý
    if (!flow.flow_id || flow.status) return

    // đánh dấu đang xử lý
    flow.status = 'PROCESS'

    // gửi kịch bản
    send_flow({
        client_id: CLIENT_ID,
        flow_id: flow.flow_id,
    }, (e, r) => {
        // đánh dấu xử lý xong
        flow.status = 'DONE'

        // sau 2s thì ẩn đi
        setTimeout(() => flow.status = undefined, 2000)
    })
}
</script>
<style scoped lang="scss"></style>