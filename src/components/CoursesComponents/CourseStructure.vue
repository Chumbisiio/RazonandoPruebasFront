<script setup>
import { onMounted, ref } from 'vue';
import { courseService } from '../../services/courseService';
import { getErrorMessage } from '../../services/courseUtils';
import InlineForm from './InlineForm.vue';

const props = defineProps({
    courseId: { type: [Number, String], required: true },
    subjects: { type: Array, required: true },
    // true para admin y superadmin: permite agregar, renombrar y eliminar
    editable: { type: Boolean, default: false },
});

// El padre vuelve a cargar el detalle cuando algo cambia
const emit = defineEmits(['changed']);

// Qué formulario está abierto: 'add-subject', 'add-module:<id>', 'add-topic:<id>', 'edit-subject:<id>', ...
const openForm = ref(null);
const busy = ref(false);
const actionError = ref('');

const run = async (action, fallback) => {
    busy.value = true;
    actionError.value = '';
    try {
        await action();
        openForm.value = null;
        emit('changed');
    } catch (error) {
        actionError.value = getErrorMessage(error, fallback);
    } finally {
        busy.value = false;
    }
};

const askDelete = (message) => window.confirm(message);

// ---------- Profesores ----------
const teachers = ref([]);

const loadTeachers = async () => {
    try {
        teachers.value = await courseService.getTeachers();
    } catch (error) {
        actionError.value = getErrorMessage(error, 'No se pudo cargar la lista de profesores.');
    }
};

const teacherName = (teacher) => `${teacher.names} ${teacher.surNames}`;

const assignTeacher = (subject, value) =>
    run(
        () => courseService.assignTeacher(subject.courseSubjectId, value ? Number(value) : null),
        'No se pudo asignar el profesor.',
    );

onMounted(() => {
    if (props.editable) loadTeachers();
});

// ---------- Materias ----------
const addSubject = ({ name, second, teacherId }) =>
    run(
        () => courseService.addSubject(props.courseId, { name, description: second, teacherId }),
        'No se pudo agregar la materia.',
    );
const editSubject = (subject, { name, second }) =>
    run(() => courseService.updateSubject(subject.courseSubjectId, { name, description: second }), 'No se pudo editar la materia.');
const removeSubject = (subject) => {
    if (!askDelete(`¿Eliminar la materia "${subject.name}" con todos sus módulos y temas?`)) return;
    run(() => courseService.deleteSubject(subject.courseSubjectId), 'No se pudo eliminar la materia.');
};

// ---------- Módulos ----------
const addModule = (subject, { name, second }) =>
    run(() => courseService.addModule(subject.courseSubjectId, { name, summary: second }), 'No se pudo agregar el módulo.');
const editModule = (module, { name, second }) =>
    run(() => courseService.updateModule(module.id, { name, summary: second }), 'No se pudo editar el módulo.');
const removeModule = (module) => {
    if (!askDelete(`¿Eliminar el módulo "${module.name}" y sus temas?`)) return;
    run(() => courseService.deleteModule(module.id), 'No se pudo eliminar el módulo.');
};

// ---------- Temas ----------
const addTopic = (module, { name }) =>
    run(() => courseService.addTopic(module.id, name), 'No se pudo agregar el tema.');
const editTopic = (topic, { name }) =>
    run(() => courseService.updateTopic(topic.id, name), 'No se pudo editar el tema.');
const removeTopic = (topic) => {
    if (!askDelete(`¿Eliminar el tema "${topic.name}"?`)) return;
    run(() => courseService.deleteTopic(topic.id), 'No se pudo eliminar el tema.');
};

const iconButton =
    'flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-[#e8f2e5] hover:text-secondary focus-visible:outline-2 focus-visible:outline-primary';
const addButton =
    'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-base font-bold text-secondary transition hover:bg-[#e8f2e5]';
</script>

