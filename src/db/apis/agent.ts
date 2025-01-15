import { execute } from '../pool';
import { emptyOrRow, emptyOrRows } from "../helper";

export const getCharacter = async (agentName: string) => {
    let sql = `SELECT twitter_id as twitterId, name, tick, bios, lores, topics, adjectives
     FROM agent WHERE agent_name = ? LIMIT 1`;
    let result = await execute(sql, [agentName]);
    return emptyOrRow(result);
}

export const getProfileByTwitterId = async (twitterId: string) => {
    let sql = `SELECT twitter_id as twitterId, twitter_username as username, twitter_name as name,
     followers as followersCount, followings as followingCount, create_at as createdAt 
     FROM account WHERE twitter_id = ? LIMIT 1`;
    let result = await execute(sql, [twitterId]);
    return emptyOrRow(result);
}

export const getProfileByTwitterUsername = async (twitterUsername: string) => {
    let sql = `SELECT twitter_id as twitterId, twitter_username as username, twitter_name as name,
     followers as followersCount, followings as followingCount, create_at as createdAt 
     FROM account WHERE twitter_username = ? LIMIT 1`;
    let result = await execute(sql, [twitterUsername]);
    return emptyOrRow(result);
}

export const getProfileByAgentName = async (agentName: string) => {
    let sql = `SELECT twitter_id as twitterId, twitter_username as username, twitter_name as name,
     followers as followersCount, followings as followingCount, create_at as createdAt,
     ag.password, ag.email, ag.secret_2fa as secret2fa
     FROM account as a 
     LEFT JOIN agent as ag ON ag.twitter_id = a.twitter_id
     WHERE ag.name = ? LIMIT 1`;
    let result = await execute(sql, [agentName]);
    return emptyOrRow(result);
}