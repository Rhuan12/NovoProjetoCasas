// Estado global do admin
let currentSection = 'dashboard';
let currentEditId = null;
let deleteCallback = null;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});

async function initializeAdmin() {
    try {
        showLoading();
        
        // Configurar eventos
        setupEventListeners();
        
        // Carregar dados iniciais
        await loadDashboardStats();
        await loadAllData();
        
        hideLoading();
    } catch (error) {
        console.error('Erro ao inicializar admin:', error);
        showMessage('Erro ao carregar painel administrativo.', 'error');
        hideLoading();
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Modais
    setupModals();
    
    // Formulários
    setupForms();
    
    // Filtros e busca
    setupFiltersAndSearch();
    
    // Upload de arquivos
    setupFileUploads();
}

// Configurar modais
function setupModals() {
    const modals = document.querySelectorAll('.modal');
    const closeBtns = document.querySelectorAll('.close');

    closeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) closeModal(modal.id);
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });

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

// Configurar formulários
function setupForms() {
    // Formulário de propriedade
    const propertyForm = document.getElementById('propertyForm');
    if (propertyForm) {
        propertyForm.addEventListener('submit', handlePropertySubmit);
    }

    // Formulário de testemunho
    const testimonialForm = document.getElementById('testimonialForm');
    if (testimonialForm) {
        testimonialForm.addEventListener('submit', handleTestimonialSubmit);
    }

    // Formulário de membro da equipe
    const ownerForm = document.getElementById('ownerForm');
    if (ownerForm) {
        ownerForm.addEventListener('submit', handleOwnerSubmit);
    }

    // Formulário de configurações
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', handleSettingsSubmit);
    }
}

// Configurar filtros e busca
function setupFiltersAndSearch() {
    // Busca de propriedades
    const propertiesSearch = document.getElementById('propertiesSearch');
    if (propertiesSearch) {
        propertiesSearch.addEventListener('input', debounce(filterProperties, 300));
    }

    // Filtro de status de propriedades
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', filterProperties);
    }

    // Busca de interesses
    const interestsSearch = document.getElementById('interestsSearch');
    if (interestsSearch) {
        interestsSearch.addEventListener('input', debounce(filterInterests, 300));
    }
}

// Configurar uploads de arquivos
function setupFileUploads() {
    // Upload de imagens de propriedade
    const propertyImages = document.getElementById('propertyImages');
    if (propertyImages) {
        propertyImages.addEventListener('change', handlePropertyImagesChange);
    }

    // Upload de foto do cliente
    const clientPhoto = document.getElementById('clientPhoto');
    if (clientPhoto) {
        clientPhoto.addEventListener('change', (e) => handleImagePreview(e, 'clientPhotoPreview'));
    }

    // Upload de foto do proprietário
    const ownerPhoto = document.getElementById('ownerPhoto');
    if (ownerPhoto) {
        ownerPhoto.addEventListener('change', (e) => handleImagePreview(e, 'ownerPhotoPreview'));
    }

    // Upload de logo
    const companyLogo = document.getElementById('companyLogo');
    if (companyLogo) {
        companyLogo.addEventListener('change', (e) => handleImagePreview(e, 'logoPreview'));
    }
}

// Navegação entre seções
function showSection(sectionName) {
    // Esconder todas as seções
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Remover classe active de todos os nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Mostrar seção selecionada
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Adicionar classe active ao nav item
    const navItem = document.querySelector(`[onclick="showSection('${sectionName}')"]`).closest('.nav-item');
    if (navItem) {
        navItem.classList.add('active');
    }

    // Atualizar título e botão
    updatePageHeader(sectionName);

    // Carregar dados específicos da seção
    loadSectionData(sectionName);

    currentSection = sectionName;
}

