import { query } from "@anthropic-ai/claude-agent-sdk";
import fs from "fs";

fs.mkdirSync("logs", { recursive: true });

const raw = await new Promise((resolve) => {
    const chunks = [];
    process.stdin.on("data", (chunk) => chunks.push(chunk));
    process.stdin.on("end", () => resolve(Buffer.concat(chunks).toString("utf8").replace(/^﻿/, "")));
});

try {
    const hookData = JSON.parse(raw);
    const { tool_name, tool_input } = hookData;

    // Extrae el contenido según el tipo de herramienta
    let content;
    if (tool_name === "MultiEdit") {
        content = JSON.stringify(tool_input.edits);
    } else {
        content = tool_input.content ?? tool_input.new_string ?? null;
    }

    if (!content) {
        process.exit(0);
    }

    const messages = [];
    for await (const message of query({
        prompt:
            `Herramienta usada: ${tool_name}. Archivo: ${tool_input.file_path ?? "desconocido"}.\n` +
            "Cambio aplicado:\n" + content + "\n\n" +
            "Determina si este cambio es importante para el registro del proyecto " +
            "(cambios críticos, errores potenciales, contratos de API afectados, etc.).\n" +
            "Responde ÚNICAMENTE con JSON válido, sin texto extra:\n" +
            '{"isImportant":true,"text":"resumen de máx 500 chars"} o {"isImportant":false,"text":""}'
    })) {
        messages.push(message);
    }

    const resultMessage = messages.find((m) => m.type === "result");
    if (!resultMessage) process.exit(0);

    const parsed = JSON.parse(resultMessage.result.replace(/```json|```/g, "").trim());

    const timestamp = new Date().toISOString();
    if (parsed.isImportant) {
        fs.appendFileSync("logs/audit.txt", `[${timestamp}] ✅ [${tool_name}] ${parsed.text}\n`);
    } else {
    }
} catch (err) {
    fs.appendFileSync("logs/audit.txt", `[ERROR] ${err.message}\n`);
}

process.exit(0);
