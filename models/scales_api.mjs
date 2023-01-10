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
  Module dealing with Scales in Music
*/

import { isNoteValid, augment, diminish, reduceAccidentals } from './notes_api.mjs';
import { KEYS_ARRAY } from './keys_api.mjs';
import * as intervals from './intervals_api.mjs';

// ---------- Base Scale Object (Internal) -----------
let BaseScale = {
  /*
  General object 'Class' implementing general scale methods.
  Not to be used by the final user.
  */
  baseKeyType: 'major or minor',
  type: 'base scale',
  name: 'base scale',
  semitones: false,
  init: function init(rootNote = 'C', octaves = 1) {
    if (!isNoteValid(rootNote)) {
      this.validScale = false;
      return `Root note is invalid; scale cannot be generated.`;
    }
    this.validScale = true;
    this.rootNote = rootNote.charAt(0).toUpperCase() + rootNote.slice(1);
    this.octaves = octaves;
    this.fullName = `${this.rootNote} ${this.name}`;    
  },
  equal: function equal(other) {
    if (!this.validScale) {
      return `Root note is invalid; scale cannot be generated.`;
    }
    let thisScaleFwd = this.ascending();
    let otherScaleFwd = other.ascending();
    let thisScaleRev = this.descending();
    let otherScaleRev = other.descending();
    let isFwdEqual = thisScaleFwd.length === otherScaleFwd.length &&
                     thisScaleFwd.every((value, index) => value === otherScaleFwd[index]);
    let isRevEqual = thisScaleRev.length === otherScaleRev.length &&
                     thisScaleRev.every((value, index) => value === otherScaleRev[index]);
    if (isFwdEqual && isRevEqual) {
      return true;
    }
    return false;
  },
  identify: function identify() {
    if (!this.validScale) {
      return `Root note is invalid; scale cannot be generated.`;
    }
    return `${this.fullName}`;
  },
  display: function display() {
    if (!this.validScale) {
      return `Root note is invalid; scale cannot be generated.`;
    }
    return `Ascending:  ${this.ascending()}\n`
            + `Descending: ${this.descending()}`;
  },
  noteCleanup: function noteCleanup(noteArray) {
    for (let i = 0; i < noteArray.length; i++) {
      if (noteArray[i] === 'Cb') {
        noteArray[i] = 'B';
      }
      if (noteArray[i] === 'B#') {
        noteArray[i] = 'C';
      }
      if (noteArray[i] === 'Fb') {
        noteArray[i] = 'E';
      }
      if (noteArray[i] === 'E#') {
        noteArray[i] = 'F';
      }
      noteArray[i] = reduceAccidentals(noteArray[i]);
    }
    return noteArray;
  },
  preBuildScale: function preBuildScale() {
    let preBuiltScale = [this.rootNote];
    for (let i = 1; i < 7; i++) {
      if (this.semitones.includes(i)) {
        preBuiltScale.push(intervals.getMinorSecond(preBuiltScale[i - 1]))
      } else {
        preBuiltScale.push(intervals.getMajorSecond(preBuiltScale[i - 1]));
      }
    }
    return preBuiltScale;
  },
  ascending: function ascending() {
    if (!this.validScale) {
      return `Root note is invalid; scale cannot be generated.`;
    }    
    let notes = this.preBuildScale();
    notes = this.noteCleanup(notes);
    notes = [].concat(...Array(this.octaves).fill(notes));
    notes.push(notes[0]);
    return notes;  
  },
  descending: function descending() {
    if (!this.validScale) {
      return `Root note is invalid; scale cannot be generated.`;
    }
    let ascendingOrderArray = this.ascending();
    let descendingOrderArray = [...ascendingOrderArray].reverse();
    
    return descendingOrderArray;
  },
  degree: function degree(degreeNumber, direction='a') {
    /*
      Return the requested scale degree.

      The direction of the scale is 'a' for ascending (default) and 'd'
      for descending.
    */
    if (!this.validScale) {
      return `Root note is invalid; scale cannot be generated.`;
    }
    
    if (degreeNumber < 1) {
      return `Degree ${degreeNumber} is out of range`;
    }

    if (direction === 'a') {
      let notes = this.ascending().slice(0, -1);
      return notes[degreeNumber - 1];
    } 
    
    if (direction === 'd') {
      let notes = this.descending().slice(0, -1);
      return notes[degreeNumber - 1];
    } 

    return `Direction --> ${direction} <-- is not recognized`;         
  }
};

// ---------- Major Scale ----------------------------