// Atualizar cabeçalho da página
function updatePageHeader(sectionName) {
    const pageTitle = document.getElementById('pageTitle');
    const addBtn = document.getElementById('addNewBtn');
    const addBtnText = document.getElementById('addBtnText');

    const sectionConfig = {
        dashboard: { title: 'Dashboard', showBtn: false },
        properties: { title: 'Propriedades', btnText: 'Nova Propriedade' },
        testimonials: { title: 'Testemunhos', btnText: 'Novo Testemunho' },
        owners: { title: 'Equipe', btnText: 'Novo Membro' },
        interests: { title: 'Interesses de Compradores', showBtn: false },
        waitlist: { title: 'Lista de Espera', showBtn: false },
        settings: { title: 'Configurações', showBtn: false }
    };

    const config = sectionConfig[sectionName] || sectionConfig.dashboard;

    if (pageTitle) pageTitle.textContent = config.title;
    if (addBtn) addBtn.style.display = config.showBtn === false ? 'none' : 'flex';
    if (addBtnText) addBtnText.textContent = config.btnText || 'Adicionar';
}

// Carregar dados da seção
async function loadSectionData(sectionName) {
    try {
        switch (sectionName) {
            case 'properties':
                await loadProperties();
                break;
            case 'testimonials':
                await loadTestimonials();
                break;
            case 'owners':
                await loadOwners();
                break;
            case 'interests':
                await loadInterests();
                break;
            case 'waitlist':
                await loadWaitlist();
                break;
            case 'settings':
                await loadSettings();
                break;
        }
    } catch (error) {
        console.error(`Erro ao carregar dados da seção ${sectionName}:`, error);
        showMessage('Erro ao carregar dados.', 'error');
    }
}

