<template>
    <div :class="animate_pulse" :style="`width:${size}px;height:${size}px;`" class="overflow-hidden bg-slate-200">
        <img @load="removeAnimatePulse" loading="lazy" :src="loadImageUrl()" class="w-full h-full" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const $props = withDefaults(defineProps<{
    page_id?: string
    size?: string
}>(), {
    size: '40'
})

/**thêm hiệu ứng ẩn hiện khi ảnh đang được load */
const animate_pulse = ref('animate-pulse')

/**tắt hiệu ứng ẩn hiện khi ảnh load thành công */
function removeAnimatePulse() {
    animate_pulse.value = ''
}
/**tạo url ảnh */
function loadImageUrl() {
    return `${$env.img_host}/${$props.page_id}?width=${$props.size}&height=${$props.size}`
}
</script>