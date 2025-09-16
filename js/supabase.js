// Inicializar cliente Supabase
const supabase = window.supabase.createClient(
    window.CONFIG.SUPABASE.url,
    window.CONFIG.SUPABASE.key
);

// Classe para gerenciar operações do banco de dados
class DatabaseService {
    constructor() {
        this.supabase = supabase;
    }

    // Método para tratar erros
    handleError(error, context = '') {
        console.error(`Erro ${context}:`, error);
        throw new Error(error.message || window.CONFIG.MESSAGES.error.generic);
    }

    // PROPRIEDADES
    async getProperties(filters = {}) {
        try {
            let query = this.supabase
                .from('properties')
                .select(`
                    *,
                    property_images (
                        id,
                        image_url,
                        is_main
                    )
                `)
                .order('created_at', { ascending: false });

            // Aplicar filtros
            if (filters.bedrooms) {
                if (filters.bedrooms >= 4) {
                    query = query.gte('bedrooms', 4);
                } else {
                    query = query.eq('bedrooms', filters.bedrooms);
                }
            }

            if (filters.bathrooms) {
                if (filters.bathrooms >= 4) {
                    query = query.gte('bathrooms', 4);
                } else {
                    query = query.eq('bathrooms', filters.bathrooms);
                }
            }

            if (filters.maxPrice) {
                query = query.lte('price', filters.maxPrice);
            }

            if (filters.region) {
                query = query.ilike('region', `%${filters.region}%`);
            }

            if (filters.isSold !== undefined) {
                query = query.eq('is_sold', filters.isSold);
            }

            const { data, error } = await query;

            if (error) this.handleError(error, 'ao buscar propriedades');

            return data || [];
        } catch (error) {
            this.handleError(error, 'ao buscar propriedades');
        }
    }

    async getPropertyById(id) {
        try {
            const { data, error } = await this.supabase
                .from('properties')
                .select(`
                    *,
                    property_images (
                        id,
                        image_url,
                        is_main
                    )
                `)
                .eq('id', id)
                .single();

            if (error) this.handleError(error, 'ao buscar propriedade');

            return data;
        } catch (error) {
            this.handleError(error, 'ao buscar propriedade');
        }
    }

    async createProperty(propertyData) {
        try {
            const { data, error } = await this.supabase
                .from('properties')
                .insert([propertyData])
                .select()
                .single();

            if (error) this.handleError(error, 'ao criar propriedade');

            return data;
        } catch (error) {
            this.handleError(error, 'ao criar propriedade');
        }
    }

    async updateProperty(id, propertyData) {
        try {
            const { data, error } = await this.supabase
                .from('properties')
                .update(propertyData)
                .eq('id', id)
                .select()
                .single();

            if (error) this.handleError(error, 'ao atualizar propriedade');

            return data;
        } catch (error) {
            this.handleError(error, 'ao atualizar propriedade');
        }
    }

    async deleteProperty(id) {
        try {
            const { error } = await this.supabase
                .from('properties')
                .delete()
                .eq('id', id);

            if (error) this.handleError(error, 'ao deletar propriedade');

            return true;
        } catch (error) {
            this.handleError(error, 'ao deletar propriedade');
        }
    }

    // IMAGENS DE PROPRIEDADES
    async addPropertyImage(propertyId, imageUrl, isMain = false) {
        try {
            const { data, error } = await this.supabase
                .from('property_images')
                .insert([{
                    property_id: propertyId,
                    image_url: imageUrl,
                    is_main: isMain
                }])
                .select()
                .single();

            if (error) this.handleError(error, 'ao adicionar imagem');

            return data;
        } catch (error) {
            this.handleError(error, 'ao adicionar imagem');
        }
    }

