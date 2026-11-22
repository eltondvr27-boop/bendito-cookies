import { Category, Product, BannerConfig, StoreConfig } from '../types';

export const LOGO_PATH = '/public/assets/aistudio/Bendito_Cookie__Cookies_Artesanais_3549756b.png';

export const initialCategories: Category[] = [
  { id: 'tradicionais', name: 'Cookies Tradicionais' },
  { id: 'recheados', name: 'Cookies Recheados' },
  { id: 'combos', name: 'Combos & Caixas' },
  { id: 'bebidas', name: 'Bebidas' },
];

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Cookie Classic Chocochip',
    description: 'Massa amanteigada tradicional com generosos pedaços de chocolate ao leite e meio amargo belga, crocante por fora e macio por dentro.',
    price: 12.00,
    categoryId: 'tradicionais',
    image: LOGO_PATH,
    isAvailable: true,
    badge: 'Mais Vendido',
  },
  {
    id: 'prod-2',
    name: 'Cookie Red Velvet com Nutella',
    description: 'Massa vermelha aveludada com toque de cacau, recheado com pura Nutella cremosa e gotas de chocolate branco.',
    price: 16.00,
    categoryId: 'recheados',
    image: LOGO_PATH,
    isAvailable: true,
    badge: 'Queridinho',
  },
  {
    id: 'prod-3',
    name: 'Cookie Ninho com Nutella',
    description: 'Massa clássica de baunilha com pedaços de chocolate branco, recheado com creme de Leite Ninho e Nutella.',
    price: 17.00,
    categoryId: 'recheados',
    image: LOGO_PATH,
    isAvailable: true,
    badge: 'Imperdível',
  },
  {
    id: 'prod-4',
    name: 'Cookie Triple Chocolate',
    description: 'Para os verdadeiros chocólatras: massa escura de cacau 100%, recheado com ganache de chocolate meio amargo.',
    price: 15.00,
    categoryId: 'tradicionais',
    image: LOGO_PATH,
    isAvailable: true,
  },
  {
    id: 'prod-5',
    name: 'Caixa Degustação com 4 Cookies',
    description: 'Escolha até 4 dos nossos melhores cookies artesanais em uma caixa linda para presentear ou saborear.',
    price: 55.00,
    categoryId: 'combos',
    image: LOGO_PATH,
    isAvailable: true,
    badge: 'Econômico',
  },
  {
    id: 'prod-6',
    name: 'Caixa Presenteável com 6 Cookies',
    description: 'Caixa especial com 6 cookies artesanais frescos, embalados com carinho e fita de cetim.',
    price: 78.00,
    categoryId: 'combos',
    image: LOGO_PATH,
    isAvailable: true,
    badge: 'Presente',
  },
  {
    id: 'prod-7',
    name: 'Café Gelado Cremoso Bendito',
    description: 'Café especial batido com leite condensado cremoso, gelo e toque de baunilha.',
    price: 12.00,
    categoryId: 'bebidas',
    image: LOGO_PATH,
    isAvailable: true,
  },
  {
    id: 'prod-8',
    name: 'Soda Italiana de Frutas Vermelhas',
    description: 'Água com gás refrescante, xarope artesanal de frutas vermelhas e rodelas de limão siciliano.',
    price: 14.00,
    categoryId: 'bebidas',
    image: LOGO_PATH,
    isAvailable: true,
  },
];

export const initialBanner: BannerConfig = {
  enabled: true,
  type: 'image',
  mediaUrl: LOGO_PATH,
  title: 'Cookies Artesanais Fresquinhos & Recheados!',
  subtitle: 'Feitos todos os dias com ingredientes nobres e muito amor. Peça agora e receba em casa quentinho!',
  link: '#cardapio',
  buttonText: 'Ver Cardápio',
};

export const initialStoreConfig: StoreConfig = {
  name: 'Bendito Cookies',
  subtitle: 'Cookies Artesanais',
  whatsappNumber: '5586995153061',
  whatsappDisplay: '(86) 99515-3061',
  instagramHandle: '@bendito.cookies_',
  deliveryFee: 8.00,
  operatingHours: 'Terça a Domingo das 14h às 21h',
  infiniteTag: 'benditookies',
  adminUsername: 'admin',
  adminPin: '123456',
};
