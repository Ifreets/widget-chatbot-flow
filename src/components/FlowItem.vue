<template>
  <li class="flex gap-2 font-medium">
    <div 
      class="flex flex-col rounded-lg flex-grow min-w-0"
      :class="`${background_color} ${container_class}`"
    >
      <div class="sticky bg-white cursor-pointer"
        :class="position_sticky"
        @click="showContent()"
      >
        <div
          class="px-3 py-2 flex gap-3 items-center rounded-t-lg"
          :class="`${background_color} ${title_class}`"
        >
          <slot name="title" />
          <slot name="dropdown-icon" />
        </div>
      </div>
      <slot name="content" />
    </div>
    <div 
      class="sticky h-fit flex-shrink-0"
      :class="position_sticky"
    >
      <slot name="button"/>
    </div>
  </li>
</template>

<script setup lang="ts">
import ChevronDownIcon from '@/components/Icons/ChevronDownIcon.vue';

defineProps({
  background_color: {
    type: String,
    default: 'bg-white'
  },
  position_sticky: {
    type: String,
    default: 'top-0'
  },
  container_class: {
    type: String,
    default: ''
  },
  title_class: {
    type: String,
    default: ''
  },
  showContent: {
    type: Function,
    default: () => {}
  },
})

</script>
