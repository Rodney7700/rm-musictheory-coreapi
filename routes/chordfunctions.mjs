/**************
 * Music Theory (Core API) - Routes - Chord Functions
 */

// Third Party Modules
import Express from 'express';

// Chord Function Controllers
import * as notesInChordController from '../controllers/notesinchord.mjs';
import * as nameChordController from '../controllers/namechord.mjs';
import * as namePolyChordsController from '../controllers/namepolychords.mjs';

const router = Express.Router();

router.post('/notesinchord', notesInChordController.postNotesInChord);
router.post('/namechord', nameChordController.postNameChord);
router.post('/namepolychords', namePolyChordsController.postNamePolyChords);

export { router as routes };