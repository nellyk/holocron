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

import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

import {
  REDUCER_KEY,
  LOAD_KEY,
} from './ducks/constants';

export function isBrowser() {
  return !!global.BROWSER;
}

export function getGlobalInitialState() {
  // eslint-disable-next-line no-underscore-dangle
  return global.__INITIAL_STATE__;
}

export const getName = (Module) => Module.holocron.name;
export const getReducer = (Module) => Module.holocron.reducer
  || Module[REDUCER_KEY];
export const getMergeProps = (Module, props = {}) => props.mergeProps
  || Module.holocron.mergeProps;
export const getLoad = (Module, props = {}) => props.load
  || Module.holocron.load || Module[LOAD_KEY];
export const getLoadModuleData = (Module, props = {}) => props.loadModuleData
  || Module.holocron.loadModuleData || Module.loadModuleData;
export const getShouldModuleReload = (Module) => (
  Module.holocron.shouldModuleReload
    ? (prevProps, nextProps) => !Module.holocron.shouldModuleReload(prevProps, nextProps)
    : undefined);

export function getModuleDisplayName(name) {
  return `HolocronModule(${name})`;
}

export function getModuleName(Module, fallbackName) {
  return Module ? Module.displayName || Module.name : fallbackName;
}

export const createLoad = (load) => (props, dispatch) => dispatch(load(props));
export const createLoadModuleData = (
  loadModuleData,
  Module
) => (props, dispatch, { getState, fetchClient } = {}) => loadModuleData({
  store: { dispatch, getState },
  fetchClient,
  ownProps: props,
  module: Module,
});
export const getLoader = (Module, props) => {
  let loader = () => undefined;
  if (getLoad(Module, props)) {
    console.warn(`The Holocron Config in '${Module.displayName}' is using the 'load' function which has been deprecated. Please use 'loadModuleData' instead.`);
    // TODO: deprecation (load) - remove in next major version
    loader = createLoad(getLoad(Module, props));
  }
  if (getLoadModuleData(Module, props)) {
    loader = createLoadModuleData(getLoadModuleData(Module, props), Module);
  }
  return (...args) => Promise.resolve(loader(...args)).catch((error) => {
    console.error(`Error while attempting to call 'load' or 'loadModuleData' inside Holocron module ${Module.holocron.name}.`, error);
  });
};

// eslint-disable-next-line complexity
export function validateModule(Module, withConfig) {
  const config = {
    name: 'module',
    ...withConfig || {},
    ...Module.holocron || {},
  };

  if (Module[REDUCER_KEY] && !config.reducer) {
    config.reducer = Module[REDUCER_KEY];
  }

  if (config.reducer && !Module[REDUCER_KEY]) {
    // eslint-disable-next-line no-param-reassign
    Module[REDUCER_KEY] = config.reducer;
  }

  if (!config.options) config.options = { ssr: false };
  if (config.load && !Module[LOAD_KEY] && config.options.ssr) {
    // eslint-disable-next-line no-param-reassign
    Module[LOAD_KEY] = config.load;
  }

  if (Module.loadModuleData && !config.loadModuleData) {
    config.loadModuleData = Module.loadModuleData;
  }

  // eslint-disable-next-line no-param-reassign
  Module.holocron = {
    ...config,
  };

  return Module;
}

export function memoizeHolocronModule(Module, HolocronWrapper) {
  const ValidHolocronModule = validateModule(Module);
  const MemoizedHolocronModule = React.memo(
    hoistNonReactStatics(HolocronWrapper, ValidHolocronModule),
    getShouldModuleReload(ValidHolocronModule)
  );
  MemoizedHolocronModule.displayName = Module.displayName;
  return hoistNonReactStatics(MemoizedHolocronModule, HolocronWrapper);
}
