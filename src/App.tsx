/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, Category, BannerConfig, StoreConfig, CartItem, Order } from './types';
import { initialBanner, initialStoreConfig } from './data/initialData';
import { supabase } from './lib/supabase';
import { Navbar } from './components/Navbar';
import { PromotionalBanner } from './components/PromotionalBanner';
import { CategoryTabs } from './components/CategoryTabs';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderReturnModal } from './components/OrderReturnModal';
import { AdminModal } from './components/AdminModal';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { Footer } from './components/Footer';
import { Search, Cookie, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banner, setBanner] = useState<BannerConfig>(initialBanner);
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(initialStoreConfig);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('bendito_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // UI States - default to 'all' (Todos os Cookies)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Return from InfinitePay parameters check
  const [returnParams, setReturnParams] = useState<{ orderNsu: string; transactionNsu: string; receiptUrl: string } | null>(null);

  // Fetch data from Supabase strictly without fake data fallback
  useEffect(() => {
    async function loadDataFromSupabase() {
      try {
        // 1. Fetch config_loja (id = 1)
        const { data: configData, error: configError } = await supabase
          .from('config_loja')
          .select('*')
          .eq('id', 1)
          .single();

        if (configError && configError.code !== 'PGRST116') {
          alert('Erro Supabase: ' + configError.message);
        }

        if (configData) {
          setStoreConfig((prev) => ({
            ...prev,
            name: configData.nome_loja || prev.name,
            deliveryFee: configData.taxa_entrega ?? prev.deliveryFee,
            infiniteTag: configData.infinite_tag || prev.infiniteTag,
          }));

          setBanner((prev) => ({
            ...prev,
            enabled: configData.banner_ativo ?? prev.enabled,
            mediaUrl: configData.banner_url || prev.mediaUrl,
            type: configData.banner_tipo || prev.type,
            title: configData.banner_titulo || prev.title,
          }));
        }

        // 2. Fetch categorias or create Cookies Tradicionais if empty
        let { data: catData, error: catError } = await supabase
          .from('categorias')
          .select('*')
          .order('ordem', { ascending: true });

        if (catError) {
          alert('Erro Supabase: ' + catError.message);
        } else {
          if (!catData || catData.length === 0) {
            const { error: insertErr } = await supabase.from('categorias').upsert({
              id: 'tradicionais',
              nome: 'Cookies Tradicionais',
              ordem: 1,
            });
            if (insertErr) {
              alert('Erro Supabase: ' + insertErr.message);
            } else {
              setCategories([{ id: 'tradicionais', name: 'Cookies Tradicionais' }]);
            }
          } else {
            const hasTradicional = catData.some((c: any) => c.id === 'tradicionais' || c.nome.toLowerCase().includes('tradicional'));
            if (!hasTradicional) {
              await supabase.from('categorias').upsert({
                id: 'tradicionais',
                nome: 'Cookies Tradicionais',
                ordem: catData.length + 1,
              });
              catData.push({ id: 'tradicionais', nome: 'Cookies Tradicionais', ordem: catData.length + 1 });
            }
            setCategories(catData.map((c: any) => ({ id: c.id.toString(), name: c.nome })));
          }
        }

        // 3. Fetch produtos
        const { data: prodData, error: prodError } = await supabase
          .from('produtos')
          .select('*');

        if (prodError) {
          alert('Erro Supabase: ' + prodError.message);
        } else if (prodData) {
          setProducts(
            prodData.map((p: any) => ({
              id: p.id.toString(),
              name: p.nome,
              description: p.descricao,
              price: Number(p.preco) || 0,
              categoryId: p.categoria_id ? p.categoria_id.toString() : '',
              image: p.imagem_url || '',
              isAvailable: p.disponivel ?? true,
              badge: p.badge || '',
            }))
          );
        }

        // 4. Fetch pedidos
        const { data: orderData, error: orderError } = await supabase
          .from('pedidos')
          .select('*')
          .order('id', { ascending: false });

        if (orderError) {
          alert('Erro Supabase: ' + orderError.message);
        } else if (orderData) {
          setOrders(
            orderData.map((o: any) => ({
              id: o.id.toString(),
              orderNsu: o.order_nsu,
              customerName: o.cliente_nome,
              customerPhone: o.cliente_telefone,
              deliveryType: 'delivery',
              address: o.endereco,
              items: o.itens || [],
              subtotal: Number(o.total) || 0,
              deliveryFee: 0,
              total: Number(o.total) || 0,
              paymentMethod: 'online_infinitepay',
              status: o.status || 'Pendente',
              createdAt: new Date().toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            }))
          );
        }
      } catch (err: any) {
        alert('Erro Supabase: ' + (err.message || err));
      }
    }

    loadDataFromSupabase();

    const params = new URLSearchParams(window.location.search);
    const orderNsu = params.get('order_nsu');
    const transactionNsu = params.get('transaction_nsu') || 'TX-' + Math.floor(100000 + Math.random() * 900000);
    const receiptUrl = params.get('receipt_url') || '';

    if (orderNsu) {
      setReturnParams({ orderNsu, transactionNsu, receiptUrl });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bendito_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAddToCart = (product: Product, quantity = 1, observation = '') => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.observation === observation
      );
      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      }
      return [...prevCart, { product, quantity, observation }];
    });
    showToast(`Cookie adicionado ao carrinho! 🍪`);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Filter products by category and search query
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategoryId === 'all' || p.categoryId === selectedCategoryId;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryTitle = () => {
    if (selectedCategoryId === 'all') return 'Todos os Cookies';
    return categories.find((c) => c.id === selectedCategoryId)?.name || 'Nosso Cardápio';
  };

  // Supabase Sync Handlers with strict error alerting
  const handleUpdateStoreConfig = async (newConfig: StoreConfig) => {
    try {
      const { error } = await supabase
        .from('config_loja')
        .update({
          nome_loja: newConfig.name,
          taxa_entrega: newConfig.deliveryFee,
          infinite_tag: newConfig.infiniteTag,
        })
        .eq('id', 1);

      if (error) {
        alert('Erro Supabase: ' + error.message);
      } else {
        setStoreConfig(newConfig);
        alert('Configurações salvas no Supabase com sucesso!');
      }
    } catch (err: any) {
      alert('Erro Supabase: ' + (err.message || err));
    }
  };

  const handleUpdateBanner = async (newBanner: BannerConfig) => {
    try {
      const { error } = await supabase
        .from('config_loja')
        .update({
          banner_ativo: newBanner.enabled,
          banner_url: newBanner.mediaUrl,
          banner_tipo: newBanner.type,
          banner_titulo: newBanner.title,
        })
        .eq('id', 1);

      if (error) {
        alert('Erro Supabase: ' + error.message);
      } else {
        setBanner(newBanner);
        alert('Banner atualizado no Supabase com sucesso!');
      }
    } catch (err: any) {
      alert('Erro Supabase: ' + (err.message || err));
    }
  };

  const handleSaveProduct = async (prod: Product) => {
    try {
      const productPayload = {
        nome: prod.name,
        descricao: prod.description,
        preco: prod.price,
        categoria_id: prod.categoryId || null,
        imagem_url: prod.image,
        disponivel: prod.isAvailable,
      };

      const { error } = await supabase
        .from('produtos')
        .upsert({ id: prod.id, ...productPayload });

      if (error) {
        alert('Erro Supabase: ' + error.message);
      } else {
        setProducts((prev) => {
          const index = prev.findIndex((p) => p.id === prod.id);
          if (index > -1) {
            const updated = [...prev];
            updated[index] = prod;
            return updated;
          }
          return [prod, ...prev];
        });
      }
    } catch (err: any) {
      alert('Erro Supabase: ' + (err.message || err));
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from('produtos').delete().eq('id', id);
      if (error) {
        alert('Erro Supabase: ' + error.message);
      } else {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err: any) {
      alert('Erro Supabase: ' + (err.message || err));
    }
  };

  const handleSaveCategory = async (cat: Category) => {
    try {
      const { error } = await supabase.from('categorias').insert({
        id: cat.id,
        nome: cat.name,
        ordem: categories.length + 1,
      });
      if (error) {
        alert('Erro Supabase: ' + error.message);
      } else {
        setCategories((prev) => [...prev, cat]);
      }
    } catch (err: any) {
      alert('Erro Supabase: ' + (err.message || err));
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (categories.length <= 1) {
      alert('Mantenha pelo menos uma categoria.');
      return;
    }
    try {
      const { error } = await supabase.from('categorias').delete().eq('id', id);
      if (error) {
        alert('Erro Supabase: ' + error.message);
      } else {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err: any) {
      alert('Erro Supabase: ' + (err.message || err));
    }
  };

  const handleOrderCreated = async (newOrder: Order) => {
    try {
      const { error } = await supabase.from('pedidos').insert({
        order_nsu: newOrder.orderNsu,
        cliente_nome: newOrder.customerName,
        cliente_telefone: newOrder.customerPhone,
        endereco: newOrder.address || '',
        itens: newOrder.items,
        total: newOrder.total,
        status: newOrder.status,
      });
      if (error) {
        alert('Erro Supabase: ' + error.message);
      } else {
        setOrders((prev) => [newOrder, ...prev]);
        if (newOrder.paymentMethod === 'whatsapp') {
          setCart([]);
        }
      }
    } catch (err: any) {
      alert('Erro Supabase: ' + (err.message || err));
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const { error } = await supabase.from('pedidos').update({ status }).eq('id', orderId);
      if (error) {
        alert('Erro Supabase: ' + error.message);
      } else {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
      }
    } catch (err: any) {
      alert('Erro Supabase: ' + (err.message || err));
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const { error } = await supabase.from('pedidos').delete().eq('id', orderId);
      if (error) {
        alert('Erro Supabase: ' + error.message);
      } else {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      }
    } catch (err: any) {
      alert('Erro Supabase: ' + (err.message || err));
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#23120B] flex flex-col font-sans selection:bg-[#D48331] selection:text-[#23120B]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 bg-[#23120B] text-[#FFF8EE] border border-[#D48331] px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        storeConfig={storeConfig}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Promotional Banner */}
      <PromotionalBanner banner={banner} />

      {/* Category Tabs (Includes 'Todos os Cookies' as first tab) */}
      <div id="cardapio-section">
        <CategoryTabs
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />
      </div>

      {/* Main Content & Search */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto relative">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <Search className="w-5 h-5 text-[#D48331]" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar sabor, recheio (ex: Nutella, Pistache)..."
            className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-[#D48331]/30 focus:outline-none focus:ring-2 focus:ring-[#D48331] shadow-sm text-sm"
          />
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between border-b border-[#D48331]/20 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#23120B] flex items-center gap-2 font-serif">
              <Cookie className="w-7 h-7 text-[#D48331]" />
              <span>{getCategoryTitle()}</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Feitos artesanalmente todos os dias com ingredientes nobres e muito amor.
            </p>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 space-y-3 bg-white rounded-3xl border border-gray-200 shadow-sm">
            <Sparkles className="w-12 h-12 text-[#D48331] mx-auto animate-pulse" />
            <h3 className="text-lg font-bold text-[#23120B]">Nenhum cookie cadastrado no Supabase</h3>
            <p className="text-sm text-gray-500">O banco de dados está vazio. Acesse a Área Administrativa para cadastrar novos produtos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={setSelectedProduct}
                onAddToCart={(prod) => handleAddToCart(prod, 1, '')}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer
        storeConfig={storeConfig}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Floating WhatsApp Button */}
      <WhatsAppFloatingButton storeConfig={storeConfig} />

      {/* Modals & Drawers */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        storeConfig={storeConfig}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        storeConfig={storeConfig}
        onOrderCreated={handleOrderCreated}
      />

      {returnParams && (
        <OrderReturnModal
          orderNsu={returnParams.orderNsu}
          transactionNsu={returnParams.transactionNsu}
          receiptUrl={returnParams.receiptUrl}
          storeConfig={storeConfig}
          onClose={() => {
            setReturnParams(null);
            setCart([]);
            window.history.replaceState({}, document.title, window.location.pathname);
          }}
        />
      )}

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        storeConfig={storeConfig}
        onUpdateStoreConfig={handleUpdateStoreConfig}
        banner={banner}
        onUpdateBanner={handleUpdateBanner}
        products={products}
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
        categories={categories}
        onSaveCategory={handleSaveCategory}
        onDeleteCategory={handleDeleteCategory}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onDeleteOrder={handleDeleteOrder}
      />

    </div>
  );
}
