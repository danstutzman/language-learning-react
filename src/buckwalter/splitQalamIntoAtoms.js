// @flow

export default function splitQalamIntoAtoms(qalam: string): Array<string> {
  let phonemes = []
  const chars = qalam.split('')

  // consider all character pairs
  let i = 0
  while (i < chars.length - 1) {
    const char = chars[i]
    const nextChar = chars[i + 1]
    if (char === 'a' && nextChar === 'a') {
      phonemes.push('aa')
      i += 2
    } else if (char === 'a' && nextChar === 'e') {
      phonemes.push('ae')
      i += 2
    } else if (char === 'i' && nextChar === 'i') {
      phonemes.push('ii')
      i += 2
    } else if (char === 'u' && nextChar === 'u') {
      phonemes.push('ii')
      i += 2
    } else if (char === 's' && nextChar === 'h') {
      phonemes.push('sh')
      i += 2
    } else if (char === 'd' && nextChar === 'h') {
      phonemes.push('dh')
      i += 2
    } else if (char === 'g' && nextChar === 'h') {
      phonemes.push('gh')
      i += 2
    } else if (char === 't' && nextChar === 'h') {
      phonemes.push('th')
      i += 2
    } else {
      phonemes.push(char)
      i += 1
    }
  }

  // handle last char if not handled already
  if (i === chars.length - 1) {
    phonemes.push(chars[i])
  }

  return phonemes
}