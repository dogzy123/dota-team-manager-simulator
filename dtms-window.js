// electron
const {BrowserWindow} = require('electron');
const {app} = require('electron');

let mainWindow;

app.on('ready', function () {
    mainWindow = new BrowserWindow({fullscreen : true, resizable : false, minWidth: 968});

    mainWindow.webContents.on('did-finish-load', ()=>{
        mainWindow.show();
        mainWindow.focus();
    });

    mainWindow.loadURL('file:///' + __dirname + "/index.html");

    //mainWindow.setMenu(null);
});
