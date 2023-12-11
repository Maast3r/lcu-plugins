import axios from 'axios';
import LcuPlugin from 'lcu-plugin';

export const label = 'Never Dodge';

const CURRENT_SUMMONER_ENDPOINT = 'lol-summoner/v1/current-summoner';
const PICKABLE_CHAMPS_ENDPOINT = 'lol-champ-select/v1/pickable-champion-ids';
const SELECT_CHAMP_ENDPOINT = 'lol-champ-select/v1/session/actions';

const CHAMP_SELECT_EVENT = 'OnJsonApiEvent_lol-champ-select_v1_session';

export default class NeverDodgePlugin extends LcuPlugin {
    onConnect(clientData) {
        axios.defaults.baseURL = `${clientData.protocol}://${clientData.address}:${clientData.port}`;
        axios.defaults.auth = {
            username: clientData.username,
            password: clientData.password,
        };

        return this.getCurrentSummoner().then((currentSummonerId) => {
            this.subscribeEvent(
                CHAMP_SELECT_EVENT,
                this.dontDodge(currentSummonerId)
            );
            this.log('is ready');
        }).catch((error) => console.error(error));
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

    dontDodge(currentSummonerId) {
        return async (event) => {
            const actions = event.data.actions.flat();
            const actorCellId = event.data.myTeam.find(
                (teammate) => teammate.summonerId === currentSummonerId
            )?.cellId;

            if (actorCellId === undefined || event.eventType !== 'Update') {
                return;
            }

            const pickActionForCurrentSummoner = actions.find(
                (action) =>
                    action.actorCellId === actorCellId && action.type === 'pick'
            );

            if (
                !pickActionForCurrentSummoner ||
                pickActionForCurrentSummoner.completed
            ) {
                return;
            }

            if (pickActionForCurrentSummoner.isInProgress) {
                setTimeout(() => {
                    this.pickRandomChamp(pickActionForCurrentSummoner.id);
                }, event.data.timer.adjustedTimeLeftInPhase - 1000);
            }
        };
    }

    async getPickableChamps() {
        const { data: pickableChamps } = await axios.get(
            PICKABLE_CHAMPS_ENDPOINT
        );
        return pickableChamps;
    }

    async pickRandomChamp(actionId) {
        const pickableChamps = await this.getPickableChamps();
        const randomIndex = Math.floor(Math.random() * pickableChamps.length);
        const randomChampId = pickableChamps[randomIndex];

        axios
            .patch(`${SELECT_CHAMP_ENDPOINT}/${actionId}`, {
                championId: randomChampId,
                completed: true,
            })
            .catch((error) => null);
    }
}
