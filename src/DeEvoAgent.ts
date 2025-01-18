import { 
    elizaLogger, 
    AgentRuntime,
    parseJsonArrayFromText,
    parseJSONObjectFromText
} from "@elizaos/core";
import { getCharacter, getProfileByAgentName } from "./db/apis/agent.ts";

class DeEvoAgent extends AgentRuntime {
    updateCharacterInterval: NodeJS.Timeout;
    ethAddress?: string | undefined;
    contract: string;   // community token contract
    tick: string;       // community token tick symbol
    maxOP: number;     // max OP for a user
    maxVP: number;     // max VP for a user
    opvpRecoverDay: number; // OP and VP recover day
    
    pollingUpdateCharacter() {
        this.updateCharacterInterval = setInterval(this.updateCharacter, 600000);
    }

    override async initialize() {
        elizaLogger.info("De evolution agent initialized");
        this.pollingUpdateCharacter();
        await super.initialize();
        const profile = await getProfileByAgentName(this.character.name);
        this.contract = profile.contract;
        this.ethAddress = profile.ethAddr;
        this.tick = profile.tick;
        this.maxOP = this.getSetting('MAX_OP') ?? 2000;
        this.maxVP = this.getSetting('MAX_VP') ?? 200;
        this.opvpRecoverDay = this.getSetting('OPVP_RECOVER_DAY') ?? 3;
    }
    override async stop() {
        elizaLogger.info("De evolution agent stopped");
        clearInterval(this.updateCharacterInterval);
        await super.stop();
    }

    async updateCharacter() {
        const character = await getCharacter(this.character.name);
        if (!character) {
            elizaLogger.error(`Character ${this.character.name} not found`);
            return;
        }
        const bio = parseJsonArrayFromText(character.bios) ?? this.character.bio;
        const lore = parseJsonArrayFromText(character.lores) ?? this.character.lore;
        const topics = parseJsonArrayFromText(character.topics) ?? this.character.topics;
        const adjectives = parseJsonArrayFromText(character.adjectives) ?? this.character.adjectives;
        const messageExamples = parseJsonArrayFromText(character.messageExamples) ?? this.character.messageExamples;
        const knowledge = parseJsonArrayFromText(character.knowledges) ?? this.character.knowledge;
        const styleAll = character.styleAll ?? this.character.style.all;
        const styleChat = character.styleChat ?? this.character.style.chat;
        const stylePost = character.stylePost ?? this.character.style.post;
        const newCharacter = {
            ...this.character,
            bio,
            lore,
            topics,
            adjectives,
            messageExamples,
            knowledge,
            style: {
                all: styleAll,
                chat: styleChat,
                post: stylePost
            }
        }
        this.character = newCharacter;
    }
}

export default DeEvoAgent;