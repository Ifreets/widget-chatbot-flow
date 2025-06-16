<template>
  <main class="flex justify-center items-center w-screen h-screen bg-slate-100 text-sm">
    <article
      class="bg-white w-screen h-screen md:w-[400px] md:h-[300px] overflow-auto scrollbar-vertical"
    >
      <!-- danh sách kịch bản đang gửi -->
      <section class="px-2 pt-1">
				<p class="text-slate-700 font-medium text-xs flex gap-1 items-center pb-1">
					<ClockIcon class="size-4" />
					Chuỗi đang chạy
				</p>
        <ul class="flex flex-col gap-2">
					<template v-for="i in 3">
          <li
						class="flex gap-2 font-medium"
						v-if="i === 1"
					>
            <div class="flex flex-col bg-green-100 rounded-lg flex-grow">
							<div class="sticky top-0 bg-white">
								<div class="px-3 pt-2 flex gap-3 items-center bg-green-100 rounded-t-lg">
									<p class="text-green-600 font-semibold flex-grow">
										Chuỗi 1
									</p>
									<p class="flex gap-1 items-center text-xs text-green-700">
										<ClockIcon class="size-4" />
										18:32 - 16/06
									</p>
									<ChevronDownIcon class="size-5 text-green-900" />
								</div>
							</div>
							<div class="pb-2 px-3">
								dhdhd <br>
								dhdhdhd <br>
								djdjdjdj <br>
								djdjdjdjdjd <br>
								djdjdjdjd <br>
								dhdhdhd
							</div>
						</div>
            <button class="sticky top-0 rounded h-fit bg-green-700 flex gap-1 p-2 text-white">
              Dừng
              <PauseCircleIcon class="size-5" />
            </button>
          </li>
					</template>
        </ul>
      </section>
      <!-- tìm kiếm -->
      <section class="flex justify-between gap-3 group pt-3 p-2">
				<p class="flex items-center gap-1 text-slate-700 font-medium text-xs flex-shrink-0 group-focus-within:hidden">
					<ListBulletIcon class="size-4" />
					{{ $t('Kịch bản') }}
				</p>
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
              name: commonStore.conversation_info?.public_profile?.client_name,
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
            :page_id="commonStore.conversation_info?.public_profile?.fb_page_id"
            :staff_id="
              commonStore.conversation_info?.public_profile?.current_staff_id
            "
            size="24"
          />
        </div>
				</div>
      </section>
      <!-- danh sách kịch bản -->
      <section class="px-2 pb-1">
        <div v-if="is_over_time" class="text-xs text-center">
          <div>
            {{ $t('v1.view.dashboard.overtime') }}
          </div>
          <a
            href="https://developers.facebook.com/docs/messenger-platform/policy/policy-overview/"
            target="_blank"
            class="text-blue-500"
          >
            {{ $t('v1.view.dashboard.view_policy') }}
          </a>
        </div>
        <template v-else v-for="flow of list_flow">
          <div class="w-full flex items-center first-of-type:mt-0 mt-2 gap-2">
            <div
              class="p-1 border group rounded-full cursor-pointer"
              :class="{
                'border-slate-800 group-hover:bg-slate-300': !flow.is_preview,
                'border-blue-700 bg-blue-700': flow.is_preview,
              }"
            >
              <DocumentMagnifyingGlassIcon
                @click.stop="previewFlow(flow)"
                class="size-3.5"
                :class="{
                  'text-slate-800': !flow.is_preview,
                  'text-white': flow.is_preview,
                }"
              />
            </div>
            <VueCard
              @click="sendFlow(flow)"
              class="w-full min-w-0 flex items-center p-2 px-3 cursor-pointer text-black hover:text-orange-500 h-[38px] first-of-type:mt-0"
            >
              <!-- :class="{
                                '!bg-blue-50': flow.is_preview
                            }" -->
              <div
                class="w-[calc(100%_-_20px)] font-medium truncate mr-2"
              >
                {{ flow.flow_name }}
              </div>

              <SendIcon v-if="!flow.status" class="w-4 h-4 flex-shrink-0" />
              <Loading v-if="flow.status === 'PROCESS'" type="MINI" />
              <CheckIcon
                v-if="flow.status === 'DONE'"
                class="w-4 h-4 text-green-500 flex-shrink-0"
              />
            </VueCard>
          </div>
          <PreviewFlow
            v-if="flow.is_preview"
            :flow_list_action="flow.flow_list_action"
            :map_sequence="map_sequence"
            :map_label="map_label"
          />
        </template>
      </section>
    </article>
  </main>
</template>
<script setup lang="ts">
import {
  read_all_label,
  read_flow,
  read_sequence,
  send_flow,
} from '@/service/api/chatbot'
import { flow } from '@/service/helper/async'
import { useCommonStore } from '@/stores'
import { debounce, keyBy } from 'lodash'
import { ref, watch } from 'vue'

import ClientAvatar from '@/components/Avatar/ClientAvatar.vue'
import VueCard from '@/components/Flowbite/VueCard.vue'
import Loading from '@/components/Loading.vue'
import PreviewFlow from '@/components/PreviewFlow.vue'

import CheckIcon from '@/components/Icons/CheckIcon.vue'
import DocumentMagnifyingGlassIcon from '@/components/Icons/DocumentMagnifyingGlassIcon.vue'
import SearchIcon from '@/components/Icons/SearchIcon.vue'
import SendIcon from '@/components/Icons/SendIcon.vue'

import type { CbError, FlowInfo, Label, Sequence } from '@/service/interface'
import PauseCircleIcon from '@/components/Icons/PauseCircleIcon.vue'
import ClockIcon from '@/components/Icons/ClockIcon.vue'
import ChevronDownIcon from '@/components/Icons/ChevronDownIcon.vue'
import ListBulletIcon from '@/components/Icons/ListBulletIcon.vue'

