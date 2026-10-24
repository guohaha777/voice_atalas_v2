# 万物声谱 · 工程前端开发交接 5（成曲规则完成 → 提示词系统）

更新：2026-10-24。正式工程：`/Users/hahaking/Projects/voice_atalas/wanwu-shengpu-v2`，GitHub 仓库 `guohaha777/voice_atalas_v2`（本地 `main` 跟踪的远端名是 `v2`），分支 `main`。推送会触发 Netlify 更新线上，需用户明确同意。`origin`（`voice_atalas_v1`）没有跟着推。

**本文件取代 `HANDOFF4.md`。** 先读根目录 `AGENTS.md`，再读本文件；改规则先读 `packages/sound-rules/README.md`。用户当前指令优先，回复一律用中文。

## 1. 现在在哪一步

声音诞生、万物声场、万物成曲三页的**成曲规则和功能细节都已做完**（只做前端加 mock）。下一步是**提示词系统**（见第 6 节），最后生成和后端交接的接口协议。

工作方式不变：用户从页面看问题 → 先说明分析和方案 → 用户确认后再改 → 改完跑 `npm test`、`npm run build`，并在浏览器里核对 → 用户说“github”时才提交并推送。始终结构化开发：规则数值只在 `packages/sound-rules/rules/*.json`，页面不写数值；公共素材和规则只留一份。

## 2. 这一阶段做完的（HANDOFF4 之后）

**声音规则（`packages/sound-rules`）**
- 「重复」「一阵一阵」排满剪下的一段（`pattern.repeat.minCount`、`pattern.bursts.minGroups` 是最少次数）；声音诞生试听同一条规则。
- 一个声音最多响 45 秒（`limits.clipMaxSeconds`，校验它不超过最长的声场）；超出时在两声之间结束。
- 新增三份规则：`background.v1.json`（本地背景：心情配置表、课本节奏、旋律只在空档、在长度之内收尾、课本歌曲的几种样子 `variations`、碰一碰判定 `meeting`）、`mix.v1.json`（孩子声音和背景的音量、背景让位 6 dB、背景最大 0.35、总线限幅）、`textbook-match.v1.json`（帮我找找的权重）。算法：`background.ts`、`mix.ts`、`textbookMatch.ts`、`textbookVariation.ts`。`RULE_VERSIONS` 汇总各规则版本。
- 每个参数的含义、出问题查哪个参数，都在规则包 README。

**数据契约（`packages/contracts`）**
- `textbook.ts`（`textbook-v1`）：课本歌曲特征模板 `TextbookTrack`、样子 `TextbookVariation`。
- `background.ts`（`background-request-v1`）：背景来源（AI 音频 / AI 写音符 / 本地规则）、发给后台的匿名请求 `BackgroundBrief`（只带课本歌曲的特征，不带录音、名字、地点、歌曲本身）、校验过的结果 `BackgroundResult`。
- `work.ts`：`Inspiration` 课本可带 `variation`；`SavedWork.rendering` 记录孩子留下的背景来源和各规则版本（浏览器只预览，正式音频由后端按同一版本规则混音）。尚无持久化数据，没有升版本号。

**页面**
- 声音诞生：没录到声音时提示（再点一次“做好了”才继续）；从声场返回 = 接着改上一个声音（同一编号、同一摆放），换新原声 = 新声音。
- 万物声场：声音比声场长时自动换到放得下的长度，放不下的长度变灰（成曲页同）；实时听本地背景（开关在“课本灵感”那一行的小喇叭）；说明一律由小青蛙说，按钮里不放小字；选了课本歌曲先讲它的特点；课本灵感弹窗三栏（帮我找找 / 课本歌曲 / 教学音乐），只有歌曲目录滚动。
- 万物成曲：背景卡片只放控件，一个背景来源标签（本地生成 / AI 写音符 / AI 生成，AI 做好后点它切换）；乐器按擅长分工，只选小鼓保留原始背景；AI 背景端口与降级链（AI 音频 → AI 写音符 → 本地 → 只听孩子，mock 如实“未开放”，从不自动替换）；课本歌曲“换几种样子”、碰一碰、课本讲解（本地模板）。
- 作品书架：听一听、改名、拿下来。
- 课堂大屏（声场、成曲顶栏“大屏”）：全屏、大字、更大的标记和发声高亮。
- 调音台 `/lab/sound-rules`：只在开发环境或 `VITE_ENABLE_LAB=1` 的预览构建里有；四份规则逐项滑块、试听、校验后导出。测试声音集 `docs/assets/test-set.json`：已有 8 段（声音库示例），待收集 11 段。

**工程**
- mock 都在 `apps/web/src/mocks/`，`apps/web/src/app/services.ts` 是唯一选择实现的地方；`tests/structure.test.ts` 守着这条边界。接后端时换 `services.ts`、删掉 `mocks/`。

详细验收记录：`docs/development/*-acceptance.md` 各页末节；架构：`docs/development/architecture.md`。

## 3. 已定、但还没做的