    async uploadPropertyImage(file, propertyId) {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${propertyId}/${Date.now()}.${fileExt}`;
            
            const { data, error } = await this.supabase.storage
                .from('property-images')
                .upload(fileName, file, {
                    quality: window.CONFIG.SITE.imageQuality
                });

            if (error) this.handleError(error, 'ao fazer upload da imagem');

            // Obter URL pública da imagem
            const { data: { publicUrl } } = this.supabase.storage
                .from('property-images')
                .getPublicUrl(fileName);

            return publicUrl;
        } catch (error) {
            this.handleError(error, 'ao fazer upload da imagem');
        }
    }

    // TESTEMUNHOS
    async getTestimonials() {
        try {
            const { data, error } = await this.supabase
                .from('testimonials')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (error) this.handleError(error, 'ao buscar testemunhos');

            return data || [];
        } catch (error) {
            this.handleError(error, 'ao buscar testemunhos');
        }
    }

    async createTestimonial(testimonialData) {
        try {
            const { data, error } = await this.supabase
                .from('testimonials')
                .insert([testimonialData])
                .select()
                .single();

            if (error) this.handleError(error, 'ao criar testemunho');

            return data;
        } catch (error) {
            this.handleError(error, 'ao criar testemunho');
        }
    }

    // PROPRIETÁRIOS/CORRETORES
    async getOwners() {
        try {
            const { data, error } = await this.supabase
                .from('owners')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: true });

            if (error) this.handleError(error, 'ao buscar proprietários');

            return data || [];
        } catch (error) {
            this.handleError(error, 'ao buscar proprietários');
        }
    }

    async createOwner(ownerData) {
        try {
            const { data, error } = await this.supabase
                .from('owners')
                .insert([ownerData])
                .select()
                .single();

            if (error) this.handleError(error, 'ao criar proprietário');

            return data;
        } catch (error) {
            this.handleError(error, 'ao criar proprietário');
        }
    }

    // INTERESSE DE COMPRADORES
    async createBuyerInterest(interestData) {
        try {
            const { data, error } = await this.supabase
                .from('buyers_interest')
                .insert([interestData])
                .select()
                .single();

            if (error) this.handleError(error, 'ao registrar interesse');

            return data;
        } catch (error) {
            this.handleError(error, 'ao registrar interesse');
        }
    }

    async getBuyerInterests(propertyId = null) {
        try {
            let query = this.supabase
                .from('buyers_interest')
                .select('*')
                .order('created_at', { ascending: false });

            if (propertyId) {
                query = query.eq('property_id', propertyId);
            }

            const { data, error } = await query;

            if (error) this.handleError(error, 'ao buscar interesses');

            return data || [];
        } catch (error) {
            this.handleError(error, 'ao buscar interesses');
        }
    }

    // LISTA DE ESPERA
    async addToWaitlist(waitlistData) {
        try {
            const { data, error } = await this.supabase
                .from('waitlist')
                .insert([waitlistData])
                .select()
                .single();

            if (error) {
                if (error.code === '23505') { // Unique constraint violation
                    throw new Error(window.CONFIG.MESSAGES.error.emailExists);
                }
                this.handleError(error, 'ao adicionar à lista de espera');
            }

            return data;
        } catch (error) {
            if (error.message === window.CONFIG.MESSAGES.error.emailExists) {
                throw error;
            }
            this.handleError(error, 'ao adicionar à lista de espera');
        }
    }

    async getWaitlist() {
        try {
            const { data, error } = await this.supabase
                .from('waitlist')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) this.handleError(error, 'ao buscar lista de espera');

            return data || [];
        } catch (error) {
            this.handleError(error, 'ao buscar lista de espera');
        }
    }

    // CONFIGURAÇÕES DO SITE
    async getSiteSettings() {
        try {
            const { data, error } = await this.supabase
                .from('site_settings')
                .select('*')
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 = No rows returned
                this.handleError(error, 'ao buscar configurações do site');
            }

            return data || {
                company_name: 'Imóveis Premium',
                contact_email: 'contato@exemplo.com',
                contact_phone: '(11) 99999-9999',
                about_text: 'Especialistas em imóveis de alto padrão'
            };
        } catch (error) {
            // Retornar configurações padrão em caso de erro
            console.warn('Usando configurações padrão:', error.message);
            return {
                company_name: 'Imóveis Premium',
                contact_email: 'contato@exemplo.com',
                contact_phone: '(11) 99999-9999',
                about_text: 'Especialistas em imóveis de alto padrão'
            };
        }
    }

    async updateSiteSettings(settingsData) {
        try {
            // Primeiro, tenta atualizar as configurações existentes
            const { data: existing } = await this.supabase
                .from('site_settings')
                .select('id')
                .limit(1)
                .single();

            let result;
            if (existing) {
                // Atualizar registro existente
                const { data, error } = await this.supabase
                    .from('site_settings')
                    .update({ ...settingsData, updated_at: new Date().toISOString() })
                    .eq('id', existing.id)
                    .select()
                    .single();

                if (error) this.handleError(error, 'ao atualizar configurações');
                result = data;
            } else {
                // Criar novo registro
                const { data, error } = await this.supabase
                    .from('site_settings')
                    .insert([settingsData])
                    .select()
                    .single();

                if (error) this.handleError(error, 'ao criar configurações');
                result = data;
            }

            return result;
        } catch (error) {
            this.handleError(error, 'ao salvar configurações do site');
        }
    }

    // REGIÕES DISPONÍVEIS
    async getAvailableRegions() {
        try {
            const { data, error } = await this.supabase
                .from('properties')
                .select('region')
                .not('region', 'is', null)
                .not('region', 'eq', '');

            if (error) this.handleError(error, 'ao buscar regiões');

            // Extrair regiões únicas
            const regions = [...new Set(data.map(item => item.region))].sort();
            return regions;
        } catch (error) {
            this.handleError(error, 'ao buscar regiões');
        }
    }

    // ESTATÍSTICAS
    async getStats() {
        try {
            const [propertiesAvailable, propertiesSold, totalInterests, waitlistCount] = await Promise.all([
                this.supabase.from('properties').select('id', { count: 'exact' }).eq('is_sold', false),
                this.supabase.from('properties').select('id', { count: 'exact' }).eq('is_sold', true),
                this.supabase.from('buyers_interest').select('id', { count: 'exact' }),
                this.supabase.from('waitlist').select('id', { count: 'exact' })
            ]);

            return {
                available: propertiesAvailable.count || 0,
                sold: propertiesSold.count || 0,
                interests: totalInterests.count || 0,
                waitlist: waitlistCount.count || 0
            };
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
            return {
                available: 0,
                sold: 0,
                interests: 0,
                waitlist: 0
            };
        }
    }

    // MARCAR PROPRIEDADE COMO VENDIDA
    async markPropertyAsSold(propertyId, soldDate = new Date()) {
        try {
            // Calcular dias para venda
            const property = await this.getPropertyById(propertyId);
            const createdAt = new Date(property.created_at);
            const daysToSell = Math.ceil((soldDate - createdAt) / (1000 * 60 * 60 * 24));

            const { data, error } = await this.supabase
                .from('properties')
                .update({
                    is_sold: true,
                    sold_date: soldDate.toISOString(),
                    days_to_sell: daysToSell,
                    updated_at: new Date().toISOString()
                })
                .eq('id', propertyId)
                .select()
                .single();

            if (error) this.handleError(error, 'ao marcar propriedade como vendida');

            return data;
        } catch (error) {
            this.handleError(error, 'ao marcar propriedade como vendida');
        }
    }

    // BUSCA AVANÇADA
    async searchProperties(searchTerm) {
        try {
            const { data, error } = await this.supabase
                .from('properties')
                .select(`
                    *,
                    property_images (
                        id,
                        image_url,
                        is_main
                    )
                `)
                .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,region.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%`)
                .order('created_at', { ascending: false });

