import { defineStore } from "pinia";
import { ref } from "vue";

import type { CustomerInfoExtend } from "@/service/interface";
import type { ICustomerInfo } from "@/interface/widget";

export const useCommonStore = defineStore("common_store", () => {
  /**toggle loading toàn trang */
  const is_loading_full_screen = ref(false);
  /**dữ liệu từ sdk bbh */
  const conversation_info = ref<CustomerInfoExtend>();
  /** dữ liệu khách hàng */
  const data_client = ref<ICustomerInfo>({});
  /** avater của người dùng */
  function getUserAvatar() {
    return (
      "https://chatbox-static-v3.botbanhang.vn/app/facebook/avatar/" +
      data_client?.value?.public_profile?.fb_client_id +
      "?page_id=" +
      data_client?.value?.public_profile?.page_id +
      "&staff_id=" +
      data_client?.value?.public_profile?.current_staff_id +
      "&width=64&height=64"
    );
  }
  return {
    is_loading_full_screen,
    conversation_info,
    data_client,
    getUserAvatar,
  };
});
