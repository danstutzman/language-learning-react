// @flow

const IS_CASE_ENDING = {
  a: true,
  i: true,
  u: true,
}

export default function pronunceAtomContext2(atomContext2: AtomContext2):string{
  const { atom, left, right, right2 } = atomContext2

  if (atom === 'e') {
    if (left === null) {
      if (right === 'l') {
        return "'a"
      } else {
        return "'i"
      }
    } else {
      return ''
    }
  } else if (atom === 'l' && left === 'e' && right === right2) {
    return ''
  } else if (IS_CASE_ENDING[atom] && right === null) {
    return ''
  } else {
    return atom
  }
}