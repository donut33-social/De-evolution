import { 
    elizaLogger, 
    AgentRuntime,
    parseJsonArrayFromText,
    parseJSONObjectFromText
} from "@elizaos/core";
import { getCharacter } from "./db/apis/agent.ts";

class DeEvoAgent extends AgentRuntime {
    updateCharacterInterval: NodeJS.Timeout;
    
    pollingUpdateCharacter() {
        this.updateCharacterInterval = setInterval(this.updateCharacter, 600000);
    }

    override async initialize() {
        elizaLogger.info("De evolution agent initialized");
        this.pollingUpdateCharacter();
        await super.initialize();
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