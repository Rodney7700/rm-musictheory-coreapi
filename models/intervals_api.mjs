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
  Module dealing with Intervals in Music
*/

import * as utils from './utils.mjs';
import * as notes from './notes_api.mjs';
import * as keys from './keys_api.mjs';

export function getNoteInKeyAtInterval(key, startNote, interval) {
  /*
    Return the note found at the interval starting from startNote in the
    given key.

    Example:
    getNoteAtInterval('C', 'D', 1)
    'E'
  */
  
  let notesInKey = keys.getNotesInKey(key);
  let comment = '';
  let result = [];

  // Check enharmonic notes
  if (!notesInKey.includes(startNote)) {
    switch (startNote) {
      case 'A#':
        if (!notesInKey.includes('Bb')) {
          result.push(`${startNote} is not in this musical key.`);
          result.push(`Please select a note that is in the selected musical key and try again.`);
          return result;
        }
        startNote = 'Bb';
        comment = 'Enharmonic note Bb was used instead of note A# for this music key.';
        break;
      case 'Bb':
        if (!notesInKey.includes('A#')) {
          result.push(`${startNote} is not in this musical key.`);
          result.push(`Please select a note that is in the selected musical key and try again.`);
          return result;
        }
        startNote = 'A#';
        comment = 'Enharmonic note A# was used instead of note Bb for this music key.';
        break;
      case 'B':
        if (!notesInKey.includes('Cb')) {
          result.push(`${startNote} is not in this musical key.`);
          result.push(`Please select a note that is in the selected musical key and try again.`);
          return result;
        }
        startNote = 'Cb';
        comment = 'Enharmonic note Cb was used instead of note B for this music key.';
        break;
      case 'Cb':
        if (!notesInKey.includes('B')) {
          result.push(`${startNote} is not in this musical key.`);
          result.push(`Please select a note that is in the selected musical key and try again.`);
          return result;
        }
        startNote = 'B';
        comment = 'Enharmonic note B was used instead of note Cb for this music key.';
        break;
      case 'B#':
        if (!notesInKey.includes('C')) {
          result.push(`${startNote} is not in this musical key.`);
          result.push(`Please select a note that is in the selected musical key and try again.`);
          return result;
        }
        startNote = 'C';
        comment = 'Enharmonic note C was used instead of note B# for this music key.';
        break;
      case 'C':
        if (!notesInKey.includes('B#')) {
          result.push(`${startNote} is not in this musical key.`);
          result.push(`Please select a note that is in the selected musical key and try again.`);
          return result;
        }
        startNote = 'B#';
        comment = 'Enharmonic note B# was used instead of note C for this music key.';
        break;
      case 'C#':
        if (!notesInKey.includes('Db')) {
          result.push(`${startNote} is not in this musical key.`);
          result.push(`Please select a note that is in the selected musical key and try again.`);
          return result;
        }
        startNote = 'Db';
        comment = 'Enharmonic note Db was used instead of note C# for this music key.';
        break;
      case 'Db':
        if (!notesInKey.includes('C#')) {
          result.push(`${startNote} is not in this musical key.`);
          result.push(`Please select a note that is in the selected musical key and try again.`);
          return result;
        }
        startNote = 'C#';
        comment = 'Enharmonic note C# was used instead of note Db for this music key.';
        break;
      case 'D#':
        if (!notesInKey.includes('Eb')) {
          result.push(`${startNote} is not in this musical key.`);
          result.push(`Please select a note that is in the selected musical key and try again.`);
          return result;
        }
        startNote = 'Eb';
        comment = 'Enharmonic note Eb was used instead of note D# for this music key.';
        break;
      case 'Eb':
        if (!notesInKey.includes('D#')) {
          result.push(`${startNote} is not in this musical key.`);
          result.push(`Please select a note that is in the selected musical key and try again.`);
          return result;
        }
        startNote = 'D#';
        comment = 'Enharmonic note D# was used instead of note Eb for this music key.';
        break;
      case 'E':
        if (!notesInKey.includes('Fb')) {
          result.push(`${startNote} is not in this musical key.`);
          result.push(`Please select a note that is in the selected musical key and try again.`);
          return result;
        }
        startNote = 'Fb';
        comment = 'Enharmonic note Fb was used instead of note E for this music key.';
        break;
      case 'Fb':
        if (!notesInKey.includes('E')) {
          result.push(`${startNote} is not in this musical key.`);
          result.push(`Please select a note that is in the selected musical key and try again.`);
          return result;
        }
        startNote = 'E';
        comment = 'Enharmonic note E was used instead of note Fb for this music key.';
        break;
      case 'E#':
        if (!notesInKey.includes('F')) {
          result.push(`${startNote} is not in this musical key.`);
          result.push(`Please select a note that is in the selected musical key and try again.`);
          return result;
        }
        startNote = 'F';
        comment = 'Enharmonic note F was used instead of note E# for this music key.';
        break;
      case 'F':
        if (!notesInKey.includes('E#')) {
          result.push(`${startNote} is not in this musical key.`);
          result.push(`Please select a note that is in the selected musical key and try again.`);
          return result;
        }
        startNote = 'E#';
        comment = 'Enharmonic note E# was used instead of note F for this music key.';
        break;
      case 'F#':
        if (!notesInKey.includes('Gb')) {
          result.push(`${startNote} is not in this musical key.`);
          result.push(`Please select a note that is in the selected musical key and try again.`);
          return result;
        }
        startNote = 'Gb';
        comment = 'Enharmonic note Gb was used instead of note F# for this music key.';
        break;
      case 'Gb':
        if (!notesInKey.includes('F#')) {
          result.push(`${startNote} is not in this musical key.`);
          result.push(`Please select a note that is in the selected musical key and try again.`);
          return result;
        }
        startNote = 'F#';
        comment = 'Enharmonic note F# was used instead of note Gb for this music key.';
        break;
      case 'G#':
        if (!notesInKey.includes('Ab')) {
          result.push(`${startNote} is not in this musical key.`);
          result.push(`Please select a note that is in the selected musical key and try again.`);
          return result;
        }
        startNote = 'Ab';
        comment = 'Enharmonic note Ab was used instead of note G# for this music key.';
        break;
      case 'Ab':
        if (!notesInKey.includes('G#')) {
          result.push(`${startNote} is not in this musical key.`);
          result.push(`Please select a note that is in the selected musical key and try again.`);
          return result;
        }
        startNote = 'G#';
        comment = 'Enharmonic note G# was used instead of note Ab for this music key.';
        break;
      default:
        result.push(`${startNote} is not in this musical key.`);
        result.push(`Please select a note that is in the selected musical key and try again.`);
        return result;
    }
  }

  let index = undefined;
  
  notesInKey.forEach(note => {
    if (note === startNote) {
      index = notesInKey.indexOf(note);
    }    
  })

  result.push(notesInKey[utils.modulo(index + interval, 7)]);
  result.push(comment);

  return result;
}

