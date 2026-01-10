<template>
  <!-- Nếu có avatar URL trực tiếp -->
  <img
    v-if="avatar"
    @error="onImageError"
    @load="removeAnimatePulse"
    loading="lazy"
    :src="avatar"
    :alt="public_profile?.client_name || 'Avatar'"
    :style="{
      width: `${actual_size}px`,
      height: `${actual_size}px`,
      maxWidth: `${actual_size}px`,
      maxHeight: `${actual_size}px`,
      minWidth: `${actual_size}px`,
      minHeight: `${actual_size}px`,
    }"
    class="overflow-hidden bg-slate-200 rounded-full object-cover flex-shrink-0"
  />
  <!-- Hiển thị theo platform -->
  <div
    v-else
    :class="animate_pulse"
    :style="{
      width: `${actual_size}px`,
      height: `${actual_size}px`,
      maxWidth: `${actual_size}px`,
      maxHeight: `${actual_size}px`,
      minWidth: `${actual_size}px`,
      minHeight: `${actual_size}px`,
    }"
    class="overflow-hidden bg-slate-200 rounded-full flex-shrink-0"
  >
    <!-- WEBSITE: Hiển thị chữ cái đầu -->
    <div
      v-if="public_profile?.client_name && getPlatformType() === 'WEBSITE'"
      :style="{ background: letterToColorCode() }"
      class="w-full h-full flex justify-center items-center font-semibold text-white rounded-full"
    >
      {{ nameToLetter(public_profile?.client_name || "") }}
    </div>
    <!-- FB_MESS: Avatar Facebook -->
    <img
      v-else-if="getPlatformType() === 'FB_MESS'"
      @error="onImageError"
      @load="removeAnimatePulse"
      loading="lazy"
      :src="loadImageUrl()"
      :alt="public_profile?.client_name || 'Avatar'"
      class="w-full h-full rounded-full object-cover block"
    />
    <!-- FB_INSTAGRAM: Avatar Instagram -->
    <img
      v-else-if="getPlatformType() === 'FB_INSTAGRAM'"
      @error="onImageError"
      @load="removeAnimatePulse"
      loading="lazy"
      :src="loadImageUrl('FB_INSTAGRAM')"
      :alt="public_profile?.client_name || 'Avatar'"
      class="w-full h-full rounded-full object-cover block"
    />
    <!-- TIKTOK: Avatar TikTok -->
    <img
      v-else-if="getPlatformType() === 'TIKTOK'"
      @error="onImageError"
      @load="removeAnimatePulse"
      loading="lazy"
      :src="loadImageUrl('TIKTOK')"
      :alt="public_profile?.client_name || 'Avatar'"
      class="w-full h-full rounded-full object-cover block"
    />
    <!-- ZALO_OA: Avatar từ API -->
    <img
      v-else-if="getPlatformType() === 'ZALO_OA' && getClientAvatar()"
      @error="onImageError"
      @load="removeAnimatePulse"
      loading="lazy"
      :src="getClientAvatar()"
      :alt="public_profile?.client_name || 'Avatar'"
      class="w-full h-full rounded-full object-cover block"
    />
    <!-- ZALO_PERSONAL: Avatar từ API -->
    <img
      v-else-if="getPlatformType() === 'ZALO_PERSONAL' && getClientAvatar()"
      @error="onImageError"
      @load="removeAnimatePulse"
      loading="lazy"
      :src="getClientAvatar()"
      :alt="public_profile?.client_name || 'Avatar'"
      class="w-full h-full rounded-full object-cover block"
    />
    <!-- Fallback: Dùng cách cũ nếu có client_id, page_id -->
    <img
      v-else-if="client_id && page_id"
      @error="onImageError"
      @load="removeAnimatePulse"
      loading="lazy"
      :src="loadLegacyImageUrl()"
      class="w-full h-full rounded-full object-cover block"
    />
    <!-- Fallback cuối cùng: Hiển thị chữ cái đầu -->
    <div
      v-else
      :style="{ background: letterToColorCode() }"
      class="w-full h-full flex justify-center items-center font-semibold text-white rounded-full"
    >
      {{ nameToLetter(public_profile?.client_name || "") }}
    </div>
  </div>
</template>

<script setup lang="ts">
//* import function
import { nameToLetter } from "@/service/helper/format";
import { getCdnInstance } from "@/service/helper/Cdn";
import { computed, onMounted, ref, watch } from "vue";

//* import type
import type { CustomerInfo } from "bbh-chatbox-widget-js-sdk";

/** Các nền tảng không có avatar */
const NO_AVT_PLATFORMS = ["ZALO", "TIKTOK"];

/** Instance CDN */
const $cdn = getCdnInstance();

/** Props của component */
const $props = withDefaults(
  defineProps<{
    /** link avatar để dùng luôn */
    avatar?: string;
    /** thông tin public profile từ API response */
    public_profile?: CustomerInfo["public_profile"];
    /** loại nền tảng từ conversation_message */
    platform_type?: string;
    /** client_id (backward compatibility) */
    client_id?: string;
    /** page_id (backward compatibility) */
    page_id?: string;
    /** staff_id (backward compatibility) */
    staff_id?: string;
    /** kích thước avatar */
    size?: string;
    /** kích thước thực tế của hình ảnh (dùng cho CDN) */
    actual_size?: number;
  }>(),
  {
    size: "40",
    actual_size: 40,
  }
);

