# 背景移除工具 MVP 需求文档

**版本:** v1.0  
**日期:** 2026-03-18  
**项目代号:** bg-remover

---

## 📋 1. 项目概述

### 1.1 项目目标
开发一个轻量化的在线图片背景移除工具，用户上传图片后自动去除背景，返回透明背景的 PNG 图片。

### 1.2 目标用户
- 电商卖家（商品图处理）
- 内容创作者（社交媒体图片）
- 设计师（快速抠图）
- 普通用户（证件照、头像处理）

### 1.3 核心价值
- **快速:** 上传即处理，无需等待
- **简单:** 无需复杂操作，一键完成
- **免费:** 免费额度满足日常需求
- **全球:** 基于 Cloudflare 边缘节点，全球访问

---

## 🎯 2. 功能需求 (MVP)

### 2.1 核心功能

#### 2.1.1 图片上传
- 支持拖拽上传
- 支持点击选择文件
- 支持格式：JPG、PNG、WEBP
- 支持大小限制：最大 10MB
- 实时预览上传的图片

#### 2.1.2 背景移除处理
- 调用 Remove.bg API 进行背景移除
- 显示处理进度
- 处理超时：30 秒
- 支持异步处理（避免阻塞）

#### 2.1.3 结果展示
- 展示处理后的透明背景图片
- 对比原图与效果图
- 提供透明背景网格显示

#### 2.1.4 下载功能
- 下载处理后的 PNG 图片
- 自动命名：`removed-bg-[timestamp].png`

### 2.2 辅助功能

#### 2.2.1 错误处理
- 文件格式不支持提示
- 文件过大提示
- API 调用失败提示
- 网络错误提示

#### 2.2.2 使用引导
- 首次访问显示使用说明
- 显示当前免费额度（如果有）

---

## 🚀 3. 非功能需求

### 3.1 性能要求
- 页面加载时间：< 2 秒
- 图片上传响应：< 1 秒
- 背景移除处理：< 10 秒（依赖 API）
- 支持 100 并发用户（Cloudflare 免费额度）

### 3.2 可用性要求
- 界面简洁直观
- 移动端友好响应式设计
- 支持暗色模式
- 无障碍访问（WCAG 2.1 AA）

### 3.3 安全要求
- HTTPS 加密传输
- API Key 存储在 Workers Secrets（不暴露）
- 文件类型校验（防止恶意文件上传）
- 无用户数据持久化（隐私保护）

### 3.4 可扩展性
- 代码模块化，便于后续添加新功能
- 支持 API Key 热更新
- 预留多语言支持接口

---

## 💻 4. 技术方案

### 4.1 技术栈

#### 前端
- **框架:** React 18 + Vite
- **UI 组件:** Tailwind CSS
- **状态管理:** React Hooks
- **部署:** Cloudflare Pages

#### 后端
- **运行时:** Cloudflare Workers
- **语言:** JavaScript (ES6+)
- **API:** Remove.bg API

### 4.2 架构设计

```
用户浏览器
    ↓
Cloudflare Pages (静态前端)
    ↓
Cloudflare Workers (API 代理)
    ↓
Remove.bg API (AI 处理)
    ↓
返回处理后的图片 (流式传输)
```

### 4.3 数据流

1. 用户上传图片 → 前端读取为 File 对象
2. 前端发送 POST 请求到 Workers API
3. Workers 接收图片，转发到 Remove.bg API
4. Remove.bg 返回处理后的图片（二进制）
5. Workers 流式返回图片给前端
6. 前端显示结果并提供下载

### 4.4 存储策略
- **前端:** 无状态，图片在内存处理
- **后端:** 无状态，图片流式传输
- **日志:** Cloudflare Analytics（免费）

---

## 🔌 5. API 设计

### 5.1 Remove.bg API

#### 请求
```
POST https://api.remove.bg/v1.0/removebg

Headers:
  X-Api-Key: <API_KEY>
  Content-Type: multipart/form-data

Body:
  image: <image_file>
  size: <optional: auto|full|preview>
  type: <optional: person|product|car|animal>
  format: <optional: auto|png|jpg>
  bg_color: <optional: hex color>
  bg_image_file: <optional: background image>
  channels: <optional: rgba|alpha>
  shadow: <optional: 0|1|2>
  roi: <optional: x,y,width,height>
  crop: <optional: 0|1|2|3|4>
  scale: <optional: percent|auto>
  semitransparency: <optional: 0|1>
  type_level: <optional: 0|1|2>
  format_version: <optional: 0|1|2|3>
```

#### 响应
```
Status: 200 OK
Content-Type: image/png
Body: <binary image data>
```

#### 错误响应
```
Status: 402 Payment Required
{
  "errors": [
    {
      "title": "Insufficient credits",
      "detail": "You have 0 credits left"
    }
  ]
}
```

### 5.2 Cloudflare Workers API

#### 上传并处理
```
POST /api/remove-bg

Headers:
  Content-Type: multipart/form-data

Body:
  image: <image_file>

Response:
  Status: 200 OK
  Content-Type: image/png
  Content-Disposition: attachment; filename="removed-bg.png"
  Body: <binary image data>

Error:
  Status: 400/401/502
  Content-Type: application/json
  {
    "error": "错误描述",
    "code": "ERROR_CODE"
  }
```

