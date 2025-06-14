import type { Language } from '@/service/interface'

const source: Language = {
    name: 'Tiếng Việt',
    v1: {
        common: {
            title: 'Chatbot Bot Bán Hàng',
            loading: 'Đang tải dữ liệu ...',
            search_placeholder: 'Gửi kịch bản đến {name}',
        },
        view: {
            error: {
                init_bbh: 'Cấu hình kết nối với Bot Bán Hàng thất bại'
            },
            network: {
                disconnect: 'Mất kết nối mạng...',
                connected: 'Đã kết nối mạng!'
            },
            adblocker: {
                title: 'Hãy tắt các tiện ích chặn quảng cáo bạn đang sử dụng đối với trang này, để có thể sử dụng một cách bình thường',
            },
            dashboard: {
                send_success: 'Đã gửi kịch bản',
                overtime: 'Chatbot chỉ gửi được kịch bản đến người dùng trong 24h',
                view_policy: 'Xem chính sách FB'
            },
            oauth: {
                active: 'Kết nối ứng dụng',
                title: 'Xác thực ứng dụng',
                guild: 'Bấm vào nút dưới đây để xác thực việc kết nối ứng dụng',
                success: {
                    title: 'Đã kết nối thành công',
                    description: 'Bấm OK để đóng popup'
                }
            },
            flow_detail:{
                action: {
                    action_type: 'Loại hành động',
                    send_message: 'Gửi tin nhắn',
                    add_sequence: 'Thêm chuỗi sự kiện',
                    remove_sequence: 'Xoá chuỗi sự kiện',
                    set_attribute: 'Lưu dữ liệu',
                    add_label: 'Thêm vào nhóm',
                    remove_label: 'Xoá khỏi nhóm',
                    request: 'Gửi yêu cầu',
                    question: 'Hỏi đáp',
                    delay: 'Soạn tin nhắn'
                },
                send_message: {
                    send_message_type: 'Loại tin nhắn',
                    send_message_time: 'Thời gian soạn tin nhắn',
                    send_message_time_guild: 'Hiển thị bong bóng nhập liệu khi trang đang chuẩn bị trả lời',
                    text_quick_reply: 'Văn bản kèm trả lời nhanh',
                    slider: 'Bộ ảnh ngang (Slide)',
                    text: 'Văn bản',
                    text_button: 'Văn bản kèm nút bấm',
                    second: 'giây',
                    content: 'Nội dung tin nhắn',
                    content_guild: 'Nhập vào nội dung tin nhắn',
                    default_message: 'Xin chào bạn. Vui lòng chọn menu để mua sản phẩm.',
                    limit_text_guild: 'Giới hạn tổng số ký tự của Facebook',
                    media: 'Hình ảnh hoặc Video',
                },
                slider: {
                    title: 'Cài đặt bộ ảnh ngang',
                    empty: 'Chưa chọn slide',
                    item: 'slide',
                    add: 'Thêm slide',
                    limit: 'Tối đa 10 slide',
                    guild: 'Nhấp chuột để chỉnh sửa, kéo thả để di chuyển',
                    item_image: 'Hình ảnh',
                    item_title: 'Tiêu đề',
                    item_title_guild: 'Nhập vào tiêu đề của slide này (bắt buộc)',
                    item_description: 'Phụ đề',
                    item_description_guild: 'Nhập vào phụ đề của slide này',
                    item_url: 'Mở liên kết khi nhấp vào ảnh',
                    item_url_guild: 'Nhập vào đường dẫn liên kết: https://...',
                    image_upload_guild: 'Nhấp vào để tải ảnh lên hoặc thay ảnh khác',
                    error: {
                        file_not_select: 'Bạn chưa chọn hình ảnh',
                        upload: 'Tải ảnh lên thất bại',
                    },
                    square_image: 'Sử dụng ảnh vuông',
                    suggest: 'Kích thước ảnh tối ưu: 1200 x 628 hoặc 1080 x 1080 với ảnh vuông'
                },
                attribute: {
                    title: 'Thuộc tính',
                    guild: 'Chèn thuộc tính',
                    add: 'Thêm dữ liệu',
                    allow_active_trigger: 'Kích hoạt kịch bản dựa trên thuộc tính ngay lập tức',
                    item: 'Thuộc tính tùy biến'
                },
                action_type: {
                    message: 'Tin nhắn',
                    message_guild: 'Gửi tin nhắn đến khách hàng',
                    add_sequence: 'Thêm chuỗi',
                    remove_sequence: 'Xoá chuỗi',
                    add_sequence_guild: 'Thêm khách hàng vào chuỗi sự kiện',
                    remove_sequence_guild: 'Xoá khách hàng khỏi chuỗi sự kiện',
                    set_attribute: 'Lưu dữ liệu',
                    set_attribute_guild: 'Lưu dữ liệu vào thuộc tính tuỳ biến',
                    add_label: 'Thêm vào nhóm',
                    add_label_guild: 'Thêm khách hàng vào nhóm Chatbox',
                    remove_label: 'Xoá khỏi nhóm',
                    remove_label_guild: 'Xoá khách hàng khỏi nhóm Chatbox',
                    request: 'Gửi yêu cầu',
                    request_guild: 'Gọi JSON API',
                    question: 'Hỏi đáp',
                    question_guild: 'Hỏi đáp nhận câu trả lời của khách hàng',
                    delay: 'Soạn tin nhắn',
                    delay_guild: 'Chờ một khoảng thời gian rồi mới gửi tin nhắn',
                },
                error: {
                    missing_name: 'Bạn nhập thiếu tên kịch bản',
                    missing_action: 'Bạn cần tạo hành động cho kịch bản',
                    action_wrong: 'Bạn nhập thiếu dữ liệu cho hành động',
                    not_found: 'Không tìm thấy dữ liệu kịch bản',
                    missing_sequence: 'Chưa chọn chuỗi',
                    missing_attribute: 'Chưa chọn thuộc tính',
                    missing_attribute_value: 'Nhập dữ liệu cần lưu',
                    url: 'Đường dẫn không hợp lệ',
                    json: 'Nội dung JSON không hợp lệ',
                    button: 'sdfsfsd'
                },
                media: {
                    title: 'Thiết lập media',
                    type_title: 'Kiểu dữ liệu',
                    image: 'Hình ảnh',
                    video: 'Video',
                    url: 'Đường dẫn',
                    url_guild: 'Nhập vào đường dẫn: https://...',
                    use_facebook_resource: 'Sử dụng tài nguyên của Facebook',
                    guild: {
                        title: 'Hướng dẫn',
                        guild_1: 'Ấn vào ảnh hoặc video trên facebook để hiện chi tiết',
                        guild_2: 'Sao chép địa chỉ trên thanh địa chỉ của trình duyệt',
                    },
                    valid: {
                        title_image: 'Địa chỉ ảnh hợp lệ',
                        title_video: 'Địa chỉ video hợp lệ',
                    }
                },
                request: {
                    title: 'Cài đặt gửi yêu cầu',
                    method: 'Phương thức',
                    url: 'Nhập vào đường dẫn: https://...',
                    header: 'Cài đặt header',
                    qs: 'Cài đặt query string',
                    body: 'Cài đặt body',
                    response_name: 'Tên biến lưu trữ dữ liệu trả về',
                    response_name_placeholder: 'viet_lien_khong_dau',
                },
                question: {
                    title: 'Nội dung câu hỏi',
                    guild: 'Nhập vào nội dung câu hỏi sẽ gửi cho khách hàng',
                    receive_field: 'Tên biến lưu trữ dữ liệu kết quả'
                }
            }
        }
    },
}

export default source