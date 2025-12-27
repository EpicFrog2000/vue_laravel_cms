import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        authorized: false,
    }),
    actions: {
        login() {
            this.authorized = true;
        },
        logout() {
            this.authorized = false;
        },
    },
});
