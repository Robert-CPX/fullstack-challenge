import Moralis from "moralis"
import { CurationABI, CurationAddress } from "@/contracts/Curation"
import { EvmChain } from "@moralisweb3/common-evm-utils";

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
const WEBHOOK_URL = process.env.NGROK_WEBHOOK_URL;

interface RunningStream {
  streamId: string | null;
  promise: Promise<unknown> | null;
}

// to guarantee that the stream is only started once
let cache: RunningStream = (global as any).moralisStream;

if (!cache) {
  cache = (global as any).moralisStream = { streamId: null, promise: null };
}
/**
 * @notice create and run a moralis stream if it doesn't exist yet. listen to the Curation contract events on polygon mainnet.
 * @return streamId
 */
export const runStream = async () => {
  if (cache.streamId) return cache.streamId;

  if (!MORALIS_API_KEY) throw new Error("Please define the MORALIS_API_KEY environment variable inside .env.local file");
  if (!WEBHOOK_URL) throw new Error("Please define the WEBHOOK_URL environment variable inside .env.local file");

  const topic0 = "Curation(address, address, address, string, uint256)";
  const topic1 = "Curation(address, address, string, uint256)";

  const options = {
    chains: [EvmChain.POLYGON],
    description: "matters donation stream",
    tag: "matters",
    abi: CurationABI,
    includeContractLogs: true,
    includeNativeTxs: true,
    topic0: [topic0, topic1],
    webhookUrl: WEBHOOK_URL,
  }

  // check [Moralis streams api](https://docs.moralis.io/streams-api/evm/using-node-js-sdk) for more details
  cache.promise = cache.promise || Moralis.start({ apiKey: process.env.MORALIS_API_KEY }).then(async () => {
    return Moralis.Streams.add(options).then((stream) => {
      cache.streamId = stream.toJSON().id;
      return Moralis.Streams.addAddress({
        id: cache.streamId,
        address: [CurationAddress]
      }) as Promise<unknown>
    })
  })

  await cache.promise;
  return cache.streamId;
}