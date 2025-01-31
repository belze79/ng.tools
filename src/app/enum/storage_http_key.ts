export enum RequestUrl{
    TEST_DB_URL = "https://bktools.up.railway.app",
    DB_URL = "https://login-pr.up.railway.app",
}

export enum StorageKey{
    ACCESS_TOKEN = "accessToken",
    REFRESH_TOKEN = "refreshToken",
    USERNAME = "username",
    ROLE = "role",
    THEME = 'theme',
    LANG = "language",
    LOGIN = "isLogged",
    GAMEWORLD = 'gameworld',
    INACTIVE_GAMEWORLDS = 'inactiveGameworlds'
}

export enum RequestParam{
    USERNAME = "username",
    EMAIL = 'email',
    PASSWORD = 'psw',
    TOKEN = 'token',
    ACCESS_TOKEN = "accessToken",
    REFRESH_TOKEN = "refreshToken"
}

export enum ErrorResponse{
    EXISTS_EMAIL = 'EXISTS_EMAIL',
    INVALID_EMAIL = 'INVALID_EMAIL',
    EXISTS_USERNAME = 'EXISTS_USERNAME',
    INVALID_USERNAME = 'INVALID_USERNAME',
    SHORT_PSW = 'SHORT_PSW',
    INVALID_PSW = 'INVALID_PSW',
    INVALID_TOKEN = 'INVALID_TOKEN',
    NO_MATCH = 'NO_MATCH',
    NO_AUTHORIZATION = 'NO_AUTHORIZATION',
    SERVER_ERROR = 'SERVER_ERROR',
}

export enum IndexedDbKey{
    DB_NAME = 'TravianData',
    VERSION = 1,
    GAME_WORLD_DATA = 'GameWorldData',
    PLAN_DATA = 'PlanData',
    SPY_DATA = 'SpyData'
}
