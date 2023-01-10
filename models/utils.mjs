/*
  Copyright (C) 2022, Rodney Martin
*/

/*
  Utility Module intended for use with JavaScript version of python-mingus
*/

export function range(start, stop, step) {
  // Function defined by https://stackoverflow.com/users/548696/tadeck

  if (typeof stop === 'undefined') {
    // one param defined
    stop = start;
    start = 0;
  }

  if (typeof step === 'undefined') {
    step = 1;
  }

  if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
    return [];
  }

  let result = [];
  for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
    result.push(i);
  }

  return result;
}

export function modulo(dividend, modulus) {
  return ((dividend % modulus) + modulus) % modulus;  
};

/*
  Processes note intervals identified using the intervals module and converts
  them into a single bitmask that can be used to identify the chord.

  Up to six intervals (7-Note Chord) can be processed.
*/

// Accept intervals found
export function chordToBitmask(interval1, interval2, interval3, interval4, interval5, interval6) {
  
  if (interval1 === null) {interval1=0}
  if (interval2 === null) {interval2=0}
  if (interval3 === null) {interval3=0}
  if (interval4 === null) {interval4=0}
  if (interval5 === null) {interval5=0}
  if (interval6 === null) {interval6=0}
 
  let chordBitmask = 0;
  // FLAGS
  const CHORD_TYPE_FLAGS = {
    MINOR_SECOND: 1024,   // 10000000000
    MAJOR_SECOND: 512,    // 01000000000
    MINOR_THIRD: 256,     // 00100000000
    MAJOR_THIRD: 128,     // 00010000000
    PERFECT_FOURTH: 64,   // 00001000000
    MINOR_FIFTH: 32,      // 00000100000
    PERFECT_FIFTH: 16,    // 00000010000
    MINOR_SIXTH: 8,       // 00000001000
    MAJOR_SIXTH: 4,       // 00000000100
    MINOR_SEVENTH: 2,     // 00000000010
    MAJOR_SEVENTH: 1      // 00000000001
  }

  let intervalArray = [interval1, interval2, interval3, interval4, interval5, interval6];

  for (let intervalElement in intervalArray) {
    if (intervalArray[intervalElement] === 'bb1') {chordBitmask = chordBitmask | CHORD_TYPE_FLAGS.MINOR_SEVENTH}
    if (intervalArray[intervalElement] === 'b1') {chordBitmask = chordBitmask | CHORD_TYPE_FLAGS.MAJOR_SEVENTH}
    if (intervalArray[intervalElement] === '#1') {chordBitmask = chordBitmask | CHORD_TYPE_FLAGS.MINOR_SECOND}
    if (intervalArray[intervalElement] === 'b2') {chordBitmask = chordBitmask | CHORD_TYPE_FLAGS.MINOR_SECOND}
    if (intervalArray[intervalElement] === '2') {chordBitmask = chordBitmask | CHORD_TYPE_FLAGS.MAJOR_SECOND}
    if (intervalArray[intervalElement] === '#2') {chordBitmask = chordBitmask | CHORD_TYPE_FLAGS.MINOR_THIRD}
    if (intervalArray[intervalElement] === 'bb3') {chordBitmask = chordBitmask | CHORD_TYPE_FLAGS.MAJOR_SECOND}
    if (intervalArray[intervalElement] === 'b3') {chordBitmask = chordBitmask | CHORD_TYPE_FLAGS.MINOR_THIRD}
    if (intervalArray[intervalElement] === '3') {chordBitmask = chordBitmask | CHORD_TYPE_FLAGS.MAJOR_THIRD}
    if (intervalArray[intervalElement] === '#3') {chordBitmask = chordBitmask | CHORD_TYPE_FLAGS.PERFECT_FOURTH}
    if (intervalArray[intervalElement] === 'b4') {chordBitmask = chordBitmask | CHORD_TYPE_FLAGS.MAJOR_THIRD}
    if (intervalArray[intervalElement] === '4') {chordBitmask = chordBitmask | CHORD_TYPE_FLAGS.PERFECT_FOURTH}
    if (intervalArray[intervalElement] === '#4') {chordBitmask = chordBitmask | CHORD_TYPE_FLAGS.MINOR_FIFTH}
    if (intervalArray[intervalElement] === 'b5') {chordBitmask = chordBitmask | CHORD_TYPE_FLAGS.MINOR_FIFTH}
    if (intervalArray[intervalElement] === '5') {chordBitmask = chordBitmask | CHORD_TYPE_FLAGS.PERFECT_FIFTH}
    if (intervalArray[intervalElement] === '#5') {chordBitmask = chordBitmask | CHORD_TYPE_FLAGS.MINOR_SIXTH}
    if (intervalArray[intervalElement] === 'b6') {chordBitmask = chordBitmask | CHORD_TYPE_FLAGS.MINOR_SIXTH}
    if (intervalArray[intervalElement] === 'bb7') {chordBitmask = chordBitmask | CHORD_TYPE_FLAGS.MAJOR_SIXTH}
    if (intervalArray[intervalElement] === '6') {chordBitmask = chordBitmask | CHORD_TYPE_FLAGS.MAJOR_SIXTH}
    if (intervalArray[intervalElement] === '#6') {chordBitmask = chordBitmask | CHORD_TYPE_FLAGS.MINOR_SEVENTH}
    if (intervalArray[intervalElement] === 'b7') {chordBitmask = chordBitmask | CHORD_TYPE_FLAGS.MINOR_SEVENTH}
    if (intervalArray[intervalElement] === '7') {chordBitmask = chordBitmask | CHORD_TYPE_FLAGS.MAJOR_SEVENTH}
    if (intervalArray[intervalElement] === '#7') {chordBitmask = chordBitmask | CHORD_TYPE_FLAGS.MAJOR_SEVENTH}
  }

  return chordBitmask;
}