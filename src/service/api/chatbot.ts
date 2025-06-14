import request from '@/service/helper/request'
import { useCommonStore } from '@/stores'

import type { Cb, FindFlowParam, FlowInfo } from '@/service/interface'

/**gọi api đến server chatbot */
export const chatbot = (
    { path, body }: { path: string, body?: {} },
    proceed: Cb
) => {
    const commonStore = useCommonStore()

    request({
        uri: `${$env.host.chatbot}/${path}`,
        method: 'POST',
        headers: {
            Authorization: $bbh_widget.chatbox_widget_access_token
        },
        body: {
            page_id: commonStore.conversation_info?.public_profile?.fb_page_id,
            ...body
        },
        json: true,
    }, (e, r, b) => {
        // format kết quả trả về
        if (e) return proceed(e?.mean || e?.message || e)

        proceed(null, b?.data || b)
    })
}

/**gọi api đến server chatbot service v3 */
export const chatbot_v3 = (
    { path, body }: { path: string, body?: {} },
    proceed: Cb
) => {
    const commonStore = useCommonStore()

    request({
        uri: `${$env.host.chatbot_v3}/${path}`,
        method: 'POST',
        headers: {
            Authorization: $bbh_widget.chatbox_widget_access_token
        },
        body: {
            page_id: commonStore.conversation_info?.public_profile?.fb_page_id,
            ...body
        },
        json: true,
    }, (e, r, b) => {
        // format kết quả trả về
        if (e) return proceed(e?.mean || e?.message || e)

        proceed(null, b?.data || b)
    })
}

/**lấy danh sách kịch bản */
export const read_flow = (body: FindFlowParam, proceed: Cb<FlowInfo[]>) => chatbot(
    { path: 'app/flow/read_flow', body },
    proceed
)

/**gửi kịch bản */
export const send_flow = (body: {
    flow_id?: string
    client_id?: string
}, proceed: Cb) => chatbot(
    { path: 'app/json', body },
    proceed
)

/** lấy danh sách chuỗi */
export const read_sequence = (body: FindFlowParam, proceed: Cb) => chatbot(
    { path: 'app/sequence/read_sequence', body },
    proceed
)

/** lấy danh sách thẻ */
export const read_all_label = (body: FindFlowParam, proceed: Cb) => chatbot_v3(
    { path: 'app/page/get_one_page_all_label', body },
    proceed
)