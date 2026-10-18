<script setup>
import { ref } from 'vue';

const props = defineProps({
    namePlaceholder: { type: String, required: true },
    // Si se define, se muestra un segundo campo de texto (descripción o resumen)
    secondPlaceholder: { type: String, default: '' },
    initialName: { type: String, default: '' },
    initialSecond: { type: String, default: '' },
    submitLabel: { type: String, default: 'Guardar' },
    busy: { type: Boolean, default: false },
    // Si se define (aunque esté vacía), se muestra la lista desplegable para elegir profesor
    teachers: { type: Array, default: null },
});

const emit = defineEmits(['submit', 'cancel']);

const name = ref(props.initialName);
const second = ref(props.initialSecond);
const teacherId = ref(null);

const submit = () => {
    const trimmedName = name.value.trim();
    if (!trimmedName) return;
    emit('submit', { name: trimmedName, second: second.value.trim(), teacherId: teacherId.value });
};
</script>

<template>
    <form
        class="flex flex-col gap-2 rounded-xl border border-[#c9dec5] bg-[#f5f8f4] p-3"
        @submit.prevent="submit"
        @keydown.esc="emit('cancel')"
    >
        <input
            v-model="name"
            type="text"
            maxlength="50"
            required
            autofocus
            :placeholder="namePlaceholder"
            :aria-label="namePlaceholder"
            class="w-full rounded-lg border border-[#c9dec5] bg-white px-3 py-2 text-lg text-slate-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
        <textarea
            v-if="secondPlaceholder"
            v-model="second"
            rows="2"
            maxlength="2000"
            :placeholder="secondPlaceholder"
            :aria-label="secondPlaceholder"
            class="w-full resize-y rounded-lg border border-[#c9dec5] bg-white px-3 py-2 text-lg text-slate-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
        <select
            v-if="teachers"
            v-model="teacherId"
            aria-label="Profesor de la materia"
            class="w-full rounded-lg border border-[#c9dec5] bg-white px-3 py-2 text-lg text-slate-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
        >
            <option :value="null">Sin profesor asignado</option>
            <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                {{ teacher.names }} {{ teacher.surNames }}
            </option>
        </select>
        <div class="flex justify-end gap-2">
            <button
                type="button"
                class="rounded-lg px-4 py-1.5 text-base font-bold text-slate-600 transition hover:bg-white"
                @click="emit('cancel')"
            >
                Cancelar
            </button>
            <button
                type="submit"
                :disabled="busy || !name.trim()"
                class="rounded-lg bg-secondary px-4 py-1.5 text-base font-bold text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
                {{ busy ? 'Guardando...' : submitLabel }}
            </button>
        </div>
    </form>
</template>