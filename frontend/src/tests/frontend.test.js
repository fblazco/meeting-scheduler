import { formatDate, formatTime, formatDateTime, getShareableLink, groupSlotsByDate } from '../utils/helpers.js';
import { COLOR_THEMES } from '../utils/themeConstants.js';

let passed = 0;
let failed = 0;

function assert(description, condition) {
  if (condition) {
    console.log(`  ✅ [PASS] ${description}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${description}`);
    failed++;
  }
}

console.log('\n======================================================');
console.log('🧪 FRONTEND UTILITIES & THEME FITNESS TEST SUITE');
console.log('======================================================\n');

// 1. Date & Time Formatter Invariants
console.log('📅 1. DATE & TIME FORMATTING INVARIANTS');
const testDate = new Date('2026-08-25T14:30:00.000Z');

assert('formatDate returns a readable string', typeof formatDate(testDate) === 'string' && formatDate(testDate).length > 0);
assert('formatTime returns a valid 12-hour/24-hour time', typeof formatTime(testDate) === 'string' && formatTime(testDate).includes(':'));
assert('formatDateTime returns complete date and time', typeof formatDateTime(testDate) === 'string' && formatDateTime(testDate).includes(','));
assert('Null date handles safely without crashing', formatDate(null) === 'N/A' && formatTime(null) === 'N/A');

// 2. Shareable Link Generator
console.log('\n🔗 2. LINK GENERATION INVARIANTS');
const sampleToken = 'sched_a1b2c3d4e5';
const link = getShareableLink(sampleToken);
assert('Shareable link contains token', link.includes('/schedule/sched_a1b2c3d4e5'));
assert('Empty token fallback handles gracefully', getShareableLink('') === '');

// 3. Slot Grouping Invariants
console.log('\n⏱️ 3. SLOT GROUPING & CALENDAR INVARIANTS');
const mockSlots = [
  { id: '1', startTime: '2026-08-25T10:00:00Z', endTime: '2026-08-25T10:30:00Z', isBooked: false },
  { id: '2', startTime: '2026-08-25T11:00:00Z', endTime: '2026-08-25T11:30:00Z', isBooked: false },
  { id: '3', startTime: '2026-08-26T09:00:00Z', endTime: '2026-08-26T09:30:00Z', isBooked: true },
];

const grouped = groupSlotsByDate(mockSlots);
const dates = Object.keys(grouped);
assert('Groups slots into unique dates correctly', dates.length === 2);
assert('Date 1 contains 2 slots', grouped[dates[0]].length === 2);
assert('Date 2 contains 1 slot', grouped[dates[1]].length === 1);

// 4. Color Palette Tokens
console.log('\n🎨 4. COLOR THEME PALETTE INVARIANTS');
assert('Provides 6 curated color themes', Array.isArray(COLOR_THEMES) && COLOR_THEMES.length === 6);
assert('Every theme has an id, name, and hex color', COLOR_THEMES.every((t) => t.id && t.name && t.color.startsWith('#')));

// 5. Final Report
console.log('\n======================================================');
console.log(`🏁 FRONTEND TEST REPORT: ${passed} Passed, ${failed} Failed`);
console.log(`🎯 FITNESS SCORE: ${Math.round((passed / (passed + failed)) * 100)}%`);
console.log('======================================================\n');

process.exit(failed === 0 ? 0 : 1);
