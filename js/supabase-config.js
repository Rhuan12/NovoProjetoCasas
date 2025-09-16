// Configuração do Supabase
const SUPABASE_URL = 'https://lfncgglariejxuvorrgt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmbmNnZ2xhcmllanh1dm9ycmd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMjc3MDQsImV4cCI6MjA3MzYwMzcwNH0.yovsTUz2ofvk-STL3H7S6iTv5jh7i_HpAhXhDanHqtA';

// Inicialização do cliente Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Classe de configuração
class SupabaseConfig {
    static client = supabase;
    
    static async testConnection() {
        try {
            const { data, error } = await this.client
                .from('properties')
                .select('count')
                .limit(1);
            
            if (error) throw error;
            console.log('✅ Conexão com Supabase estabelecida com sucesso!');
            return true;
        } catch (error) {
            console.error('❌ Erro na conexão com Supabase:', error);
            return false;
        }
    }
    
    static handleError(error) {
        console.error('Supabase Error:', error);
        
        // Logging para diferentes tipos de erro
        if (error.code === 'PGRST301') {
            console.log('Erro de permissão - verificar RLS');
        } else if (error.code === '23505') {
            console.log('Violação de chave única');
        }
        
        return {
            success: false,
            message: error.message || 'Erro desconhecido',
            code: error.code
        };
    }
}

// Export da configuração
window.SupabaseConfig = SupabaseConfig;