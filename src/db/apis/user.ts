import { execute } from "../pool";
import { emptyOrRows } from "../helper";

export const getUserInfoByUsername = async (username: string) => {
    let sql = `SELECT twitter_id as twitterId, followers, followings, 
    eth_addr as ethAddr, sol_addr as solAddr, btc_addr as btcAddr,
    verified FROM account WHERE twitter_username = ?`;
    let result = await execute(sql, [username]);
    return emptyOrRows(result);
}