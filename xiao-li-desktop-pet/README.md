# 小狸桌面宠物

这是一个用 Electron 做的 Windows 桌面宠物。小狸会待在桌面上，慢慢发呆、走路、睡觉、吃饭，也可以被拖到别的位置。

## 功能

- 透明背景，常驻桌面最上层
- 会发呆、挥爪、跳跃、慢走、吃饭、睡觉
- 双击小狸会出现思考气泡
- 按住小狸可以拖动位置
- 右键小狸会显示 `退出` 按钮

## 本机启动

如果已经安装过依赖，可以直接双击：

```text
启动小狸.bat
```

也可以在项目目录里运行：

```powershell
npm start
```

## 第一次运行

新电脑第一次运行前，需要先安装 Node.js LTS：

https://nodejs.org/

然后在项目目录里打开 PowerShell，运行：

```powershell
npm install
npm start
```

之后就可以双击 `启动小狸.bat` 启动。

## 从 GitHub 下载后运行

GitHub 仓库里通常不要上传 `node_modules` 文件夹，所以下载或 clone 后需要重新安装依赖：

```powershell
git clone <你的仓库地址>
cd xiao-li-desktop-pet
npm install
npm start
```

如果是从 GitHub 下载 ZIP：

1. 解压 ZIP
2. 进入 `xiao-li-desktop-pet` 文件夹
3. 打开 PowerShell
4. 运行：

```powershell
npm install
npm start
```

## 迁移到其他电脑

把整个 `xiao-li-desktop-pet` 文件夹复制到另一台电脑即可。需要保留这些文件：

- `assets/`
- `index.html`
- `main.js`
- `preload.js`
- `renderer.js`
- `style.css`
- `package.json`
- `package-lock.json`
- `启动小狸.bat`

另一台电脑如果还没有安装依赖，先运行：

```powershell
npm install
```

然后运行：

```powershell
npm start
```

## 操作方式

- 鼠标移到小狸身上：挥爪
- 单击小狸：跳一下
- 双击小狸：显示思考气泡
- 按住拖动：移动位置
- 右键小狸：显示退出按钮
- 点击 `退出`：关闭小狸

## 常见问题

### 双击 `启动小狸.bat` 没反应

先确认已经安装 Node.js，然后在项目目录里运行：

```powershell
npm install
npm start
```

### 提示找不到 npm

说明 Node.js 没装好，或者安装后还没有重启 PowerShell。重新安装 Node.js LTS 后，再打开一个新的 PowerShell 窗口。

### 上传 GitHub 要传哪些文件

需要上传项目源码和素材，但不要上传 `node_modules`。推荐保留 `package-lock.json`，这样别的电脑安装依赖时版本更稳定。

### 想发给别人直接双击运行

可以进一步打包成 `.exe`。打包后别人不需要安装 Node.js，也不需要运行 `npm install`。
