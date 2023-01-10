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
  Module dealing with Chords in Music
*/

import * as utils from './utils.mjs';
import * as notes from './notes_api.mjs';
import * as keys from './keys_api.mjs';
import * as intervals from './intervals_api.mjs';

// A cache for composed triads
export let diatonicTriadsCacheObject = {};

// A cache for composed sevenths
export let diatonicSeventhsCacheObject = {};

// Chords
export const CHORD_DICTIONARY_OBJECT = {  
  '32': ['b5', 'Flat Five', flatFive],
  '16': ['5', 'Power', power],
  '1280': ['_ add(b2)', 'Minor Add Flat Two', undefined],
  '1152': ['Δ add(b2)', 'Add Flat Two', undefined],
  '1088': ['sus(b2/4)', 'Suspended Flat Two Four', undefined],
  '1056': ['sus(b2)b5', 'Suspended Flat Two Flat Five', undefined],
  '1040': ['sus(b2)', 'Suspended Flat Two', undefined],
  '1032': ['sus(b2)#5', 'Suspended Flat Two Sharp Five', undefined],
  '1028': ['6sus(b2)', 'Suspended Sixth Flat Two', undefined],
  '1026': ['7(b9)sus', 'Suspended Seventh Flat Nine', undefined],
  '1025': ['Δ7sus(b9)', 'Suspended Major Seventh Flat Nine', undefined],
  '768': ['_ add(2)', 'Minor Add Two', undefined],
  '640': ['Δ add2', 'Add Two', undefined],
  '528': ['sus2', 'Suspended Second', suspendedSecond],
  '288': ['°', 'Diminished', diminished],
  '272': ['_', 'Minor', minor],
  '264': ['_#5', 'Minor Sharp Five', minorSharpFive],
  '160': ['Δ(b5)', 'Major Flat Five', majorFlatFive],
  '144': ['Δ', 'Major', major],
  '136': ['+', 'Augmented', augmented],
  '80': ['sus4', 'Suspended', suspended],
  '832': ['_ add(2) add(4)', 'Minor Add Two Add Four', undefined],
  '800': ['° add(2)', 'Diminished Add Two', undefined],
  '784': ['_ add(2)', 'Minor Add Two', undefined],
  '776': ['_#5 add(2)', 'Minor Sharp Five Add Two', undefined],
  '656': ['Δ add(2)', 'Add Two', undefined],
  '530': ['9sus2', 'Dominant Ninth Suspended Second', dominantNinthSuspendedSecond],
  '336': ['_ add(4)', 'Minor Add Four', minorAddFour],
  '292': ['°7', 'Diminished Seventh', diminishedSeventh],
  '290': ['ø7', 'Half Diminished Seventh', halfDiminishedSeventh],
  '289': ['°Δ7', 'Diminished Major Seventh', diminishedMajorSeventh],
  '276': ['_6', 'Minor Sixth', minorSixth],
  '274': ['_7', 'Minor Seventh', minorSeventh],
  '273': ['_Δ7', 'Minor Major Seventh', minorMajorSeventh],
  '266': ['_7#5', 'Minor Seventh Sharp Five', minorSeventhSharpFive],
  '208': ['Δ add(4)', 'Add Four', addFour],
  '162': ['7(b5)', 'Dominant Seventh Flat Five', dominantSeventhFlatFive],
  '148': ['Δ6', 'Major Sixth', majorSixth],
  '146': ['7', 'Dominant Seventh', dominantSeventh],
  '145': ['Δ7', 'Major Seventh', majorSeventh],
  '138': ['7(#5)', 'Dominant Seventh Sharp Five', dominantSeventhSharpFive],
  '137': ['Δ7#5', 'Major Seventh Sharp Five', majorSeventhSharpFive],
  '1186': ['7b5(b9)', 'Dominant Seventh Flat Five Flat Nine', dominantSeventhFlatFiveFlatNine],
  '1170': ['7(b9)', 'Dominant Seventh Flat Nine', dominantSeventhFlatNine],
  '1162': ['7(#5)b9', 'Dominant Seventh Sharp Five Flat Nine', dominantSeventhSharpFiveFlatNine],
  '804': ['°6/9', 'Diminished Six Nine', diminishedSixNine],
  '788': ['_6/9', 'Minor Six Nine', minorSixNine],
  '786': ['_9', 'Minor Ninth', minorNinth],
  '785': ['_Δ9', 'Minor Major Ninth', minorMajorNinth],
  '674': ['9b5', 'Dominant Ninth Flat Five', dominantNinthFlatFive],
  '660': ['6/9', 'Six Nine', sixNine],
  '658': ['9', 'Dominant Ninth', dominantNinth],
  '657': ['Δ9', 'Major Ninth', majorNinth],
  '650': ['9(#5)', 'Dominant Ninth Sharp Five', dominantNinthSharpFive],
  '649': ['Δ9#5', 'Major Ninth Sharp Five', majorNinthSharpFive],
  '594': ['9/11sus2', 'Dominant Nine Eleven Suspended Second', dominantNineElevenSuspendedSecond],
  '418': ['7b5(#9)', 'Dominant Seventh Flat Five Sharp Nine', dominantSeventhFlatFiveSharpNine],
  '402': ['7(#9)', 'Dominant Seventh Sharp Nine', dominantSeventhSharpNine],
  '394': ['7(#5)#9', 'Dominant Seventh Sharp Five Sharp Nine', dominantSeventhSharpFiveSharpNine],
  '354': ['ø7 add(4)', 'Half Diminished Seventh Add Four', halfDiminishedSeventhAddFour],
  '340': ['_6/11', 'Minor Six Eleven', minorSixEleven],
  '330': ['_11#5', 'Minor Eleventh Sharp Five', minorEleventhSharpFive],
  '293': ['°Δ13', 'Diminished Major Thirteenth', diminishedMajorThirteenth],
  '178': ['7(#11)', 'Dominant Seventh Sharp Eleven', dominantSeventhSharpEleven],
  '177': ['Δ7(#11)', 'Major Seventh Sharp Eleven', majorSeventhSharpEleven],
  '86': ['11sus4 add(6)', 'Dominant Eleventh Suspended Add Six', dominantEleventhSuspendedAddSix],
  '852': ['_6/9 add(4)', 'Minor Six Nine Add Four', minorSixNineAddFour],
  '850': ['_11', 'Minor Eleventh', minorEleventh],
  '849': ['_Δ11', 'Minor Major Eleventh', minorMajorEleventh],
  '820': ['_6/9 add(b5)', 'Minor Six Nine Add Flat Five', minorSixNineAddFlatFive],
  '724': ['6/9 add(4)', 'Six Nine Add Four', sixNineAddFour],
  '722': ['11', 'Dominant Eleventh', dominantEleventh],
  '721': ['Δ11', 'Major Eleventh', majorEleventh],
  '692': ['6/9 add(b5)', 'Six Nine Add Flat Five', sixNineAddFlatFive],
  '689': ['Δ9 add(b5)', 'Major Ninth Add Flat Five', majorNinthAddFlatFive],
  '598': ['13sus2', 'Dominant Thirteenth Suspended Second', dominantThirteenthSuspendedSecond],
  '854': ['_13', 'Minor Thirteenth', minorThirteenth],
  '853': ['_Δ13', 'Minor Major Thirteenth', minorMajorThirteenth],
  '726': ['13', 'Dominant Thirteenth', dominantThirteenth],
  '725': ['Δ13', 'Major Thirteenth', majorThirteenth]
}

export const CHORD_FUNCTION_DICTIONARY_OBJECT = {
  'tonic': tonic,
  'tonic7': tonic7,
  'supertonic': supertonic,
  'supertonic7': supertonic7,
  'mediant': mediant,
  'mediant7': mediant7,
  'subdominant': subdominant,
  'subdominant7': subdominant7,
  'dominant': dominant,
  'dominant7': dominant7,
  'submediant': submediant,
  'submediant7': subdominant7,
  'subtonic': subtonic,
  'subtonic7': subtonic7
}

// ---------- Diatonic Chords ------------------------

export function triad(bassNote, key) {
  /*
    Return the diatonic triad chord with bass note in key.

    Examples:
    triad('E', 'C')
    ['E', 'G', 'B']
    triad('E', 'B')
    ['E', 'G#', 'B']
  */
    
  return [bassNote, intervals.getDiatonicThird(bassNote, key), intervals.getDiatonicFifth(bassNote, key)];
}