---

## 🌐 6. 部署方案

### 6.1 前端部署 (Cloudflare Pages)

```bash
# 构建项目
npm run build

# 部署
npx wrangler pages deploy dist --project-name=bg-remover
```

**配置文件:** `wrangler.toml`
```toml
name = "bg-remover"
compatibility_date = "2024-01-01"

[env.production]
vars = { ENVIRONMENT = "production" }
```

### 6.2 后端部署 (Cloudflare Workers)

```bash
# 部署
npx wrangler deploy

# 设置 API Key
npx wrangler secret put REMOVE_BG_API_KEY
# 输入你的 Remove.bg API Key
```

**配置文件:** `worker/wrangler.toml`
```toml
name = "bg-remover-api"
main = "worker.js"
compatibility_date = "2024-01-01"

[env.production]
vars = { ENVIRONMENT = "production" }

# 生产环境
[env.production]
route = { pattern = "api.example.com/*", zone_name = "example.com" }
```

### 6.3 域名配置
- 可选：绑定自定义域名（需要域名解析到 Cloudflare）
- 免费域名：`bg-remover.pages.dev` (Pages) + `bg-remover-api.workers.dev` (Workers)

---

## 💰 7. 成本估算

### 7.1 Cloudflare 成本（MVP 阶段）

| 服务 | 免费额度 | 付费单价 |
|------|---------|---------|
| Pages | 无限请求 | 免费 |
| Workers | 100k 请求/天 | $5/百万次请求 |
| Bundled Requests | 10k 次/天 | $0.50/百万次 |
| Workers KV（可选） | 100k 读取/天 | $0.50/百万次 |

**MVP 阶段：** 完全免费

### 7.2 Remove.bg 成本

| 套餐 | 价格 | 额度 | 单价 |
|------|------|------|------|
| 免费版 | $0 | 50 张/月 | N/A |
| 个人版 | $9/月 | 40 张/月 | $0.23/张 |
| 专业版 | $39/月 | 1250 张/月 | $0.031/张 |
| 团队版 | $99/月 | 5000 张/月 | $0.02/张 |
| 企业版 | $499/月 | 50000 张/月 | $0.01/张 |

**推荐起步：** 免费版（50 张/月）→ 根据需求升级

### 7.3 总成本（MVP 阶段）
- **最低成本：** $0/月（仅 Cloudflare + Remove.bg 免费额度）
- **预估月成本：** $9/月（个人版套餐）

---

## 📅 8. 开发计划

### 8.1 Phase 1: 基础功能 (3-5 天)

- [ ] 项目初始化（Vite + React + Tailwind）
- [ ] 基础 UI 布局
- [ ] 图片上传组件
- [ ] 图片预览功能
- [ ] Workers API 代理开发
- [ ] Remove.bg API 集成
- [ ] 结果展示组件
- [ ] 下载功能

### 8.2 Phase 2: 优化完善 (2-3 天)

- [ ] 错误处理和提示
- [ ] 加载状态优化
- [ ] 移动端适配
- [ ] 性能优化
- [ ] 使用说明页面

### 8.3 Phase 3: 部署上线 (1 天)

- [ ] Cloudflare Pages 配置
- [ ] Workers 部署
- [ ] 环境变量配置
- [ ] 域名绑定（可选）
- [ ] 测试验证

### 8.4 预计总工期
- **单人开发:** 6-9 天
- **熟练开发:** 3-5 天

---

## 🔮 9. 后续扩展计划

### 9.1 短期扩展（1-2 个月）
- 支持批量处理
- 支持更换背景色
- 支持自定义背景图片
- 添加更多输出格式（JPG、WEBP）
- API Key 配额管理

### 9.2 长期扩展（3-6 个月）
- 用户登录系统
- 历史记录管理
- 多 API 提供商支持（降低成本）
- 移动 App 版本
- 浏览器插件

### 9.3 盈利模式
- 免费版：每天 5 张
- 付费版：无限使用 + 批量处理
- 企业版：API 接口 + 私有部署

---

## ✅ 10. 验收标准

### 10.1 功能验收
- ✅ 能成功上传 JPG/PNG/WEBP 图片
- ✅ 背景移除处理正常完成
- ✅ 处理结果正确显示
- ✅ 能下载处理后的图片
- ✅ 错误提示清晰准确

### 10.2 性能验收
- ✅ 首次加载 < 3 秒
- ✅ 图片处理 < 15 秒
- ✅ 移动端操作流畅

### 10.3 兼容性验收
- ✅ Chrome、Safari、Firefox、Edge
- ✅ iOS、Android 移动浏览器
- ✅ 1280px+ 桌面端、375px+ 移动端

---

## 📞 11. 联系方式

**项目负责人:** [待填写]  
**技术支持:** [待填写]  
**紧急联系:** [待填写]

---

## 📎 12. 附录

### 12.1 参考资料
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Remove.bg API 文档](https://www.remove.bg/api)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Vite 文档](https://vitejs.dev/)

### 12.2 相关链接
- 项目仓库: [待创建]
- 演示地址: [待部署]
- API Dashboard: [待填写]

---

**文档状态:** ✅ 已完成  
**最后更新:** 2026-03-18  
**下次评审:** [待定]
