/**************
 * Music Theory (Core API) - Routes - Home Page 
 */

// Third Party Modules
import Express from 'express';

// Local Modules
import * as homeController from '../controllers/home.mjs';
const router = Express.Router();

router.get('/', homeController.getIndex);

export { router as routes };