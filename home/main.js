// Home page main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('Home page loaded');
    
    // Xử lý click cho các menu items
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Thêm hiệu ứng click
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Xử lý nút back
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', function() {
            // Chuyển về trang đăng nhập
            Navigation.goTo('../login/index.html');
        });
    }
    
    // Thêm hiệu ứng hover cho menu items
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
});
