import axios from "axios"

const DEEPCLAUDE_URL = "http://localhost:3000"

async function testDeepClaude() {
  try {
    const response = await axios.post(
      DEEPCLAUDE_URL,
      {
        messages: [{ role: "user", content: 'How many "r"s in the word "strawberry"?' }],
        stream: false,
        verbose: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-DeepSeek-API-Token": process.env.DEEPSEEK_API_KEY,
          "X-Anthropic-API-Token": process.env.ANTHROPIC_API_KEY,
        },
      },
    )

    console.log("DeepClaude Response:", JSON.stringify(response.data, null, 2))
  } catch (error) {
    console.error("Error testing DeepClaude:", error)
  }
}

testDeepClaude()

