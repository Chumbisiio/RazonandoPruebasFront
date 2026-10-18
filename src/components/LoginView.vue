<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/authService';
import { clearActiveRole, getAvailableRoles, setActiveRole } from '../services/roleService';
import { getApiErrorFieldLabel } from '../services/apiErrorService';

const router = useRouter();
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);
const message = ref('');
const fieldErrors = ref({});
const isError = ref(false);
const isSubmitting = ref(false);

const submitLogin = async () => {
    message.value = '';
    fieldErrors.value = {};
    isError.value = false;
    isSubmitting.value = true;

    try {
        const loginResponse = await authService.login({
            email: email.value.trim(),
            password: password.value,
        });
        const roles = getAvailableRoles(loginResponse.roles);

        if (roles.length === 1) {
            setActiveRole(roles[0].id);
            await router.push({ name: roles[0].routeName });
        } else if (roles.length > 1) {
            clearActiveRole();
            await router.push({ name: 'role-selection' });
        } else {
            authService.logout();
            isError.value = true;
            message.value = 'El inicio de sesión fue correcto, pero tu cuenta no tiene un rol reconocido para acceder.';
        }
    } catch (error) {
        const responseData = error.response?.data;
        isError.value = true;
        message.value = responseData?.message
            || (error.response
                ? 'No se pudo iniciar sesión.'
                : 'No fue posible conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.');
        fieldErrors.value = responseData?.errors && typeof responseData.errors === 'object'
            ? responseData.errors
            : {};
    } finally {
        isSubmitting.value = false;
    }
};

const showPasswordHelp = () => {
    message.value = 'Para recuperar tu acceso, comunícate con el equipo de Razonando.';
    fieldErrors.value = {};
    isError.value = false;
};
</script>