// Major
export let Major = Object.create(BaseScale);
Major.baseKeyType ='major';
Major.type = 'major (diatonic scale)';
Major.name = 'Major';
Major.semitones = [3, 7];

// ---------- Major Modes ----------------------------

// Ionian
export let Ionian = Object.create(BaseScale);
Ionian.baseKeyType ='major';
Ionian.type = 'mode (major), major quality';
Ionian.name = 'Ionian (Major)';
Ionian.semitones = [3, 7];

// Dorian
export let Dorian = Object.create(BaseScale);
Dorian.baseKeyType ='major';
Dorian.type = 'mode (major), minor quality';
Dorian.name = 'Dorian';
Dorian.semitones = [2, 6];

// Phrygian
export let Phrygian = Object.create(BaseScale);
Phrygian.baseKeyType ='major';
Phrygian.type = 'mode (major), minor quality';
Phrygian.name = 'Phrygian';
Phrygian.semitones = [1, 5];

// Lydian
export let Lydian = Object.create(BaseScale);
Lydian.baseKeyType ='major';
Lydian.type = 'mode (major), major quality';
Lydian.name = 'Lydian';
Lydian.semitones = [4, 7];

// Mixolydian
export let Mixolydian = Object.create(BaseScale);
Mixolydian.baseKeyType ='major';
Mixolydian.type = 'mode (major), major quality';
Mixolydian.name = 'Mixolydian';
Mixolydian.semitones = [3, 6];

// Aeolian
export let Aeolian = Object.create(BaseScale);
Aeolian.baseKeyType ='major';
Aeolian.type = 'mode (major), minor quality';
Aeolian.name = 'Aeolian (Natural Minor)';
Aeolian.semitones = [2, 5];

// Locrian
export let Locrian = Object.create(BaseScale);
Locrian.baseKeyType ='major';
Locrian.type = 'mode (major), diminished quality';
Locrian.name = 'Locrian';
Locrian.semitones = [1, 4];

// ---------- Harmonic Major Scale -------------------

// Harmonic Major
export let HarmonicMajor = Object.create(BaseScale);
HarmonicMajor.baseKeyType ='major';
HarmonicMajor.type = 'major (diatonic scale)';
HarmonicMajor.name = 'Harmonic Major';
HarmonicMajor.semitones = [3, 7];
HarmonicMajor.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes[5] = diminish(notes[5]);
  notes = [].concat(...Array(this.octaves).fill(notes));  
  notes.push(notes[0]);
  return notes;
};

// ---------- Harmonic Major Modes -------------------

// Dorian Flat Five
export let DorianFlatFive = Object.create(BaseScale);
DorianFlatFive.baseKeyType ='major';
DorianFlatFive.type = 'mode (harmonic major), minor quality';
DorianFlatFive.name = 'Dorian b5 (Locrian N2 N6)';
DorianFlatFive.semitones = [2, 6]
DorianFlatFive.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes[4] = diminish(notes[4]);
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// Phrygian Flat Four
export let PhrygianFlatFour = Object.create(BaseScale);
PhrygianFlatFour.baseKeyType ='major';
PhrygianFlatFour.type = 'mode (harmonic major), minor quality';
PhrygianFlatFour.name = 'Phrygian b4 (Altered Dominant N5)';
PhrygianFlatFour.semitones = [1, 5];
PhrygianFlatFour.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes[3] = diminish(notes[3]);
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// Lydian Flat Three
export let LydianFlatThree = Object.create(BaseScale);
LydianFlatThree.baseKeyType ='major';
LydianFlatThree.type = 'mode (harmonic major), minor quality';
LydianFlatThree.name = 'Lydian b3 (Melodic Minor #4)';
LydianFlatThree.semitones = [4, 7];
LydianFlatThree.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes[2] = diminish(notes[2]);
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// Mixolydian Flat Two
export let MixolydianFlatTwo = Object.create(BaseScale);
MixolydianFlatTwo.baseKeyType ='major';
MixolydianFlatTwo.type = 'mode (harmonic major), major quality';
MixolydianFlatTwo.name = 'Mixolydian b2';
MixolydianFlatTwo.semitones = [3, 6];
MixolydianFlatTwo.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes[1] = diminish(notes[1]);
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// Lydian Augmented Sharp Two
export let LydianAugmentedSharpTwo = Object.create(BaseScale);
LydianAugmentedSharpTwo.baseKeyType ='major';
LydianAugmentedSharpTwo.type = 'mode (harmonic major), major quality';
LydianAugmentedSharpTwo.name = 'Lydian Augmented #2';
LydianAugmentedSharpTwo.semitones = [4, 7];
LydianAugmentedSharpTwo.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes[1] = augment(notes[1]);
  notes[4] = augment(notes[4]);
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// Locrian Double Flat Seven
export let LocrianDoubleFlatSeven = Object.create(BaseScale);
LocrianDoubleFlatSeven.baseKeyType ='major';
LocrianDoubleFlatSeven.type = 'mode (harmonic major), diminished quality';
LocrianDoubleFlatSeven.name = 'Locrian bb7';
LocrianDoubleFlatSeven.semitones = [1, 4];
LocrianDoubleFlatSeven.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes[6] = diminish(notes[6]);
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// ---------- Double Harmonic Major Scale -----------

