// Utilidades compartidas por las vistas de cursos

const MONTHS = ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sept.', 'oct.', 'nov.', 'dic.'];

// "15 de nov. de 2026"
export const formatDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    return `${date.getDate()} de ${MONTHS[date.getMonth()]} de ${date.getFullYear()}`;
};

const timeFormatter = new Intl.DateTimeFormat('es-CO', { hour: 'numeric', minute: '2-digit' });

// "15 de nov. de 2026, 8:00 a. m."
export const formatDateTime = (value) => (value ? `${formatDate(value)}, ${timeFormatter.format(new Date(value))}` : null);

// El backend devuelve "2026-10-20T08:00:00"; <input type="datetime-local"> espera "2026-10-20T08:00"
export const toInputDateTime = (value) => (value ? String(value).slice(0, 16) : '');

export const getErrorMessage = (error, fallback) => {
    const data = error.response?.data;
    if (data?.errors && typeof data.errors === 'object') {
        const first = Object.values(data.errors)[0];
        if (first) return first;
    }
    return data?.message
        || (error.response ? fallback : 'No fue posible conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.');
};

export const isAdminRole = (role) => role === 'admin' || role === 'superadmin';