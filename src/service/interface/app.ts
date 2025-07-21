// /**dữ liệu của một kịch bản */
// export interface FlowInfo {
//     /**id của kịch bản này */
//     flow_id?: string
//     /**tên của kịch bản */
//     flow_name?: string
//     /**các trạng thái của kịch bản */
//     status?: 'PROCESS' | 'DONE'
//     flow_list_action?: any[]
//     // * các field tự thêm
//     /** có đang preview hay không */
//     is_preview?: boolean

import type { CustomerInfo } from "bbh-chatbox-widget-js-sdk"

// }

/**các field đọc dữ liệu dùng chung */
export interface FindFlowParam {
  /**phân trang */
  skip?: number
  /**phân trang */
  limit?: number
  /**sắp xếp */
  sort?: string
  /**chọn các field cần thiết */
  select?: string
  /**tìm kiếm dữ liệu */
  search?: string
  /**id kịch bản */
  flow_id?: string
  /** id của trang hiện tại */
  page_id?: string
  /**id khách hàng */
  client_id?: string
  /** lọc theo tag */
  flow_list_tag_id?: string[]
}

/**dữ liệu của một kịch bản */
export interface FlowInfo {
  /**id gốc của mongo */
  _id?: string
  /**id của kịch bản này */
  flow_id?: string
  /**id của trang sở hữu kịch bản */
  page_id?: string
  /**tên của kịch bản */
  flow_name?: string
  /**ghi chú thêm */
  flow_description?: string
  /**danh sách các nhãn được đánh dấu cho kịch bản này */
  flow_list_tag_id?: string[]
  /**nội dung hành động của kịch bản này */
  flow_list_action: FlowActionInfo[]
  /**thời gian cập nhật */
  updatedAt?: string
  /**thời gian tạo */
  createdAt?: string
  /**kịch bản được gắn dấu sao */
  flow_is_highlight?: boolean

  /** danh sách các thẻ */
  tags?: TagInfo[]

  // * các field tự thêm
  /** có đang preview hay không */
  is_preview?: boolean
  /**các trạng thái của kịch bản */
  status?: 'PROCESS' | 'DONE'
}
/**dữ liệu một hành động của kịch bản */
export interface FlowActionInfo {
  /**gửi nội dung text cho AI */
  action_is_prompt?: boolean
  /**gửi nội dung text cho LLM */
  action_is_llm?: boolean
  /**kiểu của hành động này là gì */
  action_type?: FlowActionType
  /**danh sách thuộc tính tuỳ biến được set */
  action_list_attribute?: ActionAttributeInfo[]
  /**kiểu nhỏ của hành động này là gì */
  action_sub_type?:
    | 'TEXT'
    | 'TEXT_BUTTON'
    | 'TEXT_QUICK_REPLY'
    | 'SLIDER'
    | 'MEDIA'
  /**dữ liệu của hành động hỏi đáp */
  action_question?: {
    /**tên trường dữ liệu sẽ được set giá trị của câu trả lời */
    question_receive_field?: string
  }
  /**nội dung tin nhắn văn bản gửi đến khách hàng */
  action_text?: string
  /**thời gian nghỉ trước khi tin nhắn được gửi */
  action_delay?: number
  /**id của hành động này */
  action_id?: number
  /**hành động xoá khỏi chuỗi sẽ chờ khách hàng trả lời tin nhắn thì mới */
  action_remove_sequence_if_client_reply?: boolean
  /**có chặn các action tiếp theo không */
  action_block_next_all_action_if_sequence_exist?: boolean
  /**id của chuỗi cần thêm, xoá */
  action_sequence_id?: string
  /**nội dung nút bấm gửi đến khách hàng */
  action_list_button?: ButtonInfo[]
  /**nội dung trả lời nhanh */
  action_list_quick_reply?: ActionQuickReplyInfo[]
  /**nội dung các slider gửi đến khách hàng  */
  action_list_slider?: SliderInfo[]
  /**đánh dấu cho fb sẽ tự crop hình ảnh thành hình vuông */
  action_slider_square_image?: boolean
  /**dữ liệu media của hành động */
  action_media?: ActionMediaInfo
  /**id nhãn chatbox muốn thêm hoặc xoá */
  action_label_id?: string
  /**dữ liệu của request */
  action_request?: ActionRequestInfo
  /**tính toán có chạy hành động này không */
  action_active_condition?: string
}

