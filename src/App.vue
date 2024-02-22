<template>
  <div class="w-screen h-screen">
    <Network />
    <AdBlocker />
    <Loading v-if="commonStore.is_loading_full_screen" type="FULL" />
    <div class="h-full overflow-hidden scrollbar-vertical overflow-y-auto">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { BbhChatboxWidget } from 'bbh-chatbox-widget'
import { useCommonStore } from '@/stores'
import { useI18n } from 'vue-i18n'
import { flow } from './service/helper/async'
import { toastError } from './service/helper/alert'

import Loading from '@/components/Loading.vue'
import Network from '@/components/Network.vue'
import AdBlocker from '@/components/AdBlocker.vue'

import type { CbError } from '@/service/interface'

const commonStore = useCommonStore()
const $t = useI18n().t

onMounted(() => initBbhWidget())

/**khởi động kết nối với bbh */
function initBbhWidget() {
  globalThis.$bbh_widget = new BbhChatboxWidget($env.bbh_widget)

  // * kết nối sdk bbh
  $bbh_widget.init((e, r) => {
    if (e) return toastError(`${$t('v1.view.error.init_bbh')}: ${e}`)

    // đọc thông tin của khách hàng lần đầu load trang
    getConversationInfo()

    // lắng nghe liên tục khi chatbox đổi conversation để cập nhật thông tin khách hàng
    $bbh_widget.on_chatbox_message((e, r) => getConversationInfo())
  })
}
/**đọc thông tin của khách hàng */
function getConversationInfo() {
  $bbh_widget.get_client_info((e, r) => {
    if (e) return

    commonStore.conversation_info = r
  })
}
</script>

<style lang="scss">
@import "@/assets/css/index.scss";
</style>