// Menu and Functionality Data
const menuData = [
    {
        id: 'p3',
        title: '基础功能开发',
        icon: '⚙️',
        children: [
            {
                id: 't08',
                title: '用户管理模块',
                searchFields: [
                    { label: '名称', type: 'text', placeholder: '请输入' },
                    { label: '状态', type: 'select', options: ['全部', '启用', '禁用'], placeholder: '请选择' },
                    { label: '创建时间', type: 'date-range' }
                ],
                buttons: ['新增', '导入', '导出', '移交'],
                columns: ['账号', '英文名', '中文名', '邮箱', '用户类型', '组织', '操作'],
                data: [
                    { account: 'yum_12859889_01', enName: 'Shanghai', cnName: '上海旌佑', email: '', type: '厂商用户', org: '测试部门', actions: ['分配角色', '删除', '更多'] },
                    { account: 'Exw6824', enName: 'Egnis.Wang', cnName: '王文君', email: 'Egnis.Wang@...', type: '百胜内部用户', org: 'SSDP', actions: ['分配角色', '删除', '更多'] },
                    { account: 'jcl4773', enName: 'Jenny.Li', cnName: '李征', email: 'Jenny.Li-RSC...', type: '百胜内部用户', org: 'SSDP', actions: ['分配角色', '删除', '更多'] },
                    { account: 'zhangshun', enName: 'shun zhang', cnName: '张顺', email: 'zhangshun@...', type: '百胜内部用户', org: 'SSDP', actions: ['分配角色', '删除', '更多'] }
                ]
            },
            {
                id: 't09',
                title: '部门管理模块',
                searchFields: [
                    { label: '部门名称', type: 'text', placeholder: '请输入' }
                ],
                buttons: ['新增', '编辑', '删除', '排序'],
                columns: ['ID', '部门名称', '上级部门', '排序', '操作'],
                data: [
                    { id: 1, name: 'IT部', parent: '-', order: 1, actions: ['编辑', '删除'] },
                    { id: 2, name: '研发部', parent: 'IT部', order: 1, actions: ['编辑', '删除'] }
                ]
            },
            {
                id: 't10',
                title: '角色权限模块',
                searchFields: [
                    { label: '角色名称', type: 'text', placeholder: '请输入' }
                ],
                buttons: ['新增', '编辑', '删除', '权限配置'],
                columns: ['ID', '角色名称', '角色编码', '描述', '操作'],
                data: [
                    { id: 1, name: '超级管理员', code: 'SUPER_ADMIN', desc: '全权限', actions: ['编辑', '权限'] },
                    { id: 2, name: '普通用户', code: 'USER', desc: '基本权限', actions: ['编辑', '权限'] }
                ]
            },
            {
                id: 't11',
                title: '登录认证模块',
                searchFields: [
                    { label: '用户', type: 'text', placeholder: '请输入' },
                    { label: '时间', type: 'date-range' }
                ],
                buttons: ['查看日志', '强制下线'],
                columns: ['用户', '登录IP', '登录时间', '状态', '操作'],
                data: [
                    { user: 'admin', ip: '192.168.1.10', time: '2026-02-07 09:00', status: '成功', actions: ['详情'] }
                ]
            },
            {
                id: 't12',
                title: '菜单管理模块',
                searchFields: [
                    { label: '菜单名称', type: 'text', placeholder: '请输入' }
                ],
                buttons: ['新增', '编辑', '删除'],
                columns: ['ID', '菜单名称', '路径', '排序', '操作'],
                data: [
                    { id: 1, name: '系统管理', path: '/system', order: 1, actions: ['编辑', '删除'] }
                ]
            },
            {
                id: 't13',
                title: '数据字典模块',
                searchFields: [
                    { label: '字典名称', type: 'text', placeholder: '请输入' }
                ],
                buttons: ['新增类型', '新增项'],
                columns: ['字典名称', '编码', '项值', '操作'],
                data: [
                    { name: '性别', code: 'GENDER', val: '男,女', actions: ['编辑', '删除'] }
                ]
            },
            {
                id: 't14',
                title: '系统参数模块',
                searchFields: [
                    { label: '参数名', type: 'text', placeholder: '请输入' }
                ],
                buttons: ['保存设置'],
                columns: ['参数名', '参数值', '说明', '操作'],
                data: [
                    { name: '系统名称', val: 'EDPCS', desc: '显示名称', actions: ['编辑'] }
                ]
            },
            {
                id: 't15',
                title: '定时任务模块',
                searchFields: [
                    { label: '任务名', type: 'text', placeholder: '请输入' }
                ],
                buttons: ['新增', '立即执行'],
                columns: ['任务名', 'Cron', '状态', '操作'],
                data: [
                    { name: '清理日志', cron: '0 0 1 * * ?', status: '正常', actions: ['编辑', '日志'] }
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
                id: 't16',
                title: '目录管理',
                buttons: ['新建文件夹', '重命名', '删除'],
                columns: ['目录名', '路径', '创建人'],
                data: [
                    { name: '设计图纸', path: '/Design', user: '张工' }
                ]
            },
            {
                id: 't17',
                title: '文件管理',
                buttons: ['上传', '下载', '搜索'],
                columns: ['文件名', '大小', '类型', '上传时间'],
                data: [
                    { name: '总平图.dwg', size: '5MB', type: 'DWG', time: '2026-02-06' }
                ]
            },
            {
                id: 't18',
                title: '回收站',
                buttons: ['恢复', '清空'],
                columns: ['文件名', '原路径', '删除时间'],
                data: [
                    { name: '草稿.doc', path: '/Temp', time: '2026-02-05' }
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
            {
                id: 't20',
                title: 'Brava集成',
                buttons: ['测试预览'],
                columns: ['文件', '预览状态'],
                data: [
                    { file: 'test.dwg', status: 'Ready' }
                ]
            },
            {
                id: 't21',
                title: '多格式预览',
                buttons: ['全屏预览'],
                columns: ['文件', '格式', '转换状态'],
                data: [
                    { file: 'manual.pdf', fmt: 'PDF', status: 'Success' }
                ]
            },
            {
                id: 't22',
                title: '图纸对比',
                buttons: ['选择底图', '选择比较图', '开始对比'],
                columns: ['任务号', '底图', '比较图', '差异数'],
                data: [
                    { id: 'T001', base: 'v1.dwg', comp: 'v2.dwg', diff: 12 }
                ]
            },
            {
                id: 't23',
                title: '动态水印',
                buttons: ['配置'],
                columns: ['水印内容', '透明度', '生效范围'],
                data: [
                    { content: 'Confidential', alpha: '0.3', scope: 'All' }
                ]
            }
        ]
    },
    {
        id: 'p5',
        title: '浏览器适配',
        icon: '🌐',
        children: [
            {
                id: 't24_h5',
                title: 'HTML5适配',
                buttons: ['检测'],
                columns: ['浏览器', '支持度'],
                data: [
                    { browser: 'Chrome 120', support: '完美' }
                ]
            },
            {
                id: 't25',
                title: 'ActiveX适配',
                buttons: ['安装插件'],
                columns: ['浏览器', '插件状态'],
                data: [
                    { browser: 'IE11', status: '已安装' }
                ]
            },
            {
                id: 't26',
                title: '自动识别',
                buttons: ['测试识别'],
                columns: ['UserAgent', '识别结果'],
                data: [
                    { ua: 'Mozilla/5.0...', res: 'Chrome' }
                ]
            }
        ]
    },
    {
        id: 'p6',
        title: '安全与License',
        icon: '🛡️',
        children: [
            {
                id: 't27',
                title: '安全管理',
                buttons: ['添加白名单'],
                columns: ['策略', '值', '状态'],
                data: [
                    { policy: 'IP白名单', val: '10.0.0.*', status: '生效' }
                ]
            },
            {
                id: 't28',
                title: 'License管理',
                buttons: ['上传License'],
                columns: ['授权模块', '过期时间'],
                data: [
                    { module: 'Core', expire: '2026-12-31' }
                ]
            },
            {
                id: 't29',
                title: '运营管理',
                buttons: ['查看报表'],
                columns: ['指标', '数值'],
                data: [
                    { metric: '总文件数', val: 1024 }
                ]
            }
        ]
    },
    {
        id: 'p7',
        title: '系统集成',
        icon: '🔗',
        children: [
            {
                id: 't30',
                title: 'API管理',
                buttons: ['生成Token'],
                columns: ['应用', 'API Key', '状态'],
                data: [
                    { app: 'ERP', key: '******', status: 'Active' }
                ]
            },
            {
                id: 't31',
                title: '接口开发',
                buttons: ['接口测试'],
                columns: ['接口名', '方法', '状态'],
                data: [
                    { name: '/api/user/add', method: 'POST', status: 'OK' }
                ]
            }
        ]
    }
];
