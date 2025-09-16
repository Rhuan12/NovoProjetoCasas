// Configuração global
const CONFIG = {
    ITEMS_PER_PAGE: 9,
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 500,
    MAX_IMAGE_SIZE: 1024 * 1024 * 2 // 2MB
};

// Classe principal da aplicação
class RealEstateApp {
    constructor() {
        this.properties = [];
        this.filteredProperties = [];
        this.testimonials = [];
        this.teamMembers = [];
        this.currentPage = 1;
        this.activeFilters = {};
        this.init();
    }

    async init() {
        try {
            Utils.showLoading();
            
            // Verificar conexão com Supabase
            const connected = await SupabaseConfig.testConnection();
            if (!connected) {
                throw new Error('Não foi possível conectar ao banco de dados');
            }
            
            // Carregar dados
            await this.loadData();
            
            // Configurar event listeners
            this.setupEventListeners();
            
            // Renderizar componentes
            this.renderComponents();
            
            // Configurar lazy loading
            Utils.setupLazyLoading();
            
            Utils.hideLoading();
            Utils.showToast('Site carregado com sucesso!');
            
        } catch (error) {
            console.error('Erro na inicialização:', error);
            Utils.hideLoading();
            Utils.showToast('Erro ao carregar o site. Tente novamente.', 'error');
        }
    }

    async loadData() {
        try {
            const [properties, testimonials, teamMembers] = await Promise.all([
                PropertyService.getAllProperties(),
                PropertyService.getApprovedTestimonials(),
                PropertyService.getActiveTeamMembers()
            ]);
            
            this.properties = properties;
            this.testimonials = testimonials;
            this.teamMembers = teamMembers;
            this.filteredProperties = properties.filter(p => !p.sold);
            
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            throw error;
        }
    }

    setupEventListeners() {
        // Menu mobile
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
        }
        
        // Filtros com debounce
        const filterElements = ['quartos', 'banheiros', 'preco', 'regiao'];
        filterElements.forEach(filterId => {
            const element = document.getElementById(filterId);
            if (element) {
                element.addEventListener('change', 
                    Utils.debounce(this.handleFilterChange.bind(this), CONFIG.DEBOUNCE_DELAY)
                );
            }
        });
        
        // Botão de busca
        const searchBtn = document.querySelector('[onclick="filtrarImoveis()"]');
        if (searchBtn) {
            searchBtn.onclick = null; // Remove onclick inline
            searchBtn.addEventListener('click', this.handleSearch.bind(this));
        }
        
        // Formulários
        const waitlistForm = document.getElementById('waitlist-form');
        if (waitlistForm) {
            waitlistForm.addEventListener('submit', this.handleWaitlistSubmission.bind(this));
        }
        
