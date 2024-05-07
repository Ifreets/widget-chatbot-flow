import type { Language } from '@/service/interface'

const source: Language = {
    name: 'Tiếng Việt',
    v1: {
        common: {
            title: 'Chatbot Bot Bán Hàng',
            loading: 'Đang tải dữ liệu ...',
            search_placeholder: 'Tìm kiếm kịch bản',
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
            }
        }
    },
}

export default source