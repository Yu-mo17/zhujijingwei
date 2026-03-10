// 赵州桥页面图表初始化
function initStructureAdvantageChart() {
    const chartDom = document.getElementById('structure-advantage-chart');
    if (!chartDom) return;
    
    const chart = echarts.init(chartDom);
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        legend: {
            ['赵州桥 (敞肩拱)', '传统实肩拱 (基准)'],
            top: 10
        },
        grid: { 
            top: 60,
            bottom: 30, 
            left: 50, 
            right: 30
        },
        xAxis: {
            type: 'category',
            ['泄洪能力', '桥身自重', '石料用量', '结构寿命']
        },
        yAxis: {
            type: 'value',
            name: '性能百分比 (%)',
            axisLabel: { formatter: '{value}%' },
            min: 0,
            max: 140
        },
        series: [
            {
                name: '传统实肩拱 (基准)',
                type: 'bar',
                data: [100, 100, 100, 100],
                itemStyle: { color: '#95a5a6' },
                barWidth: 30
            },
            {
                name: '赵州桥 (敞肩拱)',
                type: 'bar',
                data: [130, 85, 85, 120],
                barWidth: 30
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 初始化所有图表
document.addEventListener('DOMContentLoaded', function() {
    if (typeof echarts === 'undefined') {
        console.error('ECharts未正确加载！');
        return;
    }
    
    try {
        initStructureAdvantageChart();
        console.log('图表初始化成功！');
    } catch (error) {
        console.error('图表初始化失败:', error);
    }
});