declare var require: any

export const environment = {
  production: true,
  SOCKET_ENDPOINT: 'https://tic-tac-toe-95772.herokuapp.com/',
  SOCKET_ENABLED: true,
  appVersion: require('../../package.json').version,
  backendVersion: require('../../backend/package.json').version,
};
