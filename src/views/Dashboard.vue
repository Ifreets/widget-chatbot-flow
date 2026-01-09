<template>
  <main
    class="flex justify-center items-center w-screen h-screen bg-slate-100 text-sm"
  >
    <div v-if="is_over_time" class="text-xs text-center">
      <div>
        {{ $t("v1.view.dashboard.overtime") }}
      </div>
      <a
        href="https://developers.facebook.com/docs/messenger-platform/policy/policy-overview/"
        target="_blank"
        class="text-blue-500"
      >
        {{ $t("v1.view.dashboard.view_policy") }}
      </a>
    </div>
    <article
      v-else
      class="bg-white w-screen h-screen md:w-[400px] md:h-[300px] flex flex-col overflow-auto scrollbar-vertical"
    >
      <!-- danh sách kịch bản đang gửi -->
      <section
        class="px-2 pt-1"
        v-if="list_sequence_by_client.length && !is_expand_tag"
      >
        <p
          class="text-slate-700 font-medium text-xs flex gap-1 items-center pb-1"
        >
          <ClockIcon class="size-4" />
          {{ $t("Chuỗi đang chạy") }}
        </p>
        <ul class="flex flex-col gap-2">
          <template v-for="i in list_sequence_by_client">
            <FlowItem
              background_color="bg-green-100"
              :title_class="`${!i.is_preview && 'pb-0'}`"
              :showContent="() => previewSequence(i)"
            >
              <template #title>
                <p class="text-green-600 font-semibold flex-grow truncate">
                  {{ i.sequence?.sequence_name }}
                </p>
                <p
                  v-tooltip.left="'Thời gian gửi'"
                  class="flex gap-1 items-center text-xs text-green-700 flex-shrink-0"
                >
                  <ClockIcon class="size-4" />
                  <template v-if="i.event_timestamp">
                    <span
                      v-if="
                        i.event_timestamp < Date.now() + hoursToMilliseconds(24)
                      "
                    >
                      {{ formatDateAgo(i.event_timestamp) }}
                    </span>
                    <span
                      v-if="
                        i.event_timestamp > Date.now() + hoursToMilliseconds(24)
                      "
                    >
                      {{ format(i.event_timestamp, "HH:mm - dd/MM/yyyy") }}
                    </span>
                  </template>
                </p>
              </template>
              <template #dropdown-icon>
                <ChevronDownIcon
                  class="size-5 text-green-900 cursor-pointer"
                  :class="{ '-rotate-90': i.is_preview }"
                />
              </template>
              <template #content>
                <div class="pb-2 px-3 font-medium text-xs text-slate-500">
                  <p v-if="i.is_preview">
                    <span v-if="i.flow">
                      {{ $t("Kịch bản") }}: {{ i.flow?.flow_name }}
                    </span>
                    <span v-if="i.attribute">
                      {{ $t("Thuộc tính") }}:
                      {{ i.attribute?.attribute_name }}
                    </span>
                  </p>
                </div>
              </template>
              <template #button>
                <button
                  class="rounded h-fit bg-green-700 flex gap-1 p-2 text-white"
                  @click="openModalRemoveSequence(i)"
                >
                  {{ $t("Dừng") }}
                  <PauseCircleIcon class="size-5" />
                </button>
              </template>
            </FlowItem>
          </template>
        </ul>
      </section>

      <!-- tìm kiếm -->
      <section class="flex flex-col py-3 px-2 sticky top-0 z-10 bg-white">
        <div class="flex justify-between gap-3 group">
          <p
            v-if="!is_expand_tag"
            class="flex items-center gap-1 text-slate-700 font-medium text-xs flex-shrink-0 group-focus-within:hidden"
          >
            <ListBulletIcon class="size-4" />
            {{ $t("Kịch bản") }}
          </p>
          <button
            v-else
            class="flex gap-1 items-center font-medium text-slate-700"
            @click="() => (is_expand_tag = false)"
          >
            <ChevronDownIcon class="size-4 rotate-90" />
            {{ $t("Quay lại") }}
          </button>
          <div class="focus-within:w-full w-36 relative">
            <div
              class="absolute inset-y-0 start-0.5 flex items-center pointer-events-none ps-2"
            >
              <SearchIcon class="w-4 h-4 text-slate-500" />
            </div>
            <input
              v-model="search"
              class="text-xs truncate bg-slate-200 placeholder:text-slate-500 block w-full py-1.5 px-8 text-gray-900 border border-gray-300 rounded-full outline-none"
              :placeholder="
                $t('Tìm kiếm', {
                  name: commonStore.conversation_info?.public_profile
                    ?.client_name,
                })
              "
            />
            <div
              class="absolute inset-y-0 end-0.5 flex items-center pointer-events-none"
            >
              <ClientAvatar
                class="rounded-full"
                :client_id="
                  commonStore.conversation_info?.public_profile?.fb_client_id
                "
                :page_id="
                  commonStore.conversation_info?.public_profile?.fb_page_id
                "
                :staff_id="
                  commonStore.conversation_info?.public_profile
                    ?.current_staff_id
                "
                size="24"
              />
            </div>
          </div>
        </div>
        <div v-if="list_tag?.length" class="flex gap-2 pt-2 items-center">
          <ul
            id="list-tag"
            class="flex flex-grow min-w-0 gap-1 font-medium text-xs text-slate-700 flex-wrap"
            :class="{
              'h-5 overflow-hidden': !is_expand_tag,
            }"
          >
            <li
              id="item-tag"
              v-for="tag in list_tag"
              class="rounded-md py-0.5 px-2 cursor-pointer hover:brightness-90"
              :class="{
                'bg-slate-700 text-white': selected_tag_id?.includes(
                  tag.tag_id || ''
                ),
                'bg-slate-100 hover:brightness-90': !selected_tag_id?.includes(
                  tag.tag_id || ''
                ),
              }"
              @click="selectTag(tag)"
            >
              {{ tag.tag_name }}
            </li>
          </ul>
          <button
            v-if="!is_expand_tag && hidden_tag_count && hidden_tag_count > 0"
            class="flex-shrink-0 flex items-center gap-1 font-medium text-slate-700 hover:text-blue-700 hover:underline"
            @click="
              () => {
                is_expand_tag = true;
              }
            "
          >
            Toàn bộ
            <ChevronDoubleRightIcon class="size-4" />
          </button>
        </div>
        <div v-if="loading_tag" class="flex gap-2 pt-2 items-center">
          <ul class="flex flex-grow min-w-0 gap-1 flex-wrap">
            <li class="h-5 bg-slate-200 rounded-md animate-pulse w-full"></li>
          </ul>
          <div
            class="flex-shrink-0 flex items-center gap-1 font-medium text-slate-700 bg-slate-200 h-5 w-1/5"
          ></div>
        </div>
      </section>

      <!-- danh sách kịch bản -->
      <section class="px-2 pb-1 flex-grow">
        <ul class="flex flex-col gap-3">
          <template v-for="flow of list_flow">
            <FlowItem
              container_class=""
              position_sticky="top-[54px]"
              :title_class="`border border-b-0 ${!flow.is_preview && 'pb-0'}`"
              :showContent="() => previewFlow(flow)"
            >
              <template #title>
                <div class="flex-grow flex flex-col font-medium min-w-0">
                  <p class="flex-grow flex gap-1">
                    <StartIcon
                      v-if="flow.flow_is_highlight"
                      class="size-5 text-yellow-400"
                    />
                    <span class="truncate">{{ flow.flow_name }}</span>
                  </p>
                  <ul v-if="flow.tags?.length" class="flex gap-1 flex-wrap">
                    <li
                      class="rounded-md text-[10px] leading-3 text-slate-900 bg-slate-100 py-0.5 px-1"
                      v-for="tag in flow.tags"
                    >
                      {{ tag.tag_name }}
                    </li>
                  </ul>
                </div>
              </template>
              <template #dropdown-icon>
                <ChevronDownIcon
                  class="size-5 flex-shrink-0"
                  :class="{
                    '-rotate-90': flow.is_preview,
                  }"
                />
              </template>
              <template #content>
                <div class="pb-2 px-3 border border-t-transparent rounded-b-lg">
                  <PreviewFlow
                    v-if="flow.is_preview && !loading"
                    :flow_list_action="flow.flow_list_action"
                    :map_sequence="map_sequence"
                    :map_label="map_label"
                  />
                  <ul
                    v-if="flow.is_preview && loading"
                    class="p-2 rounded-md bg-blue-50 text-xs flex flex-col gap-1"
                  >
                    <li v-for="i in 3" class="flex flex-col gap-1">
                      <div
                        class="h-4 bg-slate-300 rounded animate-pulse w-3/4"
                      ></div>
                      <div
                        class="h-12 bg-slate-200 rounded animate-pulse ml-3"
                      ></div>
                    </li>
                  </ul>
                </div>
              </template>
              <template #button>
                <p
                  v-if="flow.status === 'DONE'"
                  class="rounded h-fit bg-blue-200 text-blue-700 flex gap-1 p-2 items-center"
                >
                  {{ $t("Đã gửi") }}
                  <CheckCircleIcon class="w-4 h-4 flex-shrink-0" />
                </p>
                <button
                  class="rounded h-fit bg-blue-700 flex gap-1 p-2 text-white items-center"
                  v-else
                  @click="openModalSendFlow(flow)"
                >
                  {{ $t("Gửi") }}
                  <LoadingIcon
                    v-if="flow.status === 'PROCESS'"
                    class="size-4"
                  />
                  <PaperAirplaneIcon v-else class="size-4" />
                </button>
              </template>
            </FlowItem>
          </template>
          <div
            v-if="!list_flow.length && loading"
            v-for="i in 4"
            class="flex items-center justify-between rounded mb-2 animate-pulse bg-white"
          >
            <!-- Left: fake dropdown -->
            <div class="flex-grow h-9 rounded border p-2">
              <div class="bg-gray-200 w-full h-full"></div>
            </div>

            <!-- Right: fake button -->
            <div class="w-14 h-9 bg-gray-300 rounded ml-2"></div>
          </div>
        </ul>
      </section>

      <!-- phân trang -->
      <Pagnigation
        v-model="current_page"
        :disabled_next="!list_flow.length || list_flow.length < page_size"
        @update:model-value="searchFlow"
        @update:page-size="
          (value) => {
            current_page = 1;
            page_size = value;
            searchFlow();
          }
        "
      />
    </article>
  </main>

  <!-- Modal xác nhận dừng chuỗi -->
  <Modal
    v-model="is_open_modal_remove_sequence"
    class_modal="bg-white w-[400px] p-6 text-sm"
    class_header="text-lg font-semibold"
    class_body="pt-3 pb-7"
    class_footer="flex justify-between gap-2 font-medium"
    @close_modal="closeModalRemoveSequence"
  >
    <template #header>
      {{ $t("Xác nhận dừng chuỗi") }}
    </template>
    <template #body>
      {{ $t("Xác nhận dừng chuỗi") }}
      <span class="font-semibold">
        "{{ selected_sequence?.sequence?.sequence_name }}"
      </span>
    </template>
    <template #footer>
      <button
        class="text-slate-500 py-2 px-4 bg-slate-100 rounded-md"
        @click="closeModalRemoveSequence"
      >
        {{ $t("Huỷ") }}
      </button>
      <button
        class="text-red-500 py-2 px-4 bg-red-100 rounded-md"
        @click="removeSequence"
      >
        {{ $t("Dừng") }}
      </button>
    </template>
  </Modal>

  <!-- Modal xác nhận gửi kịch bản -->
  <Modal
    v-model="is_open_modal_send_flow"
    class_modal="bg-white w-[400px] p-6 text-sm"
    class_header="text-lg font-semibold"
    class_body="pt-3 pb-7"
    class_footer="flex justify-between gap-2 font-medium"
    @close_modal="closeModalSendFlow"
  >
    <template #header>
      {{ $t("Xác nhận gửi kịch bản") }}
    </template>
    <template #body>
      {{ $t("Xác nhận gửi kịch bản") }}
      <span class="font-semibold"> "{{ selected_flow?.flow_name }}" </span>
    </template>
    <template #footer>
      <button
        class="text-slate-500 py-2 px-4 bg-slate-100 rounded-md"
        @click="closeModalSendFlow"
      >
        {{ $t("Huỷ") }}
      </button>
      <button
        class="rounded h-fit bg-blue-700 flex gap-1 p-2 text-white items-center"
        @click="sendFlow(selected_flow)"
      >
        {{ $t("Gửi") }}
        <PaperAirplaneIcon class="size-4" />
      </button>
    </template>
  </Modal>
