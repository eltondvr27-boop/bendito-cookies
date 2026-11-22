export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
  isAvailable: boolean;
  badge?: string;
}

export interface BannerConfig {
  enabled: boolean;
  type: 'image' | 'video';
  mediaUrl: string;
  title: string;
  subtitle: string;
  link?: string;
  buttonText?: string;
}

export interface StoreConfig {
  name: string;
  subtitle: string;
  whatsappNumber: string; // e.g. "5586995153061"
  whatsappDisplay: string; // e.g. "(86) 99515-3061"
  instagramHandle: string; // e.g. "@bendito.cookies_"
  deliveryFee: number;
  operatingHours: string;
  infiniteTag: string; // e.g. "benditookies"
  adminUsername: string;
  adminPin: string; // exactly 6 digits
}

export interface CartItem {
  product: Product;
  quantity: number;
  observation?: string;
}

export interface Order {
  id: string;
  orderNsu: string;
  transactionNsu?: string;
  customerName: string;
  customerPhone: string;
  deliveryType: 'delivery' | 'pickup';
  address?: string;
  neighborhood?: string;
  notes?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'online_infinitepay' | 'whatsapp';
  status: 'Pendente' | 'Pago' | 'Em preparo' | 'Saiu para entrega' | 'Concluído';
  createdAt: string;
  receiptUrl?: string;
}
