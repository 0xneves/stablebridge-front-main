<template>
    <form class="form">
        <div class="wrapper">
            <label class="wrapper__label wrapper__label-input" for="value">Value</label>
            <span>BRL R$</span>
            <input v-model="value" @keyup="handleEmptyInput" required type="number" step="1" id="value"
                :class="[{ error: showInputError }, 'wrapper__input']">
        </div>
        <div class="wrapper">
            <label class="wrapper__label" for="value">Network</label>
            <button id="value" class="wrapper__button" disabled>
                {{store.getters.getCurrentNetwork}}
            </button>
        </div>
        <div class="wrapper">
            <label class="wrapper__label" for="value">Address</label><button id="value" class="wrapper__button"
                disabled>
                {{store.getters.getAccountAddressFormatted}}
            </button>
        </div>
        <span v-show="showInputError" class="errorMessage">Deposit value should be higher than zero.</span>
        <button class="form__submit" type="submit" @click.prevent="onSubmit">
            <img src="/money-down.svg" alt="Deposit icon">
            <p>DEPOSIT</p>
        </button>
    </form>
</template>

<script lang="ts">
import { ref } from 'vue'
import store from '../store'
import { router } from '../main'

export default {
    setup() {
        const value = ref('');
        const showInputError = ref(false);

        const handleEmptyInput = () => {
            if (!value.value) {
                showInputError.value = true
            } else {
                showInputError.value = false
            }
        }

        const onSubmit = async () => {
            handleEmptyInput()

            const myHeaders = new Headers();

            myHeaders.append('Content-Type', 'application/json')

            const res = await fetch(`${import.meta.env.VITE_PIX_API}/create-pix`, {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({
                    address: store.getters.getAccountAddress,
                    amount: value.value,
                    network: store.getters.getCurrentNetwork.toLowerCase()
                }),
            })
            const data = await res.json()

            if (data['qr_code_base64']) {
                router.push({ name: 'Pix', params: { code: data['qr_code_base64'] } });

                store.dispatch('updatePixData', data)
            }
        }

        return {
            store,
            value,
            showInputError,
            onSubmit,
            handleEmptyInput
        }
    }
}
</script>

<style lang="scss" scoped>
.form {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 120px;
    position: relative;

    .errorMessage {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 130px;
        z-index: 2;
        width: 360px;
        background-color: rgb(228, 94, 94);
        border: 2px solid rgb(237, 174, 174);
        padding: 14px 24px;
        border-radius: 8px;
    }

    .wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
        position: relative;

        &__input {
            background-color: #2d3ab5;
            z-index: 1;
            border-radius: 40px;
            border: none;
            font-size: 24px;
            margin-bottom: 40px;
            padding: 28px 88px 28px 128px;
            font-weight: 500;
            font-family: 'Kanit', sans-serif;
            color: #fff;

            &:focus {
                outline: none;
            }

            &.error {
                border: 1px solid rgb(228, 94, 94);
            }

            &:disabled {
                opacity: 0.5;
            }
        }

        span {
            color: rgba(255, 255, 255, 0.53);
            z-index: 3;
            font-weight: 500;
            position: absolute;
            top: 44px;
            font-size: 28px;
            left: 28px;
        }

        &__button {
            background-color: #bfc4f1;
            border-radius: 40px;
            border: none;
            padding: 20px 28px;
            font-size: 28px;
            margin-bottom: 40px;
            flex-grow: 1;
            text-align: left;
            cursor: auto;
            color: #fff;

            &:disabled {
                opacity: 0.6;
            }
        }

        &__label-input {
            font-size: 36px;
        }

        label {
            font-size: 28px;
            color: #fff;
            padding-left: 28px;
            margin-bottom: -14px;
            z-index: 2;
            font-weight: 400;
        }

        button {
            width: 100%;
        }
    }

    &__submit {
        background-color: #e1e2ec;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 40px;
        width: 100%;
        height: 100px;
        margin-top: 70px;
        z-index: 1;

        img {
            width: 60px;
            margin-right: 24px;
        }

        p {
            font-size: 36px;
            color: #000;
        }
    }
}
</style>
