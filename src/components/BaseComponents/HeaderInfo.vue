<script setup>

import { ref } from 'vue';

const menuIsOpen = ref(false);

const toggleMenu = () => {
    menuIsOpen.value = !menuIsOpen.value;
};

const scrollTo = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        menuIsOpen.value = false;
    }
};

</script>

<template>
    <header class="sticky top-0 z-50 w-full shadow-xl">
        <!-- Redes sociales y slogan -->
        <div class="hidden md:flex items-center w-full justify-between py-2 px-6 xl:px-20 bg-primary">
            <p class="text-white text-2xl font-bold">#RazonandoAndo</p>
            <ul class="flex items-center gap-9">
                <li>
                    <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" class="text-white">
                        <icon-bi-youtube width="24" height="24"></icon-bi-youtube>
                    </a>
                </li>
                <li>
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" class="text-white">
                        <icon-bi-instagram width="24" height="24" />
                    </a>
                </li>
                <li>
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" class="text-white">
                        <icon-bi-facebook width="24" height="24" />
                    </a>
                </li>
                <li>
                    <a href="https://www.whatsapp.com" target="_blank" rel="noopener noreferrer" class="text-white">
                        <icon-bi-whatsapp width="24" height="24" />
                    </a>
                </li>
            </ul>
        </div>
        <!-- Logo y navegación -->
        <div class="py-2 px-6 xl:px-20 flex items-center w-full justify-between bg-primary md:bg-white">
            <picture>
                <!-- Logo celulares -->
                <source media="(max-width: 767px)" srcset="../../assets/Logos/TituloRazonandoOriginal1.png">

                <!-- Logo tablet y PC -->
                <img src="../../assets/Logos/ImagotipoRazonandoOriginal.png" alt="Logo Razonando"
                    class="w-32 md:w-44 xl:w-50">
            </picture>
            <!-- Responsive -->
            <div class="md:hidden flex items-center gap-4">
                <RouterLink to="/login" class="bg-secondary text-white flex items-center justify-center gap-2 rounded-lg py-4 px-4
                            md:px-6 text-base md:text-lg xl:text-[22px] font-bold leading-5.5 cursor-pointer w-full hover:bg-white 
                            hover:text-secondary transition-colors">
                    Inicia sesión
                </RouterLink>
                <div @click="toggleMenu" class="text-white" style="opacity:1;transform:none">
                    <Transition mode="out-in" enter-active-class="transition ease-out duration-150"
                        enter-from-class="opacity-0 scale-75 rotate-45" enter-to-class="opacity-100 scale-100 rotate-0"
                        leave-active-class="transition ease-in duration-100"
                        leave-from-class="opacity-100 scale-100 rotate-0"
                        leave-to-class="opacity-0 scale-75 -rotate-45">
                        <a v-if="!menuIsOpen" key="menu-icon" class="cursor-pointer lg:hidden">
                            <icon-bi-list width="30" height="30" />
                        </a>
                        <a v-else="menuIsOpen" key="close-icon" class="cursor-pointer lg:hidden">
                            <icon-bi-x width="30" height="30" />
                        </a>
                    </Transition>
                </div>
            </div>
            <!-- Nav Base -->
            <nav class="hidden md:flex items-center gap-2">
                <div class="relative">
                    <div class="relative">
                        <div class="flex items-center gap-2">
                            <a href="#" @click.prevent="scrollTo('sobre-razonando')" class="flex items-center gap-2 py-2 px-1 font-bold text-secondary 
                                    text-base xl:text-lg hover:text-primary transition-colors duration-300">
                                Sobre Razonando
                            </a>
                        </div>
                    </div>
                </div>
                <div class="relative">
                    <div class="relative">
                        <div class="flex items-center gap-2">
                            <a href="#" @click.prevent="scrollTo('nuestros-cursos')" class="flex items-center gap-2 py-2 px-1 font-bold text-secondary 
                                    text-base xl:text-lg hover:text-primary transition-colors duration-300">
                                Nuestros cursos
                            </a>
                        </div>
                    </div>
                </div>
                <div class="relative">
                    <div class="relative">
                        <div class="flex items-center gap-2">
                            <a href="#" @click.prevent="scrollTo('sobre-nosotros')" class="flex items-center gap-2 py-2 px-1 font-bold text-secondary 
                                    text-base xl:text-lg hover:text-primary transition-colors duration-300">
                                Sobre nosotros
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
            <div class="hidden md:flex items-center gap-2">
                <RouterLink to="/login" class="bg-white text-primary flex items-center gap-2 justify-center  
                            rounded-lg py-4 px-4 md:px-6 text-lg xl:text-[20px] font-bold leading-5.5 cursor-pointer w-full
                            whitespace-nowrap hover:bg-secondary hover:text-white transition-colors">
                    Inicia sesión
                </RouterLink>
                <RouterLink to="/registro" class="bg-primary text-white flex items-center justify-center gap-2
                            rounded-lg py-4 px-4 md:px-6 text-lg xl:text-[20px] font-bold leading-5.5 cursor-pointer w-full
                            hover:bg-secondary transition-colors">
                    ¡Regístrate!
                </RouterLink>
            </div>
        </div>
        <Transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-1">
            <div v-if="menuIsOpen" class="md:hidden absolute transition left-0 z-50 flex flex-col justify-center gap-4 w-full px-6 overflow-visible 
                    bg-white shadow-xl py-4">
                <nav class="md:flex items-center gap-2">
                    <div class="relative">
                        <div class="flex items-center gap-2">
                            <a href="#" @click.prevent="scrollTo('sobre-razonando')" class="flex items-center gap-2 py-2 px-1 font-bold text-primary text-base xl:text-lg 
                                        hover:text-secondary transition-colors duration-300">
                                Sobre Razonando
                            </a>
                        </div>
                    </div>
                    <div class="relative">
                        <div class="flex items-center gap-2">
                            <a href="#" @click.prevent="scrollTo('nuestros-cursos')" class="flex items-center gap-2 py-2 px-1 font-bold text-primary text-base xl:text-lg 
                                        hover:text-secondary transition-colors duration-300">
                                Nuestros cursos
                            </a>
                        </div>
                    </div>
                    <div class="relative">
                        <div class="flex items-center gap-2">
                            <a href="#" @click.prevent="scrollTo('sobre-nosotros')" class="flex items-center gap-2 py-2 px-1 font-bold text-primary text-base xl:text-lg 
                                        hover:text-secondary transition-colors duration-300">
                                Sobre nosotros
                            </a>
                        </div>
                    </div>
                    <br>
                    <div class="flex items-center justify-center gap-2 mb-2">
                        <RouterLink class="text-secondary text-lg font-bold" to="/registro">
                            ¿No tienes una cuenta?
                        </RouterLink>
                    </div>
                    <RouterLink to="/registro" class="bg-primary text-white flex items-center justify-center gap-2
                            rounded-lg py-4 px-4 md:px-6 text-lg xl:text-[22px] font-bold leading-5.5 cursor-pointer w-full
                            hover:bg-secondary transition-colors">
                        ¡Regístrate!
                    </RouterLink>
                </nav>
            </div>
        </Transition>
    </header>



</template>

<style scoped></style>