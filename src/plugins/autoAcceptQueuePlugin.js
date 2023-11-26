import axios from 'axios';
import LcuPlugin from 'lcu-plugin';

const GAME_FLOW_EVENT = 'OnJsonApiEvent_lol-gameflow_v1_gameflow-phase';
const ACCEPT_READY_CHECK_ENDPOINT = 'lol-matchmaking/v1/ready-check/accept';

export const label = 'Auto Accept Queue';

export default class AutoAcceptQueuePlugin extends LcuPlugin {
    onConnect(clientData) {
        axios.defaults.baseURL = `${clientData.protocol}://${clientData.address}:${clientData.port}`;
        axios.defaults.auth = {
            username: clientData.username,
            password: clientData.password,
        };

        this.subscribeEvent(GAME_FLOW_EVENT, this.autoAcceptReadyCheck);
        this.log('is ready');
    }

    autoAcceptReadyCheck({ data }) {
        if (data === 'ReadyCheck') {
            axios.post(ACCEPT_READY_CHECK_ENDPOINT).catch((error) => console.error(error));
        }
    }
}
