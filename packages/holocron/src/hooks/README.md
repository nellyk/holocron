### Patterns

When building a Holocron module at a low level, each is comprised of `react` hooks.
Separation of logic
using the Module component as key when working with low level hook blocks and internal component usage relies on moduleName

## Quick Start

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Holocron, HolocronModule } from 'holocron';

const App = () => (
  <>
  <Holocron
    plugins={[connect()]}
  >
    <Suspense>
      <HolocronModule/>
    </Suspense>
  </Holocron>

  <Holocron>
    <Suspense>
      <HolocronModule
        lazy={true}
        moduleName="demo"
        moduleMetaData={{
          node: {
            url: 'https://example.com/cdn/my-module/1.0.0/my-module.node.js',
            integrity: '123',
          },
          module: {
            url: 'https://example.com/cdn/my-module/1.0.0/my-module.module.js',
            integrity: 'abc',
          },
          browser: {
            url: 'https://example.com/cdn/my-module/1.0.0/my-module.browser.js',
            integrity: '234',
          },
          legacyBrowser: {
            url: 'https://example.com/cdn/my-module/1.0.0/my-module.legacy.browser.js',
            integrity: '344',
          },
        }}
      >
        {function Module({
          holocronLoadStatus, moduleLoadState, moduleState, moduleData, loadModule, loadModuleData,
        }) {
          let data;
          React.useEffect(async () => {
            const Module = await loadModule('browser');
            data = await loadModuleData(Module);
          }, []);

          React.useLayoutEffect(async () => {
            console.log(holocronLoadStatus, moduleLoadState, moduleState, moduleData, loadModule, loadModuleData);
          });

          return null;
        }}
      </HolocronModule>
    </Suspense>
  </Holocron>
  </>
);

ReactDOM.render(<App />, document.body);
```