/**************
 * Music Theory (Core API) - Controller - Chord By Harmonic Function
 */

import { validate } from '../util/validateinput.mjs';
import * as chords from '../models/chords_api.mjs';

function getChordNotes(key, chordFunction) {
  const chordNotes = chords.CHORD_FUNCTION_DICTIONARY_OBJECT[chordFunction](key);
  return chordNotes;
}

export const postChordNotes = (req, res, next) => {
  let requestData = req.body;
  let validityCheck = [ false, 'Data not checked!' ];
  let httpCode = 102;
  let chordNotes = 'Something went wrong...';
 
  validityCheck = validate(requestData);
 
  if (validityCheck[0] === true && validityCheck[1] === 8448) {
    httpCode = 200;
    chordNotes = getChordNotes(requestData.key, requestData.chordFunction);
  } else {
    httpCode = 400;
    chordNotes = 'Validity Check on submitted data FAILED.';    
  }
    
  res.status(httpCode).json(chordNotes);
}