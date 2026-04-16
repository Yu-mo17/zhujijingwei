         let currentBuildings = [];
        let currentFilter = 'all';
        let currentSearchTerm = '';

        document.addEventListener('DOMContentLoaded', function() {
            console.log('页面加载完成，开始初始化...');
            
            initializePage();
            setupSearch();
            setupBuildingFilters();
            setupDailyFeatured();
            loadBuildings();
        });


        function initializePage() {
            console.log('初始化页面...');
            if (!window.supabaseClient) {
                console.error('Supabase客户端未初始化');
                showError('数据库连接失败，请刷新页面重试');
                return;
            }
        }

        async function loadBuildings() {
            console.log('从Supabase加载建筑数据...');
            
            const grid = document.getElementById('buildings-grid');
            if (!grid) {
                console.error('找不到buildings-grid元素');
                return;
            }
            
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                    <div class="loading-spinner"></div>
                    <p style="color: #666;">正在加载建筑数据...</p>
                </div>
            `;
            
            try {
                let query = window.supabaseClient
                    .from('buildings')
                    .select('*')
                    .eq('是否激活', true);
                
                if (currentFilter !== 'all') {
                    query = query.eq('建筑类型', currentFilter);
                }
                
                if (currentSearchTerm.trim() !== '') {
                    const searchTerm = currentSearchTerm.trim().toLowerCase();
                    query = query.or(`建筑名称.ilike.%${searchTerm}%,地理位置.ilike.%${searchTerm}%,简短介绍.ilike.%${searchTerm}%,历史时期.ilike.%${searchTerm}%`);
                }
                
                const { data, error } = await query;
                
                if (error) {
                    console.error('Supabase查询错误:', error);
                    throw error;
                }
                
                console.log(`成功加载 ${data.length} 条建筑数据`);
                currentBuildings = data;
                
                renderBuildingsGrid(data);
                
            } catch (error) {
                console.error('加载建筑数据失败:', error);
                grid.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #e74c3c;">
                        <h3>数据加载失败</h3>
                        <p>无法连接到数据库，请检查网络连接后刷新页面重试。</p>
                        <button onclick="loadBuildings()" style="margin-top: 20px; padding: 10px 20px; background: #8b0000; color: white; border: none; border-radius: 5px; cursor: pointer;">重试</button>
                    </div>
                `;
            }
        }

        function renderBuildingsGrid(buildings) {
            const grid = document.getElementById('buildings-grid');
            if (!grid) return;
            
            grid.innerHTML = '';
            
            if (!buildings || buildings.length === 0) {
                const message = currentSearchTerm 
                    ? `未找到与"${currentSearchTerm}"相关的建筑模型`
                    : '暂无建筑模型数据';
                    
                grid.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #7f8c8d;">
                        <h3>${currentSearchTerm ? '未找到结果' : '暂无模型'}</h3>
                        <p>${message}。请尝试其他关键词或稍后再来。</p>
                    </div>
                `;
                return;
            }
            
            buildings.forEach(building => {
                const card = document.createElement('a');
                card.className = 'building-card';
                card.href = building['详情页链接'];
                
                let tagsHtml = '';
                if (building['标签'] && building['标签'].length > 0) {
                    tagsHtml = building['标签'].slice(0, 3).map(tag => 
                        `<span class="tag">${tag}</span>`
                    ).join('');
                }
                
                card.innerHTML = `
                    <div class="building-image">
                        <img src="${building['缩略图链接'] || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect width="400" height="200" fill="%23f0f0f0"/><text x="200" y="100" font-family="Arial" font-size="16" text-anchor="middle" fill="%23999">建筑图片</text></svg>'}" 
                             alt="${building['建筑名称']}" 
                             loading="lazy"
                             onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"400\" height=\"200\"><rect width=\"400\" height=\"200\" fill=\"%23f0f0f0\"/><text x=\"200\" y=\"100\" font-family=\"Arial\" font-size=\"16\" text-anchor="middle" fill=\"%23999\">建筑图片</text></svg>'">
                    </div>
                    <div class="building-info">
                        <h3>${building['建筑名称']}</h3>
                        <div class="building-location">${building['地理位置']}</div>
                        <div class="building-period">${building['历史时期']} · ${building['建筑类型']}</div>
                        <p class="building-description">${building['简短介绍'] || ''}</p>
                        ${tagsHtml ? `<div class="tags-container">${tagsHtml}</div>` : ''}
                    </div>
                `;
                
                grid.appendChild(card);
            });
        }

        function setupSearch() {
            const searchInput = document.getElementById('searchInput');
            if (!searchInput) return;
            
            let timeoutId;
            
            searchInput.addEventListener('input', function(e) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    currentSearchTerm = e.target.value;
                    console.log(`搜索关键词: "${currentSearchTerm}"`);
                    loadBuildings();
                }, 300); 
            });
            
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    currentSearchTerm = e.target.value;
                    loadBuildings();
                }
            });
        }

        function setupBuildingFilters() {
            const filterButtons = document.querySelectorAll('.building-filter');
            if (!filterButtons.length) return;
            
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    
                    currentFilter = this.getAttribute('data-type');
                    console.log(`筛选类型: ${currentFilter}`);
                    
                    loadBuildings();
                });
            });
        }

        async function setupDailyFeatured() {
            console.log('设置每日推荐...');
            
            try {
                const today = new Date();
                const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
                
                const { data: allBuildings, error: fetchError } = await window.supabaseClient
                    .from('buildings')
                    .select('*')
                    .eq('是否激活', true);
                
                if (fetchError) throw fetchError;
                
                if (!allBuildings || allBuildings.length === 0) {
                    console.warn('没有可用的建筑数据用于每日推荐');
                    return;
                }
                
                const index = seed % allBuildings.length;
                const featuredBuilding = allBuildings[index];
                
                updateFeaturedCard(featuredBuilding);
                
            } catch (error) {
                console.error('设置每日推荐失败:', error);
                updateFeaturedCard(null);
            }
        }

        function updateFeaturedCard(building) {
            if (!building) {
                const featuredCard = document.querySelector('.daily-featured-sidebar .featured-card');
                if (featuredCard) {
                    featuredCard.innerHTML = `
                        <div class="featured-header">
                            <h3> 每日一筑</h3>
                            <p>探索今日为您推荐的中国建筑瑰宝</p>
                        </div>
                        <div class="featured-info">
                            <h4>暂无推荐</h4>
                            <p class="featured-description">今天暂时没有推荐建筑，请稍后再来查看。</p>
                        </div>
                    `;
                }
                return;
            }
            
            const elements = {
                'dailyFeaturedName': building['建筑名称'],
                'dailyFeaturedLocation': `📍 ${building['地理位置']}`,
                'dailyFeaturedPeriod': `${building['历史时期']} · ${building['建筑类型']}`,
                'dailyFeaturedDesc': building['简短介绍'] || '',
                'dailyFeaturedLink': building['详情页链接']
            };
            
            Object.entries(elements).forEach(([id, value]) => {
                const element = document.getElementById(id);
                if (element) {
                    if (id === 'dailyFeaturedLink') {
                        element.href = value;
                    } else if (id === 'dailyFeaturedName') {
                        element.textContent = value;
                    } else if (id === 'dailyFeaturedDesc') {
                        element.textContent = value;
                    } else {
                        element.innerHTML = value;
                    }
                }
            });
            
            const imageElement = document.getElementById('dailyFeaturedImage');
            if (imageElement) {
                imageElement.src = building['缩略图链接'] || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect width="400" height="200" fill="%23f0f0f0"/><text x="200" y="100" font-family="Arial" font-size="16" text-anchor="middle" fill="%23999">建筑图片</text></svg>';
                imageElement.alt = building['建筑名称'];
            }
        }

        function showError(message) {
            console.error('显示错误:', message);
        }