// Double Harmonic Major
export let DoubleHarmonicMajor = Object.create(BaseScale);
DoubleHarmonicMajor.baseKeyType ='major';
DoubleHarmonicMajor.type = 'major (diatonic scale)';
DoubleHarmonicMajor.name = 'Double Harmonic Major';
DoubleHarmonicMajor.semitones = [3, 7];
DoubleHarmonicMajor.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes[1] = diminish(notes[1]);
  notes[5] = diminish(notes[5]);
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// ---------- Double Harmonic Major Modes ------------

// Lydian Sharp Two Sharp Six
export let LydianSharpTwoSharpSix = Object.create(BaseScale);
LydianSharpTwoSharpSix.baseKeyType ='major';
LydianSharpTwoSharpSix.type = 'mode (double harmonic major), major quality';
LydianSharpTwoSharpSix.name = 'Lydian #2 #6';
LydianSharpTwoSharpSix.semitones = [4, 7];
LydianSharpTwoSharpSix.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes[1] = augment(notes[1]);
  notes[5] = augment(notes[5]);
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// Ultra Phrygian
export let UltraPhrygian = Object.create(BaseScale);
UltraPhrygian.baseKeyType ='major';
UltraPhrygian.type = 'mode (double harmonic major), minor quality';
UltraPhrygian.name = 'Ultra Phrygian';
UltraPhrygian.semitones = [1, 5];
UltraPhrygian.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes[3] = diminish(notes[3]);
  notes[6] = diminish(notes[6]);
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// Hungarian Gypsy Minor
export let HungarianGypsyMinor = Object.create(BaseScale);
HungarianGypsyMinor.baseKeyType ='major';
HungarianGypsyMinor.type = 'mode (double harmonic major), minor quality';
HungarianGypsyMinor.name = 'Hungarian Gypsy Minor';
HungarianGypsyMinor.semitones = [3, 7];
HungarianGypsyMinor.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes[2] = diminish(notes[2]);
  notes[3] = augment(notes[3]);
  notes[5] = diminish(notes[5]);
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// Oriental
export let Oriental = Object.create(BaseScale);
Oriental.baseKeyType ='major';
Oriental.type = 'mode (double harmonic major), major quality';
Oriental.name = 'Oriental';
Oriental.semitones = [3, 7];
Oriental.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes[1] = diminish(notes[1]);
  notes[4] = diminish(notes[4]);
  notes[6] = diminish(notes[6]);
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// Ionian Sharp Two Sharp Five
export let IonianSharpTwoSharpFive = Object.create(BaseScale);
IonianSharpTwoSharpFive.baseKeyType ='major';
IonianSharpTwoSharpFive.type = 'mode (double harmonic major), major quality';
IonianSharpTwoSharpFive.name = 'Ionian #2 #5';
IonianSharpTwoSharpFive.semitones = [3, 7];
IonianSharpTwoSharpFive.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes[1] = augment(notes[1]);
  notes[4] = augment(notes[4]);
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// Locrian Double Flat Three Double Flat Seven
export let LocrianDoubleFlatThreeDoubleFlatSeven = Object.create(BaseScale);
LocrianDoubleFlatThreeDoubleFlatSeven.baseKeyType ='major';
LocrianDoubleFlatThreeDoubleFlatSeven.type = 'mode (double harmonic major), diminished quality';
LocrianDoubleFlatThreeDoubleFlatSeven.name = 'Locrian bb3 bb7';
LocrianDoubleFlatThreeDoubleFlatSeven.semitones = [1, 4];
LocrianDoubleFlatThreeDoubleFlatSeven.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes[2] = diminish(notes[2]);
  notes[6] = diminish(notes[6]);
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// ---------- Natural Minor Scale --------------------

// Natural Minor
export let NaturalMinor = Object.create(BaseScale);
NaturalMinor.baseKeyType ='minor';
NaturalMinor.type = 'minor (diatonic scale)';
NaturalMinor.name = 'Natural Minor';
NaturalMinor.semitones = [2, 5];
NaturalMinor.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
}; 