// ------------- Diatonic Intervals (By Name) -----------------------------

export function getUnison(note, key=null) {
  /*
    Return the unison of note.

    The key is not at all important, but is here for consistency reasons
    only.

    Example:
    getUnison('C')
    'C'
  */
  
  let result = [];
  result.push(note);
  result.push(`The unison of any note is that same note; ` +
              `The musical key selected may not actually contain ${note}.`);

  return result;
}

export function getDiatonicSecond(note, key) {
  /*
    Return the diatonic second of a note in a key.

    Example:
    getDiatonicSecond('E', 'C')
    'F'
    getDiatonicSecond('E', 'D')
    'F#'
  */
    
  return getNoteInKeyAtInterval(key, note, 1);  
}

export function getDiatonicThird(note, key) {
  /*
    Return the diatonic third of a note in a key.

    Example:
    getDiatonicThird('E', 'C')
    'G'
    getDiatonicThird('E', 'E')
    'G#'
  */
  
  return getNoteInKeyAtInterval(key, note, 2);  
}

export function getDiatonicFourth(note, key) {
  /*
    Return the diatonic fourth of a note in a key.

    Example:
    getDiatonicFourth('E', 'C')
    'A'
    getDiatonicFourth('E', 'B')
    'A#'
  */
  
  return getNoteInKeyAtInterval(key, note, 3);  
}

