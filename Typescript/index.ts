import {
  Connection,
  Keypair,
  Ed25519Keypair,
  Ed25519Program,
  Transaction,
  sendAndConfirmTransaction,
  PublicKey,
} from "@solana/web3.js";
import {
  
  MemcmpFilter,
  GetProgramAccountsConfig,
  DataSizeFilter,
  
} from "@solana/web3.js";
import fs from "fs";
import os from "os";
import BN from "bn.js";
import * as util from "./util";
import * as meta from "@metaplex-foundation/mpl-token-metadata"

const keyPairPath = os.homedir() + "/.config/solana/id.json";
const PrivateKey = JSON.parse(fs.readFileSync(keyPairPath, "utf-8"));
let privateKey = Uint8Array.from(PrivateKey);
const wallet = Keypair.fromSecretKey(privateKey);
const walletPublicKey = wallet.publicKey;

async function main() {
  //const connection = new Connection("https://rpc-mainnet-fork.dappio.xyz", { wsEndpoint: "wss://rpc-mainnet-fork.dappio.xyz/ws", commitment: "processed",});
  const connection = new Connection("https://raydium.genesysgo.net",{ commitment: "processed",});
  let creator = new PublicKey("GoQNVyeWC4vCqfyaM8TLvymSaoBZh4cqthiCdfucuWn8")
  const adminIdMemcmp: MemcmpFilter = {
    memcmp: {
        offset: 394,
        bytes: creator.toString(),
    }
};
const sizeFilter: DataSizeFilter = {
    dataSize: 679,
}
const filters = [adminIdMemcmp,sizeFilter];
const config: GetProgramAccountsConfig = { filters: filters };
const allAccountInfo = await connection.getProgramAccounts(new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"), config);
let vec  = [];
let mint = [];
for (let account of allAccountInfo ){

  let metadata = meta.MetadataData.deserialize(account.account.data);
  mint.push(metadata.mint)
  let data = {"mint":metadata.mint,"id":metadata.data.uri.toString().substring(83).slice(0,-5)}
  vec.push(data)
  
  
}
vec.sort(function (a, b) {
  return a.id - b.id;
});
mint.sort()
let jsonData = JSON.stringify(vec);
let arrayData = JSON.stringify(mint);
fs.writeFileSync('id-mint.json', jsonData);
fs.writeFileSync('mints.json', arrayData);
}

main();