</template>
<script setup lang="ts">
import {
  read_all_label,
  read_flow,
  read_sequence,
  read_sequence_by_client,
  read_tag,
  remove_sequence,
  send_flow,
} from "@/service/api/chatbot";
import { flow } from "@/service/helper/async";
import { formatDateAgo } from "@/service/helper/format";
import { useCommonStore } from "@/stores";
import { format, hoursToMilliseconds } from "date-fns";
import { debounce, keyBy } from "lodash";
import { nextTick, ref, watch } from "vue";

import ClientAvatar from "@/components/Avatar/ClientAvatar.vue";
import FlowItem from "@/components/FlowItem.vue";
import Modal from "@/components/Modal.vue";
import Pagnigation from "@/components/Pagnigation.vue";
import PreviewFlow from "@/components/PreviewFlow.vue";
import { CountHiddenItem } from "@/service/helper/CountHiddenItem";

import CheckCircleIcon from "@/components/Icons/CheckCircleIcon.vue";
import ChevronDoubleRightIcon from "@/components/Icons/ChevronDoubleRightIcon.vue";
import ChevronDownIcon from "@/components/Icons/ChevronDownIcon.vue";
import ClockIcon from "@/components/Icons/ClockIcon.vue";
import ListBulletIcon from "@/components/Icons/ListBulletIcon.vue";
import LoadingIcon from "@/components/Icons/LoadingIcon.vue";
import PaperAirplaneIcon from "@/components/Icons/PaperAirplaneIcon.vue";
import PauseCircleIcon from "@/components/Icons/PauseCircleIcon.vue";
import SearchIcon from "@/components/Icons/SearchIcon.vue";
import StartIcon from "@/components/Icons/StartIcon.vue";