export function getDiatonicFifth(note, key) {
  /*
    Return the diatonic fifth of a note in a key.

    Example:
    getDiatonicFifth('E', 'C')
    'B'
    getDiatonicFifth('E', 'F')
    'Bb'
  */
  
  return getNoteInKeyAtInterval(key, note, 4);  
}

export function getDiatonicSixth(note, key) {
  /*
    Return the diatonic sixth of a note in a key.

    Example:
    getDiatonicSixth('E', 'C')
    'B'
    getDiatonicSixth('E', 'F')
    'Bb'
  */
  
  return getNoteInKeyAtInterval(key, note, 5);  
}

export function getDiatonicSeventh(note, key) {
  /*
    Return the diatonic seventh of a note in a key.

    Example:
    getDiatonicSeventh('E', 'C')
    'D'
    getDiatonicSeventh('E', 'B')
    'D#'
  */
 
  return getNoteInKeyAtInterval(key, note, 6);  
}

// ------------- Absolute Intervals (By Name) -----------------------------

export function getSemitonesBetween(note1, note2) {
  /*
    Return an integer in the range of 0-11, determining the half note steps
    between note1 and note2.

    Examples:
    getSemitonesBetween('C', 'D')
    2
    getSemitonesBetween('D', 'C')
    10
  */
  
  let semitones = notes.convertNoteToInt(note2) - notes.convertNoteToInt(note1);
  
  if (semitones < 0) {
    return 12 - semitones * -1;
  } else {
    return semitones;
  }
}

function adjustAugmentOrDiminish(note1, note2, interval) {
  /*
    An internal helper function for the following minor and major functions.

    This function is *not* intended to be used directly.
  */
    
  let currentSemitones = getSemitonesBetween(note1, note2);

  while (currentSemitones !== interval) {
    if (currentSemitones > interval) {
      note2 = notes.diminish(note2);
      note2 = notes.reduceAccidentals(note2);
    } else if (currentSemitones < interval) {
      note2 = notes.augment(note2);
      note2 = notes.reduceAccidentals(note2);
    }

    currentSemitones = getSemitonesBetween(note1, note2);
  }

  // We are practically done right now, but we need to be able to create the
  // minor seventh of Cb and get Bbb instead of B######### as the result
  let accidentalAsInt = 0;
  for (let i = 1; i < note2.length; i++) {
    if (note2.charAt(i) === 'b') {
      accidentalAsInt -= 1;      
    } else if (note2.charAt(i) === '#') {
      accidentalAsInt += 1;
    };
  }

  // These are some checks to see if we have generated too many #'s or too many b's.
  // In these cases we need to convert #'s to b's and vice versa.
  if (accidentalAsInt > 6) {
    accidentalAsInt = utils.modulo(accidentalAsInt, 12);
    accidentalAsInt = accidentalAsInt - 12;
  } else if (accidentalAsInt < -6) {
    accidentalAsInt = utils.modulo(accidentalAsInt, -12);
    accidentalAsInt = accidentalAsInt + 12;
  }

  // Rebuild the note
  let rebuiltNote = note2.charAt(0);

  while (accidentalAsInt > 0) {
    rebuiltNote = notes.augment(rebuiltNote);
    accidentalAsInt -= 1;
  }

  while (accidentalAsInt < 0) {
    rebuiltNote = notes.diminish(rebuiltNote);
    accidentalAsInt += 1;
  }

  return rebuiltNote;
}

export function getMinorUnison(note) {
  /*
    Return the minor unison of a note.
  */
  
  return notes.diminish(note);
}

export function getMajorUnison(note) {
  /*
    Return the major unison of a note.
  */
 
  return note;  
}

export function getAugmentedUnison(note) {
  /*
    Return the augmented unison of a note.
  */
  
  return notes.augment(note);  
}

export function getMinorSecond(note) {
  let diatonicSecond = getDiatonicSecond(note.charAt(0), 'C');
  return adjustAugmentOrDiminish(note, diatonicSecond[0], 1);
}

export function getMajorSecond(note) {
  let diatonicSecond = getDiatonicSecond(note.charAt(0), 'C');
  return adjustAugmentOrDiminish(note, diatonicSecond[0], 2);
}

