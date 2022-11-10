<template>
    <form @prevent.submit="onSubmit" class="form">
        <div class="wrapper">
            <label class="wrapper__label" for="value">Valor em reais</label>
            <input type="number" id="value" class="wrapper__input">
        </div>
        <div class="wrapper">
            <label class="wrapper__label" for="value">Chave PIX</label>
            <input type="text" id="value" class="wrapper__input">
        </div>
        <button class="form__submit" type="submit">
            <img src="/money-up.svg" alt="Deposit icon">
            <p>Sacar</p>
        </button>
    </form>
</template>

<script setup lang="ts">
const onSubmit = () => {
    return true
}
</script>

<style lang="scss">
.form {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 120px;

    .wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        &__input {
            background-color: #EEECEC;
            border-radius: 40px;
            border: none;
            padding: 14px 20px;
            font-size: 36px;
            margin-bottom: 40px;
        }

        label {
            font-size: 28px;
            color: #000000;
            padding-left: 28px;
            margin-bottom: -14px;
            z-index: 1;
            font-weight: 200;
        }
    }

    &__submit {
        background-color: #EEECEC;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 40px;
        width: 100%;
        height: 100px;
        margin-top: 70px;

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
</style>