        // Modal close buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-close-modal]')) {
                this.closeModal(e.target.getAttribute('data-close-modal'));
            }
        });
        
        // Navegação suave
        this.setupSmoothScrolling();
        
        // Tracking de eventos
        this.setupAnalyticsTracking();
        
        // Keyboard navigation
        this.setupKeyboardNavigation();
    }

    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.toggle('hidden');
        }
    }

    handleFilterChange(event) {
        const filterId = event.target.id;
        const value = event.target.value;
        
        if (value) {
            this.activeFilters[filterId] = value;
        } else {
            delete this.activeFilters[filterId];
        }
        
        // Auto-aplicar filtros
        this.applyFilters();
    }

    async handleSearch() {
        Utils.trackEvent('search_properties', this.activeFilters);
        await this.applyFilters();
    }

    async applyFilters() {
        try {
            Utils.showLoading('properties-container');
            
            const filteredData = await PropertyService.filterProperties(this.activeFilters);
            this.filteredProperties = filteredData;
            
            this.renderProperties();
            Utils.hideLoading();
            
            if (this.filteredProperties.length === 0) {
                this.showNoResultsMessage();
            } else {
                Utils.showToast(`${this.filteredProperties.length} imóveis encontrados`);
            }
            
        } catch (error) {
            console.error('Erro ao filtrar propriedades:', error);
            Utils.hideLoading();
            Utils.showToast('Erro ao filtrar propriedades', 'error');
        }
    }

    async handleWaitlistSubmission(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const waitlistData = {
            nome: formData.get('nome'),
            email: formData.get('email'),
            telefone: formData.get('telefone')
        };
        
        // Validações
        if (!this.validateWaitlistData(waitlistData)) {
            return;
        }
        
        try {
            const result = await PropertyService.addToWaitlist(waitlistData);
            
            if (result.success) {
                Utils.showToast('Obrigado! Você foi adicionado à nossa lista de espera.');
                event.target.reset();
                this.closeModal('waitlist-modal');
                Utils.trackEvent('waitlist_signup', waitlistData);
                
                // Enviar email de confirmação (se implementado)
                this.sendConfirmationEmail(waitlistData.email);
                
            } else {
                throw new Error(result.message);
            }
            
        } catch (error) {
            console.error('Erro ao adicionar à lista de espera:', error);
            Utils.showToast('Erro ao processar solicitação. Tente novamente.', 'error');
        }
    }

    validateWaitlistData(data) {
        if (!data.nome || !data.email || !data.telefone) {
            Utils.showToast('Por favor, preencha todos os campos', 'warning');
            return false;
        }
        
        if (!Utils.isValidEmail(data.email)) {
            Utils.showToast('Por favor, insira um email válido', 'warning');
            return false;
        }
        
        if (!Utils.isValidPhone(data.telefone)) {
            Utils.showToast('Por favor, insira um telefone válido', 'warning');
            return false;
        }
        
        return true;
    }

    async handleInterestSubmission(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const interestData = {
            property_id: formData.get('property_id'),
            nome: formData.get('nome'),
            email: formData.get('email'),
            telefone: formData.get('telefone'),
            max_price: formData.get('max_price'),
            quartos_desejados: formData.get('quartos_desejados'),
            banheiros_desejados: formData.get('banheiros_desejados'),
            regiao_preferida: formData.get('regiao_preferida')
        };
        
        try {
            const result = await PropertyService.addInterestedBuyer(interestData);
            
            if (result.success) {
                Utils.showToast('Seu interesse foi registrado! Entraremos em contato em breve.');
                event.target.reset();
                this.closeModal('interest-modal');
                Utils.trackEvent('property_interest_submitted', interestData);
            } else {
                throw new Error(result.message);
            }
            
        } catch (error) {
            console.error('Erro ao registrar interesse:', error);
            Utils.showToast('Erro ao processar interesse. Tente novamente.', 'error');
        }
    }

    renderComponents() {
        this.renderProperties();
        this.renderTestimonials();
        this.renderSoldProperties();
        this.renderTeamMembers();
    }

    renderProperties() {
        const container = document.getElementById('properties-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        // Paginação
        const startIndex = (this.currentPage - 1) * CONFIG.ITEMS_PER_PAGE;
        const endIndex = startIndex + CONFIG.ITEMS_PER_PAGE;
        const paginatedProperties = this.filteredProperties.slice(startIndex, endIndex);
        
        paginatedProperties.forEach((property, index) => {
            const propertyCard = this.createPropertyCard(property);
            propertyCard.style.animationDelay = `${index * 0.1}s`;
            container.appendChild(propertyCard);
        });
        
        // Renderizar paginação se necessário
        if (this.filteredProperties.length > CONFIG.ITEMS_PER_PAGE) {
            this.renderPagination();
        }
    }

    createPropertyCard(property) {
        const card = document.createElement('div');
        card.className = `property-card bg-white rounded-lg shadow-lg overflow-hidden fade-in ${property.sold ? 'sold-property' : ''}`;
        
        const images = property.image_url || ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400'];
        const primaryImage = images[0];
        
        card.innerHTML = `
            <div class="relative">
                <img src="${primaryImage}" 
                     alt="${property.title}" 
                     class="w-full h-48 object-cover"
                     loading="lazy">
                ${property.sold ? 
                    '<div class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">VENDIDO</div>' :
                    '<div class="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-semibold">DISPONÍVEL</div>'
                }
                ${images.length > 1 ? 
                    '<div class="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm"><i class="fas fa-images mr-1"></i>' + images.length + ' fotos</div>' : ''
                }
            </div>
            <div class="p-6">
                <h3 class="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">${property.title}</h3>
                <p class="text-2xl font-bold text-blue-600 mb-3">${Utils.formatCurrency(property.price)}</p>
                
                <div class="flex items-center justify-between text-gray-600 mb-4">
                    <div class="flex items-center">
                        <i class="fas fa-bed mr-1"></i>
                        <span class="mr-3">${property.quartos}</span>
                        <i class="fas fa-bath mr-1"></i>
                        <span class="mr-3">${property.banheiros}</span>
                        ${property.area ? `<i class="fas fa-ruler-combined mr-1"></i><span>${property.area}m²</span>` : ''}
                    </div>
                </div>
                
                <div class="flex items-center text-sm text-gray-500 mb-4">
                    <i class="fas fa-map-marker-alt mr-1"></i>
                    <span class="capitalize">${property.regiao}</span>
                </div>
                
                ${property.sold ? 
                    `<div class="text-green-600 font-semibold flex items-center">
                        <i class="fas fa-check-circle mr-2"></i>
                        Vendido em ${property.days_to_sell || 'N/A'} dias
                    </div>` :
                    `<div class="space-y-2">
                        <div class="text-gray-500 text-sm flex items-center">
                            <i class="fas fa-clock mr-1"></i>
                            ${this.calculateDaysOnMarket(property.created_at)} dias no mercado
                        </div>
                        <button onclick="app.showInterest(${property.id})" 
                                class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                            <i class="fas fa-heart mr-2"></i>Tenho Interesse
                        </button>
                        <button onclick="app.scheduleVisit(${property.id})" 
                                class="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200">
                            <i class="fas fa-calendar mr-2"></i>Agendar Visita
                        </button>
                    </div>`
                }
            </div>
        `;
        
        return card;
    }

    calculateDaysOnMarket(createdDate) {
        const created = new Date(createdDate);
        const now = new Date();
        const diffTime = Math.abs(now - created);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredProperties.length / CONFIG.ITEMS_PER_PAGE);
        if (totalPages <= 1) return;
        
        const paginationContainer = document.getElementById('pagination-container') || this.createPaginationContainer();
        paginationContainer.innerHTML = '';
        
        const pagination = document.createElement('div');
        pagination.className = 'flex justify-center items-center space-x-2 mt-8';
        
        // Botão anterior
        const prevBtn = document.createElement('button');
        prevBtn.className = `px-3 py-2 rounded-lg ${this.currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}`;
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.disabled = this.currentPage === 1;
        prevBtn.onclick = () => this.changePage(this.currentPage - 1);
        pagination.appendChild(prevBtn);
        
        // Números das páginas
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                const pageBtn = document.createElement('button');
                pageBtn.className = `px-3 py-2 rounded-lg ${i === this.currentPage ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`;
                pageBtn.textContent = i;
                pageBtn.onclick = () => this.changePage(i);
                pagination.appendChild(pageBtn);
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'px-3 py-2 text-gray-400';
                ellipsis.textContent = '...';
                pagination.appendChild(ellipsis);
            }
        }
        
        // Botão próximo
        const nextBtn = document.createElement('button');
        nextBtn.className = `px-3 py-2 rounded-lg ${this.currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}`;
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.disabled = this.currentPage === totalPages;
        nextBtn.onclick = () => this.changePage(this.currentPage + 1);
        pagination.appendChild(nextBtn);
        
        paginationContainer.appendChild(pagination);
    }

    createPaginationContainer() {
        const container = document.createElement('div');
        container.id = 'pagination-container';
        const propertiesSection = document.getElementById('properties-container').parentElement;
        propertiesSection.appendChild(container);
        return container;
    }

    changePage(page) {
        this.currentPage = page;
        this.renderProperties();
        Utils.smoothScrollTo('imoveis');
        Utils.trackEvent('pagination_change', { page });
    }

    renderTestimonials() {
        const container = document.getElementById('testimonials-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.testimonials.forEach((testimonial, index) => {
            const testimonialCard = this.createTestimonialCard(testimonial);
            testimonialCard.style.animationDelay = `${index * 0.2}s`;
            container.appendChild(testimonialCard);
        });
    }

    createTestimonialCard(testimonial) {
        const card = document.createElement('div');
        card.className = 'testimonial-card bg-white rounded-lg shadow-lg p-6 fade-in';
        
        card.innerHTML = `
            <div class="flex items-center mb-4">
                ${Array(testimonial.rating).fill('').map(() => '<i class="fas fa-star text-yellow-400"></i>').join('')}
                ${Array(5 - testimonial.rating).fill('').map(() => '<i class="fas fa-star text-gray-300"></i>').join('')}
            </div>
            <p class="text-gray-600 mb-4 italic leading-relaxed">"${testimonial.texto}"</p>
            <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    ${testimonial.nome[0].toUpperCase()}
                </div>
                <div>
                    <div class="font-semibold text-gray-800">${testimonial.nome}</div>
                    <div class="text-sm text-gray-500 flex items-center">
                        <i class="fas fa-google mr-1"></i>${testimonial.source}
                    </div>
                    <div class="text-xs text-gray-400">
                        ${Utils.formatDate(testimonial.created_at)}
                    </div>
                </div>
            </div>
        `;
        
        return card;
    }

    renderSoldProperties() {
        const container = document.getElementById('sold-properties-container');
        if (!container) return;
        
        const soldProperties = this.properties.filter(p => p.sold).slice(0, 8);
        container.innerHTML = '';
        
        soldProperties.forEach((property, index) => {
            const propertyCard = this.createSoldPropertyCard(property);
            propertyCard.style.animationDelay = `${index * 0.1}s`;
            container.appendChild(propertyCard);
        });
    }

    createSoldPropertyCard(property) {
        const card = document.createElement('div');
        card.className = 'sold-property bg-white rounded-lg shadow-lg overflow-hidden fade-in';
        
        card.innerHTML = `
            <div class="relative">
                <img src="${property.image_url?.[0] || 'https://via.placeholder.com/300x200'}" 
                     alt="${property.title}" 
                     class="w-full h-32 object-cover">
                <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div class="text-white text-center">
                        <div class="text-sm font-semibold mb-1">VENDIDO</div>
                        <div class="text-xs">${property.days_to_sell || 'N/A'} dias</div>
                    </div>
                </div>
            </div>
            <div class="p-4">
                <h4 class="font-medium text-gray-800 mb-1 text-sm line-clamp-2">${property.title}</h4>
                <p class="text-blue-600 font-bold text-sm">${Utils.formatCurrency(property.price)}</p>
                <div class="text-xs text-gray-500 mt-1">
                    ${property.quartos}Q • ${property.banheiros}B • ${property.regiao}
                </div>
            </div>
        `;
        
        return card;
    }

    renderTeamMembers() {
        const container = document.getElementById('team-photos');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.teamMembers.slice(0, 4).forEach((member, index) => {
            const memberCard = document.createElement('div');
            memberCard.className = 'bg-gray-200 rounded-lg h-48 flex items-center justify-center relative overflow-hidden group cursor-pointer';
            
            if (member.photo_url) {
                memberCard.innerHTML = `
                    <img src="${member.photo_url}" alt="${member.nome}" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div class="absolute bottom-4 left-4 text-white">
                            <h4 class="font-semibold">${member.nome}</h4>
                            <p class="text-sm opacity-90">${member.cargo || 'Corretor'}</p>
                        </div>
                    </div>
                `;
            } else {
                memberCard.innerHTML = `
                    <div class="text-center">
                        <i class="fas fa-user text-4xl text-gray-400 mb-2"></i>
                        <div class="text-sm text-gray-600 font-medium">${member.nome}</div>
                        <div class="text-xs text-gray-500">${member.cargo || 'Corretor'}</div>
                    </div>
                `;
            }
            
            memberCard.onclick = () => this.showTeamMemberDetails(member);
            container.appendChild(memberCard);
        });
    }

    showInterest(propertyId) {
        Utils.trackEvent('property_interest_clicked', { propertyId });
        
        const modal = document.getElementById('waitlist-modal');
        if (modal) {
            // Adicionar propriedade ID ao modal se necessário
            const hiddenInput = modal.querySelector('input[name="property_id"]');
            if (hiddenInput) {
                hiddenInput.value = propertyId;
            }
            
            modal.classList.remove('hidden');
            modal.querySelector('input[name="nome"]')?.focus();
        }
    }

    scheduleVisit(propertyId) {
        Utils.trackEvent('schedule_visit_clicked', { propertyId });
        
        // Implementar modal de agendamento de visita
        const property = this.properties.find(p => p.id === propertyId);
        if (property) {
            const whatsappMessage = `Olá! Gostaria de agendar uma visita para o imóvel: ${property.title}`;
            const phoneNumber = '5511999999999'; // Número da empresa
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');
        }
    }

    showTeamMemberDetails(member) {
        Utils.trackEvent('team_member_clicked', { memberName: member.nome });
        
        // Implementar modal de detalhes do membro da equipe
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
        
        modal.innerHTML = `
            <div class="bg-white rounded-lg max-w-md w-full p-6">
                <div class="text-center mb-6">
                    ${member.photo_url ? 
                        `<img src="${member.photo_url}" alt="${member.nome}" class="w-24 h-24 rounded-full mx-auto mb-4 object-cover">` :
                        `<div class="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <i class="fas fa-user text-2xl text-gray-500"></i>
                         </div>`
                    }
                    <h3 class="text-2xl font-bold text-gray-800">${member.nome}</h3>
                    <p class="text-blue-600 font-medium">${member.cargo || 'Corretor de Imóveis'}</p>
                </div>
                
                ${member.bio ? `<p class="text-gray-600 mb-6 leading-relaxed">${member.bio}</p>` : ''}
                
                <div class="space-y-3">
                    ${member.email ? 
                        `<a href="mailto:${member.email}" class="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                            <i class="fas fa-envelope mr-3"></i>${member.email}
                         </a>` : ''
                    }
                    ${member.telefone ? 
                        `<a href="tel:${member.telefone}" class="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                            <i class="fas fa-phone mr-3"></i>${member.telefone}
                         </a>` : ''
                    }
                </div>
                
                <button onclick="this.parentElement.parentElement.remove()" 
                        class="mt-6 w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                    Fechar
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    showNoResultsMessage() {
        const container = document.getElementById('properties-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="col-span-full text-center py-16">
                <div class="max-w-md mx-auto">
                    <i class="fas fa-search text-6xl text-gray-300 mb-6"></i>
                    <h3 class="text-2xl font-bold text-gray-700 mb-3">Nenhum imóvel encontrado</h3>
                    <p class="text-gray-500 mb-8 leading-relaxed">
                        Não encontramos imóveis que correspondam aos seus critérios de busca. 
                        Tente ajustar os filtros ou entre na nossa lista de espera para ser 
                        notificado sobre novos imóveis que correspondam ao seu perfil.
                    </p>
                    <div class="space-y-3">
                        <button onclick="app.clearFilters()" 
                                class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                            <i class="fas fa-refresh mr-2"></i>Limpar Filtros
                        </button>
                        <button onclick="app.showInterest()" 
                                class="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors">
                            <i class="fas fa-bell mr-2"></i>Entrar na Lista de Espera
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    clearFilters() {
        this.activeFilters = {};
        
        // Limpar campos do formulário
        ['quartos', 'banheiros', 'preco', 'regiao'].forEach(filterId => {
            const element = document.getElementById(filterId);
            if (element) {
                element.value = '';
            }
        });
        
        this.filteredProperties = this.properties.filter(p => !p.sold);
        this.currentPage = 1;
        this.renderProperties();
        
        Utils.trackEvent('filters_cleared');
        Utils.showToast('Filtros limpos com sucesso');
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                Utils.smoothScrollTo(targetId);
            });
        });
    }

    setupAnalyticsTracking() {
        // Track page views
        Utils.trackEvent('page_view', { page: 'home' });
        
        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', Utils.debounce(() => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (maxScroll % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                    Utils.trackEvent('scroll_depth', { depth: maxScroll });
                }
            }
        }, 1000));
        
        // Track time on page
        const startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Math.round((Date.now() - startTime) / 1000);
            Utils.trackEvent('time_on_page', { seconds: timeOnPage });
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // ESC para fechar modais
            if (e.key === 'Escape') {
                const openModals = document.querySelectorAll('.modal:not(.hidden)');
                openModals.forEach(modal => modal.classList.add('hidden'));
                
                const customModals = document.querySelectorAll('[id$="-modal"]:not(.hidden)');
                customModals.forEach(modal => modal.classList.add('hidden'));
            }
            
            // Ctrl/Cmd + K para busca rápida
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('#quartos, #regiao, #preco');
                if (searchInput) {
                    searchInput.focus();
                    Utils.showToast('Use os filtros para buscar imóveis');
                }
            }
            
            // Setas para navegação de páginas
            if (e.key === 'ArrowLeft' && e.altKey) {
                if (this.currentPage > 1) {
                    this.changePage(this.currentPage - 1);
                }
            }
            
            if (e.key === 'ArrowRight' && e.altKey) {
                const totalPages = Math.ceil(this.filteredProperties.length / CONFIG.ITEMS_PER_PAGE);
                if (this.currentPage < totalPages) {
                    this.changePage(this.currentPage + 1);
                }
            }
        });
    }

    // Método para enviar email de confirmação (integração com serviços de email)
    async sendConfirmationEmail(email) {
        try {
            // Aqui você integraria com um serviço de email como SendGrid, Mailgun, etc.
            // Por exemplo, usando uma função do Supabase Edge Functions
            
            const { data, error } = await SupabaseConfig.client.functions.invoke('send-email', {
                body: {
                    to: email,
                    template: 'waitlist_confirmation',
                    data: {
                        email: email
                    }
                }
            });
            
            if (error) throw error;
            console.log('Email de confirmação enviado:', email);
            
        } catch (error) {
            console.error('Erro ao enviar email de confirmação:', error);
            // Não mostrar erro para o usuário, pois é processo secundário
        }
    }

    // Método para busca em tempo real
    setupRealTimeSearch() {
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Buscar imóveis...';
        searchInput.className = 'w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500';
        searchInput.id = 'real-time-search';
        
        // Adicionar campo de busca ao hero section
        const searchContainer = document.querySelector('.hero-section .grid');
        if (searchContainer) {
            const searchDiv = document.createElement('div');
            searchDiv.className = 'md:col-span-4';
            searchDiv.innerHTML = `
                <label class="block text-gray-700 text-sm font-medium mb-2">Busca Rápida</label>
            `;
            searchDiv.appendChild(searchInput);
            searchContainer.insertBefore(searchDiv, searchContainer.firstChild);
        }
        
        // Event listener para busca em tempo real
        searchInput.addEventListener('input', Utils.debounce((e) => {
            const searchTerm = e.target.value.toLowerCase();
            this.performRealTimeSearch(searchTerm);
        }, CONFIG.DEBOUNCE_DELAY));
    }

    performRealTimeSearch(searchTerm) {
        if (!searchTerm) {
            this.filteredProperties = this.properties.filter(p => !p.sold);
        } else {
            this.filteredProperties = this.properties.filter(p => {
                if (p.sold) return false;
                
                return p.title.toLowerCase().includes(searchTerm) ||
                       p.description?.toLowerCase().includes(searchTerm) ||
                       p.regiao.toLowerCase().includes(searchTerm) ||
                       p.endereco?.toLowerCase().includes(searchTerm);
            });
        }
        
        this.currentPage = 1;
        this.renderProperties();
        
        Utils.trackEvent('real_time_search', { searchTerm, results: this.filteredProperties.length });
    }

    // Método para configurar service worker (PWA)
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registrado com sucesso:', registration);
                    })
                    .catch(registrationError => {
                        console.log('Falha no registro do SW:', registrationError);
                    });
            });
        }
    }

    // Método para configurar notificações push
    async setupPushNotifications() {
        if ('Notification' in window && 'serviceWorker' in navigator) {
            const permission = await Notification.requestPermission();
            
            if (permission === 'granted') {
                console.log('Permissão para notificações concedida');
                
                // Registrar para receber notificações sobre novos imóveis
                const registration = await navigator.serviceWorker.ready;
                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY' // Configurar VAPID key
                });
                
                // Salvar subscription no Supabase
                await this.savePushSubscription(subscription);
            }
        }
    }

    async savePushSubscription(subscription) {
        try {
            const { data, error } = await SupabaseConfig.client
                .from('push_subscriptions')
                .insert([{
                    subscription: JSON.stringify(subscription),
                    user_agent: navigator.userAgent,
                    created_at: new Date().toISOString()
                }]);
            
            if (error) throw error;
            console.log('Push subscription salva:', data);
            
        } catch (error) {
            console.error('Erro ao salvar push subscription:', error);
        }
    }

    // Método para configurar modo offline
    setupOfflineMode() {
        window.addEventListener('online', () => {
            Utils.showToast('Conexão restaurada!', 'success');
            this.syncOfflineData();
        });
        
        window.addEventListener('offline', () => {
            Utils.showToast('Você está offline. Algumas funcionalidades podem estar limitadas.', 'warning');
        });
    }

    async syncOfflineData() {
        // Sincronizar dados salvos offline quando a conexão for restaurada
        const offlineData = localStorage.getItem('offline_data');
        if (offlineData) {
            try {
                const data = JSON.parse(offlineData);
                
                for (const item of data) {
                    if (item.type === 'waitlist') {
                        await PropertyService.addToWaitlist(item.data);
                    } else if (item.type === 'interest') {
                        await PropertyService.addInterestedBuyer(item.data);
                    }
                }
                
                localStorage.removeItem('offline_data');
                Utils.showToast('Dados sincronizados com sucesso!');
                
            } catch (error) {
                console.error('Erro na sincronização:', error);
            }
        }
    }

    // Método para salvar dados offline quando não há conexão
    saveOfflineData(type, data) {
        if (!navigator.onLine) {
            let offlineData = JSON.parse(localStorage.getItem('offline_data') || '[]');
            offlineData.push({ type, data, timestamp: Date.now() });
            localStorage.setItem('offline_data', JSON.stringify(offlineData));
            
            Utils.showToast('Dados salvos localmente. Serão sincronizados quando você estiver online.');
            return true;
        }
        return false;
    }

    // Método para configurar lazy loading avançado
    setupAdvancedLazyLoading() {
        // Lazy loading para imagens de propriedades
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                        img.classList.remove('lazy');
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        // Observer para carregamento de seções
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    sectionObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '20px 0px',
            threshold: 0.1
        });
        
        // Aplicar observers
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
        
        document.querySelectorAll('section').forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // Método para otimização de performance
    optimizePerformance() {
        // Debounce scroll events
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Preload de imagens críticas
        this.preloadCriticalImages();
        
        // Lazy load de componentes não críticos
        setTimeout(() => {
            this.loadNonCriticalComponents();
        }, 1000);
    }

    handleScroll() {
        // Implementar funcionalidades dependentes de scroll
        const scrollTop = window.pageYOffset;
        
        // Header transparente/sólido baseado no scroll
        const header = document.querySelector('header');
        if (header) {
            if (scrollTop > 100) {
                header.classList.add('backdrop-blur-lg', 'bg-white/90');
            } else {
                header.classList.remove('backdrop-blur-lg', 'bg-white/90');
            }
        }
        
        // Botão "voltar ao topo"
        const backToTop = document.getElementById('back-to-top');
        if (backToTop) {
            if (scrollTop > 500) {
                backToTop.classList.remove('hidden');
            } else {
                backToTop.classList.add('hidden');
            }
        }
    }

    preloadCriticalImages() {
        // Preload das primeiras imagens de propriedades
        const criticalImages = this.properties.slice(0, 3)
            .map(p => p.image_url?.[0])
            .filter(Boolean);
        
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    loadNonCriticalComponents() {
        // Carregar componentes menos importantes depois
        this.setupRealTimeSearch();
        this.setupPushNotifications();
        this.setupAdvancedLazyLoading();
    }

    // Método para criar botão "voltar ao topo"
    createBackToTopButton() {
        const backToTop = document.createElement('button');
        backToTop.id = 'back-to-top';
        backToTop.className = 'fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-40 hidden';
        backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            Utils.trackEvent('back_to_top_clicked');
        });
        
        document.body.appendChild(backToTop);
    }

    // Método para exportar dados (para relatórios)
    exportData(format = 'json') {
        const data = {
            properties: this.properties,
            testimonials: this.testimonials,
            teamMembers: this.teamMembers,
            timestamp: new Date().toISOString()
        };
        
        if (format === 'json') {
            const dataStr = JSON.stringify(data, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `real_estate_data_${new Date().getTime()}.json`;
            a.click();
            
            URL.revokeObjectURL(url);
        }
        
        Utils.trackEvent('data_exported', { format });
    }

    // Método para limpar cache e otimizar performance
    clearCache() {
        // Limpar localStorage
        const keysToKeep = ['offline_data', 'user_preferences'];
        Object.keys(localStorage).forEach(key => {
            if (!keysToKeep.includes(key)) {
                localStorage.removeItem(key);
            }
        });
        
        // Limpar sessionStorage
        sessionStorage.clear();
        
        // Limpar cache do service worker
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    caches.delete(name);
                });
            });
        }
        
        Utils.showToast('Cache limpo com sucesso!');
    }

    // Método para debugging (apenas em desenvolvimento)
    debug() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.group('🏠 Real Estate App Debug Info');
            console.log('Properties:', this.properties);
            console.log('Filtered Properties:', this.filteredProperties);
            console.log('Active Filters:', this.activeFilters);
            console.log('Current Page:', this.currentPage);
            console.log('Testimonials:', this.testimonials);
            console.log('Team Members:', this.teamMembers);
            console.groupEnd();
        }
    }
}

// Classe para gerenciar preferências do usuário
class UserPreferences {
    constructor() {
        this.preferences = this.load();
    }

    load() {
        try {
            return JSON.parse(localStorage.getItem('user_preferences') || '{}');
        } catch {
            return {};
        }
    }

    save() {
        localStorage.setItem('user_preferences', JSON.stringify(this.preferences));
    }

    set(key, value) {
        this.preferences[key] = value;
        this.save();
    }

    get(key, defaultValue = null) {
        return this.preferences[key] || defaultValue;
    }

    getFilters() {
        return this.preferences.filters || {};
    }

    saveFilters(filters) {
        this.preferences.filters = filters;
        this.save();
    }
}

// Classe para analytics customizado
class Analytics {
    static events = [];
    
    static track(event, properties = {}) {
        const eventData = {
            event,
            properties: {
                ...properties,
                timestamp: new Date().toISOString(),
                url: window.location.href,
                userAgent: navigator.userAgent
            }
        };
        
        this.events.push(eventData);
        
        // Enviar para Google Analytics se disponível
        if (typeof gtag !== 'undefined') {
            gtag('event', event, properties);
        }
        
        // Enviar para outros serviços de analytics
        this.sendToCustomAnalytics(eventData);
        
        // Limpar eventos antigos (manter apenas os últimos 100)
        if (this.events.length > 100) {
            this.events = this.events.slice(-100);
        }
    }
    
    static async sendToCustomAnalytics(eventData) {
        try {
            // Enviar para Supabase ou outro serviço de analytics
            await SupabaseConfig.client
                .from('analytics_events')
                .insert([eventData]);
        } catch (error) {
            console.error('Erro ao enviar analytics:', error);
        }
    }
    
    static getEvents() {
        return this.events;
    }
    
    static exportEvents() {
        const data = JSON.stringify(this.events, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics_${new Date().getTime()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }
}

// Inicialização da aplicação
let app;
let userPreferences;

document.addEventListener('DOMContentLoaded', () => {
    // Verificar se o Supabase está disponível
    if (typeof window.supabase === 'undefined') {
        console.error('Supabase não foi carregado. Verifique se o script está incluído.');
        Utils.showToast('Erro: Banco de dados não disponível', 'error');
        return;
    }
    
    // Inicializar preferências do usuário
    userPreferences = new UserPreferences();
    
    // Inicializar aplicação principal
    app = new RealEstateApp();
    
    // Configurar funcionalidades adicionais
    app.setupOfflineMode();
    app.setupServiceWorker();
    app.createBackToTopButton();
    app.optimizePerformance();
    
    // Carregar filtros salvos
    const savedFilters = userPreferences.getFilters();
    if (Object.keys(savedFilters).length > 0) {
        Object.keys(savedFilters).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = savedFilters[key];
            }
        });
        app.activeFilters = savedFilters;
        app.applyFilters();
    }
    
    // Debug em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
        window.app = app; // Expor app globalmente para debugging
        app.debug();
    }
    
    // Analytics inicial
    Analytics.track('app_initialized', {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    });
});

// Salvar filtros ao sair da página
window.addEventListener('beforeunload', () => {
    if (app && userPreferences) {
        userPreferences.saveFilters(app.activeFilters);
    }
});

// Tratamento de erros globais
window.addEventListener('error', (e) => {
    console.error('Erro global capturado:', e.error);
    
    Analytics.track('javascript_error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        stack: e.error?.stack
    });
});

// Tratamento de promises rejeitadas
window.addEventListener('unhandledrejection', (e) => {
    console.error('Promise rejeitada não tratada:', e.reason);
    
    Analytics.track('unhandled_promise_rejection', {
        reason: e.reason?.toString(),
        stack: e.reason?.stack
    });
});

// Export das classes para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        RealEstateApp,
        UserPreferences,
        Analytics
    };
}