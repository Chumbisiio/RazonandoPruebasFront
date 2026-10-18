<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { authService } from '../../services/authService';
import { courseService } from '../../services/courseService';
import { formatDate, getErrorMessage, isAdminRole } from '../../services/courseUtils';
import { getAvailableRoles, getStoredAuthResponse } from '../../services/roleService';
import CourseDetailsForm from './CourseDetailsForm.vue';
import CourseStructure from './CourseStructure.vue';
import InlineForm from './InlineForm.vue';

const route = useRoute();
const router = useRouter();

const courseId = route.params.courseId;
// Rol activo validado contra los roles reales del usuario
const availableRoles = getAvailableRoles(getStoredAuthResponse()?.roles);
const storedRole = localStorage.getItem('activeRole');
const activeRole = availableRoles.find((option) => option.id === storedRole) || availableRoles[0];
const role = activeRole?.id || 'student';
const isAdmin = isAdminRole(role);
// Cada rol tiene una ruta con su mismo nombre (student, teacher, admin, superadmin)
const backRoute = { name: activeRole?.routeName || 'role-selection' };

const detail = ref(null);
const isLoading = ref(true);
const errorMessage = ref('');
const actionError = ref('');
const isRenaming = ref(false);
const isBusy = ref(false);

const course = computed(() => detail.value?.course);
// Cualquier estado distinto de PUBLISHED se trata como borrador
const isPublished = computed(() => course.value?.state === 'PUBLISHED');
const isDraft = computed(() => !isPublished.value);

// Aviso según la fase del curso (se calcula en el backend con las fechas)
const phaseNotice = computed(() => {
    const c = course.value;
    if (!c || isDraft.value) return null;
    if (c.phase === 'NOT_STARTED') {
        return {
            tone: 'info',
            text: isAdmin || role === 'teacher'
                ? `El curso empieza el ${formatDate(c.startDate)}.`
                : `Estás inscrito. El curso empieza el ${formatDate(c.startDate)}.`,
        };
    }
    if (c.phase === 'FINISHED') {
        return { tone: 'muted', text: `Este curso finalizó el ${formatDate(c.endDate)}.` };
    }
    return null;
});

const load = async () => {
    errorMessage.value = '';
    try {
        detail.value = await courseService.getCourseDetail(courseId);
    } catch (error) {
        if (error.response?.status === 401) {
            authService.logout();
            await router.replace({ name: 'login' });
            return;
        }
        errorMessage.value = getErrorMessage(error, 'No se pudo cargar el curso.');
    } finally {
        isLoading.value = false;
    }
};

// Recarga en silencio tras editar, para no parpadear con el mensaje de carga
const reload = () => load();

const rename = async ({ name }) => {
    isBusy.value = true;
    actionError.value = '';
    try {
        await courseService.renameCourse(courseId, name);
        isRenaming.value = false;
        await reload();
    } catch (error) {
        actionError.value = getErrorMessage(error, 'No se pudo renombrar el curso.');
    } finally {
        isBusy.value = false;
    }
};
const removeCourse = async () => {
    if (!window.confirm(`¿Eliminar el curso "${course.value.name}" con todas sus materias, módulos y temas? Esta acción no se puede deshacer.`)) return;

    isBusy.value = true;
    actionError.value = '';
    try {
        await courseService.deleteCourse(courseId);
        await router.replace(backRoute);
    } catch (error) {
        actionError.value = getErrorMessage(error, 'No se pudo eliminar el curso.');
        isBusy.value = false;
    }
};

