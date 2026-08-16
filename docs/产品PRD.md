# VibeVideo 产品需求文档(PRD)

| 项目 | 内容 |
|------|------|
| 产品名称 | VibeVideo |
| 文档版本 | v1.0 |
| 文档状态 | 草稿 |
| 更新日期 | 2026-08-16 |
| 产品定位 | AI 视频生成工作室(AI Video Generation Studio) |
| 支持平台 | Web、Windows、macOS、Linux、iOS、Android |

---

## 1. 产品背景与目标

### 1.1 背景

传统视频创作门槛高:需要专业剪辑技能、昂贵的软硬件、冗长的制作周期。随着 AIGC 技术成熟,用户期望通过自然语言描述即可快速获得高质量视频。

VibeVideo 定位为面向 Web、桌面端与移动端的 AI 视频生成工作室,目标是让"把想象力变成惊艳视频"成为一件人人可用的低门槛操作。

### 1.2 产品目标

- **降低门槛:** 让非专业用户无需剪辑技能即可产出视频。
- **提升效率:** 通过文本提示词在数秒内生成电影级、工作室级质量视频。
- **全平台覆盖:** 一次创作,在 Web / Windows / macOS / Linux / iOS / Android 各处使用。
- **可持续商业模式:** 通过分级订阅(Free / Pro / Studio)实现盈利。

### 1.3 价值主张

> Turn your imagination into stunning video —— 把想象力变成惊艳视频。

---

## 2. 目标用户与用户画像

### 2.1 目标用户

| 用户类型 | 核心诉求 | 对应能力 |
|----------|----------|----------|
| 内容创作者 / 短视频创作者 | 快速产出高质量视频 | 文生视频、多风格、作品库 |
| 社交媒体运营与营销人员 | 批量生成营销素材 | 快速出片、高清无水印 |
| 非专业设计师 / 普通用户 | 零门槛创作 | 文本提示词、免费套餐 |
| 中小团队 / 专业工作室 | 规模化、商业化能力 | 无限生成、商业授权、API 访问 |

### 2.2 用户画像示例

- **小白用户(Free):** 想快速做一条短视频,不关心技术细节,免费带水印即可。
- **进阶创作者(Pro):** 需要高清无水印、全风格、优先处理,用于个人品牌或接单。
- **专业工作室(Studio):** 需要无限生成、超高清、商业授权与 API 集成,服务客户项目。

---

## 3. 核心功能需求

### 3.1 视频生成(Generate)

- **提示词输入:** 用户输入文本描述(prompt)。
- **参数配置:** 风格(Style)、画面比例(Ratio)、时长(Duration)。
- **生成流程:** 从提交到完成的完整交互与状态反馈。
- **生成预览:** 以"胶片显影"隐喻展示渲染进度(显影液攀升、颗粒闪烁、显影液线)。

> ⚠️ **现状说明:** 生成逻辑当前为**占位实现**,`src/hooks/use-generate.ts` 为模拟逻辑,尚未接入真实 AI 生成 API。

### 3.2 作品库(Library)

- 响应式网格展示已生成作品。
- 支持筛选(按风格、时间等维度)。
- 作品数据当前来源于 `src/lib/works.ts`(mock 数据)。

### 3.3 灵感(Inspiration)

- 提供创作灵感参考,降低用户创作冷启动成本。

### 3.4 订阅与定价(Pricing)

- 三档套餐:Free / Pro / Studio。
- 月付 / 年付切换,年付有折扣。

### 3.5 认证(Login)

- 用户登录 / 注册,配合全局 `AuthProvider` 管理认证状态。

### 3.6 个人中心(Profile)

- 展示与管理用户账户、订阅、作品等个人信息。

### 3.7 国际化(i18n)

- 中英文双语切换,语言偏好持久化(本地存储)。
- 中英文混排字体栈保证无布局抖动。

### 3.8 主题切换(Theme)

- 深色 / 浅色双模式,默认深色,偏好持久化。

---

## 4. 页面结构与信息架构

### 4.1 页面路由

| 路由 | 页面 | 核心内容 |
|------|------|----------|
| `/` | Home | Hero + Steps + Showcase + Features + Testimonials |
| `/generate` | Generate | 提示词输入 + 参数配置 + 生成流程 |
| `/library` | Library | 作品网格 + 筛选 |
| `/inspiration` | Inspiration | 灵感参考 |
| `/pricing` | Pricing | 订阅定价 |
| `/login` | Login | 登录 / 注册 |
| `/profile` | Profile | 个人中心 |

### 4.2 全局布局

- 桌面端:顶部 `Navbar` + 底部 `Footer`。
- 移动端:`MobileNav` 底部导航。
- 全局 Provider:`ThemeProvider`、`LanguageProvider`、`AuthProvider`。

### 4.3 关键流转

