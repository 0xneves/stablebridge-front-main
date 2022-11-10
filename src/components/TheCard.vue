<template>
  <li class="card">
    <a :href="redirectUrl">
      <img :src="svgPath" :alt="`${title} icon`">
      <h1 class="card__title">{{title}}</h1>
      <h1 class="card__subtitle">{{subtitle}}</h1>
    </a>
  </li>
</template>

<script setup lang="ts">
interface CardProps {
  title: string;
  subtitle: string;
  svgPath: string;
  redirectUrl: string;
}

defineProps<CardProps>()
</script>

<style lang="scss" scoped>
.card {
  border-radius: 40px;
  background-color: #6671d5d4;
  font-family: 'Kanit', sans-serif;
  color: #fff;
  font-weight: 500;
  width: 300px;
  margin: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all .4s;

  &:hover {
    transition: all .2s;
    transform: scale3d(1.05, 1.05, 1.05);
  }

  a {
    color: #000000;
    padding: 60px 24px;
  }

  img {
    width: 120px;
    margin: 0 auto;
  }

  &__title {
    font-size: 40px;
    font-weight: 600;
    margin: 30px 0 50px;
  }

  &__subtitle {
    font-size: 24px;
    font-weight: 300;
  }
}
</style>
