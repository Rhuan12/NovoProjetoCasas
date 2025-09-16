// Estado global da aplicação
let currentFilters = {
    bedrooms: '',
    bathrooms: '',
    region: '',
    maxPrice: 2000000,
    isSold: false
};

let allProperties = [];
let allRegions = [];
let currentPage = 1;

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', async function() {
    try {
        await initializeApp();
    } catch (error) {
        console.error('Erro ao inicializar aplicação:', error);
        showMessage('Erro ao carregar a página. Recarregue para tentar novamente.', 'error');
    }
});

// Função principal de inicialização
async function initializeApp() {
    showLoading('loadingProperties');
    
    // Carregar configurações do site
    await loadSiteSettings();
    
    // Configurar eventos
    setupEventListeners();
    
    // Carregar dados iniciais
    await Promise.all([
        loadProperties(),
        loadSoldProperties(),
        loadTestimonials(),
        loadOwners(),
        loadRegions()
    ]);
    
    hideLoading('loadingProperties');
    
    // Configurar animações de scroll
    setupScrollAnimations();
    
    // Configurar filtro de preço
    setupPriceRangeFilter();
}

// Configurar listeners de eventos
function setupEventListeners() {
    // Menu mobile
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Formulário de interesse do comprador
    const buyerForm = document.getElementById('buyerInterestForm');
    if (buyerForm) {
        buyerForm.addEventListener('submit', handleBuyerInterestSubmit);
    }

    // Formulário de lista de espera
    const waitlistForm = document.getElementById('waitlistForm');
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', handleWaitlistSubmit);
    }

    // Modais
    setupModals();

    // Filtros
    setupFilters();

    // Scroll suave do header
    window.addEventListener('scroll', handleScroll);
}

// Configurar modais
function setupModals() {
    const modals = document.querySelectorAll('.modal');
    const closeBtns = document.querySelectorAll('.close');

    // Fechar modal ao clicar no X
    closeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) closeModal(modal.id);
        });
    });

    // Fechar modal ao clicar fora
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // Fechar modal com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.style.display === 'block') {
                    closeModal(modal.id);
                }
            });
        }
    });
}

// Configurar filtros
function setupFilters() {
    // Filtros de seleção
    ['bedroomsFilter', 'bathroomsFilter', 'regionFilter'].forEach(filterId => {
        const filter = document.getElementById(filterId);
        if (filter) {
            filter.addEventListener('change', updateFilters);
        }
    });
}

// Configurar filtro de preço
function setupPriceRangeFilter() {
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    
    if (priceRange && priceValue) {
        priceRange.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            priceValue.textContent = FormatUtils.formatCurrency(value);
            currentFilters.maxPrice = value;
        });
    }
}

// Carregar configurações do site
async function loadSiteSettings() {
    try {
        const settings = await window.dbService.getSiteSettings();
        
        // Atualizar elementos com as configurações
        updateElementText('company-name', settings.company_name);
        updateElementText('footer-company-name', settings.company_name);
        updateElementText('footer-about', settings.about_text);
        updateElementText('footer-email', settings.contact_email);
        updateElementText('footer-phone', settings.contact_phone);
        
        // Atualizar link do Google Reviews se disponível
        if (settings.google_reviews_link) {
            const googleLink = document.getElementById('googleReviewsLink');
            if (googleLink) {
                googleLink.href = settings.google_reviews_link;
            }
        }
        
        // Atualizar logo se disponível
        if (settings.company_logo) {
            const logo = document.getElementById('company-logo');
            if (logo) {
                logo.src = settings.company_logo;
            }
        }
        
    } catch (error) {
        console.error('Erro ao carregar configurações:', error);
    }
}

// Carregar propriedades
async function loadProperties() {
    try {
        allProperties = await window.dbService.getProperties({ isSold: false });
        renderProperties(allProperties);
    } catch (error) {
        console.error('Erro ao carregar propriedades:', error);
        showMessage(window.CONFIG.MESSAGES.error.loadingProperties, 'error');
    }
}