/**dữ liệu của nút khi có đính kèm */
export interface ButtonInfo {
  /**kiểu của nút */
  button_type?: 'WEBSITE' | 'FLOW' | 'PHONE'
  /**tiêu đề của nút */
  button_title?: string
  /**url của nút, bấm vào sẽ mở webview hoặc tab mới */
  button_url?: string
  /**id kịch bản kích hoạt */
  button_flow_id?: string
  /**số điện thoại của nút */
  button_phone?: string
}

/**nội dung trả lời nhanh */
export interface ActionQuickReplyInfo {
  /**kiểu của trả lời nhanh */
  quick_reply_type?: 'EMAIL' | 'FLOW' | 'PHONE'
  /**tiêu đề của trả lời nhanh */
  quick_reply_title?: string
  /**id kịch bản kích hoạt */
  quick_reply_flow_id?: string
}
/**hành động với thuộc tính */
export interface ActionAttributeInfo {
  /**id của thuộc tính */
  attribute_id?: string
  /**giá trị sẽ lưu, có thể là biểu thức tính toán */
  attribute_value?: AttributeValueType
  /**đánh dấu giá trị này có phải là biểu thức tính toán hay không */
  attribute_is_expression?: boolean
  /**sẽ chạy trigger khi thay đổi giá trị của thuộc tính tuỳ biến */
  attribute_is_trigger?: boolean
}
/**kiểu của hành động của kịch bản */
export type FlowActionType =
  | 'SEND_MESSAGE'
  | 'ADD_SEQUENCE'
  | 'REMOVE_SEQUENCE'
  | 'SET_ATTRIBUTE'
  | 'ADD_LABEL'
  | 'REMOVE_LABEL'
  | 'REQUEST'
  | 'QUESTION'
  | 'DELAY'

/**dữ liệu của một request */
export interface ActionRequestInfo {
  /**kiểu của request */
  request_method?: 'GET' | 'POST' | 'DELETE' | 'PUT'
  /**url của request */
  request_url?: string
  /**body của request */
  request_body?: string
  /**query string của request */
  request_qs?: string
  /**header của request */
  request_header?: string
  /**toàn bộ khối dữ liệu trả về sẽ được lưu vào biến có tên này */
  request_response_name?: string
}
/**dữ liệu media của hành động */
export interface ActionMediaInfo {
  /**kiểu của media */
  media_type?: 'IMAGE' | 'VIDEO'
  /**link của media */
  media_url?: string
  /**có sử dụng tài nguyên của fb không */
  media_is_use_facebook_resource?: boolean
}
/**dữ liệu của một slider */
export interface SliderInfo {
  /**id fe cho drag */
  slider_key?: number
  /**link của hình ảnh */
  slider_image_url?: string
  /**khi click vào slider thì sẽ mở tab mới ra link này */
  slider_item_url?: string
  /**tiêu đề chính của slider */
  slider_title?: string
  /**tiêu đề phụ của slider */
  slider_sub_title?: string
  /**các nút bấm của slider, tương tự như kịch bản */
  slider_list_button?: ButtonInfo[]
}

/**dữ liệu của một thuộc tính tuỳ biến */
export type AttributeValueType = string | number | boolean

/** dữ liệu chuỗi */
export interface Sequence {
  /** id chuỗi */
  sequence_id: string

  /** tên chuỗi sự kiện */
  sequence_name: string

  /** id trong db */
  _id: string
}

/**
 * Nhãn tùy chỉnh.
 */
export interface Label {
  /** ID duy nhất của nhãn */
  _id: string

  /** Loại nhãn */
  type: string

  /** Màu chữ (hex) */
  text_color: string

  /** Màu nền (hex) */
  bg_color: string

