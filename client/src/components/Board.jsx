import { useEffect, useState } from 'react'
import Tile from './Tile'
import Leaderboard from './Leaderboard'

import {
  shuffleBoard,
  canMove,
  isSolved,
} from '../utils/puzzleUtils'

function Board() {
  const [board, setBoard] = useState([])
  const [moves, setMoves] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [won, setWon] = useState(false)
  const [gameStarted, setGameStarted] =
    useState(false)

  const [showLeaderboard, setShowLeaderboard] =
    useState(false)

  const [username, setUsername] = useState('')

  const [showUsernameModal, setShowUsernameModal] =
    useState(false)

  useEffect(() => {
    startGame()

    const savedUsername =
      localStorage.getItem('puzzleUsername')

    if (savedUsername) {
      setUsername(savedUsername)
    } else {
      setShowUsernameModal(true)
    }
  }, [])

  useEffect(() => {
    if (!gameStarted || won) return

    const timer = setInterval(() => {
      setSeconds(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [gameStarted, won])

  const startGame = () => {
    setBoard(shuffleBoard())
    setMoves(0)
    setSeconds(0)
    setWon(false)
    setGameStarted(false)
  }

  const saveUsername = () => {
    if (!username.trim()) return

    localStorage.setItem(
      'puzzleUsername',
      username
    )

    setShowUsernameModal(false)
  }

  const formatTime = () => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60

    return `${String(mins).padStart(
      2,
      '0'
    )}:${String(secs).padStart(2, '0')}`
  }

  const saveScore = async () => {
    try {
      await fetch('http://localhost:3000/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          moves,
          seconds,
        }),
      })

      console.log('Score guardado')
    } catch (error) {
      console.error(
        'Error guardando score:',
        error
      )
    }
  }

  const moveTile = (index) => {
    const emptyIndex = board.indexOf(null)

    if (!canMove(index, emptyIndex)) {
      return
    }

    if (!gameStarted) {
      setGameStarted(true)
    }

    const newBoard = [...board]

    ;[newBoard[index], newBoard[emptyIndex]] = [
      newBoard[emptyIndex],
      newBoard[index],
    ]

    setBoard(newBoard)

    setMoves(prev => prev + 1)

    if (isSolved(newBoard)) {
      setWon(true)
      saveScore()
    }
  }

  return (
    <>
      <div className="game-container">
        <h1>Puzzle Deslizante</h1>

        <div className="stats">
          <div>
            <span>Movimientos</span>
            <strong>{moves}</strong>
          </div>

          <div>
            <span>Tiempo</span>
            <strong>{formatTime()}</strong>
          </div>
        </div>

        <div className="board">
          {board.map((tile, index) => (
            <Tile
              key={index}
              number={tile}
              onClick={() => moveTile(index)}
            />
          ))}
        </div>

        <div className="buttons-container">
          <button
            className="restart-btn"
            onClick={startGame}
          >
            Reiniciar
          </button>

          <button
            className="ranking-btn"
            onClick={() =>
              setShowLeaderboard(true)
            }
          >
            🏆 Ranking
          </button>
        </div>
      </div>

      {showUsernameModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>👋 Bienvenido</h2>

            <p>
              Ingresa tu nombre para guardar
              tus récords
            </p>

            <input
              className="username-input"
              type="text"
              placeholder="Tu nombre"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
            />

            <button
              className="restart-btn"
              onClick={saveUsername}
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {won && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>🎉 Puzzle Completado</h2>

            <p>
              Terminaste en{' '}
              <strong>{formatTime()}</strong>
            </p>

            <p>
              Movimientos:{' '}
              <strong>{moves}</strong>
            </p>

            <button
              className="restart-btn"
              onClick={startGame}
            >
              Jugar otra vez
            </button>
          </div>
        </div>
      )}

      {showLeaderboard && (
        <div className="modal-overlay">
          <div className="leaderboard-modal">
            <div className="leaderboard-header">
              <h2>🏆 Ranking</h2>

              <button
                className="close-btn"
                onClick={() =>
                  setShowLeaderboard(false)
                }
              >
                ✕
              </button>
            </div>

            <Leaderboard />
          </div>
        </div>
      )}
    </>
  )
}

export default Board