const commonStore = useCommonStore()

/**tìm kiếm kịch bản */
const search = ref('')
/**id page hiện tại */
const current_page_id = ref()
/**danh sách kịch bản */
const list_flow = ref<FlowInfo[]>([])
/**có quá 24h không */
const is_over_time = ref(false)
/** ánh xạ id:dữ liệu của các chuỗi */
const map_sequence = ref<{ [key: string]: Sequence }>({})
/** ánh xạ id:dữ liệu của các nhãm */
const map_label = ref<{ [key: string]: Label }>({})

// khi thay đổi conversation_info thì tìm kiếm lại kịch bản
watch(
  () => commonStore.conversation_info,
  () => {
    // kiểm tra xem có quá 24h không
    checkOverTime()

    // nếu vẫn là page cũ thì thôi
    if (
      current_page_id.value &&
      commonStore.conversation_info?.public_profile?.fb_page_id ===
        current_page_id.value
    )
      return

    // lưu lại id page hiện tại mới
    current_page_id.value =
      commonStore.conversation_info?.public_profile?.fb_page_id

    // tìm kiếm lại kịch bản
    searchFlow()

    // lấy danh sách chuỗi
    readSequence()

    // lấy danh sách nhãn
    readLabel()
  }
)
// lắng nghe tìm kiếm kịch bản
watch(
  () => search.value,
  debounce(() => searchFlow(), 300)
)

/**tính xem có quá 24h không */
function checkOverTime() {
  /**mốc thời gian hiện tại */
  const NOW = Date.now()
  /**thời gian tin nhắn cuối cùng được gửi */
  const LAST_MESS_TIME =
    commonStore.conversation_info?.conversation_message?.last_message_time || 0
  /**khoảng thời gian */
  const DURATION = NOW - LAST_MESS_TIME
  /**24 giờ */
  const HOUR_24 = 1000 * 60 * 60 * 24

  if (DURATION > HOUR_24) {
    // gắn cờ quá 24h
    is_over_time.value = true

    // dừng tiến trình
    return
  }

  // bỏ gắn cờ quá 24h
  is_over_time.value = false
}
/**tìm kiếm danh sách kịch bản */
function searchFlow() {
  flow(
    [
      // * đọc danh sách kịch bản
      (cb: CbError) =>
        read_flow(
          {
            search: search.value,
            limit: 20,
            select: 'flow_name flow_id',
          },
          (e, r) => {
            if (e) return cb(e)

            if (r) list_flow.value = r
            cb()
          }
        ),
    ],
    undefined,
    true
  )
}
/**gửi kịch bản cho khách hàng */
function sendFlow(flow: FlowInfo) {
  /**
   * lấy id của client hiện tại
   * - tránh lỗi đang chạy thì client_id bị đổi do người dùng chọn khách hàng
   * khác
   */
  const CLIENT_ID = commonStore.conversation_info?.public_profile?.fb_client_id

  // chặn khi không có id hoặc đang xử lý
  if (!flow.flow_id || flow.status) return

  // đánh dấu đang xử lý
  flow.status = 'PROCESS'

  // gửi kịch bản
  send_flow(
    {
      client_id: CLIENT_ID,
      flow_id: flow.flow_id,
    },
    (e, r) => {
      // đánh dấu xử lý xong
      flow.status = 'DONE'

      // sau 2s thì ẩn đi
      setTimeout(() => (flow.status = undefined), 2000)
    }
  )
}

/** xem trước kịch bản */
function previewFlow(data: FlowInfo) {
  flow([
    // * Hiển thị thông tin
    (cb: CbError) => {
      /** trạng thái xem trước hiện tại */
      const CURRENT_IS_PREVIEW = data.is_preview

      //tắt các preview của kịch bản
      list_flow.value.forEach((flow) => (flow.is_preview = false))

      // nếu đang bật và muốn tắt đi thì thôi không call api nữa
      if (CURRENT_IS_PREVIEW) return

      // bật preview của kịch bản này
      data.is_preview = !CURRENT_IS_PREVIEW

      cb()
    },

    // * đọc dữ liệu kịch bản cần xem trước
    (cb: CbError) =>
      read_flow(
        {
          flow_id: data.flow_id,
          select: '',
        },
        (e, r) => {
          // nếu xảy ra lỗi
          if (e) return cb(e)

          // nếu không có dữ liệu các hành động
          if (!r?.[0]?.flow_list_action) return cb()

          // lưu lại dữ liệu các hành động
          data.flow_list_action = r?.[0]?.flow_list_action
          cb()
        }
      ),
  ])
}

/** lấy danh sách chuỗi */
function readSequence() {
  flow([
    // * đọc danh sách chuỗi
    (cb: CbError) =>
      read_sequence(
        {
          select: 'sequence_id sequence_name',
        },
        (e, r) => {
          // nếu có lỗi thì thôi
          if (e) return cb(e)

          // nếu không có dữ liệu thì thôi
          if (!r || !r.length) return

          // lưu lặp dữ liệu
          map_sequence.value = keyBy(r, 'sequence_id')
        }
      ),
  ])
}

/** lấy danh sách nhãn */
function readLabel() {
  flow([
    // * đọc danh sách chuỗi
    (cb: CbError) =>
      read_all_label({}, (e, r) => {
        // nếu có lỗi thì thôi
        if (e) return cb(e)

        // nếu không có dữ liệu thì thôi
        if (!r) return

        // lưu lặp dữ liệu
        map_label.value = r
      }),
  ])
}
</script>
<style scoped lang="scss"></style>
