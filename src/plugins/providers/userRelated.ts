import { Provider, IAgentRuntime, Memory, State, elizaLogger } from "@elizaos/core";
import DeEvoAgent from "../../DeEvoAgent";
import { getUserInfoByUsername } from "../../db/apis/user";
import { getBalance, getEthBalance } from "../../utils/ethers";

export const userRelatedProvider: Provider = {
    async  get(
        runtime: DeEvoAgent,
        message: Memory,
        state?: State
    ): Promise<String | null> {
        try {
            // get user tagai info
            if (state.source != "twitter" || !state.authorUsername) {
                return;
            }

            const userInfo = await getUserInfoByUsername(state.authorUsername as string);
            const tick = runtime.tick;
            const contract = runtime.contract;
            let tokenBalance = 0;
            let ethBalance = 0;
            // get user balance
            if (contract && userInfo.ethAddr) {
                const [ethBalance, tokenBalance] = await Promise.all([getEthBalance(userInfo.ethAddr, 'base'), getBalance(userInfo.ethAddr, contract as string, 'base')]) 
                return `@${state.authorUsername} has ${tokenBalance} $${tick} and ${ethBalance} ETH. $${tick} total supply is 1B.
@${state.authorUsername} has ${ethBalance} ETH balance.
@${state.authorUsername} has ${userInfo.followers} followers and ${userInfo.followings} followings.`;
            }
            return null;
        } catch (error) {
            elizaLogger.error(error);
        }
        return null;
    }
}