/**************
 * Music Theory (Core API) - Routes - Key Functions
 */

// Third Party Modules
import Express from 'express';

// Key Function Controllers
import * as notesInKeyController from '../controllers/notesinkey.mjs';
import * as relativeMinorKeyController from '../controllers/relativeminorkey.mjs';
import * as relativeMajorKeyController from '../controllers/relativemajorkey.mjs';
import * as chordHarmonicFuncionController from '../controllers/harmonicfunc.mjs';

const router = Express.Router();

router.post('/notesinkey', notesInKeyController.postNotesInKey);
router.post('/relativeminorkey', relativeMinorKeyController.postMinorKey);
router.post('/relativemajorkey', relativeMajorKeyController.postMajorKey);
router.post('/harmonicfunc', chordHarmonicFuncionController.postChordNotes);

export { router as routes };