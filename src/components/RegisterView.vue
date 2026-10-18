<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/authService';
import { getApiErrorFieldLabel } from '../services/apiErrorService';

const form = ref({
    documentType: '',
    idNumber: '',
    names: '',
    surNames: '',
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
});

const router = useRouter();
const message = ref('');
const isModalOpen = ref(false);
const fieldErrors = ref({});
const isError = ref(false);
const isSubmitting = ref(false);
const confirmationInput = ref(null);
const passwordPattern = '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!¡?¿/]).{8,}$';
const passwordRequirements = computed(() => [
    { label: 'Al menos 8 caracteres', met: form.value.password.length >= 8 },
    { label: 'Una letra mayúscula', met: /[A-Z]/.test(form.value.password) },
    { label: 'Una letra minúscula', met: /[a-z]/.test(form.value.password) },
    { label: 'Un número', met: /[0-9]/.test(form.value.password) },
    {
        label: 'Un símbolo (!, @, #, $, %, ^, &, +, =, ¡, ¿, ? o /)',
        met: /[@#$%^&+=!¡?¿\/]/.test(form.value.password),
    },
]);

const blockScroll = () => {
    document.body.style.overflow = 'hidden';
};

const allowScroll = () => {
    document.body.style.overflow = '';
};

const closeModal = () => {
    isModalOpen.value = false;
    allowScroll();
    router.push('/login');
};

const onlyNumbers = (event) => {
    const charCode = event.charCode || event.keyCode;
    if (charCode < 48 || charCode > 57) {
        event.preventDefault();
    }
};

const updateConfirmationValidity = () => {
    if (!confirmationInput.value) return;

    confirmationInput.value.setCustomValidity(
        form.value.confirmPassword && form.value.confirmPassword !== form.value.password
            ? 'La contraseña y su confirmación no coinciden.'
            : '',
    );
};

const submitRegistration = async () => {
    updateConfirmationValidity();
    if (!confirmationInput.value?.reportValidity()) return;

    message.value = '';
    fieldErrors.value = {};
    isError.value = false;
    isSubmitting.value = true;

    try {
        const registrationResponse = await authService.register({
            documentType: form.value.documentType,
            idNumber: form.value.idNumber,
            names: form.value.names,
            surNames: form.value.surNames,
            nickname: form.value.nickname || null,
            email: form.value.email.trim(),
            password: form.value.password,
        });

        isModalOpen.value = true;
        blockScroll();
        form.value = {
            documentType: '',
            idNumber: '',
            names: '',
            surNames: '',
            nickname: '',
            email: '',
            password: '',
            confirmPassword: '',
        };

    } catch (error) {
        isError.value = true;
        const responseData = error.response?.data;
        message.value = responseData?.message
            || (error.response
                ? 'No se pudo crear la cuenta. Revisa los datos e inténtalo de nuevo.'
                : 'No fue posible conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.');
        fieldErrors.value = responseData?.errors && typeof responseData.errors === 'object'
            ? responseData.errors
            : {};
    } finally {
        isSubmitting.value = false;
    }
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
                class="login-panel grid overflow-hidden rounded-3xl bg-white shadow-[0_24px_80px_-32px_rgba(23,95,44,0.28)] lg:grid-cols-[0.82fr_1.18fr]"
                aria-labelledby="register-title"
            >
                <div class="login-visual relative flex min-h-55 flex-col justify-between overflow-hidden px-7 py-8 text-white sm:px-10 sm:py-10 lg:min-h-full lg:px-12 lg:py-12">
                    <img
                        src="../assets/Logos/IsotipoRazonandoNegativoInvertido.png"
                        alt=""
                        aria-hidden="true"
                        class="login-watermark"
                    >
                    <div class="login-orb login-orb-two" aria-hidden="true"></div>

                    <div class="relative z-10 flex items-center gap-3">
                        <span class="text-xl font-bold tracking-wide">¡BIENVENIDO!</span>
                    </div>

                    <div class="relative z-10 max-w-md py-6 lg:py-12">
                        <p class="mb-3 text-sm font-bold tracking-[0.2em] text-white/75 uppercase">
                            Nos alegra que estés aquí :)
                        </p>
                        <h1 class="mb-4 text-4xl leading-[1.05] font-bold sm:text-5xl">
                            Empieza tu camino.<br>
                            Crece a tu ritmo.
                        </h1>
                        <p class="max-w-sm text-lg leading-relaxed text-white/85">
                            Crea tu cuenta y encuentra un espacio para aprender y avanzar hacia tus metas.
                        </p>
                    </div>

                    <p class="relative z-10 text-sm font-semibold text-white/70">
                        Educación sin barreras para los jóvenes del mañana.
                    </p>
                </div>

                <div class="flex items-center justify-center px-6 py-9 sm:px-10 lg:px-12 lg:py-12">
                    <div class="w-full max-w-2xl">
                        <div class="mb-7">
                            <p class="mb-2 text-sm font-bold tracking-[0.18em] text-primary uppercase">
                                Únete a Razonando
                            </p>
                            <h2 id="register-title" class="register-heading text-secondary">
                                Crea tu cuenta
                            </h2>
                            <p class="text-lg text-slate-500">
                                Completa tus datos para comenzar.
                            </p>
                        </div>

                        <form class="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2" @submit.prevent="submitRegistration">
                            <div>
                                <label for="document-type" class="mb-2 block text-base font-bold text-secondary">
                                    Tipo de documento
                                </label>
                                <select
                                    id="document-type"
                                    v-model="form.documentType"
                                    name="documentType"
                                    required
                                    placeholder="Selecciona una opción"
                                    class="register-input"
                                >
                                    <option disabled value="">Selecciona una opción</option>
                                    <option value="CC">Cédula de ciudadanía</option>
                                    <option value="CE">Cédula de extranjería</option>
                                    <option value="TI">Tarjeta de identidad</option>
                                    <option value="PA">Pasaporte</option>
                                </select>
                            </div>

                            <div>
                                <label for="id-number" class="mb-2 block text-base font-bold text-secondary">
                                    Número de documento
                                </label>
                                <input
                                    id="id-number"
                                    v-model.number="form.idNumber"
                                    @keypress="onlyNumbers"
                                    type="text"
                                    name="idNumber"
                                    autocomplete="off"
                                    maxlength="15"
                                    placeholder="Máximo 15 caracteres"
                                    required
                                    class="register-input"
                                >
                            </div>

                            <div>
                                <label for="names" class="mb-2 block text-base font-bold text-secondary">
                                    Nombres
                                </label>
                                <input
                                    id="names"
                                    v-model.trim="form.names"
                                    type="text"
                                    name="names"
                                    autocomplete="given-name"
                                    maxlength="80"
                                    placeholder="Tus nombres"
                                    required
                                    class="register-input"
                                >
                            </div>

                            <div>
                                <label for="sur-names" class="mb-2 block text-base font-bold text-secondary">
                                    Apellidos
                                </label>
                                <input
                                    id="sur-names"
                                    v-model.trim="form.surNames"
                                    type="text"
                                    name="surNames"
                                    autocomplete="family-name"
                                    maxlength="80"
                                    placeholder="Tus apellidos"
                                    required
                                    class="register-input"
                                >
                            </div>

                            <div>
                                <label for="nickname" class="mb-2 block text-base font-bold text-secondary">
                                    Nombre de usuario <span class="font-normal text-slate-400">(opcional)</span>
                                </label>
                                <input
                                    id="nickname"
                                    v-model.trim="form.nickname"
                                    type="text"
                                    name="nickname"
                                    autocomplete="nickname"
                                    maxlength="50"
                                    placeholder="¿Cómo te llamamos?"
                                    class="register-input"
                                >
                            </div>

                            <div>
                                <label for="register-email" class="mb-2 block text-base font-bold text-secondary">
                                    Correo electrónico
                                </label>
                                <input
                                    id="register-email"
                                    v-model.trim="form.email"
                                    type="email"
                                    name="email"
                                    autocomplete="email"
                                    maxlength="80"
                                    placeholder="nombre@correo.com"
                                    required
                                    class="register-input"
                                >
                            </div>

                            <div>
                                <label for="register-password" class="mb-2 block text-base font-bold text-secondary">
                                    Contraseña
                                </label>
                                <input
                                    id="register-password"
                                    v-model="form.password"
                                    type="password"
                                    name="password"
                                    autocomplete="new-password"
                                    :pattern="passwordPattern"
                                    title="Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (@#$%^&amp;+=!¡?¿/)."
                                    placeholder="Crea una contraseña segura"
                                    required
                                    class="register-input"
                                    aria-describedby="password-requirements"
                                    @input="updateConfirmationValidity"
                                >
                                <ul
                                    id="password-requirements"
                                    class="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2"
                                    aria-label="Requisitos de la contraseña"
                                >
                                    <li
                                        v-for="requirement in passwordRequirements"
                                        :key="requirement.label"
                                        class="flex items-start gap-2 leading-snug"
                                        :class="requirement.met ? 'text-green-800' : 'text-slate-500'"
                                    >
                                        <span
                                            aria-hidden="true"
                                            class="mt-px inline-flex size-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                                            :class="requirement.met ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-400'"
                                        >
                                            {{ requirement.met ? '✓' : '·' }}
                                        </span>
                                        <span>
                                            {{ requirement.label }}
                                            <span class="font-semibold">
                                                {{ requirement.met ? '— listo' : `— ${form.password ? 'falta' : 'pendiente'}` }}
                                            </span>
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <label for="confirm-password" class="mb-2 block text-base font-bold text-secondary">
                                    Confirmar contraseña
                                </label>
                                <input
                                    id="confirm-password"
                                    ref="confirmationInput"
                                    v-model="form.confirmPassword"
                                    type="password"
                                    name="confirmPassword"
                                    autocomplete="new-password"
                                    placeholder="Escribe de nuevo tu contraseña"
                                    required
                                    class="register-input"
                                    @input="updateConfirmationValidity"
                                >
                            </div>

                            <div class="sm:col-span-2">
                                <button
                                    type="submit"
                                    :disabled="isSubmitting"
                                    :aria-busy="isSubmitting"
                                    class="login-submit flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-4 text-lg font-bold text-white shadow-lg shadow-green-900/10 transition hover:-translate-y-0.5 hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                                >
                                    {{ isSubmitting ? 'Creando cuenta...' : 'Crear cuenta' }}
                                    <span v-if="!isSubmitting" aria-hidden="true">→</span>
                                </button>
                            </div>

                            <p
                                v-if="message"
                                :role="isError ? 'alert' : 'status'"
                                aria-live="polite"
                                :class="isError
                                    ? 'rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-800 sm:col-span-2'
                                    : 'rounded-xl border border-[#d9e9d5] bg-[#f4faf2] px-4 py-3 text-sm leading-relaxed text-secondary sm:col-span-2'"
                            >
                                {{ message }}
                            </p>
                            <ul
                                v-if="Object.keys(fieldErrors).length"
                                class="list-inside list-disc rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-800 sm:col-span-2"
                            >
                                <li v-for="(fieldError, field) in fieldErrors" :key="field">
                                    {{ getApiErrorFieldLabel(field) }}: {{ fieldError }}
                                </li>
                            </ul>
                        </form>

                        <p class="mt-7 text-center text-base text-slate-500">
                            ¿Ya tienes una cuenta?
                            <RouterLink to="/login" class="font-bold text-secondary hover:text-primary hover:underline">
                                Inicia sesión
                            </RouterLink>
                        </p>
                    </div>
                </div>
            </section>

            <p class="text-center text-sm font-semibold text-slate-400">
                © 2026 Razonando · Educación para transformar
            </p>

            <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
                <div class="modal-content">
                    <h2 class="modal-title">¡Cuenta creada con éxito!</h2>
                    <p class="modal-message">
                        Tu cuenta se ha creado correctamente. Ahora puedes iniciar sesión y comenzar a explorar Razonando :D.
                    </p>
                    <br>
                    <button class="modal-button" @click="closeModal">Iniciar sesion</button> 
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
.login-visual {
    background:
        radial-gradient(ellipse at 83% 18%, rgb(255 255 255 / 13%), transparent 35%),
        linear-gradient(145deg, #1f7d3a 0%, #175f2c 58%, #104a25 100%);
}

.register-heading {
    margin: 0 0 0.5rem;
    font-size: 2.25rem;
    line-height: 1.1;
    font-weight: 700;
}

.login-watermark {
    position: absolute;
    top: 2%;
    right: -200px;
    width: 500px;
    opacity: 0.1;
    filter: blur(2px);
    pointer-events: none;
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

@media (max-width: 1024px) {
    .login-watermark {
        right: -160px;
    }
    .login-orb-two {
        right: 75%;
        bottom: -135px;
        width: 300px;
        height: 300px;
    }
}

@media (max-width: 640px) {
    .login-watermark {
        top: 0;
        right: -120px;
    }
}

.register-input {
    width: 100%;
    min-height: 52px;
    border: 1px solid #dce5dc;
    border-radius: 12px;
    background: #fff;
    padding: 12px 14px;
    color: #175f2c;
    font-size: 16px;
    outline: none;
    transition: border-color 160ms ease, box-shadow 160ms ease;
}

.register-input::placeholder {
    color: #a0aaa1;
}

.register-input:focus {
    border-color: #44a13a;
    box-shadow: 0 0 0 3px rgb(68 161 58 / 13%);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #1f7d3a;
  padding: 25px;
  border-radius: 8px;
  width: 350px;
  text-align: center;
  color: white;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
}

.modal-button {
  padding: 8px 20px;
  background-color: #44a13a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-button:hover {
  background-color: white;
  color: #44a13a;
}
</style>
