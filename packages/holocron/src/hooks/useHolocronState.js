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

import { useMemo, useEffect } from 'react';
import { useSelector, useDispatch, batch } from 'react-redux';
import { createSelector } from 'reselect';

import {
  HOLOCRON_STORE_KEY,
  MODULE_REDUCER_ADDED,
} from '../ducks/constants';
import {
  getInitialState,
  registerModuleReducer,
  moduleLoaded,
} from '../ducks/load';

export default function useHolocronState(Module, props) {
  const holocronStateSelector = useMemo(() => createSelector(
    (state) => state.getIn(
      [HOLOCRON_STORE_KEY],
      getInitialState()
    )
  ), []);
  const holocronState = useSelector(holocronStateSelector);
  const moduleName = useMemo(() => (Module ? Module.holocron.name : props.name) || '', [Module, props]);
  const holocronModuleState = useMemo(() => ({
    isHolocronError: holocronState.getIn(['failed', moduleName], false),
    isHolocronLoading: holocronState.getIn(['loading', moduleName], false),
    isHolocronLoaded: holocronState.getIn(['loaded', moduleName], false),
    isReducerLoaded: holocronState.getIn(['withReducers', moduleName], false),
  }), [holocronState, moduleName]);

  const dispatch = useDispatch();
  useEffect(() => {
    if (Module) {
      const { reducer, name } = Module.holocron;
      const {
        isHolocronLoaded,
        isReducerLoaded,
      } = holocronState;
      // rebuild store with reducer if it exists and is not included already
      if (reducer && isReducerLoaded === false) {
        batch(() => {
          dispatch(registerModuleReducer(name));
          dispatch((_, __, { rebuildReducers }) => { rebuildReducers(); });
          dispatch({ type: MODULE_REDUCER_ADDED });
        });
      }

      if (isHolocronLoaded === false) {
        dispatch(moduleLoaded(name));
      }
    }
  }, [Module]);

  return holocronModuleState;
}
