import { useEffect, useState } from 'react'

function Leaderboard() {
  const [scores, setScores] = useState([])

  useEffect(() => {
    fetchScores()
  }, [])

  const fetchScores = async () => {
    try {
      const response = await fetch(
        'http://localhost:3000/scores'
      )

      const data = await response.json()

      setScores(data)
    } catch (error) {
      console.error(error)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60

    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return (
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Jugador</th>
          <th>Movimientos</th>
          <th>Tiempo</th>
        </tr>
      </thead>

      <tbody>
        {scores.map((score, index) => (
          <tr key={score.id}>
            <td>{index + 1}</td>
            <td>{score.username}</td>
            <td>{score.moves}</td>
            <td>{formatTime(score.seconds)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Leaderboard