<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const items = ref([
    { id: 1, title: 'Juan Sebastián Osorio Restrepo', description: 'Estudiante de Derecho en la Universidad de Antioquia y actual presidente del PMJ. Apasionado por su pueblo y su gente', image: new URL('../../assets/Team/Juanse.png', import.meta.url).href, bgColor: 'bg-secondary', alt: 'Juanse' },
    { id: 2, title: 'Susana Marulanda', description: 'Estudiante de Medicina en la Universidad de Antioquia. Interesada en el bienestar emocional y la salud mental.', image: new URL('../../assets/Team/Susana.png', import.meta.url).href, bgColor: 'bg-tertiary', alt: 'Susana' },
]);

const currentIndex = ref(0);
let interval = null;

const nextSlide = () => {
    currentIndex.value = (currentIndex.value + 1) % items.value.length;
};

const prevSlide = () => {
    currentIndex.value = (currentIndex.value - 1 + items.value.length) % items.value.length;
};

const startAutoSlide = () => {
    interval = setInterval(nextSlide, 4000);
};

const stopAutoSlide = () => {
    if (interval) {
        clearInterval(interval);
        interval = null;
    }
};

onMounted(() => startAutoSlide());
onBeforeUnmount(() => stopAutoSlide());

</script>

<template>
    <div class="grid w-full max-w-none">
        <div v-for="(item, index) in items" :key="item.id"
            class="relative col-start-1 row-start-1 w-full lg:h-80 rounded-3xl p-4 md:p-6 flex flex-col md:flex-row items-stretch gap-4 shadow-2xl
                transition-all duration-300 ease-out cursor-pointer"
            :class="item.bgColor" @click="currentIndex = index" :style="{
                transform: `translateY(${(index - currentIndex) * -20}px) scale(${1 - Math.abs(index - currentIndex) * 0.04})`,
                zIndex: items.length - Math.abs(index - currentIndex),
                pointerEvents: index === currentIndex ? 'auto' : 'none'
            }">
            <div class="flex-1 flex flex-col justify-between">
                <div>
                    <p class="text-3xl text-white md:text-4xl font-black tracking-tight mb-3 wrap-break-words">
                        {{ item.title }}
                    </p>
                    <p class="text-lg md:text-xl font-medium opacity-90 leading-relaxed text-white">
                        {{ item.description }}
                    </p>
                </div>
                <button
                    class="mt-6 w-full bg-primary text-white hover:bg-white hover:text-primary transition font-bold 
                        py-2 px-6 rounded-xl flex items-center gap-2 text-lg shadow-md justify-center">
                    Más información <span>→</span>
                </button>
            </div>
            <div
                class="flex-1 w-full md:min-h-40 rounded-2xl overflow-hidden shadow-inner bg-black">
                <img :src="item.image" :alt="item.title" class="w-full h-full object-cover opacity-90">
            </div>
        </div>

    </div>

    <!-- Controles de navegación externos -->
    <div class="flex space-x-4 mt-10">
        <button @click="prevSlide"
            class="bg-primary hover:bg-tertiary text-white font-bold p-3 rounded-full transition shadow">
            ▲
        </button>
        <button @click="nextSlide"
            class="bg-primary hover:bg-tertiary text-white font-bold p-3 rounded-full transition shadow">
            ▼
        </button>
    </div>
</template>

<style scoped></style>
