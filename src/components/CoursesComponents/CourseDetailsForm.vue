<script setup>
import { computed, ref, watch } from 'vue';
import { courseService } from '../../services/courseService';
import { getErrorMessage, toInputDateTime } from '../../services/courseUtils';

const props = defineProps({
    course: { type: Object, required: true },
    // El backend solo permite guardar descripción y fechas cuando la estructura está completa
    structureComplete: { type: Boolean, required: true },
    isPublished: { type: Boolean, default: false },
});

const emit = defineEmits(['saved']);

const form = ref({
    description: '',
    registrationStartDate: '',
    registrationEndDate: '',
    startDate: '',
    endDate: '',
});
const isSaving = ref(false);
const errorMessage = ref('');
const savedMessage = ref('');

const fillFromCourse = (course) => {
    form.value = {
        description: course.description || '',
        registrationStartDate: toInputDateTime(course.registrationStartDate),
        registrationEndDate: toInputDateTime(course.registrationEndDate),
        startDate: toInputDateTime(course.startDate),
        endDate: toInputDateTime(course.endDate),
    };
};

// Solo se reinicia el formulario cuando cambian los valores guardados, no cada vez que
// se recarga el curso (así no se pierde lo que se está escribiendo al editar la estructura)
watch(
    () => JSON.stringify([
        props.course.description,
        props.course.registrationStartDate,
        props.course.registrationEndDate,
        props.course.startDate,
        props.course.endDate,
    ]),
    () => fillFromCourse(props.course),
    { immediate: true },
);

const locked = computed(() => !props.structureComplete);

const datesFilled = computed(() => {
    const f = form.value;
    return Boolean(f.registrationStartDate && f.registrationEndDate && f.startDate && f.endDate);
});

// Mismas reglas que valida el backend, para avisar antes de enviar
const validate = () => {
    const { description, registrationStartDate, registrationEndDate, startDate, endDate } = form.value;
    if (!description.trim()) return 'La descripción es obligatoria.';
    if (!datesFilled.value) return 'Completa las cuatro fechas del curso.';
    if (registrationStartDate >= registrationEndDate) {
        return 'El inicio de inscripciones debe ser anterior al fin de inscripciones.';
    }
    if (startDate >= endDate) return 'El inicio del curso debe ser anterior al fin del curso.';
    if (registrationEndDate > endDate) {
        return 'Las inscripciones no pueden terminar después de que termine el curso.';
    }
    return '';
};

// Lista de requisitos en vivo
const requirements = computed(() => [
    { label: 'Materias con módulos y temas definidos', done: props.structureComplete },
    { label: 'Descripción del curso', done: Boolean(form.value.description.trim()) },
    { label: 'Las cuatro fechas (inscripciones y curso)', done: datesFilled.value },
    { label: 'Cada fecha de inicio es anterior a su fecha de fin', done: datesFilled.value && !validate() },
]);

const payload = () => ({
    description: form.value.description.trim(),
    registrationStartDate: form.value.registrationStartDate,
    registrationEndDate: form.value.registrationEndDate,
    startDate: form.value.startDate,
    endDate: form.value.endDate,
});

const run = async (action, successMessage, fallback) => {
    errorMessage.value = '';
    savedMessage.value = '';

    const validationError = validate();
    if (validationError) {
        errorMessage.value = validationError;
        return;
    }

    isSaving.value = true;
    try {
        await action();
        savedMessage.value = successMessage;
        emit('saved');
    } catch (error) {
        errorMessage.value = getErrorMessage(error, fallback);
    } finally {
        isSaving.value = false;
    }
};

const save = () =>
    run(() => courseService.updateDetails(props.course.id, payload()), 'Cambios guardados.', 'No se pudieron guardar los cambios.');

