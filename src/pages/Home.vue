<template>
    <div class="home">
        <ul class="cardsList">
            <TheCard v-for="({ title, subtitle, svgPath, redirectUrl }, i) in cardsList" :key="i" :title="title"
                :subtitle="subtitle" :svgPath="svgPath" :redirectUrl="redirectUrl" />
        </ul>
        <p v-if="showMessage" class="message">{{message}}</p>
    </div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import TheCard from '../components/TheCard.vue';

export default {
    components: { TheCard },
    setup() {
        const message = ref<string | any>('')
        const showMessage = ref(false)

        const cardsList = [
            {
                title: 'On-ramp',
                subtitle: 'Get tokens in desired chain',
                svgPath: '/money-down.svg',
                redirectUrl: '/on-ramp'
            },
            {
                title: 'Bridge',
                subtitle: 'Move your tokens between chains',
                svgPath: '/bridge.svg',
                redirectUrl: '/bridge'
            }
        ]

        onMounted(() => {
            const route = useRoute();

            if (route.query.message) {
                message.value = route.query.message ? route.query.message : '';
                showMessage.value = true

                setTimeout(() => {
                    showMessage.value = false
                }, 4000)
            }
        })

        return {
            message,
            showMessage,
            cardsList,
        }
    },
}
</script>

<style lang="scss">
.home {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 120px;
    position: relative;

    .cardsList {
        list-style: none;
        display: flex;
        flex-wrap: wrap;
    }

    .message {
        position: absolute;
        left: 50%;
        bottom: -50px;
        transform: translateX(-50%);
        width: 250px;
        background-color: rgb(143, 203, 143);
        border: 2px solid green;
        border-radius: 8px;
        padding: 12px 20px;
        color: #000;

        @media screen and (min-width: 768px) {
            width: 400px;
        }
    }
}
</style>
