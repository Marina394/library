<template>
  <div ref="blocklyArea" style="width: 100%; height: 100%;">
    <div ref="blocklyDiv" style="width: 100%; height: 450px; min-height:350px;"></div>
  </div>
</template>

<script>
import * as Blockly from 'blockly';
import * as javascript from "blockly/javascript";
import * as Ru from 'blockly/msg/ru';
import {globalVariableStore} from "@/store/index.js";

export default {
  name: 'BlocklyComponent',
  props: {
    shape: {
      type: Object,
      required: true
    }
  },
  mounted() {
    Blockly.setLocale(Ru);
    Blockly.setParentContainer(this.$refs.blocklyArea);

    Blockly.defineBlocksWithJsonArray([
      {
        "type": "external_variable_get",
        "message0": "%1",
        "args0": [
          {
            "type": "field_variable",
            "name": "VAR",
            "variableTypes": ["external"],
            "defaultType": "external",
            "variable": "undefined"
          }
        ],
        "output": null,
        "colour": "#4CA64C",
        "helpUrl": "%{BKY_VARIABLES_GET_HELPURL}",
        "tooltip": "%{BKY_VARIABLES_GET_TOOLTIP}",
        "extensions": ["contextMenu_variableSetterGetter"]
      },

      {
        "type": "internal_variable_set",
        "message0": "%1 = %2",
        "args0": [
          {
            "type": "field_variable",
            "name": "VAR",
            "variableTypes": ["internal"],
            "defaultType": "internal",
            "variable": "undefined"
          },
          {
            "type": "input_value",
            "name": "VALUE"
          }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#A64C4C",
        "helpUrl": "%{BKY_VARIABLES_SET_HELPURL}",
        "tooltip": "%{BKY_VARIABLES_SET_TOOLTIP}",
        "extensions": ["contextMenu_variableSetterGetter"]
      },
      {
        "type": "internal_variable_get",
        "message0": "%1",
        "args0": [
          {
            "type": "field_variable",
            "name": "VAR",
            "variableTypes": ["internal"],  // Указываем, что этот геттер предназначен только для внутренних переменных
            "defaultType": "internal",
            "variable": "undefined"
          }
        ],
        "output": null,
        "colour": "#A64C4C",
        "tooltip": "%{BKY_VARIABLES_GET_TOOLTIP}",
        "helpUrl": "%{BKY_VARIABLES_GET_HELPURL}"
      },

      {
        "type": "event",
        "message0": "%1 = %2",
        "colour": "#39292c",
        "helpUrl": "%{BKY_VARIABLES_SET_HELPURL}",
        "tooltip": "%{BKY_VARIABLES_SET_TOOLTIP}",
        "extensions": ["contextMenu_variableSetterGetter"]
      },
      {
        "type": "handler",
        "message0": "Обработчик события %1 %2 %3 %4",
        "args0": [
          {
            "type": "input_dummy"
          },
          {
            "type": "field_variable",
            "name": "NAME",
            "variable": "undefined",

            "variableTypes": ["event"],
            "defaultType": "event",
          },
          {
            "type": "input_end_row"
          },
          {
            "type": "input_statement",
            "name": "NAME"
          }
        ],
        "inputsInline": false,
        "colour": 285,
        "tooltip": "",
        "helpUrl": ""
      },
      {
        "type": "sleep",
        "message0": "Ждать %1",
        "args0": [
          {
            "type": "field_number",
            "name": "NAME",
            "value": 0
          }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 210,
        "tooltip": "",
        "helpUrl": ""
      }
    ]);


    this.workspace = Blockly.inject(this.$refs.blocklyDiv, {
      toolbox: this.createToolbox(),
      scrollbars: true,
      trashcan: true,
    });

    // Логика для преобразования кастомных блоков в код

    javascript.javascriptGenerator.forBlock['internal_variable_set'] = (block, generator) => {
      const variable_name = generator.nameDB_.getName(block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
      const value = generator.valueToCode(block, 'VALUE', javascript.Order.ASSIGNMENT) || '0';
      return `${variable_name} = ${value};\n${this.returnStatement}\n`;
    };

    javascript.javascriptGenerator['internal_variable_get'] = function(block, generator) {
      const variable_name = generator.nameDB_.getName(block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
      return [`${variable_name}`, javascript.Order.ATOMIC];
    };


    javascript.javascriptGenerator.forBlock['external_variable_get'] = (block, generator) => {
      const variable_name = generator.nameDB_.getName(block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
      return [`${variable_name}`, javascript.Order.ATOMIC];
    };

    javascript.javascriptGenerator.forBlock['handler'] = (block, generator) => {
      const event_name = generator.nameDB_.getName(block.getFieldValue('NAME'), Blockly.VARIABLE_CATEGORY_NAME);
      const statements = generator.statementToCode(block, 'NAME');
      return `addEventListener[${event_name}]: ${statements.replace(/(\r\n|\n|\r)/gm, "")}`;
    };

    javascript.javascriptGenerator.forBlock['sleep'] = (block, generator) => {
      const time = block.getFieldValue('NAME');  // Получаем время из блока
      return `await new Promise(r => setTimeout(r, ${time})); \n`;  // Генерируем код JavaScript
    };


    this.returnStatement = `yield { ${this.shape.getProperties().map(varName => `${varName}: ${varName}`).join(", ")} };`;


    // Создание переменных которые можно использовать
    const global_variables = globalVariableStore.getters['GET_GLOBAL_VARIABLES'];

    for (const variableName in global_variables) {
      if (global_variables.hasOwnProperty(variableName)) {
        this.workspace.createVariable(variableName, 'external');
      }
    }

    for (const variable of this.shape.getProperties()) {
      this.workspace.createVariable(variable, 'internal');
    }

    const eventHandlerKeys = this.shape.getAllEventHandlerKeys()
    eventHandlerKeys.forEach(key => {
      this.workspace.createVariable(key, 'event');
    });

    const state = this.shape.getBlocklyWorkspace();
    if (state) {
      Blockly.serialization.workspaces.load(state, this.workspace);
    }
  },
  methods: {
    parseAndRemoveEventListeners(code) {
      const handlers = {};

      // Разбиение исходного кода на строки
      const lines = code.split('\n');
      let i = 0;

      // Инициализация строки для исходного кода без обработчиков событий
      let parsedCode = '';

      while (i < lines.length) {
        const line = lines[i].trim();

        // Проверка, начинается ли строка с 'addEventListener'
        if (line.startsWith('addEventListener')) {
          // Извлечение названия события
          const eventNameMatch = line.match(/\[(\w+)\]/);
          if (eventNameMatch) {
            const eventName = eventNameMatch[1];

            // Извлечение тела обработчика события
            const handlerStart = line.indexOf(':') + 1;
            const handlerBody = line.slice(handlerStart).trim();

            // Добавление в словарь
            handlers[eventName] = handlerBody;
          }
        } else {
          // Добавление строки в исходный код, если это не строка с обработчиком события
          parsedCode += lines[i] + '\n';
        }

        i++;
      }

      return {
        handlers: handlers,
        parsedCode: parsedCode.trim(), // Удаление лишних переносов строк на концах
      };
    },
    saveBindings() {
      let code = javascript.javascriptGenerator.workspaceToCode(this.workspace);
      console.log(code);
      const result = this.parseAndRemoveEventListeners(code);
      console.log("-----");
      console.log("Парсинг событий:", result.handlers);
      console.log("-----");
      console.log("Очищенный код:", result.parsedCode);
      console.log("-----");
      code = result.parsedCode;
      let codeLines = code.trim().split("\n");
      codeLines.shift();
      // let varsDeclaration = `var ${this.shape.getProperties().join(" = null, ")} = null;`;
      // codeLines.unshift(varsDeclaration);

      const global_variables = globalVariableStore.getters['GET_GLOBAL_VARIABLES'];

      let externalVariables = [];
      for (const variableName in global_variables) {
        if (global_variables.hasOwnProperty(variableName)) {
          externalVariables.push(variableName);
        }
      }
      let destructuring = `let { ${this.shape.getProperties().join(", ")}, ${externalVariables.join(", ")} } = params;\n`;
      let completeCode = [destructuring, ...codeLines, this.returnStatement].join("\n");


      const state = Blockly.serialization.workspaces.save(this.workspace);
      this.shape.setBlocklyWorkspace(state);
      this.shape.setDynamicFunction(completeCode);

      const newEvents = Object.keys(result.handlers).reduce((newEvents, eventName) => {
        const eventBody = result.handlers[eventName];
        const modifiedBody = `\n${destructuring}\n${eventBody}\n${this.returnStatement}`; // `\n${destructuring}\n${varsDeclaration}\n${eventBody}\n${this.returnStatement}`;
        newEvents[eventName] = modifiedBody;
        return newEvents;
      }, {});


      this.shape.setEventHandlers(newEvents)

      console.log("Финальный код:", completeCode);
      console.log("-----");
      return completeCode;
    },

    createToolbox() {
      return `<xml>
          <category name="Обработчики" colour="#4CA64C">
           <block type="handler"> </block>
          </category>
          <category name="Ожидание" colour="#4CA64C">
           <block type="sleep"> </block>
          </category>
          <category name="Логика" colour="%{BKY_LOGIC_HUE}">
            <block type="controls_if"></block>
            <block type="logic_compare"></block>
            <block type="logic_operation"></block>
            <block type="logic_negate"></block>
            <block type="logic_boolean"></block>
          </category>
          <category name="Цвета" colour="#FF5733">
            <block type="colour_picker"></block>
            <block type="colour_rgb">
              <value name="RED">
                <block type="math_number">
                  <field name="NUM">255</field>
                </block>
              </value>
              <value name="GREEN">
                <block type="math_number">
                  <field name="NUM">0</field>
                </block>
              </value>
              <value name="BLUE">
                <block type="math_number">
                  <field name="NUM">0</field>
                </block>
              </value>
            </block>
            <block type="colour_blend">
              <value name="COLOUR1">
                <block type="colour_picker">
                  <mutation colour="#ff0000"></mutation>
                </block>
              </value>
              <value name="COLOUR2">
                <block type="colour_picker">
                  <mutation colour="#3333ff"></mutation>
                </block>
              </value>
              <value name="RATIO">
                <block type="math_number">
                  <field name="NUM">0.5</field>
                </block>
              </value>
            </block>
          </category>

          <category name="Математика" colour="%{BKY_MATH_HUE}">
            <block type="math_number">
              <field name="NUM">0.5</field>
            </block>
            <block type="math_arithmetic"></block>
            <block type="math_single"></block>
          </category>
          <category name="Текст" colour="%{BKY_TEXTS_HUE}">
            <block type="text"></block>
            <block type="text_length"></block>
            <block type="text_print"></block>
          </category>
          </category>

      <category name="Внешние параметры" colour="#4CA64C">
       <block type="external_variable_get"> </block>
      </category>
      <category name="Внутренние параметры" colour="#A64C4C">
        <block type="internal_variable_set"></block>
        <block type="internal_variable_get"></block>
      </category>

        </xml>`;
    }
  }
}
</script>

<style>
.blocklyWidgetDiv, .blocklyDropDownDiv, .blocklyTooltipDiv {
  position: fixed;
}

.blocklyScrollbarVertical {
  z-index: -1;
}
</style>