export function allTriads(key) {
  /* 
    Return all the diatonic triad chords in a key.
    Implemented using a cache.
  */
  
  let allTriadChords = keys.getNotesInKey(key).map(element =>
    {return triad(element, key)});

  diatonicTriadsCacheObject[key] = allTriadChords;

  return allTriadChords;
}

export function seventh(bassNote, key) {
  /*
    Build a diatonic seventh chord on the bass note.

    Examples:
    seventh('C', 'C')
    ['C', 'E', 'G', 'B']
  */
  let chord = triad(bassNote, key);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }
  
  chord.push(intervals.getDiatonicSeventh(bassNote, key))

  return chord;
}

export function allSevenths(key) {
  /*
    Return all the diatonic seventh chords in a key.
    Implemented using a cache.
  */
  
  let allSeventhChords = keys.getNotesInKey(key).map(element =>
                         {return seventh(element, key)});
  
  diatonicSeventhsCacheObject[key] = allSeventhChords;
  
  return allSeventhChords;
}

// ---------- Absolute Chords (Intervals) ------------

export function flatFive(bassNote) {
  /*
    Build a flat five chord [m5, b5] on the bass note.
    1-b5

    Examples:
    flatFive('C')
    ['C', 'Gb']
  */
  
  return [bassNote,
          intervals.getMinorFifth(bassNote)];
}

export function power(bassNote) {
  /*
    Build a power chord [5] on the bass note.
    1-5

    Examples:
    five('C')
    ['C', 'G']
  */
  
  return [bassNote,
          intervals.getMajorFifth(bassNote)];
}

// ---------- Absolute Chords (3 Notes) --------------

export function suspendedSecond(bassNote) {
  /*
    Build a suspended second chord [M] on the bass note.
    1-2-5

    Examples:
    suspended('C')
    ['C', 'D', 'G']
  */
  
  return [bassNote,
          intervals.getMajorSecond(bassNote),
          intervals.getPerfectFifth(bassNote)];
}

export function diminished(bassNote) {
  /*
    Build a diminished chord [dim, °] on the bass note.
    1-b3-b5

    Examples:
    diminished('C')
    ['C', 'Eb', 'Gb']
  */
 
  return [bassNote,
          intervals.getMinorThird(bassNote),
          intervals.getMinorFifth(bassNote)];
}

export function minor(bassNote) {
  /*
    Build a minor chord [m] on the bass note.
    1-b3-5

    Examples:
    minor('C')
    ['C', 'Eb', 'G']
  */
  
  return [bassNote,
          intervals.getMinorThird(bassNote),
          intervals.getPerfectFifth(bassNote)];
}

export function minorSharpFive(bassNote) {
  /*
    Build a minor sharp five chord [m] on the bass note.
    1-b3-#5

    Examples:
    minor('C')
    ['C', 'Eb', 'G#']
  */
 
  return [bassNote,
          intervals.getMinorThird(bassNote),
          notes.augment(intervals.getPerfectFifth(bassNote))];
}

export function majorFlatFive(bassNote) {
  /*
    Build a major flat five chord [M] on the bass note.
    1-3-b5

    Examples:
    majorFlatFive('C')
    ['C', 'E', 'Gb']
  */
  
  return [bassNote,
          intervals.getMajorThird(bassNote),
          intervals.getMinorFifth(bassNote)];
}

export function major(bassNote) {
  /*
    Build a major chord [M] on the bass note.
    1-3-5

    Examples:
    major('C')
    ['C', 'E', 'G']
  */
  
  return [bassNote,
          intervals.getMajorThird(bassNote),
          intervals.getPerfectFifth(bassNote)];
}

export function augmented(bassNote) {
  /*
    Build an augmented chord [aug, +] on the bass note.
    1-3-#5

    Examples:
    augmented('C')
    ['C', 'E', 'G#']
  */
  
  return [bassNote,
          intervals.getMajorThird(bassNote),
          notes.augment(intervals.getMajorFifth(bassNote))];
}

export function suspended(bassNote) {
  /*
    Build a suspended chord [M] on the bass note.
    1-4-5

    Examples:
    suspended('C')
    ['C', 'F', 'G']
  */
  
  return [bassNote,
          intervals.getPerfectFourth(bassNote),
          intervals.getPerfectFifth(bassNote)];
}

// ---------- Absolute Chords (4 Notes) --------------

export function dominantNinthSuspendedSecond(bassNote) {
  /*
    Build a dominant ninth suspended second [9sus2] on the bass note.
    1-5-b7-9(2)

    Examples:
    dominantNinthSuspendedSecond('C')
    ['C', 'G', 'Bb', 'D']
  */
  
  return [bassNote,
          intervals.getPerfectFifth(bassNote),
          intervals.getMinorSeventh(bassNote),
          intervals.getMajorSecond(bassNote)];
}

export function minorAddFour(bassNote) {
  /*
    Build a minor add four chord [m add4] on the bass note.
    1-b3-4-5

    Examples:
    minor('C')
    ['C', 'Eb', 'F', 'G']
  */
 
  return [bassNote,
          intervals.getMinorThird(bassNote),
          intervals.getPerfectFourth(bassNote),
          intervals.getPerfectFifth(bassNote)];
}

export function diminishedSeventh(bassNote) {
  /*
    Build a diminished seventh chord [dim7, °7] on the bass note.
    1-b3-b5-bb7

    Examples:
    diminishedSeventh('C')
    ['C', 'Eb', 'Gb', 'Bbb']
  */
  let chord = diminished(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }
  
  chord.push(notes.diminish(intervals.getMinorSeventh(bassNote)))
  
  return chord;
}

export function halfDiminishedSeventh(bassNote) {
  /*
    Build a half diminished seventh chord [ø7, m7(b5)] on the bass note.
    1-b3-b5-b7

    Examples:
    halfDiminishedSeventh('C')
    ['C', 'Eb', 'Gb', 'Bb']
  */
  let chord = diminished(bassNote);
  
  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }

  chord.push(intervals.getMinorSeventh(bassNote))
  
  return chord;
}

export function diminishedMajorSeventh(bassNote) {
  /*
    Build a diminished major seventh chord [dimM7, °M7] on the bass note.
    1-b3-b5-7

    Examples:
    diminishedMajorSeventh('C')
    ['C', 'Eb', 'Gb', 'B']
  */
  let chord = diminished(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }
  
  chord.push(intervals.getMajorSeventh(bassNote))
  
  return chord;
}

export function minorSixth(bassNote) {
  /*
    Build a minor sixth chord [m6] on the bass note.
    1-b3-5-6

    Examples:
    minorSixth('C')
    ['C', 'Eb', 'G', 'A']
  */
  let chord = minor(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }

  chord.push(intervals.getMajorSixth(bassNote))
  
  return chord;
}

export function minorSeventh(bassNote) {
  /*
    Build a minor seventh chord [m7] on the bass note.
    1-b3-5-b7

    Examples:
    minorSeventh('C')
    ['C', 'Eb', 'G', 'Bb']
  */
  let chord = minor(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }

  chord.push(intervals.getMinorSeventh(bassNote))
   
  return chord;
}

export function minorMajorSeventh(bassNote) {
  /*
    Build a minor major seventh chord [mM7] on the bass note.
    1-b3-5-7

    Examples:
    minorMajorSeventh('C')
    ['C', 'Eb', 'G', 'B']
  */
  let chord = minor(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }

  chord.push(intervals.getMajorSeventh(bassNote))
   
  return chord;
}

export function minorSeventhSharpFive(bassNote) {
  /*
    Build a minor seventh sharp five chord [m7#5] on the bass note.
    1-b3-#5-b7

    Examples:
    minorSeventhSharpFive('C')
    ['C', 'Eb', 'G#', 'Bb']
  */
  
  return [bassNote,
          intervals.getMinorThird(bassNote),
          notes.augment(intervals.getPerfectFifth(bassNote)),
          intervals.getMinorSeventh(bassNote)];
}

export function addFour(bassNote) {
  /*
    Build a add four chord [add4] on the bass note.
    1-3-4-5

    Examples:
    minor('C')
    ['C', 'E', 'F', 'G']
  */
  
  return [bassNote,
          intervals.getMajorThird(bassNote),
          intervals.getPerfectFourth(bassNote),
          intervals.getPerfectFifth(bassNote)];
}

