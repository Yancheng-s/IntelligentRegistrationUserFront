# IntelligentRegistrationUserFront

## 介绍
智能挂号项目用户端网页代码，旨在为用户提供便捷的在线挂号服务。

## 软件架构
项目基于 Vue.js 框架开发，采用模块化设计，包含以下主要模块：
- 用户登录与身份验证
- 医院与科室信息展示
- 医生信息查询与排班展示
- 在线挂号与预约功能
- 用户个人信息管理
- 消息通知与订单详情

## 安装教程
1. 确保已安装 Node.js 和 npm。
2. 克隆项目到本地：`git clone https://gitee.com/garveyer/intelligent-registration-user-front`
3. 进入项目目录：`cd intelligent-registration-user-front`
4. 安装依赖：`npm install`
5. 启动开发服务器：`npm run serve`

## 使用说明
1. **登录**：使用手机号或账号登录系统。
2. **选择医院与科室**：在首页选择目标医院及科室。
3. **查看医生信息**：点击医生头像或姓名查看详细信息与排班情况。
4. **挂号预约**：选择合适的时间段进行挂号预约。
5. **订单管理**：在“我的”页面查看挂号订单与历史记录。
6. **消息通知**：系统将推送挂号成功或变动的通知。

## 参与贡献
1. Fork 本仓库。
2. 创建新分支 `feat/xxx` 或 `fix/xxx`。
3. 编写代码并提交更改。
4. 提交 Pull Request，等待审核与合并。

## 特技
1. 使用 `Readme_zh.md` 或 `Readme_en.md` 支持多语言文档。
2. 项目使用 Vue.js + Element UI 开发，界面简洁友好。
3. 支持响应式布局，适配移动端与桌面端。
4. 使用模块化开发，便于维护与扩展。
5. 集成 Axios 进行 API 请求管理。
6. 使用 Vuex 进行状态管理，提升用户体验。

## 目录结构说明
- `api/`: 存放接口请求模块，如登录、挂号、医生信息等。
- `docs/assets/`: 存放文档中使用的图片资源。
- `node_modules/`: 项目依赖库。
- `index.html`: 项目入口 HTML 文件。
- `main.js`: Vue 项目的主入口文件。
- `App.vue`: 根组件，包含全局布局与路由配置。

## 技术栈
- Vue.js
- Element UI
- Axios
- Vuex
- Vue Router

## 许可证
本项目遵循 MIT 许可证，请在使用时保留原始版权信息。