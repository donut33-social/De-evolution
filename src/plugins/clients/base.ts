import {
  Content,
  IAgentRuntime,
  IImageDescriptionService,
  Memory,
  State,
  UUID,
  getEmbeddingZeroVector,
  elizaLogger,
  stringToUuid,
} from "@elizaos/core";
import TwitterApi from "twitter-api-sdk";
import { TwitterProfile, Tweet } from "../types";
import {
  getRecentTweets,
  getRecentReplys,
  getProfileByTwitterId,
  getProfileByTwitterUsername,
  getProfileByAgentName,
} from "../../db/apis/tweet";

export class BaseClient {
  runtime: IAgentRuntime;
  lastCheckedTweetId: number; // db id
  temperature: number = 0.5;
  directions: string;

  profile: TwitterProfile;

  constructor(runtime: IAgentRuntime) {
    this.runtime = runtime;
    this.directions =
            "- " +
            this.runtime.character.style.all.join("\n- ") +
            "- " +
            this.runtime.character.style.post.join();
  }

  async init() {
    this.profile = await this.getProfileByAgentName(this.runtime.character.name);

  }

  async getProfileByTwitterId(twitterId: string) {
    const profile = await getProfileByTwitterId(twitterId);
    return profile
  }

  async getProfileByTwitterUsername(username: string) {
    const profile = await getProfileByTwitterUsername(username);
    return profile
  }

  async getProfileByAgentName(agentName: string) {
    const profile = await getProfileByAgentName(agentName);
    return profile
  }

  async cacheTweet(tweet: Tweet): Promise<void> {
    if (!tweet) {
      console.warn("Tweet is undefined, skipping cache");
      return;
    }

    this.runtime.cacheManager.set(`twitter/tweets/${tweet.id}`, tweet);
  }

  async getCachedTweet(tweetId: string): Promise<Tweet | undefined> {
    const cached = await this.runtime.cacheManager.get<Tweet>(
      `twitter/tweets/${tweetId}`
    );

    return cached;
  }

  async handleNewTweet(runtime: IAgentRuntime, content: Content) {}
}
