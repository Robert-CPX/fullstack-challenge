"use server"

import { runStream } from "../moralis"
import { handleError } from "../utils"

// server actions about donation
export const startListening = async () => {
  try {
    const streamId = await runStream()
    console.log("Stream is running: ", streamId)
  } catch (error) {
    handleError(error)
  }
}