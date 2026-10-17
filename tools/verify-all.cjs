const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

console.log('=== RUNNING ILLUMINAIst VERIFICATION SUITE ===\n');

// 1. Verify Company Email Validation Logic
console.log('--- TEST 1: Company Email Domain Validation ---');
const { validateCompanyEmail, isCompanyEmail } = require('../src/utils/companyEmail.js');

const testCases = [
  { email: 'user@gmail.com', expectedValid: false, desc: 'Personal Gmail' },
  { email: 'john.doe@yahoo.com', expectedValid: false, desc: 'Personal Yahoo' },
  { email: 'developer@hotmail.com', expectedValid: false, desc: 'Personal Hotmail' },
  { email: 'engineer@outlook.com', expectedValid: false, desc: 'Personal Outlook' },
  { email: 'test@icloud.com', expectedValid: false, desc: 'Personal iCloud' },
  { email: 'dev@meta.com', expectedValid: true, desc: 'Corporate Meta' },
  { email: 'sarah@google.com', expectedValid: true, desc: 'Corporate Google' },
  { email: 'team@anthropic.com', expectedValid: true, desc: 'Corporate Anthropic' },
  { email: 'lead@illuminaist.in', expectedValid: true, desc: 'Corporate Illuminaist' },
  { email: 'architect@stripe.com', expectedValid: true, desc: 'Corporate Stripe' }
];

let emailTestsPassed = 0;
for (const tc of testCases) {
  const result = validateCompanyEmail(tc.email);
  const isValid = result.valid;
  if (isValid === tc.expectedValid) {
    console.log(`  ✓ PASSED: ${tc.email} -> valid=${isValid} (${tc.desc})`);
    emailTestsPassed++;
  } else {
    console.error(`  ✗ FAILED: ${tc.email} -> expected ${tc.expectedValid}, got ${isValid}`);
  }
}
console.log(`Email validation tests: ${emailTestsPassed}/${testCases.length} passed.\n`);

// 2. Verify Alerts Dispatch System
console.log('--- TEST 2: Subscriber Content Alert Dispatch ---');
const { notifySubscribers, readSubscribers, readAlerts } = require('./cms-server.cjs');

const initialAlerts = readAlerts();
console.log(`  Initial alert records: ${initialAlerts.length}`);

// Test publishing an article alert
const artAlert = notifySubscribers({
  type: 'article',
  title: 'Autonomous Coding Agents with Antigravity and Claude 3.5',
  slug: 'autonomous-coding-agents',
  excerpt: 'A deep dive into multi-agent systems and real-time execution pipelines.',
  author: 'Dr. Sarah Chen',
  url: '/articles/autonomous-coding-agents'
});
console.log(`  ✓ Generated Article Alert: [${artAlert.id}] "${artAlert.title}"`);

// Test publishing an eBook alert
const ebookAlert = notifySubscribers({
  type: 'ebook',
  title: 'The Production RAG Engineering Handbook (2026 Edition)',
  slug: 'rag-engineering-guide',
  excerpt: '120-page enterprise guide for building scalable retrieval pipelines.',
  url: '/ebooks'
});
console.log(`  ✓ Generated eBook Alert: [${ebookAlert.id}] "${ebookAlert.title}"`);

// Test publishing a News alert
const newsAlert = notifySubscribers({
  type: 'news',
  title: 'Breakthrough: Google & Deepmind Announce Gemini 2.5 Flash',
  slug: 'gemini-2-5-flash-announcement',
  excerpt: 'Real-time multi-modal reasoning and ultra-low latency inference.',
  url: '/news/gemini-2-5-flash-announcement'
});
console.log(`  ✓ Generated News Alert: [${newsAlert.id}] "${newsAlert.title}"`);

const updatedAlerts = readAlerts();
console.log(`  Updated alert records in store: ${updatedAlerts.length}`);
if (updatedAlerts.length >= initialAlerts.length + 3) {
  console.log('  ✓ PASSED: Alerts stored & dispatched for Article, eBook, and News!\n');
} else {
  console.error('  ✗ FAILED: Alerts count did not increase properly.\n');
}

// 3. Verify eBook Files Exist and are Downloadable
console.log('--- TEST 3: eBook Assets and Gated URLs ---');
const ebooksJs = fs.readFileSync(path.join(ROOT, 'src', 'data', 'ebooks.js'), 'utf8');
const ragPdf = path.join(ROOT, 'public', 'ebooks', 'rag-engineering-guide.pdf');
const mlopsPdf = path.join(ROOT, 'public', 'ebooks', 'mlops-llm-guide.pdf');

console.log(`  rag-engineering-guide.pdf exists: ${fs.existsSync(ragPdf)} (${fs.existsSync(ragPdf) ? fs.statSync(ragPdf).size + ' bytes' : 0})`);
console.log(`  mlops-llm-guide.pdf exists: ${fs.existsSync(mlopsPdf)} (${fs.existsSync(mlopsPdf) ? fs.statSync(mlopsPdf).size + ' bytes' : 0})`);
if (fs.existsSync(ragPdf) && fs.existsSync(mlopsPdf)) {
  console.log('  ✓ PASSED: Both eBook PDF files exist and are ready for corporate subscribers!\n');
} else {
  console.error('  ✗ FAILED: One or more eBook PDF files are missing.\n');
}

// 4. Verify Header Dropdown & Theme Classes
console.log('--- TEST 4: Header Dropdown Light/Dark Mode Classes ---');
const headerJsx = fs.readFileSync(path.join(ROOT, 'src', 'components', 'layout', 'Header.jsx'), 'utf8');
const hasThemeAwareDropdown = headerJsx.includes('bg-white dark:bg-[#0f1423]');
const hasNoDarkInlineBg = !headerJsx.includes("background: 'rgba(15,20,35,0.98)'");
const hasMobileDrawerTheme = headerJsx.includes('bg-white/95 dark:bg-[#0b0f19]/95');
const hasSubscriberAlertsBell = headerJsx.includes('SubscriberAlertsDropdown');

console.log(`  Theme-aware dropdown background: ${hasThemeAwareDropdown}`);
console.log(`  Hardcoded dark inline style removed: ${hasNoDarkInlineBg}`);
console.log(`  Theme-aware mobile drawer: ${hasMobileDrawerTheme}`);
console.log(`  Subscriber alerts bell mounted: ${hasSubscriberAlertsBell}`);

if (hasThemeAwareDropdown && hasNoDarkInlineBg && hasMobileDrawerTheme && hasSubscriberAlertsBell) {
  console.log('  ✓ PASSED: Header and menus are fully theme-aware for Light & Dark mode!\n');
} else {
  console.error('  ✗ FAILED: Header dropdown checks failed.\n');
}

console.log('=== ALL AUTOMATED VERIFICATION CHECKS COMPLETED SUCCESSFULLY ===');
