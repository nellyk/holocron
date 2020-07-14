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

export const HOLOCRON_STORE_KEY = 'holocron';
export const MODULES_STORE_KEY = 'modules';
export const REDUCER_KEY = '@@holocron-module-reducer';
export const LOAD_KEY = '@@holocron-module-load-action';
export const REGISTER_MODULE_REDUCER = '@@holocron/REGISTER_MODULE_REDUCER';
export const MODULE_LOADED = '@@holocron/MODULE_LOADED';
export const MODULE_LOAD_FAILED = '@@holocron/MODULE_LOAD_FAILED';
export const MODULE_LOADING = '@@holocron/MODULE_LOADING';
export const MODULE_REDUCER_ADDED = '@@holocron/MODULE_REDUCER_ADDED';
export const INIT_MODULE_STATE = '@@holocron/INIT_MODULE_STATE';

export const REGISTRY_KEY = 'registry';
export const REGISTRY_PREFIX = `@@${REGISTRY_KEY}`;
export const REGISTRY_MODULES_KEY = 'modules';
export const REGISTRY_MODULE_BLOCKED_KEY = 'blockedModules';
export const REGISTRY_MODULE_MAP_KEY = 'moduleMap';
export const REGISTER_MODULE = `${REGISTRY_PREFIX}/REGISTER_MODULE`;
export const BLOCK_MODULE = `${REGISTRY_PREFIX}/BLOCK_MODULE`;
export const SET_MODULE_MAP = `${REGISTRY_PREFIX}/SET_MODULE_MAP`;
export const RESET_MODULES_AND_MAP = `${REGISTRY_PREFIX}/RESET_MODULES_AND_MAP`;
