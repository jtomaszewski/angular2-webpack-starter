/*
 * Angular bootstraping
 */
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { decorateModuleRef } from './app/environment';
import { HotApp } from 'hot-app';

/*
 * App Module
 * our top level module that holds all of our components
 */
import { AppModule } from './app';

/*
 * Bootstrap our Angular app with a top level NgModule
 */
export function main(): Promise<any> {
  return platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .then(decorateModuleRef)
    .catch(err => console.error(err));
}

export const app = (<any>window).app = new HotApp({
  oldApp: (<any>window).app,
  getRootElement: function() { return document.body; },
  startFn: (app, onStart) => {
    main().then(moduleRef => {
      app.data.moduleRef = moduleRef;
      // TODO set the appState._state to the oldApp.data.state
      onStart();
    });
  },
  stopFn: (app, onStop) => {
    app.data.moduleRef.destroy();
    // TODO write the appState.state to app.data.state
    onStop();
  }
});

app.startOnDOMReady();

// Webpack hot reload support
if (module.hot) {
  module.hot.accept();

  module.hot.dispose(() => {
    app.stop();
  });
}
