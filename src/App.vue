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
import { useCommonStore } from "@/stores";
import WIDGET from "bbh-chatbox-widget-js-sdk";
import { onMounted } from "vue";

import AdBlocker from "@/components/AdBlocker.vue";
import Loading from "@/components/Loading.vue";
import Network from "@/components/Network.vue";

const commonStore = useCommonStore();

onMounted(() => initBbhWidget());

/**khởi động kết nối với bbh */
function initBbhWidget() {
  getConversationInfo();

  WIDGET.onEvent(() => {
    // đọc thông tin của khách hàng lần đầu load trang
    getConversationInfo();
  });
}
/**đọc thông tin của khách hàng */
async function getConversationInfo() {
  try {
    // nếu có partner token thi lấy thống tin khách hàng theo kiểu mới
    if (WIDGET.partner_token) {
      commonStore.conversation_info = await WIDGET.getClientInfo();
    } else {
      // nếu không có partner token thì lấy thông tin khách hàng theo kiểu cũ
      commonStore.conversation_info = await WIDGET.decodeClient();
    }
  } catch (e) {
    console.log(e);
  }
}
</script>

<style lang="scss">
@import "@/assets/css/index.scss";
</style>
