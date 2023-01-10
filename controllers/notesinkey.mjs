/**************
 * Music Theory (Core API) - Controller - Notes In Key
 */

import { validate } from '../util/validateinput.mjs';
import * as keys from '../models/keys_api.mjs';

export const postNotesInKey = (req, res, next) => {
  let requestData = req.body;
  let validityCheck = [false, 'Data not checked!'];
  let httpCode = 102;
  let notesInKey = 'Something went wrong...';

  validityCheck = validate(requestData);

  if (validityCheck[0] === true || validityCheck[1] === 256) {
    httpCode = 200;  
    notesInKey = keys.getNotesInKey(requestData.key);
  } else {
    httpCode = 400;
    notesInKey = 'Validity Check on submitted data FAILED.';    
  }
    
  res.status(httpCode).json(notesInKey);
}


