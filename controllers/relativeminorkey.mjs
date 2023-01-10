/**************
 * Music Theory (Core API) - Controller - Relative Minor Key
 */

import { validate } from '../util/validateinput.mjs';
import * as keys from '../models/keys_api.mjs';

export const postMinorKey = (req, res, next) => {
  let requestData = req.body;
  let validityCheck = [false, 'Data not checked!'];
  let httpCode = 102;
  let minorKey = 'Something went wrong...';

  validityCheck = validate(requestData);

  if (validityCheck[0] === true && validityCheck[1] === 256) {
    httpCode = 200;  
    minorKey = keys.getRelativeMinorKey(requestData.key);
  } else {
    httpCode = 400;
    minorKey = 'Validity Check on submitted data FAILED.';    
  }
    
  res.status(httpCode).json(minorKey);
}


