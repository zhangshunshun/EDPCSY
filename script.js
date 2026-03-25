import { menuData } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.getElementById('menu-container');
    const breadcrumb = document.getElementById('breadcrumb');
    const moduleContent = document.getElementById('module-content');
    const welcomeScreen = document.querySelector('.welcome-screen');

    // Global Close Handler for Popups
    document.addEventListener('click', (e) => {
        // Close Dropdowns
        const dropdowns = document.querySelectorAll('.dropdown-menu');
        dropdowns.forEach(d => d.remove());
        
        // Close Popconfirm if clicking outside
        if (!e.target.closest('.popconfirm') && !e.target.closest('.action-link')) {
            const popconfirms = document.querySelectorAll('.popconfirm');
            popconfirms.forEach(p => p.remove());
        }
    });

    // Render Menu
    function renderMenu() {
        const data = menuData || [];
        data.forEach(menu => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            
            const title = document.createElement('div');
            title.className = 'menu-title';
            // Wrap text in span to help flex layout if needed, though flex-start should work fine with text node.
            // But to be safe and consistent:
            title.innerHTML = `<span class="icon">${menu.icon}</span><span>${menu.title}</span>`;
            title.onclick = () => toggleSubmenu(submenu);
            
            const submenu = document.createElement('div');
            submenu.className = 'submenu';
            
            if (menu.children) {
                menu.children.forEach(child => {
                    const subItem = document.createElement('div');
                    subItem.className = 'submenu-item';
                    subItem.textContent = child.title;
                    subItem.onclick = (e) => {
                        e.stopPropagation();
                        activateMenu(subItem, menu, child);
                    };
                    submenu.appendChild(subItem);
                });
            }

            menuItem.appendChild(title);
            menuItem.appendChild(submenu);
            menuContainer.appendChild(menuItem);
        });
    }

    function toggleSubmenu(submenu) {
        submenu.classList.toggle('open');
    }

    function activateMenu(element, parentMenu, childMenu) {
        // Remove active class from all items
        document.querySelectorAll('.submenu-item').forEach(el => el.classList.remove('active'));
        element.classList.add('active');

        // Update Breadcrumb
        breadcrumb.innerHTML = `${parentMenu.title} <span style="margin:0 5px">/</span> <span style="font-weight:bold">${childMenu.title}</span>`;

        // Show Content
        if (welcomeScreen) welcomeScreen.style.display = 'none';
        moduleContent.style.display = 'block';

        renderModule(childMenu);
    }

    // Tree Helpers
    function isRowVisible(row, allRows) {
        if (!row.parent) return true; // Root node
        const parent = allRows.find(r => r.id === row.parent);
        if (!parent) return true; // Orphan
        return isRowVisible(parent, allRows) && parent.expanded;
    }

    function toggleTreeRow(moduleData, row) {
        row.expanded = !row.expanded;
        renderModule(moduleData);
    }

    function expandAllTree(moduleData) {
        if (moduleData.data) {
            moduleData.data.forEach(r => r.expanded = true);
            renderModule(moduleData);
        }
    }

    function collapseAllTree(moduleData) {
        if (moduleData.data) {
            moduleData.data.forEach(r => r.expanded = false);
            renderModule(moduleData);
        }
    }

    function renderSearchPanel(container, moduleData) {
        if (!moduleData.searchFields) return;

        const searchPanel = document.createElement('div');
        searchPanel.className = 'search-panel';
        
        moduleData.searchFields.forEach(field => {
            const item = document.createElement('div');
            item.className = 'search-item';
            
            const label = document.createElement('label');
            label.className = 'search-label';
            label.textContent = field.label;
            item.appendChild(label);

            if (field.type === 'text') {
                const input = document.createElement('input');
                input.className = 'search-input';
                input.type = 'text';
                input.placeholder = field.placeholder || '';
                item.appendChild(input);
            } else if (field.type === 'select') {
                const select = document.createElement('select');
                select.className = 'search-input'; // Reuse style
                (field.options || []).forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt;
                    option.textContent = opt;
                    select.appendChild(option);
                });
                item.appendChild(select);
            } else if (field.type === 'date-range') {
                const input1 = document.createElement('input');
                input1.className = 'search-input';
                input1.style.width = '120px';
                input1.placeholder = '开始日期';
                input1.onfocus = (e) => e.target.type = 'date';
                input1.onblur = (e) => e.target.type = 'text';
                
                const span = document.createElement('span');
                span.textContent = '→';
                span.style.margin = '0 8px';
                span.style.color = '#999';

                const input2 = document.createElement('input');
                input2.className = 'search-input';
                input2.style.width = '120px';
                input2.placeholder = '结束日期';
                input2.onfocus = (e) => e.target.type = 'date';
                input2.onblur = (e) => e.target.type = 'text';

                item.appendChild(input1);
                item.appendChild(span);
                item.appendChild(input2);
            }

            searchPanel.appendChild(item);
        });

        // Search Buttons
        const btnGroup = document.createElement('div');
        btnGroup.className = 'search-actions';
        
        const btnReset = document.createElement('button');
        btnReset.className = 'btn';
        btnReset.textContent = '重置';
        btnReset.style.marginRight = '8px';
        
        const btnSearch = document.createElement('button');
        btnSearch.className = 'btn btn-primary';
        btnSearch.textContent = '查询';

        btnGroup.appendChild(btnReset);
        btnGroup.appendChild(btnSearch);

        // Add "Collapse" button for specific modules if needed
        if (moduleData.title === '操作审计' || moduleData.title === '角色权限管理' || moduleData.title === '组织架构管理' || moduleData.title === '系统参数配置') {
            const btnCollapse = document.createElement('a');
            btnCollapse.href = 'javascript:void(0)';
            btnCollapse.textContent = '收起';
            btnCollapse.style.marginLeft = '16px';
            btnCollapse.style.color = '#1890ff';
            btnCollapse.style.fontSize = '14px';
            btnCollapse.style.textDecoration = 'none';
            
            // Add arrow icon
            const arrow = document.createElement('span');
            arrow.textContent = ' ∧';
            btnCollapse.appendChild(arrow);
            
            btnGroup.appendChild(btnCollapse);
        }

        searchPanel.appendChild(btnGroup);
        container.appendChild(searchPanel);
    }

    function renderContentPanel(container, moduleData) {
        // 2. Content Panel (Toolbar + Table)
        const contentPanel = document.createElement('div');
        contentPanel.className = 'content-panel';

        // Toolbar Header
        const toolbarHeader = document.createElement('div');
        toolbarHeader.className = 'toolbar';

        const title = document.createElement('div');
        title.className = 'toolbar-title';
        title.textContent = moduleData.listTitle || (moduleData.title ? moduleData.title + '列表' : '数据列表');
        toolbarHeader.appendChild(title);

        const actions = document.createElement('div');
        actions.className = 'toolbar-actions';
        
        // Custom Toolbar Buttons (Expand/Collapse All)
        if (moduleData.toolbarButtons) {
            moduleData.toolbarButtons.forEach(btnText => {
                const btn = document.createElement('button');
                btn.className = 'btn';
                btn.textContent = btnText;
                btn.style.marginRight = '8px';
                
                if (btnText === '展开全部') {
                    btn.onclick = () => expandAllTree(moduleData);
                } else if (btnText === '折叠全部') {
                    btn.onclick = () => collapseAllTree(moduleData);
                } else if (btnText === '新增') {
                    if (moduleData.id === 't12') {
                        btn.onclick = () => openMenuModal('add');
                    } else if (moduleData.id === 't09') {
                        btn.onclick = () => alert('点击了新增组织'); // Placeholder or specific modal for Org
                    } else if (moduleData.id === 't13_left' || moduleData.id === 't13_right') {
                        // Dict logic
                    } else {
                        btn.onclick = () => openRoleModal('add');
                    }
                }
                
                actions.appendChild(btn);
            });
        }

        if (moduleData.buttons) {
            moduleData.buttons.forEach(btnText => {
                const btn = document.createElement('button');
                btn.className = 'btn btn-primary';
                btn.innerHTML = btnText;
                
                if (btnText === '新增') {
                    if (moduleData.id === 't12') {
                        btn.onclick = () => openMenuModal('add');
                    } else if (moduleData.id === 't13_left') {
                        btn.onclick = () => openDictModal('add');
                    } else if (moduleData.id === 't13_right') {
                         btn.onclick = () => openDictDataModal('add');
                    } else if (moduleData.id === 't14') {
                        btn.onclick = () => openConfigModal('add');
                    } else {
                        btn.onclick = () => openRoleModal('add');
                    }
                } else if (btnText === '创建新应用') {
                    btn.onclick = () => openCreateAppModal();
                } else if (btnText === '进入调度中心') {
                    // Simulate auto-login by passing credentials or just opening the page
                    // In a real scenario, this might involve a fetch to get a token or a form post
                    btn.onclick = () => {
                         // Example: window.open('http://xxl-job-admin-url/toLogin?username=admin&password=...', '_blank');
                         // Since we don't have a real backend, we just open the standard URL
                         window.open('http://localhost:8080/xxl-job-admin', '_blank');
                     };
                 } else if (btnText === '进入Knife4j文档') {
                    btn.onclick = () => {
                         // Simulate opening Knife4j docs
                         window.open('doc.html', '_blank');
                    };
                 } else if (btnText === '下载文档') {
                    btn.onclick = () => {
                        // Simulate downloading a document
                        alert('API文档下载中...');
                        // In a real app, you might trigger a file download like this:
                        // window.location.href = '/api/docs/download';
                    };
                 }
                
                actions.appendChild(btn);
            });
        }

        // Add extra tools icons
        const tools = document.createElement('div');
        tools.className = 'toolbar-tools';
        const toolIcons = ['↻', '🔍', '↕', '⚙️'];
        toolIcons.forEach(t => {
            const span = document.createElement('span');
            span.className = 'tool-icon';
            span.textContent = t;
            tools.appendChild(span);
        });
        actions.appendChild(tools);

        toolbarHeader.appendChild(actions);
        contentPanel.appendChild(toolbarHeader);

        // Table
        const tableContainer = document.createElement('div');
        tableContainer.className = 'table-container';
        const table = document.createElement('table');
        table.className = 'data-table';
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        
        // Render Header
        const trHead = document.createElement('tr');
        
        if (moduleData.columns) {
             moduleData.columns.forEach(col => {
                const th = document.createElement('th');
                th.textContent = col;
                trHead.appendChild(th);
            });
        }
        thead.appendChild(trHead);
        table.appendChild(thead);

        // Render Body
        if (moduleData.data && moduleData.data.length > 0) {
            moduleData.data.forEach((row, idx) => {
                // Check visibility for tree nodes
                if (!isRowVisible(row, moduleData.data)) {
                    return; // Skip rendering hidden rows
                }

                const tr = document.createElement('tr');
                
                // Helper to get value by key guess
                const getValue = (row, colName) => {
                    if (colName === '组织名称' || colName === '部门名称') return { val: row.name, key: 'name' };
                    if (colName === '负责人') return { val: row.manager || '未设置', key: 'manager' };
                    if (colName === '排序' || colName === '显示顺序') return { val: row.order || 0, key: 'order' };
                    if (colName === '状态') return { val: row.status, key: 'status' };
                    if (colName === '创建时间') return { val: row.time, key: 'time' };
                    if (colName === '角色编号' || colName === '字典编号') return { val: row.id, key: 'id' };
                    if (colName === '角色名称' || colName === '字典名称') return { val: row.name, key: 'name' };
                    if (colName === '角色标识') return { val: row.key, key: 'key' };
                    if (colName === '角色类型') return { val: row.type, key: 'type' };
                    if (colName === '操作') return { val: row.actions, key: 'actions' };
                    
                    // Menu Management Columns
                    if (colName === '菜单名称') return { val: row.name, key: 'name' };
                    if (colName === '菜单类型') return { val: row.type, key: 'menuType' };
                    if (colName === '图标') return { val: row.icon, key: 'icon' };
                    if (colName === '权限标识') return { val: row.permission, key: 'permission' };
                    if (colName === '组件路径') return { val: row.path, key: 'path' };

                    // Data Dictionary
                    if (colName === '字典编码') return { val: row.code, key: 'code' };
                    if (colName === '字典标签') return { val: row.label, key: 'label' };
                    if (colName === '字典键值') return { val: row.val, key: 'val' };
                    if (colName === '字典排序') return { val: row.sort, key: 'sort' };

                    // System Params
                    if (colName === '参数主键') return { val: row.id, key: 'id' };
                    if (colName === '参数分类') return { val: row.category, key: 'category' };
                    if (colName === '参数名称') return { val: row.name, key: 'name' };
                    if (colName === '参数键名') return { val: row.keyName, key: 'keyName' };
                    if (colName === '参数键值') return { val: row.keyValue, key: 'keyValue' };
                    if (colName === '系统内置') return { val: row.builtin, key: 'builtin' };
                    if (colName === '是否可见') return { val: row.visible, key: 'visible' };
                    if (colName === '备注') return { val: row.remark, key: 'remark' };

                    // User Group Management
                    if (colName === '序号') return { val: row.id, key: 'id' };
                    if (colName === '群组名') return { val: row.name, key: 'name' };
                    if (colName === '群组邮箱') return { val: row.email, key: 'email' };

                    // System Integration Control
                    if (colName === '应用名称') return { val: row.appName, key: 'appName' };
                    if (colName === '应用ID') return { val: row.appId, key: 'appId' };
                    if (colName === '安全秘钥') return { val: row.secret, key: 'secret' };

                    // Operation Audit (pending)
                    if (colName === '日志编号') return { val: row.logId, key: 'logId' };
                    if (colName === '操作人') return { val: row.operator, key: 'operator' };
                    if (colName === '操作模块') return { val: row.module, key: 'module' };
                    if (colName === '操作名') return { val: row.opName, key: 'opName' };
                    if (colName === '操作内容') return { val: row.content, key: 'content' };
                    if (colName === '操作时间') return { val: row.time, key: 'time' };
                    if (colName === '业务编号') return { val: row.bizId, key: 'bizId' };
                    if (colName === '操作IP') return { val: row.ip, key: 'ip' };

                    // XXL-JOB Columns
                    if (colName === '任务ID') return { val: row.id, key: 'id' };
                    if (colName === '任务描述') return { val: row.desc, key: 'desc' };
                    if (colName === '运行模式') return { val: row.mode, key: 'mode' };
                    if (colName === 'Cron') return { val: row.cron, key: 'cron' };
                    if (colName === '负责人') return { val: row.author, key: 'author' };

                    // API Management (Knife4j style)
                    if (colName === '方法') return { val: row.method, key: 'method' };
                    if (colName === 'API路径') return { val: row.path, key: 'path' };
                    if (colName === '描述') return { val: row.desc, key: 'desc' };
                    if (colName === '分组') return { val: row.group, key: 'group' };
                    if (colName === '版本') return { val: row.version, key: 'version' };
 
                    // Default fallback
                    return { val: '', key: '' };
                };

                moduleData.columns.forEach(col => {
                    const td = document.createElement('td');
                    const { val, key } = getValue(row, col);

                    if (key === 'name' && typeof row.level !== 'undefined') {
                        // Tree Node Logic
                        td.style.paddingLeft = `${(row.level * 24) + 16}px`; // Indent
                        
                        const nextRow = moduleData.data[idx + 1];
                        const hasChildren = nextRow && nextRow.level > row.level;
                        
                        if (hasChildren) {
                             const toggle = document.createElement('span');
                             toggle.className = 'tree-toggle';
                             toggle.textContent = row.expanded ? '-' : '+';
                             toggle.onclick = (e) => {
                                 e.stopPropagation();
                                 toggleTreeRow(moduleData, row);
                             };
                             td.prepend(toggle);
                        } else {
                            if (row.level > 0 || moduleData.data.some(r => r.level === row.level && (moduleData.data[moduleData.data.indexOf(r)+1]?.level > r.level))) {
                                const placeholder = document.createElement('span');
                                placeholder.style.display = 'inline-block';
                                placeholder.style.width = '25px'; // toggle width + margin
                                td.prepend(placeholder);
                            }
                        }
                        
                        const text = document.createTextNode(val);
                        td.appendChild(text);

                    } else if (key === 'method') {
                        const span = document.createElement('span');
                        span.className = 'badge';
                        span.style.fontWeight = 'bold';
                        if (val === 'GET') {
                            span.style.color = '#007bff';
                            span.style.backgroundColor = '#e7f5ff';
                            span.style.border = '1px solid #007bff';
                        } else if (val === 'POST') {
                            span.style.color = '#28a745';
                            span.style.backgroundColor = '#e6ffed';
                            span.style.border = '1px solid #28a745';
                        } else if (val === 'PUT') {
                            span.style.color = '#ffc107';
                            span.style.backgroundColor = '#fff9db';
                            span.style.border = '1px solid #ffc107';
                        } else if (val === 'DELETE') {
                            span.style.color = '#dc3545';
                            span.style.backgroundColor = '#ffe3e3';
                            span.style.border = '1px solid #dc3545';
                        }
                        span.textContent = val;
                        td.appendChild(span);

                    } else if (key === 'status') {
                        const span = document.createElement('span');
                        span.className = 'status-tag';
                        if (['开启', '启用', 'Active', '正常', 'Ready', 'Success', '在线', 'RUNNING'].includes(val)) {
                            span.classList.add('active');
                            span.textContent = val === 'Active' ? '开启' : val;
                        } else {
                            span.classList.add('inactive');
                            span.textContent = val === 'STOP' ? 'STOP' : '禁用';
                        }
                        span.onclick = () => {
                            // t13 is Dictionary Management, prevent status toggle
                            if (moduleData.id === 't13' || moduleData.id === 't13_left' || moduleData.id === 't13_right') {
                                return;
                            }
                            
                            if (span.classList.contains('active')) {
                                span.classList.remove('active');
                                span.classList.add('inactive');
                                span.textContent = '禁用';
                            } else {
                                span.classList.remove('inactive');
                                span.classList.add('active');
                                // Check if we should use '启用' (for t12) or '开启'
                                if (moduleData.id === 't12') {
                                    span.textContent = '启用';
                                } else {
                                    span.textContent = '开启';
                                }
                            }
                        };
                        td.appendChild(span);

                    } else if (key === 'builtin') {
                        const span = document.createElement('span');
                        span.className = 'badge';
                        // Inline styles for quick replication of the screenshot look
                        if (val === '系统内置') {
                             span.style.color = '#f5222d';
                             span.style.background = '#fff1f0';
                             span.style.border = '1px solid #ffa39e';
                        } else {
                             span.style.color = '#1890ff';
                             span.style.background = '#e6f7ff';
                             span.style.border = '1px solid #91d5ff';
                        }
                        span.textContent = val;
                        td.appendChild(span);

                    } else if (key === 'type') { // Role Type
                        const span = document.createElement('span');
                        span.className = 'badge';
                        if (val === '内置') {
                            span.classList.add('badge-builtin');
                        } else if (val === '自定义') {
                            span.classList.add('badge-custom');
                        }
                        span.textContent = val;
                        td.appendChild(span);

                    } else if (key === 'menuType') { // Menu Type
                        const span = document.createElement('span');
                        span.className = 'badge';
                        if (val === '目录') {
                            span.classList.add('badge-catalog');
                        } else if (val === '菜单') {
                            span.classList.add('badge-menu');
                        } else if (val === '按钮') {
                            span.classList.add('badge-button');
                        }
                        span.textContent = val;
                        td.appendChild(span);
                    
                    } else if (key === 'icon') {
                        if (val) {
                             const iconMap = {
                                 'list': '☰',
                                 'home': '🏠',
                                 'book': '📖',
                                 'setting': '⚙️',
                                 'desktop': '🖥️',
                                 'deployment-unit': '🔗'
                             };
                             td.textContent = iconMap[val] || val;
                        }

                    } else if (key === 'actions') {
                        if (Array.isArray(val)) {
                            val.forEach(action => {
                                const a = document.createElement('a');
                                a.href = 'javascript:void(0)';
                                a.className = 'action-link';
                                
                                if (action === '修改') {
                                    a.innerHTML = '📝 修改'; 
                                    if (moduleData.id === 't12') {
                                        a.onclick = () => openMenuModal('edit', row);
                                    } else if (moduleData.id === 't13_left') {
                                        a.onclick = () => openDictModal('edit', row);
                                    } else if (moduleData.id === 't13_right') {
                                        a.onclick = () => openDictDataModal('edit', row);
                                    } else if (moduleData.id === 't14') {
                                        a.onclick = () => openConfigModal('edit', row);
                                    } else {
                                        a.onclick = () => openRoleModal('edit', row);
                                    }
                                } else if (action === '编辑') {
                                    a.innerHTML = '📝 编辑'; 
                                    if (moduleData.id === 't12') {
                                        a.onclick = () => openMenuModal('edit', row);
                                    } else if (moduleData.id === 't13_left') {
                                        a.onclick = () => openDictModal('edit', row);
                                    } else if (moduleData.id === 't13_right') {
                                        a.onclick = () => openDictDataModal('edit', row);
                                    } else if (moduleData.id === 't14') {
                                        a.onclick = () => openConfigModal('edit', row);
                                    } else {
                                        a.onclick = () => openRoleModal('edit', row);
                                    }
                                } else if (action === '删除') {
                                    a.innerHTML = '🗑 删除';
                                    a.style.color = '#ff4d4f';
                                } else if (action === '更多') {
                                    a.innerHTML = '更多 ⌄';
                                    a.onmouseenter = (e) => openRoleDropdown(e, row, moduleData.id);
                                    a.onclick = (e) => openRoleDropdown(e, row, moduleData.id);
                                } else if (action === '详情') {
                                    a.innerHTML = '<span style="font-size:16px">📄</span> 详情';
                                    a.style.color = '#1890ff';
                                } else if (action === '成员管理') {
                                    a.innerHTML = '⚙️ 成员管理';
                                } else if (action === '白名单') {
                                    a.innerHTML = '设置 白名单';
                                    a.style.color = '#1890ff';
                                    a.onclick = () => openWhitelistModal(row);
                                } else {
                                    a.textContent = action;
                                }
                                td.appendChild(a);
                            });
                        }
                    } else {
                        td.textContent = val;
                    }
                    tr.appendChild(td);
                });
                
                tbody.appendChild(tr);
            });
        }
        
        table.appendChild(tbody);
        tableContainer.appendChild(table);
        contentPanel.appendChild(tableContainer);

        // Pagination
        if (moduleData.id !== 't09' && moduleData.id !== 't12') { 
            if (moduleData.data && moduleData.data.length > 0) {
                const pagination = document.createElement('div');
                pagination.className = 'pagination';
                const total = moduleData.total || (moduleData.data.length > 0 ? moduleData.data.length : 15); 
                
                pagination.innerHTML = `
                   <span class="total">共 ${total} 条数据</span>
                   <div class="pages">
                       <button class="page-btn active">1</button>
                       <button class="page-btn">2</button>
                       <button class="page-btn">></button>
                   </div>
                   <select class="page-size">
                       <option>10 条/页</option>
                       <option>20 条/页</option>
                   </select>
                   <span class="goto">跳至 <input type="text" value=""> 页</span>
                `;
                contentPanel.appendChild(pagination);
            }
        }

        container.appendChild(contentPanel);
    }

    function renderModule(moduleData) {
        moduleContent.innerHTML = '';

        if (moduleData.layout === 'split') {
            const splitContainer = document.createElement('div');
            splitContainer.style.display = 'flex';
            splitContainer.style.gap = '16px';
            splitContainer.style.height = '100%';

            // Left Panel
            const leftContainer = document.createElement('div');
            leftContainer.style.flex = '1';
            leftContainer.style.display = 'flex';
            leftContainer.style.flexDirection = 'column';
            // Need to apply moduleData.leftPanel props
            const leftData = { ...moduleData.leftPanel };
            if (!leftData.id) leftData.id = moduleData.id;
            renderSearchPanel(leftContainer, leftData);
            renderContentPanel(leftContainer, leftData);
            splitContainer.appendChild(leftContainer);

            // Right Panel
            const rightContainer = document.createElement('div');
            rightContainer.style.flex = '1';
            rightContainer.style.display = 'flex';
            rightContainer.style.flexDirection = 'column';
            const rightData = { ...moduleData.rightPanel };
            if (!rightData.id) rightData.id = moduleData.id;
            renderSearchPanel(rightContainer, rightData);
            renderContentPanel(rightContainer, rightData);
            splitContainer.appendChild(rightContainer);

            moduleContent.appendChild(splitContainer);
        } else if (moduleData.layout === 'license-info') {
            renderLicenseInfo(moduleContent, moduleData);
        } else if (moduleData.layout === 'storage-config') {
            renderStorageConfig(moduleContent, moduleData);
        } else if (moduleData.layout === 'watermark-config') {
            renderWatermarkConfig(moduleContent, moduleData);
        } else if (moduleData.layout === 'file-manager') {
            renderFileManager(moduleContent, moduleData);
        } else {
            renderSearchPanel(moduleContent, moduleData);
            renderContentPanel(moduleContent, moduleData);
        }
    }

    function renderLicenseInfo(container, moduleData) {
        const infoContainer = document.createElement('div');
        infoContainer.style.padding = '24px';
        infoContainer.style.background = '#fff';
        infoContainer.style.margin = '24px';
        infoContainer.style.borderRadius = '4px';

        if (moduleData.info) {
            moduleData.info.forEach(item => {
                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.marginBottom = '20px';
                row.style.alignItems = 'center';

                const label = document.createElement('div');
                label.style.width = '120px';
                label.style.textAlign = 'right';
                label.style.marginRight = '20px';
                label.style.fontWeight = 'bold';
                label.style.color = '#333';
                label.textContent = item.label;

                const valueDiv = document.createElement('div');
                valueDiv.style.flex = '1';

                if (item.type === 'button') {
                    const btn = document.createElement('button');
                    btn.className = 'btn btn-primary';
                    btn.textContent = item.value;
                    btn.onclick = () => alert('上传功能待实现');
                    valueDiv.appendChild(btn);
                } else {
                    const text = document.createElement('div');
                    text.style.background = '#f5f5f5';
                    text.style.padding = '8px 12px';
                    text.style.borderRadius = '4px';
                    text.style.color = '#333';
                    text.textContent = item.value;
                    valueDiv.appendChild(text);
                }

                row.appendChild(label);
                row.appendChild(valueDiv);
                infoContainer.appendChild(row);
            });
        }
        container.appendChild(infoContainer);
    }

    function renderStorageConfig(container, moduleData) {
        const storageKey = 'edpcs_storage_config';

        const readConfig = () => {
            try {
                const raw = localStorage.getItem(storageKey);
                const parsed = raw ? JSON.parse(raw) : null;
                if (!parsed || typeof parsed !== 'object') return null;

                const cleanEnabled = typeof parsed.cleanEnabled === 'boolean' ? parsed.cleanEnabled : undefined;
                const allowedCycle = new Set(['none', 'day', 'month', 'year']);
                const cleanCycle = typeof parsed.cleanCycle === 'string' && allowedCycle.has(parsed.cleanCycle) ? parsed.cleanCycle : undefined;

                return { cleanEnabled, cleanCycle };
            } catch {
                return null;
            }
        };

        const defaultConfig = {
            cleanEnabled: true,
            cleanCycle: 'none'
        };

        const config = { ...defaultConfig, ...(readConfig() || {}) };

        const contentPanel = document.createElement('div');
        contentPanel.className = 'content-panel';

        const toolbarHeader = document.createElement('div');
        toolbarHeader.className = 'toolbar';

        const title = document.createElement('div');
        title.className = 'toolbar-title';
        title.textContent = moduleData.title || '存储配置';
        toolbarHeader.appendChild(title);

        const actions = document.createElement('div');
        actions.className = 'toolbar-actions';

        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn btn-primary';
        saveBtn.textContent = '保存';

        const resetBtn = document.createElement('button');
        resetBtn.className = 'btn';
        resetBtn.textContent = '重置';

        actions.appendChild(resetBtn);
        actions.appendChild(saveBtn);
        toolbarHeader.appendChild(actions);

        const body = document.createElement('div');
        body.style.maxWidth = '720px';

        const makeItem = (labelText, contentEl, { required } = {}) => {
            const item = document.createElement('div');
            item.className = 'form-item';

            const label = document.createElement('label');
            label.className = required ? 'form-label required' : 'form-label';
            label.textContent = labelText;

            const content = document.createElement('div');
            content.className = 'form-content';
            content.appendChild(contentEl);

            item.appendChild(label);
            item.appendChild(content);
            return item;
        };

        const cleanToggleWrap = document.createElement('div');
        cleanToggleWrap.style.display = 'flex';
        cleanToggleWrap.style.alignItems = 'center';
        cleanToggleWrap.style.gap = '12px';

        const cleanToggle = document.createElement('div');
        cleanToggle.className = 'toggle-switch' + (config.cleanEnabled ? ' active' : '');

        const cleanToggleLabel = document.createElement('span');
        cleanToggleLabel.className = 'toggle-switch-label';
        cleanToggleLabel.textContent = config.cleanEnabled ? '已启用' : '已关闭';

        const syncToggleLabel = () => {
            cleanToggleLabel.textContent = cleanToggle.classList.contains('active') ? '已启用' : '已关闭';
        };

        cleanToggle.onclick = () => {
            cleanToggle.classList.toggle('active');
            syncToggleLabel();
        };

        cleanToggleWrap.appendChild(cleanToggle);
        cleanToggleWrap.appendChild(cleanToggleLabel);

        const cycleSelect = document.createElement('select');
        cycleSelect.className = 'form-input';
        const cycleOptions = [
            { value: 'none', label: '不清理' },
            { value: 'day', label: '每天' },
            { value: 'month', label: '每个月' },
            { value: 'year', label: '每年' }
        ];
        cycleOptions.forEach(opt => {
            const o = document.createElement('option');
            o.value = opt.value;
            o.textContent = opt.label;
            cycleSelect.appendChild(o);
        });
        cycleSelect.value = config.cleanCycle || 'none';

        const serialize = () => ({
            cleanEnabled: cleanToggle.classList.contains('active'),
            cleanCycle: cycleSelect.value
        });

        const save = (next) => {
            try {
                localStorage.setItem(storageKey, JSON.stringify(next));
                return true;
            } catch {
                return false;
            }
        };

        saveBtn.onclick = () => {
            const next = serialize();
            config.cleanEnabled = next.cleanEnabled;
            config.cleanCycle = next.cleanCycle;
            if (!save(next)) {
                alert('保存失败：浏览器存储不可用');
                return;
            }
            alert('保存成功');
        };

        resetBtn.onclick = () => {
            cycleSelect.value = defaultConfig.cleanCycle;
            cleanToggle.className = 'toggle-switch' + (defaultConfig.cleanEnabled ? ' active' : '');
            syncToggleLabel();
            save({ ...defaultConfig });
            alert('已重置');
        };
        body.appendChild(makeItem('启用清理', cleanToggleWrap));
        body.appendChild(makeItem('清理周期', cycleSelect, { required: true }));

        contentPanel.appendChild(toolbarHeader);
        contentPanel.appendChild(body);
        container.appendChild(contentPanel);
    }

    function renderWatermarkConfig(container, moduleData) {
        const config = moduleData.config;
        const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

        config.templateName = typeof config.templateName === 'string' ? config.templateName : '';
        config.spacing = config.spacing && typeof config.spacing === 'object' ? config.spacing : { x: 40, y: 25 };
        ['username', 'custom', 'time'].forEach(k => {
            if (typeof config[k]?.transparency !== 'number') {
                config[k].transparency = config[k]?.alpha ? 70 : 0;
            }
        });

        const wrapper = document.createElement('div');
        wrapper.className = 'wm-page';

        const title = document.createElement('div');
        title.className = 'wm-title';
        title.textContent = '新建水印模板';
        wrapper.appendChild(title);

        const body = document.createElement('div');
        body.className = 'wm-body';

        const formPanel = document.createElement('div');
        formPanel.className = 'wm-form';

        const createItem = (labelText, content, { required = false } = {}) => {
            const item = document.createElement('div');
            item.className = 'form-item wm-form-item';

            const lbl = document.createElement('label');
            lbl.className = required ? 'form-label required' : 'form-label';
            lbl.textContent = labelText;

            const cnt = document.createElement('div');
            cnt.className = 'form-content';
            if (typeof content === 'string') cnt.innerHTML = content;
            else cnt.appendChild(content);

            item.appendChild(lbl);
            item.appendChild(cnt);
            return item;
        };

        const templateInput = document.createElement('input');
        templateInput.className = 'form-input';
        templateInput.type = 'text';
        templateInput.placeholder = '请输入水印模板名称';
        templateInput.value = config.templateName;
        templateInput.oninput = (e) => {
            config.templateName = e.target.value;
        };
        formPanel.appendChild(createItem('模板名称：', templateInput, { required: true }));

        const createSubRow = (subLabel, contentEl) => {
            const row = document.createElement('div');
            row.className = 'wm-sub-row';

            const lbl = document.createElement('div');
            lbl.className = 'wm-sub-label';
            lbl.textContent = subLabel;

            const cnt = document.createElement('div');
            cnt.className = 'wm-sub-content';
            cnt.appendChild(contentEl);

            row.appendChild(lbl);
            row.appendChild(cnt);
            return row;
        };

        const createTransparencyControl = (key) => {
            const wrap = document.createElement('div');
            wrap.className = 'wm-transparency';

            const range = document.createElement('input');
            range.type = 'range';
            range.min = '0';
            range.max = '100';
            range.step = '1';
            range.value = String(clamp(parseInt(config[key].transparency, 10) || 0, 0, 100));

            const numWrap = document.createElement('div');
            numWrap.className = 'wm-percent-wrap';

            const num = document.createElement('input');
            num.type = 'number';
            num.className = 'wm-percent-input';
            num.min = '0';
            num.max = '100';
            num.value = range.value;

            const suffix = document.createElement('span');
            suffix.className = 'wm-percent-suffix';
            suffix.textContent = '%';

            const sync = (v) => {
                const next = clamp(parseInt(v, 10) || 0, 0, 100);
                config[key].transparency = next;
                config[key].alpha = next > 0;
                range.value = String(next);
                num.value = String(next);
                updatePreview();
            };

            range.oninput = (e) => sync(e.target.value);
            num.oninput = (e) => sync(e.target.value);

            numWrap.appendChild(num);
            numWrap.appendChild(suffix);

            wrap.appendChild(range);
            wrap.appendChild(numWrap);
            return wrap;
        };

        const createTypeSection = (key, labelText, { showText = false } = {}) => {
            const section = document.createElement('div');
            section.className = 'wm-type-row';

            const left = document.createElement('label');
            left.className = 'wm-type-left';

            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.checked = !!config[key].enabled;

            const span = document.createElement('span');
            span.textContent = labelText;

            left.appendChild(cb);
            left.appendChild(span);

            const controls = document.createElement('div');
            controls.className = 'wm-type-controls';

            const createControl = (label, el) => {
                const wrap = document.createElement('div');
                wrap.className = 'wm-control';
                const l = document.createElement('span');
                l.className = 'wm-control-label';
                l.textContent = label;
                wrap.appendChild(l);
                wrap.appendChild(el);
                return wrap;
            };

            if (showText) {
                const text = document.createElement('input');
                text.className = 'form-input wm-text-input';
                text.type = 'text';
                text.placeholder = '请输入水印显示的内容';
                text.value = config[key].text || '';
                text.oninput = (e) => {
                    config[key].text = e.target.value;
                    updatePreview();
                };
                controls.appendChild(createControl('文字：', text));
            }

            const size = document.createElement('select');
            size.className = 'form-input wm-size-select';
            [12, 14, 16, 18, 20, 24, 32, 48].forEach(s => {
                const opt = document.createElement('option');
                opt.value = String(s);
                opt.textContent = String(s);
                if (String(config[key].fontSize) === String(s)) opt.selected = true;
                size.appendChild(opt);
            });
            size.onchange = (e) => {
                config[key].fontSize = e.target.value;
                updatePreview();
            };
            controls.appendChild(createControl('字号：', size));

            const colorWrap = document.createElement('div');
            colorWrap.className = 'wm-color-wrap';
            const color = document.createElement('input');
            color.type = 'color';
            color.value = config[key].color || '#999999';
            color.oninput = (e) => {
                config[key].color = e.target.value;
                updatePreview();
            };
            colorWrap.appendChild(color);
            controls.appendChild(createControl('颜色：', colorWrap));

            controls.appendChild(createControl('透明度：', createTransparencyControl(key)));

            const setEnabled = (enabled) => {
                controls.querySelectorAll('input, select').forEach(el => {
                    el.disabled = !enabled;
                });
                controls.classList.toggle('is-disabled', !enabled);
            };

            cb.onchange = (e) => {
                config[key].enabled = e.target.checked;
                setEnabled(e.target.checked);
                updatePreview();
            };

            setEnabled(cb.checked);

            section.appendChild(left);
            section.appendChild(controls);
            return section;
        };

        const typeContainer = document.createElement('div');
        typeContainer.className = 'wm-type-container';
        typeContainer.appendChild(createTypeSection('username', '用户名水印'));
        typeContainer.appendChild(createTypeSection('custom', '自定义水印', { showText: true }));
        typeContainer.appendChild(createTypeSection('time', '时间水印'));

        formPanel.appendChild(createItem('设置水印类型：', typeContainer, { required: true }));

        const rotationWrap = document.createElement('div');
        rotationWrap.className = 'wm-inline';
        const rotInput = document.createElement('input');
        rotInput.className = 'form-input wm-degree-input';
        rotInput.type = 'number';
        rotInput.value = parseInt(config.rotation, 10) || 30;
        rotInput.oninput = (e) => {
            config.rotation = e.target.value;
            updatePreview();
        };
        const degree = document.createElement('span');
        degree.className = 'wm-degree-suffix';
        degree.textContent = '度';
        rotationWrap.appendChild(rotInput);
        rotationWrap.appendChild(degree);
        formPanel.appendChild(createItem('水印旋转：', rotationWrap));

        const layoutDiv = document.createElement('div');
        layoutDiv.className = 'wm-radio-row';
        layoutDiv.innerHTML = `
            <label><input type="radio" name="w_layout" value="tiled" ${config.layout === 'tiled' ? 'checked' : ''}> 平铺</label>
            <label><input type="radio" name="w_layout" value="center" ${config.layout === 'center' ? 'checked' : ''}> 居中</label>
        `;
        layoutDiv.querySelectorAll('input').forEach(r => {
            r.onchange = (e) => {
                config.layout = e.target.value;
                updatePreview();
            };
        });
        formPanel.appendChild(createItem('水印版式：', layoutDiv));

        const spacingDiv = document.createElement('div');
        spacingDiv.className = 'wm-spacing';
        spacingDiv.innerHTML = `
            <span>横向：</span><input type="number" class="form-input wm-number-input" value="${config.spacing?.x ?? 40}"><span>像素</span>
            <span>纵向：</span><input type="number" class="form-input wm-number-input" value="${config.spacing?.y ?? 25}"><span>像素</span>
        `;
        const spacingInputs = spacingDiv.querySelectorAll('input');
        spacingInputs[0].oninput = (e) => {
            config.spacing.x = parseInt(e.target.value, 10) || 0;
            updatePreview();
        };
        spacingInputs[1].oninput = (e) => {
            config.spacing.y = parseInt(e.target.value, 10) || 0;
            updatePreview();
        };
        formPanel.appendChild(createItem('水印间距：', spacingDiv));

        const previewPanel = document.createElement('div');
        previewPanel.className = 'wm-preview';

        const previewTitle = document.createElement('div');
        previewTitle.className = 'wm-preview-title';
        previewTitle.textContent = '水印预览：';
        previewPanel.appendChild(previewTitle);

        const previewArea = document.createElement('div');
        previewArea.className = 'wm-preview-area';
        previewArea.innerHTML = `<div class="wm-preview-doc">${Array(120).fill('水印水印 ').join('')}</div>`;

        const watermarkLayer = document.createElement('div');
        watermarkLayer.className = 'wm-watermark-layer';
        previewArea.appendChild(watermarkLayer);

        previewPanel.appendChild(previewArea);

        body.appendChild(formPanel);
        body.appendChild(previewPanel);
        wrapper.appendChild(body);

        const footer = document.createElement('div');
        footer.className = 'wm-footer';
        footer.innerHTML = `
            <button class="btn btn-primary wm-footer-btn">确定</button>
            <button class="btn wm-footer-btn">取消</button>
        `;
        footer.querySelector('.btn-primary').onclick = () => alert('水印模板已保存');
        footer.querySelector('.btn:not(.btn-primary)').onclick = () => {
            config.templateName = '';
            templateInput.value = '';
            alert('已取消');
        };

        wrapper.appendChild(footer);
        container.appendChild(wrapper);

        function updatePreview() {
            watermarkLayer.innerHTML = '';
            watermarkLayer.style.display = '';
            watermarkLayer.style.flexWrap = '';
            watermarkLayer.style.alignContent = '';
            watermarkLayer.style.justifyContent = '';
            watermarkLayer.style.overflow = '';
            
            let parts = [];
            if (config.username.enabled) {
                 parts.push({ text: 'admin', style: config.username });
            }
            if (config.custom.enabled && config.custom.text) {
                 parts.push({ text: config.custom.text, style: config.custom });
            }
            if (config.time.enabled) {
                 // Use today's date formatted
                 const now = new Date();
                 const dateStr = `${now.getFullYear()}/${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')}`;
                 parts.push({ text: dateStr, style: config.time });
            }
            
            if (parts.length === 0) return;

            const createUnit = () => {
                const div = document.createElement('div');
                div.style.transform = `rotate(-${parseInt(config.rotation)||30}deg)`;
                div.style.textAlign = 'center';
                div.style.whiteSpace = 'nowrap';
                div.style.pointerEvents = 'none';
                
                parts.forEach(p => {
                    const span = document.createElement('span');
                    span.textContent = p.text;
                    span.style.fontSize = p.style.fontSize + 'px';
                    span.style.color = p.style.color;
                    const t = typeof p.style.transparency === 'number' ? p.style.transparency : (p.style.alpha ? 70 : 0);
                    span.style.opacity = String(1 - clamp(t, 0, 100) / 100);
                    span.style.margin = '0 4px';
                    span.style.fontWeight = 'bold';
                    div.appendChild(span);
                });
                return div;
            };

            if (config.layout === 'center') {
                const unit = createUnit();
                unit.style.position = 'absolute';
                unit.style.top = '50%';
                unit.style.left = '50%';
                unit.style.transform += ' translate(-50%, -50%)';
                watermarkLayer.appendChild(unit);
            } else {
                watermarkLayer.style.display = 'flex';
                watermarkLayer.style.flexWrap = 'wrap';
                watermarkLayer.style.alignContent = 'flex-start';
                watermarkLayer.style.justifyContent = 'flex-start';
                watermarkLayer.style.overflow = 'hidden';
                
                const hGap = config.spacing.x || 40;
                const vGap = config.spacing.y || 25;
                
                const count = 40; 
                for(let i=0; i<count; i++) {
                    const unit = createUnit();
                    unit.style.margin = `${vGap}px ${hGap}px`;
                    watermarkLayer.appendChild(unit);
                }
            }
        }
        
        setTimeout(updatePreview, 0);
    }

    function renderFileManager(container, moduleData) {
        const state = {
            folderKeyword: '',
            fileKeyword: '',
            selectedFolderId: (moduleData.folders && moduleData.folders[0]) ? moduleData.folders[0].id : null,
            page: 1,
            pageSize: 10,
            selectedFiles: new Set()
        };

        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.gap = '16px';

        const left = document.createElement('div');
        left.style.flex = '0 0 320px';
        left.style.background = '#fff';
        left.style.borderRadius = '2px';
        left.style.padding = '16px';
        left.style.display = 'flex';
        left.style.flexDirection = 'column';

        const right = document.createElement('div');
        right.style.flex = '1';
        right.style.background = '#fff';
        right.style.borderRadius = '2px';
        right.style.padding = '16px';
        right.style.display = 'flex';
        right.style.flexDirection = 'column';

        const makeBtn = (text, type = '') => {
            const btn = document.createElement('button');
            btn.className = 'btn' + (type ? ' ' + type : '');
            btn.textContent = text;
            return btn;
        };

        // Left: Folders (no pagination)
        const leftHeader = document.createElement('div');
        leftHeader.style.display = 'flex';
        leftHeader.style.justifyContent = 'space-between';
        leftHeader.style.alignItems = 'center';
        leftHeader.style.marginBottom = '12px';
        const leftTitle = document.createElement('div');
        leftTitle.textContent = '文件夹';
        leftTitle.style.fontWeight = '500';
        leftHeader.appendChild(leftTitle);
        left.appendChild(leftHeader);

        const leftActions = document.createElement('div');
        leftActions.style.display = 'flex';
        leftActions.style.gap = '8px';
        leftActions.style.marginBottom = '12px';
        leftActions.appendChild(makeBtn('新建文件夹'));
        leftActions.appendChild(makeBtn('重命名'));
        leftActions.appendChild(makeBtn('删除'));
        left.appendChild(leftActions);

        const folderSearch = document.createElement('div');
        folderSearch.className = 'search-panel';
        folderSearch.style.padding = '12px';
        folderSearch.style.margin = '0 0 12px 0';
        const fsItem = document.createElement('div');
        fsItem.className = 'search-item';
        const fsLabel = document.createElement('label');
        fsLabel.className = 'search-label';
        fsLabel.textContent = '文件夹名称';
        const fsInput = document.createElement('input');
        fsInput.className = 'search-input';
        fsInput.type = 'text';
        fsInput.placeholder = '请输入';
        fsInput.oninput = (e) => {
            state.folderKeyword = e.target.value.trim();
            renderTree();
        };
        fsItem.appendChild(fsLabel);
        fsItem.appendChild(fsInput);
        folderSearch.appendChild(fsItem);
        const fsActions = document.createElement('div');
        fsActions.className = 'search-actions';
        const fsReset = makeBtn('重置');
        const fsSearch = makeBtn('查询', 'btn-primary');
        fsReset.onclick = () => { state.folderKeyword = ''; fsInput.value = ''; renderTree(); };
        fsSearch.onclick = () => { state.folderKeyword = fsInput.value.trim(); renderTree(); };
        fsActions.appendChild(fsReset);
        fsActions.appendChild(fsSearch);
        folderSearch.appendChild(fsActions);
        left.appendChild(folderSearch);

        const treeWrap = document.createElement('div');
        treeWrap.className = 'permission-tree';
        left.appendChild(treeWrap);

        const matchKeyword = (name) => {
            if (!state.folderKeyword) return true;
            return String(name).toLowerCase().includes(state.folderKeyword.toLowerCase());
        };

        const renderTreeNode = (node, depth = 0) => {
            const row = document.createElement('div');
            row.className = 'tree-node';
            const content = document.createElement('div');
            content.className = 'tree-node-content';
            const indent = document.createElement('span');
            indent.className = 'tree-indent';
            indent.style.width = (depth * 16) + 'px';
            content.appendChild(indent);
            const cb = document.createElement('input');
            cb.type = 'radio';
            cb.name = 'folder-select';
            cb.checked = state.selectedFolderId === node.id;
            cb.style.marginRight = '6px';
            const label = document.createElement('span');
            label.textContent = node.name;
            label.style.cursor = 'pointer';
            const selectFolder = () => {
                state.selectedFolderId = node.id;
                cb.checked = true;
                refreshFiles();
            };
            cb.onchange = selectFolder;
            label.onclick = selectFolder;
            content.appendChild(cb);
            content.appendChild(label);
            row.appendChild(content);
            treeWrap.appendChild(row);
            (node.children || []).forEach(child => renderTreeNode(child, depth + 1));
        };

        const renderTree = () => {
            treeWrap.innerHTML = '';
            const renderFiltered = (nodes) => {
                nodes.forEach(n => {
                    const childMatch = (n.children || []).some(c => matchKeyword(c.name));
                    if (matchKeyword(n.name) || childMatch || state.folderKeyword === '') {
                        renderTreeNode(n, 0);
                    } else {
                        (n.children || []).forEach(c => {
                            if (matchKeyword(c.name)) renderTreeNode(c, 1);
                        });
                    }
                });
            };
            renderFiltered(moduleData.folders || []);
        };
        renderTree();

        // Right: Files (with pagination)
        const rightHeader = document.createElement('div');
        rightHeader.style.display = 'flex';
        rightHeader.style.justifyContent = 'space-between';
        rightHeader.style.alignItems = 'center';
        rightHeader.style.marginBottom = '12px';
        const rightTitle = document.createElement('div');
        rightTitle.textContent = '文件列表';
        rightTitle.style.fontWeight = '500';
        rightHeader.appendChild(rightTitle);
        right.appendChild(rightHeader);

        const fileActions = document.createElement('div');
        fileActions.style.display = 'flex';
        fileActions.style.gap = '8px';
        fileActions.style.marginBottom = '12px';
        const btnDelete = makeBtn('删除');
        const btnUpload = makeBtn('上传');
        const btnDownload = makeBtn('下载');
        const btnCompare = makeBtn('对比');
        btnCompare.style.display = 'none';
        const refreshCompareBtn = () => {
            btnCompare.style.display = state.selectedFiles.size === 2 ? 'inline-block' : 'none';
        };
        btnDelete.onclick = () => {
            if (state.selectedFiles.size === 0) return alert('请先选择文件');
            moduleData.files = (moduleData.files || []).filter(f => !state.selectedFiles.has(f.id));
            state.selectedFiles.clear();
            refreshFiles();
        };
        btnUpload.onclick = () => alert('上传功能待实现');
        btnDownload.onclick = () => alert('下载功能待实现');
        btnCompare.onclick = () => alert('对比功能：已选择2个文件');
        fileActions.appendChild(btnDelete);
        fileActions.appendChild(btnUpload);
        fileActions.appendChild(btnDownload);
        fileActions.appendChild(btnCompare);
        right.appendChild(fileActions);

        const fileSearch = document.createElement('div');
        fileSearch.className = 'search-panel';
        fileSearch.style.padding = '12px';
        fileSearch.style.margin = '0 0 12px 0';
        const fiItem = document.createElement('div');
        fiItem.className = 'search-item';
        const fiLabel = document.createElement('label');
        fiLabel.className = 'search-label';
        fiLabel.textContent = '文件名称';
        const fiInput = document.createElement('input');
        fiInput.className = 'search-input';
        fiInput.type = 'text';
        fiInput.placeholder = '请输入';
        fiInput.oninput = (e) => {
            state.fileKeyword = e.target.value.trim();
            refreshFiles();
        };
        fiItem.appendChild(fiLabel);
        fiItem.appendChild(fiInput);
        fileSearch.appendChild(fiItem);
        const fiActions = document.createElement('div');
        fiActions.className = 'search-actions';
        const fiReset = makeBtn('重置');
        const fiSearch = makeBtn('查询', 'btn-primary');
        fiReset.onclick = () => { state.fileKeyword = ''; fiInput.value = ''; refreshFiles(); };
        fiSearch.onclick = () => { state.fileKeyword = fiInput.value.trim(); refreshFiles(); };
        fiActions.appendChild(fiReset);
        fiActions.appendChild(fiSearch);
        fileSearch.appendChild(fiActions);
        right.appendChild(fileSearch);

        const table = document.createElement('table');
        table.className = 'data-table';
        const thead = document.createElement('thead');
        const trHead = document.createElement('tr');
        ['选中', '文件名称', '创建时间', '操作'].forEach(h => {
            const th = document.createElement('th');
            th.textContent = h;
            trHead.appendChild(th);
        });
        thead.appendChild(trHead);
        table.appendChild(thead);
        const tbody = document.createElement('tbody');
        table.appendChild(tbody);
        right.appendChild(table);

        const pagination = document.createElement('div');
        pagination.className = 'pagination';
        right.appendChild(pagination);

        function refreshFiles() {
            const all = moduleData.files || [];
            let list = all.filter(f => !state.selectedFolderId || f.folderId === state.selectedFolderId);
            if (state.fileKeyword) {
                list = list.filter(f => f.name.toLowerCase().includes(state.fileKeyword.toLowerCase()));
            }
            const total = list.length;
            const start = (state.page - 1) * state.pageSize;
            const pageItems = list.slice(start, start + state.pageSize);

            tbody.innerHTML = '';
            pageItems.forEach(f => {
                const tr = document.createElement('tr');
                const tdSel = document.createElement('td');
                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.checked = state.selectedFiles.has(f.id);
                cb.onchange = (e) => {
                    if (e.target.checked) state.selectedFiles.add(f.id);
                    else state.selectedFiles.delete(f.id);
                    refreshCompareBtn();
                };
                tdSel.appendChild(cb);
                const tdName = document.createElement('td');
                tdName.textContent = f.name;
                const tdTime = document.createElement('td');
                tdTime.textContent = f.time;
                const tdOps = document.createElement('td');
                const aDel = document.createElement('a');
                aDel.href = 'javascript:void(0)';
                aDel.className = 'action-link';
                aDel.textContent = '删除';
                aDel.onclick = () => {
                    moduleData.files = all.filter(x => x.id !== f.id);
                    state.selectedFiles.delete(f.id);
                    refreshFiles();
                };
                const aPrev = document.createElement('a');
                aPrev.href = 'javascript:void(0)';
                aPrev.className = 'action-link';
                aPrev.textContent = '预览';
                aPrev.onclick = () => alert('预览：' + f.name);
                const aTrace = document.createElement('a');
                aTrace.href = 'javascript:void(0)';
                aTrace.className = 'action-link';
                aTrace.textContent = '文件轨迹';
                aTrace.onclick = () => openFileTraceModal(f);
                tdOps.appendChild(aDel);
                tdOps.appendChild(aPrev);
                tdOps.appendChild(aTrace);
                tr.appendChild(tdSel);
                tr.appendChild(tdName);
                tr.appendChild(tdTime);
                tr.appendChild(tdOps);
                tbody.appendChild(tr);
            });

            const pages = Math.max(1, Math.ceil(total / state.pageSize));
            state.page = Math.min(state.page, pages);
            pagination.innerHTML = `
                <span class="total">共 ${total} 条数据</span>
                <div class="pages"></div>
                <select class="page-size">
                    <option ${state.pageSize===10?'selected':''}>10 条/页</option>
                    <option ${state.pageSize===20?'selected':''}>20 条/页</option>
                </select>
            `;
            const pagesDiv = pagination.querySelector('.pages');
            for (let i = 1; i <= pages; i++) {
                const btn = document.createElement('button');
                btn.className = 'page-btn' + (i === state.page ? ' active' : '');
                btn.textContent = String(i);
                btn.onclick = () => { state.page = i; refreshFiles(); };
                pagesDiv.appendChild(btn);
            }
            const pageSizeSel = pagination.querySelector('.page-size');
            pageSizeSel.onchange = (e) => {
                const val = e.target.value.includes('20') ? 20 : 10;
                state.pageSize = val;
                state.page = 1;
                refreshFiles();
            };

            refreshCompareBtn();
        }
        refreshFiles();

        wrapper.appendChild(left);
        wrapper.appendChild(right);
        container.appendChild(wrapper);

        function openFileTraceModal(file) {
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.style.width = '600px';
            modal.innerHTML = `
                <div class="modal-header">
                    <span>文件轨迹 - ${file.name}</span>
                    <span class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</span>
                </div>
                <div class="modal-body">
                    <div class="timeline"></div>
                </div>
                <div class="modal-footer">
                    <button class="btn" onclick="this.closest('.modal-overlay').remove()">关闭</button>
                </div>
            `;
            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            const containerEl = modal.querySelector('.timeline');
            const logs = (file.logs || []).slice().sort((a, b) => {
                const pa = new Date(String(a.time).replace(' ', 'T')).getTime();
                const pb = new Date(String(b.time).replace(' ', 'T')).getTime();
                return pb - pa;
            });
            if (logs.length === 0) {
                containerEl.innerHTML = `<div style="color:rgba(0,0,0,0.45)">暂无轨迹</div>`;
                return;
            }
            logs.forEach(l => {
                const item = document.createElement('div');
                item.className = 'timeline-item';
                item.innerHTML = `
                    <span class="timeline-dot"></span>
                    <div class="timeline-content">
                        <div class="timeline-time">${l.time}</div>
                        <div class="timeline-text">${l.user} 执行 ${l.action}</div>
                    </div>
                `;
                containerEl.appendChild(item);
            });
        }
    }

    // Initialize
    renderMenu();
    // Default open
    // toggleSubmenu(document.querySelector('.submenu')); // Optional

    // ==========================================
    // Role Management Modals
    // ==========================================

    let roleModal = null;
    let permissionModal = null;

    window.openRoleModal = function(mode, data = null) {
        if (roleModal) roleModal.remove();

        const isEdit = mode === 'edit';
        const title = isEdit ? '修改' : '新增';
        const name = isEdit ? data.name : '';
        const key = isEdit ? data.key : '';
        const order = isEdit ? data.order : 0;
        const desc = isEdit ? (data.name) : ''; // Use name as desc mock

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-header">
                <span>${title}角色</span>
                <span class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</span>
            </div>
            <div class="modal-body">
                <div class="form-item">
                    <label class="form-label required">角色名称</label>
                    <div class="form-content">
                        <input type="text" class="form-input" value="${name}" placeholder="请输入">
                    </div>
                </div>
                <div class="form-item">
                    <label class="form-label required">角色标识</label>
                    <div class="form-content">
                        <input type="text" class="form-input" value="${key}" placeholder="请输入">
                    </div>
                </div>
                <div class="form-item">
                    <label class="form-label required">角色顺序</label>
                    <div class="form-content">
                        <input type="number" class="form-input" value="${order}">
                    </div>
                </div>
                <div class="form-item">
                    <label class="form-label">状态</label>
                    <div class="form-content">
                        <select class="form-input">
                            <option value="开启" ${isEdit && data.status === '开启' ? 'selected' : ''}>开启</option>
                            <option value="禁用" ${isEdit && data.status === '禁用' ? 'selected' : ''}>禁用</option>
                        </select>
                    </div>
                </div>
                <div class="form-item">
                    <label class="form-label">备注</label>
                    <div class="form-content">
                        <textarea class="form-textarea" placeholder="请输入">${desc}</textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn" onclick="this.closest('.modal-overlay').remove()">取消</button>
                <button class="btn btn-primary" onclick="alert('保存成功'); this.closest('.modal-overlay').remove()">确认</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        roleModal = overlay;
    };

    window.openMenuModal = function(mode, data = null) {
        const isEdit = mode === 'edit';
        const title = isEdit ? '编辑' : '新增';
        const name = isEdit ? data.name : '';
        const type = isEdit ? data.type : '目录'; // 目录, 菜单, 按钮
        const icon = isEdit ? data.icon : '';
        const order = isEdit ? data.order : 0;
        const permission = isEdit ? data.permission : '';
        const path = isEdit ? data.path : '';
        const status = isEdit ? data.status : '启用';
        
        // Status logic
        const statusActive = (status === '开启' || status === '启用') ? 'active' : '';
        const statusLabel = (status === '开启' || status === '启用') ? '正常' : '停用';

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.width = '600px'; // Slightly wider for menu form
        
        // Helper to generate segmented control options
        const getSegmentedHtml = (options, current) => {
            return options.map(opt => 
                `<div class="segmented-option ${opt === current ? 'active' : ''}" onclick="selectSegmented(this)">${opt}</div>`
            ).join('');
        };

        modal.innerHTML = `
            <div class="modal-header">
                <span>${title}界面配置</span>
                <span class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</span>
            </div>
            <div class="modal-body">
                <div class="form-item">
                    <label class="form-label">上级菜单</label>
                    <div class="form-content">
                        <input type="text" class="form-input" value="主目录" readonly style="cursor:pointer" onclick="alert('选择上级菜单')">
                    </div>
                </div>
                <div class="form-item">
                    <label class="form-label required">菜单类型</label>
                    <div class="form-content">
                        <div class="segmented-control">
                            ${getSegmentedHtml(['目录', '菜单', '按钮'], type)}
                        </div>
                    </div>
                </div>
                <div class="form-item">
                    <label class="form-label">菜单图标</label>
                    <div class="form-content">
                        <div class="form-input" style="display:flex; align-items:center">
                             <span style="margin-right:8px">${icon ? '📝' : '🔍'}</span>
                             <input type="text" value="${icon}" placeholder="点击选择图标" style="border:none; outline:none; width:100%">
                        </div>
                    </div>
                </div>
                <div class="form-item">
                    <label class="form-label required">菜单名称</label>
                    <div class="form-content">
                        <input type="text" class="form-input" value="${name}" placeholder="请输入菜单名称">
                    </div>
                </div>
                <div class="form-item">
                    <label class="form-label required">显示排序</label>
                    <div class="form-content">
                        <input type="number" class="form-input" value="${order}">
                    </div>
                </div>
                
                <!-- Dynamic Fields based on type (simplified for now showing all relevant) -->
                <div class="form-item">
                    <label class="form-label">路由地址</label>
                    <div class="form-content">
                        <input type="text" class="form-input" value="${path}" placeholder="请输入路由地址">
                    </div>
                </div>
                <div class="form-item">
                    <label class="form-label">组件路径</label>
                    <div class="form-content">
                        <input type="text" class="form-input" value="${path}" placeholder="请输入组件路径">
                    </div>
                </div>
                <div class="form-item">
                    <label class="form-label">权限字符</label>
                    <div class="form-content">
                        <input type="text" class="form-input" value="${permission}" placeholder="请输入权限字符">
                    </div>
                </div>
                <div class="form-item">
                    <label class="form-label">路由参数</label>
                    <div class="form-content">
                        <input type="text" class="form-input" placeholder="请输入路由参数">
                    </div>
                </div>
                <div class="form-item">
                    <label class="form-label">是否缓存</label>
                    <div class="form-content" style="display:flex; gap:24px">
                        <div style="display:flex; align-items:center">
                            <div class="toggle-switch active" onclick="toggleSwitch(this)"></div>
                            <span class="toggle-switch-label">缓存</span>
                        </div>
                        <div style="display:flex; align-items:center">
                             <span style="margin-right:8px">显示状态</span>
                             <div class="toggle-switch active" onclick="toggleSwitch(this)"></div>
                             <span class="toggle-switch-label">显示</span>
                        </div>
                         <div style="display:flex; align-items:center">
                             <span style="margin-right:8px">菜单状态</span>
                             <div class="toggle-switch ${statusActive}" onclick="toggleSwitch(this)"></div>
                             <span class="toggle-switch-label">${statusLabel}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn" onclick="this.closest('.modal-overlay').remove()">取消</button>
                <button class="btn btn-primary" onclick="alert('保存成功'); this.closest('.modal-overlay').remove()">确认</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        // Add global helpers if not exists
        if (!window.selectSegmented) {
            window.selectSegmented = function(el) {
                el.parentElement.querySelectorAll('.segmented-option').forEach(e => e.classList.remove('active'));
                el.classList.add('active');
            };
        }
        if (!window.toggleSwitch) {
            window.toggleSwitch = function(el) {
                el.classList.toggle('active');
                // Update label text logic
                const label = el.nextElementSibling;
                if (label && label.classList.contains('toggle-switch-label')) {
                     const text = label.textContent.trim();
                     if (text === '正常') label.textContent = '停用';
                     else if (text === '停用') label.textContent = '正常';
                     else if (text === '显示') label.textContent = '隐藏';
                     else if (text === '隐藏') label.textContent = '显示';
                     else if (text === '缓存') label.textContent = '不缓存';
                     else if (text === '不缓存') label.textContent = '缓存';
                }
            };
        }
    };

    window.openDictModal = function(mode, data = null) {
        const isEdit = mode === 'edit';
        const title = isEdit ? '修改' : '新增';
        const name = isEdit ? data.name : '';
        const dictType = isEdit ? (data.dictType || '') : '';
        const status = isEdit ? data.status : '开启';
        const remark = isEdit ? (data.remark || '') : '';

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.width = '600px'; 
        
        modal.innerHTML = `
            <div class="modal-header">
                <span>${title}</span>
                <span class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</span>
            </div>
            <div class="modal-body">
                <div class="form-item">
                    <label class="form-label required">字典名称</label>
                    <div class="form-content">
                        <input type="text" class="form-input" value="${name}" placeholder="请输入">
                    </div>
                </div>
                <div class="form-item">
                    <label class="form-label required">字典类型</label>
                    <div class="form-content">
                        <input type="text" class="form-input" value="${dictType}" placeholder="请输入">
                    </div>
                </div>
                <div class="form-item">
                    <label class="form-label">状态</label>
                    <div class="form-content">
                        <select class="form-select">
                            <option value="开启" ${status === '开启' ? 'selected' : ''}>开启</option>
                            <option value="禁用" ${status === '禁用' ? 'selected' : ''}>禁用</option>
                        </select>
                    </div>
                </div>
                 <div class="form-item">
                    <label class="form-label">备注</label>
                    <div class="form-content">
                        <textarea class="form-input" rows="3" placeholder="请输入">${remark}</textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn" onclick="this.closest('.modal-overlay').remove()">取消</button>
                <button class="btn btn-primary" onclick="alert('保存成功'); this.closest('.modal-overlay').remove()">确认</button>
            </div>
        `;
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    };

    window.openDictDataModal = function(mode, data = null) {
        const isEdit = mode === 'edit';
        const title = isEdit ? '修改' : '新增';
        // Mock data or empty
        const dictType = isEdit ? (data.dictType || '') : '';
        const label = isEdit ? (data.label || '') : '';
        const val = isEdit ? (data.val || '') : '';
        const sort = isEdit ? (data.sort || 0) : 0;
        const status = isEdit ? (data.status || '开启') : '开启';
        const colorType = isEdit ? (data.colorType || 'default') : 'default';
        const cssClass = isEdit ? (data.cssClass || '') : '';
        const remark = isEdit ? (data.remark || '') : '';

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.width = '600px'; 
        
        modal.innerHTML = `
            <div class="modal-header">
                <span>${title}</span>
                <span class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</span>
            </div>
            <div class="modal-body">
                <div class="form-item">
                    <label class="form-label required">字典类型</label>
                    <div class="form-content">
                        <input type="text" class="form-input" value="${dictType}" placeholder="请输入" style="border-color: #ff4d4f">
                        <div style="color: #ff4d4f; font-size: 12px; margin-top: 4px;">请输入字典类型</div>
                    </div>
                </div>
                <div class="form-item">
                    <label class="form-label required">数据标签</label>
                    <div class="form-content">
                        <input type="text" class="form-input" value="${label}" placeholder="请输入">
                    </div>
                </div>
                <div class="form-item">
                    <label class="form-label required">数据键值</label>
                    <div class="form-content">
                        <input type="text" class="form-input" value="${val}" placeholder="请输入">
                    </div>
                </div>
                <div class="form-item">
                    <label class="form-label required">显示排序</label>
                    <div class="form-content">
                        <input type="number" class="form-input" value="${sort}">
                    </div>
                </div>
                <div class="form-item">
                    <label class="form-label">状态</label>
                    <div class="form-content">
                         <select class="form-select">
                            <option value="开启" ${status === '开启' ? 'selected' : ''}>开启</option>
                            <option value="禁用" ${status === '禁用' ? 'selected' : ''}>禁用</option>
                        </select>
                    </div>
                </div>
                <div class="form-item">
                    <label class="form-label">颜色类型</label>
                    <div class="form-content">
                         <select class="form-select">
                            <option value="default" ${colorType === 'default' ? 'selected' : ''}>请选择</option>
                            <option value="primary" ${colorType === 'primary' ? 'selected' : ''}>primary</option>
                            <option value="success" ${colorType === 'success' ? 'selected' : ''}>success</option>
                            <option value="info" ${colorType === 'info' ? 'selected' : ''}>info</option>
                            <option value="warning" ${colorType === 'warning' ? 'selected' : ''}>warning</option>
                            <option value="danger" ${colorType === 'danger' ? 'selected' : ''}>danger</option>
                        </select>
                    </div>
                </div>
                <div class="form-item">
                    <label class="form-label">CSS Class <span title="样式类名" style="cursor:help">ⓘ</span></label>
                    <div class="form-content">
                        <input type="text" class="form-input" value="${cssClass}" placeholder="请输入">
                    </div>
                </div>
                <div class="form-item">
                    <label class="form-label">备注</label>
                    <div class="form-content">
                        <textarea class="form-input" rows="3" placeholder="请输入">${remark}</textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn" onclick="this.closest('.modal-overlay').remove()">取消</button>
                <button class="btn btn-primary" onclick="alert('保存成功'); this.closest('.modal-overlay').remove()">确认</button>
            </div>
        `;
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
     };

     window.openConfigModal = function(mode, data = null) {
        const isEdit = mode === 'edit';
        const title = isEdit ? '修改' : '新增';
        const category = isEdit ? (data.category || '') : '';
        const name = isEdit ? (data.name || '') : '';
        const keyName = isEdit ? (data.keyName || '') : '';
        const keyValue = isEdit ? (data.keyValue || '') : '';
        const visible = isEdit ? (data.visible || '是') : '是';
        const remark = isEdit ? (data.remark || '') : '';

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.width = '600px'; 
        
        modal.innerHTML = `
            <div class="modal-header">
                <span>${title}</span>
                <span class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</span>
            </div>
            <div class="modal-body">
                <div class="form-item">
                    <label class="form-label required">参数分类</label>
                    <div class="form-content">
                        <input type="text" class="form-input" value="${category}" placeholder="请输入">
                    </div>
                </div>
                <div class="form-item">
                    <label class="form-label required">参数名称</label>
                    <div class="form-content">
                        <input type="text" class="form-input" value="${name}" placeholder="请输入">
                    </div>
                </div>
                <div class="form-item">
                    <label class="form-label required">参数键名</label>
                    <div class="form-content">
                        <input type="text" class="form-input" value="${keyName}" placeholder="请输入">
                    </div>
                </div>
                <div class="form-item">
                    <label class="form-label required">参数键值</label>
                    <div class="form-content">
                        <textarea class="form-input" rows="3" placeholder="请输入">${keyValue}</textarea>
                    </div>
                </div>
                <div class="form-item">
                    <label class="form-label">是否可见</label>
                    <div class="form-content" style="display: flex; align-items: center; gap: 16px;">
                        <label style="display: flex; align-items: center; cursor: pointer;">
                            <input type="radio" name="visible" value="是" ${visible === '是' ? 'checked' : ''} style="margin-right: 4px;"> 是
                        </label>
                        <label style="display: flex; align-items: center; cursor: pointer;">
                            <input type="radio" name="visible" value="否" ${visible === '否' ? 'checked' : ''} style="margin-right: 4px;"> 否
                        </label>
                    </div>
                </div>
                <div class="form-item">
                    <label class="form-label">备注</label>
                    <div class="form-content">
                        <textarea class="form-input" rows="3" placeholder="请输入">${remark}</textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn" onclick="this.closest('.modal-overlay').remove()">取消</button>
                <button class="btn btn-primary" onclick="alert('保存成功'); this.closest('.modal-overlay').remove()">确认</button>
            </div>
        `;
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
     };

     window.openRoleDropdown = function(event, data, moduleId) {
        event.stopPropagation();
        // Remove existing dropdowns
        document.querySelectorAll('.dropdown-menu').forEach(d => d.remove());

        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown-menu';
        
        // Menu Permission Option
        const itemPerm = document.createElement('div');
        itemPerm.className = 'dropdown-item';
        
        const label = moduleId === 't08' ? '编辑' : '菜单权限';
        itemPerm.innerHTML = `<span class="icon">📝</span> ${label}`;
        
        itemPerm.onclick = () => {
            if (moduleId === 't08') {
                // If it's edit, maybe we should open role modal in edit mode?
                // But original logic called openPermissionModal.
                // Assuming user just wanted label change but keeping functionality (permissions)
                // OR they want to edit user details?
                // "Menu Permissions modified to Edit" - implies functionality might change too?
                // But for now, let's keep it safe or map to openRoleModal('edit', data) if it's user edit?
                // Wait, User Management 'Edit' usually edits user info.
                // Let's assume for now it's just label change or map to openPermissionModal as before.
                // But wait, "User Management" has "Actions: Assign Role, Delete, More".
                // "More -> Menu Permissions" (original).
                // "More -> Edit" (new).
                // If I click "Edit" on a user, I probably want to edit the user.
                // BUT, "Assign Role" is there.
                // Let's assume just label change for now as requested.
                openPermissionModal(data);
            } else {
                openPermissionModal(data);
            }
            dropdown.remove();
        };
        
        // Delete Option
        const itemDel = document.createElement('div');
        itemDel.className = 'dropdown-item';
        itemDel.innerHTML = '<span class="icon">🗑️</span> 删除';
        itemDel.onclick = () => {
            if (confirm('确认删除该角色吗？')) {
                alert('已删除');
            }
            dropdown.remove();
        };

        dropdown.appendChild(itemPerm);

        // Reset Password Option (Only for User Management t08)
        if (moduleId === 't08') {
            const itemReset = document.createElement('div');
            itemReset.className = 'dropdown-item';
            itemReset.innerHTML = '<span class="icon">🔑</span> 重置密码';
            itemReset.onclick = () => {
                if (confirm(`确认重置用户 ${data.cnName || data.name || '此用户'} 的密码吗？`)) {
                    alert('密码重置成功');
                }
                dropdown.remove();
            };
            dropdown.appendChild(itemReset);
        }

        dropdown.appendChild(itemDel);
        
        document.body.appendChild(dropdown);
        
        // Position
        const rect = event.target.getBoundingClientRect();
        dropdown.style.top = (rect.bottom + window.scrollY + 5) + 'px';
        dropdown.style.left = (rect.left + window.scrollX - 20) + 'px';
    };

    window.openPermissionModal = function(data) {
        if (permissionModal) permissionModal.remove();

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.width = '600px';
        
        // Transform menuData to treeData
        // Structure: Menu -> Submenu -> Buttons (as permissions)
        const treeData = menuData.map(menu => ({
            id: menu.id,
            name: menu.title,
            expanded: true,
            children: (menu.children || []).map(sub => ({
                id: sub.id,
                name: sub.title,
                expanded: false,
                children: (sub.buttons || []).map((btn, idx) => ({
                    id: sub.id + '_btn_' + idx,
                    name: btn
                }))
            }))
        }));

        // Helper: Recursive Tree Renderer
        function renderTree(nodes, level = 0) {
            let html = '';
            nodes.forEach(node => {
                const indent = level * 20;
                const isParent = node.children && node.children.length > 0;
                const toggleSymbol = isParent ? (node.expanded ? '▼' : '▶') : '';
                const toggleStyle = isParent ? 'cursor:pointer;' : 'visibility:hidden;';
                const checked = node.checked ? 'checked' : '';
                
                // Hide children if not expanded
                const childrenDisplay = (isParent && node.expanded) ? 'block' : 'none';

                html += `
                    <div class="tree-node" data-id="${node.id}">
                        <div class="tree-node-content" style="padding-left: ${indent}px">
                            <span class="tree-toggle" style="width: 20px; display:inline-block; ${toggleStyle}">${toggleSymbol}</span>
                            <input type="checkbox" class="tree-checkbox" ${checked}>
                            <span class="tree-label">${node.name}</span>
                        </div>
                        <div class="tree-children" style="display: ${childrenDisplay}">
                            ${isParent ? renderTree(node.children, level + 1) : ''}
                        </div>
                    </div>
                `;
            });
            return html;
        }

        modal.innerHTML = `
            <div class="modal-header">
                <span>修改角色菜单权限</span>
                <span class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</span>
            </div>
            <div class="modal-body">
                <div class="form-item">
                    <label class="form-label">角色名称</label>
                    <div class="form-content">
                        <input type="text" class="form-input" value="${data.name}" readonly style="background:#f5f5f5">
                    </div>
                </div>
                <div class="form-item">
                    <label class="form-label">角色标识</label>
                    <div class="form-content">
                        <input type="text" class="form-input" value="${data.key}" readonly style="background:#f5f5f5">
                    </div>
                </div>
                <div class="form-item">
                    <label class="form-label">菜单权限</label>
                    <div class="form-content">
                        <div class="permission-tree">
                            <div class="tree-search">
                                <input type="text" placeholder="菜单分配">
                                <span style="position:absolute; right:8px; top:5px; color:#999">🔍</span>
                            </div>
                            <div class="form-item" style="margin-bottom:0">
                                <div style="display:flex; align-items:center; margin-bottom:8px">
                                     <label style="margin-right:16px"><input type="checkbox" id="tree-expand-all" style="margin-right:4px"> 展开/折叠</label>
                                     <label style="margin-right:16px"><input type="checkbox" id="tree-check-all" style="margin-right:4px"> 全选/全不选</label>
                                     <label><input type="checkbox" id="tree-linkage" checked style="margin-right:4px"> 父子联动</label>
                                </div>
                            </div>
                            <div class="tree-content" id="tree-root">
                                ${renderTree(treeData)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn" onclick="this.closest('.modal-overlay').remove()">取消</button>
                <button class="btn btn-primary" onclick="alert('权限保存成功'); this.closest('.modal-overlay').remove()">确认</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        permissionModal = overlay;

        // --- Event Handlers ---
        const treeRoot = modal.querySelector('#tree-root');

        // Toggle Expand/Collapse
        treeRoot.addEventListener('click', (e) => {
            if (e.target.classList.contains('tree-toggle')) {
                const node = e.target.closest('.tree-node');
                const children = node.querySelector('.tree-children');
                if (children) {
                    const isHidden = children.style.display === 'none';
                    children.style.display = isHidden ? 'block' : 'none';
                    e.target.textContent = isHidden ? '▼' : '▶';
                }
            }
        });

        // Expand/Collapse All
        const expandAllCb = modal.querySelector('#tree-expand-all');
        expandAllCb.addEventListener('change', (e) => {
            const isExpand = e.target.checked;
            const toggles = treeRoot.querySelectorAll('.tree-toggle');
            const childrenDivs = treeRoot.querySelectorAll('.tree-children');
            
            toggles.forEach(t => {
                if (t.style.visibility !== 'hidden') t.textContent = isExpand ? '▼' : '▶';
            });
            childrenDivs.forEach(d => d.style.display = isExpand ? 'block' : 'none');
        });

        // Select All
        const checkAllCb = modal.querySelector('#tree-check-all');
        checkAllCb.addEventListener('change', (e) => {
            const checkboxes = treeRoot.querySelectorAll('.tree-checkbox');
            checkboxes.forEach(cb => cb.checked = e.target.checked);
        });

        // Parent-Child Linkage (Basic)
        treeRoot.addEventListener('change', (e) => {
            if (e.target.classList.contains('tree-checkbox')) {
                const isLinked = modal.querySelector('#tree-linkage').checked;
                if (!isLinked) return;

                const isChecked = e.target.checked;
                const node = e.target.closest('.tree-node');
                
                // Select all children
                const children = node.querySelector('.tree-children');
                if (children) {
                    const childCbs = children.querySelectorAll('.tree-checkbox');
                    childCbs.forEach(cb => cb.checked = isChecked);
                }

                // Check parent (optional: if all siblings checked, check parent)
                // This is complex to implement perfectly in vanilla JS without data binding, 
                // but we can do a simple "if checking, check parent" logic.
                if (isChecked) {
                    let parent = node.parentElement.closest('.tree-node');
                    while (parent) {
                        const parentCb = parent.querySelector('.tree-node-content .tree-checkbox');
                        if (parentCb) parentCb.checked = true;
                        parent = parent.parentElement.closest('.tree-node');
                    }
                }
            }
        });
    };

    // ==========================================
    // App Management Modals
    // ==========================================

    window.openCreateAppModal = function() {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-header">
                <span>新建应用</span>
                <span class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</span>
            </div>
            <div class="modal-body">
                <div class="form-item">
                    <label class="form-label required">应用名称</label>
                    <div class="form-content">
                        <input type="text" class="form-input" placeholder="支持汉字、数字、字母、下划线、中划线，不超过15个">
                    </div>
                </div>
                <div class="form-item">
                    <label class="form-label required">应用类型</label>
                    <div class="form-content">
                        <select class="form-input">
                            <option value="">请选择应用类型</option>
                            <option value="web">Web应用</option>
                            <option value="mobile">移动应用</option>
                            <option value="desktop">桌面应用</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn" onclick="this.closest('.modal-overlay').remove()">取消</button>
                <button class="btn btn-primary" onclick="alert('新建成功'); this.closest('.modal-overlay').remove()">新建</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    window.openWhitelistModal = function(row) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-header">
                <span>白名单设置 - ${row.appName || ''}</span>
                <span class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</span>
            </div>
            <div class="modal-body">
                <div class="form-item">
                    <label class="form-label">白名单IP</label>
                    <div class="form-content">
                        <textarea class="form-textarea" placeholder="输入框汇总分号或换行输入里面的值" style="height: 150px;"></textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn" onclick="this.closest('.modal-overlay').remove()">取消</button>
                <button class="btn btn-primary" onclick="alert('设置成功'); this.closest('.modal-overlay').remove()">确认</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

});