<template>
    <main class="login-page min-h-screen bg-[#f5f8f4] px-4 py-6 sm:px-8 sm:py-10">
        <div class="mx-auto flex w-full max-w-6xl flex-col gap-6">
            <header class="flex items-center justify-between">
                <RouterLink to="/" aria-label="Ir al inicio de Razonando" class="inline-flex items-center">
                    <img
                        src="../assets/Logos/ImagotipoRazonandoOriginal.png"
                        alt="Razonando"
                        class="w-36 sm:w-44"
                    >
                </RouterLink>
                <RouterLink
                    to="/"
                    class="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-secondary transition hover:bg-white sm:px-4"
                >
                    <span aria-hidden="true">←</span>
                    <span>Volver al inicio</span>
                </RouterLink>
            </header>

            <section
                class="login-panel grid overflow-hidden rounded-3xl bg-white shadow-[0_24px_80px_-32px_rgba(23,95,44,0.28)] md:min-h-155 md:grid-cols-[1.02fr_0.98fr]"
                aria-labelledby="login-title"
            >
                <div class="login-visual relative flex min-h-60 flex-col justify-between overflow-hidden px-7 py-8 text-white sm:px-10 sm:py-10 md:px-12 md:py-12">
                    <img
                        src="../assets/Logos/IsotipoRazonandoNegativoInvertido.png"
                        alt=""
                        aria-hidden="true"
                        class="login-watermark"
                    >
                    

                    <div class="relative z-10 flex items-center gap-3">
                        <span class="text-xl font-bold tracking-wide">¡HOLA :D!</span>
                    </div>

                    <div class="relative z-10 max-w-md py-8 md:py-12">
                        <p class="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-white/75">
                            Tu siguiente paso empieza aquí
                        </p>
                        <h1 class="mb-4 text-4xl font-bold leading-[1.05] sm:text-5xl">
                            Aprende hoy.<br>
                            Llega más lejos.
                        </h1>
                        <p class="max-w-sm text-lg leading-relaxed text-white/85">
                            Ingresa a tu espacio de aprendizaje y sigue avanzando hacia tus metas.
                        </p>
                    </div>

                    <p class="relative z-10 text-sm font-semibold text-white/70">
                        Educación sin barreras para los jóvenes del mañana.
                    </p>
                </div>

                <div class="flex items-center justify-center px-6 py-10 sm:px-10 md:px-12 lg:px-16">
                    <div class="w-full max-w-md">
                        <div class="mb-8">
                            <p class="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-primary">
                                Bienvenido de nuevo
                            </p>
                            <h2 id="login-title" class="login-heading text-secondary">
                                Inicia sesión
                            </h2>
                            <p class="text-lg text-slate-500">
                                Ingresa tus datos para continuar aprendiendo.
                            </p>
                        </div>

                        <form class="space-y-5" @submit.prevent="submitLogin">
                            <div>
                                <label for="login-email" class="mb-2 block text-base font-bold text-secondary">
                                    Correo electrónico
                                </label>
                                <div class="login-input-wrap">
                                    <span class="login-input-icon" aria-hidden="true">
                                        <svg viewBox="0 0 24 24" fill="none">
                                            <path d="M3.75 6.75h16.5v10.5H3.75z" />
                                            <path d="m4.5 7.5 7.5 6 7.5-6" />
                                        </svg>
                                    </span>
                                    <input
                                        id="login-email"
                                        v-model="email"
                                        type="email"
                                        name="email"
                                        autocomplete="email"
                                        placeholder="nombre@correo.com"
                                        required
                                        class="login-input"
                                    >
                                </div>
                            </div>

                            <div>
                                <label for="login-password" class="mb-2 block text-base font-bold text-secondary">
                                    Contraseña
                                </label>
                                <div class="login-input-wrap">
                                    <span class="login-input-icon" aria-hidden="true">
                                        <svg viewBox="0 0 24 24" fill="none">
                                            <rect x="4.5" y="10" width="15" height="10.25" rx="2" />
                                            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                            <path d="M12 14v2.5" />
                                        </svg>
                                    </span>
                                    <input
                                        id="login-password"
                                        v-model="password"
                                        :type="showPassword ? 'text' : 'password'"
                                        name="password"
                                        autocomplete="current-password"
                                        placeholder="Ingresa tu contraseña"
                                        required
                                        class="login-input login-input-password"
                                    >
                                    <button
                                        type="button"
                                        class="password-toggle"
                                        :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                                        :aria-pressed="showPassword"
                                        @click="showPassword = !showPassword"
                                    >
                                        <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                            <path d="M2.75 12s3.3-6 9.25-6 9.25 6 9.25 6-3.3 6-9.25 6-9.25-6-9.25-6Z" />
                                            <circle cx="12" cy="12" r="2.5" />
                                        </svg>
                                        <svg v-else viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                            <path d="m3 3 18 18M10.6 6.2A9.7 9.7 0 0 1 12 6c5.95 0 9.25 6 9.25 6a15.6 15.6 0 0 1-3.05 3.47M6.2 6.5C3.9 8.05 2.75 12 2.75 12s3.3 6 9.25 6c1.2 0 2.25-.3 3.2-.76" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <br>
                            <!-- PENDIENTE: Agregar funcionalidad de "Recordarme" y "¿Olvidaste tu contraseña?" 

                            <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
                                <label class="inline-flex cursor-pointer items-center gap-2 text-base text-slate-600">
                                    <input
                                        v-model="rememberMe"
                                        type="checkbox"
                                        name="remember"
                                        class="h-4 w-4 accent-primary"
                                    >
                                    Recordarme
                                </label>
                                <button
                                    type="button"
                                    class="text-base font-bold text-primary transition hover:text-secondary hover:underline"
                                    @click="showPasswordHelp"
                                >
                                    ¿Olvidaste tu contraseña?
                                </button>
                            </div> -->

                            <button
                                type="submit"
                                :disabled="isSubmitting"
                                :aria-busy="isSubmitting"
                                class="login-submit mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-4 text-lg font-bold text-white shadow-lg shadow-green-900/10 transition hover:-translate-y-0.5 hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                            >
                                {{ isSubmitting ? 'Validando...' : 'Iniciar sesión' }}
                                <span v-if="!isSubmitting" aria-hidden="true">→</span>
                            </button>

                            <p
                                v-if="message"
                                :role="isError ? 'alert' : 'status'"
                                aria-live="polite"
                                :class="isError
                                    ? 'rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-800'
                                    : 'rounded-xl border border-[#d9e9d5] bg-[#f4faf2] px-4 py-3 text-sm leading-relaxed text-secondary'"
                            >
                                {{ message }}
                            </p>
                            <ul
                                v-if="Object.keys(fieldErrors).length"
                                class="list-inside list-disc rounded-xl border text-center border-red-200 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-800"
                            >
                                <li v-for="(fieldError, field) in fieldErrors" :key="field">
                                    {{ getApiErrorFieldLabel(field) }}: {{ fieldError }}
                                </li>
                            </ul>
                        </form>

                        <p class="mt-8 text-center text-base text-slate-500">
                            ¿Aún no tienes una cuenta?
                            <RouterLink to="/registro" class="font-bold text-secondary hover:text-primary hover:underline">
                                Regístrate aquí
                            </RouterLink>
                        </p>
                    </div>
                </div>
            </section>

            <p class="text-center text-sm font-semibold text-slate-400">
                © 2026 Razonando · Educación para transformar
            </p>
        </div>
    </main>
