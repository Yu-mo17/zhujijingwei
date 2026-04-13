(function() {
            if (typeof echarts === 'undefined') return;
            const officialDynastyData = [
                { dynasty: '夏', value: 3, type: '遗址', color: '#8e44ad' },
                { dynasty: '商', value: 12, type: '遗址', color: '#9b59b6' },
                { dynasty: '周', value: 28, type: '遗址', color: '#3498db' },
                { dynasty: '秦', value: 8, type: '遗址/建筑', color: '#5dade2' },
                { dynasty: '汉', value: 45, type: '遗址/建筑', color: '#2ecc71' },
                { dynasty: '魏晋南北朝', value: 32, type: '遗址/建筑', color: '#27ae60' },
                { dynasty: '隋', value: 15, type: '遗址/建筑', color: '#e67e22' },
                { dynasty: '唐', value: 42, type: '建筑/遗址', color: '#f39c12' },
                { dynasty: '五代十国', value: 18, type: '建筑/遗址', color: '#d35400' },
                { dynasty: '宋', value: 156, type: '建筑', color: '#c0392b' },
                { dynasty: '辽', value: 28, type: '建筑', color: '#e74c3c' },
                { dynasty: '金', value: 45, type: '建筑', color: '#1abc9c' },
                { dynasty: '元', value: 89, type: '建筑', color: '#16a085' },
                { dynasty: '明', value: 1248, type: '建筑', color: '#8e44ad' },
                { dynasty: '清', value: 1856, type: '建筑', color: '#2c3e50' }
            ];

            const buildingTypeData = [
                { name: '民居宅第', value: 803, percentage: 28.7 },
                { name: '城防关隘', value: 518, percentage: 18.5 },
                { name: '宫殿府衙', value: 175, percentage: 6.3 },
                { name: '塔幢经幢', value: 89, percentage: 3.2 },
                { name: '桥梁码头', value: 75, percentage: 2.7 },
                { name: '园林', value: 45, percentage: 1.6 },
            ];

            const typeEvolutionData = {
                categories: ['汉', '唐', '宋', '明', '清'],
                palace: [12, 8, 5, 18, 25],
                temple: [45, 65, 85, 120, 150],
                residence: [25, 18, 35, 85, 120],
                defense: [15, 8, 12, 45, 60],
                tomb: [3, 1, 2, 8, 10],
                garden: [0, 0, 2, 12, 20]
            };

            const regionData = [
                { name: '山西', value: 421, rank: 1, representativeBuildings: [ '平遥古城'] },
                { name: '河北', value: 287, rank: 2, representativeBuildings: ['赵州桥', '山海关', '承德避暑山庄'] },
                { name: '陕西', value: 256, rank: 3, representativeBuildings: ['西安城墙', '大雁塔'] },
                { name: '浙江', value: 234, rank: 4, representativeBuildings: ['西湖古建筑群', '普陀山古建筑群'] },
                { name: '河南', value: 198, rank: 5, representativeBuildings: ['嵩山古建筑群', '白马寺', '龙门石窟'] },
                { name: '四川', value: 176, rank: 6, representativeBuildings: ['都江堰', '青城山古建筑群'] },
                { name: '江苏', value: 165, rank: 7, representativeBuildings: ['苏州园林', '中山陵', '周庄古镇'] },
                { name: '安徽', value: 143, rank: 8, representativeBuildings: ['徽派古民居', '宏村', '西递', '黄山古建筑群'] },
                { name: '福建', value: 128, rank: 9, representativeBuildings: ['土楼', '福州三坊七巷', '武夷山古建筑'] },
                { name: '云南', value: 112, rank: 10, representativeBuildings: ['丽江古城', '崇圣寺三塔', '和顺古镇', '大理古城'] },
                { name: '湖北', value: 98, rank: 11, representativeBuildings: ['武当山古建筑群', '荆州古城'] },
                { name: '山东', value: 95, rank: 12, representativeBuildings: ['曲阜三孔', '泰山古建筑群', '蓬莱阁'] },
                { name: '甘肃', value: 87, rank: 13, representativeBuildings: ['莫高窟', '嘉峪关'] },
                { name: '湖南', value: 85, rank: 14, representativeBuildings: ['岳麓书院', '凤凰古城', '岳阳楼'] },
                { name: '江西', value: 79, rank: 15, representativeBuildings: ['庐山古建筑群', '景德镇古窑'] },
                { name: '广东', value: 76, rank: 16, representativeBuildings: ['开平碉楼'] },
                { name: '广西', value: 68, rank: 17, representativeBuildings: ['桂林靖江王城', '程阳永济桥', '友谊关'] },
                { name: '辽宁', value: 65, rank: 18, representativeBuildings: ['沈阳故宫', '兴城古城'] },
                { name: '西藏', value: 58, rank: 19, representativeBuildings: ['布达拉宫'] },
                { name: '内蒙古', value: 52, rank: 20, representativeBuildings: ['五当召'] },
                { name: '重庆', value: 48, rank: 21, representativeBuildings: ['大足石刻','白帝城'] },
                { name: '贵州', value: 45, rank: 22, representativeBuildings: ['镇远古城'] },
                { name: '北京', value: 42, rank: 23, representativeBuildings: ['故宫', '天坛', '颐和园', '八达岭长城'] },
                { name: '吉林', value: 38, rank: 24, representativeBuildings: ['伪满皇宫', '长白山古建筑', '珲春防川'] },
                { name: '新疆', value: 35, rank: 25, representativeBuildings: ['高昌故城', '交河故城', '克孜尔石窟'] },
                { name: '天津', value: 31, rank: 26, representativeBuildings: ['黄崖关长城'] },
                { name: '上海', value: 28, rank: 27, representativeBuildings: ['豫园'] },
                { name: '黑龙江', value: 26, rank: 28, representativeBuildings: ['中央大街', '金上京遗址'] },
                { name: '青海', value: 22, rank: 29, representativeBuildings: ['丹噶尔古城'] },
                { name: '宁夏', value: 19, rank: 30, representativeBuildings: [ '海宝塔', '镇北堡'] },
                { name: '海南', value: 15, rank: 31, representativeBuildings: [ '东坡书院'] },
                { name: '香港', value: 12, rank: 32, representativeBuildings: ['志莲净苑', '香港文物探知馆'] },
                { name: '澳门', value: 8, rank: 33, representativeBuildings: [ '郑家大屋'] },
                { name: '台湾', value: 0, rank: 34, representativeBuildings: ['数据暂缺'] }
            ];
            const totalBuildings = regionData.reduce((sum, item) => sum + item.value, 0);

            const chartTheme = {
                backgroundColor: '#ffffff',
                textStyle: { color: '#2c3e50' },
                axisLine: { lineStyle: { color: '#dcdde1' } },
                axisLabel: { color: '#7f8c8d' },
                splitLine: { lineStyle: { color: '#f0f0f0', type: 'dashed' } },
                tooltip: {
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    borderColor: '#c19a6b',
                    textStyle: { color: '#2c3e50' }
                }
            };

            function initDynastyChart() {
                const chart = echarts.init(document.getElementById('dynastyChart'));
                const option = {
                    ...chartTheme,
                    tooltip: {
                        ...chartTheme.tooltip,
                        formatter: function(params) {
                            const idx = params[0].dataIndex;
                            const item = officialDynastyData[idx];
                            return `${item.dynasty}<br/>现存数量: ${item.value} 处<br/>类型: ${item.type}`;
                        }
                    },
                    grid: { left: '8%', right: '5%', bottom: '10%', top: '10%', containLabel: true },
                    xAxis: {
                        type: 'category',
                        data: officialDynastyData.map(d => d.dynasty),
                        axisLabel: { rotate: 45, color: '#7f8c8d' },
                        axisLine: { lineStyle: { color: '#dcdde1' } }
                    },
                    yAxis: {
                        type: 'value',
                        name: '现存数量（处）',
                        nameTextStyle: { color: '#7f8c8d' },
                        axisLabel: { color: '#7f8c8d' },
                        splitLine: { lineStyle: { color: '#f0f0f0' } },
                        max: 2000
                    },
                    series: [{
                        type: 'bar',
                        data: officialDynastyData.map((d, i) => ({
                            value: d.value,
                            itemStyle: { color: d.color }
                        })),
                        barWidth: '60%',
                        label: {
                            show: true,
                            position: 'top',
                            color: '#2c3e50',
                            fontSize: 11,
                            formatter: (p) => p.value > 500 ? p.value : ''
                        }
                    }]
                };
                chart.setOption(option);
                window.addEventListener('resize', () => chart.resize());
            }

            function initBaiduMapChart() {
                const mapContainer = document.getElementById('baiduMapContainer');
                if (!mapContainer) return;

                // 1. 创建地图实例
                const map = new BMap.Map("baiduMapContainer");
                // 2. 设置初始中心点（中国中部）和缩放级别
                const point = new BMap.Point(105.0, 37.0);
                map.centerAndZoom(point, 5);
                // 3. 启用鼠标滚轮缩放
                map.enableScrollWheelZoom();
                // 4. （可选）添加缩放平移控件
                map.addControl(new BMap.NavigationControl());
                // 5. （可选）添加比例尺控件
                map.addControl(new BMap.ScaleControl());

                // 6. 准备数据：将 regionData 转换为百度地图需要的格式
                const points = [];
                const dataRange = { min: Infinity, max: -Infinity };

                // 预设各省会城市的经纬度（这是一个简化示例，实际项目应从数据库获取坐标）
                const provinceCoords = {
                    '山西': { lng: 112.549, lat: 37.857 },
                    '河北': { lng: 114.502, lat: 38.045 },
                    '陕西': { lng: 108.948, lat: 34.263 },
                    '浙江': { lng: 120.154, lat: 30.287 },
                    '河南': { lng: 113.665, lat: 34.758 },
                    '四川': { lng: 104.066, lat: 30.659 },
                    '江苏': { lng: 118.767, lat: 32.041 },
                    '安徽': { lng: 117.283, lat: 31.861 },
                    '福建': { lng: 119.306, lat: 26.075 },
                    '云南': { lng: 102.712, lat: 25.041 },
                    '湖北': { lng: 114.299, lat: 30.584 },
                    '山东': { lng: 117.001, lat: 36.675 },
                    '甘肃': { lng: 103.824, lat: 36.058 },
                    '湖南': { lng: 112.982, lat: 28.194 },
                    '江西': { lng: 115.892, lat: 28.676 },
                    '广东': { lng: 113.281, lat: 23.125 },
                    '广西': { lng: 108.32, lat: 22.824 },
                    '辽宁': { lng: 123.429, lat: 41.797 },
                    '西藏': { lng: 91.117, lat: 29.647 },
                    '内蒙古': { lng: 111.671, lat: 40.818 },
                    '重庆': { lng: 106.555, lat: 29.563 },
                    '贵州': { lng: 106.707, lat: 26.598 },
                    '北京': { lng: 116.407, lat: 39.904 },
                    '吉林': { lng: 125.35, lat: 43.886 },
                    '新疆': { lng: 87.618, lat: 43.792 },
                    '天津': { lng: 117.19, lat: 39.126 },
                    '上海': { lng: 121.475, lat: 31.23 },
                    '黑龙江': { lng: 126.642, lat: 45.757 },
                    '青海': { lng: 101.78, lat: 36.622 },
                    '宁夏': { lng: 106.278, lat: 38.466 },
                    '海南': { lng: 110.332, lat: 20.031 },
                    '香港': { lng: 114.173, lat: 22.32 },
                    '澳门': { lng: 113.549, lat: 22.199 },
                    '台湾': { lng: 121.509, lat: 25.044 } // 数据暂缺，但应在地图上标示
                };

                // 遍历数据，生成覆盖物点
                regionData.forEach(province => {
                    const coord = provinceCoords[province.name];
                    if (coord && province.value > 0) {
                        points.push({
                            lng: coord.lng,
                            lat: coord.lat,
                            count: province.value,
                            name: province.name,
                            rank: province.rank,
                            buildings: province.representativeBuildings
                        });
                        dataRange.min = Math.min(dataRange.min, province.value);
                        dataRange.max = Math.max(dataRange.max, province.value);
                    }
                });

                // 7. 根据数据大小动态计算标记点大小和颜色
                const sizeScale = d => 8 + (d.count / dataRange.max) * 20; // 标记点基础大小
                const getColorByCount = (count) => {
                    // 根据数量返回渐变颜色
                    const ratio = (count - dataRange.min) / (dataRange.max - dataRange.min || 1);
                    if (ratio < 0.25) return '#f0f9ff';
                    if (ratio < 0.5) return '#a8d5ff';
                    if (ratio < 0.75) return '#5ea8ff';
                    return '#1a7dff';
                };

                // 8. 创建自定义覆盖物（圆点）
                points.forEach(point => {
                    const myIcon = new BMap.Icon('', new BMap.Size(20, 20), {
                        anchor: new BMap.Size(10, 10) // 锚点为中心
                    });

                    const label = new BMap.Label(`<div style="
                        background: ${getColorByCount(point.count)};
                        border: 2px solid white;
                        border-radius: 50%;
                        width: ${sizeScale(point.count)}px;
                        height: ${sizeScale(point.count)}px;
                        cursor: pointer;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                    "></div>`, {
                        offset: new BMap.Size(-sizeScale(point.count)/2, -sizeScale(point.count)/2),
                        position: new BMap.Point(point.lng, point.lat)
                    });

                    label.setStyle({
                        border: 'none',
                        background: 'transparent',
                        padding: 0
                    });

                    // 9. 添加鼠标悬停提示框
                    const content = `
                        <div style="padding: 10px; max-width: 250px;">
                            <h4 style="margin:0 0 8px; color: #2c3e50;">${point.name} (第${point.rank}名)</h4>
                            <p style="margin:5px 0;"><strong>古建筑数量：</strong>${point.count} 处</p>
                            ${point.buildings && point.buildings.length > 0 ? 
                            `<p style="margin:5px 0;"><strong>代表建筑：</strong><br>${point.buildings.slice(0,3).map(b=>'• '+b).join('<br>')}</p>` 
                            : ''}
                        </div>
                    `;
                    const infoWindow = new BMap.InfoWindow(content, { width: 250 });

                    label.addEventListener('mouseover', function(e) {
                        map.openInfoWindow(infoWindow, new BMap.Point(point.lng, point.lat));
                    });

                    map.addOverlay(label);
                });
            }

            function initTypeChart() {
                const chart = echarts.init(document.getElementById('typeChart'));
                const option = {
                    ...chartTheme,
                    tooltip: {
                        ...chartTheme.tooltip,
                        formatter: (params) => {
                            const item = buildingTypeData.find(d => d.name === params.name);
                            return `${params.name}<br/>数量：${params.value}处<br/>占比：${item.percentage}%`;
                        }
                    },
                    legend: { orient: 'vertical', right: 10, top: 'center', textStyle: { color: '#2c3e50' } },
                    series: [{
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
                        label: { show: false },
                        emphasis: { label: { show: true, color: '#2c3e50', fontSize: 14 } },
                        data: buildingTypeData.map(d => ({ name: d.name, value: d.value })),
                        color: ['#e74c3c', '#f39c12', '#2ecc71', '#3498db', '#9b59b6', '#1abc9c']
                    }]
                };
                chart.setOption(option);
                window.addEventListener('resize', () => chart.resize());
            }

            function initTypeEvolutionChart() {
                const chart = echarts.init(document.getElementById('typeEvolutionChart'));
                const option = {
                    ...chartTheme,
                    tooltip: { trigger: 'axis' },
                    legend: { data: ['宫殿', '民居', '城防', '园林'], textStyle: { color: '#2c3e50' }, top: 0 },
                    grid: { left: '8%', right: '5%', bottom: '10%', top: '15%' },
                    xAxis: { type: 'category', data: typeEvolutionData.categories, axisLabel: { color: '#7f8c8d' } },
                    yAxis: {
                        type: 'value', name: '现存数量', nameTextStyle: { color: '#7f8c8d' },
                        axisLabel: { color: '#7f8c8d' }, splitLine: { lineStyle: { color: '#f0f0f0' } }
                    },
                    series: [
                        { name: '宫殿', type: 'line', smooth: true, data: typeEvolutionData.palace, color: '#e74c3c' },
                        { name: '民居', type: 'line', smooth: true, data: typeEvolutionData.residence, color: '#2ecc71' },
                        { name: '城防', type: 'line', smooth: true, data: typeEvolutionData.defense, color: '#3498db' },
                        { name: '园林', type: 'line', smooth: true, data: typeEvolutionData.garden, color: '#1abc9c' }
                    ]
                };
                chart.setOption(option);
                window.addEventListener('resize', () => chart.resize());
            }

            initDynastyChart();
            initBaiduMapChart();
            initTypeChart();
            initTypeEvolutionChart();
        })();