// ---------- Harmonic Minor Scale -------------------

// Harmonic Minor
export let HarmonicMinor = Object.create(BaseScale);
HarmonicMinor.baseKeyType ='minor';
HarmonicMinor.type = 'minor (diatonic scale)';
HarmonicMinor.name = 'Harmonic Minor';
HarmonicMinor.semitones = [2, 5];
HarmonicMinor.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes[6] = augment(notes[6]);
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// ---------- Harmonic Minor Modes -------------------

// Locrian Major Six
export let LocrianMajorSix = Object.create(BaseScale);
LocrianMajorSix.baseKeyType ='major';
LocrianMajorSix.type = 'mode (harmonic minor), diminished quality';
LocrianMajorSix.name = 'Locrian M6 (Dorian b2 b5)';
LocrianMajorSix.semitones = [1, 4];
LocrianMajorSix.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes[5] = augment(notes[5]);
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// Ionian Sharp Five
export let IonianSharpFive = Object.create(BaseScale);
IonianSharpFive.baseKeyType ='major';
IonianSharpFive.type = 'mode (harmonic minor), major quality';
IonianSharpFive.name = 'Ionian #5';
IonianSharpFive.semitones = [3, 7];
IonianSharpFive.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes[4] = augment(notes[4]);
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// Dorian Sharp Four
export let DorianSharpFour = Object.create(BaseScale);
DorianSharpFour.baseKeyType ='major';
DorianSharpFour.type = 'mode (harmonic minor), major quality';
DorianSharpFour.name = 'Dorian #4';
DorianSharpFour.semitones = [2, 6];
DorianSharpFour.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes[3] = augment(notes[3]);
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// Phrygian Major Three
export let PhrygianMajorThree = Object.create(BaseScale);
PhrygianMajorThree.baseKeyType ='major';
PhrygianMajorThree.type = 'mode (harmonic minor), minor quality';
PhrygianMajorThree.name = 'Phrygian M3 (Mixolydian b2 b6)';
PhrygianMajorThree.semitones = [1, 5];
PhrygianMajorThree.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes[2] = augment(notes[2]);
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// Lydian Sharp Two
export let LydianSharpTwo = Object.create(BaseScale);
LydianSharpTwo.baseKeyType ='major';
LydianSharpTwo.type = 'mode (harmonic minor), major quality';
LydianSharpTwo.name = 'Lydian #2';
LydianSharpTwo.semitones = [4, 7];
LydianSharpTwo.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes[1] = augment(notes[1]);
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// Locrian Flat Four Double Flat Seven
export let LocrianFlatFourDoubleFlatSeven = Object.create(BaseScale);
LocrianFlatFourDoubleFlatSeven.baseKeyType ='major';
LocrianFlatFourDoubleFlatSeven.type = 'mode (harmonic minor), diminished quality';
LocrianFlatFourDoubleFlatSeven.name = 'Locrian b4 bb7';
LocrianFlatFourDoubleFlatSeven.semitones = [1, 4];
LocrianFlatFourDoubleFlatSeven.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes[3] = diminish(notes[3]);
  notes[6] = diminish(notes[6]);
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// ---------- Melodic Minor Scale --------------------

// Melodic Minor
export let MelodicMinor = Object.create(BaseScale);
MelodicMinor.baseKeyType ='minor';
MelodicMinor.type = 'minor (diatonic scale)';
MelodicMinor.name = 'Melodic Minor';
MelodicMinor.semitones = [2, 5];
MelodicMinor.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes[5] = augment(notes[5]);
  notes[6] = augment(notes[6]);
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// ---------- Melodic Minor Modes --------------------

