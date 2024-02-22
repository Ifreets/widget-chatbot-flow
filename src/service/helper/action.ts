import { toast } from '@/service/helper/alert'
import { i18n } from '@/lang'

/**mở url trong tab mới */
export const openNewTab = (url: string) => window.open(url, '_blank')

/**sao chép clipboard và thông báo */
export const copyToClipboard = (text: string, alert?: string) => {
    const $t = i18n.global.t

    // sao chép
    navigator.clipboard.writeText(text)

    // thông báo
    toast('success', alert || $t('v1.common.copy_success'))
}