// Carregar propriedades vendidas
async function loadSoldProperties() {
    try {
        const soldProperties = await window.dbService.getProperties({ isSold: true });
        renderSoldProperties(soldProperties);
    } catch (error) {
        console.error('Erro ao carregar propriedades vendidas:', error);
    }
}

// Carregar testemunhos
async function loadTestimonials() {
    try {
        const testimonials = await window.dbService.getTestimonials();
        renderTestimonials(testimonials);
    } catch (error) {
        console.error('Erro ao carregar testemunhos:', error);
        showMessage(window.CONFIG.MESSAGES.error.loadingTestimonials, 'error');
    }
}

// Carregar proprietários/corretores
async function loadOwners() {
    try {
        const owners = await window.dbService.getOwners();
        renderOwners(owners);
    } catch (error) {
        console.error('Erro ao carregar proprietários:', error);
        showMessage(window.CONFIG.MESSAGES.error.loadingOwners, 'error');
    }
}

// Carregar regiões disponíveis
async function loadRegions() {
    try {
        allRegions = await window.dbService.getAvailableRegions();
        populateRegionFilter(allRegions);
    } catch (error) {
        console.error('Erro ao carregar regiões:', error);
    }
}

// Renderizar propriedades
function renderProperties(properties) {
    const container = document.getElementById('propertiesGrid');
    const noResults = document.getElementById('noProperties');
    
    if (!container) return;
    
    if (properties.length === 0) {
        container.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    container.innerHTML = properties.map(property => `
        <div class="property-card" onclick="openPropertyModal('${property.id}')" data-aos="fade-up">
            <div class="property-image" style="background-image: url('${FormatUtils.getMainImage(property.property_images)}')">
                <div class="property-price">${FormatUtils.formatCurrency(property.price)}</div>
            </div>
            <div class="property-info">
                <h3 class="property-title">${property.title}</h3>
                <p class="property-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${property.region}
                </p>
                <div class="property-features">
                    <div class="feature">
                        <i class="fas fa-bed"></i>
                        ${property.bedrooms} quartos
                    </div>
                    <div class="feature">
                        <i class="fas fa-bath"></i>
                        ${property.bathrooms} banheiros
                    </div>
                    ${property.area ? `
                        <div class="feature">
                            <i class="fas fa-ruler"></i>
                            ${property.area}m²
                        </div>
                    ` : ''}
                </div>
                <p class="property-description">
                    ${FormatUtils.truncateText(property.description || '', 100)}
                </p>
            </div>
        </div>
    `).join('');
}

// Renderizar propriedades vendidas
function renderSoldProperties(properties) {
    const container = document.getElementById('soldPropertiesGrid');
    
    if (!container || properties.length === 0) {
        if (container) container.innerHTML = '<p class="no-results">Nenhuma propriedade vendida ainda.</p>';
        return;
    }
    
    container.innerHTML = properties.slice(0, 6).map(property => `
        <div class="property-card sold" data-aos="fade-up">
            <div class="property-image" style="background-image: url('${FormatUtils.getMainImage(property.property_images)}')">
                <div class="property-price">${FormatUtils.formatCurrency(property.price)}</div>
            </div>
            <div class="property-info">
                <h3 class="property-title">${property.title}</h3>
                <p class="property-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${property.region}
                </p>
                <div class="property-features">
                    <div class="feature">
                        <i class="fas fa-bed"></i>
                        ${property.bedrooms} quartos
                    </div>
                    <div class="feature">
                        <i class="fas fa-bath"></i>
                        ${property.bathrooms} banheiros
                    </div>
                </div>
                ${property.days_to_sell ? `
                    <div class="sold-info">
                        <i class="fas fa-check-circle"></i>
                        Vendido em ${property.days_to_sell} dias
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Renderizar testemunhos
function renderTestimonials(testimonials) {
    const container = document.getElementById('testimonialsGrid');
    
    if (!container) return;
    
    if (testimonials.length === 0) {
        container.innerHTML = '<p class="no-results">Nenhum testemunho disponível.</p>';
        return;
    }
    
    container.innerHTML = testimonials.map(testimonial => `
        <div class="testimonial-card" data-aos="fade-up">
            <p class="testimonial-text">${testimonial.testimonial_text}</p>
            <div class="testimonial-author">
                ${testimonial.client_photo ? `
                    <img src="${testimonial.client_photo}" alt="${testimonial.client_name}" class="testimonial-photo">
                ` : `
                    <div class="testimonial-photo" style="background: #3498db; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                        ${testimonial.client_name.charAt(0)}
                    </div>
                `}
                <div class="author-info">
                    <h4>${testimonial.client_name}</h4>
                    <div class="testimonial-rating">
                        ${Array(testimonial.rating).fill().map(() => '<i class="fas fa-star star"></i>').join('')}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Renderizar proprietários/corretores
function renderOwners(owners) {
    const container = document.getElementById('ownersGrid');
    
    if (!container) return;
    
    if (owners.length === 0) {
        container.innerHTML = '<p class="no-results">Informações da equipe não disponíveis.</p>';
        return;
    }
    
    container.innerHTML = owners.map(owner => `
        <div class="owner-card" data-aos="fade-up">
            ${owner.photo_url ? `
                <img src="${owner.photo_url}" alt="${owner.name}" class="owner-photo">
            ` : `
                <div class="owner-photo" style="background: #3498db; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem; font-weight: bold;">
                    ${owner.name.charAt(0)}
                </div>
            `}
            <h3 class="owner-name">${owner.name}</h3>
            ${owner.position ? `<p class="owner-position">${owner.position}</p>` : ''}
            ${owner.bio ? `<p class="owner-bio">${owner.bio}</p>` : ''}
        </div>
    `).join('');
}

// Popular filtro de regiões
function populateRegionFilter(regions) {
    const select = document.getElementById('regionFilter');
    if (!select) return;
    
    // Manter opção "Todas"
    const defaultOption = select.querySelector('option[value=""]');
    select.innerHTML = '';
    if (defaultOption) select.appendChild(defaultOption);
    
    regions.forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        select.appendChild(option);
    });
}

// Atualizar filtros
function updateFilters() {
    currentFilters.bedrooms = document.getElementById('bedroomsFilter').value;
    currentFilters.bathrooms = document.getElementById('bathroomsFilter').value;
    currentFilters.region = document.getElementById('regionFilter').value;
}

// Aplicar filtros
async function applyFilters() {
    showLoading('loadingProperties');
    
    try {
        const filteredProperties = await window.dbService.getProperties(currentFilters);
        renderProperties(filteredProperties);
        
        // Scroll suave para as propriedades
        document.getElementById('properties').scrollIntoView({ 
            behavior: 'smooth' 
        });
        
    } catch (error) {
        console.error('Erro ao aplicar filtros:', error);
        showMessage('Erro ao filtrar propriedades.', 'error');
    } finally {
        hideLoading('loadingProperties');
    }
}

// Abrir modal de propriedade
async function openPropertyModal(propertyId) {
    try {
        const property = await window.dbService.getPropertyById(propertyId);
        
        const modalContent = document.getElementById('propertyModalContent');
        if (!modalContent) return;
        
        modalContent.innerHTML = `
            <div class="property-modal-header">
                <h2 class="property-modal-title">${property.title}</h2>
                <p class="property-modal-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${property.address || property.region}
                </p>
            </div>
            
            ${property.property_images && property.property_images.length > 0 ? `
                <div class="property-modal-gallery">
                    ${property.property_images.map(img => `
                        <img src="${img.image_url}" alt="${property.title}">
                    `).join('')}
                </div>
            ` : ''}
            
            <div class="property-modal-details">
                <div class="detail-section">
                    <h3>Informações Gerais</h3>
                    <div class="detail-item">
                        <span>Preço:</span>
                        <strong>${FormatUtils.formatCurrency(property.price)}</strong>
                    </div>
                    <div class="detail-item">
                        <span>Quartos:</span>
                        <span>${property.bedrooms}</span>
                    </div>
                    <div class="detail-item">
                        <span>Banheiros:</span>
                        <span>${property.bathrooms}</span>
                    </div>
                    ${property.area ? `
                        <div class="detail-item">
                            <span>Área:</span>
                            <span>${property.area}m²</span>
                        </div>
                    ` : ''}
                    <div class="detail-item">
                        <span>Região:</span>
                        <span>${property.region}</span>
                    </div>
                </div>
                
                ${property.description ? `
                    <div class="detail-section">
                        <h3>Descrição</h3>
                        <p>${property.description}</p>
                    </div>
                ` : ''}
            </div>
            
            <div style="text-align: center; margin-top: 2rem;">
                <button class="btn-primary" onclick="scrollToContact(); closeModal('propertyModal');">
                    <i class="fas fa-heart"></i>
                    Tenho Interesse
                </button>
            </div>
        `;
        
        openModal('propertyModal');
        
    } catch (error) {
        console.error('Erro ao carregar detalhes da propriedade:', error);
        showMessage('Erro ao carregar detalhes da propriedade.', 'error');
    }
}

// Funções de modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Abrir modal de lista de espera
function openWaitlist() {
    openModal('waitlistModal');
}

// Handle do formulário de interesse do comprador
async function handleBuyerInterestSubmit(e) {
    e.preventDefault();
    
    const formData = {
        buyer_name: document.getElementById('buyerName').value,
        buyer_email: document.getElementById('buyerEmail').value,
        buyer_phone: document.getElementById('buyerPhone').value || null,
        max_budget: parseInt(document.getElementById('maxBudget').value) || null,
        preferred_bedrooms: parseInt(document.getElementById('preferredBedrooms').value) || null,
        preferred_bathrooms: parseInt(document.getElementById('preferredBathrooms').value) || null,
        message: document.getElementById('buyerMessage').value || null,
        preferred_regions: [] // Pode ser expandido no futuro
    };
    
    // Validação básica
    if (!formData.buyer_name || !formData.buyer_email) {
        showMessage(window.CONFIG.MESSAGES.error.validation, 'error');
        return;
    }
    
    if (!window.CONFIG.VALIDATION.email.test(formData.buyer_email)) {
        showMessage('Por favor, insira um e-mail válido.', 'error');
        return;
    }
    
    try {
        // Mostrar estado de carregamento
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        await window.dbService.createBuyerInterest(formData);
        
        // Limpar formulário
        e.target.reset();
        
        // Mostrar mensagem de sucesso
        showMessage(window.CONFIG.MESSAGES.success.interestSent, 'success');
        
        // Restaurar botão
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
    } catch (error) {
        console.error('Erro ao enviar interesse:', error);
        showMessage('Erro ao enviar seu interesse. Tente novamente.', 'error');
        
        // Restaurar botão
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Interesse';
        submitBtn.disabled = false;
    }
}

// Handle do formulário de lista de espera
async function handleWaitlistSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('waitlistName').value,
        email: document.getElementById('waitlistEmail').value,
        phone: document.getElementById('waitlistPhone').value || null
    };
    
    // Validação básica
    if (!formData.name || !formData.email) {
        showMessage(window.CONFIG.MESSAGES.error.validation, 'error');
        return;
    }
    
    if (!window.CONFIG.VALIDATION.email.test(formData.email)) {
        showMessage('Por favor, insira um e-mail válido.', 'error');
        return;
    }
    
    try {
        // Mostrar estado de carregamento
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adicionando...';
        submitBtn.disabled = true;
        
        await window.dbService.addToWaitlist(formData);
        
        // Limpar formulário
        e.target.reset();
        
        // Fechar modal
        closeModal('waitlistModal');
        
        // Mostrar mensagem de sucesso
        showMessage(window.CONFIG.MESSAGES.success.waitlistJoined, 'success');
        
    } catch (error) {
        console.error('Erro ao adicionar à lista de espera:', error);
        
        let errorMessage = 'Erro ao adicionar à lista de espera. Tente novamente.';
        if (error.message === window.CONFIG.MESSAGES.error.emailExists) {
            errorMessage = error.message;
        }
        
        showMessage(errorMessage, 'error');
        
        // Restaurar botão
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.innerHTML = 'Entrar na Lista';
        submitBtn.disabled = false;
    }
}

// Funções de navegação
function scrollToProperties() {
    document.getElementById('properties').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

function scrollToContact() {
    document.getElementById('contact').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Função para mostrar mensagens
function showMessage(message, type = 'success') {
    const messageDiv = document.getElementById('successMessage');
    if (!messageDiv) return;
    
    messageDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    messageDiv.className = `success-message ${type === 'error' ? 'error-message' : ''}`;
    messageDiv.style.display = 'flex';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, window.CONFIG.SITE.toastDuration + 2000);
}

// Funções de loading
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'block';
    }
}

function hideLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'none';
    }
}

// Função para atualizar texto de elementos
function updateElementText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element && text) {
        element.textContent = text;
    }
}

// Handle do scroll para animações e header
function handleScroll() {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    }
}

// Configurar animações de scroll
function setupScrollAnimations() {
    // Intersection Observer para animações
    const observerOptions = window.CONFIG.ANIMATION.observerOptions;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add(window.CONFIG.ANIMATION.fadeIn);
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    const animatedElements = document.querySelectorAll(
        '.property-card, .testimonial-card, .owner-card, .hero-content'
    );
    
    animatedElements.forEach(el => observer.observe(el));
}

// Função para buscar propriedades (pode ser usada no futuro)
async function searchProperties(searchTerm) {
    if (!searchTerm.trim()) {
        renderProperties(allProperties);
        return;
    }
    
    try {
        showLoading('loadingProperties');
        const results = await window.dbService.searchProperties(searchTerm);
        renderProperties(results);
    } catch (error) {
        console.error('Erro na busca:', error);
        showMessage('Erro ao buscar propriedades.', 'error');
    } finally {
        hideLoading('loadingProperties');
    }
}

// Função para compartilhar propriedade
function shareProperty(propertyId, propertyTitle) {
    if (navigator.share) {
        navigator.share({
            title: propertyTitle,
            text: `Confira este imóvel incrível: ${propertyTitle}`,
            url: `${window.location.origin}?property=${propertyId}`
        }).catch(err => console.log('Erro ao compartilhar:', err));
    } else {
        // Fallback - copiar para clipboard
        const url = `${window.location.origin}?property=${propertyId}`;
        navigator.clipboard.writeText(url).then(() => {
            showMessage('Link copiado para a área de transferência!', 'success');
        }).catch(() => {
            showMessage('Erro ao copiar link.', 'error');
        });
    }
}

// Função para favoritar propriedade (localStorage)
function toggleFavorite(propertyId) {
    let favorites = JSON.parse(localStorage.getItem('favoriteProperties') || '[]');
    
    const index = favorites.indexOf(propertyId);
    if (index > -1) {
        favorites.splice(index, 1);
        showMessage('Propriedade removida dos favoritos.', 'success');
    } else {
        favorites.push(propertyId);
        showMessage('Propriedade adicionada aos favoritos.', 'success');
    }
    
    localStorage.setItem('favoriteProperties', JSON.stringify(favorites));
    updateFavoriteButtons();
}

// Atualizar botões de favorito
function updateFavoriteButtons() {
    const favorites = JSON.parse(localStorage.getItem('favoriteProperties') || '[]');
    
    document.querySelectorAll('[data-property-id]').forEach(btn => {
        const propertyId = btn.getAttribute('data-property-id');
        const icon = btn.querySelector('i');
        
        if (favorites.includes(propertyId)) {
            icon.className = 'fas fa-heart';
            btn.classList.add('favorited');
        } else {
            icon.className = 'far fa-heart';
            btn.classList.remove('favorited');
        }
    });
}

// Função para lidar com erros de imagem
function handleImageError(img) {
    img.src = '/images/no-image.jpg';
    img.alt = 'Imagem não disponível';
}

// Função para lazy loading de imagens
function setupLazyLoading() {
    const imageObserver = new IntersectionObserver((entries) => {
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

// Função para detectar propriedade específica na URL
function handlePropertyFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('property');
    
    if (propertyId) {
        // Aguardar um pouco para que a página carregue completamente
        setTimeout(() => {
            openPropertyModal(propertyId);
        }, 1000);
    }
}

// Event listener para detectar propriedade na URL
window.addEventListener('load', handlePropertyFromURL);

// Função para otimizar performance
function debounce(func, wait) {
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

// Versões otimizadas de funções que podem ser chamadas frequentemente
const debouncedSearch = debounce(searchProperties, 300);
const debouncedScroll = debounce(handleScroll, 10);

// Substituir o event listener de scroll
window.removeEventListener('scroll', handleScroll);
window.addEventListener('scroll', debouncedScroll);

// Função para salvar estado da página
function savePageState() {
    const state = {
        filters: currentFilters,
        scrollPosition: window.scrollY,
        timestamp: Date.now()
    };
    
    sessionStorage.setItem('pageState', JSON.stringify(state));
}

// Função para restaurar estado da página
function restorePageState() {
    const saved = sessionStorage.getItem('pageState');
    if (saved) {
        try {
            const state = JSON.parse(saved);
            
            // Restaurar apenas se não passou muito tempo (30 minutos)
            if (Date.now() - state.timestamp < 30 * 60 * 1000) {
                currentFilters = state.filters;
                
                // Aplicar filtros salvos
                if (state.filters.bedrooms) {
                    document.getElementById('bedroomsFilter').value = state.filters.bedrooms;
                }
                if (state.filters.bathrooms) {
                    document.getElementById('bathroomsFilter').value = state.filters.bathrooms;
                }
                if (state.filters.region) {
                    document.getElementById('regionFilter').value = state.filters.region;
                }
                if (state.filters.maxPrice) {
                    const priceRange = document.getElementById('priceRange');
                    const priceValue = document.getElementById('priceValue');
                    if (priceRange && priceValue) {
                        priceRange.value = state.filters.maxPrice;
                        priceValue.textContent = FormatUtils.formatCurrency(state.filters.maxPrice);
                    }
                }
                
                // Restaurar posição do scroll após um delay
                setTimeout(() => {
                    window.scrollTo(0, state.scrollPosition);
                }, 500);
            }
        } catch (error) {
            console.error('Erro ao restaurar estado da página:', error);
        }
    }
}

// Salvar estado quando a página for fechada
window.addEventListener('beforeunload', savePageState);

// Restaurar estado após inicialização
window.addEventListener('load', () => {
    setTimeout(restorePageState, 1000);
});

// Analytics simples (opcional)
function trackEvent(action, category = 'Property', label = '') {
    // Integração com Google Analytics ou outro sistema de analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
    
    console.log(`Event tracked: ${category} - ${action} - ${label}`);
}

// Adicionar tracking em ações importantes
const originalOpenPropertyModal = openPropertyModal;
openPropertyModal = function(propertyId) {
    trackEvent('property_view', 'Property', propertyId);
    return originalOpenPropertyModal(propertyId);
};

const originalHandleBuyerInterestSubmit = handleBuyerInterestSubmit;
handleBuyerInterestSubmit = function(e) {
    trackEvent('interest_submitted', 'Lead');
    return originalHandleBuyerInterestSubmit(e);
};

const originalHandleWaitlistSubmit = handleWaitlistSubmit;
handleWaitlistSubmit = function(e) {
    trackEvent('waitlist_joined', 'Lead');
    return originalHandleWaitlistSubmit(e);
};