import type {
  CbError,
  FlowInfo,
  Label,
  MappingClientSequenceInfo,
  Sequence,
  TagInfo,
} from "@/service/interface";

const $count_hidden_item = new CountHiddenItem();

const commonStore = useCommonStore();

/** trang hiện tại */
const current_page = ref(1);
/** số bản ghi trên 1 trang */
const page_size = ref(10);
/**tìm kiếm kịch bản */
const search = ref("");
/**id page hiện tại */
const current_page_id = ref();
/**danh sách kịch bản */
const list_flow = ref<FlowInfo[]>([]);
/**có quá 24h không */
const is_over_time = ref(false);
/** ánh xạ id:dữ liệu của các chuỗi */
const map_sequence = ref<{ [key: string]: Sequence }>({});
/** ánh xạ id:dữ liệu của các nhãm */
const map_label = ref<{ [key: string]: Label }>({});
/** danh sách các chuỗi sự kiện sắp tới */
const list_sequence_by_client = ref<MappingClientSequenceInfo[]>([]);
/** loading dữ liệu kịch bản */
const loading = ref(false);
/** đóng/mở modal xác nhận dừng chuỗi */
const is_open_modal_remove_sequence = ref(false);
/** dữ liệu của 1 chuỗi được chọn */
const selected_sequence = ref<MappingClientSequenceInfo | null>(null);
/** đóng/mở modal xác nhận gửi kịch bản */
const is_open_modal_send_flow = ref(false);
/** dữ liệu của 1 kịch bản được chọn */
const selected_flow = ref<FlowInfo | null>(null);
/** danh sách thẻ */
const list_tag = ref<TagInfo[]>([]);
/** số lượng thẻ bị ẩn */
const hidden_tag_count = ref();
/** xem tất cả các thẻ */
const is_expand_tag = ref(false);
/** danh sách tag được chọn */
const selected_tag_id = ref<string[]>([]);
/** loading dữ liệu thẻ */
const loading_tag = ref(false);

