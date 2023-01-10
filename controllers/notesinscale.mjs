/**************
 * Music Theory (Core API) - Controller - Notes In Scale
 */

import { validate } from '../util/validateinput.mjs';
import * as scaleObjects from '../models/scales_api.mjs';

function createRequestedScale(rootNote, scaleName, octaves) {
  const requestedScale = Object.create(scaleObjects.SCALE_DICTIONARY_OBJECT[scaleName]);
  requestedScale.init(rootNote, octaves);
  return requestedScale;
}

export const postNotesInScale = (req, res, next) => {
  let requestData = req.body;
  let validityCheck = [false, 'Data not checked!'];
  let httpCode = 102;
  let scaleNotes = 'Something went wrong...';
  let requestedScale = {};

  validityCheck = validate(requestData);

  if (validityCheck[0] === true && validityCheck[1] === 2051) {
    httpCode = 200;
    scaleNotes = {};  
    requestedScale = createRequestedScale(requestData.rootNote,
                                          requestData.scaleName,
                                          requestData.octaves);
    scaleNotes.ascending = requestedScale.ascending();
    scaleNotes.descending = requestedScale.descending();
  } else {
    httpCode = 400;
    scaleNotes = 'Validity Check on submitted data FAILED.';    
  }
    
  res.status(httpCode).json(scaleNotes);
}


