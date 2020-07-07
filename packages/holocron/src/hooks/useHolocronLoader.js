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

import { useState, useMemo, useEffect } from 'react';
import { useDispatch, batch } from 'react-redux';

import { getModule } from '../moduleRegistry';
import { loadModule } from '../ducks/load';

export default function useHolocronLoader(moduleAny, modules) {
  const dispatch = useDispatch();

  let moduleName;

  const [status, setStatus] = useState('initial');
  const [LoadedModule, setLoadedModule] = useState(() => {
    if (Array.isArray(moduleAny)) {
      const [Module] = moduleAny;
      return [Module];
    }
    return typeof moduleAny === 'string' ? getModule(moduleAny, modules) : null;
  });
  const [Module, setModule] = useState(() => LoadedModule || null);
  const config = useMemo(() => (Module ? Module.holocron : {}), [Module]);

  useEffect(() => {
    if (!LoadedModule) {
      setStatus('loading');
      batch(() => {
        dispatch(loadModule(moduleName)).then(setLoadedModule).catch(() => setStatus('error'));
      });
    } else {
      setModule(LoadedModule);
      setStatus('loaded');
    }
  }, [LoadedModule]);

  return [Module, config, status];
}