export function getMinorThird(note) {
  let diatonicThird = getDiatonicThird(note.charAt(0), 'C');
  return adjustAugmentOrDiminish(note, diatonicThird[0], 3);
}

export function getMajorThird(note) {
  let diatonicThird = getDiatonicThird(note.charAt(0), 'C');
  return adjustAugmentOrDiminish(note, diatonicThird[0], 4);
}

export function getMinorFourth(note) {
  let diatonicFourth = getDiatonicFourth(note.charAt(0), 'C');
  return adjustAugmentOrDiminish(note, diatonicFourth[0], 4);
}

export function getMajorFourth(note) {
  let diatonicFourth = getDiatonicFourth(note.charAt(0), 'C');
  return adjustAugmentOrDiminish(note, diatonicFourth[0], 5);
}

export function getPerfectFourth(note) {
  return getMajorFourth(note);
}

export function getMinorFifth(note) {
  let diatonicFifth = getDiatonicFifth(note.charAt(0), 'C');
  return adjustAugmentOrDiminish(note, diatonicFifth[0], 6);
}

export function getMajorFifth(note) {
  let diatonicFifth = getDiatonicFifth(note.charAt(0), 'C');
  return adjustAugmentOrDiminish(note, diatonicFifth[0], 7);
}

export function getPerfectFifth(note) {
  return getMajorFifth(note);
}

export function getMinorSixth(note) {
  let diatonicSixth = getDiatonicSixth(note.charAt(0), 'C');
  return adjustAugmentOrDiminish(note, diatonicSixth[0], 8);
}

export function getMajorSixth(note) {
  let diatonicSixth = getDiatonicSixth(note.charAt(0), 'C');
  return adjustAugmentOrDiminish(note, diatonicSixth[0], 9);
}

export function getMinorSeventh(note) {
  let diatonicSeventh = getDiatonicSeventh(note.charAt(0), 'C');
  return adjustAugmentOrDiminish(note, diatonicSeventh[0], 10);
}

export function getMajorSeventh(note) {
  let diatonicSeventh = getDiatonicSeventh(note.charAt(0), 'C');
  return adjustAugmentOrDiminish(note, diatonicSeventh[0], 11);
}

export function getNoteBySemitones(note, interval, key='C') {
  /* 
    Return the note an interval (in semitones) away from the given note.

    This will produce mostly theoretical sound results, but you should use
    the minor and major functions to work around the corner cases.
  */
 
  let intervals = [0, 2, 4, 5, 7, 9, 11].map(element => 
                  utils.modulo(notes.convertNoteToInt(key) + element, 12));
  
  let notesInKey = keys.getNotesInKey(key);
  
  let matchingNote = notesInKey.find(element => {if (element.charAt(0) === note.charAt(0)) {return element;}});
  
  let actualInterval = utils.modulo(intervals[notesInKey.indexOf(matchingNote)] + interval, 12);
  
  if (intervals.includes(actualInterval)) {
    return `${notesInKey[intervals.indexOf(actualInterval)]}${note.slice(1)}`;
  } else {
    return `${notes.diminish(notesInKey[intervals.indexOf(utils.modulo(actualInterval + 1, 12))])}${note.slice(1)}`;
  }
}

export function invert(interval) {
  /* 
    Invert an interval provided as an array of two note strings.

    Example:
    invert(['C', 'E'])
    ['E', 'C']
  */
  interval.reverse(); // reverse method on JavaScript arrays is destructive; it changes the original array
  let invertedInterval = interval;
  interval.reverse(); // undo the reverse method
  return invertedInterval;
}

