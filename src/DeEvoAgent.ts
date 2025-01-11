import { 
    elizaLogger, 
    AgentRuntime, 
    ModelProviderName, 
    validateCharacterConfig,
    defaultCharacter,
    type UUID, 
    type Character, 
    type Action, 
    type Evaluator, 
    type Provider, 
    type Service, 
    type IMemoryManager, 
    type IDatabaseAdapter, 
    type ICacheManager } from "@elizaos/core";
import path from "path";
import fs from "fs";
import { Prompt } from "./types";

class DeEvoAgent extends AgentRuntime {
    
    constructor(opts: {
        conversationLength?: number; // number of messages to hold in the recent message cache
        agentId?: UUID; // ID of the agent
        character?: Character; // The character to use for the agent
        token: string; // JWT token, can be a JWT token if outside worker, or an OpenAI token if inside worker
        serverUrl?: string; // The URL of the worker
        actions?: Action[]; // Optional custom actions
        evaluators?: Evaluator[]; // Optional custom evaluators
        plugins?: Plugin[];
        providers?: Provider[];
        modelProvider: ModelProviderName;

        services?: Service[]; // Map of service name to service instance
        managers?: IMemoryManager[]; // Map of table name to memory manager
        databaseAdapter: IDatabaseAdapter; // The database adapter used for interacting with the database
        fetch?: typeof fetch | unknown;
        speechModelPath?: string;
        cacheManager: ICacheManager;
        logging?: boolean;
    }) {
        super(opts);
    }
    
    async pollingUpdateCharacter() {
        setInterval(() => {
            // TODO: Update character from api
        }, 3600000);
    }

    async run() {
        elizaLogger.info("Hello, world!");
        this.pollingUpdateCharacter();
    }

}
