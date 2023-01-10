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
  Module dealing with Notes in Music
*/

import * as utils from './utils.mjs';

export const NOTE_DEFN_OBJECT = { 'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11 };
export const FIFTHS_ARRAY = [ 'F', 'C', 'G', 'D', 'A', 'E', 'B' ];
export const REVERSE_FIFTHS_ARRAY = [ 'B', 'E', 'A', 'D', 'G', 'C', 'F' ];

export function isNoteValid(note) {
  /*
    Return True if note is in a recognised format. False if not.    
    Assumes note is a string.

    This function accommodates notes provided in lower case where the note to
    be checked is the note used to name a key (eg. 'eb' for the key of E flat minor)
  */
  if (!(note.charAt(0).toUpperCase() in NOTE_DEFN_OBJECT)) {
    return false;
  }  

  for (let i = 1; i < note.length; i++) {
    if (note.charAt(i) !== 'b' && note.charAt(i) !== '#') {
      return false;
    }
  }
  
  return true;
}

export function getNoteFromInt(noteInt, accidentals='#') {
  /*
    Convert integers in the range of 0-11 to notes in the form of C or C# or Db.

    Throw a RangeError exception if the note_int is not in the range 0-11.

    If not specified, sharps will be used.

    Examples:
      getNoteFromInt(0)
      'C'
      getNoteFromInt(3)
      'D#'
      getNoteFromInt(3, 'b')
      'Eb'
  */
  const noteSharpArray = [ 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B' ];
  const noteFlatArray = [ 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B' ];

  if (!utils.range(12).includes(noteInt)) {
    return `${noteInt} is not a valid note integer. Please use an integer in the range 0 to 11.`; 
  }

  if (accidentals === '#') {
    return noteSharpArray[noteInt];
  } else if (accidentals === 'b') {
    return noteFlatArray[noteInt];
  } else  {
    return `${accidentals} is not a valid accidental. Please use # or b.`;
  }
}

export function isNoteEnharmonic(note1, note2) {
  /*
    Test whether note1 and note2 are enharmonic, i.e. they sound the same.

    Assumes that valid note integers are provided for note1, note2
  */
  return getNoteFromInt(note1) === getNoteFromInt(note2);
}

export function convertNoteToInt(note) {
  /*
    Convert notes in the form of:
      C, C#, Cb, C##, etc. (Standard or Major) 
      c, c#, cb, c##, etc. (Minor or lazy)
    to an integer in the range of 0-11.
  */
    
  let noteAsInt = NOTE_DEFN_OBJECT[note.charAt(0).toUpperCase()];
  
  for (let i = 1; i < note.length; i++) {
    if (note.charAt(i) === 'b') {
      noteAsInt -= 1;      
    } else if (note.charAt(i) === '#') {
      noteAsInt += 1;
    } else {
      return `${note.charAt(i)} is not a valid accidental. Please use # or b.`;
    }
  }

  return utils.modulo(noteAsInt, 12);
}

export function reduceAccidentals(note) {
  /*
    Reduce any extra accidentals to proper notes.

    Example:
    reduceAccidentals('C####')
    'E'
  */
    
  let noteAsInt = NOTE_DEFN_OBJECT[note.charAt(0).toUpperCase()];  
    
  for (let i = 1; i < note.length; i++) {
    if (note.charAt(i) === 'b') {
      noteAsInt -= 1;      
    } else if (note.charAt(i) === '#') {
      noteAsInt += 1;
    } else {
      return `${note.charAt(i)} is not a valid accidental. Please use # or b.`;
    }
  }

  if (noteAsInt >= convertNoteToInt(note.charAt(0))) {
    return getNoteFromInt(utils.modulo(noteAsInt, 12));
  } else {
    return getNoteFromInt(utils.modulo(noteAsInt, 12), 'b');
  }  
}

export function augment(note) {
  /*
    Augment a given note.

    Examples:
    augment('C')
    'C#'
    augment('Cb')
    'C'
  */
 
  // note.slice(-1) is the last character in the string
  if (note.slice(-1) !== 'b') {
    return `${note}#`;
  } else {
    return note.charAt(0);
  } 
}

export function diminish(note) {
  /*
    Diminish a given note.

    Examples:
    augment('C')
    'Cb'
    augment('C#')
    'C'
  */
 
  // note.slice(-1) is the last character in the string
  if (note.slice(-1) !== '#') {
    return `${note}b`;
  } else {
    return note.charAt(0);
  }
}

export function removeRedundantAccidentals(note) {
  /*
    Remove redundant sharps and flats from the given note.

    Examples:
    removeRedundantAccidentals('C##b')
    'C#'
    removeRedundantAccidentals('Eb##b')
    'E'
  */
   
  let accidentalAsInt = 0;
  let cleanedNote = note.charAt(0);

  for (let i = 1; i < note.length; i++) {
    if (note.charAt(i) === 'b') {
      accidentalAsInt -= 1;      
    } else if (note.charAt(i) === '#') {
      accidentalAsInt += 1;
    }
  }
  
  while ( accidentalAsInt > 0 ) {
    cleanedNote = augment(cleanedNote);
    accidentalAsInt -=1;
  }

  while ( accidentalAsInt < 0 ) {
    cleanedNote = diminish(cleanedNote);
    accidentalAsInt +=1;
  }

  return cleanedNote; 
}