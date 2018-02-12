// electron
const electron  = require('electron');
const app       = electron.app;
const path      = require('path');
const url       = require('url');
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

app.on('ready', function () {
    mainWindow = new BrowserWindow({fullscreen : true, resizable : false});

    mainWindow.loadURL('file:///' + __dirname + "/index.html");
});
