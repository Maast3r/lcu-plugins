import axios from 'axios';
import LcuPlugin from 'lcu-plugin';

const CONVERSATIONS_EVENT = 'OnJsonApiEvent_lol-chat_v1_conversations';
const UPDATE_LOBBY_ENDPOINT = 'lol-lobby/v1/parties/queue';

export const label = 'Change Lobby';

const LOBBYS = {
    /// RIFT ///
    aram: 450,
    'aram clash': 720,
    'beginner bots': 840,
    clash: 700,
    'intermediate bots': 850,
    draft: 400,
    flex: 440,
    quickplay: 490,

    // both for solo/duo q
    solo: 420,
    duo: 420,

    /// TFT ///
    dubs: 1160,
    'tft norms': 1090,
    'tft ranked': 1100,
    'hyper roll': 1130,

    // Rotating game modes
    arena: 1710,
};
const LOBBY_NAMES = Object.keys(LOBBYS);

export default class ChangeLobbyPlugin extends LcuPlugin {
    onConnect(clientData) {
        axios.defaults.baseURL = `${clientData.protocol}://${clientData.address}:${clientData.port}`;
        axios.defaults.auth = {
            username: clientData.username,
            password: clientData.password,
        };

        this.subscribeEvent(CONVERSATIONS_EVENT, this.updateLobby);
        this.log('is ready');
    }

    async updateLobby(event) {
        for (const lobbyName of LOBBY_NAMES) {
            const regex = new RegExp(lobbyName);

            if (regex.test(event?.data?.body)) {
                await axios.put(
                    UPDATE_LOBBY_ENDPOINT,
                    JSON.stringify(LOBBYS[lobbyName]),
                    { headers: { 'Content-Type': 'application/json' } } ,
                ).catch((error) => console.error(error));
                break;
            }
        }
    }
}