// Dorian Flat Two
export let DorianFlatTwo = Object.create(BaseScale);
DorianFlatTwo.baseKeyType ='major';
DorianFlatTwo.type = 'mode (melodic minor), minor quality';
DorianFlatTwo.name = 'Dorian b2';
DorianFlatTwo.semitones = [2, 6];
DorianFlatTwo.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes[1] = diminish(notes[1]);
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// Lydian Augmented
export let LydianAugmented = Object.create(BaseScale);
LydianAugmented.baseKeyType ='major';
LydianAugmented.type = 'mode (melodic minor), major quality';
LydianAugmented.name = 'Lydian Augmented';
LydianAugmented.semitones = [4, 7];
LydianAugmented.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes[4] = augment(notes[4]);
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// Lydian Flat Seven
export let LydianFlatSeven = Object.create(BaseScale);
LydianFlatSeven.baseKeyType ='major';
LydianFlatSeven.type = 'mode (melodic minor), major quality';
LydianFlatSeven.name = 'Lydian b7';
LydianFlatSeven.semitones = [4, 7];
LydianFlatSeven.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes[6] = diminish(notes[6]);
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// Mixolydian Flat Six
export let MixolydianFlatSix = Object.create(BaseScale);
MixolydianFlatSix.baseKeyType ='major';
MixolydianFlatSix.type = 'mode (melodic minor), major quality';
MixolydianFlatSix.name = 'Mixolydian b6';
MixolydianFlatSix.semitones = [3, 6];
MixolydianFlatSix.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes[5] = diminish(notes[5]);
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// Locrian Natural Two
export let LocrianNaturalTwo = Object.create(BaseScale);
LocrianNaturalTwo.baseKeyType ='major';
LocrianNaturalTwo.type = 'mode (melodic minor), diminished quality';
LocrianNaturalTwo.name = 'Locrian N2';
LocrianNaturalTwo.semitones = [1, 4];
LocrianNaturalTwo.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes[1] = augment(notes[1]);
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// Super Locrian
export let SuperLocrian = Object.create(BaseScale);
SuperLocrian.baseKeyType ='major';
SuperLocrian.type = 'mode (melodic minor), diminished quality';
SuperLocrian.name = 'Super Locrian';
SuperLocrian.semitones = [1, 4];
SuperLocrian.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes[3] = diminish(notes[3]);
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// ---------- Advanced Scales ------------------------

// Enigmatic
export let Enigmatic = Object.create(BaseScale);
Enigmatic.baseKeyType ='major';
Enigmatic.type = 'major (advanced scale)';
Enigmatic.name = 'Enigmatic';
Enigmatic.semitones = [3, 7];
Enigmatic.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes[1] = diminish(notes[1]);
  notes[3] = augment(notes[3]);
  notes[4] = augment(notes[4]);
  notes[5] = augment(notes[5]);
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// Neapolitan
export let Neapolitan = Object.create(BaseScale);
Neapolitan.baseKeyType ='major';
Neapolitan.type = 'minor (advanced scale)';
Neapolitan.name = 'Neapolitan';
Neapolitan.semitones = [3, 7];
Neapolitan.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes[1] = diminish(notes[1]);
  notes[2] = diminish(notes[2]);
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// Neapolitan Minor
export let NeapolitanMinor = Object.create(BaseScale);
NeapolitanMinor.baseKeyType ='major';
NeapolitanMinor.type = 'minor (advanced scale)';
NeapolitanMinor.name = 'Neapolitan Minor';
NeapolitanMinor.semitones = [3, 7];
NeapolitanMinor.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes[1] = diminish(notes[1]);
  notes[2] = diminish(notes[2]);
  notes[5] = diminish(notes[5]);
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// Spanish
export let Spanish = Object.create(BaseScale);
Spanish.baseKeyType ='major';
Spanish.type = 'major (advanced scale)';
Spanish.name = 'Spanish (Phrygian Dominant)';
Spanish.semitones = [3, 7];
Spanish.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes[1] = diminish(notes[1]);
  notes[5] = diminish(notes[5]);
  notes[6] = diminish(notes[6]);
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// Arabian
export let Arabian = Object.create(BaseScale);
Arabian.baseKeyType ='major';
Arabian.type = 'major (advanced scale)';
Arabian.name = 'Arabian';
Arabian.semitones = [3, 7];
Arabian.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes[4] = diminish(notes[4]);
  notes[5] = diminish(notes[5]);
  notes[6] = diminish(notes[6]);
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// Persian
export let Persian = Object.create(BaseScale);
Persian.baseKeyType ='major';
Persian.type = 'major (advanced scale)';
Persian.name = 'Persian';
Persian.semitones = [3, 7];
Persian.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes[1] = diminish(notes[1]);
  notes[4] = diminish(notes[4]);
  notes[5] = diminish(notes[5]);
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// Altered Dominant
export let AlteredDominant = Object.create(BaseScale);
AlteredDominant.baseKeyType ='major';
AlteredDominant.type = 'minor (advanced scale)';
AlteredDominant.name = 'Altered Dominant';
AlteredDominant.semitones = [3, 7];
AlteredDominant.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  let second = notes[1];
  let third = notes[2];
  let fourth = notes[3];
  notes[1] = diminish(second);
  notes[2] = augment(second); // 3 --> #2 (b3)
  notes[3] = third; // 4 --> 3 
  notes[4] = augment(fourth); // 5 --> #4 (b5)
  notes[5] = diminish(notes[5]); // 6 --> b6
  notes[6] = diminish(notes[6]); // 7 --> b7
  notes = this.noteCleanup(notes);
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// ---------- Pentatonic Scales ----------------------