// khi thay đổi conversation_info thì tìm kiếm lại kịch bản
watch(
  () => commonStore.conversation_info,
  () => {
    // kiểm tra xem có quá 24h không
    checkOverTime();

    // lấy danh sách chuỗi sự kiện sắp gửi của khách hàng
    readSequenceByClient();

    // nếu vẫn là page cũ thì thôi
    if (
      current_page_id.value &&
      commonStore.conversation_info?.public_profile?.fb_page_id ===
        current_page_id.value
    )
      return;

    // lưu lại id page hiện tại mới
    current_page_id.value =
      commonStore.conversation_info?.public_profile?.fb_page_id;

    // tìm kiếm lại kịch bản
    searchFlow();

    // lấy danh sách chuỗi
    readSequence();

    // lấy danh sách nhãn
    readLabel();

    // lấy danh sách thẻ
    readTag();
  }
);
// lắng nghe tìm kiếm kịch bản
watch(
  () => search.value,
  debounce(() => {
    current_page.value = 1;
    searchFlow();
  }, 300)
);

/**tính xem có quá 24h không */
function checkOverTime() {
  // nếu không phải fb thì thôi
  if (
    commonStore.conversation_info?.conversation_message?.platform_type !==
    "FB_MESS"
  )
    return;

  /**mốc thời gian hiện tại */
  const NOW = Date.now();
  /**thời gian tin nhắn cuối cùng được gửi */
  const LAST_MESS_TIME =
    commonStore.conversation_info?.conversation_message?.last_message_time || 0;
  /**khoảng thời gian */
  const DURATION = NOW - LAST_MESS_TIME;
  /**24 giờ */
  const HOUR_24 = 1000 * 60 * 60 * 24;

  if (DURATION > HOUR_24) {
    // gắn cờ quá 24h
    is_over_time.value = true;

    // dừng tiến trình
    return;
  }

  // bỏ gắn cờ quá 24h
  is_over_time.value = false;
}
/**tìm kiếm danh sách kịch bản */
function searchFlow() {
  // bật loading
  loading.value = true;

  // xoa danh sách kịch bản
  list_flow.value = [];
  flow(
    [
      // * đọc danh sách kịch bản
      (cb: CbError) =>
        read_flow(
          {
            search: search.value,
            limit: page_size.value,
            skip: (current_page.value - 1) * page_size.value,
            select: "",
            flow_list_tag_id: selected_tag_id.value?.length
              ? selected_tag_id.value
              : undefined,
          },
          (e, r) => {
            // tắt loading
            loading.value = false;

            // nếu có lỗi thì thôi
            if (e) return cb(e);

            // gán danh sách kịch bản
            if (r) list_flow.value = r;
            cb();
          }
        ),
    ],
    undefined,
    false
  );
}
/**gửi kịch bản cho khách hàng */
function sendFlow(flow: FlowInfo | null) {
  // nếu không có kịch bản thì thôi
  if (!flow) return;

  /**
   * lấy id của client hiện tại
   * - tránh lỗi đang chạy thì client_id bị đổi do người dùng chọn khách hàng
   * khác
   */
  const CLIENT_ID = commonStore.conversation_info?.public_profile?.fb_client_id;

  // chặn khi không có id hoặc đang xử lý
  if (!flow.flow_id || flow.status) return;

  // đánh dấu đang xử lý
  flow.status = "PROCESS";

  // gửi kịch bản
  send_flow(
    {
      client_id: CLIENT_ID,
      flow_id: flow.flow_id,
    },
    (e, r) => {
      // đánh dấu xử lý xong
      flow.status = "DONE";

      // sau 2s thì ẩn đi
      setTimeout(() => (flow.status = undefined), 2000);

      // lấy lại danh sách mới
      // readSequenceByClient()

      // đóng modal
      closeModalSendFlow();
    }
  );
}

