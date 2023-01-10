/**************
 * Music Theory (Core API) - Routes - Scale Functions
 */

// Third Party Modules
import Express from 'express';

// Chord Function Controllers
import * as notesInScaleController from '../controllers/notesinscale.mjs';
import * as nameScaleController from '../controllers/namescale.mjs';

const router = Express.Router();

router.post('/notesinscale', notesInScaleController.postNotesInScale);
router.post('/namescale', nameScaleController.postNameScale);

export { router as routes };