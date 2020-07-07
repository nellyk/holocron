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
import PropTypes from 'prop-types';

import useHolocronLoader from './useHolocronLoader';
import useHolocronState from './useHolocronState';
import useModuleState from './useModuleState';
import useModuleLoader from './useModuleLoader';
import useModuleProps from './useModuleProps';

import { memoizeHolocronModule } from '../utility';

export const HolocronModuleContext = React.createContext({});

export function useHolocronModuleContext() {
  return React.useContext(HolocronModuleContext);
}

export default function useHolocronModule(module, modules) {
  const [Module, holocronConfig, holocronLoadStatus] = useHolocronLoader(module, modules);
  return React.useMemo(() => {
    if (!Module) return () => null;

    function HolocronModule(props) {
      const holocronState = useHolocronState(Module);
      const moduleState = useModuleState(Module, props);
      const moduleProps = useModuleProps(Module, props, moduleState);
      const [moduleLoadStatus, loadModule] = useModuleLoader(Module, moduleProps);

      return (
        <HolocronModuleContext.Provider
          value={{
            holocronConfig,
            holocronLoadStatus,
            holocronState,
            moduleLoadStatus,
            moduleState,
            loadModule,
          }}
        >
          <Module
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
            moduleState={moduleState}
            moduleLoadStatus={moduleLoadStatus}
          />
        </HolocronModuleContext.Provider>
      );
    }

    HolocronModule.propTypes = {
      load: PropTypes.func,
      loadModuleData: PropTypes.func,
      reducer: PropTypes.func,
      initialState: PropTypes.shape({}),
    };
    HolocronModule.defaultProps = {
      load: undefined,
      loadModuleData: undefined,
      reducer: undefined,
      initialState: undefined,
    };

    return memoizeHolocronModule(Module, HolocronModule);
  }, [Module]);
}