export function dominantSeventhFlatFive(bassNote) {
  /*
    Build a dominant seventh flat five chord [7(b5)] on the bass note.
    1-3-b5-b7

    Examples:
    getDominantSeventhChord('C')
    ['C', 'E', 'Gb', 'Bb']
  */
  let chord = majorFlatFive(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }

  chord.push(intervals.getMinorSeventh(bassNote))
  
  return chord;
}

export function majorSixth(bassNote) {
  /*
    Build a major sixth chord [M6] on the bass note.
    1-3-5-6

    Examples:
    majorSixth('C')
    ['C', 'E', 'G', 'A']
  */
  let chord = major(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }
  
  chord.push(intervals.getMajorSixth(bassNote))
  
  return chord;
}

export function dominantSeventh(bassNote) {
  /*
    Build a dominant seventh chord [7] on the bass note.
    1-3-5-b7

    Examples:
    getDominantSeventhChord('C')
    ['C', 'E', 'G', 'Bb']
  */
  let chord = major(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }

  chord.push(intervals.getMinorSeventh(bassNote))
  
  return chord;
}

export function majorSeventh(bassNote) {
  /*
    Build a major seventh chord [M7] on the bass note.
    1-3-5-7

    Examples:
    majorSeventh('C')
    ['C', 'E', 'G', 'B']
  */
  let chord = major(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }

  chord.push(intervals.getMajorSeventh(bassNote))
   
  return chord;
}

export function dominantSeventhSharpFive(bassNote) {
  /*
    Build a dominant seventh sharp five chord [7(#5)] on the bass note.
    1-3-#5-b7

    Examples:
    getDominantSeventhChord('C')
    ['C', 'E', 'G#', 'Bb']
  */
  let chord = augmented(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }

  chord.push(intervals.getMinorSeventh(bassNote))
  
  return chord;
}

export function majorSeventhSharpFive(bassNote) {
  /*
    Build a major seventh sharp five chord [M7#5] on the bass note.
    1-3-#5-7

    Examples:
    majorSeventhSharpFive('C')
    ['C', 'E', 'G#', 'B']
  */
  let chord = augmented(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }

  chord.push(intervals.getMajorSeventh(bassNote))
   
  return chord;
}

// ---------- Absolute Chords (5 Notes) --------------

export function dominantSeventhFlatFiveFlatNine(bassNote) {
  /*
    Build a dominant seven flat five flat nine chord [7(b5)b9] on the bass note.
    1-3-b5-b7-b9(b2)

    Examples:
    minorMajorNinth('C')
    ['C', 'E', 'Gb', 'Bb', 'Db']
  */
  let chord = dominantSeventhFlatFive(bassNote);
  
  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }

  chord.push(intervals.getMinorSecond(bassNote))
  
  return chord;
}

export function dominantSeventhFlatNine(bassNote) {
  /*
    Build a dominant seventh flat nine chord [7(b9)] on the bass note.
    1-3-5-b7-b9(b2)

    Examples:
    dominantSeventhSharpNine('C')
    ['C', 'E', 'G', 'Bb', 'Db']
  */
  let chord = dominantSeventh(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }
  
  chord.push(intervals.getMinorSecond(bassNote))
  
  return chord;
}

export function dominantSeventhSharpFiveFlatNine(bassNote) {
  /*
    Build a dominant seventh sharp five flat nine chord [7(#5)b9] on the bass note.
    1-3-#5-b7-b9(b2)

    Examples:
    dominantSeventhSharpFiveFlatNine('C')
    ['C', 'E', 'G#', 'Bb', 'Db']
  */
  let chord = dominantSeventhSharpFive(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }
  
  chord.push(intervals.getMinorSecond(bassNote))
 
  return chord;
}

export function diminishedSixNine(bassNote) {
  /*
    Build a diminished six seven chord [°6/9] on the bass note.
    1-b3-b5-6-9(2)

    Examples:
    diminishedSixNine('C')
    ['C', 'Eb', 'Gb', 'A', 'D']
  */
  let chord = diminished(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }

  chord.push(intervals.getMajorSixth(bassNote))

  chord.push(intervals.getMajorSecond(bassNote))
  
  return chord;
}

export function minorSixNine(bassNote) {
  /*
    Build a minor six nine [m6/9] on the bass note.
    1-b3-5-6-9(2)

    Examples:
    minorSixth('C')
    ['C', 'Eb', 'G', 'A', 'D']
  */
  let chord = minorSixth(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }

  chord.push(intervals.getMajorSecond(bassNote))
  
  return chord;
}

export function minorNinth(bassNote) {
  /*
    Build a minor ninth chord [m9] on the bass note.
    1-b3-5-b7-9(2)

    Examples:
    minorNinth('C')
    ['C', 'Eb', 'G', 'Bb', 'D']
  */
  let chord = minorSeventh(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }

  chord.push(intervals.getMajorSecond(bassNote))
  
  return chord;
}

export function minorMajorNinth(bassNote) {
  /*
    Build a minor major ninth chord [mM9] on the bass note.
    1-b3-5-7-9(2)

    Examples:
    minorMajorNinth('C')
    ['C', 'Eb', 'G', 'B', 'D']
  */
  let chord = minorMajorSeventh(bassNote);
  
  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }

  chord.push(intervals.getMajorSecond(bassNote))
  
  return chord;
}

export function dominantNinthFlatFive(bassNote) {
  /*
    Build a dominant ninth flat five chord [9(b5)] on the bass note.
    1-3-b5-b7-9(2)

    Examples:
    dominantNinthFlatFive('C')
    ['C', 'E', 'Gb', 'Bb', 'D']
  */
  let chord = dominantSeventhFlatFive(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }
  
  chord.push(intervals.getMajorSecond(bassNote))
 
  return chord;
}

export function sixNine(bassNote) {
  /*
    Build a seven six [6/9] on the bass note.
    1-3-5-6-9(2)

    Examples:
    majorSixth('C')
    ['C', 'E', 'G', 'A', 'D']
  */
  let chord = majorSixth(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }
  
  chord.push(intervals.getMinorSecond(bassNote))
  
  return chord;
}

export function dominantNinth(bassNote) {
  /*
    Build a dominant ninth chord [9] on the bass note.
    1-3-5-b7-9(2)

    Examples:
    dominantNinth('C')
    ['C', 'E', 'G', 'Bb', 'D']
  */
  let chord = dominantSeventh(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }
  
  chord.push(intervals.getMajorSecond(bassNote))
  
  return chord;
}

export function majorNinth(bassNote) {
  /*
    Build a major ninth chord [M9] on the bass note.
    1-3-5-7-9(2)

    Examples:
    majorNinth('C')
    ['C', 'E', 'G', 'B', 'D']
  */
  let chord = majorSeventh(bassNote);
  
  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }

  chord.push(intervals.getMajorSecond(bassNote))
  
  return chord;
}

export function dominantNinthSharpFive(bassNote) {
  /*
    Build a dominant ninth sharp five chord [9(#5)] on the bass note.
    1-3-#5-b7-9(2)

    Examples:
    dominantNinthSharpFive('C')
    ['C', 'E', 'G#', 'Bb', 'D']
  */
  let chord = dominantSeventhSharpFive(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }
  
  chord.push(intervals.getMajorSecond(bassNote))
 
  return chord;
}

export function majorNinthSharpFive(bassNote) {
  /*
    Build a major ninth sharp five chord [+M9] on the bass note.
    1-3-#5-7-9(2)

    Examples:
    majorNinthSharpFive('C')
    ['C', 'E', 'G#', 'B', 'D']
  */
  let chord = majorSeventhSharpFive(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }
  
  chord.push(intervals.getMajorSecond(bassNote))
  
  return chord;
}

export function dominantNineElevenSuspendedSecond(bassNote) {
  /*
    Build a dominant nine eleven suspended second chord [9/11sus2] on the bass note.
    1-5-b7-9(2)-11(4)

    Examples:
    getDominantEleventhChord('C')
    ['C', 'G', 'Bb', 'D', 'F']
  */
  if (!notes.isNoteValid(bassNote)) {
    return `${bassNote} is not a valid note.`;
  } 

  return [bassNote,
          intervals.getPerfectFifth(bassNote),
          intervals.getMinorSeventh(bassNote),
          intervals.getMajorSecond(bassNote),
          intervals.getPerfectFourth(bassNote)];
}

