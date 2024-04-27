import AutoAcceptQueuePlugin, {
    label as AutoAcceptQueuePluginLabel,
} from './plugins/autoAcceptQueuePlugin.js';

import ChangeLobbyPlugin, {
    label as ChangeLobbyPluginLabel,
} from './plugins/changeLobbyPlugin.js';

import NeverDodgePlugin, {
    label as NeverDodgePluginLabel,
} from './plugins/neverDodgePlugin.js';

import RandomChampSelectorPlugin, {
    label as RandomChampSelectorPluginLabel,
} from './plugins/randomChampSelectorPlugin.js';

import ReadyUpPlugin, {
    label as ReadyUpPluginLabel,
} from './plugins/readyUpPlugin.js';

export default [
    {
        label: AutoAcceptQueuePluginLabel,
        plugin: AutoAcceptQueuePlugin,
    },
    {
        label: ChangeLobbyPluginLabel,
        plugin: ChangeLobbyPlugin,
    },
    {
        label: NeverDodgePluginLabel,
        plugin: NeverDodgePlugin,
    },
    {
        label: RandomChampSelectorPluginLabel,
        plugin: RandomChampSelectorPlugin,
    },
    {
        label: ReadyUpPluginLabel,
        plugin: ReadyUpPlugin,
    },
];
