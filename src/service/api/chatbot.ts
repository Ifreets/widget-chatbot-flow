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
            Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzE3MTEzMDE2NzcxMjMzIiwiZmJfc3RhZmZfaWQiOiIxMjIxMjE3MzA2MzQzMzI0NDIiLCJfaWQiOiI2ODUxMGQ1OWFmMGVlNjYyZWQ3NjI3MjIiLCJpYXQiOjE3NTAxNDIyOTcsImV4cCI6MzE1NTM1MDE0MjI5N30.c4TyKS046cHCw3ZmvcPxIfp5CxdOF8Pu50nyik0XQT8'
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
            Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzE3MTEzMDE2NzcxMjMzIiwiZmJfc3RhZmZfaWQiOiIxMjIxMjE3MzA2MzQzMzI0NDIiLCJfaWQiOiI2ODUxMGQ1OWFmMGVlNjYyZWQ3NjI3MjIiLCJpYXQiOjE3NTAxNDIyOTcsImV4cCI6MzE1NTM1MDE0MjI5N30.c4TyKS046cHCw3ZmvcPxIfp5CxdOF8Pu50nyik0XQT8'
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

/** lấy các chuỗi sự kiện sắp gửi của khách hàng đó */
export const read_sequence_by_client = (body: FindFlowParam, proceed: Cb) => chatbot(
    { path: 'app/sequence/read_mapping_client_sequence', body },
    proceed
)

/** dừng chuỗi */
export const remove_sequence = (body: {
    sequence_id?: string,
    client_id?: string,
    page_id?: string,
    mapping_client_sequence_id?: string
}, proceed: Cb) => chatbot(
    { path: 'app/sequence/delete_mapping_client_sequence_event', body },
    proceed
)

/** lấy danh sách thẻ */
export const read_all_label = (body: FindFlowParam, proceed: Cb) => chatbot_v3(
    { path: 'app/page/get_one_page_all_label', body },
    proceed
)