export function dominantSeventhFlatFiveSharpNine(bassNote) {
  /*
    Build a dominant seven flat five sharp nine chord [7(b5)#9] on the bass note.
    1-3-b5-b7-#9(#2)

    Examples:
    minorMajorNinth('C')
    ['C', 'E', 'Gb', 'Bb', 'D#']
  */
  let chord = dominantSeventhFlatFive(bassNote);
  
  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }

  chord.push(notes.augment(intervals.getMajorSecond(bassNote)))
  
  return chord;
}

export function dominantSeventhSharpNine(bassNote) {
  /*
    Build a dominant seven sharp nine chord [7#9] HENDRIX on the bass note.
    1-3-5-b7-#9(#2)

    Examples:
    dominantSeventhSharpNine('C')
    ['C', 'E', 'G', 'Bb', 'D#']
  */
  let chord = dominantSeventh(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }
  
  chord.push(notes.augment(intervals.getMajorSecond(bassNote)))
  
  return chord;
}

export function dominantSeventhSharpFiveSharpNine(bassNote) {
  /*
    Build a dominant seventh sharp five sharp nine chord [7(#5)#9] on the bass note.
    1-3-#5-b7-#9(#2)

    Examples:
    dominantSeventhSharpFiveSharpNine('C')
    ['C', 'E', 'G#', 'Bb', 'D#']
  */
  let chord = dominantSeventhSharpFive(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }
  
  chord.push(notes.augment(intervals.getMajorSecond(bassNote)))
 
  return chord;
}

export function halfDiminishedSeventhAddFour(bassNote) {
  /*
    Build a half diminished seventh add four chord [ø7 add4] on the bass note.
    1-b3-4-b5-b7

    Examples:
    halfDiminishedSeventhEleven('C')
    ['C', 'Eb', 'F', 'Gb', 'Bb']
  */
  
  return [bassNote,
          intervals.getMinorThird(bassNote),
          intervals.getPerfectFourth(bassNote),
          intervals.getMinorFifth(bassNote),
          intervals.getMinorSeventh(bassNote)];
}

export function minorSixEleven(bassNote) {
  /*
    Build a minor sixth eleven chord [m6/11] on the bass note.
    1-b3-5-6-11(4)

    Examples:
    halfDiminishedSeventhEleven('C')
    ['C', 'Eb', 'G', 'A', 'F']
  */
  let chord = minorSixth(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }

  chord.push(intervals.getPerfectFourth(bassNote))
  
  return chord;
}

export function minorEleventhSharpFive(bassNote) {
  /*
    Build a minor eleventh sharp five chord [mM11] on the bass note.
    1-b3-#5-b7-11(4)

    Examples:
    minorEleventhSharpFive('C')
    ['C', 'Eb', 'G#', 'Bb', 'F']
  */
  let chord = minorSeventhSharpFive(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }

  chord.push(intervals.getPerfectFourth(bassNote))
  
  return chord;
}

export function diminishedMajorThirteenth(bassNote) {
  /*
    Build a diminished major thirteenth chord [dim maj13] on the bass note.
    1-b3-b5-7-13(6)

    Examples:
    diminishedMajorThirteenth('C')
    ['C', 'Eb', 'Gb', 'B', 'A']
  */
  let chord = diminished(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }

  chord.push(intervals.getMajorSeventh(bassNote))

  chord.push(intervals.getMajorSixth(bassNote))  
  
  return chord;
}

export function dominantSeventhSharpEleven(bassNote) {
  /*
    Build a dominant seventh sharp eleven chord [7#11] on the bass note.
    1-3-5-b7-#11(#4)

    Examples:
    dominantEleventh('C')
    ['C', 'E', 'G', 'Bb', 'F#']
  */
  let chord = dominantSeventh(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }

  chord.push(notes.augment(intervals.getPerfectFourth(bassNote)))

  return chord;
}

export function majorSeventhSharpEleven(bassNote) {
  /*
    Build a major seventh sharp eleven chord [M7(#11)] on the bass note.
    1-3-5-7-#11(#4)

    Examples:
    majorSeventhSharpEleven('C')
    ['C', 'E', 'G', 'B', 'D', 'F#']
  */
  let chord = majorSeventh(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }

  // Get the Eleventh
  chord.push(notes.augment(intervals.getPerfectFourth(bassNote)))

  return chord;
}

export function dominantEleventhSuspendedAddSix(bassNote) {
  /*
    Build a dominant eleventh suspended add six [11sus4 add6] on the bass note.
    1-4-5-6-b7 

    Examples:
    dominantEleventhSuspendedAddSix('C')
    ['C', 'F', 'G', 'A', 'Bb']
  */
  let chord = suspended(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }
  
  chord.push(intervals.getMajorSixth(bassNote))

  chord.push(intervals.getMinorSeventh(bassNote))

  return chord;
}

// ---------- Absolute Chords (6 Notes) --------------

export function minorSixNineAddFour(bassNote) {
  /*
    Build a minor six nine add four chord [m6/9 add4] on the bass note.
    1-b3-4-5-6-9(2)

    Examples:
    minorSixNineAddFour('C')
    ['C', 'Eb', 'F', 'G', 'A', 'D']
  */
   
  return [bassNote,
    intervals.getMinorThird(bassNote),
    intervals.getPerfectFourth(bassNote),
    intervals.getPerfectFifth(bassNote),    
    intervals.getMajorSixth(bassNote),
    intervals.getMajorSecond(bassNote)];
}

export function minorEleventh(bassNote) {
  /*
    Build a minor eleventh chord [m11] on the bass note.
    1-b3-5-b7-9(2)-11(4)

    Examples:
    minorEleventh('C')
    ['C', 'Eb', 'G', 'Bb', 'D', 'F']
  */
  let chord = minorNinth(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }

  chord.push(intervals.getPerfectFourth(bassNote))
  
  return chord;
}

export function minorMajorEleventh(bassNote) {
  /*
    Build a minor major eleventh chord [mM11] on the bass note.
    1-b3-5-7-9(2)-11(4)

    Examples:
    minorMajorEleventh('C')
    ['C', 'Eb', 'G', 'B', 'D', 'F']
  */
  let chord = minorMajorNinth(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }

  chord.push(intervals.getPerfectFourth(bassNote))
  
  return chord;
}

export function minorSixNineAddFlatFive(bassNote) {
  /*
    Build a minor six nine add flat five chord [m6/9 addb5] on the bass note.
    1-b3-b5-5-6-9(2)

    Examples:
    minorSixNineAddFlatFive('C')
    ['C', 'Eb', 'Gb', 'G', 'A', 'D']
  */
 
  return [bassNote,
    intervals.getMinorThird(bassNote),
    intervals.getPerfectFourth(bassNote),
    intervals.getMinorFifth(bassNote),    
    intervals.getMajorSixth(bassNote),
    intervals.getMajorSecond(bassNote)];
}

export function sixNineAddFour(bassNote) {
  /*
    Build a six nine add four chord [6/9 add4] on the bass note.
    1-3-4-5-6-9(2)

    Examples:
    sixNineAddFour('C')
    ['C', 'E', 'F', 'G', 'A', 'D']
  */
    
  return [bassNote,
    intervals.getMajorThird(bassNote),
    intervals.getPerfectFourth(bassNote),
    intervals.getPerfectFifth(bassNote),
    intervals.getMajorSixth(bassNote),
    intervals.getMajorSecond(bassNote)];
}

export function dominantEleventh(bassNote) {
  /*
    Build a dominant eleventh chord [11] on the bass note.
    1-3-5-b7-9(2)-11(4)

    Examples:
    getDominantEleventhChord('C')
    ['C', 'E', 'G', 'Bb', 'D', 'F']
  */
  let chord = dominantNinth(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }

  chord.push(intervals.getPerfectFourth(bassNote))

  return chord;
}

export function majorEleventh(bassNote) {
  /*
    Build a major eleventh chord [M11] on the bass note.
    1-3-5-7-9(2)-11(4)

    Examples:
    majorEleventh('C')
    ['C', 'E', 'G', 'B', 'D', 'F']
  */
  let chord = majorNinth(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }

  // Get the Eleventh
  chord.push(intervals.getPerfectFourth(bassNote))

  return chord;
}

