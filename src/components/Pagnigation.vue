<template>
  <div class="flex items-center gap-2 px-5 py-2 justify-between">
    <div class="flex items-center gap-2">
      <!-- Previous -->
      <button
        class="button-change-page"
        :disabled="current_page === 1"
        @click="goToPage(current_page - 1)"
      >
        <ChevronDownIcon class="size-4 rotate-90" />
      </button>

      <!-- Page numbers -->
      <button
        v-for="page in show_pages"
        :key="page"
        @click="goToPage(page)"
        class="w-8 py-1 px-3 flex items-center justify-center border rounded-md font-medium"
        :class="{
          'bg-blue-700 border-blue-700 text-white': current_page === page,
          'bg-white text-black hover:bg-slate-100': current_page !== page,
          '!bg-slate-100 !cursor-not-allowed': current_page < page && disabled_next
        }"
      >
        {{ page }}
      </button>

      <!-- Next -->
      <button
        class="button-change-page"
        :disabled="disabled_next"
        @click="goToPage(current_page + 1)"
      >
        <ChevronDownIcon class="size-4 -rotate-90" />
      </button>
    </div>

    <!-- Page size select -->
    <div class="relative">
      <select
        v-model="page_size"
        @change="emit('update:pageSize', page_size)"
        class="h-9 px-3 border rounded-md appearance-none bg-white pr-9 outline-none cursor-pointer"
      >
        <option :value="10">10 / {{ $t('trang') }}</option>
        <option :value="20">20 / {{ $t('trang') }}</option>
        <option :value="50">50 / {{ $t('trang') }}</option>
      </select>
      <ChevronDownIcon class="size-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ChevronDownIcon from './Icons/ChevronDownIcon.vue';

const $props = defineProps<{
  modelValue: number
  disabled_next: boolean
}>()

const emit = defineEmits(['update:modelValue', 'update:pageSize'])

/** page hiện tại */
const current_page = computed({
  get: () => $props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

/** số bản ghi trên 1 trang*/
const page_size = ref(10)

/** các trang sẽ hiện */
const show_pages = computed(() => {
  /** trang bắt đầu */
  const START = Math.max(1, current_page.value - 1)

  /** trang cuối */
  const END = current_page.value === 1 ? 3 : current_page.value + 1
  return Array.from({ length: END - START + 1 }, (_, i) => START + i)
})

/** đi tới 1 trang */
function goToPage(page: number) {
  // page chọn cần lớn hơn 1 và page được chọn lớn hơn page hiện tại và không thể tiến trước nữa thì thôi
  if (page >= 1 && !(current_page.value < page && $props.disabled_next)) {
    current_page.value = page
    emit('update:modelValue', page)
  }
}
</script>

<style scoped>
.button-change-page {
  @apply text-slate-500 p-1 flex items-center justify-center border rounded hover:bg-slate-100 cursor-pointer disabled:bg-slate-100 disabled:cursor-not-allowed;
}
</style>
