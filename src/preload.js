// preload.js
console.log("---- 加载preloadjs ----");

const { contextBridge, ipcRenderer } = require('electron')
const fs = require('fs');
const compressing = require('compressing');

// loading
function domReady(condition = ['complete', 'interactive']) {
    return new Promise((resolve) => {
        if (condition.includes(document.readyState)) {
            resolve(true)
        } else {
            document.addEventListener('readystatechange', () => {
                if (condition.includes(document.readyState)) {
                    resolve(true)
                }
            })
        }
    })
}

const safeDOM = {
    append(parent, child) {
        if(parent && parent.children){
            if (!Array.from(parent.children).find(e => e === child)) {
                return parent.appendChild(child)
            }
        }
    },
    remove(parent, child) {
        if(parent && parent.children){
            if (Array.from(parent.children).find(e => e === child)) {
                return parent.removeChild(child)
            }
        }
    },
}

function useLoading() {
    const className = `loaders-css__square-spin`
    const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `
    const oStyle = document.createElement('style')
    const oDiv = document.createElement('div')

    oStyle.id = 'app-loading-style'
    oStyle.innerHTML = styleContent
    oDiv.className = 'app-loading-wrap'
    oDiv.innerHTML = `<div class="${className}"><div></div></div>`

    return {
        appendLoading() {
            safeDOM.append(document.head, oStyle)
            safeDOM.append(document.body, oDiv)
        },
        removeLoading() {
            safeDOM.remove(document.head, oStyle)
            safeDOM.remove(document.body, oDiv)
        },
    }
}

const { appendLoading, removeLoading } = useLoading()
domReady().then(appendLoading)

window.onmessage = (ev) => {
    ev.data.payload === 'removeLoading' && removeLoading()
}

setTimeout(removeLoading, 4999)


// 通信
contextBridge.exposeInMainWorld('ipc', {
    send: (cmd) => ipcRenderer.send('send', cmd), // 向主进程发送通信
    on: (...arg) => ipcRenderer.on(...arg), // 接收主进程通信消息

    // 读取文件
    readFile: (params, callback)=>{
        fs.readFile(params, 'utf8',(err, data) => {
            if(callback){
                callback(err, data)
            }
        });
    },

    // 生成文件
    writeFile: (params, content, callback)=>{
        fs.writeFile(params, content, (err) => {
            if(callback){
                callback(err)
            }
        });
    },

    // 删除文件
    unlink: (params, callback)=>{
        fs.unlink(params, (err) => {
            if(callback){
                callback(err)
            }
        });
    },

    // 获取文件列表
    readdirSync: (targetDir)=>{
        return fs.readdirSync(targetDir)
    },

    // 判断文件夹是否存在
    existsSync: (filePath)=>{
        if(!fs.existsSync(filePath.dataBook)){
            fs.mkdirSync(filePath.root);
            fs.mkdirSync(filePath.dataBook);
        }

        if(!fs.existsSync(filePath.dataBookBak)){
            fs.mkdirSync(filePath.dataBookBak);
        }
    },

    // 压缩
    compressDir: (dir, name, callback)=>{
        return compressing.zip.compressDir(dir, name).then(()=>{
            if(callback){
                callback()
            }
        })
    },

    // todo 打包之后获取不到 preload.js，解决一下？参考文档：https://www.jianshu.com/p/43e8a2f04422
    dirname: ()=> {
        return `${__dirname}`
    }
})

// window.ipc.send("测试UI");
// window.ipc.readFile(()=>{});

// 给添加了 SSO 的页面注入 localstorage，方便直接
localStorage.setItem("runtime", "browser")

// 解压文件
// asar extract ./app.asar ./file


/**** preload.js 中接收主进程的消息
ipcRenderer.on('ipc-reply', (event, arg) => {
    console.log('preload.js ipc-reply === ', arg);
});
 ****/

/**** 要使用 windows 全局变量 需要将 webPreferences contextIsolation 设置为 false
window.komuFun = {
    a: 456,
    testFun
}
 ****/
