import { MessageExample } from "@elizaos/core";

/**
 * The prompts of agents those can evolve
 */
export type Prompt = {
    /** Character biography */
    bio: string | string[];
    /** Character background lore */
    lore: string[];
    /** Example messages */
    messageExamples: MessageExample[][];
    /** Example posts */
    postExamples: string[];
    /** Known topics */
    topics: string[];
    /** Character traits */
    adjectives: string[];
    /** Optional knowledge base */
    knowledge?: string[];
    /** Writing style guides */
    style: {
        all: string[];
        chat: string[];
        post: string[];
    };
    /** Optional Twitter profile */
    twitterProfile?: {
        id: string;
        username: string;
        screenName: string;
        bio: string;
        nicknames?: string[];
    };
};