import api from "../api/axios";

// La BD de Neon puede tardar en "despertar", así que damos más margen que el valor por defecto
const requestConfig = { timeout: 15000 };

const staffEndpoints = {
    teacher: 'api/teacher/courses',
    admin: 'api/admin/courses',
    superadmin: 'api/admin/courses',
};

export const courseService = {
    // Cursos en los que el estudiante está inscrito
    async getStudentCourses() {
        const { data } = await api.get('api/student/courses', requestConfig);
        return data;
    },

    // Cursos con inscripciones abiertas en los que el estudiante aún no está
    async getOpenCourses() {
        const { data } = await api.get('api/student/courses/open', requestConfig);
        return data;
    },

    // Inscribirse en un curso con inscripciones abiertas
    async enrollInCourse(courseId) {
        await api.post(`api/student/courses/${courseId}/enroll`, null, requestConfig);
    },

    // Cursos para profesor, administrador y superadministrador
    async getStaffCourses(role) {
        const endpoint = staffEndpoints[role];
        if (!endpoint) throw new Error(`Rol sin listado de cursos: ${role}`);

        const { data } = await api.get(endpoint, requestConfig);
        return data;
    },

    // Detalle: { course, structureComplete, subjects: [{ courseSubjectId, name, description, teacher, modules: [{ id, name, summary, topics: [{ id, name }] }] }] }
    async getCourseDetail(courseId) {
        const { data } = await api.get(`api/courses/${courseId}`, requestConfig);
        return data;
    },

    // ---------- Administración (admin y superadmin) ----------

    async createCourse(name) {
        const { data } = await api.post('api/admin/courses', { name }, requestConfig);
        return data;
    },

    async renameCourse(courseId, name) {
        await api.put(`api/admin/courses/${courseId}`, { name }, requestConfig);
    },

    // { description, registrationStartDate, registrationEndDate, startDate, endDate }
    async updateDetails(courseId, details) {
        await api.put(`api/admin/courses/${courseId}/details`, details, requestConfig);
    },

    async publishCourse(courseId) {
        await api.post(`api/admin/courses/${courseId}/publish`, null, requestConfig);
    },

    async deleteCourse(courseId) {
        await api.delete(`api/admin/courses/${courseId}`, requestConfig);
    },

    // Profesores
    async getTeachers() {
        const { data } = await api.get('api/admin/teachers', requestConfig);
        return data;
    },
    async assignTeacher(courseSubjectId, teacherId) {
        await api.put(`api/admin/course-subjects/${courseSubjectId}/teacher`, { teacherId }, requestConfig);
    },

    // Materias
    async addSubject(courseId, { name, description, teacherId }) {
        await api.post(`api/admin/courses/${courseId}/subjects`, { name, description, teacherId }, requestConfig);
    },
    async updateSubject(courseSubjectId, { name, description }) {
        await api.put(`api/admin/course-subjects/${courseSubjectId}`, { name, description }, requestConfig);
    },
    async deleteSubject(courseSubjectId) {
        await api.delete(`api/admin/course-subjects/${courseSubjectId}`, requestConfig);
    },

    // Módulos
    async addModule(courseSubjectId, { name, summary }) {
        await api.post(`api/admin/course-subjects/${courseSubjectId}/modules`, { name, summary }, requestConfig);
    },
    async updateModule(moduleId, { name, summary }) {
        await api.put(`api/admin/modules/${moduleId}`, { name, summary }, requestConfig);
    },
    async deleteModule(moduleId) {
        await api.delete(`api/admin/modules/${moduleId}`, requestConfig);
    },

    // Temas
    async addTopic(moduleId, name) {
        await api.post(`api/admin/modules/${moduleId}/topics`, { name }, requestConfig);
    },
    async updateTopic(topicId, name) {
        await api.put(`api/admin/topics/${topicId}`, { name }, requestConfig);
    },
    async deleteTopic(topicId) {
        await api.delete(`api/admin/topics/${topicId}`, requestConfig);
    },
};