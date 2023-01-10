/**************
 * Music Theory (Core API) - Controller - Notes In Chord
 */

import { validate } from '../util/validateinput.mjs';
import { chordFromShorthand } from '../models/chords_api.mjs';
import { reduceAccidentals } from '../models/notes_api.mjs';

export const postNotesInChord = (req, res, next) => {
  let requestData = req.body;
  let validityCheck = [false, 'Data not checked!'];
  let httpCode = 102;
  let chordNotes = 'Something went wrong...';

  validityCheck = validate(requestData);

  if (validityCheck[0] === true && validityCheck[1] === 16) {
    httpCode = 200;
    chordNotes = chordFromShorthand(requestData.chordNameShort);
    
    console.log(chordNotes);
  } else {
    httpCode = 400;
    chordNotes = 'Validity Check on submitted data FAILED.';    
  }
    
  res.status(httpCode).json(chordNotes);
}