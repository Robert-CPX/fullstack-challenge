import { Web3 } from 'web3'
import { headers } from 'next/headers'

/**
 * A webhook for Moralis Streams, which listens for Curation contract events, triggered by the Moralis Stream API.
 * [Doc](https://docs.moralis.io/streams-api/evm/webhook-security)
 */
export async function POST(req: Request) {
  const secret = process.env.MORALIS_STREAM_SECRET;

  if (!secret) throw new Error("Secret not provided")

  const headerPayload = headers();
  const providedSignature = headerPayload.get("x-signature");
  if (!providedSignature) throw new Error("Signature not provided")

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const generatedSignature = Web3.utils.sha3(body + secret)
  if (generatedSignature !== providedSignature) throw new Error("Invalid Signature")
  await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events`, {
    method: 'POST',
    body,
  })
  return new Response('', { status: 200 })
}