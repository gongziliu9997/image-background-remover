# 项目结构说明

## 📁 实际项目结构

```
bg-remover-mvp/
│
├── 📄 PRD.md                          # MVP 需求文档
├── 📄 PROJECT_STRUCTURE.md            # 本文件
│
└── 📂 项目代码（待创建）
    │
    ├── 📂 frontend/                   # 前端项目
    │   ├── 📄 package.json
    │   ├── 📄 vite.config.js
    │   ├── 📄 tailwind.config.js
    │   ├── 📄 index.html
    │   │
    │   ├── 📂 src/
    │   │   ├── 📄 main.jsx
    │   │   ├── 📄 App.jsx
    │   │   │
    │   │   ├── 📂 components/
    │   │   │   ├── 📄 ImageUploader.jsx
    │   │   │   ├── 📄 ResultDisplay.jsx
    │   │   │   └── 📄 ErrorAlert.jsx
    │   │   │
    │   │   ├── 📂 services/
    │   │   │   └── 📄 api.js
    │   │   │
    │   │   └── 📂 styles/
    │   │       └── 📄 globals.css
    │   │
    │   └── 📂 public/
    │       └── 📄 favicon.ico
    │
    ├── 📂 worker/                     # Cloudflare Workers
    │   ├── 📄 worker.js               # 主逻辑
    │   ├── 📄 wrangler.toml           # Workers 配置
    │   └── 📄 .dev.vars               # 开发环境变量（不提交）
    │
    └── 📄 README.md                   # 项目说明

```

---

## 🚀 快速开始

### 1. 创建前端项目

```bash
# 创建 Vite + React 项目
npm create vite@latest frontend -- --template react
cd frontend

# 安装依赖
npm install

# 安装 Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 返回根目录
cd ..
```

### 2. 创建 Worker 项目

```bash
# 创建 worker 目录
mkdir -p worker

# 初始化 wrangler
cd worker
npx wrangler init --yes

# 返回根目录
cd ..
```

### 3. 安装全局依赖

```bash
# 安装 wrangler（如果还没装）
npm install -g wrangler
```

---

## 🔧 配置说明

### Frontend 配置

**`frontend/vite.config.js`**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8787', // Workers 本地开发端口
        changeOrigin: true
      }
    }
  }
})
```

**`frontend/package.json`**
```json
{
  "name": "bg-remover-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "vite": "^5.0.0"
  }
}
```

### Worker 配置

**`worker/wrangler.toml`**
```toml
name = "bg-remover-api"
main = "worker.js"
compatibility_date = "2024-01-01"

[env.production]
vars = { ENVIRONMENT = "production" }

[env.production]
# 可选：绑定自定义域名
# route = { pattern = "api.example.com/*", zone_name = "example.com" }
```

**`worker/.dev.vars`** （仅本地开发，不提交）
```bash
REMOVE_BG_API_KEY=your_remove_bg_api_key_here
```

---

## 📦 环境变量

### Remove.bg API Key 获取步骤

1. 访问 [remove.bg](https://www.remove.bg/)
2. 注册/登录账号
3. 进入 API Dashboard
4. 获取 API Key

### 本地开发配置

```bash
# 进入 worker 目录
cd worker

# 设置 API Key（本地开发）
echo "REMOVE_BG_API_KEY=your_api_key" > .dev.vars

# 启动本地开发服务器
npx wrangler dev
```

### 生产环境配置

```bash
# 进入 worker 目录
cd worker

# 部署到生产环境
npx wrangler deploy

# 设置生产环境 API Key
npx wrangler secret put REMOVE_BG_API_KEY
# 粘贴你的 API Key
```

---

## 🚀 部署流程

### 1. 部署前端 (Cloudflare Pages)

```bash
# 进入前端目录
cd frontend

# 构建生产版本
npm run build

# 部署到 Cloudflare Pages
npx wrangler pages deploy dist --project-name=bg-remover

# 记下返回的 URL（如：https://bg-remover.pages.dev）
```

### 2. 部署后端 (Cloudflare Workers)

```bash
# 进入 worker 目录
cd worker

# 部署
npx wrangler deploy

# 记下返回的 URL（如：https://bg-remover-api.workers.dev）
```

### 3. 更新前端 API 地址

修改 `frontend/src/services/api.js`：
```javascript
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://bg-remover-api.workers.dev'  // 生产环境
  : '/api';                                // 开发环境
```

### 4. 重新部署前端

```bash
cd frontend
npm run build
npx wrangler pages deploy dist --project-name=bg-remover
```

---

## 🧪 测试

### 本地测试

```bash
# 终端 1: 启动 Worker
cd worker
npx wrangler dev
# 输出: Listening on http://localhost:8787

# 终端 2: 启动前端
cd frontend
npm run dev
# 访问: http://localhost:5173
```

### 功能测试清单

- [ ] 上传 JPG 图片
- [ ] 上传 PNG 图片
- [ ] 上传超过 10MB 图片（应提示错误）
- [ ] 上传非图片文件（应提示错误）
- [ ] 处理过程显示加载状态
- [ ] 处理完成后显示结果
- [ ] 下载功能正常
- [ ] 移动端显示正常

---

## 📊 监控

### Cloudflare Analytics

访问 [Cloudflare Dashboard](https://dash.cloudflare.com/) 查看：
- 请求次数
- 响应时间
- 错误率
- 地域分布

### Remove.bg Dashboard

访问 [Remove.bg API Dashboard](https://www.remove.bg/api) 查看：
- API 使用次数
- 剩余额度
- 请求历史

---

## 🔐 安全注意事项

1. **永远不要将 API Key 提交到 Git**
   - `.dev.vars` 已加入 `.gitignore`
   - 生产环境使用 `wrangler secret`

2. **Workers Secrets 加密存储**
   - 使用 `wrangler secret put` 管理敏感信息
   -   不要在代码中硬编码

3. **HTTPS 强制**
   - Cloudflare 自动提供 HTTPS
   -   前端 API 调用必须使用 HTTPS

4. **文件类型校验**
   - 前端和后端都要校验文件类型
   -   防止恶意文件上传

---

## 📝 后续优化

1. **添加测试**
   - 前端单元测试
   - Workers 集成测试

2. **性能优化**
   - 图片压缩
   - 懒加载

3. **用户体验**
   - 拖拽上传动画
   - 进度条
   - 错误重试

4. **国际化**
   - 多语言支持
   -   区域化设置

---

如有问题，参考 `PRD.md` 或联系项目负责人。
