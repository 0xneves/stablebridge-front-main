<template>
    <div class="pix">
        <img :src="`data:image/png;base64,${code}`" alt="QR code">
        <button title="Clique para copiar" @click="copyToClipboard">
            <p>{{ store.getters.getPixData.qr_code }}</p>
            <img v-if="!showMessage" src="/copy.svg" alt="Copy icon">
            <span v-else>Copied to clipboard!</span>
        </button>
    </div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from "vue-router";
import { listenToPayment } from '../utils/utils'
import store from '../store'

export default {
    setup() {
        const code = ref<string | string[]>('')
        const showMessage = ref(false)

        onMounted(() => {
            const route = useRoute();

            code.value = route.params.code;

            listenToPayment()
        })

        const copyToClipboard = () => {
            navigator.clipboard.writeText(store.getters.getPixData.qr_code);
            showMessage.value = true;

            setTimeout(() => {
                showMessage.value = false
            }, 2000)
        }

        return {
            code,
            store,
            showMessage,
            copyToClipboard,
        }
    }
}
</script>

<style lang="scss" scoped>
.pix {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 120px;
    z-index: 1;
    position: relative;

    img {
        width: 382px;
    }

    button {
        color: #000;
        width: 320px;
        word-break: break-all;
        background: transparent;
        cursor: pointer;

        img {
            width: 40px;
        }

        span {
            margin-top: 10px;
        }
    }
}
</style>