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

import useModuleLoader from '../../src/hooks/useModuleLoader';
import { HolocronWrapper } from '../__util__/renderer';

describe(useModuleLoader.name, () => {
  it('should render without arguments', () => {
    const { result } = renderHook(
      () => useModuleLoader(),
      { wrapper: HolocronWrapper }
    );
    expect(result.current).toEqual([null, 'loaded', expect.any(Function)]);
  });

  it('should render', () => {
    const Module = () => null;
    Module.holocron = { name: 'test-module' };
    const { result } = renderHook(
      () => useModuleLoader(Module, {}),
      { wrapper: HolocronWrapper }
    );
    expect(result.current).toEqual([null, 'loaded', expect.any(Function)]);
  });
});
