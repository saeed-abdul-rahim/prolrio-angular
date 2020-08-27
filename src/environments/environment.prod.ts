export const environment = {
  production: true,
  name: 'PROLR',
  url: 'https://prolr.io',
  localStorageKey: 'oTM680-1SL5f2ecf06iDyLSMT6iDYm62d7bc',
  stripeKey: 'pk_live_51HBzfQDqIzvTueD2MYXtv0ndPAvALyjuIRm1hkgVNxzurPWO0zFGXCI6CxArX5GkWyRTwyquEiHE3RQ4c8oqkgDe00twcZy4kW',
  api: {
    url: 'https://asia-east2-prolrio-dev.cloudfunctions.net/api/v1',
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
    apiKey: 'AIzaSyD6qOoV616bJkRayaXoTAWC6GPjUo71Q5o',
    authDomain: 'prolrio-dev.firebaseapp.com',
    databaseURL: 'https://prolrio-dev.firebaseio.com',
    projectId: 'prolrio-dev',
    storageBucket: 'prolrio-dev.appspot.com',
    messagingSenderId: '133992017229',
    appId: '1:133992017229:web:2daa193841b7475a5e9b04',
    measurementId: 'G-B6D5K5L98B'
  }
};
