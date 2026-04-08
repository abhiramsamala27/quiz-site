const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

router.post('/login', adminController.login);
router.get('/questions', auth, adminController.getQuestions);
router.post('/questions', auth, adminController.addQuestion);
router.put('/questions/:id', auth, adminController.updateQuestion);
router.delete('/questions/:id', auth, adminController.deleteQuestion);

router.get('/results', auth, adminController.getResults);
router.get('/results/all', auth, adminController.getResultsAll);
router.delete('/results', auth, adminController.deleteAllResults);
router.get('/export-results', auth, adminController.exportResults);
router.post('/questions/bulk', auth, adminController.importQuestionsBulk);

module.exports = router;
