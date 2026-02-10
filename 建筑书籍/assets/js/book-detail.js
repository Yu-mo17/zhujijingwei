// 《营造法式》页面图表和交互
document.addEventListener('DOMContentLoaded', function() {
    // 初始化书籍结构图表
    function initBookStructureChart() {
        const chartDom = document.getElementById('book-structure-chart');
        if (!chartDom || typeof echarts === 'undefined') return;
        
        const chart = echarts.init(chartDom);
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c}卷 ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                top: 'center'
            },
            series: [
                {
                    name: '卷数分布',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['60%', '50%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 18,
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        { value: 13, name: '制度\n(13卷)' },
                        { value: 15, name: '功限\n(15卷)' },
                        { value: 6, name: '料例\n(6卷)' }
                    ]
                }
            ]
        };
        
        chart.setOption(option);
        window.addEventListener('resize', () => chart.resize());
    }

    // 初始化影响时间线图表
    function initInfluenceTimelineChart() {
        const chartDom = document.getElementById('influence-timeline-chart');
        if (!chartDom || typeof echarts === 'undefined') return;
        
        const chart = echarts.init(chartDom);
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                ['宋代', '元代', '明代', '清代', '现代'],
                axisLabel: {
                    fontSize: 12
                }
            },
            yAxis: {
                type: 'value',
                name: '影响程度',
                max: 100,
                axisLabel: {
                    formatter: '{value}%'
                }
            },
            series: [
                {
                    name: '技术影响',
                    type: 'bar',
                    [90, 85, 80, 75, 95],
                    itemStyle: {
                        color: '#3498db'
                    },
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{c}%'
                    }
                },
                {
                    name: '学术影响',
                    type: 'bar',
                    [80, 70, 65, 60, 90],
                    itemStyle: {
                        color: '#2ecc71'
                    },
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{c}%'
                    }
                }
            ]
        };
        
        chart.setOption(option);
        window.addEventListener('resize', () => chart.resize());
    }

    // 导航链接点击效果
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有active类
            navLinks.forEach(l => l.classList.remove('active'));
            // 添加active类到当前链接
            this.classList.add('active');
            
            // 滚动到对应章节
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 初始化所有图表
    if (typeof echarts !== 'undefined') {
        initBookStructureChart();
        initInfluenceTimelineChart();
    }

    // 添加章节进入视口的动画效果
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 观察所有章节
    const sections = document.querySelectorAll('.book-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });
});