// Major Pentatonic
export let MajorPentatonic = Object.create(BaseScale);
MajorPentatonic.baseKeyType ='major';
MajorPentatonic.type = 'major (pentatonic scale)';
MajorPentatonic.name = 'Major Pentatonic';
MajorPentatonic.semitones = [3, 7];
MajorPentatonic.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes.splice(3, 1); // Remove the Fourth (at index 3)
  notes.splice(5, 1); // Remove the Seventh (now at index 5)
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// Minor Pentatonic
export let MinorPentatonic = Object.create(BaseScale);
MinorPentatonic.baseKeyType ='minor';
MinorPentatonic.type = 'minor (pentatonic scale)';
MinorPentatonic.name = 'Minor Pentatonic';
MinorPentatonic.semitones = [2, 5];
MinorPentatonic.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes.splice(1, 1); // Remove the Second (at index 1)
  notes.splice(4, 1); // Remove the Flat Sixth (now at index 4)  
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// Japanese
export let Japanese = Object.create(BaseScale);
Japanese.baseKeyType ='minor';
Japanese.type = 'suspended (pentatonic scale)';
Japanese.name = 'Japanese';
Japanese.semitones = [2, 5];
Japanese.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes.splice(2, 1); // Remove the Flat Third (at index 2)
  notes.splice(4, 1); // Remove the Flat Sixth (now at index 4)
  notes[1] = diminish(notes[1]); // 2 --> b2
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// ---------- Hexatonic Scales -----------------------

// Minor Blues
export let MinorBlues = Object.create(BaseScale);
MinorBlues.baseKeyType ='major';
MinorBlues.type = 'minor (hexatonic scale)';
MinorBlues.name = 'Minor Blues';
MinorBlues.semitones = [3, 7];
MinorBlues.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  let fourth = notes[3];
  let fifth = notes[4];
  notes.splice(1, 1); // Remove the Second (at index 1)
  notes[1] = diminish(notes[1]); // 3 --> b3 (now at index 1)
  notes[3] = augment(fourth); // #4 (b5)
  notes[4] = fifth; // 6 --> 5 (now at index 4)
  notes[5] = diminish(notes[5]); // 7 --> b7 (now at index 5)
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// Major Blues
export let MajorBlues = Object.create(BaseScale);
MajorBlues.baseKeyType ='major';
MajorBlues.type = 'major (hexatonic scale)';
MajorBlues.name = 'Major Blues';
MajorBlues.semitones = [3, 7];
MajorBlues.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  let third = notes[2];
  let fifth = notes[4];
  let sixth = notes[5];
  notes.splice(3, 1); // Remove the Fourth (at index 3)
  notes[2] = diminish(third); // 3 --> b3 (now at index 2)
  notes[3] = third; // 5 --> b5 (now at index 3)
  notes[4] = fifth;
  notes[5] = sixth;
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// Whole Tone 1
export let WholeTone1 = Object.create(BaseScale);
WholeTone1.baseKeyType ='major';
WholeTone1.type = 'major (hexatonic scale)';
WholeTone1.name = 'Whole Tone 1';
WholeTone1.semitones = [3, 7];
WholeTone1.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes.splice(6, 1); // Remove the Seventh (at index 6)
  notes[3] = augment(notes[3]); // 4 --> #4 (now at index 3)
  notes[4] = augment(notes[4]); // 5 --> #5 (now at index 4)
  notes[5] = augment(notes[5]); // 6 --> #6 (now at index 5)
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// Whole Tone 2
export let WholeTone2 = Object.create(BaseScale);
WholeTone2.baseKeyType ='major';
WholeTone2.type = 'minor (hexatonic scale)';
WholeTone2.name = 'Whole Tone 2';
WholeTone2.semitones = [3, 7];
WholeTone2.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  notes.splice(6, 1); // Remove the Seventh (at index 6)
  notes[0] = diminish(notes[0]); // 1 --> b1 (now at index 0)
  notes[1] = diminish(notes[1]); // 2 --> b2 (now at index 1)
  notes[2] = diminish(notes[2]); // 3 --> b3 (now at index 2)
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// ---------- Eight Tone Scales ----------------------

