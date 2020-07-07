/*
 * Copyright 2019 American Express Travel Related Services Company, Inc.
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
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { combineReducers as immutableCombineReducers } from 'redux-immutable';
import { Provider, useSelector } from 'react-redux';
import { fromJS } from 'immutable';
import { registerModule, getModule } from '../../src/moduleRegistry';

import { render } from '../__util__/renderer';

import { REDUCER_KEY, LOAD_KEY, MODULES_STORE_KEY } from '../../src/ducks/constants';

import createHolocronModule from '../../src/createHolocronModule';

// const sleep = (ms) => new Promise((resolve) => {
//   setTimeout(resolve, ms);
// });

// const warn = jest.spyOn(console, 'warn');
// const error = jest.spyOn(console, 'error');

describe(createHolocronModule.name, () => {
  const moduleName = 'my-module';

  describe('defaults', () => {
    const initialState = fromJS({
      modules: { [moduleName]: { foo: 'bar' } },
      holocron: {
        withReducers: [moduleName],
        loaded: [moduleName],
        failed: {},
        loading: {},
      },
    });

    test('creates holocron module and renders', () => {
      const Module = createHolocronModule(({ moduleLoadStatus, moduleState, dispatch }) => {
        expect(dispatch).toEqual(expect.any(Function));
        expect(moduleLoadStatus).toEqual(expect.any(String));
        expect(moduleState).toBeDefined();
        return <p>Hello!</p>;
      }, { name: moduleName });

      const result = render(<Module />);
      expect(result.toTree()).toMatchSnapshot();
      expect(result.toJSON()).toMatchSnapshot();
    });

    test('registers module', () => {
      const TestModule = ({ moduleLoadStatus }) => {
        const state = useSelector((_state) => _state.getIn([MODULES_STORE_KEY, moduleName]));
        // console.log(moduleLoadStatus, state.toJS());
        return <p>Hello!</p>;
      };

      TestModule[REDUCER_KEY] = (state) => state;

      registerModule(moduleName, TestModule);

      const Module = getModule(moduleName);

      const result = render(<Module />, { initialState });
      expect(result.toTree()).toMatchSnapshot();
      expect(result.toJSON()).toMatchSnapshot();
    });
  });

  describe('browser', () => {
    beforeAll(() => {
      global.BROWSER = true;
    });

    test('registers module', () => {
      const initialState = fromJS({
        modules: { [moduleName]: { foo: 'bar' } },
        holocron: {
          withReducers: [moduleName],
          loaded: [moduleName],
          failed: {},
          loading: {},
        },
      });

      const TestModule = ({ moduleLoadStatus }) => {
        const state = useSelector((_state) => _state.getIn([MODULES_STORE_KEY, moduleName]));
        // console.log(moduleLoadStatus, state.toJS());
        return <p>Hello!</p>;
      };

      TestModule[REDUCER_KEY] = (state) => state;

      registerModule(moduleName, TestModule);

      const Module = getModule(moduleName);

      const result = render(<Module />, { initialState });
      expect(result.toTree()).toMatchSnapshot();
      expect(result.toJSON()).toMatchSnapshot();
    });
  });
});
