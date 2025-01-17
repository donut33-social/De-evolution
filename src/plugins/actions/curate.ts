import { Action, ActionExample, Memory, State, composeContext, generateTrueOrFalse, ModelClass } from "@elizaos/core"
import DeEvoAgent from "../../DeEvoAgent"
import { getTweetCurationById } from "../../db/apis/tweet"
import { getUserInfoByUsername, getUserVPOPByTwitterId } from "../../db/apis/user"

const shouldCurateTemplate = `# Task: Decide if {{agentName}} should curate the tweet.
{{agentName}} is bref, and doesn't want to be annoying. {{agentName}} will only curate the tweet most greatfull/interesting/helpfull for {{tick}}.
Consider the balance of {{agentName}}'s VP:
The more VP {{agentName}} have the more, the more likely to curate. A suitable VP balance is approximately from 100 to 150.
Now {{agentName}} has {{vpBalance}} VP.`

export default {
    name: 'curate',
    description: 'Curate tweet for reward',
    similes: [],
    examples: [],
    validate: async (_runtime: DeEvoAgent, _message: Memory, _state: State) => {
        if (_message.content.action === 'curate ') {
            //  Determine whether the target tweet is in the database
            const tweetCuration = await getTweetCurationById(_state.tweetId as string);
            if (tweetCuration.tick !== _runtime.tick) {
                return false;
            }
            const userInfo = await getUserInfoByUsername(_state.authorUsername as string);
            const { vp, op } = await getVPOP(_runtime, userInfo.twitterId);
            const vpBalance = vp;

            const context = composeContext({
                state: {
                    ..._state,
                    vpBalance,
                    tick: _runtime.tick,
                },
                template: shouldCurateTemplate,
                templatingEngine: 'handlebars',
            });

            const shouldCurate = await generateTrueOrFalse({
                runtime: _runtime,
                context,
                modelClass: ModelClass.SMALL,
            });
            return shouldCurate;
        }
        return false;
    },
    handler: async (_runtime: DeEvoAgent, _message: Memory) => {
        
        
    }
} as Action

async function getVPOP(runtime: DeEvoAgent, twitterId: string) {
    const vpop = await getUserVPOPByTwitterId(twitterId);
    let vp = vpop.vp;
    let op = vpop.op;
    const lastUpdateVpStamp = vpop.lastUpdateVpStamp;
    const lastUpdateOpStamp = vpop.lastUpdateOpStamp;
    if ((!vp && vp !== 0) || !lastUpdateOpStamp) {
        vp ??= 0;
    }else {
        vp = (vp + (Date.now() - lastUpdateVpStamp) * runtime.maxVP / (864000000 * runtime.opvpRecoverDay))
        vp = vp > runtime.maxVP ? runtime.maxVP : vp
    }
    if ((!op && op !== 0) || !lastUpdateOpStamp) {
        op ??= 0;
    }else {
        op = (op + (Date.now() - lastUpdateOpStamp) * runtime.maxOP / (864000000 * runtime.opvpRecoverDay))
        op = op > runtime.maxOP ? runtime.maxOP : op
    }

    return { vp, op, lastUpdateVpStamp, lastUpdateOpStamp };
}