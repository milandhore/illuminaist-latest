async function main() {
  if (!process.env.GEMINI_API_KEY) {
    console.log('GEMINI_API_KEY is not configured; skipping Gemini model preflight.');
    return;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok || !Array.isArray(data.models)) {
    throw new Error(`Gemini model preflight failed (${res.status}): ${data.error?.message || 'invalid response'}`);
  }

  console.log(JSON.stringify(data.models.map(m => m.name), null, 2));
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