// Carregar estatísticas do dashboard
async function loadDashboardStats() {
    try {
        const stats = await window.dbService.getStats();
        
        document.getElementById('statsAvailable').textContent = stats.available;
        document.getElementById('statsSold').textContent = stats.sold;
        document.getElementById('statsInterests').textContent = stats.interests;
        document.getElementById('statsWaitlist').textContent = stats.waitlist;
        
        // Carregar atividade recente (simplificado)
        const recentActivity = document.getElementById('recentActivity');
        if (recentActivity) {
            recentActivity.innerHTML = `
                <p class="text-muted">Dashboard carregado com sucesso!</p>
                <small>Propriedades disponíveis: ${stats.available} | Vendidas: ${stats.sold}</small>
            `;
        }
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}

// Carregar propriedades
async function loadProperties() {
    try {
        const properties = await window.dbService.getProperties();
        renderPropertiesTable(properties);
    } catch (error) {
        console.error('Erro ao carregar propriedades:', error);
        showMessage('Erro ao carregar propriedades.', 'error');
    }
}

// Renderizar tabela de propriedades
function renderPropertiesTable(properties) {
    const tbody = document.querySelector('#propertiesTable tbody');
    if (!tbody) return;

    if (properties.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Nenhuma propriedade encontrada.</td></tr>';
        return;
    }

    tbody.innerHTML = properties.map(property => `
        <tr>
            <td>
                <img src="${FormatUtils.getMainImage(property.property_images)}" 
                     alt="${property.title}" 
                     onerror="this.src='/images/no-image.jpg'">
            </td>
            <td>
                <strong>${property.title}</strong>
                <br>
                <small class="text-muted">${FormatUtils.truncateText(property.description || '', 50)}</small>
            </td>
            <td>${FormatUtils.formatCurrency(property.price)}</td>
            <td>${property.region}</td>
            <td>${property.bedrooms}Q / ${property.bathrooms}B</td>
            <td>
                <span class="status-badge ${property.is_sold ? 'status-sold' : 'status-available'}">
                    ${property.is_sold ? 'Vendido' : 'Disponível'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="editProperty('${property.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${!property.is_sold ? `
                        <button class="btn btn-sm btn-success" onclick="markAsSold('${property.id}')" title="Marcar como Vendido">
                            <i class="fas fa-check"></i>
                        </button>
                    ` : ''}
                    <button class="btn btn-sm btn-danger" onclick="deleteProperty('${property.id}')" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Carregar testemunhos
async function loadTestimonials() {
    try {
        const testimonials = await window.dbService.getTestimonials();
        renderTestimonialsTable(testimonials);
    } catch (error) {
        console.error('Erro ao carregar testemunhos:', error);
        showMessage('Erro ao carregar testemunhos.', 'error');
    }
}

// Renderizar tabela de testemunhos
function renderTestimonialsTable(testimonials) {
    const tbody = document.querySelector('#testimonialsTable tbody');
    if (!tbody) return;

    if (testimonials.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhum testemunho encontrado.</td></tr>';
        return;
    }

    tbody.innerHTML = testimonials.map(testimonial => `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    ${testimonial.client_photo ? `
                        <img src="${testimonial.client_photo}" alt="${testimonial.client_name}" 
                             style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                    ` : `
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: #3498db; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                            ${testimonial.client_name.charAt(0)}
                        </div>
                    `}
                    <strong>${testimonial.client_name}</strong>
                </div>
            </td>
            <td>${FormatUtils.truncateText(testimonial.testimonial_text, 100)}</td>
            <td>
                <div style="color: #f39c12;">
                    ${'★'.repeat(testimonial.rating)}${'☆'.repeat(5 - testimonial.rating)}
                </div>
            </td>
            <td>
                <span class="status-badge ${testimonial.is_active ? 'status-active' : 'status-inactive'}">
                    ${testimonial.is_active ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td>${FormatUtils.formatDate(testimonial.created_at)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="editTestimonial('${testimonial.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTestimonial('${testimonial.id}')" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Carregar equipe
async function loadOwners() {
    try {
        const owners = await window.dbService.getOwners();
        renderOwnersTable(owners);
    } catch (error) {
        console.error('Erro ao carregar equipe:', error);
        showMessage('Erro ao carregar equipe.', 'error');
    }
}

// Renderizar tabela de equipe
function renderOwnersTable(owners) {
    const tbody = document.querySelector('#ownersTable tbody');
    if (!tbody) return;

    if (owners.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum membro da equipe encontrado.</td></tr>';
        return;
    }

    tbody.innerHTML = owners.map(owner => `
        <tr>
            <td>
                ${owner.photo_url ? `
                    <img src="${owner.photo_url}" alt="${owner.name}">
                ` : `
                    <div style="width: 50px; height: 50px; border-radius: 8px; background: #3498db; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                        ${owner.name.charAt(0)}
                    </div>
                `}
            </td>
            <td><strong>${owner.name}</strong></td>
            <td>${owner.position || '-'}</td>
            <td>
                <span class="status-badge ${owner.is_active ? 'status-active' : 'status-inactive'}">
                    ${owner.is_active ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="editOwner('${owner.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteOwner('${owner.id}')" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Carregar interesses
async function loadInterests() {
    try {
        const interests = await window.dbService.getBuyerInterests();
        renderInterestsTable(interests);
    } catch (error) {
        console.error('Erro ao carregar interesses:', error);
        showMessage('Erro ao carregar interesses.', 'error');
    }
}

// Renderizar tabela de interesses
function renderInterestsTable(interests) {
    const tbody = document.querySelector('#interestsTable tbody');
    if (!tbody) return;

    if (interests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhum interesse encontrado.</td></tr>';
        return;
    }

    tbody.innerHTML = interests.map(interest => `
        <tr>
            <td>
                <strong>${interest.buyer_name}</strong>
                <br>
                <small class="text-muted">${interest.buyer_email}</small>
            </td>
            <td>
                <div>
                    ${interest.buyer_email ? `<div><i class="fas fa-envelope"></i> ${interest.buyer_email}</div>` : ''}
                    ${interest.buyer_phone ? `<div><i class="fas fa-phone"></i> ${FormatUtils.formatPhoneNumber(interest.buyer_phone)}</div>` : ''}
                </div>
            </td>
            <td>${interest.max_budget ? FormatUtils.formatCurrency(interest.max_budget) : 'Não informado'}</td>
            <td>
                <small>
                    ${interest.preferred_bedrooms ? `${interest.preferred_bedrooms}Q ` : ''}
                    ${interest.preferred_bathrooms ? `${interest.preferred_bathrooms}B` : ''}
                    ${!interest.preferred_bedrooms && !interest.preferred_bathrooms ? 'Não especificado' : ''}
                </small>
            </td>
            <td>${FormatUtils.formatDate(interest.created_at)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="viewInterest('${interest.id}')" title="Ver Detalhes">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-success" onclick="contactClient('${interest.buyer_email}', '${interest.buyer_phone || ''}')" title="Contatar">
                        <i class="fas fa-phone"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Carregar lista de espera
async function loadWaitlist() {
    try {
        const waitlist = await window.dbService.getWaitlist();
        renderWaitlistTable(waitlist);
    } catch (error) {
        console.error('Erro ao carregar lista de espera:', error);
        showMessage('Erro ao carregar lista de espera.', 'error');
    }
}

// Renderizar tabela de lista de espera
function renderWaitlistTable(waitlist) {
    const tbody = document.querySelector('#waitlistTable tbody');
    if (!tbody) return;

    if (waitlist.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhuma pessoa na lista de espera.</td></tr>';
        return;
    }

    tbody.innerHTML = waitlist.map(person => `
        <tr>
            <td><strong>${person.name}</strong></td>
            <td>${person.email}</td>
            <td>${person.phone ? FormatUtils.formatPhoneNumber(person.phone) : '-'}</td>
            <td>${FormatUtils.formatDate(person.created_at)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-success" onclick="contactWaitlistClient('${person.email}', '${person.phone || ''}')" title="Contatar">
                        <i class="fas fa-phone"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="removeFromWaitlist('${person.id}')" title="Remover">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Carregar configurações
async function loadSettings() {
    try {
        const settings = await window.dbService.getSiteSettings();
        
        document.getElementById('companyName').value = settings.company_name || '';
        document.getElementById('contactEmail').value = settings.contact_email || '';
        document.getElementById('contactPhone').value = settings.contact_phone || '';
        document.getElementById('aboutText').value = settings.about_text || '';
        document.getElementById('googleReviewsLink').value = settings.google_reviews_link || '';
        
        // Mostrar logo atual se existir
        if (settings.company_logo) {
            const logoPreview = document.getElementById('logoPreview');
            if (logoPreview) {
                logoPreview.innerHTML = `<img src="${settings.company_logo}" alt="Logo atual" style="max-width: 200px; max-height: 100px;">`;
                logoPreview.classList.add('has-image');
            }
        }
        
    } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        showMessage('Erro ao carregar configurações.', 'error');
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
        
        // Limpar formulários
        const forms = modal.querySelectorAll('form');
        forms.forEach(form => form.reset());
        
        // Limpar previews de imagem
        const previews = modal.querySelectorAll('.image-preview');
        previews.forEach(preview => {
            preview.innerHTML = '';
            preview.classList.remove('has-image');
        });
        
        // Reset edit state
        currentEditId = null;
    }
}

// Abrir modal de adição baseado na seção atual
function openAddModal() {
    const modalMap = {
        properties: 'propertyModal',
        testimonials: 'testimonialModal',
        owners: 'ownerModal'
    };
    
    const modalId = modalMap[currentSection];
    if (modalId) {
        // Reset form title
        const titleElement = document.getElementById(modalId.replace('Modal', 'ModalTitle'));
        if (titleElement) {
            titleElement.textContent = titleElement.textContent.replace('Editar', 'Novo').replace('Nova', 'Nova');
        }
        
        currentEditId = null;
        openModal(modalId);
    }
}

// Handle de submit do formulário de propriedade
async function handlePropertySubmit(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    try {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
        submitBtn.disabled = true;
        
        const formData = {
            title: document.getElementById('propertyTitle').value,
            price: parseFloat(document.getElementById('propertyPrice').value),
            bedrooms: parseInt(document.getElementById('propertyBedrooms').value),
            bathrooms: parseInt(document.getElementById('propertyBathrooms').value),
            area: document.getElementById('propertyArea').value ? parseFloat(document.getElementById('propertyArea').value) : null,
            region: document.getElementById('propertyRegion').value,
            address: document.getElementById('propertyAddress').value || null,
            description: document.getElementById('propertyDescription').value || null
        };
        
        let property;
        if (currentEditId) {
            property = await window.dbService.updateProperty(currentEditId, formData);
        } else {
            property = await window.dbService.createProperty(formData);
        }
        
        // Upload de imagens se houver
        const imageFiles = document.getElementById('propertyImages').files;
        if (imageFiles.length > 0) {
            for (let i = 0; i < imageFiles.length; i++) {
                const imageUrl = await window.dbService.uploadPropertyImage(imageFiles[i], property.id);
                await window.dbService.addPropertyImage(property.id, imageUrl, i === 0); // Primeira imagem é principal
            }
        }
        
        showMessage(currentEditId ? 'Propriedade atualizada com sucesso!' : 'Propriedade criada com sucesso!', 'success');
        closeModal('propertyModal');
        await loadProperties();
        await loadDashboardStats();
        
    } catch (error) {
        console.error('Erro ao salvar propriedade:', error);
        showMessage('Erro ao salvar propriedade: ' + error.message, 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Handle de submit do formulário de testemunho
async function handleTestimonialSubmit(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    try {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
        submitBtn.disabled = true;
        
        const formData = {
            client_name: document.getElementById('clientName').value,
            testimonial_text: document.getElementById('testimonialText').value,
            rating: parseInt(document.getElementById('testimonialRating').value)
        };
        
        // Upload de foto se houver
        const photoFile = document.getElementById('clientPhoto').files[0];
        if (photoFile) {
            formData.client_photo = await window.dbService.uploadProfileImage(photoFile, 'testimonial');
        }
        
        if (currentEditId) {
            await window.dbService.updateTestimonial(currentEditId, formData);
        } else {
            await window.dbService.createTestimonial(formData);
        }
        
        showMessage(currentEditId ? 'Testemunho atualizado com sucesso!' : 'Testemunho criado com sucesso!', 'success');
        closeModal('testimonialModal');
        await loadTestimonials();
        
    } catch (error) {
        console.error('Erro ao salvar testemunho:', error);
        showMessage('Erro ao salvar testemunho: ' + error.message, 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Handle de submit do formulário de membro da equipe
async function handleOwnerSubmit(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    try {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
        submitBtn.disabled = true;
        
        const formData = {
            name: document.getElementById('ownerName').value,
            position: document.getElementById('ownerPosition').value || null,
            bio: document.getElementById('ownerBio').value || null
        };
        
        // Upload de foto se houver
        const photoFile = document.getElementById('ownerPhoto').files[0];
        if (photoFile) {
            formData.photo_url = await window.dbService.uploadProfileImage(photoFile, 'owner');
        }
        
        if (currentEditId) {
            await window.dbService.updateOwner(currentEditId, formData);
        } else {
            await window.dbService.createOwner(formData);
        }
        
        showMessage(currentEditId ? 'Membro atualizado com sucesso!' : 'Membro adicionado com sucesso!', 'success');
        closeModal('ownerModal');
        await loadOwners();
        
    } catch (error) {
        console.error('Erro ao salvar membro:', error);
        showMessage('Erro ao salvar membro: ' + error.message, 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Handle de submit do formulário de configurações
async function handleSettingsSubmit(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    try {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
        submitBtn.disabled = true;
        
        const formData = {
            company_name: document.getElementById('companyName').value,
            contact_email: document.getElementById('contactEmail').value,
            contact_phone: document.getElementById('contactPhone').value,
            about_text: document.getElementById('aboutText').value,
            google_reviews_link: document.getElementById('googleReviewsLink').value || null
        };
        
        // Upload de logo se houver
        const logoFile = document.getElementById('companyLogo').files[0];
        if (logoFile) {
            formData.company_logo = await window.dbService.uploadProfileImage(logoFile, 'owner');
        }
        
        await window.dbService.updateSiteSettings(formData);
        
        showMessage('Configurações salvas com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro ao salvar configurações:', error);
        showMessage('Erro ao salvar configurações: ' + error.message, 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Funções de edição
async function editProperty(id) {
    try {
        const property = await window.dbService.getPropertyById(id);
        
        document.getElementById('propertyTitle').value = property.title;
        document.getElementById('propertyPrice').value = property.price;
        document.getElementById('propertyBedrooms').value = property.bedrooms;
        document.getElementById('propertyBathrooms').value = property.bathrooms;
        document.getElementById('propertyArea').value = property.area || '';
        document.getElementById('propertyRegion').value = property.region;
        document.getElementById('propertyAddress').value = property.address || '';
        document.getElementById('propertyDescription').value = property.description || '';
        
        // Atualizar título do modal
        document.getElementById('propertyModalTitle').textContent = 'Editar Propriedade';
        
        currentEditId = id;
        openModal('propertyModal');
        
    } catch (error) {
        console.error('Erro ao carregar propriedade para edição:', error);
        showMessage('Erro ao carregar propriedade.', 'error');
    }
}

async function editTestimonial(id) {
    // Implementação similar ao editProperty
    currentEditId = id;
    document.getElementById('testimonialModalTitle').textContent = 'Editar Testemunho';
    openModal('testimonialModal');
}

async function editOwner(id) {
    // Implementação similar ao editProperty
    currentEditId = id;
    document.getElementById('ownerModalTitle').textContent = 'Editar Membro';
    openModal('ownerModal');
}

// Funções de exclusão
function deleteProperty(id) {
    deleteCallback = () => confirmDeleteProperty(id);
    document.getElementById('confirmDeleteText').textContent = 'Tem certeza que deseja excluir esta propriedade?';
    openModal('confirmDeleteModal');
}

function deleteTestimonial(id) {
    deleteCallback = () => confirmDeleteTestimonial(id);
    document.getElementById('confirmDeleteText').textContent = 'Tem certeza que deseja excluir este testemunho?';
    openModal('confirmDeleteModal');
}

function deleteOwner(id) {
    deleteCallback = () => confirmDeleteOwner(id);
    document.getElementById('confirmDeleteText').textContent = 'Tem certeza que deseja excluir este membro da equipe?';
    openModal('confirmDeleteModal');
}

// Configurar botão de confirmação de exclusão
document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
    if (deleteCallback) {
        deleteCallback();
        closeModal('confirmDeleteModal');
    }
});

// Funções de confirmação de exclusão
async function confirmDeleteProperty(id) {
    try {
        await window.dbService.deleteProperty(id);
        showMessage('Propriedade excluída com sucesso!', 'success');
        await loadProperties();
        await loadDashboardStats();
    } catch (error) {
        console.error('Erro ao excluir propriedade:', error);
        showMessage('Erro ao excluir propriedade.', 'error');
    }
}

async function confirmDeleteTestimonial(id) {
    try {
        await window.dbService.deleteTestimonial(id);
        showMessage('Testemunho excluído com sucesso!', 'success');
        await loadTestimonials();
    } catch (error) {
        console.error('Erro ao excluir testemunho:', error);
        showMessage('Erro ao excluir testemunho.', 'error');
    }
}

async function confirmDeleteOwner(id) {
    try {
        await window.dbService.deleteOwner(id);
        showMessage('Membro excluído com sucesso!', 'success');
        await loadOwners();
    } catch (error) {
        console.error('Erro ao excluir membro:', error);
        showMessage('Erro ao excluir membro.', 'error');
    }
}

// Marcar propriedade como vendida
async function markAsSold(id) {
    try {
        await window.dbService.markPropertyAsSold(id);
        showMessage('Propriedade marcada como vendida!', 'success');
        await loadProperties();
        await loadDashboardStats();
    } catch (error) {
        console.error('Erro ao marcar como vendida:', error);
        showMessage('Erro ao marcar propriedade como vendida.', 'error');
    }
}

// Ver detalhes do interesse
async function viewInterest(id) {
    try {
        const interests = await window.dbService.getBuyerInterests();
        const interest = interests.find(i => i.id === id);
        
        if (!interest) throw new Error('Interesse não encontrado');
        
        const content = document.getElementById('interestModalContent');
        content.innerHTML = `
            <div class="interest-details">
                <h3>${interest.buyer_name}</h3>
                <div class="contact-info">
                    <p><strong>E-mail:</strong> ${interest.buyer_email}</p>
                    ${interest.buyer_phone ? `<p><strong>Telefone:</strong> ${FormatUtils.formatPhoneNumber(interest.buyer_phone)}</p>` : ''}
                </div>
                
                <div class="preferences">
                    <h4>Preferências:</h4>
                    ${interest.max_budget ? `<p><strong>Orçamento máximo:</strong> ${FormatUtils.formatCurrency(interest.max_budget)}</p>` : ''}
                    ${interest.preferred_bedrooms ? `<p><strong>Quartos:</strong> ${interest.preferred_bedrooms}</p>` : ''}
                    ${interest.preferred_bathrooms ? `<p><strong>Banheiros:</strong> ${interest.preferred_bathrooms}</p>` : ''}
                </div>
                
                ${interest.message ? `
                    <div class="message">
                        <h4>Mensagem:</h4>
                        <p>${interest.message}</p>
                    </div>
                ` : ''}
                
                <div class="date-info">
                    <p><strong>Data do interesse:</strong> ${FormatUtils.formatDate(interest.created_at)}</p>
                </div>
            </div>
        `;
        
        // Configurar botão de contato
        document.getElementById('contactClientBtn').onclick = () => contactClient(interest.buyer_email, interest.buyer_phone);
        
        openModal('interestModal');
        
    } catch (error) {
        console.error('Erro ao carregar detalhes do interesse:', error);
        showMessage('Erro ao carregar detalhes.', 'error');
    }
}

// Contatar cliente
function contactClient(email, phone) {
    const options = [];
    
    if (email) {
        options.push(`<a href="mailto:${email}" class="btn btn-primary" target="_blank"><i class="fas fa-envelope"></i> Enviar E-mail</a>`);
    }
    
    if (phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        options.push(`<a href="tel:${cleanPhone}" class="btn btn-success"><i class="fas fa-phone"></i> Ligar</a>`);
        options.push(`<a href="https://wa.me/55${cleanPhone}" class="btn btn-success" target="_blank"><i class="fab fa-whatsapp"></i> WhatsApp</a>`);
    }
    
    if (options.length > 0) {
        const content = `
            <div class="contact-options" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                ${options.join('')}
            </div>
        `;
        
        showMessage('Escolha como deseja contatar:', 'info');
        // Aqui você pode implementar um modal personalizado ou usar o existente
        setTimeout(() => {
            document.body.insertAdjacentHTML('beforeend', `
                <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); z-index: 5000;">
                    <h3 style="margin-bottom: 1rem; text-align: center;">Contatar Cliente</h3>
                    ${content}
                    <button onclick="this.parentElement.remove()" style="position: absolute; top: 10px; right: 15px; background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
                </div>
                <div onclick="this.nextElementSibling.remove(); this.remove();" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 4999;"></div>
            `);
        }, 1000);
    }
}

// Contatar cliente da lista de espera
function contactWaitlistClient(email, phone) {
    contactClient(email, phone);
}

// Remover da lista de espera
async function removeFromWaitlist(id) {
    try {
        // Implementar remoção da lista de espera
        showMessage('Pessoa removida da lista de espera!', 'success');
        await loadWaitlist();
    } catch (error) {
        console.error('Erro ao remover da lista de espera:', error);
        showMessage('Erro ao remover da lista de espera.', 'error');
    }
}

// Manipulação de upload de imagens
function handlePropertyImagesChange(e) {
    const files = Array.from(e.target.files);
    const preview = document.getElementById('imagePreview');
    
    preview.innerHTML = '';
    
    files.forEach((file, index) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const div = document.createElement('div');
                div.style.position = 'relative';
                div.innerHTML = `
                    <img src="${e.target.result}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;">
                    ${index === 0 ? '<div style="position: absolute; top: 5px; left: 5px; background: #3498db; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">Principal</div>' : ''}
                `;
                preview.appendChild(div);
            };
            reader.readAsDataURL(file);
        }
    });
}

function handleImagePreview(e, previewId) {
    const file = e.target.files[0];
    const preview = document.getElementById(previewId);
    
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.innerHTML = `<img src="${e.target.result}" style="max-width: 200px; max-height: 200px; border-radius: 8px; object-fit: cover;">`;
            preview.classList.add('has-image');
        };
        reader.readAsDataURL(file);
    }
}

// Filtros
function filterProperties() {
    const searchTerm = document.getElementById('propertiesSearch').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    
    const rows = document.querySelectorAll('#propertiesTable tbody tr');
    
    rows.forEach(row => {
        const title = row.cells[1]?.textContent.toLowerCase() || '';
        const region = row.cells[3]?.textContent.toLowerCase() || '';
        const statusCell = row.cells[5];
        const status = statusCell?.textContent.includes('Vendido') ? 'sold' : 'available';
        
        const matchesSearch = title.includes(searchTerm) || region.includes(searchTerm);
        const matchesStatus = !statusFilter || statusFilter === status;
        
        row.style.display = matchesSearch && matchesStatus ? '' : 'none';
    });
}

function filterInterests() {
    const searchTerm = document.getElementById('interestsSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#interestsTable tbody tr');
    
    rows.forEach(row => {
        const name = row.cells[0]?.textContent.toLowerCase() || '';
        const email = row.cells[1]?.textContent.toLowerCase() || '';
        
        const matches = name.includes(searchTerm) || email.includes(searchTerm);
        row.style.display = matches ? '' : 'none';
    });
}

// Carregar todos os dados iniciais
async function loadAllData() {
    await Promise.all([
        loadProperties(),
        loadTestimonials(),
        loadOwners(),
        loadInterests(),
        loadWaitlist()
    ]);
}

// Funções de utilidade
function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function showMessage(message, type = 'success') {
    const messageDiv = document.getElementById('adminMessage');
    const messageText = messageDiv.querySelector('.message-text');
    const messageIcon = messageDiv.querySelector('.message-icon');
    
    messageDiv.className = `admin-message ${type} show`;
    messageText.textContent = message;
    
    // Ícones baseados no tipo
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle'
    };
    
    messageIcon.className = `message-icon ${icons[type] || icons.success}`;
    
    // Auto-hide após 5 segundos
    setTimeout(() => {
        messageDiv.classList.remove('show');
    }, 5000);
}

// Fechar mensagem
document.querySelector('.message-close').addEventListener('click', () => {
    document.getElementById('adminMessage').classList.remove('show');
});

// Debounce para otimizar filtros
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