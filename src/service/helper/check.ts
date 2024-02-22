/**kiểm tra cỡ màn hình, từ đó suy luận ra có đang ở chế độ dt hay không */
export const isMobile = () => {
    return window.innerWidth < 768
}