<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { clearActiveRole, getAvailableRoles, getStoredAuthResponse, setActiveRole } from '../services/roleService';

const router = useRouter();
const authResponse = getStoredAuthResponse();
const roles = computed(() => getAvailableRoles(authResponse?.roles));

const selectRole = async (role) => {
    if (!setActiveRole(role.id)) return;
    await router.push({ name: role.routeName });
};

const firstName = computed(() => authResponse?.names?.trim().split(/\s+/)[0] || '');
clearActiveRole();
</script>

<template>
    <main class="flex min-h-screen items-center justify-center bg-[#f5f8f4] px-4 py-10 sm:px-8">
        <section class="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-xl shadow-green-950/10 sm:p-10">
            <RouterLink to="/" aria-label="Ir al inicio de Razonando" class="mb-8 inline-flex">
                <img
                    src="../assets/Logos/ImagotipoRazonandoOriginal.png"
                    alt="Razonando"
                    class="w-36 sm:w-44"
                >
            </RouterLink>

            <p class="text-sm font-bold uppercase tracking-[0.18em] text-primary">Tu espacio en Razonando</p>
            <h1 class="mt-2 text-3xl font-bold text-secondary sm:text-4xl">
                {{ firstName ? `¡Hola, ${firstName}!` : '¿Cómo quieres ingresar?' }}
            </h1>
            <p class="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">
                Elige el perfil con el que quieres continuar. Puedes cambiarlo más adelante.
            </p>

            <div v-if="roles.length" class="mt-8 grid gap-4 sm:grid-cols-2">
                <button
                    v-for="role in roles"
                    :key="role.id"
                    type="button"
                    class="group rounded-2xl border border-[#dce9d9] bg-[#fbfdfb] p-5 text-left transition hover:-translate-y-1 hover:border-primary hover:bg-[#f4faf2] hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    @click="selectRole(role)"
                >
                    <span class="flex items-center justify-between gap-4">
                        <span class="text-xl font-bold text-secondary">{{ role.label }}</span>
                        <span
                            aria-hidden="true"
                            class="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8f2e5] text-lg font-bold text-primary transition group-hover:bg-primary group-hover:text-white"
                        >
                            →
                        </span>
                    </span>
                    <span class="mt-2 block text-sm leading-relaxed text-slate-600">{{ role.description }}</span>
                </button>
            </div>

            <div
                v-else
                role="alert"
                class="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900"
            >
                Tu cuenta no tiene un rol reconocido para acceder a estas vistas. Contacta al administrador de la plataforma.
            </div>
        </section>
    </main>
</template>
