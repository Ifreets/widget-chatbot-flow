<template>
  <div
    :class="ANIMATE_PULSE"
    class="overflow-hidden bg-slate-200 rounded-oval object-cover"
  >
    <div
      v-if="$props.public_profile?.client_name && PLATFORM_TYPE === 'WEBSITE'"
      :style="{ background: letterToColorCode() }"
      class="w-full h-full flex justify-center items-center font-semibold text-white rounded-oval"
    >
      {{ nameToLetter($props.public_profile?.client_name || "") }}
    </div>

    <img
      v-else-if="PLATFORM_TYPE === 'FB_MESS'"
      @error="onImageError"
      @load="removeAnimatePulse"
      loading="lazy"
      :src="loadImageUrl('FB_MESS')"
      :alt="$props.public_profile?.client_name || 'Avatar'"
      class="w-full h-full rounded-oval object-cover"
    />
    <img
      v-else-if="PLATFORM_TYPE === 'FB_INSTAGRAM'"
      @error="onImageError"
      @load="removeAnimatePulse"
      loading="lazy"
      :src="loadImageUrl('FB_INSTAGRAM')"
      :alt="$props.public_profile?.client_name || 'Avatar'"
      class="w-full h-full rounded-oval object-cover"
    />
    <img
      v-else-if="PLATFORM_TYPE === 'TIKTOK'"
      @error="onImageError"
      @load="removeAnimatePulse"
      loading="lazy"
      :src="loadImageUrl('TIKTOK')"
      :alt="$props.public_profile?.client_name || 'Avatar'"
      class="w-full h-full rounded-oval object-cover"
    />
    <img
      v-else-if="PLATFORM_TYPE === 'ZALO_OA' && CLIENT_AVATAR"
      @error="onImageError"
      @load="removeAnimatePulse"
      loading="lazy"
      :src="CLIENT_AVATAR"
      :alt="$props.public_profile?.client_name || 'Avatar'"
      class="w-full h-full rounded-oval object-cover"
    />
    <img
      v-else-if="PLATFORM_TYPE === 'ZALO_PERSONAL' && CLIENT_AVATAR"
      @error="onImageError"
      @load="removeAnimatePulse"
      loading="lazy"
      :src="CLIENT_AVATAR"
      :alt="$props.public_profile?.client_name || 'Avatar'"
      class="w-full h-full rounded-oval object-cover"
    />
    <div
      v-else
      :style="{ background: letterToColorCode() }"
      class="w-full h-full flex justify-center items-center font-semibold text-white rounded-oval"
    >
      {{ nameToLetter($props.public_profile?.client_name || "") }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { Cdn, SingletonCdn, type ICdn } from "@/utils/helper/Cdn";
import { onMounted, ref, computed } from "vue";

import type { PageType } from "@/interface/app/page";
import type { ICustomerInfo } from "@/interface/widget";

import { nameToLetter } from "@/service/helper/format";

/** Biến khởi tạo cdn sử dụng pattern singleton */
const $cdn = SingletonCdn.getInst();
/** Các nền tảng có avatar */
const NO_AVT_PLATFORMS = ["ZALO", "TIKTOK"];

/** Các props của component */
const $props = withDefaults(
  defineProps<{
    /** kích thước thực tế của hình ảnh */
    actual_size?: number;
    /** dữ liệu bình luận */
    comment?: any;
    /** link avt để dùng luôn */
    avatar?: string;
    /** thông tin public profile từ API response */
    public_profile?: ICustomerInfo["public_profile"];
    /** loại nền tảng từ conversation_message */
    platform_type?: string;
  }>(),
  {
    actual_size: 64,
  },
);

/** Thêm hiệu ứng ẩn hiện khi ảnh đang được load */
const ANIMATE_PULSE = ref<string>("animate-pulse");

/** Sử dụng computed để cache loại nền tảng tránh re-render gọi lại hàm liên tục ở thẻ template */
const PLATFORM_TYPE = computed<string>(() => $props.platform_type || "");

/** Sử dụng computed để cache avatar của user thay vì gọi thẻ hàm nhiều lần */
const CLIENT_AVATAR = computed<string>(
  () => $props.public_profile?.client_avatar || "",
);

onMounted(() => {
  // tắt hiệu ứng với dạng web
  if (PLATFORM_TYPE.value === "WEBSITE") removeAnimatePulse();

  // tắt hiệu ứng với các nền tảng không có avatar
  if (
    NO_AVT_PLATFORMS.some((p) => PLATFORM_TYPE.value?.includes(p)) &&
    !CLIENT_AVATAR.value
  ) {
    removeAnimatePulse();
  }
});

/** lấy fb_page_id từ public_profile */
function getFbPageId(): string {
  return (
    $props.public_profile?.fb_page_id || $props.public_profile?.page_id || ""
  );
}

/** lấy fb_client_id từ public_profile */
function getFbClientId(): string {
  return $props.public_profile?.fb_client_id || "";
}

/** tạo bg dựa trên chữ cái */
function letterToColorCode(): string {
  /** Tên đầy đủ từ profile khách */
  let character = $props.public_profile?.client_name || "";

  // nếu không có tên thì trả về màu mặc định
  if (!character) return "rgb(212, 219, 255)";

  /** lấy chữ cái đầu tiên và Chuyển ký tự thành chữ thường */
  const INPUT = character?.charAt(0).toLowerCase();

  /** Chuyển đổi ký tự thành mã màu, Lấy mã Unicode và trừ đi mã 'a' (97) */
  let char_code = (INPUT?.charCodeAt(0) || 0) - 97;

  // Chuyển đổi số nguyên thành giá trị RGB
  let red = (char_code * 30) % 256;
  let green = (char_code * 20) % 256;
  let blue = (char_code * 10) % 256;

  return "rgb(" + red + ", " + green + ", " + blue + ")";
}

/** tắt hiệu ứng ẩn hiện khi ảnh load thành công */
function removeAnimatePulse(): void {
  ANIMATE_PULSE.value = "";
}

/** tạo url ảnh */
function loadImageUrl(platform_type?: PageType): string {
  console.log(platform_type);
  /** Lưu lại search parameters kích thước ảnh */
  const PARAMS = `?width=${$props.actual_size * 2}&height=${
    $props.actual_size * 2
  }`;

  /** Lấy page id */
  const PAGE_ID = getFbPageId();
  /** Lấy client id */
  const CLIENT_ID = getFbClientId();

  // Load cho tiktok
  if (platform_type === "FB_INSTAGRAM")
    return $cdn.igClientAvt(PAGE_ID, CLIENT_ID) + PARAMS;

  // Load cho instagram
  if (platform_type === "TIKTOK") {
    return $cdn.tiktokClientAvt(PAGE_ID, CLIENT_ID) + PARAMS;
  }
  console.log("default");
  console.log($cdn.fbClientAvt(PAGE_ID, CLIENT_ID) + PARAMS);
  // Mặc định load FB mess
  return $cdn.fbClientAvt(PAGE_ID, CLIENT_ID) + PARAMS;
}

/** khi ảnh load thất bại thì thay thế ảnh mặc định vào */
function onImageError($event: Event): void {
  /** Thẻ img đang bị lỗi load ảnh */
  const IMAGE_TARGET = $event.target as HTMLImageElement;

  // Nếu url ảnh hiện tại đã là ảnh mặc định rồi thì dừng lại để tránh lặp vô hạn
  if (IMAGE_TARGET.src.includes("1111111111")) return;

  /** Đường dẫn ảnh mặc định fallback */
  const FALLBACK_SRC =
    "https://chatbox-static-v3.botbanhang.vn/app/facebook/avatar/1111111111?width=16&height=16";

  // Gán lại src của ảnh bằng đường dẫn mặc định
  IMAGE_TARGET.src = FALLBACK_SRC;
}
</script>