// Major Bebop
export let MajorBebop = Object.create(BaseScale);
MajorBebop.baseKeyType ='major';
MajorBebop.type = 'major (eight tone scale)';
MajorBebop.name = 'Major Bebop';
MajorBebop.semitones = [3, 7];
MajorBebop.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  let eighthNote = diminish(notes[5]);
  notes.splice(5, 0, eighthNote); // Insert b6 before the 6 (at index 5)
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// Dominant Bebop
export let DominantBebop = Object.create(BaseScale);
DominantBebop.baseKeyType ='major';
DominantBebop.type = 'major (eight tone scale)';
DominantBebop.name = 'Dominant Bebop';
DominantBebop.semitones = [3, 7];
DominantBebop.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  let eighthNote = diminish(notes[6]);
  notes.splice(6, 0, eighthNote); // Insert b7 before the 7 (at index 6)
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// Minor Bebop
export let MinorBebop = Object.create(BaseScale);
MinorBebop.baseKeyType ='major';
MinorBebop.type = 'minor (eight tone scale)';
MinorBebop.name = 'Minor Bebop';
MinorBebop.semitones = [3, 7];
MinorBebop.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  let eighthNote = diminish(notes[2]);
  notes.splice(2, 0, eighthNote); // Insert b3 before the 3 (at index 2)
  notes[7] = diminish(notes[7]); // 7 --> b7
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// Diminished
export let Diminished = Object.create(BaseScale);
Diminished.baseKeyType ='major';
Diminished.type = 'diminished (eight tone scale)';
Diminished.name = 'Diminished';
Diminished.semitones = [3, 7];
Diminished.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  let eighthNote = diminish(notes[4]);
  notes.splice(4, 0, eighthNote); // Insert b5 before the 5 (at index 4)
  notes[2] = diminish(notes[2]); // 3 --> b3
  notes[5] = augment(notes[5]); // 5 --> #5
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// Dominant Diminished
export let DominantDiminished = Object.create(BaseScale);
DominantDiminished.baseKeyType ='major';
DominantDiminished.type = 'diminished (eight tone scale)';
DominantDiminished.name = 'Dominant Diminished';
DominantDiminished.semitones = [3, 7];
DominantDiminished.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  let eighthNote = diminish(notes[1]);
  notes.splice(1, 0, eighthNote); // Insert in b2 before the 2 (at index 1)
  notes[2] = augment(notes[2]); // 2 --> #2
  notes[4] = augment(notes[4]); // 4 --> #4
  notes[7] = diminish(notes[7]); // 7 --> b7
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

// ---------- Nine Tone Scale ------------------------

// Nine Tone
export let NineTone = Object.create(BaseScale);
NineTone.baseKeyType ='major';
NineTone.type = 'major (nine tone scale)';
NineTone.name = 'Nine Tone';
NineTone.semitones = [3, 7];
NineTone.ascending = function ascending() {
  if (!this.validScale) {
    return `Root note is invalid; scale cannot be generated.`;
  }    
  let notes = this.preBuildScale();
  let eighthNote = diminish(notes[2]);
  let ninthNote = augment(notes[4]);
  notes.splice(2, 0, eighthNote); // Insert b3 before the 3 (at index 2)
  notes.splice(6, 0, ninthNote); // Insert #5 before the 6 (now at index 6)
  notes[4] = augment(notes[4]); // 4 --> #4
  notes = [].concat(...Array(this.octaves).fill(notes));
  notes.push(notes[0]);
  return notes;
};

export function nameScale(notes) {
  /* 
    Determine the scales containing the notes.

    All scales are recognized.

    Example:
    nameScale(['A', 'Bb', 'E', 'F#', 'G'])
    ['G melodic minor', 'D harmonic major']
  */
 
  let scalesFound = [];

  // Check all Major and Minor Keys
  for (let keyEl = 0; keyEl < KEYS_ARRAY.length; keyEl++) {
    for (let scaleEl in SCALES_ARRAY) {
      let tempObject = SCALES_ARRAY[scaleEl];
      if (tempObject.baseKeyType === 'major') {
        tempObject.init(KEYS_ARRAY[keyEl][0]);
        let scaleNotes = tempObject.ascending();
        let notesAreInScale = notes.every(value => scaleNotes.includes(value));
        if (notesAreInScale) {
          scalesFound.push(tempObject.fullName);
        }
      }
            
      if (tempObject.baseKeyType === 'minor') {
        tempObject.init(KEYS_ARRAY[keyEl][1]);
        let scaleNotes = tempObject.ascending();
        let notesAreInScale = notes.every(value => scaleNotes.includes(value));
        if (notesAreInScale) {
          scalesFound.push(tempObject.fullName);
        }
      }
    }
  }
  
  return scalesFound;
}