/** Tính toán actual_size từ size string hoặc number */
const actual_size = computed(() => {
  // Luôn ưu tiên dùng size prop (được truyền từ parent)
  // Parse size string thành number
  return parseInt($props.size || "40", 10);
});

/** Thêm hiệu ứng ẩn hiện khi ảnh đang được load */
const animate_pulse = ref("animate-pulse");

/** Kiểm tra xem có đang hiển thị chữ cái không */
const isShowingLetter = computed(() => {
  // Nếu có avatar URL trực tiếp thì không phải chữ
  if ($props.avatar) return false;

  // Nếu là WEBSITE và có client_name thì hiển thị chữ
  if (getPlatformType() === "WEBSITE" && $props.public_profile?.client_name) {
    return true;
  }

  // Nếu không có client_id và page_id thì sẽ hiển thị chữ (fallback cuối cùng)
  if (!$props.client_id && !$props.page_id) {
    return true;
  }

  // Nếu không có platform_type và không có avatar URL thì sẽ hiển thị chữ
  if (
    !getPlatformType() &&
    !getClientAvatar() &&
    !$props.client_id &&
    !$props.page_id
  ) {
    return true;
  }

  return false;
});

/** Tắt hiệu ứng khi hiển thị chữ cái */
watch(
  isShowingLetter,
  (is_letter) => {
    if (is_letter) {
      removeAnimatePulse();
    }
  },
  { immediate: true }
);

onMounted(() => {
  /** Tắt hiệu ứng với dạng web */
  if (getPlatformType() === "WEBSITE") removeAnimatePulse();
  /** Tắt hiệu ứng với các nền tảng không có avatar */
  if (
    NO_AVT_PLATFORMS.some((p) => getPlatformType()?.includes(p)) &&
    !getClientAvatar()
  ) {
    removeAnimatePulse();
  }
  /** Tắt hiệu ứng nếu đang hiển thị chữ cái */
  if (isShowingLetter.value) {
    removeAnimatePulse();
  }
});

/** Lấy loại nền tảng từ platform_type prop */
function getPlatformType() {
  return $props.platform_type || "";
}

/** Lấy avatar khách hàng từ public_profile */
function getClientAvatar() {
  return ($props.public_profile as any)?.client_avatar || "";
}

/** Lấy fb_page_id từ public_profile */
function getFbPageId() {
  return (
    $props.public_profile?.fb_page_id ||
    $props.public_profile?.page_id ||
    $props.page_id ||
    ""
  );
}

/** Lấy fb_client_id từ public_profile */
function getFbClientId() {
  return $props.public_profile?.fb_client_id || $props.client_id || "";
}

/** Tạo bg dựa trên chữ cái */
function letterToColorCode() {
  let character = $props.public_profile?.client_name || "";

  // nếu không có tên thì trả về màu mặc định
  if (!character) return "rgb(212, 219, 255)";

  // lấy chữ cái đầu tiên và Chuyển ký tự thành chữ thường
  const INPUT = character?.charAt(0).toLowerCase();

  // Chuyển đổi ký tự thành mã màu, Lấy mã Unicode và trừ đi mã 'a' (97)
  let charCode = (INPUT?.charCodeAt(0) || 0) - 97;

  // Chuyển đổi số nguyên thành giá trị RGB
  var red = (charCode * 30) % 256;
  var green = (charCode * 20) % 256;
  var blue = (charCode * 10) % 256;

  return "rgb(" + red + ", " + green + ", " + blue + ")";
}

/** Tắt hiệu ứng ẩn hiện khi ảnh load thành công */
function removeAnimatePulse() {
  animate_pulse.value = "";
}

/** Tạo url ảnh từ CDN theo platform */
function loadImageUrl(platform_type?: string) {
  const PARAMS = `?width=${actual_size.value * 2}&height=${
    actual_size.value * 2
  }`;

  const PAGE_ID = getFbPageId();
  const CLIENT_ID = getFbClientId();

  if (platform_type === "FB_INSTAGRAM")
    return $cdn.igClientAvt(PAGE_ID, CLIENT_ID) + PARAMS;
  if (platform_type === "TIKTOK") {
    return $cdn.tiktokClientAvt(PAGE_ID, CLIENT_ID) + PARAMS;
  }
  return $cdn.fbClientAvt(PAGE_ID, CLIENT_ID) + PARAMS;
}

/** Tạo url ảnh theo cách cũ (backward compatibility) */
function loadLegacyImageUrl() {
  return `${$env.img_host}/${$props.client_id}?page_id=${
    $props.page_id
  }&staff_id=${$props.staff_id || ""}&width=${actual_size.value}&height=${
    actual_size.value
  }`;
}

/** Khi ảnh load thất bại thì thay thế ảnh mặc định vào */
function onImageError($event: Event) {
  const image = $event.target as HTMLImageElement;

  image.src = `${$env.img_host}/1111111111?width=${
    actual_size.value * 2
  }&height=${actual_size.value * 2}`;
}
</script>