  /** ID trang Facebook */
  fb_page_id: string

  /** Tên nhãn hiển thị */
  title: string

  /** Ngày tạo */
  createdAt: string

  /** Ngày cập nhật */
  updatedAt: string

  /** Phiên bản MongoDB */
  __v: number

  /** Mô tả nhãn */
  description: string

  /** Thứ tự hiển thị */
  index: number
}

/**dữ liệu của bảng trung gian giữa sự kiện chuỗi và khách hàng */
export interface MappingClientSequenceInfo {
  _id?: string
  /**id của chuỗi */
  sequence_id?: string
  /**id của khách hàng */
  client_id?: string
  // id của trang sở hữu khách hàng này
  page_id?: string
  /**mốc thời gian mà sự kiện này được kích hoạt */
  event_timestamp?: number
  /**id của kịch bản muốn kich hoạt */
  event_flow_id?: string
  /** dữ liệu của chuỗi */
  sequence?: Sequence
  /** dữ liệu kịch bản */
  flow?: FlowInfo
  /** dữ liệu thuộc tính */
  attribute?: AttributeInfo
  /** loại sự kiện */
  event_sub_type?: 'FLOW' | 'ATTRIBUTE'

  // * các field tự thêm
  /** có đang preview hay không */
  is_preview?: boolean
}

/**dữ liệu của một thuộc tính */
export interface AttributeInfo {
  /**id mongo */
  _id?: any
  /**id của thuộc tính */
  attribute_id?: string
  /**id của trang sở hữu thuộc tính này */
  page_id?: string
  /**tên của thuộc tính */
  attribute_name?: string
  /**mô tả của thuộc tính */
  attribute_description?: string
  /**kiểu dữ liệu của thuộc tính */
  attribute_type?: 'STRING' | 'NUMBER' | 'BOOLEAN'
  /**phạm vi của thuộc tính */
  attribute_scope?: 'CLIENT' | 'PAGE'
  /**key của thuộc tính */
  attribute_key?: string
  /**giá trị mặc định của thuộc tính */
  attribute_default_value?: string | number | boolean
  /**đánh dấu thuộc tính này có được kích hoạt tính năng trigger hay không */
  attribute_trigger_is_active?: boolean
  /**danh sách các trigger của thuộc tính này */
  attribute_list_trigger?: AttributeTriggerInfo[]
}

/**dữ liệu của một trigger */
export interface AttributeTriggerInfo {
  /**trigger sẽ kiểm tra dữ liệu thoả mãn theo cách nào */
  trigger_condition?:
    | 'EQUAL'
    | 'NOT_EQUAL'
    | 'GREATER_THAN'
    | 'LESS_THAN'
    | 'GREATER_THAN_OR_EQUAL'
    | 'LESS_THAN_OR_EQUAL'
  /**giá trị của trigger được dùng để so sánh */
  trigger_value?: string | number | boolean
  /**id của kịch bản muốn kích hoạt */
  trigger_flow_id?: string
}

/** /dữ liệu của một tag */
export interface TagInfo {
  /**id mongo */
  _id?: any
  /**id của tag này */
  tag_id?: string
  /**id của trang sở hữu tag */
  page_id?: string
  /**tên của tag */
  tag_name?: string
  /**ghi chú thêm */
  tag_description?: string
  /** mã màu color của tag này */
  tag_color?: string
  /** tag_id của tag cha */
  parent_id?: string
}

/** dữ liệu khách hàng giải mã được bố sung thêm field platform_type */
export interface CustomerInfoExtend extends CustomerInfo {
  /**thông tin cuộc trò chuyện */
  conversation_message?: {
    /**thời gian cuối cùng khách hàng đọc tin nhắn */
    last_read_message?: string
    /**thời gian cuối cùng tin nhắn phát sinh */
    last_message_time: number
    /**nội dung tin nhắn cuối cùng */
    last_message?: string
    /**loại tin nhắn cuối cùng */
    last_message_type?: 'page' | 'client'
    /** nền tảng của tin nhắn */
    platform_type?: string
  }
}
