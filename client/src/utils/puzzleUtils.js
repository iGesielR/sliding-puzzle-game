export const BOARD_SIZE = 4

export const createSolvedBoard = () => {
  const numbers = []

  for (let i = 1; i < BOARD_SIZE * BOARD_SIZE; i++) {
    numbers.push(i)
  }

  numbers.push(null)

  return numbers
}

export const canMove = (index, emptyIndex) => {
  const row = Math.floor(index / BOARD_SIZE)
  const col = index % BOARD_SIZE

  const emptyRow = Math.floor(emptyIndex / BOARD_SIZE)
  const emptyCol = emptyIndex % BOARD_SIZE

  return (
    (Math.abs(row - emptyRow) === 1 &&
      col === emptyCol) ||
    (Math.abs(col - emptyCol) === 1 &&
      row === emptyRow)
  )
}

export const shuffleBoard = () => {
  let board = createSolvedBoard()

  let emptyIndex = board.indexOf(null)

  for (let i = 0; i < 300; i++) {
    const possibleMoves = []

    board.forEach((tile, index) => {
      if (canMove(index, emptyIndex)) {
        possibleMoves.push(index)
      }
    })

    const randomMove =
      possibleMoves[
        Math.floor(
          Math.random() * possibleMoves.length
        )
      ]

    ;[
      board[randomMove],
      board[emptyIndex],
    ] = [
      board[emptyIndex],
      board[randomMove],
    ]

    emptyIndex = randomMove
  }

  return board
}

export const isSolved = (board) => {
  for (let i = 0; i < board.length - 1; i++) {
    if (board[i] !== i + 1) {
      return false
    }
  }

  return true
}