# VibeVideo

AI 驱动的视频生成工作室。将你的想象力转化为惊艳的视频 —— 支持 Web、桌面端与移动端。

## 技术栈

- **框架**：React 18 + Next.js 15（App Router）
- **语言**：TypeScript
- **样式**：Tailwind CSS + shadcn/ui
- **桌面端**：Electron + electron-builder
- **移动端**：Capacitor（Android）
- **设计**：深色、现代、玻璃拟态 —— 欧美高端美学风格

## 快速开始

### 环境要求

- Node.js 18.18+（或 20+）
- npm

### 安装依赖

```bash
npm install
```

### 运行 Web 应用（开发模式）

```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000)。

### 构建静态站点（生产环境）

```bash
npm run build
```

静态导出产物输出到 `out/` 目录。

## 移动端（Capacitor）

Web 应用可通过 Capacitor（`webDir: out`）打包为原生 Android 应用。先构建静态站点，再同步：

```bash
npm run build
npx cap sync android
```

用 Android Studio 打开 `android/` 目录进行构建和运行。

## 桌面端（Electron）

### 开发模式运行（热更新）

```bash
npm run electron:dev
```

该命令会编译 Electron 主进程 / preload 脚本，启动 Next 开发服务器，并打开指向它的 Electron 窗口。

### 构建桌面安装包

```bash
npm run electron:build
```

该命令构建静态站点并打包可分发的安装程序（Windows 为 NSIS 安装包、macOS 为 DMG、Linux 为 AppImage），输出到 `dist-release/` 目录。

### 仅构建 Windows 版本

```bash
npm run electron:build:win
```

构建并打包 Windows NSIS 安装包（以及免安装的 `win-unpacked/` 绿色版）到 `dist-release/` 目录，使用国内镜像加速 electron-builder 二进制下载。

> **Windows 用户**：也可以直接双击项目根目录下的 `build-win.bat`。该脚本会检查 Node.js / npm、必要时安装依赖，然后执行 Windows 构建并输出产物路径。

## 项目结构

```
VibeVideo/
├── electron/           # Electron 主进程与 preload 脚本
├── android/            # Capacitor Android 工程
├── src/
│   ├── app/            # App Router 页面（首页、生成、作品库）
│   ├── components/     # UI 组件（布局、首页、生成、作品库、基础 UI）
│   ├── hooks/          # 自定义 Hook（use-generate）
│   └── lib/            # 工具函数、类型、模拟数据
├── next.config.mjs     # Next.js 配置（静态导出）
├── capacitor.config.ts # Capacitor 配置
├── tailwind.config.ts  # Tailwind 主题与动画
└── components.json     # shadcn/ui 配置
```

## 页面

- **首页（`/`）** —— 主视觉与功能亮点
- **生成（`/generate`）** —— 提示词输入、风格 / 比例 / 时长参数、生成流程
- **作品库（`/library`）** —— 响应式作品网格，支持筛选

## 后续规划

AI 生成管线目前仍是**占位实现**。要接入真实的生成能力：

1. 通过环境变量添加你的 AI 视频生成 API 凭证。
2. 将 `src/hooks/use-generate.ts` 中的模拟逻辑替换为真实的 API 调用（或使用 Next.js Route Handler 作为代理）。
3. 将 `src/lib/works.ts` 中的模拟作品替换为从后端拉取的数据。

## 许可证

私有项目。
