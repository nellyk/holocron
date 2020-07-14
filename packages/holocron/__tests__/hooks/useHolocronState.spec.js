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
import { renderHook } from '@testing-library/react-hooks';

import { fromJS } from 'immutable';
import useHolocronState from '../../src/hooks/useHolocronState';
import { HolocronWrapper } from '../__util__/renderer';

describe(useHolocronState.name, () => {
  it('should render without arguments', () => {
    const { result } = renderHook(
      () => useHolocronState(),
      { wrapper: HolocronWrapper }
    );
    const [, moduleData, loadModule] = result.current;
    expect(moduleData).toEqual({
      isHolocronError: false,
      isHolocronLoaded: false,
      isHolocronLoading: false,
      isModuleBlocked: false,
      isModuleRegistered: false,
      isReducerLoaded: false,
    });
    expect(loadModule).toBeInstanceOf(Function);
  });

  test('should load an existing holocron module in the registry', () => {
    const moduleName = 'test-module';
    const { result } = renderHook(
      () => useHolocronState(moduleName),
      {
        wrapper: ({ children }) => HolocronWrapper({
          children,
          modules: fromJS({ [moduleName]: () => null }),
        }),
      }
    );
    const [Module, moduleData, loadModule] = result.current;
    expect(Module).toBeInstanceOf(Function);
    expect(moduleData).toEqual({
      isHolocronError: false,
      isHolocronLoaded: false,
      isHolocronLoading: false,
      isModuleBlocked: false,
      isModuleRegistered: true,
      isReducerLoaded: false,
    });
    expect(loadModule).toBeInstanceOf(Function);
  });
});
