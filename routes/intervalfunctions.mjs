/**************
 * Music Theory (Core API) - Routes - Interval Functions
 */

// Third Party Modules
import Express from 'express';

// Key Function Controllers
import * as diatonicNoteInKeyController from '../controllers/diatonicnoteinkey.mjs';
import * as noteAtIntervalController from '../controllers/noteatinterval.mjs';
import * as intervalBetweenController from '../controllers/intervalbetween.mjs';

const router = Express.Router();

router.post('/diatonicnoteinkey', diatonicNoteInKeyController.postDiatonicNoteInKey);
router.post('/noteatinterval', noteAtIntervalController.postNoteAtInterval);
router.post('/intervalbetween', intervalBetweenController.postIntervalBetween);

export { router as routes };