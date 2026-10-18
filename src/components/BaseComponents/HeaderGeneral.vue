<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAvailableRoles, getStoredAuthResponse } from '../../services/roleService';
import { authService } from '../../services/authService';

const router = useRouter();
const menuIsOpen = ref(false);
const canSwitchRoles = getAvailableRoles(getStoredAuthResponse()?.roles).length > 1;

const toggleMenu = () => {
    menuIsOpen.value = !menuIsOpen.value;
};

const logout = async () => {
    authService.logout();
    menuIsOpen.value = false;
    await router.replace({ name: 'login' });
};

</script>

<template>
    <header class="sticky top-0 z-50 w-full shadow-xl">
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
            <div class="flex items-center gap-2 md:hidden">
                <RouterLink
                    v-if="canSwitchRoles"
                    :to="{ name: 'role-selection' }"
                    class="rounded-lg bg-secondary px-3 py-3 text-sm font-bold text-white transition-colors hover:bg-white hover:text-secondary"
                >
                    Cambiar rol
                </RouterLink>
                <button
                    type="button"
                    class="rounded-lg bg-white px-3 py-3 text-sm font-bold text-secondary transition-colors hover:bg-secondary hover:text-white"
                    @click="logout"
                >
                    Cerrar sesión
                </button>
                <button type="button" @click="toggleMenu" class="text-white" aria-label="Abrir menú">
                    <Transition mode="out-in" enter-active-class="transition ease-out duration-150"
                        enter-from-class="opacity-0 scale-75 rotate-45" enter-to-class="opacity-100 scale-100 rotate-0"
                        leave-active-class="transition ease-in duration-100"
                        leave-from-class="opacity-100 scale-100 rotate-0"
                        leave-to-class="opacity-0 scale-75 -rotate-45">
                        <span v-if="!menuIsOpen" key="menu-icon">
                            <icon-bi-list width="30" height="30" />
                        </span>
                        <span v-else key="close-icon">
                            <icon-bi-x width="30" height="30" />
                        </span>
                    </Transition>
                </button>
            </div>
            <div class="hidden items-center gap-2 md:flex">
                <RouterLink
                    v-if="canSwitchRoles"
                    :to="{ name: 'role-selection' }"
                    class="rounded-lg border border-primary px-4 py-2 font-bold text-primary transition hover:bg-primary hover:text-white"
                >
                    Cambiar de rol
                </RouterLink>
                <button
                    type="button"
                    class="rounded-lg bg-secondary px-4 py-2 font-bold text-white transition hover:bg-primary"
                    @click="logout"
                >
                    Cerrar sesión
                </button>
            </div>
        </div>
    </header>
</template>

<style scoped></style>