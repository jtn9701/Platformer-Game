// scripts/sync.js — explicit, user-triggered sync
export async function syncUp(readAdapter, writeAdapter) {
  const doc = await readAdapter.load();
  const copy =
    typeof structuredClone === "function"
      ? structuredClone(doc)
      : JSON.parse(JSON.stringify(doc));
  await writeAdapter.save(copy); // may stamp rev/updatedAt
}

export async function syncDown(readAdapter, writeAdapter) {
  const doc = await readAdapter.load();
  const copy =
    typeof structuredClone === "function"
      ? structuredClone(doc)
      : JSON.parse(JSON.stringify(doc));
  await writeAdapter.save(copy);
}
