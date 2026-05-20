const express = require('express')
const cors = require('cors')
const fs = require('fs-extra')

const app = express()

app.use(cors())
app.use(express.json())

const FILE_PATH = './scores.json'

const readScores = async () => {
  try {
    const data = await fs.readJson(FILE_PATH)
    return data
  } catch {
    return []
  }
}

const saveScores = async (scores) => {
  await fs.writeJson(FILE_PATH, scores, {
    spaces: 2,
  })
}

app.get('/scores', async (req, res) => {
  const scores = await readScores()

  scores.sort((a, b) => a.seconds - b.seconds)

  res.json(scores)
})

app.post('/scores', async (req, res) => {
  const scores = await readScores()

  const newScore = {
    id: Date.now(),
    username: req.body.username,
    moves: req.body.moves,
    seconds: req.body.seconds,
    date: new Date(),
  }

  scores.push(newScore)

  await saveScores(scores)

  res.json({
    success: true,
  })
})

app.listen(3000, () => {
  console.log('Servidor iniciado en puerto 3000')
})