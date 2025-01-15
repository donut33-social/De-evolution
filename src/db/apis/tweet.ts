import { execute } from '../pool.ts';
import { emptyOrRow, emptyOrRows } from "../helper.ts";
export const getRecentTweets = async (tick: string, agentUsername: string) => {
    let sql = `SELECT t.tweet_id as conversationId, t.tweet_id as id, t.content as text, t.tags as hashtags, t.page_info as pageInfo, 
    t.retweet_id as quotedStatusId, t.create_at as timeParsed,
    t.retweet_info as retweetInfo, t.tweet_time as tweetTime, t.tick, 
    t.like_count as likes, t.retweet_count as retweets, t.reply_count as replies,
    t.quote_count as quoteCount, 
    a.twitter_id as userId, a.twitter_name as name, a.twitter_username as username, a.profile, a.followers, a.followings,
    a.eth_addr as ethAddr
    FROM tweet as t
    LEFT JOIN account as a ON a.twitter_id = t.twitter_id
    LEFT JOIN agent as ag ON ag.tick = t.tick
    WHERE t.id > ag.last_handled_tweet_id AND ag.tick = ? AND a.twitter_username != ?`;

    let result = await execute(sql, [tick, agentUsername]);
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
