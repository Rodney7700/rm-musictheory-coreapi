/**************
 * Music Theory (Core API) - Controller - Name A Chord
 */

import { validate } from '../util/validateinput.mjs';
import { nameChord } from '../models/chords_api.mjs';

export const postNameChord = (req, res, next) => {
  let requestData = req.body;
  let validityCheck = [false, 'Data not checked!'];
  let httpCode = 102;
  let chordName = 'Something went wrong...';
 
  validityCheck = validate(requestData);

  if (validityCheck[0] === true && validityCheck[1] === 524) {
    httpCode = 200;
    chordName = nameChord(requestData.notes,
                          requestData.useShorthand,
                          requestData.omitInversions);
  
  } else {
    httpCode = 400;
    chordName = 'Validity Check on submitted data FAILED.';    
  }
    
  res.status(httpCode).json(chordName);
}