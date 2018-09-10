const STOP = 0
const LEFT = 1
const UP = 2
const UP_LEFT = 3

// Needleman–Wunsch algorithm
export default function diffStrings(a: string, b: string):
    Array<[string, string]> {
  const maxScoreRows = []
  const arrowDirectionRows = []

  for (let y = 0; y <= b.length; y++) {
    const maxScoreRow = []
    const arrowDirectionRow = []
    for (let x = 0; x <= a.length; x++) {
      let maxScore
      let arrowDirection
      if (x === 0 && y === 0) {
        maxScore = 0
        arrowDirection = STOP
      } else if (x === 0) {
        maxScore = -y
        arrowDirection = UP
      } else if (y === 0) {
        maxScore = -x
        arrowDirection = LEFT
      } else {
        const upLeft = maxScoreRows[y - 1][x - 1] +
          (a.charAt(x - 1) === b.charAt(y - 1) ? 1 : -1)
        const up = maxScoreRows[y - 1][x] - 1
        const left = maxScoreRow[x - 1] - 1
        if (up >= upLeft && up >= left) {
          maxScore = up
          arrowDirection = UP
        } else if (left >= upLeft && left >= up) {
          maxScore = left
          arrowDirection = LEFT
        } else if (upLeft >= up && upLeft >= left) {
          maxScore = upLeft
          arrowDirection = UP_LEFT
        } else {
          throw Error('Impossible to reach this line')
        }
      }

      maxScoreRow.push(maxScore)
      arrowDirectionRow.push(arrowDirection)
    }
    maxScoreRows.push(maxScoreRow)
    arrowDirectionRows.push(arrowDirectionRow)
  }

  let x = a.length
  let y = b.length
  const edits = []
  while (x >= 0 && y >= 0) {
    const arrowDirection = arrowDirectionRows[y][x]
    if (arrowDirection === LEFT) {
      edits.unshift([a.charAt(x - 1), ''])
      x -= 1
    } else if (arrowDirection === UP) {
      edits.unshift(['', b.charAt(y - 1)])
      y -= 1
    } else if (arrowDirection === UP_LEFT) {
      edits.unshift([a.charAt(x - 1), b.charAt(y - 1)])
      x -= 1
      y -= 1
    } else {
      break
    }
  }

  return edits
}