/** xem trước kịch bản */
function previewFlow(data: FlowInfo) {
  // bật loading
  loading.value = true;
  flow([
    // * Hiển thị thông tin
    (cb: CbError) => {
      /** trạng thái xem trước hiện tại */
      const CURRENT_IS_PREVIEW = data.is_preview;

      //tắt các preview của kịch bản
      list_flow.value.forEach((flow) => (flow.is_preview = false));

      // nếu đang bật và muốn tắt đi thì thôi không call api nữa
      if (CURRENT_IS_PREVIEW) return;

      // bật preview của kịch bản này
      data.is_preview = !CURRENT_IS_PREVIEW;

      cb();
    },

    // * đọc dữ liệu kịch bản cần xem trước
    (cb: CbError) =>
      read_flow(
        {
          flow_id: data.flow_id,
          select: "",
        },
        (e, r) => {
          // tắt loading
          loading.value = false;

          // nếu xảy ra lỗi
          if (e) return cb(e);

          // nếu không có dữ liệu các hành động
          if (!r?.[0]?.flow_list_action) return cb();

          // lưu lại dữ liệu các hành động
          data.flow_list_action = r?.[0]?.flow_list_action;
          cb();
        }
      ),
  ]);
}

/** xem trước chuỗi */
function previewSequence(data: MappingClientSequenceInfo) {
  // nếu đang mở thì xem trước
  if (data.is_preview) {
    data.is_preview = false;
    return;
  }

  // tắt tất cả các chuỗi khác đang xem trước
  list_sequence_by_client.value.forEach((sequence) => {
    // tắt các preview của các chuỗi khác
    if (sequence._id !== data._id) {
      sequence.is_preview = false;
    }
    // bật preview của chuỗi được chọn
    else {
      sequence.is_preview = true;
    }
  });
}