```
首页(Hero)
  ├─ "Start Generating" → /generate(创作)
  ├─ "Browse Gallery"  → /library(作品库)
  ├─ Pricing           → /pricing(订阅)
  └─ Login             → /login(认证) → /profile(个人中心)
```

---

## 5. 视觉设计规范

### 5.1 设计主题

**电影胶片 / 影院美学(Filmic)。** 刻意避免通用的"AI 科技蓝/电光蓝",追求高级、premium、filmic 的电影质感。

### 5.2 色彩 Token

| 角色 | 值 | 说明 |
|------|-----|------|
| 主色(primary) | `hsl(240 10% 12%)` | 接近黑的炭灰"影院"色 |
| 强调色(accent-warm) | `hsl(36 82% 55%)` | 暖琥珀色,克制点缀;`--accent-soft` 与其同值 |
| 背景(深色) | `hsl(240 8% 4%)` | 默认深色背景 |
| 前景(深色) | `hsl(240 8% 95%)` | 深色模式文字 |

- 支持深色 / 浅色双模式,通过语义化 Token(`--background`、`--primary` 等)切换。
- 深色模式下强调色保持不变,仅主色反转为"粉笔白"以保持按钮/徽章可见性。

### 5.3 字体体系

| 用途 | 字体 |
|------|------|
| 展示标题 | 衬线体(`Georgia` / `Times New Roman` / `Songti SC` / `STSong` / `SimSun`),海报式大字,`font-display` |
| 正文 | Inter + 中文字体栈(`PingFang SC` / `Hiragino Sans GB` / `Microsoft YaHei` / `Noto Sans SC` / `Source Han Sans SC`) |
| 时间码 / 元数据 | 等宽字体(`ui-monospace` / `Menlo` / `Consolas` / `Courier New` 等),`font-mono`,表格数字(`tabular-nums`) |

### 5.4 电影工艺签名元素

| 元素 | 说明 |
|------|------|
| Letterbox 黑边 | 电影画幅黑边 |
| Film grain | 胶片颗粒感,SVG 噪点纹理叠加 |
| Timecode | 时间码,等宽表格数字 |
| REC 录制点 | 闪烁的琥珀色录制指示灯 |

### 5.5 动效

| 动效 | 说明 | 作用域 |
|------|------|--------|
| float | 漂浮 | 全局 |
| fade-in | 淡入上移 | 全局 |
| shimmer | 微光 | 全局 |
| rec-pulse | REC 脉冲 | 全局 / 预览 |
| ticker | 滚动跑马灯 | 全局 |
| idle-float | 待机漂浮(3.2s) | 生成预览 |
| grain-shimmer | 颗粒闪烁(0.9s) | 生成预览 |
| developer-line | 显影液线攀升(2.6s) | 生成预览 |
| idle-breathe | 待机呼吸(4.5s) | 生成预览 |

所有动效 GPU 加速(仅使用 transform / opacity)。

### 5.6 设计思路与原则

VibeVideo 的视觉语言由一个核心命题统领:**"这不是一个 AI 工具,而是一间数字电影工作室。"** 所有视觉决策都由这一命题推导而来,形成一套自洽的设计逻辑。

**原则一:用"电影工艺"符号替代"科技科幻"符号**

主流 AI 产品习惯用靛蓝、电光蓝、玻璃拟态、霓虹 HUD 来暗示"高科技"。VibeVideo 刻意反其道而行,借用电影工业中真实存在的视觉符号 —— 时间码(timecode)、录制指示灯(REC,`RecBadge` 组件)、画幅黑边(letterbox)、胶片颗粒(film grain) —— 来建立信任。

> **设计理由:** 用户购买的是"成片质量",而非"技术参数"。电影工艺符号让"AI 生成"这件事显得更有手艺感、更可靠,而非冷冰冰的算法输出;同时它也天然区隔于市面上千篇一律的 AI 卡片风,形成独特的品牌识别。

**原则二:"炭灰 + 暖琥珀"的高级叙事色板**

- **主色(炭灰 `240 10% 12%`)** 模拟放映厅暗场,让画面内容成为绝对主角,同时规避纯黑的死板感;
- **强调色(暖琥珀 `36 82% 55%`,`--accent-soft` 与 `--accent-warm` 同值)** 全站只此一处暖色,对应真实片场的钨丝灯与"录制中"指示灯,克制地用于图标、高亮、星标与 REC 圆点,营造"黑暗中的一束暖光"的焦点;
- **深色模式下强调色保持不变,仅主色反转为"粉笔白"**,保证按钮 / 徽章在暗底上始终可见。

**原则三:字体三件套,各司其职**

| 字体 | 职责 | 情绪 |
|------|------|------|
| 衬线展示体(`Georgia` / `Times New Roman` / `Songti SC` / `STSong` / `SimSun`) | 海报式大标题 | 电影海报 / 杂志封面的编辑感 |
| Inter + 中文字体栈 | 正文 | 中英混排同字号同行高,切换语言不抖动 |
| 等宽字体 | 时间码、评分、品牌 Logo 墙等元数据 | 复刻放映设备读数,强化技术可信度 |

