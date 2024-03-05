import { Donation } from "@/constants";
import { ethers } from "ethers";
/**
 * Manually parsing logs from moralis stream api
 */
export const parseLogs = (payload: string) => {
  type BlockInfo = {
    number: string;
    hash: string;
    timestamp: string;
  };

  type Transaction = {
    hash: string;
    gas: string;
    gasPrice: string;
    nonce: string;
    input: string;
    transactionIndex: string;
    fromAddress: string;
    toAddress: string;
    value: string;
    type: string;
    v: string;
    r: string;
    s: string;
    receiptCumulativeGasUsed: string;
    receiptGasUsed: string;
    receiptContractAddress: null | string;
    receiptRoot: null | string;
    receiptStatus: string;
  };

  type JSONData = {
    confirmed: boolean;
    chainId: string;
    abi: any[];
    streamId: string;
    tag: string;
    retries: number;
    block: BlockInfo;
    logs: any[];
    txs: Transaction[];
    txsInternal: any[];
    erc20Transfers: any[];
    erc20Approvals: any[];
    nftTokenApprovals: any[];
    nftApprovals: { ERC721: any[]; ERC1155: any[] };
    nftTransfers: any[];
    nativeBalances: any[];
  };
  const parsedData: JSONData = JSON.parse(payload);
  const tx = parsedData.txs[0];
  const args = decodeArguments(tx.input);
  return {
    "sender": tx.fromAddress,
    "recipient": tx.toAddress,
    "amount": tx.value,
    "cid": args?.at(-1)
  } as Donation;
}

export const decodeArguments = (inputData: string) => {
  let abi = ['']
  const selector1 = ethers.keccak256(ethers.toUtf8Bytes('curate(address,address,uint256,string)')).slice(0, 10);
  const selector2 = ethers.keccak256(ethers.toUtf8Bytes('curate(address,string)')).slice(0, 10);

  if (inputData.startsWith(selector1)) {
    abi = ["function curate(address to_, IERC20 token_, uint256 amount_, string uri_)"];
  } else if (inputData.startsWith(selector2)) {
    abi = ["function curate(address to_, string uri_)"];
  }
  console.log("inputData: ", inputData, "selector1: ", selector1, "selector2: ", selector2);

  const iface = new ethers.Interface(abi);
  const decoded = iface.parseTransaction({ data: inputData });
  if (!decoded) return null;
  return decoded.args;
}