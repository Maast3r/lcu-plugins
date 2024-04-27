import axios from 'axios';
import LcuPlugin from 'lcu-plugin';

const LOBBY_MATCHMAKING_SEARCH_ENDPOINT = 'lol-lobby/v2/lobby/matchmaking/search';
const LOBBY_EVENT = 'OnJsonApiEvent_lol-lobby_v2_comms';
const CONVERSATIONS_EVENT = 'OnJsonApiEvent_lol-chat_v1_conversations';

export const label = 'Ready Up';

export default class ReadyUpPlugin extends LcuPlugin {
    constructor(...args) {
        super(...args);

        this.partyMembers = {};
    }

    onConnect(clientData) {
        axios.defaults.baseURL = `${clientData.protocol}://${clientData.address}:${clientData.port}`;
        axios.defaults.auth = {
            username: clientData.username,
            password: clientData.password,
        };

        this.subscribeEvent(LOBBY_EVENT, this.handlePartyMemberChange);
        this.subscribeEvent(CONVERSATIONS_EVENT, this.readyUp);
        this.log('is ready');
    }

    async handlePartyMemberChange(event) {
        if (event?.data?.players) {
            const partySummonerIds = Object.entries(event.data.players).map(([_, value]) => value.summonerId)

            for (const summonerId in this.partyMembers) {
                if (!partySummonerIds.includes(summonerId)) {
                    delete this.partyMembers[summonerId];
                }
            }

            partySummonerIds.forEach((summonerId) => {
                if (!this.partyMembers[summonerId]) {
                    this.partyMembers[summonerId] = 0;
                }
            });
        }
    }

    async startQueue() {
        return axios.post(LOBBY_MATCHMAKING_SEARCH_ENDPOINT)
            .catch((error) => this.error(error));
    }

    resetMembersReady() {
        for (const member in this.partyMembers) {
            this.partyMembers[member] = 0;
        }
    }

    async readyUp(event) {
        const message = event?.data?.body;

        if (message === 'r' || message === 'ready') {
            this.partyMembers[event?.data?.fromSummonerId] = 1;

            if (Object.values(this.partyMembers).every((value) => value)) {
                this.startQueue();
                this.resetMembersReady();
            }
        } else if (message === 'im bad and not ready') {
            this.partyMembers[event?.data?.fromSummonerId] = 0;
        }
    }
}
