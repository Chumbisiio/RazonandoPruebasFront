<script setup>
import { useRoute, RouterView } from 'vue-router';
import HeaderInfo from './components/BaseComponents/HeaderInfo.vue';
import HeaderGeneral from './components/BaseComponents/HeaderGeneral.vue';
import FooterInfo from './components/BaseComponents/FooterInfo.vue';

const route = useRoute();
</script>

<template>
    <template v-if="route.meta.layout === 'home'">
        <HeaderInfo />
        <RouterView />
        <FooterInfo />
    </template>
    <template v-else-if="route.meta.layout === 'main'">
        <HeaderGeneral />
        <RouterView />
    </template>
    <RouterView v-else />
</template>
