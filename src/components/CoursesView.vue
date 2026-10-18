<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/authService';
import { courseService } from '../services/courseService';
import { getErrorMessage } from '../services/courseUtils';
import CoursesSection from './CoursesComponents/CoursesSection.vue';
import CreateCourseForm from './CoursesComponents/CreateCourseForm.vue';
import EnrollModal from './CoursesComponents/EnrollModal.vue';

const props = defineProps({
    // 'student' | 'teacher' | 'admin' | 'superadmin'
    role: { type: String, required: true },
});

const router = useRouter();
const isStudent = props.role === 'student';
const canCreateCourses = props.role === 'admin' || props.role === 'superadmin';

const myCourses = ref([]);
const openCourses = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');
const actionError = ref('');
const courseToEnroll = ref(null);

const staffSubtitles = {
    teacher: 'Cursos en los que tienes materias asignadas.',
    admin: 'Todos los cursos de la plataforma.',
    superadmin: 'Todos los cursos de la plataforma.',
};

const loadCourses = async () => {
    isLoading.value = true;
    errorMessage.value = '';

    try {
        if (isStudent) {
            const [mine, open] = await Promise.all([
                courseService.getStudentCourses(),
                courseService.getOpenCourses(),
            ]);
            myCourses.value = mine;
            openCourses.value = open;
        } else {
            myCourses.value = await courseService.getStaffCourses(props.role);
        }
    } catch (error) {
        // Sesión vencida: volvemos al login
        if (error.response?.status === 401) {
            authService.logout();
            await router.replace({ name: 'login' });
            return;
        }

        errorMessage.value = error.response?.data?.message
            || (error.response
                ? 'No se pudieron cargar los cursos.'
                : 'No fue posible conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.');
    } finally {
        isLoading.value = false;
    }
};

const removeCourse = async (course) => {
    actionError.value = '';
    if (!window.confirm(`¿Eliminar el curso "${course.name}"? Esta acción no se puede deshacer.`)) return;

    try {
        await courseService.deleteCourse(course.id);
        await loadCourses();
    } catch (error) {
        actionError.value = getErrorMessage(error, 'No se pudo eliminar el curso.');
    }
};

const onEnrolled = async () => {
    courseToEnroll.value = null;
    await loadCourses();
};

onMounted(loadCourses);
</script>

<template>
    <main class="min-h-[calc(100vh-4rem)] bg-[#f5f8f4] px-6 py-8 xl:px-20">
        <div class="mx-auto max-w-7xl space-y-10">
            <header>
                <p class="text-sm font-bold uppercase tracking-[0.18em] text-primary">Razonando</p>
                <h1 class="mt-1! mb-0! text-4xl font-bold text-secondary md:text-5xl">
                    {{ isStudent ? 'Tus cursos' : 'Cursos' }}
                </h1>
            </header>

            <CreateCourseForm v-if="canCreateCourses" />

            <p
                v-if="actionError"
                role="alert"
                class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-base text-red-900"
            >
                {{ actionError }}
            </p>

            <p v-if="isLoading" class="text-lg text-slate-600" role="status">Cargando cursos...</p>

            <div
                v-else-if="errorMessage"
                role="alert"
                class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-base text-red-900"
            >
                <span>{{ errorMessage }}</span>
                <button
                    type="button"
                    class="rounded-lg bg-secondary px-4 py-2 font-bold text-white transition hover:bg-primary"
                    @click="loadCourses"
                >
                    Reintentar
                </button>
            </div>

            <template v-else-if="isStudent">
                <CoursesSection
                    title="Tus cursos"
                    :courses="myCourses"
                    empty-message="Todavía no estás inscrito en ningún curso."
                />
                <CoursesSection
                    title="Cursos en inscripción"
                    subtitle="Cursos con inscripciones abiertas en este momento."
                    :courses="openCourses"
                    :linkable="false"
                    selectable
                    empty-message="Por ahora no hay cursos con inscripciones abiertas."
                    @select="courseToEnroll = $event"
                />
            </template>

            <CoursesSection
                v-else
                title="Cursos"
                :subtitle="staffSubtitles[role]"
                :courses="myCourses"
                :deletable="canCreateCourses"
                empty-message="Aún no hay cursos para mostrar."
                @delete="removeCourse"
            />
        </div>

        <EnrollModal
            v-if="courseToEnroll"
            :course="courseToEnroll"
            @close="courseToEnroll = null"
            @enrolled="onEnrolled"
        />
    </main>
</template>