 // 朝代筛选功能
        document.addEventListener('DOMContentLoaded', function() {
            const filterButtons = document.querySelectorAll('.dynasty-filter');
            const architectCards = document.querySelectorAll('.architect-card');
            
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    
                    const filter = this.getAttribute('data-dynasty');
                    
                    // 筛选建筑师卡片
                    architectCards.forEach(card => {
                        if (filter === 'all') {
                            card.style.display = 'block';
                        } else {
                            const dynasty = card.getAttribute('data-dynasty');
                            
                            if (dynasty === filter) {
                                card.style.display = 'block';
                            } else {
                                card.style.display = 'none';
                            }
                        }
                    });
                });
            });
        });