<script setup>

const scrollTo = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

</script>

<template>
    <footer>
        <div
            class="flex flex-col gap-8 lg:gap-16 lg:flex-row items-center justify-between p-8 lg:py-5 lg:px-20 bg-primary">
            <img src="../../assets/Logos/LogoRazonandoOriginal.png" alt="LogoRazonandoOg" class="w-32 xl:w-35">
            <div
                class="flex flex-col justify-center md:flex-row md:justify-between py-2 px-6 xl:px-20 gap-16 w-full max-w-300 bg-primary">
                <ul>
                    <p class="text-secondary text-2xl font-bold">
                        Redes Sociales
                    </p>
                    <li>
                        <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer"
                            class="font-bold text-white text-xl xl:text-lg hover:underline">
                            Youtube
                        </a>
                    </li>
                    <li>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"
                            class="font-bold text-white text-xl xl:text-lg hover:underline">
                            Instagram
                        </a>
                    </li>
                    <li>
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"
                            class="font-bold text-white text-xl xl:text-lg hover:underline">
                            Facebook
                        </a>
                    </li>
                    <li>
                        <a href="https://www.whatsapp.com" target="_blank" rel="noopener noreferrer"
                            class="font-bold text-white text-xl xl:text-lg hover:underline">
                            Whatsapp
                        </a>
                    </li>
                </ul>
                <ul>
                    <p class="text-secondary text-2xl font-bold">
                        Información
                    </p>
                    <li>
                        <a href="#" @click.prevent="scrollTo('sobre-razonando')"
                            class="font-bold text-white text-xl xl:text-lg hover:underline">
                            Sobre Razonando
                        </a>
                    </li>
                    <li>
                        <a href="#" @click.prevent="scrollTo('nuestros-cursos')"
                            class="font-bold text-white text-xl xl:text-lg hover:underline">
                            Nuestros cursos
                        </a>
                    </li>
                    <li>
                        <a href="#" @click.prevent="scrollTo('sobre-nosotros')"
                            class="font-bold text-white text-xl xl:text-lg hover:underline">
                            Sobre nosotros
                        </a>
                    </li>
                </ul>
                <div class="flex flex-col lg:items-center justify-between gap-2">
                    <p class="text-secondary text-2xl font-bold text-center">
                        Si te has motivado,
                    </p>
                    <p class="text-secondary text-2xl font-bold text-center">
                        ¿Qué esperas?
                    </p>
                    <RouterLink to="/login" class="flex bg-white text-secondary items-center justify-center gap-2
                            rounded-lg py-4 px-4 md:px-6 text-lg xl:text-[22px] font-bold leading-5.5 cursor-pointer w-full  hover:bg-secondary hover:text-white transition-colors">
                        ¡Accede a nuestro Pre-U!
                    </RouterLink>
                </div>
            </div>
        </div>
        <div class="text-center w-full py-2 px-6 xl:px-20 bg-secondary">
            <p class="text-white text-2xl">© 2026 Razonando, all rigths reserverd - Powered by EquipoJ</p>
        </div>
    </footer>

</template>

<style scoped></style>