**原则四:生成预览用"胶片显影"隐喻进度**

渲染进度被设计为暗房冲洗过程:预览画幅在 idle 时呈现深色中性"显影液"底 + 顶部暖色光晕 + 底部暗部,generating 时转为更暖的"化学活跃"氛围;显影区域用自下而上攀升的渐变(`hsl(36 82% 55% / 0.14)` → `hsl(240 20% 22% / 0.55)`)表现,前缘是渐隐的暖色"显影液线"(`developer-line`),颗粒伴随 `grain-shimmer` 闪烁,进度百分比以 timecode 字体展示并附 `FRAME {frameIndex} · developing` 副标。这把"等待生成"这一最焦虑的环节,转化为一种有仪式感的"见证成像"体验,让用户感觉自己在参与创作,而非干等一个百分比数字。

**原则五:动效服务于"呼吸感"**

所有动效(漂浮、淡入、微光、脉冲、跑马灯,以及生成预览专用的 `idle-float`、`grain-shimmer`、`developer-line`、`idle-breathe`)只作用于 transform / opacity,GPU 加速、零布局抖动。其存在是为了让界面"活着"(REC 脉动、颗粒闪烁),而非炫技,整体节奏克制,传递胶片摄影机的呼吸感。

### 5.7 技术栈

React 18 + Next.js 15(App Router)+ TypeScript · Tailwind CSS + shadcn/ui + Lucide 图标 · Electron(桌面)+ Capacitor(移动端)。

---

## 6. 定价与商业模式

| 套餐 | 月付 | 年付 | 核心权益 |
|------|------|------|----------|
| Free | $0 | $0 | 基础视频、带水印、标准分辨率、社区支持 |
| Pro | $19 | $182 | 更多额度、无水印、高清、全风格、优先处理 |
| Studio | $49 | $470 | 无限生成、超高清、商业授权、API 访问、专属支持 |

- Pro 为推荐套餐(highlighted),带 "Most popular" 徽章。
- 年付享折扣,页面提供月付/年付切换。

---

## 7. 非功能需求

### 7.1 性能

- 生成预览动效需 GPU 加速,避免卡顿。
- 响应式网格(作品库)需支持大规模作品列表。

### 7.2 多平台

- Web、Windows、macOS、Linux(Electron)、iOS、Android(Capacitor)。

### 7.3 可访问性(a11y)

- 语义化 HTML、ARIA 标签(如评分徽章的 `aria-label`)。
- 键盘可操作、色彩对比满足可读性。

### 7.4 SEO

- 完善的 `metadata`(标题、描述、关键词、OpenGraph、Twitter Card)。
- JSON-LD 结构化数据(WebApplication)。
- `robots.ts` 与 `sitemap.ts`。

### 7.5 国际化

- 中英双语,语言偏好持久化,避免切换时布局抖动。

### 7.6 安全性

- 认证状态由 `AuthProvider` 统一管理。
- 后续接入真实 API 时需通过环境变量管理密钥。

---

## 8. 里程碑规划

| 阶段 | 内容 | 状态 |
|------|------|------|
| M1 | 产品框架搭建(首页、页面结构、视觉风格) | ✅ 已完成 |
| M2 | 核心页面完善(生成页、作品库、定价、登录、个人中心) | ✅ 已完成(UI 层面) |
| M3 | 国际化与主题系统 | ✅ 已完成 |
| M4 | **接入真实 AI 视频生成 API** | ⏳ 待开发 |
| M5 | **作品库接入真实后端数据** | ⏳ 待开发 |
| M6 | 订阅支付与商业化闭环 | ⏳ 待开发 |

### 待办说明

1. 添加 AI 视频生成 API 凭证(通过环境变量)。
2. 将 `src/hooks/use-generate.ts` 中的模拟逻辑替换为真实 API 调用(或经 Next.js Route Handler 代理)。
3. 将 `src/lib/works.ts` 中的 mock 作品替换为后端真实数据。

---

## 附:相关文件索引

| 文件 | 说明 |
|------|------|
| `package.json` | 项目配置、依赖、构建脚本 |
| `src/app/` | 页面路由(Home/Generate/Library/Inspiration/Pricing/Login/Profile) |
| `src/components/` | UI 组件(landing/generate/library/layout/ui 等) |
| `src/hooks/use-generate.ts` | 生成流程(当前为模拟逻辑) |
| `src/lib/works.ts` | 作品数据(当前为 mock) |
| `src/lib/plans.ts` | 订阅套餐定义 |
| `src/lib/i18n/` | 国际化 |
| `src/app/globals.css` | 主题 Token、视觉规范、电影工艺元素 |
| `tailwind.config.ts` | Tailwind 主题与动效 |
