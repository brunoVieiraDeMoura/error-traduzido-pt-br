import { ESLint } from "eslint";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Objeto com mensagens específicas de erro traduzidas
const specificRuleMessages = {
  "no-unused-vars": {
    "is assigned a value but never used": "recebe um valor, mas nunca é usado",
    "is defined but never used": "é definido, mas nunca usado",
  },
  semi: {
    "Missing semicolon": "Faltando ponto e vírgula",
  },
  // Adicione outras regras específicas aqui...
};

// Função para obter a mensagem traduzida específica
function getTranslatedMessage(ruleId, message) {
  if (specificRuleMessages[ruleId]) {
    for (const [original, translation] of Object.entries(
      specificRuleMessages[ruleId],
    )) {
      if (message.includes(original)) {
        const relevantPart = message.match(new RegExp(`'[^']+' ${original}`));
        if (relevantPart) {
          return relevantPart[0].replace(original, translation);
        }
      }
    }
  }
  return `Erro detectado (${ruleId})`;
}

// Obtém o caminho do diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Função para limpar comentários de erro e adicionar novos comentários
async function processFile(filePath) {
  try {
    const configPath = path.resolve(__dirname, "../eslint.config.mjs");
    const eslint = new ESLint({ overrideConfigFile: configPath });
    const results = await eslint.lintFiles([filePath]);

    let fileContent = fs.readFileSync(filePath, "utf-8").split("\n");

    // Limpa todos os comentários de erro existentes
    fileContent = fileContent.map((line) => line.replace(/ \/\/ .+$/g, ""));

    // Processa os resultados do ESLint
    results.forEach((result) => {
      const { messages } = result;

      messages.forEach((msg) => {
        const { line, ruleId, message } = msg;

        // Ignora todas as mensagens do Prettier
        if (ruleId === "prettier/prettier") {
          return;
        }

        const translatedMessage = getTranslatedMessage(ruleId, message);

        // Verifica se a linha existe antes de tentar modificá-la
        if (fileContent[line - 1] !== undefined) {
          if (!fileContent[line - 1].includes(`// ${translatedMessage}`)) {
            fileContent[line - 1] += ` // ${translatedMessage}`;
          }
        }
      });
    });

    fs.writeFileSync(filePath, fileContent.join("\n"), "utf-8");
  } catch (error) {
    console.error("Error while annotating ESLint errors:", error);
  }
}

// Caminho do arquivo a ser anotado
const filePath = path.resolve(__dirname, "../src/example.js");

// Processa o arquivo
processFile(filePath);