export function getIntervalBetween(note1, note2, shorthand=false) {
  /*
    Name the interval between note1 and note2.

    Examples:
    getIntervalBetween('C', 'E')
    'major third'
    getIntervalBetween('C', 'Eb')
    'minor third'
    getIntervalBetween('C', 'E#')
    'augmented third'
    getIntervalBetween('C', 'Ebb')
    'diminished third'

    This works for all intervals. Note that there are corner cases for major
    fifths and fourths:
    getIntervalBetween('C', 'G')
    'perfect fifth'
    getIntervalBetween('C', 'F')
    'perfect fourth'
  */
    
  let indexNote1 = notes.FIFTHS_ARRAY.indexOf(note1.charAt(0));
  let indexNote2 = notes.FIFTHS_ARRAY.indexOf(note2.charAt(0)); 
  let numberOfFifthSteps = indexNote2 - indexNote1;
  if (indexNote2 < indexNote1) {
    numberOfFifthSteps = notes.FIFTHS_ARRAY.length - indexNote1 + indexNote2;
  }

  // Array of arrays [name, shorthand_name, semitones for major version of this interval]
  let fifthSteps = [
    ['unison', '1', 0],
    ['fifth', '5', 7],
    ['second', '2', 2],
    ['sixth', '6', 9],
    ['third', '3', 4],
    ['seventh', '7', 11],
    ['fourth', '4', 5]
  ];

  // Count half steps between note1 and note2
  let semitones = getSemitonesBetween(note1, note2);

  // Get the proper list from the number of fifth steps
  let current = fifthSteps[numberOfFifthSteps];

  // intervalSemitones = number of semitones for this interval
  let intervalSemitones = current[2];

  // Corner case for unisons ('A' and 'Ab', for instance)  
  if (note1.charAt(0) === note2.charAt(0) || semitones === 0) {
    function countAccidentals(note) {
      /*
        A private function for counting the number of accidentals in note.
      */
      let accidentals = 0;
      for (let i = 1; i < note.length; i++) {
        if (note.charAt(i) === 'b') {
          accidentals -= 1;      
        } else if (note.charAt(i) === '#') {
          accidentals += 1;
        }       
      }
      return accidentals;
    }
    
    let accidentalsNote1 = countAccidentals(note1);
    let accidentalsNote2 = countAccidentals(note2);
    if (accidentalsNote1 === accidentalsNote2) {
      if (!shorthand) {
        return 'major unison';
      }
      return '1';
    } else if (accidentalsNote1 < accidentalsNote2) {
      if (!shorthand) {
        return 'augmented unison';
      }
      return '#1';
    } else if (accidentalsNote1 - accidentalsNote2 === 1) {
      if (!shorthand) {
        return 'minor unison';
      }
      return 'b1';
    } else {
      if (!shorthand) {
        return 'diminished unison';
      }
      return 'bb1';
    }
  }

  // if intervalSemitones is equal to the semitones between note1 and note2 the interval is
  // major or perfect
  if (intervalSemitones === semitones) {
    // Corner cases for perfect fifths and fourths
    if (current[0] === 'fifth') {
      if (!shorthand) {
        return 'perfect fifth';
      }
    } else if (current[0] === 'fourth') {
      if (!shorthand) {
        return 'perfect fourth';
      }
    }
    if (!shorthand) {
      return `major ${current[0]}`;
    }
    return current[1];   
  } else if (intervalSemitones + 1 <= semitones) {
    // if intervalSemitones + 1 is equal to half_notes, the interval is augmented.
    if (!shorthand) {
      return `augmented ${current[0]}`;
    }
    return `${'#'.repeat(semitones - intervalSemitones)}${current[1]}`;
  } else if (intervalSemitones - 1 === semitones) {
    // etc.
    if (!shorthand) {
      return `minor ${current[0]}`;
    }
    return `b${current[1]}`;
  } else if (intervalSemitones - 2 >= semitones) {
    if (!shorthand) {
      return `diminished ${current[0]}`;
    }
    return `${'b'.repeat(intervalSemitones - semitones)}${current[1]}`;
  }
}

