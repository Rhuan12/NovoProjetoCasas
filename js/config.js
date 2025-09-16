// Configurações do Supabase
const SUPABASE_CONFIG = {
    url: 'https://zpopizcivpxhzybcibqq.supabase.co', // Substitua pela URL do seu projeto
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwb3BpemNpdnB4aHp5YmNpYnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMzEwODcsImV4cCI6MjA3MzYwNzA4N30.RBTxzFPlLJLx2W1dfF-nXrXpOlBCMDhB029aLHDFrCg' // Substitua pela sua chave anônima
};

// Configurações gerais do site
const SITE_CONFIG = {
    itemsPerPage: 9,
    imageQuality: 0.8,
    animationDuration: 300,
    toastDuration: 3000
};

// Configurações de formatação
const FORMAT_CONFIG = {
    currency: {
        locale: 'pt-BR',
        currency: 'BRL',
        style: 'currency'
    },
    date: {
        locale: 'pt-BR',
        options: {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }
    }
};

// Mensagens do sistema
const MESSAGES = {
    success: {
        waitlistJoined: 'Você foi adicionado à lista de espera! Te avisaremos sobre novos imóveis.',
        interestSent: 'Seu interesse foi enviado com sucesso! Entraremos em contato em breve.',
        formSubmitted: 'Formulário enviado com sucesso!'
    },
    error: {
        generic: 'Ocorreu um erro. Tente novamente.',
        network: 'Erro de conexão. Verifique sua internet.',
        validation: 'Por favor, preencha todos os campos obrigatórios.',
        emailExists: 'Este e-mail já está cadastrado em nossa lista.',
        loadingProperties: 'Erro ao carregar imóveis. Tente novamente.',
        loadingTestimonials: 'Erro ao carregar testemunhos.',
        loadingOwners: 'Erro ao carregar informações da equipe.',
        imageUpload: 'Erro ao fazer upload da imagem.',
        invalidFile: 'Formato de arquivo inválido. Use apenas JPG, PNG ou WebP.'
    },
    loading: {
        properties: 'Carregando imóveis...',
        testimonials: 'Carregando testemunhos...',
        owners: 'Carregando equipe...',
        submitting: 'Enviando...',
        uploading: 'Fazendo upload...'
    }
};

// Configurações de validação
const VALIDATION = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\d\s\(\)\-\+]+$/,
    minNameLength: 2,
    maxMessageLength: 1000,
    allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    maxImageSize: 5 * 1024 * 1024 // 5MB
};

// Configurações de filtros
const FILTER_CONFIG = {
    priceRanges: [
        { min: 0, max: 300000, label: 'Até R$ 300.000' },
        { min: 300000, max: 500000, label: 'R$ 300.000 - R$ 500.000' },
        { min: 500000, max: 800000, label: 'R$ 500.000 - R$ 800.000' },
        { min: 800000, max: 1200000, label: 'R$ 800.000 - R$ 1.200.000' },
        { min: 1200000, max: 2000000, label: 'R$ 1.200.000 - R$ 2.000.000' },
        { min: 2000000, max: Infinity, label: 'Acima de R$ 2.000.000' }
    ],
    bedroomOptions: [
        { value: 1, label: '1 quarto' },
        { value: 2, label: '2 quartos' },
        { value: 3, label: '3 quartos' },
        { value: 4, label: '4+ quartos' }
    ],
    bathroomOptions: [
        { value: 1, label: '1 banheiro' },
        { value: 2, label: '2 banheiros' },
        { value: 3, label: '3 banheiros' },
        { value: 4, label: '4+ banheiros' }
    ]
};

// Configurações de animação
const ANIMATION_CONFIG = {
    fadeIn: 'fade-in',
    slideUp: 'slide-up',
    observerOptions: {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    }
};

// Exportar configurações para uso global
window.CONFIG = {
    SUPABASE: SUPABASE_CONFIG,
    SITE: SITE_CONFIG,
    FORMAT: FORMAT_CONFIG,
    MESSAGES,
    VALIDATION,
    FILTER: FILTER_CONFIG,
    ANIMATION: ANIMATION_CONFIG
};