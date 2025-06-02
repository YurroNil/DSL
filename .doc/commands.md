# (一) 环境搭建
1. 安装nodejs依赖库
npm install

2. 安装electron库
修改 package.json (详情请见`小抄.md`), 然后运行: 
npm install electron --save-dev

3. 启动命令
npm start


# (二) 生成可执行的二进制文件

1. 安装electron builder
修改 package.json (详情请见`小抄.md`), 然后运行: 
npm install electron-builder --save-dev

2. 生成
npm run build