export function getNoteAtInterval(note, interval, up='true') {
  /*
    Return the note on interval up or down.

    Examples:
    getNoteAtInterval('A', 'b3')
    'C'
    getNoteAtInterval('D', '2')
    'E'
    getNoteAtInterval('E', '2', False)
    'D'
  */
  
  // Array of arrays [shorthand, interval function up, interval function down]
  let shortHandLookup = [
    ['1', getMajorUnison, getMajorUnison],
    ['2', getMajorSecond, getMinorSeventh],
    ['3', getMajorThird, getMinorSixth],
    ['4', getMajorFourth, getMajorFifth],
    ['5', getMajorFifth, getMajorFourth],
    ['6', getMajorSixth, getMinorThird],
    ['7', getMajorSeventh, getMinorSecond]
  ]

  // Looking up last character in interval in shortHandLookup and calling that function.
  let noteRetrievedAtInterval = false;
  let intervalFunction;
  shortHandLookup.forEach(element => {if (element[0] === interval.slice(-1)) {
                                        if (up) {
                                          intervalFunction = element[1];
                                          noteRetrievedAtInterval = intervalFunction(note);
                                        } else {
                                          intervalFunction = element[2];
                                          noteRetrievedAtInterval = intervalFunction(note);
                                        }
                                      }})
  
  // Last character in interval should be 1-7
  if (noteRetrievedAtInterval === false) {
    return false;
  }

  // Collect Accidentals
  for (let i = 0; i < interval.length; i++) {
    if (interval.charAt(i) === '#') {
      if (up) {
        noteRetrievedAtInterval = notes.augment(noteRetrievedAtInterval);
      } else {
        noteRetrievedAtInterval = notes.diminish(noteRetrievedAtInterval);     
      }
    } else if (interval.charAt(i) === 'b') {
      if (up) {
        noteRetrievedAtInterval = notes.diminish(noteRetrievedAtInterval);
      } else {
        noteRetrievedAtInterval = notes.augment(noteRetrievedAtInterval);     
      }
    } else {
      return noteRetrievedAtInterval;
    }
  }
}

export function isIntervalConsonant(note1, note2, includeFourths=true) {
  /*
    Return True if the interval is consonant.

    A consonance is a harmony, chord, or interval considered stable, as
    opposed to a dissonance.

    This function tests whether the given interval is consonant. This
    basically means that it checks whether the interval is (or sounds like)
    a unison, third, sixth, perfect fourth or perfect fifth.

    In classical music the fourth is considered dissonant when used contrapuntal
    (relating to counterpoint), which is why you can choose to exclude it.
  */
  return isIntervalPerfectConsonant(note1, note2, includeFourths) ||
         isIntervalImperfectConsonant(note1, note2);
}

export function isIntervalPerfectConsonant(note1, note2, includeFourths=true) {
  /*
    Return True if the interval is a perfect consonant one.

    Perfect consonances are either unisons, perfect fourths or fifths, or
    octaves (which is the same as a unison in this model).

    In classical music the fourth is considered dissonant when used contrapuntal
    (relating to counterpoint), which is why you can choose to exclude it.
  */
  let semitones = getSemitonesBetween(note1, note2);
  
  return (0 <= semitones && semitones <= 7) || (includeFourths && semitones === 5);
}

export function isIntervalImperfectConsonant(note1, note2) {
  /*
    Return True if the interval is a perfect consonant one.

    Perfect consonances are either unisons, perfect fourths or fifths, or
    octaves (which is the same as a unison in this model).

    In classical music the fourth is considered dissonant when used contrapuntal
    (relating to counterpoint), which is why you can choose to exclude it.
  */
  let imperfectCheck = [ 3, 4, 8, 9 ];
  let semitones = getSemitonesBetween(note1, note2);
  
  return imperfectCheck.includes(semitones);
}

export function isIntervalDissonant(note1, note2, includeFourths=false) {
  /*
    Return True if the insterval is dissonant.

    This function tests whether an interval is considered unstable, dissonant.

    In the default case, perfect fourths are considered consonant, but this
    can be changed by setting includeFourths to true.
  */
    return !isIntervalPerfectConsonant(note1, note2, includeFourths) ||
           !isIntervalImperfectConsonant(note1, note2);
}

// ------------- API Function Dictionary Objects --------------------------

export const DIATONIC_FUNCTION_DICTIONARY_OBJECT = {
  'getUnison': getUnison,
  'getDiatonicSecond': getDiatonicSecond,
  'getDiatonicThird': getDiatonicThird,
  'getDiatonicFourth': getDiatonicFourth,
  'getDiatonicFifth': getDiatonicFifth,
  'getDiatonicSixth': getDiatonicSixth,
  'getDiatonicSeventh': getDiatonicSeventh
}