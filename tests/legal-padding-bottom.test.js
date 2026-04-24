/**
 * Test: Legal pages (Terms, Privacy) have sufficient paddingBottom
 * to prevent the bottom tab bar from overlapping content.
 *
 * The BottomNav is ~60px tall. paddingBottom must be > 60 to clear it.
 */

const fs = require('fs');
const path = require('path');

const MIN_PADDING = 100; // must be greater than BottomNav height (~60px) with margin

function extractPaddingBottom(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const match = content.match(/paddingBottom:\s*(\d+)/);
  if (!match) return null;
  return parseInt(match[1], 10);
}

const files = [
  { name: 'Terms', path: path.join(__dirname, '..', 'components', 'screens', 'Terms.tsx') },
  { name: 'Privacy', path: path.join(__dirname, '..', 'components', 'screens', 'Privacy.tsx') },
];

let passed = 0;
let failed = 0;

for (const file of files) {
  const padding = extractPaddingBottom(file.path);
  if (padding === null) {
    console.error(`FAIL: ${file.name} — no paddingBottom found`);
    failed++;
  } else if (padding < MIN_PADDING) {
    console.error(`FAIL: ${file.name} — paddingBottom is ${padding}, expected >= ${MIN_PADDING}`);
    failed++;
  } else {
    console.log(`PASS: ${file.name} — paddingBottom is ${padding} (>= ${MIN_PADDING})`);
    passed++;
  }
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
