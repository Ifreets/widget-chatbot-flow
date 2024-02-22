<template>
    <div :class="animate_pulse" :style="`width:${size}px;height:${size}px;`" class="overflow-hidden bg-slate-200">
        <img @error="onImageError" @load="removeAnimatePulse" loading="lazy" :src="loadImageUrl()" class="w-full h-full" />
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const $props = withDefaults(defineProps<{
    client_id?: string
    page_id?: string
    staff_id?: string
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
    return `${$env.img_host}/${$props.client_id}?page_id=${$props.page_id}&staff_id=${$props.staff_id}&width=${$props.size}&height=${$props.size}`
}
/**khi ảnh load thất bại thì thay thế ảnh mặc định vào */
function onImageError($event: Event) {
    const image = $event.target as HTMLImageElement

    image.src = `${$env.img_host}/1111111111?width=${$props.size}&height=${$props.size}`
}
</script>