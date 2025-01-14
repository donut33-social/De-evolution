/**
 * 3-7小时间随机选择一个时间作为间隔
 * 根据社区过去一段时间的推文详情，发布一些推文
 * 可以发布多条推文，这些推文会以随机间隔发布出来
 */
import type { Tweet } from "../types.ts";
import {
    composeContext,
    generateText,
    getEmbeddingZeroVector,
    IAgentRuntime,
    ModelClass,
    stringToUuid,
    UUID,
    messageCompletionFooter,
    shouldRespondFooter,
    booleanFooter,
    stringArrayFooter,
    postActionResponseFooter,
    generateTweetActions
} from "@elizaos/core";
import { elizaLogger } from "@elizaos/core";
import { BaseClient, DEFAULT_MAX_TWEET_LENGTH } from "./base.ts";
import { buildConversationThread } from "./utils.ts";
import { twitterMessageHandlerTemplate } from "./interactions.ts";

const twitterPostTemplate = `
# Areas of Expertise
{{knowledge}}

# About {{agentName}} (@{{twitterUserName}}):
{{bio}}
{{lore}}
{{topics}}

{{providers}}

{{characterPostExamples}}

{{postDirections}}

# Task: Generate a post in the voice and style and perspective of {{agentName}} @{{twitterUserName}}.
Write a post that is {{adjective}} about {{topic}} (without mentioning {{topic}} directly), from the perspective of {{agentName}}. Do not add commentary or acknowledge this request, just write the post.
Your response should be 1, 2, or 3 sentences (choose the length at random).
Your response should not contain any questions. Brief, concise statements only. The total character count MUST be less than {{maxTweetLength}}. No emojis. Use \\n\\n (double spaces) between statements if there are multiple statements in your response.`;

export const twitterActionTemplate =
    `
# INSTRUCTIONS: Determine actions for {{agentName}} (@{{twitterUserName}}) based on:
{{bio}}
{{postDirections}}

Guidelines:
- ONLY engage with content that DIRECTLY relates to character's core interests
- Direct mentions are priority IF they are on-topic
- Skip ALL content that is:
  - Off-topic or tangentially related
  - From high-profile accounts unless explicitly relevant
  - Generic/viral content without specific relevance
  - Political/controversial unless central to character
  - Promotional/marketing unless directly relevant

Actions (respond only with tags):
[LIKE] - Perfect topic match AND aligns with character (9.8/10)
[RETWEET] - Exceptional content that embodies character's expertise (9.5/10)
[QUOTE] - Can add substantial domain expertise (9.5/10)
[REPLY] - Can contribute meaningful, expert-level insight (9.5/10)

Tweet:
{{currentTweet}}

# Respond with qualifying action tags only. Default to NO action unless extremely confident of relevance.` +
    postActionResponseFooter;

interface PendingTweet {
    cleanedContent: string;
    roomId: UUID;
    newTweetContent: string;
    discordMessageId: string;
    channelId: string;
    timestamp: number;
}

type PendingTweetApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";
    
export class TwitterPostClient {
    client: BaseClient;
    runtime: IAgentRuntime;
    

    constructor(client: BaseClient, runtime: IAgentRuntime) {
        this.client = client;
        this.runtime = runtime;
        elizaLogger.info("TwitterPostClient Configuration:");
        elizaLogger.info(`- Username: ${this.client.profile.username}`);
        elizaLogger.info(`- Agent Name: ${this.runtime.character.name}`);
    }

    async postTweet(tweet: PendingTweet) {
        const tweet = await this.runtime.agent.postTweet(tweet.newTweetContent);
    }
}