import { execute } from '../pool';
import { emptyOrRow, emptyOrRows } from "../helper";

export const getRecentTweets = async (agentName: string) => {
    let sql = `SELECT t.tweet_id as tweetId, t.content, t.tags, t.page_info as pageInfo, 
    t.retweet_info as retweetInfo, t.tweet_time as tweetTime, t.tick, 
    t.like_count as likeCount, t.retweet_count as retweetCount, t.reply_count as replyCount,
    t.quote_count as quoteCount, a.twitter_name as twitterName, a.twitter_username as twitterUsername, a.profile, a.followers, a.followings,
    a.eth_addr as ethAddr
    FROM tweet as t
    LEFT JOIN account as a ON a.twitter_id = t.twitter_id
    LEFT JOIN agent as ag ON ag.tick = t.tick
    WHERE t.id > ag.last_handled_tweet_id AND ag.agent_name = ?`;

    let result = await execute(sql, [agentName]);
    return emptyOrRows(result);
}

export const getRecentReplys = async (agentName: string) => {
    let sql = `SELECT t.tweet_id as tweetId, t.content, t.tags, t.page_info as pageInfo, 
    t.retweet_info as retweetInfo, t.tweet_time as tweetTime, t.tick, 
    t.like_count as likeCount, t.retweet_count as retweetCount, t.reply_count as replyCount,
    t.quote_count as quoteCount, a.twitter_name as twitterName, a.twitter_username as twitterUsername, a.profile, a.followers, a.followings,
    a.eth_addr as ethAddr
    FROM relation_reply as r
    LEFT JOIN account as a ON a.twitter_id = r.twitter_id
    LEFT JOIN agent as ag ON ag.tick = r.tick
    WHERE r.id > ag.last_handled_reply_id AND ag.agent_name = ?`;
    let result = await execute(sql, [agentName]);
    return emptyOrRows(result);
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
     followers as followersCount, followings as followingCount, create_at as createdAt 
     FROM account as a 
     LEFT JOIN agent as ag ON ag.twitter_id = a.twitter_id
     WHERE ag.name = ? LIMIT 1`;
    let result = await execute(sql, [agentName]);
    return emptyOrRow(result);
}