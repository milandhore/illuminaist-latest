const fs = require('fs');
const path = require('path');

const EBOOKS_DIR = path.join(__dirname, '..', 'public', 'ebooks');
if (!fs.existsSync(EBOOKS_DIR)) {
  fs.mkdirSync(EBOOKS_DIR, { recursive: true });
}

function createSimplePdf(title, subtitle, topics, pagesCount) {
  const content = `BT
/F1 24 Tf
50 720 Td
(${title}) Tj
0 -36 Td
/F2 13 Tf
(${subtitle}) Tj
0 -30 Td
/F3 10 Tf
(Illuminaist Engineering Research Series - Corporate Edition) Tj
0 -40 Td
/F2 12 Tf
(Key Topics Covered:) Tj
0 -20 Td
/F3 10 Tf
${topics.map(t => `(  * ${t}) Tj 0 -18 Td`).join('\n')}
0 -30 Td
/F3 9 Tf
(Total Pages: ${pagesCount} | Exclusively published for verified enterprise engineering subscribers.) Tj
0 -18 Td
(Visit https://illuminaist.com for updates, alerts, and community code repositories.) Tj
ET`;

  const streamLength = Buffer.byteLength(content, 'utf8');

  const pdf = `%PDF-1.4
1 0 obj
<<
  /Type /Catalog
  /Pages 2 0 R
>>
endobj
2 0 obj
<<
  /Type /Pages
  /Kids [3 0 R]
  /Count 1
>>
endobj
3 0 obj
<<
  /Type /Page
  /Parent 2 0 R
  /MediaBox [0 0 612 792]
  /Contents 4 0 R
  /Resources <<
    /Font <<
      /F1 <<
        /Type /Font
        /Subtype /Type1
        /BaseFont /Helvetica-Bold
      >>
      /F2 <<
        /Type /Font
        /Subtype /Type1
        /BaseFont /Helvetica-Bold
      >>
      /F3 <<
        /Type /Font
        /Subtype /Type1
        /BaseFont /Helvetica
      >>
    >>
  >>
>>
endobj
4 0 obj
<<
  /Length ${streamLength}
>>
stream
${content}
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000412 00000 n 
trailer
<<
  /Size 5
  /Root 1 0 R
>>
startxref
${480 + streamLength}
%%EOF`;

  return Buffer.from(pdf, 'utf8');
}

const ragPdf = createSimplePdf(
  'The RAG Engineering Handbook',
  'From Prototype to Production (2026 Edition)',
  ['Chunking Strategies', 'Vector Databases', 'Embedding Models', 'Cross-Encoders', 'RAGAS Evaluation', 'Production Architecture'],
  120
);
fs.writeFileSync(path.join(EBOOKS_DIR, 'rag-engineering-guide.pdf'), ragPdf);

const mlopsPdf = createSimplePdf(
  'MLOps for Large Language Models',
  'Kubernetes, Monitoring & Cost Control',
  ['vLLM & TGI Setup', 'Kubernetes + KEDA', 'GPU Scheduling', 'Observability', 'Cost Optimisation', 'CI/CD for Models'],
  96
);
fs.writeFileSync(path.join(EBOOKS_DIR, 'mlops-llm-guide.pdf'), mlopsPdf);

console.log('eBook sample PDFs successfully created in public/ebooks/');
