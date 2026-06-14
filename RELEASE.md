# 网站更新保护流程

每次更新网站内容或功能时，按下面顺序操作。

## 1. 更新前先备份

```bash
npm run backup
```

备份会保存到 `.site-backups/site-YYYYMMDD-HHMMSS`。这个目录不会提交到 Git。

## 2. 修改内容

常见修改包括：

- 更新 `data.json`
- 添加或替换 `images/` 里的图片
- 修改 `index.html`、`app.js`、`styles.css`

## 3. 发布前检查

```bash
npm run check
```

检查会确认：

- `data.json` 是合法 JSON
- 行程、周边、群组的必要字段没有缺失
- 日期格式是 `YYYY-MM-DD`
- 本地图片路径真实存在
- 页面引用的本地 CSS、JS、图片文件存在

如果出现 `ERROR`，先修好再发布。`WARN` 是提醒，不会阻止发布。

## 4. 确认后再发布

检查通过后，再把当前网站文件发布到线上。

## 5. 出错时回滚

恢复到最近一次备份：

```bash
npm run rollback
```

恢复到指定备份：

```bash
npm run rollback .site-backups/site-YYYYMMDD-HHMMSS
```

回滚前，脚本会先自动保存一份当前现场到 `.site-backups/pre-rollback-YYYYMMDD-HHMMSS`。

## 推荐习惯

每次准备更新时先运行：

```bash
npm run backup
```

每次准备发布前运行：

```bash
npm run check
```