const SCALES_ARRAY = [
  Major,
  Ionian,
  Dorian,
  Phrygian,
  Lydian,
  Mixolydian,
  Aeolian,
  Locrian,
  HarmonicMajor,
  DorianFlatFive,
  PhrygianFlatFour,
  LydianFlatThree,
  MixolydianFlatTwo,
  LydianAugmentedSharpTwo,
  LocrianDoubleFlatSeven,
  DoubleHarmonicMajor,
  LydianSharpTwoSharpSix,
  UltraPhrygian,
  HungarianGypsyMinor,
  Oriental,
  IonianSharpTwoSharpFive,
  LocrianDoubleFlatThreeDoubleFlatSeven,
  NaturalMinor,
  HarmonicMinor,
  LocrianMajorSix,
  IonianSharpFive,
  DorianSharpFour,
  PhrygianMajorThree,
  LydianSharpTwo,
  LocrianFlatFourDoubleFlatSeven,
  MelodicMinor,
  DorianFlatTwo,
  LydianAugmented,
  LydianFlatSeven,
  MixolydianFlatSix,
  LocrianNaturalTwo,
  SuperLocrian,
  Enigmatic,
  Neapolitan,
  NeapolitanMinor,
  Spanish,
  Arabian,
  Persian,
  AlteredDominant,
  MajorPentatonic,
  MinorPentatonic,
  Japanese,
  MinorBlues,
  MajorBlues,
  WholeTone1,
  WholeTone2,
  MajorBebop,
  DominantBebop,
  MinorBebop,
  Diminished,
  DominantDiminished,
  NineTone
];

export const SCALE_DICTIONARY_OBJECT = {
  'Major': Major,
  'Ionian': Ionian,
  'Dorian': Dorian,
  'Phrygian': Phrygian,
  'Lydian': Lydian,
  'Mixolydian': Mixolydian,
  'Aeolian': Aeolian,
  'Locrian': Locrian,
  'HarmonicMajor': HarmonicMajor,
  'DorianFlatFive': DorianFlatFive,
  'PhrygianFlatFour': PhrygianFlatFour,
  'LydianFlatThree': LydianFlatThree,
  'MixolydianFlatTwo': MixolydianFlatTwo,
  'LydianAugmentedSharpTwo': LydianAugmentedSharpTwo,
  'LocrianDoubleFlatSeven': LocrianDoubleFlatSeven,
  'DoubleHarmonicMajor': DoubleHarmonicMajor,
  'LydianSharpTwoSharpSix': LydianSharpTwoSharpSix,
  'UltraPhrygian': UltraPhrygian,
  'HungarianGypsyMinor': HungarianGypsyMinor,
  'Oriental': Oriental,
  'IonianSharpTwoSharpFive': IonianSharpTwoSharpFive,
  'LocrianDoubleFlatThreeDoubleFlatSeven': LocrianDoubleFlatThreeDoubleFlatSeven,
  'NaturalMinor': NaturalMinor,
  'HarmonicMinor': HarmonicMinor,
  'LocrianMajorSix': LocrianMajorSix,
  'IonianSharpFive': IonianSharpFive,
  'DorianSharpFour': DorianSharpFour,
  'PhrygianMajorThree': PhrygianMajorThree,
  'LydianSharpTwo': LydianSharpTwo,
  'LocrianFlatFourDoubleFlatSeven': LocrianFlatFourDoubleFlatSeven,
  'MelodicMinor': MelodicMinor,
  'DorianFlatTwo': DorianFlatTwo,
  'LydianAugmented': LydianAugmented,
  'LydianFlatSeven': LydianFlatSeven,
  'MixolydianFlatSix': MixolydianFlatSix,
  'LocrianNaturalTwo': LocrianNaturalTwo,
  'SuperLocrian': SuperLocrian,
  'Enigmatic': Enigmatic,
  'Neapolitan': Neapolitan,
  'NeapolitanMinor': NeapolitanMinor,
  'Spanish': Spanish,
  'Arabian': Arabian,
  'Persian': Persian,
  'AlteredDominant': AlteredDominant,
  'MajorPentatonic': MajorPentatonic,
  'MinorPentatonic': MinorPentatonic,
  'Japanese': Japanese,
  'MinorBlues': MinorBlues,
  'MajorBlues': MajorBlues,
  'WholeTone1': WholeTone1,
  'WholeTone2': WholeTone2,
  'MajorBebop': MajorBebop,
  'DominantBebop': DominantBebop,
  'MinorBebop': MinorBebop,
  'Diminished': Diminished,
  'DominantDiminished': DominantDiminished,
  'NineTone': NineTone
};