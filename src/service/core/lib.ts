import WIDGET from 'bbh-chatbox-widget-js-sdk'
import type { Cb } from '../interface'

export const loadLib = (proceed: Cb) => {
    // load widget sdk
    WIDGET.load($env.bbh_widget.chatbox_secret_key, $env.host.widget_sdk)
    proceed()
}