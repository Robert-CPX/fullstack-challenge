'use client'
import { Donation } from "@/constants";
import { startListening } from "@/lib/actions/donation.actions"
import { useEffect, useState } from "react"

import io from 'socket.io-client';
const socket = io(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`);

const Home = () => {
  const [donation, setDonation] = useState<Donation | null>(null);

  useEffect(() => {
    startListening()
    socket.on('donation event', (data: string) => {
      setDonation(JSON.parse(data))
    })
  }, [])

  return (
    <div>
      {donation && (
        <div>{donation.cid}</div>
      )}
    </div>
  )
}

export default Home
