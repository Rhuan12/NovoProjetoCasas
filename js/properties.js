class PropertyService {
    static async getAllProperties() {
        try {
            const { data, error } = await SupabaseConfig.client
                .from('properties')
                .select('*')
                .order('created_at', { ascending: false });
                
            if (error) throw error;
            return data;
        } catch (error) {
            return SupabaseConfig.handleError(error);
        }
    }
    
    static async getAvailableProperties() {
        try {
            const { data, error } = await SupabaseConfig.client
                .from('properties')
                .select('*')
                .eq('sold', false)
                .order('created_at', { ascending: false });
                
            if (error) throw error;
            return data;
        } catch (error) {
            return SupabaseConfig.handleError(error);
        }
    }
    
    static async getSoldProperties() {
        try {
            const { data, error } = await SupabaseConfig.client
                .from('properties')
                .select('*')
                .eq('sold', true)
                .order('sold_date', { ascending: false })
                .limit(8);
                
            if (error) throw error;
            return data;
        } catch (error) {
            return SupabaseConfig.handleError(error);
        }
    }
    
    static async filterProperties(filters) {
        try {
            let query = SupabaseConfig.client
                .from('properties')
                .select('*')
                .eq('sold', false);
            
            if (filters.quartos) {
                query = query.gte('quartos', parseInt(filters.quartos));
            }
            
            if (filters.banheiros) {
                query = query.gte('banheiros', parseInt(filters.banheiros));
            }
            
            if (filters.regiao) {
                query = query.eq('regiao', filters.regiao);
            }
            
            if (filters.preco) {
                const [min, max] = filters.preco.split('-');
                if (max) {
                    query = query.gte('price', parseInt(min)).lte('price', parseInt(max));
                } else {
                    query = query.gte('price', parseInt(min.replace('+', '')));
                }
            }
            
            const { data, error } = await query.order('created_at', { ascending: false });
            
            if (error) throw error;
            return data;
        } catch (error) {
            return SupabaseConfig.handleError(error);
        }
    }
    
    static async addInterestedBuyer(buyerData) {
        try {
            const { data, error } = await SupabaseConfig.client
                .from('interested_buyers')
                .insert([buyerData])
                .select();
                
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return SupabaseConfig.handleError(error);
        }
    }
    
    static async addToWaitlist(waitlistData) {
        try {
            const { data, error } = await SupabaseConfig.client
                .from('waitlist')
                .insert([waitlistData])
                .select();
                
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return SupabaseConfig.handleError(error);
        }
    }
    
    static async getApprovedTestimonials() {
        try {
            const { data, error } = await SupabaseConfig.client
                .from('testimonials')
                .select('*')
                .eq('approved', true)
                .order('created_at', { ascending: false })
                .limit(6);
                
            if (error) throw error;
            return data;
        } catch (error) {
            return SupabaseConfig.handleError(error);
        }
    }
    
    static async getActiveTeamMembers() {
        try {
            const { data, error } = await SupabaseConfig.client
                .from('team_members')
                .select('*')
                .eq('active', true)
                .order('id', { ascending: true });
                
            if (error) throw error;
            return data;
        } catch (error) {
            return SupabaseConfig.handleError(error);
        }
    }
}

// Export do serviço
window.PropertyService = PropertyService;