            if (error) this.handleError(error, 'ao buscar propriedades');

            return data || [];
        } catch (error) {
            this.handleError(error, 'ao buscar propriedades');
        }
    }

    // UPLOAD DE FOTO DE PERFIL
    async uploadProfileImage(file, type = 'owner') {
        try {
            // Validar arquivo
            if (!window.CONFIG.VALIDATION.allowedImageTypes.includes(file.type)) {
                throw new Error(window.CONFIG.MESSAGES.error.invalidFile);
            }

            if (file.size > window.CONFIG.VALIDATION.maxImageSize) {
                throw new Error('Arquivo muito grande. Máximo 5MB.');
            }

            const fileExt = file.name.split('.').pop();
            const fileName = `${type}/${Date.now()}.${fileExt}`;
            const bucketName = type === 'owner' ? 'owner-photos' : 'testimonial-photos';
            
            const { data, error } = await this.supabase.storage
                .from(bucketName)
                .upload(fileName, file, {
                    quality: window.CONFIG.SITE.imageQuality
                });

            if (error) this.handleError(error, 'ao fazer upload da foto');

            // Obter URL pública da imagem
            const { data: { publicUrl } } = this.supabase.storage
                .from(bucketName)
                .getPublicUrl(fileName);

            return publicUrl;
        } catch (error) {
            this.handleError(error, 'ao fazer upload da foto');
        }
    }

    // DELETAR IMAGEM
    async deleteImage(imageUrl, bucketName) {
        try {
            // Extrair nome do arquivo da URL
            const urlParts = imageUrl.split('/');
            const fileName = urlParts.slice(-2).join('/'); // pasta/arquivo.ext

            const { error } = await this.supabase.storage
                .from(bucketName)
                .remove([fileName]);

            if (error) this.handleError(error, 'ao deletar imagem');

            return true;
        } catch (error) {
            console.warn('Erro ao deletar imagem:', error);
            return false;
        }
    }

    // BATCH OPERATIONS
    async batchUpdateProperties(updates) {
        try {
            const promises = updates.map(update => 
                this.updateProperty(update.id, update.data)
            );

            const results = await Promise.allSettled(promises);
            
            const successful = results.filter(result => result.status === 'fulfilled');
            const failed = results.filter(result => result.status === 'rejected');

            return {
                successful: successful.length,
                failed: failed.length,
                errors: failed.map(f => f.reason)
            };
        } catch (error) {
            this.handleError(error, 'ao atualizar propriedades em lote');
        }
    }

    // ANALYTICS SIMPLES
    async getPropertyAnalytics(propertyId) {
        try {
            const { data, error } = await this.supabase
                .from('buyers_interest')
                .select('*')
                .eq('property_id', propertyId);

            if (error) this.handleError(error, 'ao buscar analytics');

            const interests = data || [];
            
            return {
                totalInterests: interests.length,
                averageBudget: interests.length > 0 
                    ? interests.reduce((sum, i) => sum + (i.max_budget || 0), 0) / interests.length 
                    : 0,
                topRegions: this.getTopRegions(interests),
                contactMethods: this.getContactMethods(interests)
            };
        } catch (error) {
            this.handleError(error, 'ao buscar analytics');
        }
    }

    // MÉTODOS AUXILIARES
    getTopRegions(interests) {
        const regions = interests
            .flatMap(i => i.preferred_regions || [])
            .filter(Boolean);
        
        const counts = {};
        regions.forEach(region => {
            counts[region] = (counts[region] || 0) + 1;
        });

        return Object.entries(counts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([region, count]) => ({ region, count }));
    }

    getContactMethods(interests) {
        const withPhone = interests.filter(i => i.buyer_phone).length;
        const withEmail = interests.filter(i => i.buyer_email).length;
        
        return {
            phone: withPhone,
            email: withEmail,
            total: interests.length
        };
    }
}

