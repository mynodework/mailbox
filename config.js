var config = {
    couchDbServer: process.env.COUCHDB_SERVER || 'localhost',
    couchDbPort: process.env.COUCHDB_PORT || '5984',
    couchDbUseSsl: process.env.COUCHDB_USESSL || false,
    couchAdminUser: process.env.COUCHDB_ADMIN_USER || 'admin',
    couchAdminPassword: process.env.COUCHDB_ADMIN_PASSWORD || 'java1234',
    sessionSecret: process.env.SESSION_SECRET || 'thisismysecret',
    awsAccessKeyId: process.env.AWS_ACCESS_KEY || '',
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    email: {
      from: process.env.EMAIL_FROM,
      transport: JSON.parse(process.env.EMAIL_TRANSPORT || '{}')
    }
  };
  
  config.couchCredentials = function () {
    if (config.couchAdminUser && config.couchAdminPassword) {
      return config.couchAdminUser + ':' + config.couchAdminPassword + '@';
    } else {
      return '';
    }
  };
  
  config.getProtocol = function (isSSL) {
    return 'http' + (isSSL ? 's' : '') + '://';
  };
  
  if (process.env.SERVER_URL) {
    config.serverURL = process.env.SERVER_URL;
  } else {
    config.serverURL = config.getProtocol(config.useSSL) + config.server;
    if (config.serverPort) {
      config.serverURL += ':' + config.serverPort;
    }
  }
  
  config.couchDbURL = config.getProtocol(config.couchDbUseSsl) + config.couchDbServer + ':' + config.couchDbPort;
  config.couchAuthDbURL = config.getProtocol(config.couchDbUseSsl) + config.couchCredentials() + config.couchDbServer + ':' + config.couchDbPort;
  module.exports = config;
  