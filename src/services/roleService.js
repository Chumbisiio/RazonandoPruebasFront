const roleOptions = [
    {
        id: 'student',
        routeName: 'student',
        label: 'Estudiante',
        description: 'Explora tus cursos y continúa aprendiendo.',
    },
    {
        id: 'teacher',
        routeName: 'teacher',
        label: 'Profesor',
        description: 'Comparte contenido y acompaña a tus estudiantes.',
    },
    {
        id: 'admin',
        routeName: 'admin',
        label: 'Administrador',
        description: 'Gestiona la plataforma y sus usuarios.',
    },
    {
        id: 'superadmin',
        routeName: 'superadmin',
        label: 'Superadministrador',
        description: 'Administra la configuración global de Razonando.',
    },
];

const roleAliases = {
    ESTUDIANTE: 'student',
    STUDENT: 'student',
    PROFESOR: 'teacher',
    TEACHER: 'teacher',
    ADMIN: 'admin',
    ADMINISTRADOR: 'admin',
    SUPERADMIN: 'superadmin',
    SUPER_ADMIN: 'superadmin',
    SUPERADMINISTRADOR: 'superadmin',
    SUPER_ADMINISTRADOR: 'superadmin',
    SUPER_ADMINISTRATOR: 'superadmin',
};

const normalizeRole = (role) => {
    if (typeof role !== 'string') return null;

    const normalized = role
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toUpperCase()
        .replace(/^ROLE[_\s-]*/, '')
        .replace(/[\s-]+/g, '_');

    return roleAliases[normalized] || null;
};

export const getAvailableRoles = (roles) => {
    if (!Array.isArray(roles)) return [];

    const availableIds = new Set(roles.map(normalizeRole).filter(Boolean));
    return roleOptions.filter((role) => availableIds.has(role.id));
};

export const getStoredAuthResponse = () => {
    const storedResponse = localStorage.getItem('authResponse');
    if (!storedResponse) return null;

    try {
        return JSON.parse(storedResponse);
    } catch {
        localStorage.removeItem('authResponse');
        localStorage.removeItem('token');
        localStorage.removeItem('typeToken');
        localStorage.removeItem('activeRole');
        return null;
    }
};

export const setActiveRole = (roleId) => {
    const roles = getAvailableRoles(getStoredAuthResponse()?.roles);
    if (!roles.some((role) => role.id === roleId)) return false;

    localStorage.setItem('activeRole', roleId);
    return true;
};

export const clearActiveRole = () => {
    localStorage.removeItem('activeRole');
};
