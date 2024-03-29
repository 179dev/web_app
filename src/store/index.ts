import { defineStore } from "pinia";
import { fabric } from "fabric";

import Password from "@/utils/password";
import { IUser } from "@/shared/interfaces";


interface IUserIdInConference {
  conferenceId: string
  id: string
  role?: number
}


export const useCounterStore = defineStore("counter", {
    state: () => ({ count: 0 }),
    getters: {
        double: state => state.count * 2,
    },
    actions: {
        increment() {
            this.count++;
        },
    },
});

export const useUserStore = defineStore("user", {
    state: () => {
        return {
            user: undefined as IUser | undefined,
            newUser: undefined as IUser | undefined,
            idInConference: [] as IUserIdInConference[],
        };
    }
});

export const useFormStateStore = defineStore("form-state", {
    state: () => {
        return {
            isInteracted: false as boolean,
            emailIsGiven: false as boolean,
            emailIsValid: false as boolean,
            passwordIsGiven: false as boolean,
            passwordIsRepeated: false as boolean,
        };
    }
});

export const useAuthorizationStore = defineStore("authorization", {
    state: () => {
        return {
            password: null as Password | null,
            passwordRepeat: null as Password | null,
        };
    },
});

export const useCanvasStore = defineStore("canvas", {
    state: () => {
        return {
            currentShape: {} as fabric.Line | fabric.Rect | fabric.Ellipse | fabric.IText,
            additionalShapes: [] as (fabric.Triangle | fabric.Circle)[],
        };
    },
});

export const useCanvasStateStore = defineStore("canvas-state", {
    state: () => {
        return {
            isDrawing: false as boolean,
        };
    },
});
