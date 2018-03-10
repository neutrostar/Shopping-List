const electron=require('electron');
const url=require('url');
const path=require('path');
const{app,BrowserWindow, Menu, ipcMain}=electron;
//SET ENV
process.env.NODE_ENV='production';
let mainWindow;
let addWindow;
app.on('ready',function(){
    mainWindow=new BrowserWindow({});
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'mainWindow.html'),
      protocol: 'file',
      slashes: true        
    }));
    //Quit App when closed
    mainWindow.on('closed',function(){
        app.quit();
    });
    //Build menu from tempelate
    const mainMenu=Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
});
//Create add window
function createAddWindow(){
    addWindow=new BrowserWindow({
        widht:300,
        height:200,
        title:'Add Shopping List Item'
    });
    addWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'addWindow.html'),
      protocol: 'file',
      slashes: true  
    }));
    //Garbage Collection
    addWindow.on('close',function(){
        addWindow=null;
    });
}
//Catch item:add
ipcMain.on('item:add',function(e,item){
    mainWindow.webContents.send('item:add',item);
    addWindow.close();
});
//Create menu template
const mainMenuTemplate=[
    {
        label:'File',
        submenu:[
            {
                label: 'Add Item',
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items',
                click(){
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label:'Quit',
                accelerator: process.platform=='darwin'?'Command+Q':'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];
//If mac, add empty object to menu
if(process.platform=='darwin'){
    mainMenuTemplate.unshift({});
}
//Add Dev tools if not in production
if(process.env.NODE_ENV!='production'){
    mainMenuTemplate.push({
        label:'Developer Tools',
        submenu:[{          

            label:'Toggle Dev Tools',
            accelerator: process.platform=='darwin'?'Command+I': 'Ctrl+I',
            click(item,focusedWindow){
                focusedWindow.toggleDevTools();
            }
        },{
            role: 'reload'
        }
        ]
    });
}