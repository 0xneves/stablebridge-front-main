<template>
    <header>
        <button v-if="!isInHome" @click="goToPreviousPage" class="header__back">
            <img src="/back.svg" alt="Back icon" />
        </button>
        <button v-if="!store.getters.getAccountAddress" @click="connectWallet" class="header__connect">
            <img src="/wallet.svg" alt="Wallet icon">
            <p>Conectar carteira</p>
        </button>
        <div v-else class="authenticated">
            <TheDropdown :options="networks"></TheDropdown>

            <div class="authenticated__info">
                <div class="authenticated__info-below">
                    <p>{{store.getters.getAccountBalance}} SBRL</p>
                </div>
                <div class="authenticated__info-above">
                    <p>{{store.getters.getAccountAddressFormatted}}</p>
                </div>
            </div>
        </div>
    </header>
</template>

<script lang="ts">
import store from '../store'
import { defineComponent, defineProps, onMounted, ref } from 'vue';
import { networks } from '../constants/constants';
import { connectWallet } from '../utils/utils'
import TheDropdown from './TheDropdown.vue';

interface HeaderProps {
    isLoggedIn: boolean;
}

interface NetworkProps {
    prettyName: string;
    chainId: number;
    logo: string;
}

defineProps<HeaderProps>()

export default defineComponent({
    name: "TheHeader",
    components: { TheDropdown },
    setup() {
        let isInHome = ref(false);
        let isDropdownOpen = ref(false);
        let selectedNetwork = ref(networks[0]);
        let showAddTokenCta = ref(false);

        const checkIsHomepage = () => {
            if (window.location.pathname == "/") {
                isInHome.value = true;
            }
        }
        const goToPreviousPage = () => {
            const lastPage = document.referrer === window.location.href ? '/' : document.referrer
            window.location.href = lastPage;
        };
        const onDropdownClick = () => {
            isDropdownOpen.value = !isDropdownOpen.value;
        };
        const updateSelectedNetwork = (net: NetworkProps) => {
            selectedNetwork.value = net;
        };
        const checkIfTokenWasAdded = async () => {
            if (!window.sessionStorage.getItem('tokenSet')) {
                const wasAdded = await window.ethereum.request({
                    method: "wallet_watchAsset",
                    params: {
                        type: "ERC20",
                        options: {
                            address: store.getters.getContractAddress,
                            symbol: 'SBRL',
                            decimals: 6,
                            image: "",
                        },
                    },
                }).catch(() => {
                    showAddTokenCta.value = false;
                });
                showAddTokenCta.value = !wasAdded;
            }
            if (!showAddTokenCta.value) {
                window.sessionStorage.setItem('tokenSet', 'true')
            }
        }

        onMounted(() => {
            checkIsHomepage()
            checkIfTokenWasAdded()
        });

        return {
            store,
            networks,
            isInHome,
            isDropdownOpen,
            selectedNetwork,
            showAddTokenCta,
            connectWallet,
            onDropdownClick,
            goToPreviousPage,
            updateSelectedNetwork,
            checkIfTokenWasAdded
        };
    },
})
</script>

<style lang="scss" scoped>
header {
    width: 100%;
    max-width: 100vw;
    background-color: rgba(255, 255, 255, .15);
    backdrop-filter: blur(5px);
    padding: 28px 68px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    min-height: 80px;
    z-index: 2;

    .importToken {
        margin-right: auto;
        font-size: 18px;
        background-color: #323c95;
        color: #fff;
    }

    .header__back {
        width: 120px;
        margin-right: auto;
        background-color: transparent;

        img {
            width: 100%;
        }
    }

    .header__connect {
        display: flex;
        align-items: center;
        color: #000000;
        font-size: 22px;
        border-radius: 40px;
        background-color: #EEECEC;
        padding: 0 24px;
        margin-right: 136px;

        p {
            padding: 0 0 0 14px;
        }
    }

    .authenticated {
        margin-right: 136px;
        display: flex;
        align-items: center;

        &__info {
            display: flex;

            &-below {
                background-color: #747fe8;
                border-radius: 40px;
                color: #fff;
                font-weight: 200;
                font-size: 24px;
                padding: 0px 100px 0 32px;
                border: 4px solid #4b5ae0;
            }

            &-above {
                background-color: #4b5ae0;
                border: 4px solid #4b5ae0;
                border-radius: 40px;
                color: #fff;
                font-weight: 200;
                font-size: 24px;
                padding: 0px 32px;
                margin-left: -80px;
            }
        }
    }
}
</style>