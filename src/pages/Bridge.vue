<template>
    <form @submit.prevent="onSubmit">
        <div class="inputsWrapper">
            <div class="inputsWrapper__left">
                <div class="wrapper">
                    <label class="wrapper__label" for="origin">Origin Network</label>
                    <select disabled name="origin" id="origin" class="wrapper__input disabled">
                        <option value="" selected>{{ store.getters.getCurrentNetwork }}</option>
                    </select>
                </div>
                <div class="wrapper">
                    <label class="wrapper__label" for="value">Origin Address</label>
                    <input disabled type="text" id="value" class="wrapper__input disabled"
                        :value="store.getters.getAccountAddressFormatted">
                </div>
            </div>
            <img class="inputsWrapper__arrow" width="64" height="64" src="/send-money.png" alt="Send money icon">
            <div class="inputsWrapper__right">
                <div class="wrapper wrapper__select">
                    <label class="wrapper__label select" for="value">Destination Network</label>
                    <TheDropdown :secondaryColor="true" :changeOnSelect="false" :options="networks"
                        @selectChange="selectChanged"></TheDropdown>
                </div>
                <div class="wrapper wrapper__right">
                    <label class="wrapper__label" for="value">Destination Address</label>
                    <input v-model="finalAddress" type="text" id="value" class="wrapper__input">
                    <button v-if="!finalAddress" @click="pasteFromClipboard">
                        <img src="/paste.png" alt="Paste from clipboard icon">
                    </button>
                </div>
            </div>
        </div>

        <div class="submitWrapper">
            <div class="wrapper">
                <label class="wrapper__label" for="value">Valor</label>
                <span>SBRL</span>
                <input v-model="amount" step="1" type="number" id="value" class="wrapper__input">
            </div>

            <button @click="handleBridgeClick" class="inputsWrapper__submit" type="submit">
                <img src="/bridge.svg" alt="Bridge icon">
                <p>Bridge</p>
            </button>
        </div>
    </form>
</template>

<script lang="ts">
import { ref } from 'vue'
import store from '../store'
import { doBridge } from '../utils/utils'
import { networks } from '../constants/constants';
import TheDropdown from '../components/TheDropdown.vue';

export default {
    components: { TheDropdown },
    setup() {
        const finalAddress = ref('')
        const amount = ref<number | any>(null)
        const network = ref(0)
        const onSubmit = () => {
            return true
        }
        const pasteFromClipboard = () => {
            navigator.clipboard
                .readText()
                .then(
                    cliptext => finalAddress.value = cliptext,
                    err => console.log(err)
                );
        }
        const handleValues = () => {
            return amount.value >= store.getters.getAccountBalance;
        }
        const selectChanged = (e: number) => {
            network.value = e;
        }
        const handleBridgeClick = () => {
            if (handleValues()) {
                return
            }
            doBridge(finalAddress.value, amount.value.toString(), network.value)
        }

        return {
            store,
            amount,
            network,
            networks,
            finalAddress,
            onSubmit,
            selectChanged,
            handleBridgeClick,
            pasteFromClipboard,
        }
    }
}

</script>

<style lang="scss">
form {
    margin-top: 140px;
    position: relative;
    z-index: 1;

    .inputsWrapper {
        z-index: 3;
        position: relative;

        .wrapper__input {
            max-width: 265px;
        }
    }

    .inputsWrapper,
    .submitWrapper {
        display: flex;
        justify-content: center;
        align-self: center;

        &__left {
            display: flex;
            flex-direction: column;
        }

        &__arrow {
            z-index: 1;
            width: 100px;
            height: 100px;
            margin: 0 80px;
            align-self: center;
        }

        .wrapper {
            display: flex;
            flex-direction: column;
            align-items: flex-start;

            select {
                width: 100%;
                -webkit-appearance: none;
                background-color: #ececec;
                opacity: 0.5;
            }

            &__input {
                background-color: #2d3ab5;
                z-index: 1;
                border-radius: 40px;
                border: none;
                font-size: 28px;
                margin-bottom: 40px;
                padding: 20px 28px;
                font-weight: 500;
                font-family: 'Kanit', sans-serif;
                color: #fff;

                &:focus,
                &:focus-visible {
                    outline: none;
                }

                &.disabled {
                    background-color: #ececec;
                    opacity: 0.5;
                    color: rgb(115, 115, 115);
                }
            }

            label {
                padding-left: 28px;
                margin-bottom: -14px;
                font-size: 28px;
                color: #fff;
                z-index: 2;
                font-weight: 400;
            }
        }

        &__submit {
            background-color: #EEECEC;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 40px;
            height: 100px;
            margin-top: 50px;
            padding: 24px 68px;

            img {
                width: 60px;
                margin-right: 24px;
            }

            p {
                font-size: 36px;
                color: #000000;
            }
        }
    }

    .submitWrapper {
        max-width: 450px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        position: relative;
        z-index: 2;

        span {
            color: rgba(255, 255, 255, 0.53);
            z-index: 3;
            font-weight: 500;
            position: absolute;
            top: 40px;
            font-size: 28px;
            left: 24px;
        }

        .wrapper__input {
            margin: 0;
            width: auto;
            padding-left: 100px;
        }
    }

    .wrapper__right {
        position: relative;
        z-index: 1;
        margin-top: 30px;

        button {
            position: absolute;
            right: 50px;
            bottom: 40px;
            z-index: 2;
            background-color: transparent;

            img {
                width: 36px;
            }
        }
    }

    .wrapper__select {
        position: relative;
        margin-top: 10px;
        z-index: 2;
    }

    .wrapper__label.select {
        color: #2d3ab5 !important;
        margin-bottom: -44px !important;
    }
}
</style>
