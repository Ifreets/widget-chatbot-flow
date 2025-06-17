<template>
  <Teleport
    to="body"
    v-if="modelValue"
  >
    <Transition
      enter-active-class="transition ease-in-out duration-500"
      leave-active-class="transition ease-in-out duration-500"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        @click="toggleModal"
        class="absolute top-0 left-0 w-screen h-screen bg-black/10 z-20 shadow-lg"
      >
        <div
          @click.stop
          :class="class_modal"
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-glass p-2 max-w-[95%] max-h-[95%] flex flex-col shadow-lg"
        >
          <div class="flex items-center justify-between">
            <div
              :class="class_header"
              class="text-lg font-medium flex-shrink-0"
            >
              <slot name="header"></slot>
            </div>
            <div
              @click="toggleModal"
              class="bg-slate-100 rounded-lg p-1 cursor-pointer"
            >
              <CloseIcon class="w-5 h-5" />
            </div>
          </div>
          <div
            :class="class_body"
            class="flex-grow overflow-y-auto"
          >
            <slot name="body"></slot>
          </div>
          <div
            v-if="$slots.footer"
            :class="class_footer"
            class="flex-shrink-0"
          >
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<script setup lang="ts">
import CloseIcon from '@/components/Icons/CloseIcon.vue';

const $emit = defineEmits(['close_modal', 'open_modal', 'update:modelValue'])

const $props = withDefaults(
  defineProps<{
    modelValue: boolean
    /**class cho modal */
    class_modal?: string
    /**class cho header */
    class_header?: string
    /**class cho body */
    class_body?: string
    /**class cho footer */
    class_footer?: string
    /**id nhận dạng */
    id?: string
  }>(),
  {}
)

/**ẩn hiện modal */
function toggleModal() {
  // toggle modal
  $emit('update:modelValue', !$props.modelValue)

  // bắn sự kiện ra ngoài khi modal đã tắt
  if (!$props.modelValue) $emit('close_modal')
  // bắn sự kiện ra ngoài khi modal đã mở
  else $emit('open_modal')
}
</script>