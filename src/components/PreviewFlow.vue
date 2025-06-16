<template>
  <ul class="p-2 rounded-md bg-blue-50 text-xs flex flex-col gap-1">
    <li v-for="(action, index) of flow_list_action">
      <p class="font-medium text-slate-800">
        {{ index + 1 }}.
        <template v-if="action?.action_type === 'SEND_MESSAGE'">
          {{ $t('v1.view.flow_detail.action.send_message') }}:

          <template v-if="action?.action_sub_type === 'TEXT'">
            {{ $t('v1.view.flow_detail.send_message.text') }}
          </template>
          <template v-if="action?.action_sub_type === 'TEXT_BUTTON'">
            {{ $t('v1.view.flow_detail.send_message.text_button') }}
          </template>
          <template v-if="action?.action_sub_type === 'TEXT_QUICK_REPLY'">
            {{ $t('v1.view.flow_detail.send_message.text_quick_reply') }}
          </template>
          <template v-if="action?.action_sub_type === 'SLIDER'">
            {{ $t('v1.view.flow_detail.send_message.slider') }}
          </template>
          <template v-if="action?.action_sub_type === 'MEDIA'">
            {{ $t('v1.view.flow_detail.send_message.media') }}
          </template>
        </template>
        <template v-if="action?.action_type === 'ADD_SEQUENCE'">
          {{ $t('v1.view.flow_detail.action.add_sequence') }}
        </template>
        <template v-if="action?.action_type === 'REMOVE_SEQUENCE'">
          {{ $t('v1.view.flow_detail.action.remove_sequence') }}
        </template>
        <template v-if="action?.action_type === 'SET_ATTRIBUTE'">
          {{ $t('v1.view.flow_detail.action.set_attribute') }}
        </template>
        <template v-if="action?.action_type === 'ADD_LABEL'">
          {{ $t('v1.view.flow_detail.action.add_label') }}
        </template>
        <template v-if="action?.action_type === 'REMOVE_LABEL'">
          {{ $t('v1.view.flow_detail.action.remove_label') }}
        </template>
        <template v-if="action?.action_type === 'REQUEST'">
          {{ $t('v1.view.flow_detail.action.request') }}:
          <span
            v-if="action?.action_request?.request_response_name"
            class="ml-1 font-normal text-slate-500"
          >
            {{ action?.action_request?.request_response_name }}
          </span>
        </template>
        <template v-if="action?.action_type === 'QUESTION'">
          {{ $t('v1.view.flow_detail.action.question') }}:
          <span
            v-if="action?.action_question?.question_receive_field"
            class="ml-1 font-normal text-slate-500"
          >
            {{ action?.action_question?.question_receive_field }}
          </span>
        </template>
        <template v-if="action?.action_type === 'DELAY'">
          {{ $t('v1.view.flow_detail.action.delay') }}
        </template>
        <span v-if="action?.action_is_prompt" class="ml-1">[AI]</span>
      </p>
      <p class="break-words whitespace-normal text-slate-500 pl-3">
        <template v-if="action?.action_type === 'SEND_MESSAGE'">
          <template v-if="action?.action_sub_type?.includes('TEXT')">
            <template v-if="action?.action_text">
              {{ action?.action_text }}
            </template>
            <span v-else class="text-slate-500">
              {{ $t('v1.view.flow_detail.send_message.content_guild') }}
            </span>
          </template>
          <template v-if="action?.action_sub_type === 'SLIDER'">
            <template v-if="action?.action_list_slider?.length">
              {{ action?.action_list_slider?.length }}
              {{ $t('v1.view.flow_detail.slider.item') }}
            </template>
            <span v-else class="text-slate-500">
              {{ $t('v1.view.flow_detail.slider.empty') }}
            </span>
          </template>
          <template v-if="action?.action_sub_type === 'MEDIA'">
            <template v-if="action?.action_media?.media_url">
              {{ action?.action_media?.media_url }}
            </template>
            <span v-else class="text-slate-500">
              {{ $t('v1.view.flow_detail.media.url_guild') }}
            </span>
          </template>
        </template>
        <template
          v-if="
            ['ADD_SEQUENCE', 'REMOVE_SEQUENCE'].includes(
              action?.action_type || ''
            )
          "
        >
          <span v-if="action?.action_sequence_id">
            {{
              map_sequence?.[action?.action_sequence_id]?.sequence_name
            }}
          </span>
          <span v-else class="text-slate-500">
            {{ $t('v1.view.flow_detail.error.missing_sequence') }}
          </span>
        </template>
        <template v-if="action?.action_type === 'SET_ATTRIBUTE'">
          <span v-if="action?.action_list_attribute?.length">
            {{ action?.action_list_attribute?.length }}
            {{ $t('v1.view.flow_detail.attribute.item') }}
          </span>
          <span v-else class="text-slate-500">
            {{ $t('v1.view.flow_detail.error.missing_attribute') }}
          </span>
        </template>
        <template
          v-if="
            ['ADD_LABEL', 'REMOVE_LABEL'].includes(action?.action_type || '')
          "
        >
          <LabelItem
            v-if="action?.action_label_id"
            :label_id="action?.action_label_id"
            :map_label="map_label"
          />
          <span v-else class="text-slate-500">
            {{ $t('v1.view.flow_detail.label.empty_label') }}
          </span>
        </template>
        <template v-if="action?.action_type === 'REQUEST'">
          <span class="text-blue-500 font-semibold mr-1">
            {{ action?.action_request?.request_method }}
          </span>
          <span v-if="action?.action_request?.request_url">
            {{ action?.action_request?.request_url }}
          </span>
          <span v-else class="text-slate-500">
            {{ $t('v1.view.flow_detail.request.url') }}
          </span>
        </template>
        <template v-if="action?.action_type === 'QUESTION'">
          <template v-if="action?.action_text">
            {{ action?.action_text }}
          </template>
          <span v-else class="text-slate-500">
            {{ $t('v1.view.flow_detail.question.guild') }}
          </span>
        </template>
        <span v-if="action?.action_type === 'DELAY'" class="text-slate-500">
          {{ $t('v1.view.flow_detail.action_type.delay_guild') }}
        </span>
      </p>
    </li>
  </ul>
</template>
<script setup lang="ts">
import type { PropType } from 'vue'

import LabelItem from '@/components/LabelItem.vue';

import type { FlowActionInfo, Label, Sequence } from '@/service/interface'

const $prop = defineProps({
  /** danh sách các hành động */
  flow_list_action: {
    type: Array as PropType<FlowActionInfo[]>,
    required: true
  },
  /** ánh xạ id:dữ liệu của các chuỗi */
  map_sequence: {
    type: Object as PropType<Record<string, Sequence>>,
    required: true
  },
  /** ánh xạ id:dữ liệu của các label */
  map_label: {
    type: Object as PropType<Record<string, Label>>,
    required: true
  },
})
</script>
