<template>
  <div v-if="label_id" class="flex items-center">
    <div
      :style="{
        background: map_label?.[label_id]?.bg_color || '#f0f0f0',
      }"
      class="w-4 h-4 rounded-full mr-1"
    />
    <div class="truncate w-[calc(100%_-_20px)]">
      {{ map_label?.[label_id]?.title || label_id }}
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Label } from '@/service/interface';

const $props = withDefaults(
  defineProps<{
    /**hành động của kịch bản */
    label_id?: string
    /** ánh xạ id:dữ liệu của các label */
    map_label: Record<string, Label>
  }>(),
  {}
)
</script>
