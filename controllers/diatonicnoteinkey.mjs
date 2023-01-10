/**************
 * Music Theory (Core API) - Controller - Diatonic Note In Key
 */

import { validate } from '../util/validateinput.mjs';
import { DIATONIC_FUNCTION_DICTIONARY_OBJECT as LOOKUP } from '../models/intervals_api.mjs';
import { getUnison, getDiatonicSecond, getDiatonicThird, getDiatonicFourth,
         getDiatonicFifth, getDiatonicSixth, getDiatonicSeventh } from '../models/intervals_api.mjs';

function getNoteAtInterval(note, key, intervalFunction) {
  const result = LOOKUP[intervalFunction](note, key);
  return result;
}

export const postDiatonicNoteInKey = (req, res, next) => {
  let requestData = req.body;
  let validityCheck = [ false, 'Data not checked!' ];
  let httpCode = 102;
  let noteAtInterval = { intervalNote: 'Something went wrong...',
                         comment: 'Something went wrong...' };

  validityCheck = validate(requestData);

  if (validityCheck[0] === true && validityCheck[1] === 6400) {
    httpCode = 200;
    let result = [];
    result = getNoteAtInterval(requestData.rootNote, requestData.key, requestData.intervalName);

    noteAtInterval.intervalNote = result[0];
    noteAtInterval.comment = result[1];
    
  } else {
    httpCode = 400;
    noteAtInterval = 'Validity Check on submitted data FAILED.';    
  }
    
  res.status(httpCode).json(noteAtInterval);
}