export function sixNineAddFlatFive(bassNote) {
  /*
    Build a six nine add flat five chord [6/9 addb5] on the bass note.
    1-3-b5-5-6-9(2)

    Examples:
    minorSixNineAddFlatFive('C')
    ['C', 'E', 'Gb', 'G', 'A', 'D']
  */
  
  return [bassNote,
    intervals.getMajorThird(bassNote),
    intervals.getMinorFifth(bassNote),
    intervals.getPerfectFifth(bassNote),
    intervals.getMajorSixth(bassNote),
    intervals.getMajorSecond(bassNote)];
}

export function majorNinthAddFlatFive(bassNote) {
  /*
    Build a major ninth add flat five chord [M9 addb5] on the bass note.
    1-3-b5-5-7-9(2)

    Examples:
    majorNinthAddFlatFive('C')
    ['C', 'E', 'Gb', 'G', 'B', 'D']
  */
  
  return [bassNote,
    intervals.getMajorThird(bassNote),
    intervals.getMinorFifth(bassNote),
    intervals.getPerfectFifth(bassNote),
    intervals.getMajorSeventh(bassNote),
    intervals.getMajorSecond(bassNote)];
}

export function dominantThirteenthSuspendedSecond(bassNote) {
  /*
    Build a dominant thirteenth suspended second chord [13sus2] on the bass note.
    1-5-b7-9(2)-11(4)-13(6) 

    Examples:
    dominantThirteenthSuspendedSecond('C')
    ['C', 'G', 'Bb', 'D', 'F', 'A']
  */
  
  return [bassNote,
    intervals.getPerfectFifth(bassNote),
    intervals.getMinorSeventh(bassNote),
    intervals.getMajorSecond(bassNote),
    intervals.getPerfectFourth(bassNote),
    intervals.getMajorSixth(bassNote)];
}

// ---------- Absolute Chords (7 Notes) --------------

export function minorThirteenth(bassNote) {
  /*
    Build a minor thirteenth chord [m13] on the bass note.
    1-b3-5-b7-9(2)-11(4)-13(6)

    Examples:
    minorThirteenth('C')
    ['C', 'Eb', 'G', 'Bb', 'D', 'F', 'A']
  */
  let chord = minorEleventh(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }

  // Get the Thirteeth
  chord.push(intervals.getMajorSixth(bassNote))

  return chord;
}

export function minorMajorThirteenth(bassNote) {
  /*
    Build a minor thirteenth chord [mM13] on the bass note.
    1-b3-5-7-9(2)-11(4)-13(6)

    Examples:
    minorMajorThirteenth('C')
    ['C', 'Eb', 'G', 'B', 'D', 'F', 'A']
  */
  let chord = minorMajorEleventh(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }

  // Get the Thirteeth
  chord.push(intervals.getMajorSixth(bassNote))

  return chord;
}

export function dominantThirteenth(bassNote) {
  /*
    Build a dominant thirteenth chord [13] on the bass note.
    1-3-5-b7-9(2)-11(4)-13(6) 

    Examples:
    dominantThirteenth('C')
    ['C', 'E', 'G', 'Bb', 'D', 'F', 'A']
  */
  let chord = dominantEleventh(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }
  
  // Get the Thirteeth
  chord.push(intervals.getMajorSixth(bassNote))

  return chord;
}

export function majorThirteenth(bassNote) {
  /*
    Build a major thirteenth chord [13] on the bass note.
    1-3-5-7-9(2)-11(4)-13(6) 

    Examples:
    dominantThirteenth('C')
    ['C', 'E', 'G', 'B', 'D', 'F', 'A']
  */
  let chord = majorEleventh(bassNote);

  // If Error occured
  if (!Array.isArray(chord)) {
    return chord;
  }
  
  // Get the Thirteeth
  chord.push(intervals.getMajorSixth(bassNote))

  return chord;
}

// ---------- Harmonic Function ----------------------

export function tonic(key) {
  // Return the tonic chord in a key  
  allTriads(key);
  return diatonicTriadsCacheObject[key][0];
}

export function tonic7(key) {
  // Return the tonic seventh chord in a key  
  allSevenths(key);
  return diatonicSeventhsCacheObject[key][0];
}

export function supertonic(key) {
  // Return the supertonic chord in a key
  allTriads(key);
  return diatonicTriadsCacheObject[key][1];
}

export function supertonic7(key) {
  // Return the supertonic seventh chord in a key
  allSevenths(key);
  return diatonicSeventhsCacheObject[key][1];
}

export function mediant(key) {
  // Return the mediant chord in a key
  allTriads(key);
  return diatonicTriadsCacheObject[key][2];
}

export function mediant7(key) {
  // Return the mediant seventh chord in a key
  allSevenths(key);
  return diatonicSeventhsCacheObject[key][2];
}

export function subdominant(key) {
  // Return the subdominant chord in a key
  allTriads(key);
  return diatonicTriadsCacheObject[key][3];
}

export function subdominant7(key) {
  // Return the subdominant seventh chord in a key
  allSevenths(key);
  return diatonicSeventhsCacheObject[key][3];
}

export function dominant(key) {
  // Return the dominant chord in a key
  allTriads(key);
  return diatonicTriadsCacheObject[key][4];
}

export function dominant7(key) {
  // Return the dominant seventh chord in a key
  allSevenths(key);
  return diatonicSeventhsCacheObject[key][4];
}

export function submediant(key) {
  // Return the submediant chord in a key
  allTriads(key);
  return diatonicTriadsCacheObject[key][5];
}

export function submediant7(key) {
  // Return the submediant seventh chord in a key
  allSevenths(key);
  return diatonicSeventhsCacheObject[key][5];
}

export function subtonic(key) {
  // Return the subtonic chord in a key
  allTriads(key);
  return diatonicTriadsCacheObject[key][6];
}

export function subtonic7(key) {
  // Return the subtonic seventh chord in a key
  allSevenths(key);
  return diatonicSeventhsCacheObject[key][6];
}

// ---------- Harmonic Function (Roman Numeral) ------

export function i(key) {
  // Return the tonic chord in a key
  return tonic(key);
}

export function I(key) {
  // Return the tonic chord in a key
  return tonic(key);
}

export function i7(key) {
  // Return the tonic seventh chord in a key
  return tonic7(key);
}


export function I7(key) {
  // Return the tonic seventh chord in a key
  return tonic7(key);
}

export function ii(key) {
  // Return the supertonic chord in a key
  return supertonic(key);
}

export function II(key) {
  // Return the supertonic chord in a key
  return supertonic(key);
}

export function ii7(key) {
  // Return the supertonic seventh chord in a key
  return supertonic7(key);
}

export function II7(key) {
  // Return the supertonic seventh chord in a key
  return supertonic7(key);
}

export function iii(key) {
  // Return the mediant chord in a key
  return mediant(key);
}

export function III(key) {
  // Return the mediant chord in a key
  return mediant(key);
}

export function iii7(key) {
  // Return the mediant seventh chord in a key
  return mediant7(key);
}

export function III7(key) {
  // Return the supertonic seventh chord in a key
  return mediant7(key);
}

export function iv(key) {
  // Return the subdominant chord in a key
  return subdominant(key);
}

export function IV(key) {
  // Return the subdominant chord in a key
  return subdominant(key);
}

export function iv7(key) {
  // Return the subdominant seventh chord in a key
  return subdominant7(key);
}

export function IV7(key) {
  // Return the subdominant seventh chord in a key
  return subdominant7(key);
}

export function v(key) {
  // Return the dominant chord in a key
  return dominant(key);
}

export function V(key) {
  // Return the dominant chord in a key
  return dominant(key);
}

export function v7(key) {
  // Return the dominant seventh chord in a key
  return dominant7(key);
}

export function V7(key) {
  // Return the dominant seventh chord in a key
  return dominant7(key);
}

export function vi(key) {
  // Return the submediant chord in a key
  return submediant(key);
}

export function VI(key) {
  // Return the submediant chord in a key
  return submediant(key);
}

export function vi7(key) {
  // Return the submediant seventh chord in a key
  return submediant7(key);
}

export function VI7(key) {
  // Return the dominant seventh chord in a key
  return submediant7(key);
}

export function vii(key) {
  // Return the subtonic chord in a key
  return subtonic(key);
}

export function VII(key) {
  // Return the subtonic chord in a key
  return subtonic(key);
}

export function vii7(key) {
  // Return the subtonic seventh chord in a key
  return subtonic7(key);
}

export function VII7(key) {
  // Return the subtonic seventh chord in a key
  return subtonic7(key);
}

