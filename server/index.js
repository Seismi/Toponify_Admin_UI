const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const ParseDashboard = require('parse-dashboard');

const databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;
const baseUrl = process.env.BASE_URL || 'http://localhost:8200';

if (!databaseUri) {
    console.log('DATABASE_URI not specified, falling back to localhost.');
}

let MDDiagramUIConfig = {
    databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
    appId: 'appId',
    masterKey: 'masterKey',
    serverURL: baseUrl + '/parse',
    appName: 'md-diagram-ui',
    "supportedPushLocales": ["en"]
};

let api = new ParseServer(MDDiagramUIConfig);

let dashboard = new ParseDashboard({
    "allowInsecureHTTP": true,
    "apps": [ MDDiagramUIConfig ]
}, {allowInsecureHTTP: true});

let app = express();
let mountPath = process.env.PARSE_MOUNT || '/parse';

app.use(mountPath, api);
app.use('/dashboard', dashboard);

let port = process.env.PORT || 8200;
let httpServer = require('http').createServer(app);
httpServer.listen(port, () => console.log('Parse dashboard running on ' + baseUrl + '/dashboard'));

ParseServer.createLiveQueryServer(httpServer);
