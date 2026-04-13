document.addEventListener('DOMContentLoaded', function() {
            const timelineItems = document.querySelectorAll('.timeline-item');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) entry.target.classList.add('visible');
                });
            }, { threshold: 0.1 });
            timelineItems.forEach(item => observer.observe(item));

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

            (function() {
                const container = document.getElementById('dynasty-scroll-container');
                const wrapper = document.getElementById('dynasty-scroll-wrapper');
                const leftBtn = document.getElementById('scroll-left');
                const rightBtn = document.getElementById('scroll-right');
                const indicatorContainer = document.getElementById('scroll-indicator');

                if (!wrapper || !leftBtn || !rightBtn || !container) return;

                const cards = Array.from(document.querySelectorAll('.dynasty-scroll-card'));
                const cardCount = cards.length;
                const cardWidth = 280;         
                const cardGap = 25;              
                const step = cardWidth + cardGap; 

                let currentIndex = 0; 

                let autoPlayTimer = null;          
                let resumeTimer = null;           
                const AUTO_PLAY_INTERVAL = 2000; 

                function updateCarousel(index) {
                    const offset = -index * step;
                    wrapper.style.transform = `translateX(${offset}px)`;
                    if (indicatorContainer) {
                        const dots = indicatorContainer.querySelectorAll('.indicator-dot');
                        dots.forEach((dot, i) => {
                            dot.classList.toggle('active', i === index);
                        });
                    }
                }

                function nextCard() {
                    currentIndex = (currentIndex + 1) % cardCount;
                    updateCarousel(currentIndex);
                }

                function prevCard() {
                    currentIndex = (currentIndex - 1 + cardCount) % cardCount;
                    updateCarousel(currentIndex);
                }

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

                function startAutoPlay() {
                    clearAllTimers();
                    autoPlayTimer = setTimeout(function tick() {
                        nextCard();
                        autoPlayTimer = setTimeout(tick, AUTO_PLAY_INTERVAL);
                    }, AUTO_PLAY_INTERVAL);
                }

                function stopAutoPlay() {
                    if (autoPlayTimer) {
                        clearTimeout(autoPlayTimer);
                        autoPlayTimer = null;
                    }
                }

                function resetAutoPlay() {
                    if (!autoPlayTimer && !resumeTimer) {
                        return;
                    }
                    stopAutoPlay();

                    if (!isMouseInside) {
                        startAutoPlay();
                    }
                }

                let isMouseInside = false;

                function handleMouseEnter() {
                    isMouseInside = true;
                    if (resumeTimer) {
                        clearTimeout(resumeTimer);
                        resumeTimer = null;
                    }
                    stopAutoPlay();
                }


                function handleMouseLeave() {
                    isMouseInside = false;
                    if (resumeTimer) {
                        clearTimeout(resumeTimer);
                        resumeTimer = null;
                    }
                    resumeTimer = setTimeout(() => {
                        if (!isMouseInside) {
                            startAutoPlay();
                        }
                        resumeTimer = null;
                    }, AUTO_PLAY_INTERVAL);
                }

                function handleManualAction(action) {
                    action();
                    if (!isMouseInside) {
                        stopAutoPlay();
                        startAutoPlay();
                    } else {
                        stopAutoPlay();
                        if (resumeTimer) {
                            clearTimeout(resumeTimer);
                            resumeTimer = null;
                        }
                    }
                }

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

                leftBtn.addEventListener('click', () => {
                    handleManualAction(prevCard);
                });

                rightBtn.addEventListener('click', () => {
                    handleManualAction(nextCard);
                });

                container.addEventListener('mouseenter', handleMouseEnter);
                container.addEventListener('mouseleave', handleMouseLeave);

                updateCarousel(0);
                startAutoPlay(); 
            })();

            console.log('页面加载完成（自动轮播版）');
        });