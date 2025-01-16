import { ethers } from "ethers";
import { elizaLogger } from "@elizaos/core";
import abis from "./abis";

const chainConfig = {
    "base": {
        "rpc": "https://mainnet.base.org/",
        "chainId": 8453,
        "chainName": "Base",
        "nativeCurrency": {
            "name": "Base",
            "symbol": "ETH",
            "decimals": 18
        },
        "multiCallAddress": "0xcA11bde05977b3631167028862bE2a173976CA11"
    }
}

async function getProvider(chain: string) {
    const config = chainConfig[chain];
    return new ethers.JsonRpcProvider(config.rpc);
}

export async function getBalance(address: string, token: string, chain: string) {
    const provider = await getProvider(chain);
    const contract = new ethers.Contract(token, abis.ERC20, provider);
    const balance = await contract.balanceOf(address);
    return balance / 1e18;
}

export async function getEthBalance(address: string, chain: string) {
    const provider = await getProvider(chain);
    const balance: any = await provider.getBalance(address);
    return balance.toString() / 1e18;
}