// ---------- Chord Inversion ------------------------

export function invert(chord, inv=1) {
  // Invert a chord num times
  if (!Array.isArray(chord) || inv >= chord.length) {
    return `${chord} is not an array or too many inversions requested.`;
  }

  let inversion = chord;

  for (let i = 0; i < inv; i++) {
    inversion = [
      ...inversion.slice(-1),
      ...inversion.slice(0, -1)
     ] 
  }

  return inversion;
}

// ---------- Chord Inversion (3+ note chords) -------

export function firstInversion(chord) {
  return invert(chord);
}

export function secondInversion(chord) {
  return invert(chord, 2);
}

// ---------- Chord Inversion (4+ note chords) -------

export function thirdInversion(chord) {
  return invert(chord, 3);
}

// ---------- Chord Inversion (5+ note chords) -------

export function fourthInversion(chord) {
  return invert(chord, 4);
}

// ---------- Chord Inversion (6+ note chords) -------

export function fifthInversion(chord) {
  return invert(chord, 5);
}

// ---------- Chord Inversion (7+ note chords) -------

export function sixthInversion(chord) {
  return invert(chord, 6);
}

// ---------- Chord Inversion (8+ note chords) -------

export function seventhInversion(chord) {
  return invert(chord, 7);
}

// ---------- Chord Inversion (9+ note chords) -------

export function eighthInversion(chord) {
  return invert(chord, 8);
}

// ---------- Chord Inversion (10+ note chords) ------

export function ninthInversion(chord) {
  return invert(chord, 9);
}

// ---------- Chord Inversion (11+ note chords) ------

export function tenthInversion(chord) {
  return invert(chord, 10);
}

// ---------- Chord Inversion (12+ note chords) ------

export function eleventhInversion(chord) {
  return invert(chord, 11);
}

// ---------- Chord Identification -------------------

export function nameChord(chord, shorthand=false, noInversions=false) {
  /*
    Name a chord provided as an array of valid musical note strings.

    This function can determine almost every chord, from a simple triad to a
    fourteen note polychord.
  */
  if (chord === []) {
    return [];
  }

  if (chord.length === 1) {return chord;}

  if (chord.length === 2) {return intervals.getIntervalBetween(chord[0], chord[1]);}

  if (chord.length === 3) {return determineTriad(chord, shorthand, noInversions);}

  if (chord.length === 4) {return determineChord4(chord, shorthand, noInversions);}

  if (chord.length === 5) {return determineExtChord5(chord, shorthand, noInversions);}

  if (chord.length === 6) {return determineExtChord6(chord, shorthand, noInversions);}

  if (chord.length === 7) {return determineExtChord7(chord, shorthand, noInversions);}

  if (7 < chord.length && chord.length <= 14) {
    return determinePolyChords(chord, shorthand);
  }
}

export function determineTriad(chord, shorthand=false, noInversions=false) {
  /*
    Name the triad; return answers in an array (or array of arrays if inversions included).

    The third argument should not be given. If shorthand is true the answers will be in
    abbreviated form.

    This function can determine major, minor, diminished and suspended triads. Also knows
    about inversions.

    Examples:
    determineTriad(['A', 'C', 'E'])
    ['A minor triad', 'C major sixth, second inversion']
    determineTriad(['C', 'E', 'A'])
    ['C major sixth', 'A minor triad, first inversion']
    determineTriad(['A', 'C', 'E'], true)
    ['Am', 'CM6']
  */
  if (chord.length !== 3) {
    return `${chord} is not a valid triad.`;
  }

  function inversionCheck(triad, shorthand, tries, result) {
    // Checks every inversion and saves the result.
    let interval1 = intervals.getIntervalBetween(triad[0], triad[1], true);
    let interval2 = intervals.getIntervalBetween(triad[0], triad[2], true);

    function addResult(shortName) {
      result.push([shortName, tries, triad[0]]);
    }
   
    let combined = utils.chordToBitmask(interval1, interval2, null, null, null, null);

    if (combined === 1280) {(addResult('1280'))} // _ add(b2)
    if (combined === 1152) {(addResult('1152'))} // Δ add(b2)
    if (combined === 1088) {(addResult('1088'))} // sus(b2/4)
    if (combined === 1056) {(addResult('1056'))} // sus(b2)b5
    if (combined === 1040) {(addResult('1040'))} // sus(b2)

    if (combined === 1032) {(addResult('1032'))} // sus(b2)#5
    if (combined === 1028) {(addResult('1028'))} // 6sus(b2)
    if (combined === 1026) {(addResult('1026'))} // 7(b9)sus
    if (combined === 1025) {(addResult('1025'))} // Δ7sus(b9)
    if (combined === 768) {(addResult('768'))} // _ add(2)

    if (combined === 640) {(addResult('640'))} // Δ add2
    if (combined === 528) {(addResult('528'))} // sus2
    if (combined === 320) {(addResult('336'))} // _ add(4)
    if (combined === 288) {(addResult('288'))} // °
    if (combined === 272) {(addResult('272'))} // _

    if (combined === 264) {(addResult('264'))} // _#5
    if (combined === 260) {(addResult('276'))} // _6
    if (combined === 258) {(addResult('274'))} // _7
    if (combined === 257) {(addResult('273'))} // _Δ7
    if (combined === 192) {(addResult('208'))} // Δ add(4)

    if (combined === 160) {(addResult('160'))} // Δ(b5)
    if (combined === 144) {(addResult('144'))} // Δ
    if (combined === 136) {(addResult('136'))} // +   
    if (combined === 132) {(addResult('148'))} // Δ6
    if (combined === 130) {(addResult('146'))} // 7
    
    if (combined === 129) {(addResult('145'))} // Δ7
    if (combined === 80) {(addResult('80'))} // sus4

    if (tries !== 3 && !noInversions) {
      return inversionCheck([...triad.slice(-1),
                             ...triad.slice(0, -1)], shorthand, tries + 1, result)
    } else {
      let finalChordNameList = processChordNameResults(result, shorthand);
      return finalChordNameList;
    }
  }

  return inversionCheck(chord, shorthand, 1, [])
}

export function determineChord4(chord, shorthand=false, noInversions=false) {
  /*
    Name the four note chord (typically are seventh chords); return answers in an array
    (or array of arrays if inversions included).

    The third argument should not be given. If shorthand is true the answers will be in
    abbreviated form.
  */
  if (chord.length !== 4) {
    return `${chord} is not a valid seventh chord.`;
  }

  function inversionCheck(tetraChord, shorthand, tries, result) {
    // Checks every inversion and saves the result.
    // Check whether the first three notes of seventh are part of some triad.
    let interval1 = intervals.getIntervalBetween(tetraChord[0], tetraChord[1], true);
    let interval2 = intervals.getIntervalBetween(tetraChord[0], tetraChord[2], true);
    let interval3 = intervals.getIntervalBetween(tetraChord[0], tetraChord[3], true);

    function addResult(shortName) {
      result.push([shortName, tries, tetraChord[0]]);
    }

    let combined = utils.chordToBitmask(interval1, interval2, interval3, null, null, null);

    if (combined === 832) {(addResult('832'))} // _ add(2) add(4)
    if (combined === 800) {(addResult('800'))} // ° add(2)
    if (combined === 784) {(addResult('784'))} // _ add(2)
    if (combined === 776) {(addResult('776'))} // _#5 add(2)
    if (combined === 656) {(addResult('656'))} // Δ add(2)

    if (combined === 644) {(addResult('660'))} // 6/9
    if (combined === 642) {(addResult('658'))} // 9
    if (combined === 641) {(addResult('657'))} // Δ9
    if (combined === 530) {(addResult('530'))} // 9sus2
    if (combined === 336) {(addResult('336'))} // _ add(4)

    if (combined === 292) {(addResult('292'))} // °7
    if (combined === 290) {(addResult('290'))} // ø7
    if (combined === 289) {(addResult('289'))} // °Δ7
    if (combined === 276) {(addResult('276'))} // _6
    if (combined === 274) {(addResult('274'))} // _7

    if (combined === 273) {(addResult('273'))} // _Δ7
    if (combined === 266) {(addResult('266'))} // _7#5
    if (combined === 208) {(addResult('208'))} // Δ add(4)
    if (combined === 162) {(addResult('162'))} // 7(b5)
    if (combined === 148) {(addResult('148'))} // Δ6

    if (combined === 146) {(addResult('146'))} // 7
    if (combined === 145) {(addResult('145'))} // Δ7
    if (combined === 138) {(addResult('138'))} // 7#5
    if (combined === 137) {(addResult('137'))} // Δ7#5
    
    if (tries !== 4 && !noInversions) {
      return inversionCheck([...tetraChord.slice(-1),
                             ...tetraChord.slice(0, -1)], shorthand, tries + 1, result)
    } else {
      let finalChordNameList = processChordNameResults(result, shorthand);
      return finalChordNameList;
    }
  }

  return inversionCheck(chord, shorthand, 1, [])
}

