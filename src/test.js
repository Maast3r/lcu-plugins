import LcuPluginManager from 'lcu-plugin-manager';

import AutoAcceptQueuePlugin from './plugins/autoAcceptQueuePlugin.js';
import RandomChampSelectorPlugin from './plugins/randomChampSelectorPlugin.js';

const plugins = [
    new AutoAcceptQueuePlugin(),
    new RandomChampSelectorPlugin(),
];

const pluginManager = new LcuPluginManager(plugins);

pluginManager.start();
