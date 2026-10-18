const fieldLabels = {
    documentType: 'Tipo de documento',
    email: 'Correo electrónico',
    idNumber: 'Número de documento',
    names: 'Nombres',
    nickname: 'Nombre de usuario',
    password: 'Contraseña',
    surNames: 'Apellidos',
};

export const getApiErrorFieldLabel = (field) => fieldLabels[field] || field;
