// 筛选功能实现
        document.addEventListener('DOMContentLoaded', function() {
            const filterButtons = document.querySelectorAll('.dynasty-filter');
            const bookCards = document.querySelectorAll('.book-card');
            
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // 移除所有active类
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    // 添加active类到当前按钮
                    this.classList.add('active');
                    
                    const filter = this.getAttribute('data-dynasty');
                    
                    // 筛选书籍卡片
                    bookCards.forEach(card => {
                        if (filter === 'all') {
                            card.style.display = 'flex';
                        } else {
                            const dynasty = card.getAttribute('data-dynasty');
                            const type = card.getAttribute('data-type');
                            
                            if (dynasty === filter || type === filter) {
                                card.style.display = 'flex';
                            } else {
                                card.style.display = 'none';
                            }
                        }
                    });
                });
            });
            
            // 添加卡片悬停效果
            bookCards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-10px)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                });
            });
        });