// 李春页面交互效果
document.addEventListener('DOMContentLoaded', function() {
    // 为成就列表项添加动画
    const achievementItems = document.querySelectorAll('.achievement-highlight li');
    achievementItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 100 * index);
    });
    
    // 为理念卡片添加鼠标悬停效果
    const philosophyItems = document.querySelectorAll('.philosophy-item');
    philosophyItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // 为作品卡片添加点击效果
    const workCard = document.querySelector('.work-card');
    if (workCard) {
        workCard.addEventListener('click', function(e) {
            e.preventDefault();
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
                window.location.href = this.getAttribute('href');
            }, 300);
        });
    }
});