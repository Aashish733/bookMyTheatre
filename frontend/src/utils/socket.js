import { io } from 'socket.io-client';

const serverUrl =
    import.meta.env.VITE_SERVER_URL ||
    import.meta.env.VITE_BACKEND_URL?.replace(/\/api\/v1\/?$/, '') ||
    'http://localhost:8000';

export const socket = io(serverUrl);