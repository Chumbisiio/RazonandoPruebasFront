<script setup>
import { computed, ref } from 'vue';
import { courseService } from '../../services/courseService';
import { formatDate, getErrorMessage } from '../../services/courseUtils';

const props = defineProps({
    course: { type: Object, required: true },
});
const emit = defineEmits(['close', 'enrolled']);

const hours = ref('');
const accepted = ref(false);
const isSaving = ref(false);
const error = ref('');

const startText = computed(() => formatDate(props.course.startDate));
const canConfirm = computed(() => accepted.value && hours.value && !isSaving.value);

const confirm = async () => {
    if (!canConfirm.value) return;
    isSaving.value = true;
    error.value = '';
    try {
        await courseService.enrollInCourse(props.course.id);
        emit('enrolled');
    } catch (e) {
        error.value = getErrorMessage(e, 'No se pudo completar la inscripción.');
    } finally {
        isSaving.value = false;
    }
};
</script>

<template>
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        role="dialog"
        aria-modal="true"
        @click.self="emit('close')"
    >
        <div class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#dce9d9] bg-white p-6 shadow-lg">
            <p class="text-sm font-bold uppercase tracking-[0.18em] text-primary">Tu compromiso</p>
            <h2 class="mt-1 text-3xl font-bold text-secondary">{{ course.name }}</h2>

            <p class="mt-4 rounded-lg bg-[#e8f2e5] px-4 py-3 text-base leading-snug text-secondary">
                Inscribirte no es solo reservar un cupo: es decirte a ti mismo que
                <strong>este es el momento</strong>. Los estudiantes que se fijan una meta clara y la
                escriben llegan mucho más lejos que quienes lo dejan para "cuando tengan tiempo".
                Tu yo del futuro, el que ya está en la universidad, te lo va a agradecer.
            </p>

            <p v-if="startText" class="mt-3 text-base text-slate-600">
                El curso empieza el <strong class="text-secondary">{{ startText }}</strong>.
                Desde hoy, ¡prepárate!
            </p>

            <label class="mt-5 block text-base font-bold text-secondary" for="hours">
                ¿Cuántas horas por semana te comprometes a estudiar?
            </label>
            <select
                id="hours"
                v-model="hours"
                class="mt-2 w-full rounded-lg border border-[#c9dec5] bg-white px-3 py-2 text-base"
            >
                <option value="" disabled>Elige una meta realista</option>
                <option value="3-5">3 a 5 horas</option>
                <option value="6-10">6 a 10 horas</option>
                <option value="10+">Más de 10 horas</option>
            </select>

            <label class="mt-4 flex items-start gap-3 text-base text-slate-700">
                <input v-model="accepted" type="checkbox" class="mt-1 h-5 w-5 accent-[#2f6b3a]" />
                <span>
                    Me comprometo a asistir, hacer los quizzes de cada tema y no rendirme a la primera
                    dificultad. Estoy seguro de que quiero inscribirme.
                </span>
            </label>

            <p v-if="error" role="alert" class="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-base text-red-900">
                {{ error }}
            </p>

            <div class="mt-6 flex flex-wrap justify-end gap-3">
                <button
                    type="button"
                    class="rounded-lg border border-[#c9dec5] px-5 py-2 font-bold text-secondary transition hover:bg-[#e8f2e5]"
                    @click="emit('close')"
                >
                    Todavía no
                </button>
                <button
                    type="button"
                    :disabled="!canConfirm"
                    class="rounded-lg bg-secondary px-5 py-2 font-bold text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
                    @click="confirm"
                >
                    {{ isSaving ? 'Inscribiendo...' : 'Sí, estoy seguro' }}
                </button>
            </div>
        </div>
    </div>
</template>