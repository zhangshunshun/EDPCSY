// Menu and Functionality Data
export const menuData = [
    {
        id: 'p3',
        title: '系统治理中心',
        icon: '⚙️',
        children: [
            {
                id: 't08',
                title: '用户管理',
                searchFields: [
                    { label: '名称', type: 'text', placeholder: '请输入' },
                    { label: '状态', type: 'select', options: ['全部', '启用', '禁用'], placeholder: '请选择' },
                    { label: '创建时间', type: 'date-range' }
                ],
                buttons: ['新增', '导入', '导出'],
                columns: ['账号', '英文名', '中文名', '邮箱', '用户类型', '组织', '状态', '操作'],
                data: [
                    { account: 'yum_12859889_01', enName: 'Shanghai', cnName: '上海旌佑', email: '', type: '厂商用户', org: '测试部门', status: '启用', actions: ['分配角色', '删除', '更多'] },
                    { account: 'zhangshun', enName: 'shun zhang', cnName: '张顺', email: 'zhangshun@...', type: '百胜内部用户', org: 'SSDP', status: '启用', actions: ['分配角色', '删除', '更多'] }
                ]
            },
            {
                id: 't09',
                title: '组织架构管理',
                listTitle: '组织列表',
                searchFields: [
                    { label: '组织名称', type: 'text', placeholder: '请输入' },
                    { label: '状态', type: 'select', options: ['全部', '开启', '禁用'], placeholder: '请选择' }
                ],
                toolbarButtons: ['新增', '展开全部', '折叠全部'],
                buttons: [],
                columns: ['组织名称', '负责人', '排序', '状态', '创建时间', '操作'],
                data: [
                    { id: 1, name: 'SSDP', manager: '未设置', order: 0, status: '开启', time: '2024-09-27 13:38:42', level: 0, expanded: true, actions: ['编辑', '删除'] },
                    { id: 2, name: '测试部门', manager: '未设置', order: 0, status: '开启', time: '2024-11-12 15:34:29', level: 1, parent: 1, expanded: true, actions: ['编辑', '删除'] },
                    { id: 3, name: '测试部门1', manager: '未设置', order: 0, status: '开启', time: '2024-11-12 15:34:29', level: 1, parent: 1, actions: ['编辑', '删除'] },
                    { id: 4, name: '测试部门2', manager: '未设置', order: 0, status: '开启', time: '2024-11-12 15:34:29', level: 1, parent: 1, actions: ['编辑', '删除'] },
                    { id: 5, name: '测试部门3', manager: '未设置', order: 0, status: '开启', time: '2025-04-15 15:03:03', level: 1, parent: 1, actions: ['编辑', '删除'] },
                    { id: 6, name: '测试部门4', manager: '未设置', order: 0, status: '开启', time: '2025-04-15 15:03:08', level: 1, parent: 1, actions: ['编辑', '删除'] },
                    { id: 7, name: '测试部门5', manager: '未设置', order: 0, status: '开启', time: '2025-04-15 15:03:12', level: 1, parent: 1, actions: ['编辑', '删除'] },
                    { id: 8, name: '上海商苑建筑装饰有限公司', manager: '未设置', order: 0, status: '开启', time: '2025-04-15 15:03:22', level: 1, parent: 1, actions: ['编辑', '删除'] },
                    { id: 9, name: '上海友年机电工程有限公司', manager: '未设置', order: 0, status: '开启', time: '2025-04-15 15:03:29', level: 1, parent: 1, actions: ['编辑', '删除'] }
                ]
            },
            {
                id: 't10',
                title: '角色管理',
                listTitle: '角色列表',
                searchFields: [
                    { label: '角色名称', type: 'text', placeholder: '请输入' },
                    { label: '角色标识', type: 'text', placeholder: '请输入' },
                    { label: '状态', type: 'select', options: ['全部', '开启', '禁用'], placeholder: '请选择' },
                    { label: '创建时间', type: 'date-range' }
                ],
                buttons: ['新增'],
                columns: ['角色编号', '角色名称', '角色标识', '角色类型', '显示顺序', '状态', '创建时间', '操作'],
                data: [
                    { id: 171, name: '移交管理员', key: 'transfer', type: '自定义', order: 0, status: '开启', time: '2025-07-04 17:41:32', actions: ['修改', '更多'] },
                    { id: 1, name: '超级管理员', key: 'super_admin', type: '内置', order: 1, status: '开启', time: '2021-01-05 17:03:48', actions: ['修改', '更多'] },
                    { id: 2, name: '普通角色', key: 'common', type: '内置', order: 2, status: '开启', time: '2021-01-05 17:03:48', actions: ['修改', '更多'] },
                    { id: 163, name: 'RSC标准管理专员', key: 'RSC_editor', type: '自定义', order: 3, status: '开启', time: '2025-02-26 14:35:30', actions: ['修改', '更多'] },
                    { id: 155, name: 'RSC标准一级审核人', key: 'RSC_approver 1', type: '自定义', order: 4, status: '开启', time: '2024-07-02 13:09:40', actions: ['修改', '更多'] },
                    { id: 153, name: '地方标准管理专员', key: 'VSSC_editor', type: '自定义', order: 5, status: '开启', time: '2024-07-02 13:04:41', actions: ['修改', '更多'] },
                    { id: 164, name: '地方标准一级审核人', key: 'VSSC_approver 1', type: '自定义', order: 6, status: '开启', time: '2025-03-18 14:55:30', actions: ['修改', '更多'] },
                    { id: 154, name: '第三方编辑人', key: 'external_editor', type: '自定义', order: 7, status: '开启', time: '2024-07-02 13:09:26', actions: ['修改', '更多'] },
                    { id: 165, name: '标准管理专员（属性配...', key: 'Attri_editor', type: '自定义', order: 8, status: '开启', time: '2025-03-18 14:56:14', actions: ['修改', '更多'] },
                    { id: 166, name: '热榜管理专员', key: 'Rec list_editor', type: '自定义', order: 9, status: '开启', time: '2025-03-18 14:56:35', actions: ['修改', '更多'] }
                ]
            },

            {
                id: 't12',
                title: '界面配置',
                listTitle: '界面配置列表',
                searchFields: [
                    { label: '菜单名称', type: 'text', placeholder: '请输入' },
                    { label: '状态', type: 'select', options: ['全部', '启用', '关闭'], placeholder: '请选择' }
                ],
                toolbarButtons: ['新增', '展开全部', '折叠全部', '刷新菜单缓存'],
                columns: ['菜单名称', '菜单类型', '图标', '排序', '权限标识', '组件路径', '状态', '操作'],
                data: [
                    { id: 1, name: '管理端', type: '按钮', icon: '', order: 0, permission: 'admin', path: '', status: '启用', actions: ['编辑', '删除'], level: 0, expanded: true },
                    { id: 2, name: '标准总表', type: '菜单', icon: 'list', order: 3, permission: 'standard:library:all', path: 'standardLibrary/index', status: '启用', actions: ['编辑', '删除'], level: 0, expanded: true },
                    { id: 21, name: '导出', type: '按钮', icon: '', order: 0, permission: 'standardLibrary:export', path: '', status: '启用', actions: ['编辑', '删除'], level: 1, parent: 2 },
                    { id: 22, name: '查询', type: '按钮', icon: '', order: 1, permission: 'standardLibrary:query', path: '', status: '启用', actions: ['编辑', '删除'], level: 1, parent: 2 },
                    { id: 3, name: '工作台', type: '目录', icon: 'home', order: 5, permission: '', path: '', status: '启用', actions: ['编辑', '删除'], level: 0, expanded: true },
                    { id: 4, name: '标准', type: '目录', icon: 'book', order: 6, permission: '', path: '', status: '启用', actions: ['编辑', '删除'], level: 0, expanded: true },
                    { id: 5, name: '系统管理', type: '目录', icon: 'setting', order: 10, permission: '', path: '', status: '启用', actions: ['编辑', '删除'], level: 0, expanded: true },
                    { id: 6, name: '基础设施', type: '目录', icon: 'desktop', order: 20, permission: '', path: '', status: '启用', actions: ['编辑', '删除'], level: 0, expanded: true },
                    { id: 7, name: '工作流程', type: '目录', icon: 'deployment-unit', order: 50, permission: '', path: '', status: '启用', actions: ['编辑', '删除'], level: 0, expanded: true },
                    { id: 8, name: '门户热榜查询', type: '按钮', icon: '', order: 51, permission: 'portal:hotList:query', path: '', status: '启用', actions: ['编辑', '删除'], level: 0 }
                ]
            },
            {
                id: 't13',
                title: '字典管理',
                layout: 'split',
                leftPanel: {
                    id: 't13_left',
                    listTitle: '字典分类列表',
                    searchFields: [
                        { label: '字典名称', type: 'text', placeholder: '请输入' },
                        { label: '状态', type: 'select', options: ['全部', '开启', '禁用'], placeholder: '请选择' }
                    ],
                    buttons: ['新增'],
                    columns: ['字典编号', '字典名称', '状态', '操作'],
                    data: [
                        { id: 657, name: '标准库类型', status: '开启', actions: ['编辑', '删除'] },
                        { id: 656, name: 'BPM标准流程已办...', status: '开启', actions: ['编辑', '删除'] },
                        { id: 655, name: 'RSC标准审核人枚举', status: '开启', actions: ['编辑', '删除'] },
                        { id: 654, name: '地方标准审核人枚举', status: '开启', actions: ['编辑', '删除'] },
                        { id: 653, name: '消息业务类型', status: '开启', actions: ['编辑', '删除'] },
                        { id: 652, name: '流程实例结果', status: '开启', actions: ['编辑', '删除'] },
                        { id: 651, name: 'BPM流程分类', status: '开启', actions: ['编辑', '删除'] },
                        { id: 649, name: '下载记录状态', status: '开启', actions: ['编辑', '删除'] },
                        { id: 648, name: '标准类型缩写', status: '开启', actions: ['编辑', '删除'] },
                        { id: 633, name: 'BPM 流程模型类型', status: '开启', actions: ['编辑', '删除'] }
                    ]
                },
                rightPanel: {
                    id: 't13_right',
                    listTitle: '字典数据列表',
                    searchFields: [
                        { label: '字典标签', type: 'text', placeholder: '请输入' },
                        { label: '状态', type: 'select', options: ['全部', '开启', '禁用'], placeholder: '请选择' }
                    ],
                    buttons: ['新增'],
                    columns: ['字典编码', '字典标签', '字典键值', '字典排序', '操作'],
                    data: [
                        { code: 1555, label: '厂商用户', val: '1', sort: 3, actions: ['编辑', '删除'] },
                        { code: 1554, label: '百胜内部用户', val: '0', sort: 2, actions: ['编辑', '删除'] },
                        { code: 61, label: '管理员', val: '2', sort: 1, actions: ['编辑', '删除'] },
                        { code: 1584, label: '用户个人配置', val: '2', sort: 2, actions: ['编辑', '删除'] },
                        { code: 1583, label: '用户组配置', val: '1', sort: 1, actions: ['编辑', '删除'] },
                        { code: 1202, label: '砍价订单', val: '3', sort: 3, actions: ['编辑', '删除'] },
                        { code: 1201, label: '拼团订单', val: '2', sort: 2, actions: ['编辑', '删除'] },
                        { code: 1200, label: '秒杀订单', val: '1', sort: 1, actions: ['编辑', '删除'] },
                        { code: 1199, label: '普通订单', val: '0', sort: 0, actions: ['编辑', '删除'] },
                        { code: 1207, label: '已取消', val: '40', sort: 40, actions: ['编辑', '删除'] }
                    ]
                }
            },
            {
                id: 't14',
                title: '配置管理',
                listTitle: '配置中心列表',
                searchFields: [
                    { label: '参数名称', type: 'text', placeholder: '请输入' },
                    { label: '参数键名', type: 'text', placeholder: '请输入' },
                    { label: '系统内置', type: 'select', options: ['请选择', '系统内置', '自定义'], placeholder: '请选择' },
                    { label: '创建时间', type: 'date-range' }
                ],
                buttons: ['新增'],
                columns: ['参数主键', '参数分类', '参数名称', '参数键名', '参数键值', '系统内置', '是否可见', '备注', '创建时间', '操作'],
                data: [
                    { id: 2, category: 'biz', name: '用户管理-初始密码', keyName: 'sys.user.init-password', keyValue: '123456', builtin: '系统内置', visible: '否', remark: '初始化密码 123456', time: '2023-01-01 00:00:00', actions: ['编辑', '删除'] },
                    { id: 7, category: 'url', name: 'MySQL 监控', keyName: 'url.druid', keyValue: '', builtin: '自定义', visible: '是', remark: '', time: '2023-01-01 00:00:00', actions: ['编辑', '删除'] },
                    { id: 8, category: 'url', name: 'SkyWalking...', keyName: 'url.skywalking', keyValue: '', builtin: '自定义', visible: '是', remark: '', time: '2023-01-01 00:00:00', actions: ['编辑', '删除'] },
                    { id: 9, category: 'url', name: 'Spring Boot...', keyName: 'url.spring-boot-admin', keyValue: '', builtin: '自定义', visible: '是', remark: '', time: '2023-01-01 00:00:00', actions: ['编辑', '删除'] },
                    { id: 10, category: 'url', name: 'Swagger 接口', keyName: 'url.swagger', keyValue: '', builtin: '自定义', visible: '是', remark: '', time: '2023-01-01 00:00:00', actions: ['编辑', '删除'] },
                    { id: 11, category: 'ui', name: '腾讯地图 key', keyName: 'tencent.lbs.key', keyValue: 'TVDBZ-TDILD-...', builtin: '自定义', visible: '是', remark: '腾讯地图 key', time: '2023-01-01 00:00:00', actions: ['编辑', '删除'] },
                    { id: 12, category: 'test2', name: 'test3', keyName: 'test4', keyValue: 'test5', builtin: '自定义', visible: '是', remark: 'test6', time: '2023-01-01 00:00:00', actions: ['编辑', '删除'] },
                    { id: 13, category: '共享文档', name: '发布库', keyName: 'pubLib', keyValue: 'gns://1CFBC90...', builtin: '系统内置', visible: '是', remark: '发布库', time: '2024-01-01 00:00:00', actions: ['编辑', '删除'] },
                    { id: 14, category: '共享文档', name: '作废库', keyName: 'cancellationLib', keyValue: 'gns://C6F1FE3...', builtin: '系统内置', visible: '是', remark: '作废库', time: '2024-01-01 00:00:00', actions: ['编辑', '删除'] },
                    { id: 15, category: '标准编目', name: '基本信息', keyName: 'templateKey', keyValue: 'CLTE_1723540...', builtin: '自定义', visible: '是', remark: 'as基本属性key', time: '2024-01-01 00:00:00', actions: ['编辑', '删除'] }
                ]
            },
            {
                id: 't15',
                title: '定时任务',
                searchFields: [
                    { label: '任务描述', type: 'text', placeholder: '请输入' },
                    { label: '负责人', type: 'text', placeholder: '请输入' }
                ],
                buttons: ['进入调度中心'],
                columns: ['任务ID', '任务描述', '运行模式', 'Cron', '负责人', '状态', '操作'],
                data: [
                    { id: 1, desc: '年度统计报表', mode: 'BEAN', cron: '0 0 0 1 1 ?', author: '张三', status: 'RUNNING', actions: ['执行一次', '查询日志', '注册节点'] },
                    { id: 2, desc: '日志清理', mode: 'BEAN', cron: '0 0 0 * * ?', author: 'admin', status: 'STOP', actions: ['执行一次', '查询日志', '注册节点'] }
                ]
            },
            {
                id: 't32',
                title: '用户组管理',
                listTitle: '用户组列表',
                searchFields: [
                    { label: '群组名', type: 'text', placeholder: '请输入' }
                ],
                buttons: ['新增'],
                columns: ['序号', '群组名', '群组邮箱', '操作'],
                data: [
                    { id: 1, name: 'BP', email: '', actions: ['修改', '成员管理', '删除'] },
                    { id: 2, name: '关联标准组', email: '223234qq.com', actions: ['修改', '成员管理', '删除'] },
                    { id: 3, name: 'test4', email: '', actions: ['修改', '成员管理', '删除'] },
                    { id: 4, name: 'test权限测试用户组zhao8', email: '223234qq.com', actions: ['修改', '成员管理', '删除'] },
                    { id: 5, name: '用户组导入', email: '', actions: ['修改', '成员管理', '删除'] },
                    { id: 6, name: '测试用户组', email: 'test3@sda.com', actions: ['修改', '成员管理', '删除'] }
                ]
            },
            {
                id: 't33',
                title: '会话管理',
                searchFields: [
                    { label: '用户', type: 'text', placeholder: '请输入' }
                ],
                buttons: [],
                columns: ['用户', '登录IP', '过期时间'],
                data: [
                    { user: 'admin', ip: '192.168.1.10', loginTime: '2026-02-09 10:00' }
                ]
            },
            {
                id: 't34',
                title: 'API管理',
                searchFields: [
                    { label: 'API名称', type: 'text', placeholder: '请输入' }
                ],
                buttons: ['进入Knife4j文档', '下载文档'],
                columns: ['方法', 'API路径', '描述', '分组', '版本', '操作'],
                data: [
                    { method: 'GET', path: '/api/user/get', desc: '获取用户信息', group: '用户模块', version: 'v1.0', actions: ['调试'] },
                    { method: 'POST', path: '/api/user/create', desc: '创建新用户', group: '用户模块', version: 'v1.0', actions: ['调试'] },
                    { method: 'PUT', path: '/api/user/update', desc: '更新用户信息', group: '用户模块', version: 'v1.0', actions: ['调试'] },
                    { method: 'DELETE', path: '/api/user/delete', desc: '删除用户', group: '用户模块', version: 'v1.0', actions: ['调试'] }
                ]
            }
        ]
    },
    {
        id: 'p8',
        title: '审计日志',
        icon: '🛡️',
        children: [
            {
                id: 't35',
                title: '操作日志',
                listTitle: '操作日志列表',
                total: 433,
                searchFields: [
                    { label: '操作人', type: 'select', options: ['全部', '张顺', '系统管理员'], placeholder: '请选择' },
                    { label: '操作模块', type: 'text', placeholder: '请输入' },
                    { label: '操作名', type: 'text', placeholder: '请输入' },
                    { label: '操作内容', type: 'text', placeholder: '请输入' },
                    { label: '操作时间', type: 'date-range' },
                    { label: '业务编号', type: 'text', placeholder: '请输入' }
                ],
                buttons: [],
                columns: ['日志编号', '操作人', '操作模块', '操作名', '操作内容', '操作时间', '业务编号', '操作IP', '操作'],
                data: [
                    { logId: '9637', operator: '张顺', module: 'STANDARD 标准', opName: '创建标准', content: '创建了标准【T2601-相关标准-大门设计】', time: '2026-01-22 14:04:57', bizId: '1211', ip: '0:0:0:0:0:0:0:1', actions: ['详情'] },
                    { logId: '9636', operator: '张顺', module: 'STANDARD 标准', opName: '创建标准', content: '创建了标准【T2601-相关标准03-小镇WOW】', time: '2026-01-22 13:47:13', bizId: '1206', ip: '0:0:0:0:0:0:0:1', actions: ['详情'] },
                    { logId: '9635', operator: '张顺', module: 'STANDARD 标准', opName: '创建标准', content: '创建了标准【T2601-相关标准02-PH门头照】', time: '2026-01-22 13:44:34', bizId: '1205', ip: '0:0:0:0:0:0:0:1', actions: ['详情'] },
                    { logId: '9634', operator: '张顺', module: 'STANDARD 标准', opName: '创建标准', content: '创建了标准【T2601-相关标准01-设计指引】', time: '2026-01-22 10:42:46', bizId: '1202', ip: '0:0:0:0:0:0:0:1', actions: ['详情'] },
                    { logId: '9633', operator: '张顺', module: 'STANDARD 标准', opName: '创建标准', content: '创建了标准【CQH third 标准】', time: '2026-01-22 10:29:10', bizId: '1201', ip: '0:0:0:0:0:0:0:1', actions: ['详情'] },
                    { logId: '9632', operator: '张顺', module: 'STANDARD 标准', opName: '创建标准', content: '创建了标准【CQH second 标准】', time: '2026-01-22 10:27:02', bizId: '1200', ip: '0:0:0:0:0:0:0:1', actions: ['详情'] },
                    { logId: '9631', operator: '张顺', module: 'STANDARD 标准', opName: '创建标准', content: '创建了标准【CQH main 标准】', time: '2026-01-22 10:26:26', bizId: '1199', ip: '0:0:0:0:0:0:0:1', actions: ['详情'] },
                    { logId: '9630', operator: '张顺', module: 'STANDARD 标准', opName: '创建标准', content: '创建了标准【CQH标准2】', time: '2026-01-21 18:15:19', bizId: '1192', ip: '0:0:0:0:0:0:0:1', actions: ['详情'] },
                    { logId: '9629', operator: '张顺', module: 'STANDARD 标准', opName: '创建标准', content: '创建了标准【CQH标准1】', time: '2026-01-21 18:14:45', bizId: '1191', ip: '0:0:0:0:0:0:0:1', actions: ['详情'] }
                ]
            },
            {
                id: 't36',
                title: '登录日志',
                listTitle: '登录日志列表',
                searchFields: [
                    { label: '登录地址', type: 'text', placeholder: '请输入' },
                    { label: '用户名称', type: 'text', placeholder: '请输入' },
                    { label: '结果', type: 'select', options: ['全部', '成功', '失败'], placeholder: '请选择' },
                    { label: '登录时间', type: 'date-range' }
                ],
                buttons: [],
                columns: ['访问编号', '日志类型', '用户名称', '登录地址', 'userAgent', '结果', '登录日期'],
                data: [
                    { visitId: '5698', type: '账号登录', user: 'zhangshun', ip: '0:0:0:0:0:0:0:1', ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...', result: '成功', time: '2026-02-09 14:01:43' },
                    { visitId: '5697', type: '账号登录', user: 'Exw6824', ip: '0:0:0:0:0:0:0:1', ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...', result: '成功', time: '2026-01-22 10:57:22' },
                    { visitId: '5696', type: '账号登录', user: 'Exw6824', ip: '0:0:0:0:0:0:0:1', ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...', result: '成功', time: '2026-01-22 10:46:44' },
                    { visitId: '5695', type: '主动登出', user: 'frank', ip: '0:0:0:0:0:0:0:1', ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...', result: '成功', time: '2026-01-22 10:46:15' },
                    { visitId: '5694', type: '账号登录', user: 'frank', ip: '0:0:0:0:0:0:0:1', ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...', result: '成功', time: '2026-01-22 10:37:27' }
                ]
            }
        ]
    },
    {
        id: 'p4',
        title: '文档核心功能',
        icon: '📁',
        children: [
            {
                id: 't17',
                title: '文件管理',
                layout: 'file-manager',
                folders: [
                    { id: 1, name: '项目A', children: [
                        { id: 11, name: '设计图纸' },
                        { id: 12, name: '说明文档' }
                    ]},
                    { id: 2, name: '项目B', children: [
                        { id: 21, name: '方案' },
                        { id: 22, name: '归档' }
                    ]},
                    { id: 3, name: '公共资源' }
                ],
                files: [
                    { id: 'f1', name: '总平图.dwg', time: '2026-02-06 10:21', folderId: 11, logs: [
                        { action: '上传', user: '张工', time: '2026-02-06 10:21' },
                        { action: '预览', user: '李工', time: '2026-02-06 11:05' },
                        { action: '下载', user: '王工', time: '2026-02-07 09:10' }
                    ] },
                    { id: 'f2', name: '立面图.dwg', time: '2026-02-06 10:45', folderId: 11, logs: [
                        { action: '上传', user: '张工', time: '2026-02-06 10:45' },
                        { action: '预览', user: '李工', time: '2026-02-06 12:00' }
                    ] },
                    { id: 'f3', name: '设计说明.docx', time: '2026-02-06 11:00', folderId: 12, logs: [
                        { action: '上传', user: '王工', time: '2026-02-06 11:00' }
                    ] },
                    { id: 'f4', name: '项目方案.pdf', time: '2026-02-07 09:12', folderId: 21, logs: [
                        { action: '上传', user: '赵工', time: '2026-02-07 09:12' },
                        { action: '预览', user: '李工', time: '2026-02-07 10:00' }
                    ] },
                    { id: 'f5', name: '竣工图.dwg', time: '2026-02-08 15:33', folderId: 22, logs: [
                        { action: '上传', user: '张工', time: '2026-02-08 15:33' }
                    ] },
                    { id: 'f6', name: '手册.pdf', time: '2026-02-08 16:02', folderId: 3, logs: [
                        { action: '上传', user: '王工', time: '2026-02-08 16:02' }
                    ] },
                    { id: 'f7', name: '示例1.dwg', time: '2026-02-09 08:00', folderId: 11 },
                    { id: 'f8', name: '示例2.dwg', time: '2026-02-09 08:05', folderId: 11 },
                    { id: 'f9', name: '示例3.dwg', time: '2026-02-09 08:10', folderId: 11 },
                    { id: 'f10', name: '示例4.dwg', time: '2026-02-09 08:15', folderId: 11 },
                    { id: 'f11', name: '示例5.dwg', time: '2026-02-09 08:20', folderId: 11 },
                    { id: 'f12', name: '示例6.dwg', time: '2026-02-09 08:25', folderId: 11 }
                ]
            },
            {
                id: 't19',
                title: '文档轨迹',
                buttons: ['导出'],
                columns: ['文件名', '操作', '操作人', '时间'],
                data: [
                    { name: '总平图.dwg', action: '下载', user: '李工', time: '2026-02-07' }
                ]
            },
            
        ]
    },
    {
        id: 'p5',
        title: '系统配置',
        icon: '🌐',
        children: [
            {
                id: 't24_h5',
                title: '存储配置',
                layout: 'storage-config',
                buttons: ['检测'],
                columns: ['浏览器', '支持度'],
                data: [
                    { browser: 'Chrome 120', support: '完美' }
                ]
            },
            {
                id: 't26',
                title: '水印配置',
                layout: 'watermark-config',
                config: {
                    username: { enabled: true, fontSize: '18', color: '#999999', alpha: true },
                    custom: { enabled: false, text: '', fontSize: '32', color: '#ff0000', alpha: true },
                    time: { enabled: true, fontSize: '18', color: '#999999', alpha: true },
                    rotation: 30,
                    layout: 'tiled',
                    spacing: { x: 40, y: 25 }
                }
            }
        ]
    },
    {
        id: 'p6',
        title: '系统管理',
        icon: '🖥️',
        children: [
            {
                id: 't27',
                title: '应用管理',
                buttons: ['创建新应用'],
                columns: ['应用名称', '应用ID', '安全秘钥', '操作'],
                data: [
                    { appName: '海舟2025', appId: 'ca98a2a6e2c2e9a68113fed264ebe336', secret: '—', actions: ['白名单', '删除'] },
                    { appName: 'haizhou2024', appId: '7ff82d21a3d591278ae2e451d76ec868', secret: '—', actions: ['白名单', '删除'] }
                ]
            },
            {
                id: 't28',
                title: 'License管理',
                layout: 'license-info',
                info: [
                    { label: '许可证上传', type: 'button', value: '导入证书', action: 'uploadLicense' },
                    { label: '客户信息', value: '沪东中华造船（集团）有限公司(测试)' },
                    { label: '产品名称', value: '仲尼万用文件浏览工具' },
                    { label: '版本号', value: 'Version 1.6.3' },
                    { label: '许可IP地址', value: '192.168.52.58' },
                    { label: '许可MAC地址', value: '00-0C-29-4A-DA-93' },
                    { label: '许可CPU序列号', value: '1F8BFBFF000606A6' },
                    { label: '许可主板序列号', value: 'None' },
                    { label: '许可生效时间', value: '2024-01-15 00:00:00' },
                    { label: '许可失效时间', value: '无失效时间' },
                    { label: '许可用户数', value: '60' },
                    { label: '描述信息', value: '永久有效' }
                ]
            }
        ]
    }
];
