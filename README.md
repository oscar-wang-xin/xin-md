# XIN-MD

Markdown 写作，一键转成**内联样式**富文本，粘贴到微信公众号编辑器即可无损还原。

微信公众号编辑器会丢弃 `class` 与 `<style>`，只保留内联 `style`。本项目的主题系统因此不产出任何 CSS 类，只产出内联样式字符串，保证预览与粘贴结果一致。

## 分支与来源

本项目 git 远端为 [oscar-wang-xin/xin-md](https://github.com/oscar-wang-xin/xin-md)
（fork 自 Bryc 初建的 Same 项目，主线作者 bryc3 `666406@gmail.com`，历史共 5 个提交）。克隆时的原始 `main`
已原样归档到 **`mars`** 分支（对应提交 `d3cda59`，即 fork 版本快照）；当前 `main` 在其基础上继续演进。

> 项目原名「火星编辑器（Mars Editor）」，现已统一更名为 **XIN-MD**（界面标题、页面 title、favicon、
> 导出文件名、Cloudflare Pages 项目名一并更新）。

### 新增主题（gzh-design-skill 移植）

在原有 12 套主题之上，移植了 [gzh-design-skill](_ref/gzh-design-skill__skillhub/)
（公众号排版组件库）的 6 套主题：

| 主题 | id | 特点 |
|------|-----|------|
| 摸鱼绿 | `moyu-green` | 绿色杂志卡片风，教程 / 盘点 / 清单 |
| 红白色系 | `red-white` | 正红经典编辑风，红色克制点睛 |
| 石墨极简 | `graphite-minimal` | 石墨灰 + 细线 + 超大留白 |
| 留白禅意 | `zen-whitespace` | 衬线大字金句，东方禅意 |
| 摸鱼票据 | `moyu-ticket` | 票据 / 门票造型，硬阴影 + 撕票虚线 |
| 橄榄手记 | `olive-journal` | 内刊手记，墨黑 + 橙色点睛 |

> 来源组件库位于 `_ref/gzh-design-skill__skillhub/`（已加入 `.gitignore`，不随仓库分发）。

## 功能

- Markdown 实时预览，编辑区与预览区滚动同步
- 多套内置主题（浅色 / 深色纸底），可切换
- 排版密度三档（紧凑 / 标准 / 宽松），「标准」即主题原设计值
- 一键复制为公众号可用的富文本
- 图片本地存储（IndexedDB），粘贴 / 拖拽上传
- 代码高亮、脚注、`==高亮==` 等扩展语法

### 导入 / 导出

浏览器存储清掉就没了，所以草稿要能搬出去：

- **导入** `.md` / `.markdown` / `.txt`：每个文件建一篇草稿；`.zip`：按备份包整体还原
- **导出当前草稿 `.md`**：纯文本，图片引用保持 `![[名字]]`
- **导出全部备份 `.zip`**：草稿 + 图片原始文件 + `manifest.json`，可完整导回（zip 读写自己实现，压缩交给浏览器原生 `CompressionStream`，不引第三方库）
- **导出正文长图 `.png`**：750px 宽，正文直接画成一张图。走 `<foreignObject>` 序列化真实 DOM —— 正文样式全内联、图片全是 data URI，正好满足它的限制

## 图片粘贴

图片以 data URI 内嵌，**实测粘进公众号后台后原样保留** —— 带图文章不需要先传图床，
写完直接「复制到公众号」就行。

`tools/wechat-paste-test.html` 是当时用的实测页，四个用例（data URI 图片 / https 远程图片 /
图文混排 / 外链）各一个复制按钮，留着备用：微信哪天改了粘贴行为，复测一遍就知道。

## 技术栈

React 19 · TypeScript · Vite 7 · CodeMirror 6 · markdown-it · highlight.js

## 开发

```bash
npm install
npm run dev      # 开发服务器
npm run build    # 类型检查 + 生产构建
npm run preview  # 预览构建产物
npm run deploy   # 构建并发到 Cloudflare Pages（xin-md.pages.dev）
```

## 发版

线上是 Cloudflare Pages 项目 `xin-md`，**直传部署，没有接 GitHub 自动构建** ——
推代码到 main 不会更新线上，必须跑一次：

```bash
npm run deploy
```

发完可以用 `npx wrangler pages deployment list --project-name xin-md` 核对，
最新一条的 Source 应当是刚推上去的 commit。
