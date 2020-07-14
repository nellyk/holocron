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

import {
  useMemo, useEffect, useState, useCallback,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';

import { HOLOCRON_STORE_KEY } from '../ducks/constants';
import { getInitialState, loadModule } from '../ducks/load';
import { validateModule } from '../utility';
import { useHolocronContext } from './useHolocron';

export default function useHolocronState(moduleName) {
  const holocron = useHolocronContext();
  const holocronStateSelector = useMemo(() => createSelector(
    (state) => state.getIn(
      [HOLOCRON_STORE_KEY],
      getInitialState()
    ),
    (holocronState) => ({
      isModuleRegistered: !!holocron.registry.getModule(moduleName),
      isModuleBlocked: !!holocron.registry.isModuleBlocked(moduleName),
      isReducerLoaded: holocronState.getIn(['withReducers', moduleName], false),
      isHolocronLoaded: holocronState.getIn(['loaded', moduleName], false),
      isHolocronLoading: holocronState.getIn(['loading', moduleName], false),
      isHolocronError: holocronState.getIn(['failed', moduleName], false),
    })
  ), [moduleName, holocron.registry]);
  const holocronModuleState = useSelector(holocronStateSelector);
  const { isModuleRegistered } = holocronModuleState;

  const dispatch = useDispatch();
  const [Module, setModule] = useState(() => holocron.registry.getModule(moduleName));

  const loadHolocronModule = useCallback(() => {
    if (Module) return Module;

    const promise = dispatch(loadModule(moduleName, holocron.registry))
      .then((LoadedModule) => {
        if (LoadedModule) {
          if (!isModuleRegistered) holocron.registry.registerModule(moduleName, LoadedModule);
          setModule(validateModule(LoadedModule));
        }
        return LoadedModule;
      });
    return promise;
  }, [moduleName, holocron.registry]);

  useEffect(() => {
    if (moduleName) loadHolocronModule();
  }, [moduleName]);

  return [Module, holocronModuleState, loadHolocronModule];
}
