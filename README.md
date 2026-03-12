# TAI Power Demo

Vue 3 + Vite 前端專案，並支援透過 **Zeplin MCP** 取得設計規格與 Design Tokens。

## 技術棧

- **Vue 3**（Composition API）
- **Vite 6**
- **Zeplin MCP**（於 Cursor 中使用）

## 開發

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

## 建置與預覽

```bash
npm run build
npm run preview
```

## GitHub Pages

- **Repo:** https://github.com/crazyms520/tp-demo
- **線上預覽:** https://crazyms520.github.io/tp-demo/

Push 至 `main` 後由 GitHub Actions 自動建置並部署。

## Zeplin MCP

在 Cursor 中啟用 Zeplin MCP 後，可請 AI 使用 Zeplin 工具取得：

- Design Tokens（`get_design_tokens`）
- 畫面規格（`get_screen`）
- 元件規格（`get_component`）
- 圖層資源下載（`download_layer_asset`）

詳細說明請見 [ZEPLIN_MCP.md](./ZEPLIN_MCP.md)。

## 專案結構

```
├── src/
│   ├── design-tokens/   # 從 Zeplin 同步的 design tokens
│   ├── App.vue
│   └── main.js
├── public/
├── index.html
├── vite.config.js
└── package.json
```