export function determineExtChord5(chord, shorthand=false, noInversions=false) {
  /*
    Name the five note chord; return answers in an array (or array of arrays if inversions included).

    The third argument should not be given. If shorthand is true the answers will be in
    abbreviated form.
  */
  if (chord.length !== 5) {
    return `${chord} is not a valid 5-note extended chord.`;
  }

  function inversionCheck(pentaChord, shorthand, tries, result) {
    // Checks every inversion and saves the result.
    // Check whether the first three notes of seventh are part of some triad.
    let interval1 = intervals.getIntervalBetween(pentaChord[0], pentaChord[1], true);
    let interval2 = intervals.getIntervalBetween(pentaChord[0], pentaChord[2], true);
    let interval3 = intervals.getIntervalBetween(pentaChord[0], pentaChord[3], true);
    let interval4 = intervals.getIntervalBetween(pentaChord[0], pentaChord[4], true);

    function addResult(shortName) {
      result.push([shortName, tries, pentaChord[0]]);
    }

    let combined = utils.chordToBitmask(interval1, interval2, interval3, interval4, null, null);     
    
    if (combined === 1186) {(addResult('1186'))} // 7b5(b9)
    if (combined === 1170) {(addResult('1170'))} // 7(b9)
    if (combined === 1162) {(addResult('1162'))} // 7(#5)b9
    if (combined === 804) {(addResult('804'))} // °6/9
    if (combined === 788) {(addResult('788'))} // _6/9

    if (combined === 786) {(addResult('786'))} // _9
    if (combined === 785) {(addResult('785'))} // _Δ9
    if (combined === 674) {(addResult('674'))} // 9b5
    if (combined === 660) {(addResult('660'))} // 6/9
    if (combined === 658) {(addResult('658'))} // 9

    if (combined === 657) {(addResult('657'))} // Δ9
    if (combined === 650) {(addResult('650'))} // 9(#5)
    if (combined === 649) {(addResult('649'))} // Δ9#5
    if (combined === 594) {(addResult('594'))} // 9/11sus2
    if (combined === 418) {(addResult('418'))} // 7b5(#9)

    if (combined === 402) {(addResult('402'))} // 7(#9)
    if (combined === 394) {(addResult('394'))} // 7(#5)#9
    if (combined === 354) {(addResult('354'))} // ø7 add(4)
    if (combined === 340) {(addResult('340'))} // _6/11
    if (combined === 330) {(addResult('330'))} // _11#5

    if (combined === 293) {(addResult('293'))} // °Δ13
    if (combined === 178) {(addResult('178'))} // 7(#11)
    if (combined === 177) {(addResult('177'))} // Δ7(#11)
    if (combined === 86) {(addResult('86'))} // 11sus4 add(6)

    if (tries !== 5 && !noInversions) {
      return inversionCheck([...pentaChord.slice(-1),
                             ...pentaChord.slice(0, -1)], shorthand, tries + 1, result)
    } else {
      let finalChordNameList = processChordNameResults(result, shorthand);
      return finalChordNameList;
    }
  }

  return inversionCheck(chord, shorthand, 1, [])
}

export function determineExtChord6(chord, shorthand=false, noInversions=false) {
  /*
    Name the six note chord; return answers in an array (or array of arrays if inversions included).

    The third argument should not be given. If shorthand is true the answers will be in
    abbreviated form.
  */
  if (chord.length !== 6) {
    return `${chord} is not a valid 6-note extended chord.`;
  }

  function inversionCheck(hexaChord, shorthand, tries, result) {
    // Checks every inversion and saves the result.
    // Check whether the first three notes of seventh are part of some triad.
    let interval1 = intervals.getIntervalBetween(hexaChord[0], hexaChord[1], true);
    let interval2 = intervals.getIntervalBetween(hexaChord[0], hexaChord[2], true);
    let interval3 = intervals.getIntervalBetween(hexaChord[0], hexaChord[3], true);
    let interval4 = intervals.getIntervalBetween(hexaChord[0], hexaChord[4], true);
    let interval5 = intervals.getIntervalBetween(hexaChord[0], hexaChord[4], true);

    function addResult(shortName) {
      result.push([shortName, tries, hexaChord[0]]);
    }

    let combined = utils.chordToBitmask(interval1, interval2, interval3, interval4, interval5, null);     
    
    if (combined === 852) {(addResult('852'))}  // _6/9 add(4)
    if (combined === 850) {(addResult('850'))}  // _11
    if (combined === 849) {(addResult('849'))}  // _Δ11
    if (combined === 820) {(addResult('820'))}  // _6/9 add(b5)
    if (combined === 724) {(addResult('724'))}  // 6/9 add(4)

    if (combined === 722) {(addResult('722'))}  // 11
    if (combined === 721) {(addResult('721'))}  // Δ11
    if (combined === 692) {(addResult('692'))}  // 6/9 add(b5)
    if (combined === 689) {(addResult('689'))}  // Δ9 add(b5)
    if (combined === 598) {(addResult('598'))}  // 13sus2
    
    if (tries !== 6 && !noInversions) {
      return inversionCheck([...hexaChord.slice(-1),
                             ...hexaChord.slice(0, -1)], shorthand, tries + 1, result)
    } else {
      let finalChordNameList = processChordNameResults(result, shorthand);
      return finalChordNameList;
    }
  }

  return inversionCheck(chord, shorthand, 1, [])
}

export function determineExtChord7(chord, shorthand=false, noInversions=false) {
  /*
    Name the seven note chord; return answers in an array (or array of arrays if inversions included).

    The third argument should not be given. If shorthand is true the answers will be in
    abbreviated form.
  */
  if (chord.length !== 7) {
    return `${chord} is not a valid 7-note extended chord.`;
  }

  function inversionCheck(heptaChord, shorthand, tries, result) {
    // Checks every inversion and saves the result.
    // Check whether the first three notes of seventh are part of some triad.
    let interval1 = intervals.getIntervalBetween(heptaChord[0], heptaChord[1], true);
    let interval2 = intervals.getIntervalBetween(heptaChord[0], heptaChord[2], true);
    let interval3 = intervals.getIntervalBetween(heptaChord[0], heptaChord[3], true);
    let interval4 = intervals.getIntervalBetween(heptaChord[0], heptaChord[4], true);
    let interval5 = intervals.getIntervalBetween(heptaChord[0], heptaChord[4], true);
    let interval6 = intervals.getIntervalBetween(heptaChord[0], heptaChord[5], true);

    function addResult(shortName) {
      result.push([shortName, tries, heptaChord[0]]);
    }

    let combined = utils.chordToBitmask(interval1, interval2, interval3, interval4, interval5, interval6);     
    
    if (combined === 854) {(addResult('854'))}  // _13
    if (combined === 853) {(addResult('853'))}  // _Δ13
    if (combined === 726) {(addResult('726'))}  // 13
    if (combined === 725) {(addResult('725'))}  // Δ13
    
    if (tries !== 6 && !noInversions) {
      return inversionCheck([...heptaChord.slice(-1),
                             ...heptaChord.slice(0, -1)], shorthand, tries + 1, result)
    } else {
      let finalChordNameList = processChordNameResults(result, shorthand);
      return finalChordNameList;
    }
  }

  return inversionCheck(chord, shorthand, 1, [])
}

function intervalDescription(tries) {
  // Internal Helper Function - Return the inversion of the chord in a string
  if (tries === 1) {return ''}
  if (tries === 2) {return ', first inversion'}
  if (tries === 3) {return ', second inversion'}
  if (tries === 4) {return ', third inversion'}
  if (tries === 5) {return ', fourth inversion'}
  if (tries === 6) {return ', fifth inversion'}
  if (tries === 7) {return ', sixth inversion'}
}

