// 方案一：技术创新时间领先性对比
function initTechAdvancementChart() {
    const chartDom = document.getElementById('tech-timeline-chart');
    if (!chartDom) return;
    
    const chart = echarts.init(chartDom);
    
    const option = {
        title: {
            text: '技术创新时间领先性对比',
            subtext: '赵州桥敞肩拱技术领先西方约1200年',
            left: 'center',
            textStyle: {
                fontSize: 20,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                let result = `<strong>${params[0].name}</strong><br/>`;
                params.forEach(function(item) {
                    result += `${item.seriesName}: ${item.value[0]}年<br/>`;
                    result += `${item.value[2]}<br/>`;
                });
                return result;
            }
        },
        legend: {
            data: ['中国桥梁', '西方桥梁'],
            top: 50
        },
        grid: {
            left: '5%',
            right: '5%',
            bottom: '10%',
            top: 100,
            containLabel: true
        },
        xAxis: {
            type: 'time',
            name: '公元年份',
            axisLine: {
                lineStyle: {
                    color: '#666'
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed',
                    color: '#e0e0e0'
                }
            }
        },
        yAxis: {
            type: 'category',
            data: ['技术发展'],
            axisLine: {show: false},
            axisTick: {show: false},
            axisLabel: {show: false}
        },
        series: [
            {
                name: '中国桥梁',
                type: 'scatter',
                data: [
                    [605, 0, '赵州桥 (605年)\n单孔跨度37.02米\n敞肩拱技术成熟应用']
                ],
                symbolSize: 25,
                itemStyle: {
                    color: '#e74c3c'
                },
                label: {
                    show: true,
                    formatter: '赵州桥',
                    position: 'top',
                    color: '#e74c3c',
                    fontWeight: 'bold',
                    fontSize: 14
                },
                emphasis: {
                    scale: 1.5
                }
            },
            {
                name: '西方桥梁',
                type: 'scatter',
                data: [
                    [1321, 0, '法国赛雷桥 (1321年)\n最早敞肩拱桥\n比赵州桥晚约1200年'],
                    [1354, 0, '意大利维罗纳桥 (1354年)\n单孔跨度约24米']
                ],
                symbolSize: 20,
                itemStyle: {
                    color: '#3498db'
                },
                label: {
                    show: true,
                    formatter: '{@[2]}',
                    position: 'bottom',
                    color: '#3498db',
                    fontSize: 12
                }
            },
            {
                name: '领先时间',
                type: 'line',
                data: [[605, 0], [1321, 0]],
                lineStyle: {
                    color: '#e74c3c',
                    type: 'dashed',
                    width: 2
                },
                markArea: {
                    silent: true,
                    itemStyle: {
                        color: 'rgba(231, 76, 60, 0.2)'
                    },
                    data: [[
                        {
                            name: '领先约1200年',
                            xAxis: 605,
                            y: 0
                        },
                        {
                            xAxis: 1321,
                            y: 0
                        }
                    ]]
                },
                markLine: {
                    silent: true,
                    symbol: 'none',
                    lineStyle: {
                        color: '#e74c3c',
                        type: 'dashed',
                        width: 1
                    },
                    label: {
                        formatter: '领先约1200年',
                        position: 'middle',
                        color: '#e74c3c',
                        fontWeight: 'bold',
                        fontSize: 12
                    },
                    data: [
                        [
                            {coord: [605, 0]},
                            {coord: [1321, 0]}
                        ]
                    ]
                }
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', function() { chart.resize(); });
}

// 方案二：建筑结构性能优势对比
function initStructureAdvantageChart() {
    const chartDom = document.getElementById('structure-comparison-chart');
    if (!chartDom) return;
    
    const chart = echarts.init(chartDom);
    
    const option = {
        title: {
            text: '敞肩拱 vs 实肩拱结构性能对比',
            subtext: '以实肩拱为基准100%进行对比',
            left: 'center',
            textStyle: {
                fontSize: 20,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params) {
                let result = `<strong>${params[0].name}</strong><br/>`;
                params.forEach(function(item) {
                    const value = item.value;
                    const diff = value - 100;
                    const sign = diff > 0 ? '+' : '';
                    result += `${item.seriesName}: ${value}% (${sign}${diff}%)<br/>`;
                });
                return result;
            }
        },
        legend: {
            data: ['赵州桥 (敞肩拱)', '传统实肩拱 (基准)'],
            top: 50
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: 100,
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['泄洪能力', '桥身自重', '石料用量', '结构寿命'],
            axisLabel: {
                interval: 0,
                rotate: 0
            }
        },
        yAxis: {
            type: 'value',
            name: '百分比 (%)',
            min: 0,
            max: 140,
            axisLabel: {
                formatter: '{value}%'
            }
        },
        series: [
            {
                name: '传统实肩拱 (基准)',
                type: 'bar',
                data: [100, 100, 100, 100],
                itemStyle: {
                    color: '#95a5a6',
                    opacity: 0.7
                },
                label: {
                    show: true,
                    position: 'top',
                    formatter: '{c}%',
                    color: '#7f8c8d'
                },
                barWidth: 40
            },
            {
                name: '赵州桥 (敞肩拱)',
                type: 'bar',
                data: [
                    {value: 130, itemStyle: {color: '#2ecc71'}},  // 泄洪能力
                    {value: 85, itemStyle: {color: '#3498db'}},   // 桥身自重
                    {value: 85, itemStyle: {color: '#9b59b6'}},   // 石料用量
                    {value: 120, itemStyle: {color: '#e74c3c'}}   // 结构寿命
                ],
                label: {
                    show: true,
                    position: 'top',
                    formatter: function(params) {
                        const diff = params.value - 100;
                        const sign = diff > 0 ? '+' : '';
                        return `${params.value}% (${sign}${diff}%)`;
                    },
                    fontWeight: 'bold'
                },
                barWidth: 40
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', function() { chart.resize(); });
}