/** lấy danh sách chuỗi */
function readSequence() {
  flow([
    // * đọc danh sách chuỗi
    (cb: CbError) =>
      read_sequence(
        {
          select: "sequence_id sequence_name",
        },
        (e, r) => {
          // nếu có lỗi thì thôi
          if (e) return cb(e);

          // nếu không có dữ liệu thì thôi
          if (!r || !r.length) return;

          // lưu lặp dữ liệu
          map_sequence.value = keyBy(r, "sequence_id");
        }
      ),
  ]);
}

/** lấy các chuỗi sự kiện sắp gửi của khách hàng đó */
function readSequenceByClient(callback?: Function) {
  /**
   * lấy id của client hiện tại
   * - tránh lỗi đang chạy thì client_id bị đổi do người dùng chọn khách hàng
   * khác
   */
  const CLIENT_ID = commonStore.conversation_info?.public_profile?.fb_client_id;

  /** lấy id của page hiện tại */
  const PAGE_ID = commonStore.conversation_info?.public_profile?.fb_page_id;

  flow([
    // * đọc danh sách chuỗi
    (cb: CbError) =>
      read_sequence_by_client(
        {
          limit: 3,
          page_id: PAGE_ID,
          skip: 0,
          client_id: CLIENT_ID,
          select: "",
        },
        (e, r) => {
          callback?.();

          // nếu có lỗi thì thôi
          if (e) return cb(e);

          list_sequence_by_client.value = r;
        }
      ),
  ]);
}

