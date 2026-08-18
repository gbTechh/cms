// Entry point de CLI para `npm run template:export -- [nombre]`.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { exportTemplateData } from "~/admin/server/exportTemplate.server";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatesDir = path.resolve(__dirname, "../../../templates");

async function run() {
  const data = await exportTemplateData();

  fs.mkdirSync(templatesDir, { recursive: true });
  const requestedName = process.argv[2];
  const fileName = requestedName
    ? requestedName.endsWith(".json") ? requestedName : `${requestedName}.json`
    : `export-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
  const outPath = path.join(templatesDir, fileName);

  fs.writeFileSync(outPath, JSON.stringify(data, null, 2));

  const totalEntries = data.collections.reduce((n, c) => n + c.entries.length, 0);
  console.log(`✅ Template exportado: ${outPath}`);
  console.log(
    `   ${data.collections.length} colecciones, ${totalEntries} entries, ${data.relationships.length} relaciones, ${data.media.length} media.`
  );
  console.log("ℹ️  Los archivos de /public/uploads NO se incluyen — cópialos aparte si migras medios.");
}

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error al exportar el template:", error);
    process.exit(1);
  });
