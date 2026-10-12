const { app, BrowserWindow } = require('electron');
const path = require('node:path');
function createWindow(){const win=new BrowserWindow({width:1420,height:920,minWidth:940,minHeight:660,backgroundColor:'#f5f7fb',title:'MySchool · Administrator',webPreferences:{contextIsolation:true,nodeIntegration:false,sandbox:true}});const dev=process.env.VITE_DEV_SERVER_URL;if(dev)win.loadURL(dev);else win.loadFile(path.join(__dirname,'..','dist','index.html'));}
app.whenReady().then(()=>{createWindow();app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();});});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
