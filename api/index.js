import express from "express"
import { config } from "dotenv"

const app = express()
config()

app.use("/", (req, res, next) => {
  res.send("Hello World")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
