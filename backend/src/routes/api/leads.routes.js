const express = require('express');
const controller = require('../../controllers/api/leads.controller');

const router = express.Router();

router.get('/', controller.listLeads);
router.post('/', controller.createLead);
router.get('/:id', controller.getLead);
router.patch('/:id', controller.updateLead);
router.delete('/:id', controller.deleteLead);
router.get('/:id/notes', controller.listNotes);
router.post('/:id/notes', controller.createNote);

module.exports = router;
