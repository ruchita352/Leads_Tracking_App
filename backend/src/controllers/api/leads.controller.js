const mongoose = require('mongoose');
const Lead = require('../../models/lead');
const Note = require('../../models/note');
const { LEAD_STATUSES } = require('../../constants/lead-statuses');
const { HttpError } = require('../../utils/http-error');
const { escapeRegExp, validateLeadInput, validateNoteInput } = require('../../utils/validation');

function requireLeadId(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw new HttpError(400, 'Invalid lead id');
  }
}

function parsePositiveInteger(value, fallback, maximum = Number.MAX_SAFE_INTEGER) {
  if (value === undefined || value === '') return fallback;
  if (!/^\d+$/.test(value) || Number(value) < 1) return null;
  return Math.min(Number(value), maximum);
}

async function listLeads(req, res) {
  const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
  const status = typeof req.query.status === 'string' ? req.query.status : '';
  const page = parsePositiveInteger(req.query.page, 1);
  const limit = parsePositiveInteger(req.query.limit, 10, 50);

  if (search.length > 100) throw new HttpError(400, 'Search must be 100 characters or fewer');
  if (status && !LEAD_STATUSES.includes(status)) {
    throw new HttpError(400, `Status must be one of: ${LEAD_STATUSES.join(', ')}`);
  }
  if (page === null || limit === null) {
    throw new HttpError(400, 'Page and limit must be positive integers');
  }

  const filter = {};
  if (status) filter.status = status;
  if (search) {
    const pattern = new RegExp(escapeRegExp(search), 'i');
    filter.$or = [{ name: pattern }, { email: pattern }];
  }

  const [leads, total] = await Promise.all([
    Lead.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Lead.countDocuments(filter)
  ]);

  res.json({
    leads,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  });
}

async function createLead(req, res) {
  const { data, errors } = validateLeadInput(req.body);
  if (errors.length) throw new HttpError(400, 'Lead validation failed', errors);

  const lead = await Lead.create(data);
  res.status(201).json({ lead });
}

async function getLead(req, res) {
  requireLeadId(req.params.id);
  const [lead, notes] = await Promise.all([
    Lead.findById(req.params.id).lean(),
    Note.find({ leadId: req.params.id }).sort({ createdAt: -1 }).lean()
  ]);
  if (!lead) throw new HttpError(404, 'Lead not found');
  res.json({ lead, notes });
}

async function updateLead(req, res) {
  requireLeadId(req.params.id);
  const { data, errors } = validateLeadInput(req.body, { partial: true });
  if (errors.length) throw new HttpError(400, 'Lead validation failed', errors);

  const lead = await Lead.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true
  });
  if (!lead) throw new HttpError(404, 'Lead not found');
  res.json({ lead });
}

async function deleteLead(req, res) {
  requireLeadId(req.params.id);
  const lead = await Lead.findById(req.params.id);
  if (!lead) throw new HttpError(404, 'Lead not found');
  await Note.deleteMany({ leadId: lead._id });
  await lead.deleteOne();
  res.status(204).end();
}

async function listNotes(req, res) {
  requireLeadId(req.params.id);
  const lead = await Lead.exists({ _id: req.params.id });
  if (!lead) throw new HttpError(404, 'Lead not found');
  const notes = await Note.find({ leadId: req.params.id }).sort({ createdAt: -1 }).lean();
  res.json({ notes });
}

async function createNote(req, res) {
  requireLeadId(req.params.id);
  const { content, error } = validateNoteInput(req.body);
  if (error) throw new HttpError(400, 'Note validation failed', [error]);
  const lead = await Lead.exists({ _id: req.params.id });
  if (!lead) throw new HttpError(404, 'Lead not found');
  const note = await Note.create({ leadId: req.params.id, content });
  res.status(201).json({ note });
}

module.exports = {
  listLeads,
  createLead,
  getLead,
  updateLead,
  deleteLead,
  listNotes,
  createNote
};