/** lấy danh sách nhãn */
function readLabel() {
  flow([
    // * đọc danh sách chuỗi
    (cb: CbError) =>
      read_all_label({}, (e, r) => {
        // nếu có lỗi thì thôi
        if (e) return cb(e);

        // nếu không có dữ liệu thì thôi
        if (!r) return;

        // lưu lặp dữ liệu
        map_label.value = r;
      }),
  ]);
}

/** lấy danh sách thẻ */
function readTag() {
  // bật loading
  loading_tag.value = true;

  read_tag(
    {
      page_id: commonStore.conversation_info?.public_profile?.fb_page_id,
    },
    (e, r) => {
      // tắt loading
      loading_tag.value = false;

      // nếu có lỗi thì thôi
      if (e) return console.error(e);

      // nếu không có dữ liệu thì thôi
      if (!r) return;

      // lưu lặp dữ liệu
      list_tag.value = r;

      nextTick(async () => {
        /** phần tử chứa danh sách thẻ */
        const LIST_TAG = document.querySelector("#list-tag");

        // nếu không có thì thôi
        if (!LIST_TAG) return;

        // tính toán các phần tử bị ẩn
        hidden_tag_count.value = await $count_hidden_item.exec(
          "#item-tag",
          LIST_TAG
        );
      });
    }
  );
}

/** hàm mở modal xác nhận dừng chuỗi */
function openModalRemoveSequence(sequence: MappingClientSequenceInfo) {
  // bật modal
  is_open_modal_remove_sequence.value = true;

  // lưu lặp dữ liệu
  selected_sequence.value = sequence;
}

/** hàm đóng modal xác nhận dừng chuỗi */
function closeModalRemoveSequence() {
  // đóng modal
  is_open_modal_remove_sequence.value = false;

  // xóa dữ liệu chuỗi
  selected_sequence.value = null;
}

/** hàm dừng chuỗi */
function removeSequence() {
  /** lấy id của client hiện tại */
  const CLIENT_ID = commonStore.conversation_info?.public_profile?.fb_client_id;

  /** lấy id của page hiện tại */
  const PAGE_ID = commonStore.conversation_info?.public_profile?.fb_page_id;

  flow(
    [
      // * xóa chuỗi
      (cb: CbError) =>
        remove_sequence(
          {
            client_id: CLIENT_ID,
            page_id: PAGE_ID,
            sequence_id: selected_sequence.value?.sequence_id,
            mapping_client_sequence_id: selected_sequence.value?._id,
          },
          (e, r) => {
            if (e) return cb(e);
            // nếu thành công thì tắt modal và xóa khỏi mảng
            if (r.code !== 200) return cb();

            // đóng modal
            closeModalRemoveSequence();

            // lấy lại danh sách mới
            readSequenceByClient(cb);
          }
        ),
    ],
    undefined,
    true
  );
}

/** hàm mở modal xác nhận gửi kịch bản */
function openModalSendFlow(flow: FlowInfo) {
  // bật modal
  is_open_modal_send_flow.value = true;

  // lưu lặp dữ liệu
  selected_flow.value = flow;
}

/** hàm đóng modal xác nhận gửi kịch bản */
function closeModalSendFlow() {
  // đóng modal
  is_open_modal_send_flow.value = false;

  // xóa dữ liệu kịch bản
  selected_flow.value = null;
}

/** hàm chọn thẻ */
function selectTag(tag: TagInfo) {
  /** index của thẻ đã chọn trong mảng đã chọn */
  const INDEX = selected_tag_id.value.findIndex((item) => item === tag.tag_id);
  // nếu không có thì thêm vào mảng
  if (INDEX === -1 && tag.tag_id) {
    selected_tag_id.value = [...selected_tag_id.value, tag.tag_id];
  }
  // nếu có trong mảng rồi thì xóa
  else {
    selected_tag_id.value.splice(INDEX, 1);
  }

  current_page.value = 1;
  searchFlow();
}
</script>
<style scoped lang="scss"></style>
