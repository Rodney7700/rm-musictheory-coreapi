/**************
 * Music Theory (Core API) - Controller - Name A Scale
 */

import { validate } from '../util/validateinput.mjs';
import { nameScale } from '../models/scales_api.mjs';

export const postNameScale = (req, res, next) => {
  let requestData = req.body;
  let validityCheck = [false, 'Data not checked!'];
  let httpCode = 102;
  let chordName = 'Something went wrong...';

  validityCheck = validate(requestData);

  if (validityCheck[0] === true && validityCheck[1] === 512) {
    httpCode = 200;
    chordName = nameScale(requestData.notes);
  } else {
    httpCode = 400;
    chordName = 'Validity Check on submitted data FAILED.';    
  }
    
  res.status(httpCode).json(chordName);
}