<template>
    <div class="space-y-5">
        <div
            v-if="actionError"
            role="alert"
            class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-base text-red-900"
        >
            {{ actionError }}
        </div>

        <p
            v-if="!subjects.length && !editable"
            class="rounded-2xl border border-dashed border-[#c9dec5] bg-white/60 px-5 py-8 text-center text-lg text-slate-600"
        >
            Este curso todavía no tiene contenido.
        </p>

        <article
            v-for="subject in subjects"
            :key="subject.courseSubjectId"
            class="rounded-2xl border border-[#dce9d9] bg-white p-5 shadow-sm"
        >
            <!-- Materia -->
            <InlineForm
                v-if="openForm === `edit-subject:${subject.courseSubjectId}`"
                name-placeholder="Nombre de la materia"
                second-placeholder="Descripción (opcional)"
                :initial-name="subject.name"
                :initial-second="subject.description"
                :busy="busy"
                @submit="editSubject(subject, $event)"
                @cancel="openForm = null"
            />
            <header v-else class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                    <h3 class="text-2xl font-bold leading-tight text-secondary">{{ subject.name }}</h3>
                    <p v-if="subject.description" class="mt-1 text-base leading-snug text-slate-600">
                        {{ subject.description }}
                    </p>
                                        <label v-if="editable" class="mt-3 flex flex-wrap items-center gap-2 text-base text-slate-600">
                        <span class="font-bold text-secondary">Profesor:</span>
                        <select
                            :value="subject.teacher?.id ?? ''"
                            :disabled="busy"
                            class="rounded-lg border border-[#c9dec5] bg-white px-3 py-1.5 text-base text-slate-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
                            @change="assignTeacher(subject, $event.target.value)"
                        >
                            <option value="">Sin profesor asignado</option>
                            <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                                {{ teacherName(teacher) }}
                            </option>
                        </select>
                    </label>
                    <p v-else-if="subject.teacher" class="mt-2 text-base text-slate-600">
                        <span class="font-bold text-secondary">Profesor:</span> {{ teacherName(subject.teacher) }}
                    </p>
                </div>
                <div v-if="editable" class="flex shrink-0 gap-1">
                    <button
                        type="button"
                        :class="iconButton"
                        :aria-label="`Editar materia ${subject.name}`"
                        @click="openForm = `edit-subject:${subject.courseSubjectId}`"
                    >
                        <icon-bi-pencil width="16" height="16" />
                    </button>
                    <button
                        type="button"
                        :class="iconButton"
                        :aria-label="`Eliminar materia ${subject.name}`"
                        @click="removeSubject(subject)"
                    >
                        <icon-bi-trash width="16" height="16" />
                    </button>
                </div>
            </header>

            <!-- Módulos -->
            <div class="mt-4 space-y-3">
                <p
                    v-if="!subject.modules.length"
                    class="flex items-center gap-2 text-base"
                    :class="editable ? 'text-amber-800' : 'text-slate-500'"
                >
                    <icon-bi-exclamation-triangle v-if="editable" width="16" height="16" aria-hidden="true" />
                    {{ editable ? 'Falta agregar al menos un módulo a esta materia.' : 'Esta materia todavía no tiene módulos.' }}
                </p>

                <details
                    v-for="module in subject.modules"
                    :key="module.id"
                    open
                    class="group rounded-xl border border-[#e3eee0] bg-[#f9fbf8] p-4"
                >
                    <summary class="flex cursor-pointer list-none items-start justify-between gap-3">
                        <div class="flex min-w-0 items-start gap-2">
                            <icon-bi-chevron-right
                                width="14"
                                height="14"
                                aria-hidden="true"
                                class="mt-2 shrink-0 text-primary transition group-open:rotate-90"
                            />
                            <div class="min-w-0">
                                <h4 class="text-xl font-bold leading-tight text-secondary">{{ module.name }}</h4>
                                <p v-if="module.summary" class="mt-0.5 text-base leading-snug text-slate-600">
                                    {{ module.summary }}
                                </p>
                            </div>
                        </div>
                        <div v-if="editable" class="flex shrink-0 gap-1" @click.prevent>
                            <button
                                type="button"
                                :class="iconButton"
                                :aria-label="`Editar módulo ${module.name}`"
                                @click.prevent="openForm = `edit-module:${module.id}`"
                            >
                                <icon-bi-pencil width="16" height="16" />
                            </button>
                            <button
                                type="button"
                                :class="iconButton"
                                :aria-label="`Eliminar módulo ${module.name}`"
                                @click.prevent="removeModule(module)"
                            >
                                <icon-bi-trash width="16" height="16" />
                            </button>
                        </div>
                    </summary>

                    <InlineForm
                        v-if="openForm === `edit-module:${module.id}`"
                        class="mt-3"
                        name-placeholder="Nombre del módulo"
                        second-placeholder="Resumen (opcional)"
                        :initial-name="module.name"
                        :initial-second="module.summary"
                        :busy="busy"
                        @submit="editModule(module, $event)"
                        @cancel="openForm = null"
                    />

                    <!-- Temas -->
                    <ul class="mt-3 space-y-1">
                        <li
                            v-for="topic in module.topics"
                            :key="topic.id"
                            class="flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-2"
                        >
                            <InlineForm
                                v-if="openForm === `edit-topic:${topic.id}`"
                                class="w-full"
                                name-placeholder="Nombre del tema"
                                :initial-name="topic.name"
                                :busy="busy"
                                @submit="editTopic(topic, $event)"
                                @cancel="openForm = null"
                            />
                            <template v-else>
                                <span class="flex min-w-0 items-center gap-2 text-lg text-slate-800">
                                    <icon-bi-journal-text
                                        width="16"
                                        height="16"
                                        aria-hidden="true"
                                        class="shrink-0 text-primary"
                                    />
                                    <span class="truncate">{{ topic.name }}</span>
                                </span>
                                <span v-if="editable" class="flex shrink-0 gap-1">
                                    <button
                                        type="button"
                                        :class="iconButton"
                                        :aria-label="`Editar tema ${topic.name}`"
                                        @click="openForm = `edit-topic:${topic.id}`"
                                    >
                                        <icon-bi-pencil width="14" height="14" />
                                    </button>
                                    <button
                                        type="button"
                                        :class="iconButton"
                                        :aria-label="`Eliminar tema ${topic.name}`"
                                        @click="removeTopic(topic)"
                                    >
                                        <icon-bi-trash width="14" height="14" />
                                    </button>
                                </span>
                            </template>
                        </li>
                    </ul>

                    <p
                        v-if="!module.topics.length"
                        class="mt-2 flex items-center gap-2 text-base"
                        :class="editable ? 'text-amber-800' : 'text-slate-500'"
                    >
                        <icon-bi-exclamation-triangle v-if="editable" width="16" height="16" aria-hidden="true" />
                        {{ editable ? 'Falta agregar al menos un tema a este módulo.' : 'Este módulo todavía no tiene temas.' }}
                    </p>

                    <div v-if="editable" class="mt-2">
                        <InlineForm
                            v-if="openForm === `add-topic:${module.id}`"
                            name-placeholder="Nombre del tema (ej. Áreas)"
                            submit-label="Agregar tema"
                            :busy="busy"
                            @submit="addTopic(module, $event)"
                            @cancel="openForm = null"
                        />
                        <button v-else type="button" :class="addButton" @click="openForm = `add-topic:${module.id}`">
                            <icon-bi-plus-lg width="14" height="14" aria-hidden="true" /> Agregar tema
                        </button>
                    </div>
                </details>

                <div v-if="editable">
                    <InlineForm
                        v-if="openForm === `add-module:${subject.courseSubjectId}`"
                        name-placeholder="Nombre del módulo (ej. Geometría)"
                        second-placeholder="Resumen (opcional)"
                        submit-label="Agregar módulo"
                        :busy="busy"
                        @submit="addModule(subject, $event)"
                        @cancel="openForm = null"
                    />
                    <button
                        v-else
                        type="button"
                        :class="addButton"
                        @click="openForm = `add-module:${subject.courseSubjectId}`"
                    >
                        <icon-bi-plus-lg width="14" height="14" aria-hidden="true" /> Agregar módulo
                    </button>
                </div>
            </div>
        </article>

        <!-- Nueva materia -->
        <div v-if="editable">
            <InlineForm
                v-if="openForm === 'add-subject'"
                :teachers="teachers"
                name-placeholder="Nombre de la materia (ej. Razonamiento lógico)"
                second-placeholder="Descripción (opcional)"
                submit-label="Agregar materia"
                :busy="busy"
                @submit="addSubject"
                @cancel="openForm = null"
            />
            <button
                v-else
                type="button"
                class="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-primary bg-white/60 px-5 py-4 text-lg font-bold text-secondary transition hover:bg-[#e8f2e5]"
                @click="openForm = 'add-subject'"
            >
                <icon-bi-plus-lg width="16" height="16" aria-hidden="true" /> Agregar materia
            </button>
        </div>
    </div>
</template>