<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { formatDate } from '../../services/courseUtils';

const props = defineProps({
    course: { type: Object, required: true },
    // Si es false la tarjeta no abre el detalle (ej. cursos con inscripción abierta donde aún no estás inscrito)
    linkable: { type: Boolean, default: true },
    // Si es true, al hacer click se emite "select" (ej. abrir el modal de inscripción)
    selectable: { type: Boolean, default: false },
    deletable: { type: Boolean, default: false },
});

const emit = defineEmits(['delete', 'select']);

const stateLabels = {
    ACTIVE: 'Activo',
    INACTIVE: 'Inactivo',
    PENDING: 'Pendiente',
    APPROVED: 'Aprobado',
    REJECTED: 'Rechazado',
    ENROLLED: 'Inscrito',
    FINISHED: 'Finalizado',
};

const formatState = (state) => stateLabels[state?.toUpperCase()] || state;

const subjectsText = computed(() => {
    const count = props.course.subjectsCount ?? 0;
    return count === 1 ? '1 materia' : `${count} materias`;
});

const startText = computed(() => formatDate(props.course.startDate));
const registrationEndText = computed(() => formatDate(props.course.registrationEndDate));

const isDraft = computed(() => props.course.state !== 'PUBLISHED');
// Inscrito pero el curso aún no empieza
const notStartedText = computed(() =>
    props.course.enrollmentState && props.course.phase === 'NOT_STARTED' && startText.value
        ? `Estás inscrito. El curso empieza el ${startText.value}.`
        : null,
);

const onSelect = () => {
    if (props.selectable) emit('select', props.course);
};
</script>

<template>
    <div class="relative h-full">
        <component
            :is="linkable ? RouterLink : 'article'"
            :to="linkable ? { name: 'course-detail', params: { courseId: course.id } } : undefined"
            :role="selectable ? 'button' : undefined"
            :tabindex="selectable ? 0 : undefined"
            class="flex h-full flex-col rounded-2xl border border-[#dce9d9] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
            :class="{ 'cursor-pointer': selectable }"
            @click="onSelect"
            @keydown.enter="onSelect"
        >
            <div class="flex items-start justify-between gap-3">
                <span
                    aria-hidden="true"
                    class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e8f2e5] text-primary"
                >
                    <icon-bi-book width="22" height="22" />
                </span>
                <span
                    v-if="isDraft"
                    class="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-900"
                    :class="{ 'mr-10': deletable }"
                >
                    Borrador
                </span>
                <span
                    v-else-if="course.enrollmentState"
                    class="rounded-full bg-[#e8f2e5] px-3 py-1 text-sm font-bold text-secondary"
                >
                    {{ formatState(course.enrollmentState) }}
                </span>
            </div>

            <h3 class="mt-4 text-2xl font-bold leading-tight text-secondary">{{ course.name }}</h3>
            <p v-if="course.description" class="mt-2 line-clamp-3 text-base leading-snug text-slate-600">
                {{ course.description }}
            </p>
            <p v-else-if="isDraft" class="mt-2 text-base leading-snug text-slate-500">
                Sin descripción todavía.
            </p>
            <p v-if="notStartedText" class="mt-3 rounded-lg bg-[#e8f2e5] px-3 py-2 text-base font-bold text-secondary">
                {{ notStartedText }}
            </p>

            <dl class="mt-auto space-y-1 pt-5 text-base text-slate-600">
                <div class="flex justify-between gap-3">
                    <dt class="font-bold text-secondary">Contenido</dt>
                    <dd>{{ subjectsText }}</dd>
                </div>
                <div v-if="startText" class="flex justify-between gap-3">
                    <dt class="font-bold text-secondary">Inicio</dt>
                    <dd>{{ startText }}</dd>
                </div>
                <div v-if="registrationEndText" class="flex justify-between gap-3">
                    <dt class="font-bold text-secondary">Inscripciones hasta</dt>
                    <dd>{{ registrationEndText }}</dd>
                </div>
            </dl>

            <p
                v-if="selectable"
                class="mt-4 rounded-lg bg-secondary px-4 py-2 text-center font-bold text-white"
            >
                Inscribirme
            </p>
        </component>

        <button
            v-if="deletable"
            type="button"
            class="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg text-red-700 transition hover:bg-red-50"
            aria-label="Eliminar curso"
            title="Eliminar curso"
            @click.prevent.stop="emit('delete', course)"
        >
            <icon-bi-trash width="18" height="18" />
        </button>
    </div>
</template>