// Publicar guarda primero la descripción y las fechas, y luego publica (el backend vuelve a validar todo)
const publish = () => {
    if (!window.confirm('¿Publicar el curso? Quedará visible para los estudiantes según las fechas de inscripción.')) return;
    run(
        async () => {
            await courseService.updateDetails(props.course.id, payload());
            await courseService.publishCourse(props.course.id);
        },
        'Curso publicado.',
        'No se pudo publicar el curso.',
    );
};

const inputClass =
    'w-full rounded-lg border border-[#c9dec5] bg-white px-3 py-2 text-lg text-slate-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400';
const labelClass = 'mb-1 block text-base font-bold text-secondary';
</script>

<template>
    <form class="rounded-2xl border border-[#dce9d9] bg-white p-5 shadow-sm" @submit.prevent="save">
        <p
            v-if="locked"
            class="mb-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-base text-amber-900"
        >
            <icon-bi-lock-fill width="16" height="16" aria-hidden="true" class="mt-1 shrink-0" />
            Define al menos una materia, con sus módulos y temas, para poder asignar la descripción y las fechas.
        </p>

        <fieldset :disabled="locked || isSaving" class="space-y-4">
            <div>
                <label for="course-description" :class="labelClass">Descripción</label>
                <textarea
                    id="course-description"
                    v-model="form.description"
                    rows="4"
                    maxlength="2000"
                    :class="inputClass"
                    placeholder="¿De qué trata el curso y a quién va dirigido?"
                />
            </div>

            <div class="grid gap-4 md:grid-cols-2">
                <div>
                    <label for="registration-start" :class="labelClass">Inicio de inscripciones</label>
                    <input id="registration-start" v-model="form.registrationStartDate" type="datetime-local" :class="inputClass" />
                </div>
                <div>
                    <label for="registration-end" :class="labelClass">Fin de inscripciones</label>
                    <input id="registration-end" v-model="form.registrationEndDate" type="datetime-local" :class="inputClass" />
                </div>
                <div>
                    <label for="course-start" :class="labelClass">Inicio del curso</label>
                    <input id="course-start" v-model="form.startDate" type="datetime-local" :class="inputClass" />
                </div>
                <div>
                    <label for="course-end" :class="labelClass">Fin del curso</label>
                    <input id="course-end" v-model="form.endDate" type="datetime-local" :class="inputClass" />
                </div>
            </div>
        </fieldset>

        <!-- Requisitos para publicar -->
        <div v-if="!isPublished" class="mt-5 rounded-xl bg-[#f5f8f4] px-4 py-3">
            <p class="mb-2 text-base font-bold text-secondary">Para publicar el curso se necesita:</p>
            <ul class="space-y-1 text-lg">
                <li
                    v-for="item in requirements"
                    :key="item.label"
                    class="flex items-center gap-2"
                    :class="item.done ? 'text-secondary' : 'text-slate-500'"
                >
                    <icon-bi-check-circle-fill v-if="item.done" width="18" height="18" class="shrink-0 text-primary" />
                    <icon-bi-circle v-else width="18" height="18" class="shrink-0" />
                    {{ item.label }}
                </li>
            </ul>
        </div>

        <p v-if="errorMessage" role="alert" class="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-base text-red-900">
            {{ errorMessage }}
        </p>
        <p v-if="savedMessage" role="status" class="mt-4 text-base font-bold text-secondary">{{ savedMessage }}</p>

        <div class="mt-5 flex flex-wrap justify-end gap-3">
            <button
                type="submit"
                :disabled="locked || isSaving"
                class="rounded-lg border-2 border-secondary px-5 py-2 text-lg font-bold text-secondary transition hover:bg-[#e8f2e5] disabled:cursor-not-allowed disabled:opacity-50"
            >
                {{ isSaving ? 'Guardando...' : 'Guardar' }}
            </button>
            <button
                v-if="!isPublished"
                type="button"
                :disabled="locked || isSaving"
                class="rounded-lg bg-secondary px-5 py-2 text-lg font-bold text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
                @click="publish"
            >
                Publicar curso
            </button>
        </div>
    </form>
</template>