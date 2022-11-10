<template>
    <div :class="['select', { secondary: secondaryColor }]">
        <button @click="onDropdownClick" :class="['trigger', { open: isDropdownOpen }]">
            <img :src="selectedNetwork.logo" :alt="`${selectedNetwork.prettyName} logo`">
            <p>{{selectedNetwork.prettyName}}</p>
            <img class="chevron" :src="secondaryColor ? '/chevron-purple.svg' : '/chevron.svg'" alt="Chevron logo">
        </button>
        <ul v-if="isDropdownOpen" class="dropdown">
            <li v-for="(net, i) in options">
                <button v-show="net.prettyName != selectedNetwork.prettyName" @click="updateSelectedNetwork(net)">
                    <img :src="net.logo" :alt="`${net.prettyName} logo`">
                    <p>{{net.prettyName}}</p>
                </button>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { changeNetwork } from '../utils/utils';
import store from '../store'

interface NetworkProps {
    prettyName: string;
    chainId: number;
    logo: string;
}

export default defineComponent({
    name: 'TheDropdown',
    props: {
        options: { type: Array<NetworkProps>, required: true },
        changeOnSelect: { type: Boolean, required: false, default: true },
        secondaryColor: { type: Boolean, required: false, default: false }
    },
    emits: ['selectChange'],
    setup(props, { emit }) {
        let isDropdownOpen = ref(false);
        let selectedNetwork = ref({
            prettyName: '',
            chainId: 0,
            logo: ''
        });

        for (let i = 0; i < props.options.length; i++) {
            if (props.options[i].prettyName === store.getters.getCurrentNetwork) {
                selectedNetwork.value = props.options[i]
            }
        }

        if (!Boolean(selectedNetwork.value.prettyName)) {
            selectedNetwork.value = props.options[0]
        }

        const onDropdownClick = () => {
            isDropdownOpen.value = !isDropdownOpen.value
        }

        const updateSelectedNetwork = (net: NetworkProps) => {
            selectedNetwork.value = net;
            onDropdownClick();

            if (!props.changeOnSelect) {
                emit('selectChange', selectedNetwork.value.chainId)
            } else {
                changeNetwork(net)
            }
        }

        return {
            store,
            isDropdownOpen,
            selectedNetwork,
            onDropdownClick,
            updateSelectedNetwork,
        }
    }
})
</script>

<style lang="scss" scoped>
.select {
    margin-right: 40px;
    font-weight: 200;
    z-index: 1;
    position: relative;

    &.secondary {

        button,
        .dropdown {
            background-color: #fff;
            min-width: 320px;
            color: #323c95;
            z-index: 10;
        }

        .dropdown {
            z-index: 1;
        }

        .trigger {
            padding-top: 50px;
            display: flex;

            .chevron {
                margin-left: auto;
            }
        }
    }

    .trigger {
        position: relative;
        z-index: 2;

        &.open .chevron {
            /* transition: all .4s; */
            transform: rotateZ(-180deg) translateY(-10px);
        }
    }

    button {
        display: flex;
        align-items: center;
        font-size: 22px;
        border-radius: 40px;
        background-color: #323c95;
        color: #FFF;
        padding: 0px 28px;
        min-width: 230px;

        img {
            margin-right: 14px;
            width: 30px;
        }

        .chevron {
            /* transition: all .4s; */
            margin: -12px -8px 0 18px;
        }
    }

    .dropdown {
        position: absolute;
        background-color: #323c95;
        border-radius: 0 0 40px 40px;
        list-style: none;
        padding: 30px 0 0;
        margin: -32px 0 0;
        min-width: 230px;
        z-index: 1;
        width: 100%;
    }
}
</style>