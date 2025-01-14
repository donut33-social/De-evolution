import { execute } from '../pool';
import { emptyOrRow, emptyOrRows } from "../helper";

export const getCharacter = async (agentName: string) => {
    let sql = `SELECT twitter_id as twitterId, name, tick, bios, lores, topics, adjectives
     FROM agent WHERE agent_name = ? LIMIT 1`;
    let result = await execute(sql, [agentName]);
    return emptyOrRow(result);
}