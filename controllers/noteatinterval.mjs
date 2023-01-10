/**************
 * Music Theory (Core API) - Controller - Note At Interval
 */

import { validate } from '../util/validateinput.mjs';
import { getNoteAtInterval } from '../models/intervals_api.mjs';
import { reduceAccidentals } from '../models/notes_api.mjs';

export const postNoteAtInterval = (req, res, next) => {
  let requestData = req.body;
  let validityCheck = [false, 'Data not checked!'];
  let httpCode = 102;
  let noteAtInterval = 'Something went wrong...';

  validityCheck = validate(requestData);

  if (validityCheck[0] === true && validityCheck[1] === 22528) {
    httpCode = 200;
    let result = getNoteAtInterval(requestData.rootNote, requestData.intervalName, requestData.direction);
  
    noteAtInterval = reduceAccidentals(result);
  } else {
    httpCode = 400;
    noteAtInterval = 'Validity Check on submitted data FAILED.';    
  }
    
  res.status(httpCode).json(noteAtInterval);
}