// Instância global do serviço de banco de dados
window.dbService = new DatabaseService();

// Utilitários de formatação
class FormatUtils {
    static formatCurrency(value) {
        return new Intl.NumberFormat(
            window.CONFIG.FORMAT.currency.locale,
            {
                style: window.CONFIG.FORMAT.currency.style,
                currency: window.CONFIG.FORMAT.currency.currency
            }
        ).format(value);
    }

    static formatDate(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat(
            window.CONFIG.FORMAT.date.locale,
            window.CONFIG.FORMAT.date.options
        ).format(date);
    }

    static formatPhoneNumber(phone) {
        // Remove tudo que não é número
        const cleaned = phone.replace(/\D/g, '');
        
        // Formato brasileiro (11) 99999-9999
        if (cleaned.length === 11) {
            return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
        // Formato brasileiro (11) 9999-9999
        else if (cleaned.length === 10) {
            return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        
        return phone;
    }

    static truncateText(text, maxLength = 150) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }

    static slugify(text) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove acentos
            .replace(/[^a-z0-9 -]/g, '') // Remove caracteres especiais
            .replace(/\s+/g, '-') // Substitui espaços por hífens
            .replace(/-+/g, '-') // Remove hífens duplicados
            .trim();
    }

    static getMainImage(images) {
        if (!images || images.length === 0) return '/images/no-image.jpg';
        
        const mainImage = images.find(img => img.is_main);
        return mainImage ? mainImage.image_url : images[0].image_url;
    }

    static calculateDaysOnMarket(createdAt) {
        const created = new Date(createdAt);
        const now = new Date();
        return Math.ceil((now - created) / (1000 * 60 * 60 * 24));
    }
}

// Tornar utilitários globais
window.FormatUtils = FormatUtils;