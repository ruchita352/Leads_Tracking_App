const test = require('node:test');
const assert = require('node:assert/strict');
const { escapeRegExp, validateLeadInput, validateNoteInput } = require('../src/utils/validation');

test('validates and normalizes a new lead', () => {
  const result = validateLeadInput({
    name: '  Alex Rivera ',
    email: ' ALEX@example.com ',
    phone: ' 555 0100 '
  });

  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.data, {
    name: 'Alex Rivera',
    email: 'alex@example.com',
    phone: '555 0100',
    status: 'new'
  });
});

test('rejects invalid lead fields and unsupported fields', () => {
  const result = validateLeadInput({ name: ' ', email: 'not-an-email', role: 'admin' });

  assert.ok(result.errors.includes('Name is required'));
  assert.ok(result.errors.includes('A valid email is required'));
  assert.ok(result.errors.some((error) => error.includes('Unsupported field')));
});

test('requires at least one valid field for a partial update', () => {
  assert.deepEqual(validateLeadInput({}, { partial: true }).errors, [
    'At least one lead field must be provided'
  ]);
});

test('rejects non-plain object input for lead validation', () => {
  assert.deepEqual(validateLeadInput(new Date()).errors, ['A JSON object is required']);
  assert.deepEqual(validateLeadInput([]).errors, ['A JSON object is required']);
});

test('validates note content and escapes search expressions', () => {
  assert.equal(validateNoteInput({ content: '  Spoke with the lead.  ' }).content, 'Spoke with the lead.');
  assert.equal(validateNoteInput({ content: '  ' }).error, 'Note content is required');
  assert.equal(escapeRegExp('a.+(b)'), 'a\\.\\+\\(b\\)');
});
