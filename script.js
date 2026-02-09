document.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.getElementById('menu-container');
    const breadcrumb = document.getElementById('breadcrumb');
    const moduleContent = document.getElementById('module-content');
    const welcomeScreen = document.querySelector('.welcome-screen');

    // Render Menu
    function renderMenu() {
        menuData.forEach(menu => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            
            const title = document.createElement('div');
            title.className = 'menu-title';
            title.innerHTML = `<span class="icon">${menu.icon}</span>${menu.title}`;
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

    function renderModule(moduleData) {
        moduleContent.innerHTML = '';

        // 1. Search Panel
        if (moduleData.searchFields) {
            const searchPanel = document.createElement('div');
            searchPanel.className = 'search-panel';
            
            moduleData.searchFields.forEach(field => {
                const item = document.createElement('div');
                item.className = 'search-item';
                
                const label = document.createElement('label');
                label.textContent = field.label;
                item.appendChild(label);

                if (field.type === 'text') {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.placeholder = field.placeholder || '';
                    item.appendChild(input);
                } else if (field.type === 'select') {
                    const select = document.createElement('select');
                    field.options.forEach(opt => {
                        const option = document.createElement('option');
                        option.value = opt;
                        option.textContent = opt;
                        select.appendChild(option);
                    });
                    item.appendChild(select);
                } else if (field.type === 'date-range') {
                    const input1 = document.createElement('input');
                    input1.type = 'text'; // using text for simplicity or date
                    input1.placeholder = '开始日期';
                    input1.onfocus = (e) => e.target.type = 'date';
                    input1.onblur = (e) => e.target.type = 'text';
                    input1.style.width = '120px';
                    
                    const span = document.createElement('span');
                    span.textContent = '→';
                    span.style.color = '#999';

                    const input2 = document.createElement('input');
                    input2.type = 'text';
                    input2.placeholder = '结束日期';
                    input2.onfocus = (e) => e.target.type = 'date';
                    input2.onblur = (e) => e.target.type = 'text';
                    input2.style.width = '120px';

                    item.appendChild(input1);
                    item.appendChild(span);
                    item.appendChild(input2);
                }

                searchPanel.appendChild(item);
            });

            // Search Buttons
            const btnGroup = document.createElement('div');
            btnGroup.className = 'search-buttons';
            
            const btnReset = document.createElement('button');
            btnReset.className = 'btn';
            btnReset.textContent = '重置';
            
            const btnSearch = document.createElement('button');
            btnSearch.className = 'btn btn-primary';
            btnSearch.textContent = '查询';

            btnGroup.appendChild(btnReset);
            btnGroup.appendChild(btnSearch);
            searchPanel.appendChild(btnGroup);

            moduleContent.appendChild(searchPanel);
        }

        // 2. Content Panel (Toolbar + Table)
        const contentPanel = document.createElement('div');
        contentPanel.className = 'content-panel';

        // Toolbar Header
        const toolbarHeader = document.createElement('div');
        toolbarHeader.className = 'toolbar-header';

        const title = document.createElement('div');
        title.className = 'toolbar-title';
        // Use logic: if user management, show "账号列表", else "列表"
        title.textContent = moduleData.title.includes('用户') ? '账号列表' : (moduleData.title + '列表');
        toolbarHeader.appendChild(title);

        const actions = document.createElement('div');
        actions.className = 'toolbar-actions';
        if (moduleData.buttons) {
            moduleData.buttons.forEach((btnText, index) => {
                const btn = document.createElement('button');
                // First button usually primary ("New")
                const isPrimary = index === 0 && (btnText.includes('新增') || btnText.includes('新建'));
                btn.className = isPrimary ? 'btn btn-primary' : 'btn';
                btn.textContent = btnText;
                btn.onclick = () => alert(`点击了: ${btnText}`);
                actions.appendChild(btn);
            });
            // Add extra tools icons (refresh, search, settings) - mock
            const tools = ['↻', '🔍', '⚙️'];
            tools.forEach(t => {
                const span = document.createElement('span');
                span.textContent = t;
                span.style.marginLeft = '10px';
                span.style.cursor = 'pointer';
                span.style.color = '#666';
                actions.appendChild(span);
            });
        }
        toolbarHeader.appendChild(actions);
        contentPanel.appendChild(toolbarHeader);

        // Table
        const tableContainer = document.createElement('div');
        tableContainer.className = 'table-container';
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        
        // Render Header
        const trHead = document.createElement('tr');
        // Checkbox column
        const thCheck = document.createElement('th');
        const checkboxAll = document.createElement('input');
        checkboxAll.type = 'checkbox';
        checkboxAll.className = 'table-checkbox';
        thCheck.appendChild(checkboxAll);
        thCheck.style.width = '40px';
        trHead.appendChild(thCheck);

        if (moduleData.columns) {
            moduleData.columns.forEach(col => {
                const th = document.createElement('th');
                th.textContent = col === '操作' ? '操作' : col;
                trHead.appendChild(th);
            });
        }
        thead.appendChild(trHead);
        table.appendChild(thead);

        // Render Body
        if (moduleData.data && moduleData.data.length > 0) {
            moduleData.data.forEach((row, idx) => {
                const tr = document.createElement('tr');
                
                // Checkbox
                const tdCheck = document.createElement('td');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'table-checkbox';
                tdCheck.appendChild(checkbox);
                tr.appendChild(tdCheck);

                // Data Columns (excluding 'actions' property if strictly following columns array)
                // We need to map columns array to row properties. 
                // Since data.js keys might not match columns 1:1 perfectly in generic code, we iterate keys or use column mapping.
                // For this specific task, we'll iterate the object values excluding 'actions'.
                
                // Better approach: Iterate moduleData.columns and try to find matching value or just iterate object values.
                // Given the data structure in data.js is specifically ordered to match columns (mostly), we can iterate object values.
                // Exception: 'actions' key in row.
                
                const entries = Object.entries(row);
                entries.forEach(([key, val]) => {
                    if (key === 'actions') return; // Handle actions separately at the end

                    const td = document.createElement('td');
                    
                    // Badge Logic
                    if ((key === 'status' || key === 'type' || key === 'state') && typeof val === 'string') {
                        const span = document.createElement('span');
                        span.className = 'badge';
                        if (val === '启用' || val === '正常' || val === 'Success' || val === 'Active' || val === 'Fixed' || val === 'OK' || val === '成功' || val === '生效' || val.includes('百胜')) {
                            span.classList.add('badge-primary'); // Blue for internal/active
                            if (val.includes('启用') || val === '成功' || val === '生效') span.className = 'badge badge-success'; // Green for enabled/success

                        } else if (val === '禁用' || val === '厂商用户') {
                            span.classList.add('badge-default'); // Grey for disabled/vendor
                            if (val.includes('厂商')) span.style.color = '#52c41a'; // Special green text for vendor as per image? No, image has "Vendor" as Green outline maybe?
                            // Image: "厂商用户" is Green outline, "百胜内部" is Blue outline.
                            if (val === '厂商用户') {
                                span.className = 'badge';
                                span.style.borderColor = '#52c41a';
                                span.style.color = '#52c41a';
                                span.style.backgroundColor = '#f6ffed';
                            }
                        } else {
                            span.classList.add('badge-default');
                        }
                        span.textContent = val;
                        td.appendChild(span);
                    } else {
                        td.textContent = val;
                    }
                    tr.appendChild(td);
                });

                // Actions Column
                // If the last column in 'columns' is '操作' or we have 'actions' in data
                if (row.actions) {
                    const tdAction = document.createElement('td');
                    row.actions.forEach(action => {
                        const a = document.createElement('a');
                        a.href = 'javascript:void(0)';
                        a.textContent = action;
                        a.className = action === '删除' ? 'action-link delete' : 'action-link';
                        a.onclick = (e) => {
                            if (action === '分配角色') {
                                openAssignRoleModal(row);
                            } else if (action === '删除') {
                                openDeleteConfirm(e, row);
                            } else if (action === '更多') {
                                openMoreDropdown(e, row);
                            } else {
                                alert(`${action}: ${row.name || row.account || 'Item'}`);
                            }
                        };
                        
                        // Add arrow for "More"
                        if (action === '更多') {
                             const arrow = document.createElement('span');
                             arrow.textContent = 'v'; // Simple arrow
                             arrow.style.fontSize = '10px';
                             arrow.style.marginLeft = '2px';
                             a.appendChild(arrow);
                        }
                        
                        tdAction.appendChild(a);
                    });
                    tr.appendChild(tdAction);
                } else if (moduleData.columns.includes('操作')) {
                     // Fallback actions if not in data
                     const tdAction = document.createElement('td');
                     const a = document.createElement('a');
                     a.textContent = '编辑';
                     a.className = 'action-link';
                     tdAction.appendChild(a);
                     tr.appendChild(tdAction);
                }

                tbody.appendChild(tr);
            });
        } else {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = (moduleData.columns ? moduleData.columns.length : 0) + 2;
            td.textContent = '暂无数据';
            td.style.textAlign = 'center';
            td.style.padding = '30px';
            td.style.color = '#999';
            tr.appendChild(td);
            tbody.appendChild(tr);
        }
        
        table.appendChild(tbody);
        tableContainer.appendChild(table);
        contentPanel.appendChild(tableContainer);

        moduleContent.appendChild(contentPanel);
    }

    // ==========================================
    // Interaction Handlers (Modal, Popconfirm, Dropdown)
    // ==========================================

    // 1. Assign Role Modal
    let assignRoleModal = null;

    function createAssignRoleModal() {
        if (assignRoleModal) return assignRoleModal;

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        // Header
        const header = document.createElement('div');
        header.className = 'modal-header';
        header.innerHTML = `
            <span>用户角色权限</span>
            <button class="modal-close">×</button>
        `;
        
        // Body
        const body = document.createElement('div');
        body.className = 'modal-body';
        body.innerHTML = `
            <div class="form-item">
                <label class="form-label">账号</label>
                <div class="form-value">
                    <input type="text" class="form-input-readonly" id="modal-account" readonly>
                </div>
            </div>
            <div class="form-item">
                <label class="form-label">中文名</label>
                <div class="form-value">
                    <input type="text" class="form-input-readonly" id="modal-cnname" readonly>
                </div>
            </div>
            <div class="form-item">
                <label class="form-label">角色</label>
                <div class="form-value">
                    <div class="role-tag-input" id="modal-role-input">
                        <!-- Tags will be injected here -->
                    </div>
                </div>
            </div>
        `;
        
        // Footer
        const footer = document.createElement('div');
        footer.className = 'modal-footer';
        
        const btnCancel = document.createElement('button');
        btnCancel.className = 'btn';
        btnCancel.textContent = '取消';
        btnCancel.style.marginRight = '10px';
        btnCancel.onclick = closeAssignRoleModal;
        
        const btnConfirm = document.createElement('button');
        btnConfirm.className = 'btn btn-primary';
        btnConfirm.textContent = '确认';
        btnConfirm.onclick = () => {
            alert('角色分配保存成功');
            closeAssignRoleModal();
        };
        
        footer.appendChild(btnCancel);
        footer.appendChild(btnConfirm);
        
        modal.appendChild(header);
        modal.appendChild(body);
        modal.appendChild(footer);
        overlay.appendChild(modal);
        
        document.body.appendChild(overlay);
        
        // Close events
        header.querySelector('.modal-close').onclick = closeAssignRoleModal;
        overlay.onclick = (e) => {
            if (e.target === overlay) closeAssignRoleModal();
        };

        assignRoleModal = overlay;
        return assignRoleModal;
    }

    function openAssignRoleModal(row) {
        const modalOverlay = createAssignRoleModal();
        
        // Populate data
        document.getElementById('modal-account').value = row.account || '';
        document.getElementById('modal-cnname').value = row.cnName || '';
        
        // Mock Roles
        const roleContainer = document.getElementById('modal-role-input');
        roleContainer.innerHTML = `
            <span class="role-tag">普通角色 <span class="role-tag-close">×</span></span>
        `;
        
        modalOverlay.classList.add('show');
    }

    function closeAssignRoleModal() {
        if (assignRoleModal) {
            assignRoleModal.classList.remove('show');
        }
    }

    // 2. Delete Popconfirm
    let popconfirm = null;

    function createPopconfirm() {
        if (popconfirm) return popconfirm;

        const el = document.createElement('div');
        el.className = 'popconfirm';
        el.innerHTML = `
            <div class="popconfirm-content">
                <span class="popconfirm-icon">!</span> <!-- Replace with icon if needed -->
                <span class="popconfirm-title">是否要删除数据?</span>
            </div>
            <div class="popconfirm-buttons">
                <button class="btn btn-xs btn-cancel">取消</button>
                <button class="btn btn-xs btn-primary btn-confirm">确认</button>
            </div>
        `;
        
        // Style adjustments for icon
        const icon = el.querySelector('.popconfirm-icon');
        icon.style.display = 'inline-block';
        icon.style.width = '16px';
        icon.style.height = '16px';
        icon.style.lineHeight = '16px';
        icon.style.textAlign = 'center';
        icon.style.borderRadius = '50%';
        icon.style.backgroundColor = '#faad14';
        icon.style.color = '#fff';
        icon.style.marginRight = '8px';
        icon.textContent = '!'; // Simplified icon

        document.body.appendChild(el);
        popconfirm = el;
        
        // Bind events
        el.querySelector('.btn-cancel').onclick = () => {
            el.classList.remove('show');
        };
        el.querySelector('.btn-confirm').onclick = () => {
            alert('删除成功');
            el.classList.remove('show');
        };

        return popconfirm;
    }

    function openDeleteConfirm(e, row) {
        e.stopPropagation();
        closeAllPopups(); // Close others

        const el = createPopconfirm();
        const rect = e.target.getBoundingClientRect();
        
        el.style.top = (rect.top - el.offsetHeight - 40) + 'px'; // Position above (rough estimate)
        // Actually, let's calculate properly after display block to get height
        el.style.display = 'block'; // Force show to get dimensions
        el.classList.add('show');
        
        const popHeight = el.offsetHeight;
        const popWidth = el.offsetWidth;
        
        // Position top-left relative to button
        let top = rect.top - popHeight - 10;
        let left = rect.left;
        
        // Basic boundary check
        if (top < 0) top = rect.bottom + 10; // Flip to bottom if no space top
        
        el.style.top = top + 'px';
        el.style.left = left + 'px';
    }

    // 3. More Dropdown
    let dropdownMenu = null;

    function createDropdown() {
        if (dropdownMenu) return dropdownMenu;

        const el = document.createElement('div');
        el.className = 'dropdown-menu';
        el.innerHTML = `
            <div class="dropdown-item">📄 单点图标</div>
            <div class="dropdown-item">📄 移动单点图标</div>
        `;
        
        document.body.appendChild(el);
        dropdownMenu = el;
        
        // Bind item clicks
        el.querySelectorAll('.dropdown-item').forEach(item => {
            item.onclick = () => {
                alert(`选择了: ${item.textContent.trim()}`);
                el.classList.remove('show');
            };
        });

        return dropdownMenu;
    }

    function openMoreDropdown(e, row) {
        e.stopPropagation();
        closeAllPopups();

        const el = createDropdown();
        const rect = e.target.getBoundingClientRect();
        
        el.classList.add('show');
        
        // Position bottom-left relative to button
        el.style.top = (rect.bottom + 5) + 'px';
        el.style.left = rect.left + 'px';
    }

    function closeAllPopups() {
        if (popconfirm) popconfirm.classList.remove('show');
        if (dropdownMenu) dropdownMenu.classList.remove('show');
    }

    // Global click listener to close popups
    document.addEventListener('click', (e) => {
        // If click is not inside popconfirm or dropdown, close them
        if (popconfirm && popconfirm.classList.contains('show') && !popconfirm.contains(e.target)) {
            popconfirm.classList.remove('show');
        }
        if (dropdownMenu && dropdownMenu.classList.contains('show') && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove('show');
        }
    });


    // Initialize
    try {
        if (typeof menuData === 'undefined') {
            console.error('menuData is not defined.');
        } else {
            renderMenu();
        }
    } catch (e) {
        console.error(e);
    }
});
