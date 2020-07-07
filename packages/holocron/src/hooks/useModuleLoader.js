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

import { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import {
  getLoader,
  isBrowser,
  getGlobalInitialState,
} from '../utility';

export default function useModuleLoader(Module, props) {
  const dispatch = useDispatch();

  const [status, setStatus] = useState('initial');

  const load = useCallback((providedProps = props) => {
    setStatus('loading');
    const loader = getLoader(Module, providedProps);
    return Promise.resolve(dispatch(loader(providedProps)))
      .then((data) => {
        setStatus('loaded');
        return data;
      })
      .catch((error) => {
        setStatus('error');
        return error;
      });
  }, [Module, props]);

  // should only run once (componentDidMount)
  useEffect(() => {
    // eslint-disable-next-line no-underscore-dangle
    if (isBrowser() && !getGlobalInitialState()) load();
    else setStatus('loaded');
  }, []);

  // runs with props update (componentWillReceiveProps)
  useEffect(() => {
    if (isBrowser() && ['loading', 'initial'].includes(status) === false) load();
  }, [props, status, load]);

  return [status, load];
}
