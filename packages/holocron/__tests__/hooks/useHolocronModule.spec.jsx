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

/* eslint-disable react/prop-types, import/no-extraneous-dependencies  */
import React from 'react';

import { fromJS, Set as iSet } from 'immutable';
import { resetModuleRegistry } from '../../src/moduleRegistry';

import { REDUCER_KEY, LOAD_KEY } from '../../src/ducks/constants';

import { render, act, waitFor } from '../__util__/renderer';
import { createHolocronModule } from '../../src/hooks/useHolocronModule';
import { Holocron } from '../../src/hooks/useHolocron';

// const warn = jest.spyOn(console, 'warn');
// const error = jest.spyOn(console, 'error');
describe(createHolocronModule.name, () => {
  const moduleName = 'my-module';
  const shouldModuleReload = jest.fn();
  const load = jest.fn(() => () => Promise.resolve({ type: 'asgfa' }));
  const initialState = fromJS({
    modules: { [moduleName]: { foo: 'bar' } },
    holocron: {
      withReducers: iSet([moduleName]),
      loaded: iSet([moduleName]),
      loading: {},
      failed: {},
    },
  });
  const reducer = jest.fn((state = fromJS({})) => state);
  const buildInitialState = jest.fn(() => fromJS({ foo: 'bar' }));
  reducer.buildInitialState = buildInitialState;

  const holocronConfig = {
    name: moduleName,
    reducer,
    load,
  };

  beforeEach(() => {
    resetModuleRegistry({}, {});
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    test('creates a holocron module without configuration and renders', () => {
      const NoModule = createHolocronModule();
      expect(NoModule()).toBe(null);

      const TestModule = ({ moduleLoadStatus, moduleState, moduleConfig }) => (
        <p>{JSON.stringify({ moduleLoadStatus, moduleState, moduleConfig })}</p>
      );
      const Module = createHolocronModule(TestModule);
      // expect(getModule('module')).toEqual(TestModule);
      expect(Module).toHaveProperty('displayName', 'HolocronModule(TestModule)');
      expect(Module).toHaveProperty('holocron', { name: 'module', options: { ssr: false } });
      expect(render(
        <Holocron>
          <Module />
        </Holocron>
      ).asFragment()).toMatchSnapshot();
    });

    test('creates a holocron module with configuration and renders', () => {
      const name = `${moduleName}2`;
      const config = {
        name,
        reducer,
        load,
        loadModuleData: load,
        shouldModuleReload,
        options: { ssr: true },
      };
      const TestModule = ({ moduleLoadStatus, moduleState }) => {
        expect(moduleLoadStatus).toEqual(expect.any(String));
        expect(moduleState).toBeDefined();
        return <p>Hi there</p>;
      };
      const Module = createHolocronModule(TestModule, config);

      expect(Module).toHaveProperty('displayName', 'HolocronModule(TestModule)');
      expect(Module).toHaveProperty('compare', expect.any(Function));
      expect(Module).toHaveProperty('holocron', config);
      expect(Module).toHaveProperty(REDUCER_KEY, reducer);
      expect(Module).toHaveProperty(LOAD_KEY, load);

      expect(render((
        <Holocron initialState={initialState}>
          <Module />
        </Holocron>
      )).asFragment()).toMatchSnapshot();
    });
  });

  describe('rendering', () => {
    test('renders a holocron module without configuration + default state', () => {
      const Module = createHolocronModule(
        ({ moduleLoadStatus, moduleState, moduleConfig }) => (
          <p>{JSON.stringify({ moduleLoadStatus, moduleState, moduleConfig })}</p>
        ));
      expect(render(
        <Holocron>
          <Module />
        </Holocron>
      ).asFragment()).toMatchSnapshot();
    });

    test('default state', () => {
      const Module = createHolocronModule(
        ({ moduleLoadStatus, moduleState, moduleConfig }) => (
          <p>{JSON.stringify({ moduleLoadStatus, moduleState, moduleConfig })}</p>
        ), { name: 'mod' });
      expect(render(() => (
        <Holocron>
          <Module />
        </Holocron>
      )).asFragment()).toMatchSnapshot();
    });

    test('renders a holocron module by passing in holocronConfig', async () => {
      const TestModule = ({ moduleLoadStatus, moduleState, moduleConfig }) => (
        <p>
          <span>name {moduleConfig.name}!</span>
          <span>status: {moduleLoadStatus}</span>
          <span>foo: {moduleState.foo}</span>
        </p>
      );
      const Module = createHolocronModule(TestModule, { ...holocronConfig });

      const result = render((
        <Holocron initialState={initialState}>
          <Module />
        </Holocron>
      ));
      await result.findByText(/foo: bar/);
      expect(result.asFragment()).toMatchSnapshot();
    });
  });

  describe('browser', () => {
    beforeAll(() => {
      global.BROWSER = true;
    });

    test('loads up module data', async () => {
      const TestModule = ({ moduleLoadStatus, moduleState, moduleConfig }) => (
        <p>
          <span>Bye {moduleConfig.name}!</span>
          <span>status: {moduleLoadStatus}</span>
          <span>state: {moduleState.foo}</span>
        </p>
      );
      TestModule.holocron = { ...holocronConfig };
      const Module = createHolocronModule(TestModule);

      let result;
      act(() => {
        result = render(() => (
          <Holocron>
            <Module />
          </Holocron>
        ));
      });

      expect(result.asFragment()).toMatchSnapshot();
      await waitFor(() => result.findByText(/status: loaded/));
      expect(load).toHaveBeenCalledTimes(1);
    });
  });
});
