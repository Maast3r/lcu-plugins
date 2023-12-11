import axios from 'axios';
import LcuPluginManager from 'lcu-plugin-manager';

import AutoAcceptQueuePlugin from './plugins/autoAcceptQueuePlugin.js';
import ChangeLobbyPlugin from './plugins/changeLobbyPlugin.js';
import NeverDodgePlugin from './plugins/neverDodgePlugin.js';
import RandomChampSelectorPlugin from './plugins/randomChampSelectorPlugin.js';

const plugins = [
    new AutoAcceptQueuePlugin(),
    new ChangeLobbyPlugin(),
    new NeverDodgePlugin(),
    new RandomChampSelectorPlugin(),
];

const pluginManager = new LcuPluginManager(plugins);

pluginManager.start();

/// PORTS AND TOKENS UPDATE EVERYTIME CLIENT STARTS. NOT SECRET / DONT CARE

// const randomThing = () => {
//     axios.defaults.baseURL = 'https://127.0.0.1:54295';
//     axios.get(
//         'lol-chat/v1/friends',
//         {
//             headers: {
//                 Authorization: 'Basic cmlvdDp3RnFXSERsVlBZUTBTcUMtTHFteUlB',
//                 'Content-Type': 'application/json',
//             }
//         }
//     ).then((data) => {
//         // console.log(data.data);
//         const friends = data.data;
//         for (const friend of friends) {
//             if (friend?.lol?.pty) {
//                 console.log(friend);
//                 // const party = JSON.parse(friend.lol.pty);
//                 // this.joinFriend(party.partyId);
//                 // break;
//             }
//         }
//     });
// };
// randomThing();
