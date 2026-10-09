const { LEAD_STATUSES } = require('../constants/lead-statuses');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isPlainObject(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function validateLeadInput(input, { partial = false } = {}) {
  const errors = [];
  const data = {};
  const fields = ['name', 'email', 'phone', 'status'];
  const hasField = (field) => Object.hasOwn(input, field);

  if (!isPlainObject(input)) {
    return { data, errors: ['A JSON object is required'] };
  }

  const unknownFields = Object.keys(input).filter((field) => !fields.includes(field));
  if (unknownFields.length) {
    errors.push(`Unsupported field${unknownFields.length > 1 ? 's' : ''}: ${unknownFields.join(', ')}`);
  }

  if (!partial || hasField('name')) {
    if (typeof input.name !== 'string' || !input.name.trim()) {
      errors.push('Name is required');
    } else if (input.name.trim().length > 120) {
      errors.push('Name must be 120 characters or fewer');
    } else {
      data.name = input.name.trim();
    }
  }

  if (!partial || hasField('email')) {
    if (typeof input.email !== 'string' || !EMAIL_PATTERN.test(input.email.trim())) {
      errors.push('A valid email is required');
    } else if (input.email.trim().length > 254) {
      errors.push('Email must be 254 characters or fewer');
    } else {
      data.email = input.email.trim().toLowerCase();
    }
  }

  if (hasField('phone')) {
    if (typeof input.phone !== 'string') {
      errors.push('Phone must be a string');
    } else {
      data.phone = input.phone.trim();
    }
  } else if (!partial) {
    data.phone = '';
  }

  if (hasField('status')) {
    if (typeof input.status !== 'string' || !LEAD_STATUSES.includes(input.status)) {
      errors.push(`Status must be one of: ${LEAD_STATUSES.join(', ')}`);
    } else {
      data.status = input.status;
    }
  } else if (!partial) {
    data.status = 'new';
  }

  if (partial && Object.keys(data).length === 0 && errors.length === 0) {
    errors.push('At least one lead field must be provided');
  }

  return { data, errors };
}

function validateNoteInput(input) {
  if (!input || typeof input.content !== 'string' || !input.content.trim()) {
    return { content: null, error: 'Note content is required' };
  }
  const content = input.content.trim();
  if (content.length > 5000) {
    return { content: null, error: 'Note must be 5000 characters or fewer' };
  }
  return { content, error: null };
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { validateLeadInput, validateNoteInput, escapeRegExp };
