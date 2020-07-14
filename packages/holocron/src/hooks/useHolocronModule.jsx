/*
 * Copyright 2020 American Express Travel Related Services Company, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,either express
 * or implied. See the License for the specific language governing permissions and limitations
 * under the License.
 */

/* eslint-disable react/destructuring-assignment */

import React from 'react';
import PropTypes from 'prop-types';

import { useHolocronContext } from './useHolocron';
import useHolocronState from './useHolocronState';
import useModuleState from './useModuleState';
import useModuleLoader from './useModuleLoader';

import {
  validateModule,
  memoizeHolocronModule,
  getModuleDisplayName,
  getModuleName,
  getName,
} from '../utility';

export const HolocronModuleContext = React.createContext({});

export function createHolocronModule(Component, holocronConfig) {
  if (!Component) return () => null;

  const Module = validateModule(Component, holocronConfig);
  Module.displayName = getModuleDisplayName(getModuleName(Module));
  const moduleName = getName(Module);
  // eslint-disable-next-line no-underscore-dangle, camelcase
  function __Holocron_Module__(props) {
    const { registry, plugins } = useHolocronContext();

    const [, holocronState, loadModule] = useHolocronState(moduleName);
    const [moduleState, moduleProps] = useModuleState(Module, props);
    const [moduleData, moduleLoadStatus, loadModuleData] = useModuleLoader(Module, moduleProps);

    const context = {
      moduleConfig: Module.holocron,
      moduleLoadStatus,
      moduleName,
      moduleData,
      moduleMetaData: registry.getModuleMetaData(),
      moduleState,
      holocronState,
      loadModuleData,
      loadModule,
    };

    return (
      <HolocronModuleContext.Provider value={context}>
        {plugins.renderModulePlugins((
          <Module
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...moduleProps}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...context}
          />
        ), context)}
      </HolocronModuleContext.Provider>
    );
  }
  __Holocron_Module__.propTypes = {
    lazy: PropTypes.bool,
    load: PropTypes.func,
    loadModuleData: PropTypes.func,
    reducer: PropTypes.func,
    initialState: PropTypes.shape({}),
  };
  __Holocron_Module__.defaultProps = {
    lazy: false,
    load: undefined,
    loadModuleData: undefined,
    reducer: undefined,
    initialState: undefined,
  };

  return memoizeHolocronModule(Module, __Holocron_Module__);
}

export function useHolocronModuleContext() {
  return React.useContext(HolocronModuleContext);
}

export default function useHolocronModule(moduleName) {
  const [Module] = useHolocronState(moduleName);
  return React.useMemo(() => createHolocronModule(Module), [Module]);
}

export function HolocronModule({ children, moduleName, ...props }) {
  // eslint-disable-next-line no-underscore-dangle, camelcase
  const __Holocron_Module__ = useHolocronModule(moduleName);
  return (
    // eslint-disable-next-line react/jsx-pascal-case, react/jsx-props-no-spreading
    <__Holocron_Module__ {...props}>
      {children}
    </__Holocron_Module__>
  );
}
HolocronModule.propTypes = {
  children: PropTypes.node,
  moduleName: PropTypes.string,
};
HolocronModule.defaultProps = {
  children: null,
  moduleName: 'module',
};
