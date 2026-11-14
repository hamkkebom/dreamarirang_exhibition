// migrations/ 폴더의 SQL 파일을 이름 순서대로, 아직 적용하지 않은 것만 실행한다.
// 사용: npm run migrate   (DATABASE_URL_UNPOOLED 또는 DATABASE_URL 필요)
// 이미 적용한 파일은 고치지 말고, 바꿀 내용은 새 번호의 파일로 추가한다.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Pool } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL이 없습니다. `vercel env pull .env.local` 로 받으세요.");
  process.exit(1);
}

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "migrations");
const pool = new Pool({ connectionString: url });
const client = await pool.connect();

try {
  await client.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())`);
  const done = new Set((await client.query("SELECT name FROM schema_migrations")).rows.map((r) => r.name));
  const files = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort();
  let applied = 0;
  for (const file of files) {
    if (done.has(file)) continue;
    const sql = await readFile(path.join(dir, file), "utf8");
    await client.query("BEGIN");
    try {
      await client.query(sql);
      await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [file]);
      await client.query("COMMIT");
      console.log(`적용: ${file}`);
      applied++;
    } catch (e) {
      await client.query("ROLLBACK");
      throw new Error(`${file} 실패: ${e.message}`);
    }
  }
  console.log(applied ? `${applied}개 적용 완료` : "새로 적용할 파일 없음");
} finally {
  client.release();
  await pool.end();
}
