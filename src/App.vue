<template>
  <div>
    <TheHeader :isLoggedIn="false" />
    <RouterView></RouterView>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { listenBalance, connectWallet } from './utils/utils';
import TheHeader from './components/TheHeader.vue';

onMounted(() => {
  connectWallet()
  listenBalance()
})
</script>

<style lang="scss">

</style>
