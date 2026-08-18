// Entry point de CLI para `npm run template:import -- <ruta-al-json>`.
import fs from "fs";
import path from "path";
import { importTemplateData } from "~/admin/server/importTemplate.server";

async function run() {
  const file = process.argv[2];
  if (!file) {
    console.error("❌ Falta la ruta al archivo JSON.");
    console.error("Uso: npm run template:import -- <ruta-al-json>");
    process.exit(1);
  }

  const fullPath = path.resolve(file);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Archivo no encontrado: ${fullPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(fullPath, "utf-8");
  const data = JSON.parse(raw);

  const summary = await importTemplateData(data);
  console.log(
    `✅ Importado: ${summary.collections} colecciones, ${summary.entries} entries, ${summary.relationships} relaciones, ${summary.media} media nuevos.`
  );
  if (summary.warnings.length > 0) {
    console.log("⚠️ Avisos:");
    summary.warnings.forEach((w) => console.log(`   - ${w}`));
  }
}

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error al importar el template:", error);
    process.exit(1);
  });
