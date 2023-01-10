/**************
 * Music Theory (Core API) - Utility - Validate Input
 */

import { isNoteValid } from '../models/notes_api.mjs';
import { isKeyValid } from '../models/keys_api.mjs';

export function validate(masterInputObject) {
  if (Object.keys(masterInputObject).length === 0) {return [false, 'No valid input.'];}
  
  let inputBitmask = 0;
  // FLAGS
  const INPUT_DATA_FLAGS = {
    DIRECTION: 16384,     // 100000000000000
    CHORD_FUNCTION: 8192, // 010000000000000
    INTERVAL_NAME: 4096,  // 001000000000000
    ROOT_NOTE: 2048,      // 000100000000000
    SECOND_NOTE: 1024,    // 000010000000000 
    NOTES: 512,           // 000001000000000
    KEY: 256,             // 000000100000000
    ACCIDENTALS: 128,     // 000000010000000      
    INTERVALS: 64,        // 000000001000000
    CHORD_NAME: 32,       // 000000000100000
    CHORD_NAME_SHORT: 16, // 000000000010000
    USE_SHORTHAND: 8,     // 000000000001000
    OMIT_INVERSIONS: 4,   // 000000000000100
    SCALE_NAME: 2,        // 000000000000010 
    OCTAVES: 1            // 000000000000001
  };

  const keys = Object.keys(masterInputObject);

  keys.forEach(key => {
    if (key === 'direction') {
      if (typeof masterInputObject[key] !== 'boolean') {
        return [false, 'Direction can only be true (for up) or false (for down).'];
      }
      inputBitmask = inputBitmask | INPUT_DATA_FLAGS.DIRECTION;
    }
    if (key === 'chordFunction') {
      if (typeof masterInputObject[key] !== 'string') { 
        return [false, `${masterInputObject[key]} is an invalid chord function.`];
      }
      inputBitmask = inputBitmask | INPUT_DATA_FLAGS.CHORD_FUNCTION;
    }
    if (key === 'intervalName') {
      if (typeof masterInputObject[key] !== 'string') { 
        return [false, `${masterInputObject[key]} is an invalid interval.`];
      }
      inputBitmask = inputBitmask | INPUT_DATA_FLAGS.INTERVAL_NAME;
    }
    if (key === 'rootNote') {
      if (!isNoteValid(masterInputObject[key])) { return [false, 'Invalid root note.']; }      
      inputBitmask = inputBitmask | INPUT_DATA_FLAGS.ROOT_NOTE;
    }
    if (key === 'secondNote') {
      if (!isNoteValid(masterInputObject[key])) { return [false, 'Invalid second note.']; }
      inputBitmask = inputBitmask | INPUT_DATA_FLAGS.SECOND_NOTE;
    }
    if (key === 'notes') {
      for (const note in masterInputObject[key]) {
        if (!isNoteValid(masterInputObject[key][note])) {
          return [false, `${masterInputObject[key][note]} is an invalid note.`];
        }
      }
      inputBitmask = inputBitmask | INPUT_DATA_FLAGS.NOTES;
    }
    if (key === 'key') {
      if (!isKeyValid(masterInputObject[key])) { return [false, 'Invalid key.']; }
      inputBitmask = inputBitmask | INPUT_DATA_FLAGS.KEY;
    }
    if (key === 'accidentals') {
      if (!(Number.isInteger(masterInputObject[key])
            && -7 <= masterInputObject[key]
            && masterInputObject[key] <= 7)) { return [false, 'Accidentals has to be an integer between -7 and 7.']; }
      inputBitmask = inputBitmask | INPUT_DATA_FLAGS.ACCIDENTALS;
    }
    if (key === 'intervals') {
      if (!(Number.isInteger(masterInputObject[key])
            && 1 <= masterInputObject[key]
            && masterInputObject[key] <= 14)) { return [false, 'Intervals has to be an integer between 1 and 14.']; }
      inputBitmask = inputBitmask | INPUT_DATA_FLAGS.INTERVALS;
    }
    if (key === 'chordName') {
      if (typeof masterInputObject[key] !== 'string') { 
        return [false, `${masterInputObject[key]} is an invalid chord name.`];
      }
      inputBitmask = inputBitmask | INPUT_DATA_FLAGS.CHORD_NAME;
    }
    if (key === 'chordNameShort') {
      if (typeof masterInputObject[key] !== 'string') {
        return [false, `${masterInputObject[key]} is an invalid shorthand chord name.`];
      }
      inputBitmask = inputBitmask | INPUT_DATA_FLAGS.CHORD_NAME_SHORT;
    }
    if (key === 'useShorthand') {
      if (typeof masterInputObject[key] !== 'boolean') { return [false, 'Use Shorthand can only be true or false.']; }
      inputBitmask = inputBitmask | INPUT_DATA_FLAGS.USE_SHORTHAND;
    }
    if (key === 'omitInversions') {
      if (typeof masterInputObject[key] !== 'boolean') {
        return [false, 'Omit Inverions can only be true or false.'];
      }
      inputBitmask = inputBitmask | INPUT_DATA_FLAGS.OMIT_INVERSIONS;
    }
    if (key === 'scaleName') {
      if (typeof masterInputObject[key] !== 'string') { 
        return [false, `${masterInputObject[key]} is an invalid scale name.`];
      }
      inputBitmask = inputBitmask | INPUT_DATA_FLAGS.SCALE_NAME;
    }
    if (key === 'octaves') {
      if (!(Number.isInteger(masterInputObject[key])
            && 1 <= masterInputObject[key]
            && masterInputObject[key] <= 10)) {
        return [false, 'Octaves has to be an integer between 1 and 10.'];
      }
      inputBitmask = inputBitmask | INPUT_DATA_FLAGS.OCTAVES;
    }
  });

  if (inputBitmask === 0) {
    return [false, `No valid options provided.`];
  }

  return [true, inputBitmask];
}