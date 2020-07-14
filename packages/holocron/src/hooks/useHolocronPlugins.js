import { cloneElement, useMemo, useState } from 'react';

// Streamline a mass upgrade with Holocron plugins.
// A plugin is React component that returns its children (or shut off a branch)
// We can asynchronously load data and prop it to our holocron module.
// HoCs work real well with plugins, they can be used as decorators.

// security helmet
// analytics add on
// intl add on
// profiling
// error boundaries
// lib integrations - one service worker
// enhancers wrap the base of the root, while plugins are registered by moduleName
export default function useHolocronPlugins(initialPlugins = []) {
  const [plugins, setPlugins] = useState(() => new Set([].concat(initialPlugins)));

  return useMemo(() => ({
    store: plugins,
    getEnhancers: () => [...plugins].filter((plug) => !!plug.enhancer),
    getModulePlugins: (moduleName) => [...plugins].filter((plug) => plug.moduleName === moduleName),
    addPlugin: ({
      moduleName, plugin, enhancer,
    }) => {
      setPlugins(new Set([...plugins, {
        moduleName, plugin, enhancer,
      }]));
    },
    removePlugin: () => null,
    renderPlugins: ({ children, plugins: plugs }) => cloneElement(children, { plugins: plugs }),
    renderModulePlugins: (children) => children,
    renderEnhancers: (children) => children,
  }), [plugins]);
}
