import { b64uEnc, b64uDec } from '../utils/helper'

export default {
    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: b64uDec(process.env.DB_PASSWORD),

    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_PWD: b64uDec(process.env.REDIS_PWD),

    TWITTER_REDIS_HOST: process.env.TWITTER_REDIS_HOST,
    TWITTER_REDIS_PORT: process.env.TWITTER_REDIS_PORT,
    TWITTER_REDIS_PWD: b64uDec(process.env.TWITTER_REDIS_PWD),

    TWITTER_SEARCH_TOKEN: b64uDec(process.env.TWITTER_SEARCH_TOKEN),
    TWITTER_SEARCH_TOKEN2: b64uDec(process.env.TWITTER_SEARCH_TOKEN2),

    STEEM_TRANSFER_DELEGATE_KEY: b64uDec(process.env.STEEM_TRANSFER_DELEGATE_KEY),
    // use to decode message that encode by tweetnacl
    SEND_KEY_PRIVATE: b64uDec(process.env.SEND_KEY_PRIVATE),
    TIPTAG_POSTING_KEY: b64uDec(process.env.TIPTAG_POSTING_KEY),

    TIPTAG_FARCASTER_UUID: process.env.TIPTAG_FARCASTER_UUID,
    TIPTAG_FARCASTER_FID: process.env.TIPTAG_FARCASTER_FID,
    AGENT_REFRESH_PASS_KEY: process.env.AGENT_REFRESH_PASS_KEY,
    BASE_API_URL: process.env.BASE_API_URL,
}