</template>

<style scoped>
.login-visual {
    background:
        radial-gradient(ellipse at 83% 18%, rgb(255 255 255 / 13%), transparent 35%),
        linear-gradient(145deg, #1f7d3a 0%, #175f2c 58%, #104a25 100%);
}

.login-heading {
    margin: 0 0 0.5rem;
    font-size: 2.25rem;
    line-height: 1.1;
    font-weight: 700;
}

.login-watermark {
    position: absolute;
    top: 0;
    right: -190px;
    width: 600px;
    opacity: 0.1;
    filter: blur(2px);
    pointer-events: none;
}

@media (min-width: 640px) {
    .login-heading {
        font-size: 3rem;
    }
    .login-watermark {
        top: 2%;
        right: -250px;
    }
}

@media (min-width: 1024px) {
    .login-watermark {
        top: 2%;
        right: -280px;
    }
}

.login-orb {
    position: absolute;
    border: 1px solid rgb(255 255 255 / 12%);
    border-radius: 9999px;
    pointer-events: none;
}

.login-orb-one {
    top: 13%;
    right: -105px;
    width: 300px;
    height: 300px;
}

.login-orb-two {
    right: -55px;
    bottom: -155px;
    width: 370px;
    height: 370px;
    background: rgb(255 255 255 / 4%);
}

.login-input-wrap {
    display: flex;
    align-items: center;
    min-height: 54px;
    border: 1px solid #dce5dc;
    border-radius: 12px;
    background: #fff;
    transition: border-color 160ms ease, box-shadow 160ms ease;
}

.login-input-wrap:focus-within {
    border-color: #44a13a;
    box-shadow: 0 0 0 3px rgb(68 161 58 / 13%);
}

.login-input-icon {
    display: flex;
    width: 48px;
    flex: none;
    justify-content: center;
    color: #6c9b69;
}

.login-input-icon svg,
.password-toggle svg {
    width: 20px;
    height: 20px;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.7;
}

.login-input {
    width: 100%;
    min-width: 0;
    border: 0;
    outline: 0;
    background: transparent;
    padding: 13px 14px 13px 0;
    color: #175f2c;
    font-size: 17px;
}

.login-input::placeholder {
    color: #a0aaa1;
}

.login-input-password {
    padding-right: 4px;
}

.password-toggle {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    padding: 12px 14px;
    color: #789078;
    transition: color 160ms ease;
}

.password-toggle:hover {
    color: #175f2c;
}

@media (max-width: 767px) {
    .login-panel {
        border-radius: 24px;
    }
}
</style>
