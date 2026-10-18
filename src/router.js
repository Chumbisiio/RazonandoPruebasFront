import { createRouter, createWebHistory } from 'vue-router';
import AboutRazonando from './components/AboutRazonando.vue';
import LoginView from './components/LoginView.vue';
import RegisterView from './components/RegisterView.vue';
import StudentMainView from './components/StudentMainView.vue';
import TeacherMainView from './components/TeacherMainView.vue';
import AdminMainView from './components/AdminMainView.vue';
import SuperAdminMainView from './components/SuperAdminMainView.vue';
import RoleSelectionView from './components/RoleSelectionView.vue';
import { clearActiveRole, getAvailableRoles, getStoredAuthResponse, setActiveRole } from './services/roleService';
import CourseDetailView from './components/CoursesComponents/CourseDetailView.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'home', component: AboutRazonando, meta: { layout: 'home' } },
        { path: '/login', name: 'login', component: LoginView },
        { path: '/registro', name: 'register', component: RegisterView },
        { path: '/elegir-rol', name: 'role-selection', component: RoleSelectionView },
        { path: '/estudiante', name: 'student', component: StudentMainView, meta: { layout: 'main', requiredRole: 'student' } },
        { path: '/profesor', name: 'teacher', component: TeacherMainView, meta: { layout: 'main', requiredRole: 'teacher' } },
        { path: '/admin', name: 'admin', component: AdminMainView, meta: { layout: 'main', requiredRole: 'admin' } },
        { path: '/superadmin', name: 'superadmin', component: SuperAdminMainView, meta: { layout: 'main', requiredRole: 'superadmin' } },
        { path: '/cursos/:courseId', name: 'course-detail', component: CourseDetailView, meta: { layout: 'main', requiresAuth: true } },
        { path: '/:pathMatch(.*)*', redirect: { name: 'home' } },
    ],
});

router.beforeEach((to) => {
    
    if (to.meta.requiresAuth) {
    const authResponse = getStoredAuthResponse();
    if (!authResponse?.token) return { name: 'login' };

    const roles = getAvailableRoles(authResponse.roles);
    const activeRole = localStorage.getItem('activeRole');
    return roles.some((role) => role.id === activeRole) ? true : { name: 'role-selection' };
}
    if (!to.meta.requiredRole && to.name !== 'role-selection') return true;

    const authResponse = getStoredAuthResponse();
    if (!authResponse?.token) return { name: 'login' };

    const roles = getAvailableRoles(authResponse.roles);
    if (to.name === 'role-selection') {
        clearActiveRole();
        if (roles.length === 1) {
            setActiveRole(roles[0].id);
            return { name: roles[0].routeName };
        }
        return true;
    }

    const requestedRole = roles.find((role) => role.id === to.meta.requiredRole);
    if (!requestedRole) {
        return roles.length ? { name: 'role-selection' } : { name: 'login' };
    }

    setActiveRole(requestedRole.id);
    return true;
});

export default router;
