import AutoAcceptQueuePlugin, {
    label as AutoAcceptQueuePluginLabel,
} from './plugins/autoAcceptQueuePlugin.js';

import RandomChampSelectorPlugin, {
    label as RandomChampSelectorPluginLabel,
} from './plugins/randomChampSelectorPlugin.js';

export default [
    {
        label: AutoAcceptQueuePluginLabel,
        plugin: AutoAcceptQueuePlugin,
    },
    {
        label: RandomChampSelectorPluginLabel,
        plugin: RandomChampSelectorPlugin,
    }
];