- **本机保存（IndexedDB）**：录音、声卡、作品刷新不丢，用过的音源缓存——用户暂时去掉，未做。
- **接口协议交接文档**：最后一步，用户暂时去掉，未做。
- **测试声音集还差 11 段有授权的录音**（流水、雨、掌声、操场人声、说话、敲门、狗叫、拍手、钟、鸡鸣、安静教室），原件放 `assets-source/audio/test-set/`，见那里的 README。
- **耳机 / 外放实听**：五个维度、背景心情表、混音音量都只做过数值测量，需要用户或音乐角色在调音台里听后调参数。
- **真机验收**：真机录音、iOS 微信、低端安卓、真实弱网、多浏览器、电子黑板实机（大屏的全屏请求在浏览器预览里被拒）都没做。
- 用户决定先不做：音乐小发现的“背景接话”。

## 4. 结构速查

```
packages/contracts/        数据契约：sound-v1、arrangement-v1、work-v1、textbook-v1、background-request-v1
packages/sound-rules/      规则：rules/*.json（只改这里）、src/（纯函数）、tests/、README（说明书）
apps/web/src/app/services.ts      选择每个端口的实现（今天：mock + 如实的离线实现）
apps/web/src/mocks/               mock 与内存替身（一键删除）
apps/web/src/shared/background/   背景层（两页共用）、AI 背景端口 generator.ts、乐器端口 library.ts
apps/web/src/shared/inspiration/  课本灵感（目录端口、帮我找找、课本讲解模板 talk.ts、弹窗）
apps/web/src/shared/audio/        渲染（renderShaped、renderBackground）、播放器 SequencePlayer（分层音量 + 限幅）
apps/web/src/pages/lab/           调音台（只在开发 / 预览构建）
docs/assets/test-set.json         测试声音集清单
```

## 5. 验证方式

```sh
cd /Users/hahaking/Projects/voice_atalas/wanwu-shengpu-v2
npm test                # 111 项，必须全过
npm run build           # 类型检查 + 资源检查 + 样式结构检查（单文件 ≤ 220 行）+ 构建
npm run assets:library  # 只在增改声音库原件或改了体检规则后运行（需要 ffmpeg）
```

开发服务器 `npm run dev`（127.0.0.1:5290）。音频必须用真实点击触发。调音台：`http://127.0.0.1:5290/lab/sound-rules`。

## 6. 下一步：提示词系统（新对话处理）

AI 只在三处出现，每处都有不联网的降级（开发指南第 05 节）：**背景音乐**（Fun-Music 描述词、千问写音符动机）、**作品讲解 / 音乐小发现**、**课本讲解润色**；另有声音诞生的**向导提示**（现在是预设文案 `pages/sound-birth/config/hintPresets.ts`）、心情“自己写”的理解（`moodInterpreter`，未开放）。前端已经有的接口：

- AI 背景：`BackgroundBrief`（请求）/ `BackgroundResult`（结果）在 `packages/contracts/src/background.ts`，端口 `apps/web/src/shared/background/generator.ts`。
- 课本讲解：本地模板 `apps/web/src/shared/inspiration/talk.ts`（四句：特点 · 这次的样子 · 碰一碰 · 试一试）。
- 音乐小发现：规则 `pages/compose/model/discoveries.ts`，文案 `config/discoveryCopy.ts`。
- 向导提示端口：`pages/sound-birth/services/soundHints.ts`；心情理解端口：`pages/sound-world/services/moodInterpreter.ts`。

需要在新对话里先分析、再请用户确认的问题：

1. 提示词放在哪：建议新建 `packages/prompts`（纯文本 + 版本常量 + 输出格式校验，前端只用输出契约，密钥和调用只在服务端），和规则包一样“改文本不改代码”，并记录到作品的 `rendering` 里。
2. 每个 AI 任务一份提示词：输入是什么匿名摘要、输出什么 JSON、用什么校验和修补、失败时本地降级用哪份模板，以及来源标签（`audio-ai` / `notes-ai` / 本地）怎么显示。
3. 语料：本地模板句、向导提示预设、课本讲解模板、给孩子的话（低年级用词、字数上限、不评价孩子、不用术语）——哪些要整理成可替换的语料文件、谁来维护（音乐角色）。
4. 课本特征提取（开发期脚本 + AI 写文字 + 人耳核对）和提示词的关系。
5. 怎么在不接模型的情况下验收提示词（固定样例输入 + 期望输出格式的测试）。

## 7. 新对话可直接粘贴

> 请先阅读 `/Users/hahaking/Projects/voice_atalas/wanwu-shengpu-v2/AGENTS.md` 和 `HANDOFF5.md`，涉及规则再读 `packages/sound-rules/README.md`。成曲规则已做完，现在做提示词系统和语料（HANDOFF5 第 6 节），参考 `/Users/hahaking/Projects/voice_atalas/公测计划/万物声谱_新成员开发指南.html` 的“项目可调节文件”和“会用到的模型”两节。始终用中文回复。先说明分析和方案，我确认后再改；改完跑 `npm test` 和 `npm run build`，用浏览器核对；只做前端加 mock，不提交、不推送，等我说。
