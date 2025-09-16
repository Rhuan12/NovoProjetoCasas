class Utils {
    // Formatação de moeda
    static formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }
    
    // Formatação de data
    static formatDate(date) {
        return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
    }
    
    // Debounce para otimização de performance
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Validação de email
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Validação de telefone brasileiro
    static isValidPhone(phone) {
        const phoneRegex = /^(?:\+55\s?)?(?:\(?11\)?\s?)?(?:9\s?)?[0-9]{4}-?[0-9]{4}$/;
        return phoneRegex.test(phone);
    }
    
    // Limpar caracteres especiais do telefone
    static cleanPhone(phone) {
        return phone.replace(/\D/g, '');
    }
    
    // Scroll suave
    static smoothScrollTo(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    // Show/Hide loading
    static showLoading(containerId = 'body') {
        const container = containerId === 'body' ? document.body : document.getElementById(containerId);
        const spinner = document.createElement('div');
        spinner.id = 'loading-spinner';
        spinner.className = 'fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50';
        spinner.innerHTML = '<div class="loading-spinner"></div>';
        container.appendChild(spinner);
    }
    
    static hideLoading() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.remove();
        }
    }
    
    // Notificações toast
    static showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 
            type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
        } text-white`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
    
    // Lazy loading de imagens
    static setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    // Analytics tracking (Google Analytics, etc.)
    static trackEvent(eventName, properties = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
        
        // Também pode integrar com outras ferramentas de analytics
        console.log('Event tracked:', eventName, properties);
    }
}

// Export dos utilitários
window.Utils = Utils;