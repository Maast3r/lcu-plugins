import axios from 'axios';
import LcuPluginManager from 'lcu-plugin-manager';

import AutoAcceptQueuePlugin from './plugins/autoAcceptQueuePlugin.js';
import ChangeLobbyPlugin from './plugins/changeLobbyPlugin.js';
import RandomChampSelectorPlugin from './plugins/randomChampSelectorPlugin.js';

const plugins = [
    new AutoAcceptQueuePlugin(),
    new ChangeLobbyPlugin(),
    new RandomChampSelectorPlugin(),
];

const pluginManager = new LcuPluginManager(plugins);

pluginManager.start();

// const randomThing = () => {
//     axios.defaults.baseURL = 'https://127.0.0.1:54632';
//     axios.put(
//         'lol-lobby/v1/parties/queue',
//         JSON.stringify(700),
//         {
//             headers: {
//                 Authorization: 'Basic cmlvdDp5ODFZMk9xbmdQeTlMUjQ4SFU1d1ln',
//                 'Content-Type': 'application/json',
//             }
//         }
//     );
// };
// randomThing();
