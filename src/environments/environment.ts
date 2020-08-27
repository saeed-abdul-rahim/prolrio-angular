// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  name: 'PROLR',
  url: 'http://localhost:4200',
  localStorageKey: 'oTM680-1SL5f2ecf06iDyLSMT6iDYm62d7bc',
  stripeKey: 'pk_live_51HBzfQDqIzvTueD2MYXtv0ndPAvALyjuIRm1hkgVNxzurPWO0zFGXCI6CxArX5GkWyRTwyquEiHE3RQ4c8oqkgDe00twcZy4kW',
  api: {
    url: 'https://asia-east2-prolrio.cloudfunctions.net/api/v1',
    _user: '/user',
    _group: '/group',
    _request: '/request',
    _section: '/section',
    _subject: '/subject',
    _entity: '/entity',
    _payment: '/payment',
    _subscription: '/subscription'
  },
  db: {
    version: 'v1',
    name: 'db',
    users: 'users',
    groups: 'groups',
    sections: 'sections',
    subjects: 'subjects',
    entities: 'entities',
    tiers: 'tiers',
    metadata: 'metadata',
    support: 'support',
    analytics: 'analytics',
    userAnalytics: 'userAnalytics'
  },
  firebase: {
    apiKey: 'AIzaSyCOfIr-MjXFeAchIcoFT0gSM3tnq6ioRQo',
    authDomain: 'prolrio.firebaseapp.com',
    databaseURL: 'https://prolrio.firebaseio.com',
    projectId: 'prolrio',
    storageBucket: 'prolrio.appspot.com',
    messagingSenderId: '526633178149',
    appId: '1:526633178149:web:f737db9ae3d302553b1bcc',
    measurementId: 'G-ZBK226YHGG'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error';  // Included with Angular CLI.
