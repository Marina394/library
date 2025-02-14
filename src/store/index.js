import { createStore } from "vuex";


export const actionTypes = {
    UPDATE_GLOBAL_VARIABLE: "UPDATE_GLOBAL_VARIABLE",
    UPDATE_GLOBAL_VARIABLES: "UPDATE_GLOBAL_VARIABLES",
    FETCH_GLOBAL_VARIABLES: "FETCH_GLOBAL_VARIABLES"
};

export const mutationTypes = {
    SET_GLOBAL_VARIABLES: "SET_GLOBAL_VARIABLES",
    SET_GLOBAL_VARIABLE: "SET_GLOBAL_VARIABLE"
};

export const getterTypes = {
    GET_GLOBAL_VARIABLES: "GET_GLOBAL_VARIABLES",
    GET_GLOBAL_VARIABLE: "GET_GLOBAL_VARIABLE"
};


export const globalVariableStore = createStore({
    state: {
        globalVariables: {
            "systemState": { "type": "bool", "value": false },
            "temperature": { "type": "float", "value": 22.5 }
        }
    },
    actions: {
        [actionTypes.UPDATE_GLOBAL_VARIABLE]: ({ commit }, { variableName, newValue }) => {
            commit(mutationTypes.SET_GLOBAL_VARIABLE, { variableName, newValue });
        },
        [actionTypes.UPDATE_GLOBAL_VARIABLES]: ({ commit }, variables) => {
            commit(mutationTypes.SET_GLOBAL_VARIABLES, variables);
        },
        [actionTypes.FETCH_GLOBAL_VARIABLES]: async ({ commit }) => {
            // Здесь может быть HTTP запрос для инициализации или обновления переменных
            // Для демонстрации примем, что данные приходят напрямую
            const variables = {
                "systemState": { "type": "bool", "value": true },
                "temperature": { "type": "float", "value": 24.1 }
            };
            commit(mutationTypes.SET_GLOBAL_VARIABLES, variables);
        }
    },
    mutations: {
        [mutationTypes.SET_GLOBAL_VARIABLES]: (state, variables) => {
            state.globalVariables = variables;
        },
        [mutationTypes.SET_GLOBAL_VARIABLE]: (state, { variableName, newValue }) => {
            if (state.globalVariables[variableName]) {
                state.globalVariables[variableName].value = newValue;
            }
        }
    },
    getters: {
        [getterTypes.GET_GLOBAL_VARIABLES]: (state) => state.globalVariables,
        [getterTypes.GET_GLOBAL_VARIABLE]: (state) => (variableName) => {
            return state.globalVariables[variableName] ? state.globalVariables[variableName].value : null;
        }
    }
});
