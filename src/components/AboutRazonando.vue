<script setup>
import { ref } from 'vue';
import FadeIn from './UtilsComponents/FadeIn.vue'
import Carrusel from './PagesComponents/Carrusel.vue'
</script>

<template>
    <!--Boton Flotante WSS-->
    <a href="/" target="_blank" rel="noopener noreferrer" aria-label="Chat via WhatsApp"
        class="fixed bottom-4 right-4 z-50 bg-primary transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-secondary text-white text-sm p-3 sm:p-4 rounded-2xl shadow-xl text-center flex flex-col items-center justify-center gap-1">
        <span class="font-bold text-lg">¿Preguntas?</span>
        <span class="text-sm">Charla con nosotros</span>
        <icon-bi-whatsapp width="24" height="24" class="mt-1"></icon-bi-whatsapp>
    </a>
    <!-- Sección de bienvenida -->
    <section id="sobre-razonando"
        class="flex flex-col py-8 pb-16 px-2 md:flex-row items-center justify-center bg-tertiary">
        <img src="../assets/Logos/IsotipoRazonandoOriginal.png" alt="LogoIsotipo" class="w-52 xl:w-64">
        <div class="flex flex-col justify-center p-4 md:p-8">
            <h1 class="text-white text-center md:text-left text-2xl xl:text-2xl font-bold">
                Educación sin barreras <br> para los jóvenes del mañana.
            </h1>
        </div>
    </section>
    <div class="relative z-20 mx-auto -my-8 md:-my-10
            flex w-fit max-w-[95%] lg:max-w-none
            flex-col lg:flex-row items-center justify-center gap-2
            px-6 py-4 md:px-8 md:py-5
            rounded-2xl bg-white/95 shadow-xl ring-1 ring-black/5">
        <p class="text-secondary text-center text-[32px] xl:text-[44px] font-bold">
            ¡Bienvenido a&nbsp;
        </p>
        <div class="flex flex-row items-center mb-5 md:mb-auto justify-center">
            <img src="../assets/Logos/TituloRazonandoOriginal1.png" alt="LogoTitulo" class="h-13 xl:h-14 w-auto">
            <p class="text-secondary text-center text-[32px] xl:text-[44px] font-bold">!</p>
        </div>
    </div>
    <!-- Sección de información -->
        <section class="flex flex-col pt-16 py-4 px-4 md:px-10 lg:px-16 gap-8 items-center justify-center bg-white">
        <FadeIn>
                <p class="max-w-6xl text-primary text-lg xl:text-xl text-center font-bold">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eget semper justo.
                Praesent nec lacus ac magna consectetur commodo sit amet eu purus. Donec mollis auctor lorem,
                quis porttitor odio semper id. Phasellus rutrum sit amet est in lobortis. Ut nec nulla urna.
                Proin eleifend mattis ullamcorper. Aenean pulvinar nec massa eget consectetur. Aliquam vitae arcu
                auctor,
                lacinia ipsum vel, pulvinar magna. Donec a purus euismod, rhoncus enim feugiat, cursus lorem.
                Quisque hendrerit arcu et venenatis imperdiet. Integer in aliquam mauris. Suspendisse potenti.
                Cras nec est non turpis tempor tristique. Donec mollis scelerisque nulla, in egestas turpis eleifend
                eget.
                Cras fermentum ligula vitae elementum rhoncus.
            </p>
        </FadeIn>
        <FadeIn>
                <p class="max-w-6xl text-primary text-lg xl:text-xl text-center font-bold">
                Donec turpis purus, faucibus accumsan tortor id, ultrices volutpat elit. Praesent rhoncus,
                nulla ac convallis facilisis, tellus mauris faucibus erat, a pulvinar orci neque ut diam. Ut dictum elit
                tortor,
                eu eleifend lectus vestibulum a. Phasellus vulputate consectetur felis, eget mollis massa rhoncus at.
                Fusce condimentum nulla non mi varius, a ultrices justo bibendum. Ut elementum urna id erat consequat
                lobortis.
                Fusce quis ipsum elementum, aliquam tortor non, commodo diam. In posuere sem posuere justo condimentum
                ultrices id
                vitae mauris. Maecenas orci nisi, posuere eget erat luctus, varius rhoncus sem. Proin facilisis ornare
                dui,
                quis rhoncus justo ullamcorper non. Donec imperdiet mi sit amet justo dictum pulvinar. Integer elementum
                elit
                non nulla dictum condimentum. Nulla hendrerit tempor velit ornare tincidunt.
            </p>
        </FadeIn>
        <FadeIn>
                <p class="max-w-6xl text-primary text-lg xl:text-xl text-center font-bold">
                Mauris tincidunt, mi nec consequat consectetur, nisl est interdum turpis, sit amet venenatis leo ligula
                non tellus.
                In vulputate quis turpis sed vestibulum. Mauris sagittis arcu nulla, in dapibus leo vestibulum vitae.
                Integer at ornare odio. Sed maximus maximus magna, non pulvinar enim laoreet vel. Vivamus dignissim nunc
                id arcu dignissim, ut pellentesque lectus ullamcorper. Nunc ut rhoncus nulla, scelerisque tincidunt
                ante.
                Mauris interdum, odio ac cursus bibendum, quam odio blandit justo, non porttitor metus ligula imperdiet
                lacus.
                Nullam consectetur ut urna eget egestas. Praesent faucibus ultricies dolor, eu sagittis odio ultricies
                id.
                Proin molestie ac lectus nec tristique. Phasellus vulputate a sapien ut tempor. Nam tortor tellus,
                gravida
                vitae fringilla sit amet, malesuada ac nulla. Morbi at facilisis nisl. Duis est dui, imperdiet a
                malesuada eget,
                pharetra vel augue. Praesent finibus eu magna at convallis.
            </p>
        </FadeIn>
        <FadeIn>
            <a target="_blank" rel="noopener noreferrer">
                <button
                    class="bg-primary text-white  flex items-center justify-center gap-2 rounded-lg py-4 px-4 
                        md:px-6 text-lg xl:text-[22px] font-bold leading-5.5 cursor-pointer w-full hover:bg-secondary transition-colors">
                    ¿Quieres saber más? Da click aquí
                </button>
            </a>
        </FadeIn>
    </section>
    <!-- Sección de cursos -->
    <section id="nuestros-cursos" class="flex flex-col py-8 pb-8 px-2 mt-10 items-center justify-center bg-tertiary">
        <FadeIn>
            <div class="mx-auto
            flex w-fit
            flex-col lg:flex-row items-center justify-center
            px-6 rounded-2xl bg-secondary shadow-xl ring-1 ring-black/5">
                <h1 class="text-white text-center text-4xl font-bold">
                    Nuestros cursos
                </h1>
            </div>
        </FadeIn>
        <FadeIn>
            <div class="flex flex-col md:flex-row justify-around gap-6 p-3 md:p-5">
                <div class="flex flex-col justify-center items-center bg-primary px-4 py-3 md:px-6 md:py-4 max-w-lg w-full
                    gap-4 rounded-2xl shadow-xl ring-1 ring-black/5">
                    <h2 class="text-white text-center font-bold">Preuniversitario</h2>
                    <img src="../assets/PreUSimb.png" alt="PreU" class="rounded-lg w-40 xl:w-56">
                    <p class="text-white text-center font-bold text-base xl:text-lg">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eget semper justo.
                        Praesent nec lacus ac magna consectetur commodo sit amet eu purus. Donec mollis auctor lorem,
                        quis porttitor odio semper id. Phasellus rutrum sit amet est in lobortis. Ut nec nulla urna.
                    </p>
                    <a target="_blank" rel="noopener noreferrer">
                        <button
                            class="bg-secondary text-white flex items-center justify-center gap-2 rounded-lg py-3 px-4
                        md:px-5 text-base xl:text-lg font-bold leading-5.5 cursor-pointer w-full hover:bg-tertiary transition-colors">
                            ¿Quieres saber más? Da click aquí
                        </button>
                    </a>
                </div>
                <div class="flex flex-col justify-center items-center bg-primary px-4 py-3 md:px-6 md:py-4 max-w-lg w-full
                    gap-4 rounded-2xl shadow-xl ring-1 ring-black/5">
                    <h2 class="text-white text-center md:text-left font-bold">Pre-Icfes (¡Proximamente!)</h2>
                    <img src="../assets/PreIcfesSimb.png" alt="PreU" class="rounded-lg w-56 xl:w-72">
                    <p class="text-white text-center font-bold text-base xl:text-lg">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eget semper justo.
                        Praesent nec lacus ac magna consectetur commodo sit amet eu purus. Donec mollis auctor lorem,
                        quis porttitor odio semper id. Phasellus rutrum sit amet est in lobortis. Ut nec nulla urna.
                    </p>
                    <a target="_blank" rel="noopener noreferrer">
                        <button
                            class="bg-secondary text-white flex items-center justify-center gap-2 rounded-lg py-3 px-4
                        md:px-5 text-base xl:text-lg font-bold leading-5.5 cursor-pointer w-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled>
                            ¡Proximamente!
                        </button>
                    </a>
                </div>
            </div>
        </FadeIn>
    </section>
    <!-- Sección de equipo -->
    <section id="sobre-nosotros" class="flex flex-col py-8 pb-16 px-4 md:px-10 lg:px-16 items-center justify-center bg-white">
        <FadeIn>
            <div class="mx-auto
            flex w-fit
            flex-col lg:flex-row items-center justify-center
            px-6 rounded-2xl bg-primary shadow-xl ring-1 ring-black/5">
                <h1 class="text-white text-center font-bold">
                    Sobre nosotros
                </h1>
            </div>
        </FadeIn>
        <FadeIn class="w-full">
            <div class="flex flex-col w-full mt-15 md:px-10 items-center justify-center select-none">
                <Carrusel />
            </div>
        </FadeIn>
    </section>
</template>

<style scoped></style>
