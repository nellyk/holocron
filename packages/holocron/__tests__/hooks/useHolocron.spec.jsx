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

import React, { Suspense } from 'react';
import { fromJS } from 'immutable';

import { render } from '../__util__/renderer';
import useHolocron, { Holocron, HolocronContext } from '../../src/hooks/useHolocron';
import { HolocronModule } from '../../src/hooks/useHolocronModule';

describe('useHolocron', () => {
  test('passes store ', () => {
    function TestComponent() {
      const { store, registry, plugins } = React.useContext(HolocronContext);

      return (
        <React.Fragment>
          <p>{JSON.stringify(store.getState())}</p>
          <p>{JSON.stringify(registry)}</p>
          <p>{JSON.stringify(plugins)}</p>
        </React.Fragment>
      );
    }

    const result = render(
      <Holocron>
        <TestComponent />
      </Holocron>
    );

    expect(result.asFragment()).toMatchSnapshot();
  });

  test('gets holocron context from returned component', () => {
    function TestComponent() {
      // eslint-disable-next-line no-underscore-dangle
      const Holocron_ = useHolocron();
      const { store, registry, plugins } = Holocron_.getContext();

      return (
        <React.Fragment>
          <p>{JSON.stringify(store)}</p>
          <p>{JSON.stringify(registry)}</p>
          <p>{JSON.stringify(plugins)}</p>
        </React.Fragment>
      );
    }

    const result = render(
      <Holocron>
        <TestComponent />
      </Holocron>
    );

    expect(result.asFragment()).toMatchSnapshot();
  });

  test('holocron render', () => {
    const moduleName = 'test-demo';

    const TestComponent = (props) => (
      <React.Fragment>
        <p>{JSON.stringify(props)}</p>
      </React.Fragment>
    );

    const App = () => (
      <Holocron
        modules={fromJS({ [moduleName]: TestComponent })}
        holocronModuleMap={fromJS({
          modules: {
            [moduleName]: {
              node: {
                url: 'https://example.com/cdn/my-module/1.0.0/my-module.node.js',
                integrity: '123',
              },
              browser: {
                url: 'https://example.com/cdn/my-module/1.0.0/my-module.browser.js',
                integrity: '234',
              },
              legacyBrowser: {
                url: 'https://example.com/cdn/my-module/1.0.0/my-module.legacy.browser.js',
                integrity: '344',
              },
            },
          },
        })}
      >
        <HolocronModule moduleName={moduleName} />
      </Holocron>
    );

    const result = render(<App />);
    expect(result.asFragment()).toMatchSnapshot();
  });
});