const scrollToPublish = () => {
    document.getElementById('publicar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

onMounted(load);
</script>

<template>
    <main class="min-h-[calc(100vh-4rem)] bg-[#f5f8f4] px-6 py-8 xl:px-20">
        <div class="mx-auto max-w-5xl space-y-8">
            <RouterLink
                :to="backRoute"
                class="inline-flex items-center gap-2 text-lg font-bold text-secondary transition hover:text-primary"
            >
                <icon-bi-arrow-left width="18" height="18" aria-hidden="true" /> Volver a cursos
            </RouterLink>

            <p v-if="isLoading" class="text-lg text-slate-600" role="status">Cargando curso...</p>

            <div
                v-else-if="errorMessage"
                role="alert"
                class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-base text-red-900"
            >
                <span>{{ errorMessage }}</span>
                <button
                    type="button"
                    class="rounded-lg bg-secondary px-4 py-2 font-bold text-white transition hover:bg-primary"
                    @click="load"
                >
                    Reintentar
                </button>
            </div>

            <template v-else-if="course">
                <!-- Encabezado -->
                <header class="space-y-3">
                    <div class="flex flex-wrap items-center gap-3">
                        <InlineForm
                            v-if="isRenaming"
                            class="w-full max-w-md"
                            name-placeholder="Nombre del curso"
                            :initial-name="course.name"
                            :busy="isBusy"
                            @submit="rename"
                            @cancel="isRenaming = false"
                        />
                        <template v-else>
                            <h1 class="m-0! text-4xl font-bold text-secondary md:text-5xl">{{ course.name }}</h1>
                            <span
                                class="rounded-full px-3 py-1 text-sm font-bold"
                                :class="isDraft ? 'bg-amber-100 text-amber-900' : 'bg-[#e8f2e5] text-secondary'"
                            >
                                {{ isDraft ? 'Borrador' : 'Publicado' }}
                            </span>
                            <button
                                v-if="isAdmin"
                                type="button"
                                class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-[#e8f2e5] hover:text-secondary"
                                aria-label="Renombrar curso"
                                @click="isRenaming = true"
                            >
                                <icon-bi-pencil width="16" height="16" />
                            </button>
                                                        <button
                                v-if="isAdmin"
                                type="button"
                                class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-700"
                                aria-label="Eliminar curso"
                                :disabled="isBusy"
                                @click="removeCourse"
                            >
                                <icon-bi-trash width="16" height="16" />
                            </button>
                        </template>
                    </div>

                    <p v-if="course.description" class="max-w-3xl text-lg leading-snug text-slate-600">
                        {{ course.description }}
                    </p>

                    <dl v-if="course.startDate" class="grid gap-x-8 gap-y-1 text-base text-slate-600 sm:grid-cols-2">
                        <div class="flex gap-2">
                            <dt class="font-bold text-secondary">Inscripciones:</dt>
                            <dd>{{ formatDate(course.registrationStartDate) }} – {{ formatDate(course.registrationEndDate) }}</dd>
                        </div>
                        <div class="flex gap-2">
                            <dt class="font-bold text-secondary">Curso:</dt>
                            <dd>{{ formatDate(course.startDate) }} – {{ formatDate(course.endDate) }}</dd>
                        </div>
                    </dl>
                </header>

                <p
                    v-if="phaseNotice"
                    role="status"
                    class="flex items-start gap-3 rounded-xl border px-4 py-3 text-lg"
                    :class="phaseNotice.tone === 'info'
                        ? 'border-[#c9dec5] bg-[#e8f2e5] text-secondary'
                        : 'border-slate-200 bg-slate-100 text-slate-700'"
                >
                    <icon-bi-calendar-event width="20" height="20" aria-hidden="true" class="mt-0.5 shrink-0" />
                    {{ phaseNotice.text }}
                </p>

                <div
                    v-if="isDraft && isAdmin"
                    role="status"
                    class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-lg text-amber-900"
                >
                    <span>
                        Este curso es un borrador: los estudiantes no pueden verlo. Arma la estructura, luego
                        define la descripción y las fechas, y pulsa <strong>Publicar curso</strong>.
                    </span>
                    <button
                        type="button"
                        class="rounded-lg bg-secondary px-4 py-2 text-base font-bold text-white transition hover:bg-primary"
                        @click="scrollToPublish"
                    >
                        Ir a descripción y fechas
                    </button>
                </div>

                <p
                    v-if="actionError"
                    role="alert"
                    class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-base text-red-900"
                >
                    {{ actionError }}
                </p>

                <!-- Estructura -->
                <section>
                    <h2 class="text-3xl! font-bold text-secondary">Estructura del curso</h2>
                    <p class="mb-5 text-lg text-slate-600">
                        <template v-if="isAdmin">
                            Define las materias, sus módulos y los temas de cada módulo. El contenido de cada tema
                            lo sube el profesor asignado.
                        </template>
                        <template v-else>Materias, módulos y temas del curso.</template>
                    </p>
                    <CourseStructure
                        :course-id="course.id"
                        :subjects="detail.subjects"
                        :editable="isAdmin"
                        @changed="reload"
                    />
                </section>

                <!-- Descripción, fechas y publicación (solo administración) -->
                <section v-if="isAdmin" id="publicar">
                    <h2 class="text-3xl! font-bold text-secondary">Descripción, fechas y publicación</h2>
                    <p class="mb-5 text-lg text-slate-600">
                        Se habilitan cuando el curso tiene su estructura completa.
                    </p>
                    <CourseDetailsForm
                        :course="course"
                        :structure-complete="detail.structureComplete"
                        :is-published="isPublished"
                        @saved="reload"
                    />
                </section>
            </template>
        </div>
    </main>
</template>