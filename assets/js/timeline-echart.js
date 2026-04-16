(function() {
    'use strict';
    
    if (typeof echarts === 'undefined') {
        console.error('ECharts库未加载。请检查 timeline.html 中echarts.min.js的引用。');
        return;
    }
    
    window.chinaMapChart = null;
    
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
        { name: '山西省', value: 421, rank: 1, representativeBuildings: ['王家大院', '乔家大院', '丁村民宅'] },
        { name: '河北省', value: 287, rank: 2, representativeBuildings: ['赵州桥', '山海关', '承德避暑山庄'] },
        { name: '陕西省', value: 256, rank: 3, representativeBuildings: ['西安城墙', '大雁塔', '法门寺'] },
        { name: '浙江省', value: 234, rank: 4, representativeBuildings: ['西湖古建筑群', '普陀山古建筑', '南浔古镇'] },
        { name: '河南省', value: 198, rank: 5, representativeBuildings: ['嵩山古建筑群', '白马寺', '龙门石窟'] },
        { name: '四川省', value: 176, rank: 6, representativeBuildings: ['都江堰', '青城山古建筑', '峨眉山古建筑'] },
        { name: '江苏省', value: 165, rank: 7, representativeBuildings: ['苏州园林', '中山陵', '周庄古镇'] },
        { name: '安徽省', value: 143, rank: 8, representativeBuildings: ['徽派古民居', '宏村', '西递'] },
        { name: '福建省', value: 128, rank: 9, representativeBuildings: ['福建土楼', '福州三坊七巷', '安平桥'] },
        { name: '云南省', value: 112, rank: 10, representativeBuildings: ['丽江古城', '和顺古镇', '建水朱家花园'] },
        { name: '湖北省', value: 98, rank: 11, representativeBuildings: ['恩施土家吊脚楼', '咸宁刘家桥古民居', '黄陂大余湾古民居'] },
        { name: '山东省', value: 95, rank: 12, representativeBuildings: ['曲阜孔府', '烟台牟氏庄园', '济南朱家峪古村'] },
        { name: '甘肃省', value: 87, rank: 13, representativeBuildings: ['嘉峪关', '天水胡氏古民居', '灞陵桥'] },
        { name: '湖南省', value: 85, rank: 14, representativeBuildings: ['凤凰古城', '张谷英古村', '通道普修桥'] },
        { name: '江西省', value: 79, rank: 15, representativeBuildings: ['婺源古民居', '流坑古村', '赣州古浮桥'] },
        { name: '广东省', value: 76, rank: 16, representativeBuildings: ['开平碉楼', '潮州广济桥', '梅州围龙屋'] },
        { name: '广西壮族自治区', value: 68, rank: 17, representativeBuildings: ['桂林靖江王城', '程阳永济桥', '友谊关'] },
        { name: '辽宁省', value: 65, rank: 18, representativeBuildings: ['沈阳故宫', '兴城古城', '奉国寺'] },
        { name: '西藏自治区', value: 58, rank: 19, representativeBuildings: ['布达拉宫', '大昭寺', '扎什伦布寺'] },
        { name: '内蒙古自治区', value: 52, rank: 20, representativeBuildings: ['五当召'] },
        { name: '重庆市', value: 48, rank: 21, representativeBuildings: ['湖广会馆', '白帝城'] },
        { name: '贵州省', value: 45, rank: 22, representativeBuildings: ['镇远古城'] },
        { name: '北京市', value: 42, rank: 23, representativeBuildings: ['故宫', '恭王府', '崇礼住宅'] },
        { name: '吉林省', value: 38, rank: 24, representativeBuildings: ['伪满皇宫', '高句丽遗址'] },
        { name: '青海省', value: 35, rank: 25, representativeBuildings: ['塔尔寺'] },
        { name: '上海市', value: 32, rank: 26, representativeBuildings: ['豫园', '石库门里弄民居'] },
        { name: '新疆维吾尔自治区', value: 28, rank: 27, representativeBuildings: ['高昌故城', '交河故城'] },
        { name: '宁夏回族自治区', value: 25, rank: 28, representativeBuildings: ['西夏王陵'] },
        { name: '黑龙江省', value: 22, rank: 29, representativeBuildings: ['圣索菲亚教堂', '中央大街'] },
        { name: '天津市', value: 20, rank: 30, representativeBuildings: ['天津古文化街', '五大道'] },
        { name: '海南省', value: 15, rank: 31, representativeBuildings: ['海口骑楼老街'] },
        { name: '香港特别行政区', value: 12, rank: 32, representativeBuildings: ['香港文武庙'] },
        { name: '澳门特别行政区', value: 8, rank: 33, representativeBuildings: ['郑家大屋'] },
        { name: '台湾省', value: 0, rank: 34, representativeBuildings: ['数据暂缺'] }
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
    
    function initChinaMapChart() {
        const chartDom = document.getElementById('chinaMapChart');
        if (!chartDom) {
            console.warn('未找到地图容器 #chinaMapChart');
            return;
        }
        
        const chart = echarts.init(chartDom);
        window.chinaMapChart = chart;

        fetch('/assets/js/中国_省.geojson')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`无法加载地图文件: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(geoJson => {
                console.log('成功加载地图数据，正在注册...', geoJson);
 
                echarts.registerMap('China', geoJson);
                const total = regionData.reduce((sum, p) => sum + p.value, 0);

                const mapData = regionData.map(province => ({
                    name: province.name,
                    value: province.value,
                    rank: province.rank,
                    representativeBuildings: province.representativeBuildings
                }));

                const option = {
                    title: {
                        subtext: `共 ${total} 处，数据截至2023年`,
                        left: 'center',
                        textStyle: {
                            fontSize: 20,
                            fontWeight: 'bold',
                            color: '#2c3e50'
                        },
                        subtextStyle: {
                            fontSize: 13,
                            color: '#7f8c8d'
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        borderColor: '#c19a6b',
                        borderWidth: 1,
                        textStyle: { 
                            color: '#2c3e50',
                            fontSize: 13
                        },
                        padding: 12,
                        formatter: function(params) {
                            if (params.data) {
                                const value = params.data.value || 0;
                                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                const province = regionData.find(p => p.name === params.name);
                                const buildings = province?.representativeBuildings || [];
                                let buildingsList = '';
                                
                                if (buildings.length > 0) {
                                    buildingsList = buildings.slice(0, 3).map(b => '• ' + b).join('<br/>');
                                    if (buildings.length > 3) {
                                        buildingsList += '<br/>• ...等';
                                    }
                                }
                                
                                return `
                                    <div style="font-weight:bold; margin-bottom:8px; color:#2c3e50; font-size:14px;">
                                        ${params.name} <span style="color:#c19a6b;">#${province?.rank || 'N'}</span>
                                    </div>
                                    <div style="margin-bottom:5px;">
                                        <span style="color:#7f8c8d;">古建筑数量：</span>
                                        <span style="font-weight:bold; color:#e74c3c; font-size:16px;">${value}</span> 处
                                    </div>
                                    <div style="margin-bottom:8px;">
                                        <span style="color:#7f8c8d;">全国占比：</span>
                                        <span style="font-weight:bold; color:#3498db;">${percentage}%</span>
                                    </div>
                                    ${buildingsList ? `
                                    <div style="margin-top:8px; padding-top:8px; border-top:1px dashed #eee;">
                                        <div style="color:#7f8c8d; margin-bottom:4px;">代表建筑：</div>
                                        <div style="color:#2c3e50; font-size:12px; line-height:1.4;">${buildingsList}</div>
                                    </div>
                                    ` : ''}
                                `;
                            }
                            return `<div style="font-weight:bold;">${params.name}</div><div>暂无数据</div>`;
                        }
                    },
                    visualMap: {
                        left: 20,
                        bottom: 20,
                        min: 0,
                        max: 500,
                        text: ['数量多', '数量少'],
                        realtime: false,
                        calculable: true,
                        inRange: { color: ['#f0f9ff', '#a8d5ff', '#5ea8ff', '#1a7dff', '#0052cc'] },
                        textStyle: { color: '#2c3e50' }
                    },
                    series: [{
                        name: '古建筑数量',
                        type: 'map',
                        map: 'China', 
                        roam: true,
                        zoom: 1.1,
                        center: [105, 36],
                        scaleLimit: {
                            min: 1,
                            max: 5
                        },
                        label: {
                            show: false,
                            fontSize: 10,
                            color: '#333',
                            fontWeight: 'normal',
                            formatter: function(params) {
                                if (params.data && params.data.value > 0) {
                                    return params.name;
                                }
                                return '';
                            }
                        },
                        emphasis: {
                            label: { 
                                show: true, 
                                color: '#fff', 
                                backgroundColor: 'rgba(193,154,107,0.9)', 
                                padding: [5, 10], 
                                borderRadius: 4,
                                fontSize: 12
                            },
                            itemStyle: { 
                                areaColor: '#c19a6b', 
                                borderColor: '#8b6b3b', 
                                borderWidth: 2 
                            }
                        },
                        select: {
                            label: { 
                                show: true, 
                                color: '#fff', 
                                backgroundColor: '#2c3e50',
                                padding: [5, 10], 
                                borderRadius: 4
                            },
                            itemStyle: { 
                                areaColor: '#2c3e50', 
                                borderColor: '#1a252f', 
                                borderWidth: 2 
                            }
                        },
                        itemStyle: { 
                            areaColor: '#f5f5f5',
                            borderColor: '#ddd',
                            borderWidth: 0.5,
                            borderType: 'solid'
                        },
                        data: mapData
                    }],
                    toolbox: {
                        show: true,
                        orient: 'vertical',
                        right: 20,
                        top: 'center',
                        feature: {
                            dataView: { 
                                show: true, 
                                title: '数据视图',
                                readOnly: true,
                                lang: ['数据视图', '关闭', '刷新']
                            },
                            restore: { 
                                show: true, 
                                title: '还原'
                            },
                            saveAsImage: { 
                                show: true, 
                                title: '保存图片',
                                pixelRatio: 2
                            },
                            myTool: {
                                show: true,
                                title: '重置视图',
                                icon: 'path://M...', 
                                onclick: function() {
                                    chart.dispatchAction({
                                        type: 'geoRoam',
                                        zoom: 1,
                                        center: [105, 36]
                                    });
                                }
                            }
                        }
                    }
                };
                
                chart.setOption(option);
                console.log('中国地图图表已初始化，使用自定义GeoJSON数据。');

                window.addEventListener('resize', function() {
                    chart.resize();
                });

                chart.on('click', function(params) {
                    console.log('地图区域点击:', params);
                    if (params.componentType === 'series') {
                        const province = regionData.find(p => p.name === params.name);
                        if (province) {
                            console.log(`点击了 ${province.name}，有 ${province.value} 处古建筑`);
                        }
                    }
                });
                
            })
            .catch(error => {
                console.error('加载或注册地图时出错:', error);

                chartDom.innerHTML = `
                    <div style="text-align:center; padding: 60px 20px; color: #666;">
                        <div style="font-size: 48px; color: #e74c3c; margin-bottom: 20px;">🗺️</div>
                        <h3 style="color: #e74c3c; margin-bottom: 20px;">地图加载失败</h3>
                        <p>无法加载地图数据文件，可能的原因：</p>
                        <ul style="text-align: left; display: inline-block; margin: 20px auto; max-width: 400px;">
                            <li>地图文件路径错误或不存在</li>
                            <li>网络请求失败</li>
                            <li>GeoJSON文件格式不正确</li>
                        </ul>
                        <p style="margin-top:20px; font-size:0.9em; color:#95a5a6;">
                            错误详情: ${error.message}<br>
                            请检查控制台获取更多信息
                        </p>
                        <button onclick="location.reload()" style="
                            margin-top: 30px;
                            padding: 10px 20px;
                            background: #c19a6b;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 14px;
                        ">重新加载</button>
                    </div>
                `;
            });
    }

    function initDynastyChart() {
        const chartDom = document.getElementById('dynastyChart');
        if (!chartDom) return;

        const chart = echarts.init(chartDom);
        const option = {
            ...chartTheme,
            tooltip: {
                ...chartTheme.tooltip,
                formatter: function(params) {
                    const idx = params[0].dataIndex;
                    const item = officialDynastyData[idx];
                    return `
                        <div style="font-weight:bold; margin-bottom:5px;">${item.dynasty}时期</div>
                        <div>现存古建筑: <span style="color:#e74c3c; font-weight:bold;">${item.value}</span> 处</div>
                        <div>主要类型: ${item.type}</div>
                    `;
                }
            },
            grid: { 
                left: '8%', 
                right: '5%', 
                bottom: '10%', 
                top: '10%', 
                containLabel: true 
            },
            xAxis: {
                type: 'category',
                data: officialDynastyData.map(d => d.dynasty),
                axisLabel: { 
                    rotate: 45, 
                    color: '#7f8c8d',
                    fontSize: 12
                },
                axisLine: { 
                    lineStyle: { 
                        color: '#dcdde1',
                        width: 1
                    } 
                },
                axisTick: {
                    alignWithLabel: true
                }
            },
            yAxis: {
                type: 'value',
                name: '现存数量（处）',
                nameTextStyle: { 
                    color: '#7f8c8d',
                    fontSize: 12
                },
                axisLabel: { 
                    color: '#7f8c8d',
                    fontSize: 12
                },
                splitLine: { 
                    lineStyle: { 
                        color: '#f0f0f0',
                        type: 'dashed'
                    } 
                },
                max: 2000
            },
            series: [{
                type: 'bar',
                data: officialDynastyData.map((d, i) => ({
                    value: d.value,
                    itemStyle: { 
                        color: d.color,
                        borderRadius: [2, 2, 0, 0]
                    }
                })),
                barWidth: '60%',
                label: {
                    show: true,
                    position: 'top',
                    color: '#2c3e50',
                    fontSize: 11,
                    formatter: (p) => p.value > 500 ? p.value.toLocaleString() : ''
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.3)'
                    }
                }
            }],
            dataZoom: [{
                type: 'inside',
                start: 0,
                end: 100
            }]
        };
        chart.setOption(option);
        window.addEventListener('resize', () => chart.resize());
    }
    
    function initTypeChart() {
        const chartDom = document.getElementById('typeChart');
        if (!chartDom) return;
        
        const chart = echarts.init(chartDom);
        const option = {
            ...chartTheme,
            tooltip: {
                ...chartTheme.tooltip,
                formatter: (params) => {
                    const item = buildingTypeData.find(d => d.name === params.name);
                    return `
                        <div style="font-weight:bold; margin-bottom:5px;">${params.name}</div>
                        <div>数量: <span style="color:#e74c3c; font-weight:bold;">${params.value}</span> 处</div>
                        <div>占比: <span style="color:#3498db; font-weight:bold;">${item.percentage}%</span></div>
                    `;
                }
            },
            legend: { 
                orient: 'vertical', 
                right: 20, 
                top: 'center', 
                textStyle: { 
                    color: '#2c3e50',
                    fontSize: 12
                },
                itemWidth: 12,
                itemHeight: 12
            },
            series: [{
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: { 
                    borderRadius: 6, 
                    borderColor: '#fff', 
                    borderWidth: 2 
                },
                label: { 
                    show: false 
                },
                emphasis: { 
                    label: { 
                        show: true, 
                        color: '#2c3e50', 
                        fontSize: 14,
                        fontWeight: 'bold'
                    },
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.3)'
                    }
                },
                labelLine: {
                    show: false
                },
                data: buildingTypeData.map(d => ({ 
                    name: d.name, 
                    value: d.value 
                })),
                color: ['#e74c3c', '#f39c12', '#2ecc71', '#3498db', '#9b59b6', '#1abc9c']
            }]
        };
        chart.setOption(option);
        window.addEventListener('resize', () => chart.resize());
    }
    
    function initTypeEvolutionChart() {
        const chartDom = document.getElementById('typeEvolutionChart');
        if (!chartDom) return;
        
        const chart = echarts.init(chartDom);
        const option = {
            ...chartTheme,
            tooltip: { 
                trigger: 'axis',
                backgroundColor: 'rgba(255,255,255,0.95)',
                borderColor: '#c19a6b',
                textStyle: { color: '#2c3e50' }
            },
            legend: { 
                data: ['宫殿', '民居', '城防', '园林'], 
                textStyle: { 
                    color: '#2c3e50',
                    fontSize: 12
                }, 
                top: 0 
            },
            grid: { 
                left: '8%', 
                right: '5%', 
                bottom: '10%', 
                top: '15%' 
            },
            xAxis: { 
                type: 'category', 
                data: typeEvolutionData.categories, 
                axisLabel: { 
                    color: '#7f8c8d',
                    fontSize: 12
                },
                axisLine: {
                    lineStyle: {
                        color: '#dcdde1'
                    }
                }
            },
            yAxis: {
                type: 'value', 
                name: '现存数量', 
                nameTextStyle: { 
                    color: '#7f8c8d',
                    fontSize: 12
                },
                axisLabel: { 
                    color: '#7f8c8d',
                    fontSize: 12
                }, 
                splitLine: { 
                    lineStyle: { 
                        color: '#f0f0f0',
                        type: 'dashed'
                    } 
                }
            },
            series: [
                { 
                    name: '宫殿', 
                    type: 'line', 
                    smooth: true, 
                    data: typeEvolutionData.palace, 
                    color: '#e74c3c',
                    symbol: 'circle',
                    symbolSize: 8,
                    lineStyle: {
                        width: 3
                    }
                },
                { 
                    name: '民居', 
                    type: 'line', 
                    smooth: true, 
                    data: typeEvolutionData.residence, 
                    color: '#2ecc71',
                    symbol: 'circle',
                    symbolSize: 8,
                    lineStyle: {
                        width: 3
                    }
                },
                { 
                    name: '城防', 
                    type: 'line', 
                    smooth: true, 
                    data: typeEvolutionData.defense, 
                    color: '#3498db',
                    symbol: 'circle',
                    symbolSize: 8,
                    lineStyle: {
                        width: 3
                    }
                },
                { 
                    name: '园林', 
                    type: 'line', 
                    smooth: true, 
                    data: typeEvolutionData.garden, 
                    color: '#1abc9c',
                    symbol: 'circle',
                    symbolSize: 8,
                    lineStyle: {
                        width: 3
                    }
                }
            ]
        };
        chart.setOption(option);
        window.addEventListener('resize', () => chart.resize());
    }
    
    function initAllCharts() {
        try {
            initDynastyChart();
            initChinaMapChart();
            initTypeChart();
            initTypeEvolutionChart();
            console.log('所有图表初始化完成');
        } catch (error) {
            console.error('图表初始化过程中出错:', error);
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAllCharts);
    } else {
        initAllCharts();
    }

    window.initChinaMapChart = initChinaMapChart;
    window.changeMapView = function(viewType) {
        if (!window.chinaMapChart) return;
        
        const options = {
            'quantity': {
                visualMap: {
                    inRange: { 
                        color: ['#f0f9ff', '#a8d5ff', '#5ea8ff', '#1a7dff', '#0052cc'] 
                    }
                },
                series: [{
                    data: regionData.map(p => ({
                        name: p.name,
                        value: p.value
                    }))
                }]
            },
            'density': {
                visualMap: {
                    inRange: { 
                        color: ['#f2f8e6', '#c7e9b4', '#7fcdbb', '#41b6c4', '#225ea8'] 
                    }
                },
                series: [{
                    data: regionData.map(p => ({
                        name: p.name,
                        value: Math.round(p.value / 10) 
                    }))
                }]
            }
        };
        
        if (options[viewType]) {
            window.chinaMapChart.setOption(options[viewType]);
        }
    };
    
    window.resetMapView = function() {
        if (window.chinaMapChart) {
            window.chinaMapChart.dispatchAction({
                type: 'geoRoam',
                zoom: 1,
                center: [105, 36]
            });
        }
    };

    window.addEventListener('error', function(event) {
        console.error('JavaScript错误:', event.error);
    });
    
})();