import express from "express"
import { askDeepClaude } from "./deepclaude"
import { redisClient, pool } from "./server"

const router = express.Router()

router.get("/", (req, res) => {
  res.send("API is working!")
})

router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body
    const cacheKey = `question:${question}`
    const cachedAnswer = await redisClient.get(cacheKey)

    if (cachedAnswer) {
      return res.json({ answer: cachedAnswer })
    }

    const answer = await askDeepClaude(question)
    await redisClient.set(cacheKey, answer, {
      EX: 3600, // Cache for 1 hour
    })

    res.json({ answer })
  } catch (error) {
    res.status(500).json({ error: "An error occurred while processing your request." })
  }
})

router.get("/search", async (req, res) => {
  try {
    const { query } = req.query
    const result = await pool.query("SELECT * FROM documents WHERE to_tsvector(content) @@ to_tsquery($1)", [query])
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: "An error occurred while searching." })
  }
})

export const apiRoutes = router

