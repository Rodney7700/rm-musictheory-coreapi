/*
  This work is based on: https://github.com/bspaans/python-mingus
  
  Copyright (C) 2022, Rodney Martin (JavaScript version)

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

/*
  Module dealing with Keys in Music
*/

import * as utils from './utils.mjs';
import { FIFTHS_ARRAY, REVERSE_FIFTHS_ARRAY } from './notes_api.mjs';

export const KEYS_ARRAY = [
  ['Cb', 'ab'],  //  7 b
  ['Gb', 'eb'],  //  6 b
  ['Db', 'bb'],  //  5 b
  ['Ab', 'f'],   //  4 b
  ['Eb', 'c'],   //  3 b
  ['Bb', 'g'],   //  2 b
  ['F', 'd'],    //  1 b
  ['C', 'a'],    //  no b or #
  ['G', 'e'],    //  1 #
  ['D', 'b'],    //  2 #
  ['A', 'f#'],   //  3 #
  ['E', 'c#'],   //  4 #
  ['B', 'g#'],   //  5 #
  ['F#', 'd#'],  //  6 #
  ['C#', 'a#'],  //  7 #
];

export const MAJOR_KEYS_ARRAY = KEYS_ARRAY.map(element => element[0]);
export const MINOR_KEYS_ARRAY = KEYS_ARRAY.map(element => element[1]);
export const BASE_SCALE_ARRAY = [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ];

export function isKeyValid(key) {
  /*
    Return True if key is in a recognized format. False if not.
  */
  for (let index in KEYS_ARRAY) {
    if (KEYS_ARRAY[index].includes(key)) {
      return true;
    }    
  };

  return false;
}

export function getKey(accidentals=0) {
  /*
    Return the key corrisponding to accidentals.

    Return the array containing the major key corrensponding to the
    accidentals provided as input, and the relative minor; negative numbers for
    flats, positive numbers for sharps.
  */
  if (!utils.range(-7, 8).includes(accidentals)) {
    return `${accidentals} is not in range (-7)-(+7).`;
  }

  return KEYS_ARRAY[accidentals + 7];
}

export function getKeySignatureAsInt(key='C') {
  /*
    Return the key signature.

    0 for C or a
    negative numbers for flat key signatures
    positive numbers for sharp key signatures.
  */
  
  for (let index in KEYS_ARRAY) {
    if (KEYS_ARRAY[index].includes(key)) {
      let accidentals = index - 7;
      return accidentals;
    }   
  }
}

export function getKeyAccidentals(key='C') {
  /*
    Return the list of accidentals present in the key signature.
  */
  let accidentals = getKeySignatureAsInt(key);
  let accidentalList = [];
    
  if (accidentals < 0) {
    for (let i = 0; i < -accidentals; i++) {
      accidentalList.push(`${REVERSE_FIFTHS_ARRAY[i]}b`);
    }
  } else if (accidentals > 0) {
    for (let i = 0; i < accidentals; i++) {
      accidentalList.push(`${FIFTHS_ARRAY[i]}#`);
    }
  }

  if (accidentalList.length === 0) {
    accidentalList.push(`No Accidentals in this key.`);
  }
  
  return accidentalList; 
}

export function getNotesInKey(key='C') {
  /*
    Return an ordered array of the notes in this natural key.

    Examples:
    getNotesInKey('F')
    ['F', 'G', 'A', 'Bb', 'C', 'D', 'E']
    getNotesInKey('c')
    ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb']
  */

  let notesInKey = [];
  let symbol;

  // Calculate notes
  let alteredNotes = getKeyAccidentals(key).map(note => note.charAt(0));
    
  if (getKeySignatureAsInt(key) < 0) {
    symbol = 'b';
  } else if (getKeySignatureAsInt(key) > 0) {
    symbol = '#';
  }
  
  let rawTonicIndex = BASE_SCALE_ARRAY.indexOf(key.toUpperCase().charAt(0));
  
  [
    ...BASE_SCALE_ARRAY.slice(rawTonicIndex),
    ...BASE_SCALE_ARRAY.slice(0,rawTonicIndex)
  ].forEach(note => alteredNotes.includes(note) ? notesInKey.push(`${note}${symbol}`) : notesInKey.push(`${note}`))

  return notesInKey;
}

export function getRelativeMajorKey(key) {
  /*
    Return the relative major of a minor key.

    Example:
    getRelativeMajorKey('a')
    'C'
  */
 
  for (let index in KEYS_ARRAY) {
    if (KEYS_ARRAY[index].includes(key)) {
      return KEYS_ARRAY[index][0];
    }    
  }
} 

export function getRelativeMinorKey(key) {
  /*
    Return the relative minor of a major key.

    Example:
    getRelativeMinorKey('C')
    'a'
  */
  
  for (let index in KEYS_ARRAY) {
    if (KEYS_ARRAY[index].includes(key)) {
      return KEYS_ARRAY[index][1];
    }    
  }
}

export const Key = {
  /* 
    A Key Object
  */

  init: function init(key='C') {
          this.key = key;

          if (key === key.toLowerCase()) {
            this.mode = 'Minor'            
          } else {
            this.mode = 'Major'
          };

          let symbol = key.charAt(1);
          if (symbol === '#') {
            symbol = 'sharp';
          } else if (symbol === 'b') {
            symbol = 'flat';
          } else {
            symbol = '';
          };
          
          this.name = `${key.charAt(0).toUpperCase()} ${symbol} ${this.mode}`;

          this.signature = `${getKeySignatureAsInt(this.key)}`;
        },

  equal: function equal(other) {
            if (this.key === other.key) {
              return true;
            }
            return false;
          },

  notEqual: function notEqual(other) {
              return !this.equal(other);
            }
};