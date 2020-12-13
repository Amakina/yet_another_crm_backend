module.exports = {
    HOST: 'localhost',
    USER: 'root',
    PASSWORD: '',
    DB: 'yet_another_crm',

    SECRET_KEY: 'SECRET_KEY',

    ROLES: {
        ADMIN: 3,
        MANAGER: 2,
        USER: 1,
    },

    ERRORS: {
        UNKNOWN: 'Что-то пошло не так :(',
        USER_EXISTS: 'Пользователь с этим email уже зарегистирован',
        COMPANY_EXISTS: 'Компания с данных ОГРН уже зарегистирована',
        EMAIL_NOT_FOUND: 'Пользователя с таким email не существует',
        INCORRECT_PASSWORD: 'Неверный пароль',
    }
}