document.addEventListener('DOMContentLoaded', function() {
            // ========== 时间轴滚动动画 ==========
            const timelineItems = document.querySelectorAll('.timeline-item');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) entry.target.classList.add('visible');
                });
            }, { threshold: 0.1 });
            timelineItems.forEach(item => observer.observe(item));

            // ========== 朝代筛选 ==========
            const filterTags = document.querySelectorAll('.filter-tag');
            const allItems = document.querySelectorAll('.timeline-item');
            filterTags.forEach(tag => {
                tag.addEventListener('click', function() {
                    filterTags.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    const dynasty = this.getAttribute('data-dynasty');
                    allItems.forEach(item => {
                        if (dynasty === 'all' || item.getAttribute('data-dynasty') === dynasty) {
                            item.style.display = 'flex';
                            setTimeout(() => observer.observe(item), 100);
                        } else {
                            item.style.display = 'none';
                        }
                    });
                    setTimeout(() => {
                        const firstVisible = document.querySelector('.timeline-item[style*="display: flex"]');
                        if (firstVisible) firstVisible.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 300);
                });
            });

            // ========== 轮播控制：自动播放 + 鼠标暂停 + 20秒恢复 ==========
            (function() {
                const container = document.getElementById('dynasty-scroll-container');
                const wrapper = document.getElementById('dynasty-scroll-wrapper');
                const leftBtn = document.getElementById('scroll-left');
                const rightBtn = document.getElementById('scroll-right');
                const indicatorContainer = document.getElementById('scroll-indicator');

                if (!wrapper || !leftBtn || !rightBtn || !container) return;

                const cards = Array.from(document.querySelectorAll('.dynasty-scroll-card'));
                const cardCount = cards.length;
                const cardWidth = 280;          // 卡片宽度（与CSS一致）
                const cardGap = 25;              // 间距
                const step = cardWidth + cardGap; // 每次移动的像素

                let currentIndex = 0; // 当前最左边卡片的索引

                // 自动播放相关
                let autoPlayTimer = null;          // 自动播放定时器
                let resumeTimer = null;             // 鼠标移出后延迟恢复的定时器
                const AUTO_PLAY_INTERVAL = 2000;   // 20秒

                // 更新轮播位置
                function updateCarousel(index) {
                    const offset = -index * step;
                    wrapper.style.transform = `translateX(${offset}px)`;
                    // 更新指示点
                    if (indicatorContainer) {
                        const dots = indicatorContainer.querySelectorAll('.indicator-dot');
                        dots.forEach((dot, i) => {
                            dot.classList.toggle('active', i === index);
                        });
                    }
                }

                // 切换到下一张
                function nextCard() {
                    currentIndex = (currentIndex + 1) % cardCount;
                    updateCarousel(currentIndex);
                }

                // 切换到上一张
                function prevCard() {
                    currentIndex = (currentIndex - 1 + cardCount) % cardCount;
                    updateCarousel(currentIndex);
                }

                // 清除所有定时器
                function clearAllTimers() {
                    if (autoPlayTimer) {
                        clearTimeout(autoPlayTimer);
                        autoPlayTimer = null;
                    }
                    if (resumeTimer) {
                        clearTimeout(resumeTimer);
                        resumeTimer = null;
                    }
                }

                // 启动自动播放（设置定时器，下次自动播放）
                function startAutoPlay() {
                    clearAllTimers(); // 确保没有残留定时器
                    autoPlayTimer = setTimeout(function tick() {
                        nextCard();
                        autoPlayTimer = setTimeout(tick, AUTO_PLAY_INTERVAL);
                    }, AUTO_PLAY_INTERVAL);
                }

                // 停止自动播放（清除定时器）
                function stopAutoPlay() {
                    if (autoPlayTimer) {
                        clearTimeout(autoPlayTimer);
                        autoPlayTimer = null;
                    }
                }

                // 重置自动播放（通常用于手动操作后，重新计时）
                function resetAutoPlay() {
                    if (!autoPlayTimer && !resumeTimer) {
                        // 如果当前没有自动播放（例如鼠标移出后未恢复），则不重置
                        return;
                    }
                    stopAutoPlay();
                    // 如果鼠标不在容器内，直接启动自动播放；如果在容器内，则等待鼠标移出后恢复
                    if (!isMouseInside) {
                        startAutoPlay();
                    }
                }

                // 鼠标状态
                let isMouseInside = false;

                // 鼠标进入容器
                function handleMouseEnter() {
                    isMouseInside = true;
                    // 清除任何待执行的恢复定时器
                    if (resumeTimer) {
                        clearTimeout(resumeTimer);
                        resumeTimer = null;
                    }
                    // 停止自动播放
                    stopAutoPlay();
                }

                // 鼠标离开容器
                function handleMouseLeave() {
                    isMouseInside = false;
                    // 设置20秒后恢复自动播放的定时器
                    if (resumeTimer) {
                        clearTimeout(resumeTimer);
                        resumeTimer = null;
                    }
                    resumeTimer = setTimeout(() => {
                        // 如果鼠标在此期间没有再次进入，则启动自动播放
                        if (!isMouseInside) {
                            startAutoPlay();
                        }
                        resumeTimer = null;
                    }, AUTO_PLAY_INTERVAL);
                }

                // 手动操作后的处理：重置自动播放计时
                function handleManualAction(action) {
                    action(); // 执行切换
                    // 重置自动播放
                    if (!isMouseInside) {
                        // 如果鼠标不在容器内，重新启动自动播放（从头计时）
                        stopAutoPlay();
                        startAutoPlay();
                    } else {
                        // 如果鼠标在容器内，只需清除自动播放（因为鼠标在时本来就不该自动播放），但不需要启动
                        stopAutoPlay();
                        // 同时清除可能存在的恢复定时器（因为鼠标还在内，不应该有恢复定时器）
                        if (resumeTimer) {
                            clearTimeout(resumeTimer);
                            resumeTimer = null;
                        }
                    }
                }

                // 创建指示点
                if (indicatorContainer) {
                    for (let i = 0; i < cardCount; i++) {
                        const dot = document.createElement('div');
                        dot.className = 'indicator-dot' + (i === 0 ? ' active' : '');
                        dot.addEventListener('click', () => {
                            handleManualAction(() => {
                                currentIndex = i;
                                updateCarousel(currentIndex);
                            });
                        });
                        indicatorContainer.appendChild(dot);
                    }
                }

                // 左按钮点击
                leftBtn.addEventListener('click', () => {
                    handleManualAction(prevCard);
                });

                // 右按钮点击
                rightBtn.addEventListener('click', () => {
                    handleManualAction(nextCard);
                });

                // 容器鼠标事件
                container.addEventListener('mouseenter', handleMouseEnter);
                container.addEventListener('mouseleave', handleMouseLeave);

                // 初始化位置和自动播放
                updateCarousel(0);
                startAutoPlay(); // 页面加载后立即启动自动播放
            })();

            console.log('页面加载完成（自动轮播版）');
        });