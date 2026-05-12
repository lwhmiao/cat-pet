# 小狸桌面宠物

这个仓库保存了小狸桌面宠物的运行版和素材生成工作目录。

## 目录说明

- `xiao-li-desktop-pet/`：可以运行的 Electron 桌面宠物项目
- `hatch-pet-xiaoli/`：生成小狸动作素材时留下的工作目录，包含参考图、单帧图、图集、预览视频和生成记录

## 运行桌面宠物

进入运行版目录：

```powershell
cd xiao-li-desktop-pet
npm install
npm start
```

第一次运行前需要先安装 Node.js LTS：

https://nodejs.org/

安装依赖后，也可以双击 `xiao-li-desktop-pet/启动小狸.bat` 启动。

## 迁移到其他电脑

下载或 clone 这个仓库后，在新电脑运行：

```powershell
cd xiao-li-desktop-pet
npm install
npm start
```

`node_modules` 不上传到 GitHub，换电脑后重新执行 `npm install` 即可。
