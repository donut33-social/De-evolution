import { Client, elizaLogger, IAgentRuntime } from "@elizaos/core";
import { getRecentTweets, getRecentReplys } from "../../db/apis/tweet";

class TagAiClientInterface implements Client {
    actionsInterval: NodeJS.Timeout;
    postInterval: NodeJS.Timeout;
    
    async start(runtime: IAgentRuntime) {
        elizaLogger.log('TagAiClientInterface start');

    }

    async stop(runtime: IAgentRuntime) {
        clearInterval(this.actionsInterval);
        clearInterval(this.postInterval);
    }



}

export default TagAiClientInterface;