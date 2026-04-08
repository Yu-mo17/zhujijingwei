document.addEventListener('DOMContentLoaded', function() {
            const loadingOverlay = document.getElementById('loading-overlay');
            const siteTitleSection = document.getElementById('site-title');
            const prefaceSection = document.getElementById('preface');
            const exploreBtn = document.getElementById('explore-btn');
            let isScrolling = false;
            
            // 隐藏加载动画
            setTimeout(() => {
                loadingOverlay.style.opacity = '0';
                loadingOverlay.style.visibility = 'hidden';
            }, 800);
            
            // 初始状态：只显示网站名称
            prefaceSection.style.display = 'none';
            
            // 滚动到前言区域
            function scrollToPreface() {
                siteTitleSection.style.opacity = '0';
                siteTitleSection.style.transform = 'translateY(-50px)';
                
                setTimeout(() => {
                    siteTitleSection.style.display = 'none';
                    prefaceSection.style.display = 'flex';
                    
                    // 触发重绘
                    void prefaceSection.offsetWidth;
                    
                    prefaceSection.style.opacity = '1';
                    prefaceSection.style.transform = 'translateY(0)';
                }, 800);
            }
            
            // 监听鼠标滚轮事件
            window.addEventListener('wheel', function(e) {
                if (isScrolling) return;
                
                isScrolling = true;
                
                // 向下滚动
                if (e.deltaY > 0) {
                    if (siteTitleSection.style.display !== 'none' && prefaceSection.style.display === 'none') {
                        scrollToPreface();
                    }
                }
                // 向上滚动
                else if (e.deltaY < 0) {
                    if (prefaceSection.style.display !== 'none' && siteTitleSection.style.display === 'none') {
                        siteTitleSection.style.display = 'flex';
                        prefaceSection.style.display = 'none';
                        
                        void siteTitleSection.offsetWidth;
                        siteTitleSection.style.opacity = '1';
                        siteTitleSection.style.transform = 'translateY(0)';
                    }
                }
                
                // 防抖处理
                setTimeout(() => {
                    isScrolling = false;
                }, 1000);
            });
            
            // 探索按钮点击事件
            exploreBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // 添加页面过渡效果
                document.body.style.opacity = '0.8';
                document.body.style.transition = 'opacity 0.8s ease';
                
                // 显示加载动画
                loadingOverlay.style.opacity = '1';
                loadingOverlay.style.visibility = 'visible';
                
                // 延迟跳转，让动画完成
                setTimeout(() => {
                    window.location.href = this.getAttribute('href');
                }, 1000);
            });
            
            // 触摸屏滑动支持
            let startY = 0;
            
            document.addEventListener('touchstart', function(e) {
                startY = e.touches[0].clientY;
            }, { passive: true });
            
            document.addEventListener('touchend', function(e) {
                if (isScrolling) return;
                
                const endY = e.changedTouches[0].clientY;
                const diff = startY - endY;
                
                // 向下滑动
                if (diff > 50) {
                    if (siteTitleSection.style.display !== 'none' && prefaceSection.style.display === 'none') {
                        scrollToPreface();
                    }
                }
                // 向上滑动
                else if (diff < -50) {
                    if (prefaceSection.style.display !== 'none' && siteTitleSection.style.display === 'none') {
                        siteTitleSection.style.display = 'flex';
                        prefaceSection.style.display = 'none';
                        
                        void siteTitleSection.offsetWidth;
                        siteTitleSection.style.opacity = '1';
                        siteTitleSection.style.transform = 'translateY(0)';
                    }
                }
            }, { passive: true });
            
            // 键盘导航支持
            document.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                    e.preventDefault();
                    if (siteTitleSection.style.display !== 'none' && prefaceSection.style.display === 'none') {
                        scrollToPreface();
                    }
                } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                    e.preventDefault();
                    if (prefaceSection.style.display !== 'none' && siteTitleSection.style.display === 'none') {
                        siteTitleSection.style.display = 'flex';
                        prefaceSection.style.display = 'none';
                        
                        void siteTitleSection.offsetWidth;
                        siteTitleSection.style.opacity = '1';
                        siteTitleSection.style.transform = 'translateY(0)';
                    }
                } else if (e.key === 'Enter' || e.key === ' ') {
                    // 空格键或回车键也可以触发探索按钮
                    if (document.activeElement === document.body) {
                        e.preventDefault();
                        exploreBtn.click();
                    }
                }
            });
            
            console.log('筑迹经纬 - 新版首页加载完成！');
        });