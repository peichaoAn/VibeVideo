@echo off
setlocal enabledelayedexpansion

chcp 65001 >nul
title VibeVideo 桌面端编译

echo ============================================
echo   VibeVideo 桌面端编译脚本
echo ============================================
echo.

rem 切换到脚本所在目录（项目根目录）
cd /d "%~dp0"

rem 1. 检查 Node.js
where node >nul 2>nul
if errorlevel 1 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js 18 或更高版本。
    echo.
    pause
    exit /b 1
)
for /f "delims=" %%v in ('node -v') do set NODE_VER=%%v
echo [1/4] 检测到 Node.js 版本: !NODE_VER!

rem 2. 检查 npm
where npm >nul 2>nul
if errorlevel 1 (
    echo [错误] 未检测到 npm。
    echo.
    pause
    exit /b 1
)

rem 3. 检查 node_modules 是否存在，不存在则安装依赖
if not exist "node_modules" (
    echo [2/4] 首次构建，正在安装依赖（可能需要几分钟）...
    call npm install
    if errorlevel 1 (
        echo [错误] 依赖安装失败。
        echo.
        pause
        exit /b 1
    )
) else (
    echo [2/4] 依赖已存在，跳过安装。
)

echo [3/4] 开始编译前端并打包桌面端...
echo.

rem 使用国内镜像加速 electron-builder 二进制下载
set ELECTRON_BUILDER_BINARIES_MIRROR=https://npmmirror.com/mirrors/electron-builder-binaries/

call npm run electron:build:win
if errorlevel 1 (
    echo.
    echo [错误] 编译打包失败，请查看上方日志。
    echo.
    pause
    exit /b 1
)

echo.
echo [4/4] 编译完成！
echo.
echo 安装包输出目录: %~dp0dist-release
echo.
echo 产物说明:
echo   - dist-release\*.exe         安装程序（NSIS）
echo   - dist-release\win-unpacked\  免安装绿色版（解压即用）
echo.
pause
exit /b 0
