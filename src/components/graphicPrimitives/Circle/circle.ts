import {fabric} from 'fabric';
import {globalVariableStore} from "@/store/index.js";
import {watch} from "vue";

export class CircleShape extends fabric.Circle {
    private canvas: any;
    private dynamicFunction: Function | null = null;
    private blocklyWorkspace: any = null;

    private eventHandlers: Record<string, any> = {
        moving: null,
        scaling: null,
        rotating: null,
        skewing: null,
        resizing: null,
        mouseup: null,
        mousedown: null,
        mousemove: null,
        mousedblclick: null,
        mousewheel: null,
        mouseover: null,
        mouseout: null,
        drop: null,
        dragover: null,
        dragenter: null,
        dragleave: null,
        modified: null,
        over: null,
    };
    private properties: string[] = [
        "left",
        "top",
        "fill"
    ];

    constructor(canvas: any, x: number, y: number) {
        super({
            radius: 30,
            fill: 'rgba(255, 0, 0, 0)',
            stroke: 'rgba(0, 0, 0, 1)',
            strokeWidth: 1,
            strokeUniform: true,
            left: x,
            top: y,
        });
        this.canvas = canvas;
        this.canvas.add(this);
        this.canvas.requestRenderAll();

        // биндим event handler ко всем event'ам
        Object.keys(this.eventHandlers).forEach(key => {
            this.on(key, (options: any) => {
                // Оборачиваем вызов handleEvent в анонимную асинхронную функцию
                (async () => {
                    await this.handleEvent(key, options);
                })();
            });
        });

        watch(() => globalVariableStore.getters['GET_GLOBAL_VARIABLES'], (newVal, oldVal) => {
            let params = this.simplifyParams(newVal);
            // Аналогично, оборачиваем вызов в асинхронную функцию
            (async () => {
                if (this.dynamicFunction) {
                    let props = this.getPropertiesAsDictionary()
                    let combinedParams = {...params, ...props};
                    let result = await this.dynamicFunction.call(this, combinedParams);
                    for (const key in result) {
                        const value = result[key];
                        if (value) {
                            this.set(key.toLowerCase(), value);
                        }
                    }
                    this.canvas.requestRenderAll();
                }
            })();
        }, {deep: true});
    }

    public setEventHandlers(eventHandlers: Record<string, any>) {
        for (const key in this.eventHandlers) {
            this.eventHandlers[key] = null;
        }

        Object.keys(eventHandlers).forEach(eventName => {
            const eventBody = eventHandlers[eventName];

            if (this.eventHandlers.hasOwnProperty(eventName)) {
                // Обновляем создание функции, чтобы она была асинхронным генератором
                this.eventHandlers[eventName] = new Function("params", `return (async function* (params) { ${eventBody} })(params);`);
            } else {
                console.error(`Key ${eventName} does not exist in eventHandlers.`);
            }
        });
    }


    public getAllEventHandlerKeys(): string[] {
        return Object.keys(this.eventHandlers);
    }

    public getProperties(): string[] {
        return this.properties;
    }

    async handleEvent(eventName: string, options: any) {
        console.log('handleEvent start', eventName);
        if (this.eventHandlers.hasOwnProperty(eventName) && this.eventHandlers[eventName] !== null) {
            console.log('handleEvent start 1', eventName);
            const global_variables = globalVariableStore.getters['GET_GLOBAL_VARIABLES'];
            let params = this.simplifyParams(global_variables);
            let props = this.getPropertiesAsDictionary()
            let combinedParams = {...params, ...props};

            const generator = this.eventHandlers[eventName].call(this, combinedParams);
            console.log('handleEvent start 2', eventName);

            // Обработка значений, получаемых от генератора
            for await (const result of generator) {
                console.log('handleEvent', eventName, result);

                for (const key in result) {
                    const value = result[key];
                    if (value) {
                        this.set(key.toLowerCase(), value)
                    }
                }
                this.canvas.requestRenderAll();
            }
        }
    }

    toObject(propertiesToInclude: string[] = []) {
        propertiesToInclude = propertiesToInclude.concat(['dynamicFunctionSerialized', 'blocklyWorkspace']);
        // Сериализация кастомных свойств, которые нужно сохранить
        const obj = super.toObject(propertiesToInclude);
        obj.dynamicFunctionSerialized = this.dynamicFunctionSerialized;
        // Добавить другие кастомные свойства, если это необходимо
        return obj;
    }

    private simplifyParams(data: { [key: string]: any }): { [key: string]: any } {
        const simplified: { [key: string]: any } = {};
        for (const key in data) {
            simplified[key] = data[key].value;
        }
        return simplified;
    }

    public getPropertiesAsDictionary(): { [key: string]: any } {
        const dict: { [key: string]: any } = {};
        this.properties.forEach((prop) => {
            dict[prop] = this[prop as keyof CircleShape];
        });
        return dict;
    }

    setBlocklyWorkspace(state: any) {
        this.blocklyWorkspace = state;
    }

    getBlocklyWorkspace() {
        return this.blocklyWorkspace;
    }

    setDynamicFunction(funcCode: string) {
        this.dynamicFunctionSerialized = funcCode;

        this.dynamicFunction = new Function("params", `return (async function* (params) { ${funcCode} })(params);`);
    }
}


