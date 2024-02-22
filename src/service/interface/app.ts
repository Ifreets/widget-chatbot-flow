/**dữ liệu của một kịch bản */
export interface FlowInfo {
    /**id của kịch bản này */
    flow_id?: string
    /**tên của kịch bản */
    flow_name?: string
    /**các trạng thái của kịch bản */
    status?: 'PROCESS' | 'DONE'
}

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
}