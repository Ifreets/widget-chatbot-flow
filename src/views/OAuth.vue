<template>
    <div class="w-full h-full flex items-center justify-center">
        <div class="min-w-[500px] p-6 bg-white border border-gray-200 rounded-lg shadow">
            <div class="flex items-center">
                <img src="@/assets/icons/logo.svg" class="w-5 h-5" />
                <div class="font-semibold ml-2">
                    {{ $t('v1.common.title') }}
                </div>
            </div>
            <div class="text-2xl font-bold mt-2">
                {{ $t('v1.view.oauth.title') }}
            </div>
            <div class="flex justify-center">
                <img src="@/assets/imgs/oauth.svg" class="w-[100px] my-10" />
            </div>
            <div class="text-sm font-medium text-slate-500 text-center">
                {{ $t('v1.view.oauth.guild') }}
            </div>
            <button @click="oauthBbh"
                class="text-white bg-blue-700 hover:brightness-90 font-medium rounded-lg text-sm px-5 py-2.5 me-2 focus:outline-none mt-2 w-full">
                {{ $t('v1.view.oauth.active') }}
            </button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { toggle_loading } from '@/service/helper/async'
import WIDGET from 'bbh-chatbox-widget-js-sdk'
import Swal from 'sweetalert2'
import { useI18n } from 'vue-i18n'

const $t = useI18n().t

/**kết nối widget với bbh */
async function oauthBbh() {
    try {
        // bật loading
        toggle_loading(true)
        //call api auth widget
        await WIDGET.oAuth()
        // thông báo thành công
        Swal.fire({
            title: $t('v1.view.oauth.success.title'),
            text: $t('v1.view.oauth.success.description'),
            icon: 'success'
        })
    } catch (e) {
        console.log(e);
    } finally {
        // tắt loading
        toggle_loading(false)
        // đóng widget
        window.close()
    }
}
</script>
<style scoped lang="scss"></style>