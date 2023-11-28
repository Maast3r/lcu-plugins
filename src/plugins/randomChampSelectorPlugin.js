import axios from 'axios';
import LcuPlugin from 'lcu-plugin';

export const label = 'Random Champ Selector';

const CURRENT_CHAMP_SELECT_SESSION_ENDPOINT = 'lol-champ-select/v1/session';
const CURRENT_SUMMONER_ENDPOINT = 'lol-summoner/v1/current-summoner';
const PICKABLE_CHAMPS_ENDPOINT = 'lol-champ-select/v1/pickable-champion-ids';
const SELECT_CHAMP_ENDPOINT = 'lol-champ-select/v1/session/actions';

const CONVERSATIONS_EVENT = 'OnJsonApiEvent_lol-chat_v1_conversations';

export default class RandomChampSelectorPlugin extends LcuPlugin {
    onConnect(clientData) {
        axios.defaults.baseURL = `${clientData.protocol}://${clientData.address}:${clientData.port}`;
        axios.defaults.auth = {
            username: clientData.username,
            password: clientData.password,
        };

        return this.getCurrentSummoner().then((currentSummonerId) => {
            this.subscribeEvent(
                CONVERSATIONS_EVENT,
                this.pickRandomChamp(currentSummonerId)
            );
            this.log('is ready');
        });
    }

    async getCurrentSummoner() {
        return axios
            .get(CURRENT_SUMMONER_ENDPOINT)
            .then((response) => {
                return response.data.summonerId;
            })
            .catch((error) => {
                console.error(error);
            });
    }

    async getPickableChamps() {
        const { data: pickableChamps } = await axios.get(
            PICKABLE_CHAMPS_ENDPOINT
        );
        return pickableChamps;
    }

    async getPickActionId(currentSummonerId) {
        const { data: sessionData } = await axios.get(
            CURRENT_CHAMP_SELECT_SESSION_ENDPOINT
        );
        const actorCellId = sessionData.myTeam.find(
            (player) => player.summonerId === currentSummonerId
        ).cellId;
        const flattenedActions = sessionData.actions.flat();

        return flattenedActions.find(
            (action) => action.actorCellId === actorCellId
        ).id;
    }

    //  todo: add check to only go if the current sumoner is the one typing
    pickRandomChamp(currentSummonerId) {
        return async (event) => {
            if (/random/i.test(event?.data?.body) && event.data.fromSummonerId === currentSummonerId) {
                const pickableChamps = await this.getPickableChamps();
                const randomIndex = Math.floor(
                    Math.random() * pickableChamps.length
                );
                const randomChampId = pickableChamps[randomIndex];
                const actionId = await this.getPickActionId(currentSummonerId);

                const shouldInstaLock = /lock/i.test(event.data.body);

                axios
                    .patch(`${SELECT_CHAMP_ENDPOINT}/${actionId}`, {
                        championId: randomChampId,
                        completed: shouldInstaLock,
                    })
                    .catch((error) => console.error(error));
            }
        };
    }
}
