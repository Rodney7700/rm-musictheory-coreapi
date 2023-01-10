/**************
 * Music Theory (Core API) - Controller - Interval Between Notes
 */

import { validate } from '../util/validateinput.mjs';
import { getIntervalBetween } from '../models/intervals_api.mjs';

export const postIntervalBetween = (req, res, next) => {
  let requestData = req.body;
  let validityCheck = [ false, 'Data not checked!' ];
  let httpCode = 102;
  let intervalName = 'Something went wrong...';

  validityCheck = validate(requestData);

  if (validityCheck[0] === true && validityCheck[1] === 3080) {
    httpCode = 200;
    intervalName = getIntervalBetween(requestData.rootNote,
                                      requestData.secondNote,
                                      requestData.useShorthand);

    if (!requestData.useShorthand) {
      let words = intervalName.split(' ');
      
      for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substring(1); 
      };

      intervalName = words.join(' ');
    }
  } else {
    httpCode = 400;
    noteAtInterval = 'Validity Check on submitted data FAILED.';    
  }
    
  res.status(httpCode).json(intervalName);
}