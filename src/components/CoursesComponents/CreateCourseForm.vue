<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { courseService } from '../../services/courseService';
import { getErrorMessage } from '../../services/courseUtils';
import InlineForm from './InlineForm.vue';

const router = useRouter();
const isOpen = ref(false);
const isSaving = ref(false);
const errorMessage = ref('');

const create = async ({ name }) => {
    isSaving.value = true;
    errorMessage.value = '';
    try {
        const course = await courseService.createCourse(name);
        // El curso nace como borrador: se lleva al administrador a definir su estructura
        await router.push({ name: 'course-detail', params: { courseId: course.id } });
    } catch (error) {
        errorMessage.value = getErrorMessage(error, 'No se pudo crear el curso.');
    } finally {
        isSaving.value = false;
    }
};
</script>

<template>
    <div class="w-full max-w-md">
        <InlineForm
            v-if="isOpen"
            name-placeholder="Nombre del curso (ej. Preuniversitario)"
            submit-label="Crear borrador"
            :busy="isSaving"
            @submit="create"
            @cancel="isOpen = false"
        />
        <button
            v-else
            type="button"
            class="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-3 text-lg font-bold text-white transition hover:bg-primary"
            @click="isOpen = true"
        >
            <icon-bi-plus-lg width="16" height="16" aria-hidden="true" /> Crear curso
        </button>
        <p v-if="errorMessage" role="alert" class="mt-2 text-base text-red-800">{{ errorMessage }}</p>
    </div>
</template>