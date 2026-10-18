<script setup>

import { ref } from 'vue';
import {useIntersectionObserver} from '@vueuse/core'

const target = ref(null);
const isVisible = ref(false);

const { stop } = useIntersectionObserver(
    target,
    ([entry]) => {
        if (entry.isIntersecting) {
            isVisible.value = true;
            stop();
        }
    }
);
</script>

<template>
    <div ref="target" :class="['transition-all duration-500 ease-out', isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']">
        <slot />
    </div>
</template>

<style scoped>
</style>