function processChordNameResults(result, shorthand) {
  /* 
    Internal Helper Fumction - Using the result array generated from any of the
    determineXXXX functions, this function will convert the results array into
    chord names found in the CHORD_DICTIONARY_OBJECT and return an array with
    meaningful chord names.
  */
  let chordAnalysis = [];
  for (let index in result) {
    if (shorthand) {
      let description = `${CHORD_DICTIONARY_OBJECT[result[index][0]][0]}`;
      chordAnalysis.push(`${result[index][2]}`
                          + `${description}`
                          + `${intervalDescription(result[index][1])}`)
    } else {
      let description = `${CHORD_DICTIONARY_OBJECT[result[index][0]][1]}`;
      chordAnalysis.push(`${result[index][2]}`
                          + ` ${description}`
                          + `${intervalDescription(result[index][1])}`)                   
    }
  }
  return chordAnalysis;
}

// ---------- Chord Lookup ---------------------------

export function chordFromShorthand(shortHandString) {
  // Take a chord written in shorthand and return the notes in the chord.
  if (typeof shortHandString !== "string") {
    return `${shortHandString} is not a valid chord shorthand string.`;
  }
  
  // Shorten further
  function shorten(item) {
    return item.replace("min", "_")
          .replace("mi", "_")
          .replace("-", "_")
          .replace("maj", "Δ")
          .replace("ma", "Δ")
          .replace("dim", "°")
          .replace("aug", "+");
  }

  shortHandString = shorten(shortHandString);

  // Local variables
  let otherChordNotesFound = []; 
  let chordNotesFound = [];
  let comments = [];
  let notesInChord = {}; 
  
  // Regex
  const mainRegex = /^([A-Ga-g][#b]*)([^\/\|]*)(\/|\|)?([A-Ga-g][#b]*)?([^\/\|]*)$/;

  let mainMatch = shortHandString.match(mainRegex);

  if (!mainMatch) {
    comments.push('Invalid input.');
    notesInChord.notes = chordNotesFound;
    notesInChord.comments = comments;  
    return notesInChord;
  }

  // Available if mainMatch successfully matched
  let chordRoot = mainMatch[1];
  let chordType = mainMatch[2];
  let slashOrPoly = mainMatch[3];
  let otherChordRoot = mainMatch[4];
  let otherChordType = mainMatch[5];
  
  // Validate and Cleanup Main Chord Root Note
  if (chordRoot && notes.isNoteValid(chordRoot)) {
    chordRoot = notes.reduceAccidentals(chordRoot);
  }

  // Validate and Cleanup Other Chord Root Note (if provided)
  if (otherChordRoot && notes.isNoteValid(otherChordRoot)) {
    otherChordRoot = notes.reduceAccidentals(otherChordRoot);
  }

  // Look for the Main Chord
  if (chordRoot && chordType !== '') {
    for (const chordBitMask in CHORD_DICTIONARY_OBJECT) {
      if (CHORD_DICTIONARY_OBJECT[chordBitMask][0] === chordType) {
        if (CHORD_DICTIONARY_OBJECT[chordBitMask][2] !== undefined) {
          chordNotesFound = CHORD_DICTIONARY_OBJECT[chordBitMask][2](chordRoot);
        }
        
        if (CHORD_DICTIONARY_OBJECT[chordBitMask][2] === undefined) {
          comments.push('No function available to generate Main Chord type.');
        }
      }
    }
  }

  if (chordRoot && chordType === '') {
    chordNotesFound = major(chordRoot);
    comments.push('Chord type assumed to be Major (Δ) for Main Chord.');
  }

  if (chordNotesFound.length === 0 && chordType) {
    chordNotesFound = ['>>> Main Chord not found <<<']
    if (!comments.includes('No function available to generate Main Chord type.')) {
      comments.push('Chord type provided for Main Chord invalid.');
    }
  }

  // Look for Slash Chord (if provided)
  if (slashOrPoly === '/') {
    if (otherChordRoot !== undefined && otherChordRoot !== '') {
      chordNotesFound = [otherChordRoot, ...chordNotesFound];
    }
    
    if (otherChordRoot === undefined || otherChordRoot === '') {
      chordNotesFound = ['>>> Invalid Slash Chord root <<<', ...chordNotesFound];
      comments.push('Slash Chord root note provided is invalid.');
    }
    
    // if (otherChordType !== '' || otherChordType !== undefined) {
    if (otherChordType) {
      comments.push('It is not valid to provide a chord type for the Slash Chord; it has been ignored.');     
    }
  }

  // Look for Poly Chord (if provided)
  if (slashOrPoly === '|') {
    if (otherChordRoot && otherChordType !== '') {      
      for (const chordBitMask in CHORD_DICTIONARY_OBJECT) {
        if (CHORD_DICTIONARY_OBJECT[chordBitMask][0] === otherChordType) {
          if (CHORD_DICTIONARY_OBJECT[chordBitMask][2] !== undefined) {
            otherChordNotesFound = CHORD_DICTIONARY_OBJECT[chordBitMask][2](otherChordRoot);
            chordNotesFound = [...chordNotesFound, '|', ...otherChordNotesFound];
          }
          
          if (CHORD_DICTIONARY_OBJECT[chordBitMask][2] === undefined) {
            comments.push('No function available to generate Poly Chord type.');
          }
        }
      }        
    }

    if (otherChordRoot && (otherChordType === undefined || otherChordType === '')) {
      otherChordNotesFound = major(otherChordRoot);
      chordNotesFound = [...chordNotesFound, '|', ...otherChordNotesFound];
      comments.push('Chord type assumed to be Major (Δ) for Poly Chord.');
    }

    if (otherChordRoot === undefined || otherChordRoot === '') {
      otherChordNotesFound = ['|', '>>> Invalid Poly Chord root <<<'];
      chordNotesFound = [...chordNotesFound, ...otherChordNotesFound];
      comments.push('Poly Chord root note provided is invalid.');
    }

    if (otherChordNotesFound.length === 0) {
      if (!comments.includes('No function available to generate Poly Chord type.')) {
        otherChordNotesFound = ['|', '>>> Invalid Poly Chord type <<<'];
        chordNotesFound = [...chordNotesFound, ...otherChordNotesFound];
        comments.push('Poly Chord type provided is invalid.');
      } else {
        otherChordNotesFound = ['|', '>>> Poly Chord not found <<<'];
        chordNotesFound = [...chordNotesFound, ...otherChordNotesFound];
      }
    }    
  }

  // Cleanup note accidentals in chordNotesFound
  for (let i = 0; i < chordNotesFound.length; i++) {
    if (chordNotesFound[i] !== "|") {
      chordNotesFound[i] = notes.reduceAccidentals(chordNotesFound[i]);
    }
  }
  
  notesInChord.notes = chordNotesFound;
  notesInChord.comments = comments;
  
  return notesInChord;  
}

// ---------- Poly Chord Lookup ----------------------

export function determinePolyChords(chord, shorthand=false) {
  /*
    Determine the polychords in chord.

    This function can handle anything from polychords based on two triads to
    6 note extended chords.
  */

  let polyChords = [];
  let opsNewRange = 0;
  let opsList = [
    determineTriad,
    determineChord4,
    determineExtChord5,
    determineExtChord6,
    determineExtChord7
  ];

  if (chord.length <= 3) {return [];}  
  if (chord.length > 14) {return [];}
  if (chord.length - 3 <= 5) {
    opsNewRange = chord.length - 3;
  } else {
    opsNewRange = 5;
  }

  for (let outer = 0; outer < opsNewRange; outer++) {
    for (let inner = 0; inner < opsNewRange; inner++) {
      /*
        The clever part: Try the opsList[outer] on the `chord.length - (3 + outer)`
        last notes of the chord.        
        Then try the opsList[inner] on the `inner + 3` first notes of the chord.        
        thus, trying all possible combinations.
      */
      let firstToRun = opsList[outer];
      let chord1 = firstToRun(chord.slice(chord.length - (3 + outer)), true, true); 

      for (let element1 in chord1) {
        let secondToRun = opsList[inner];
        let chord2 = secondToRun(chord.slice(0, inner + 3), true, true);

        for (let element2 in chord2) {
          polyChords.push(chord2[element2] + ' | ' + chord1[element1]);
        } 
      }
    }
  }

  if (!shorthand) {
    for (let el in polyChords) {
      polyChords[el] =  polyChords[el] + ' polychord';
    }
  }
  
  return polyChords;
}