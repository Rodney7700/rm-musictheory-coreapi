/**************
 * Music Theory (Core API) - Controller - Name Polychords
 */

import { validate } from '../util/validateinput.mjs';
import { determinePolyChords } from '../models/chords_api.mjs';

export const postNamePolyChords = (req, res, next) => {
  let requestData = req.body;
  let validityCheck = [false, 'Data not checked!'];
  let httpCode = 102;
  let polyChordNames = 'Something went wrong...';

  validityCheck = validate(requestData);

  if (validityCheck[0] === true && validityCheck[1] === 512) {
    httpCode = 200;
    polyChordNames = determinePolyChords(requestData.notes, true);

  } else {
    httpCode = 400;
    polyChordNames = 'Validity Check on submitted data FAILED.';    
  }
    
  res.status(httpCode).json(polyChordNames);
}