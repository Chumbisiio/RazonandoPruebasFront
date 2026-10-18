<script setup>
import CourseCard from './CourseCard.vue';

defineProps({
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    courses: { type: Array, required: true },
    emptyMessage: { type: String, required: true },
    linkable: { type: Boolean, default: true },
    selectable: { type: Boolean, default: false },
    deletable: { type: Boolean, default: false },
});

const emit = defineEmits(['delete', 'select']);
</script>

<template>
    <section>
        <h2 class="text-3xl! font-bold text-secondary">{{ title }}</h2>
        <p v-if="subtitle" class="mb-5 text-lg text-slate-600">{{ subtitle }}</p>

        <div v-if="courses.length" class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <CourseCard
                v-for="course in courses"
                :key="course.id"
                :course="course"
                :linkable="linkable"
                :selectable="selectable"
                :deletable="deletable"
                @select="emit('select', $event)"
                @delete="emit('delete', $event)"
            />
        </div>

        <p
            v-else
            class="rounded-2xl border border-dashed border-[#c9dec5] bg-white/60 px-5 py-8 text-center text-lg text-slate-600"
        >
            {{ emptyMessage }}
        </p>
    </section>
</template>