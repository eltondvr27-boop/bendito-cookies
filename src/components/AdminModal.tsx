import React, { useState } from 'react';
import { StoreConfig, BannerConfig, Product, Category, Order } from '../types';
import { Shield, X, Lock, Image, UtensilsCrossed, FolderTree, Settings, ClipboardList, Plus, Trash2, Edit2, CheckCircle, Save, Upload } from 'lucide-react';
import { LOGO_PATH } from '../data/initialData';
import { uploadMediaToSupabase } from '../lib/supabaseStorage';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeConfig: StoreConfig;
  onUpdateStoreConfig: (newConfig: StoreConfig) => void;
  banner: BannerConfig;
  onUpdateBanner: (newBanner: BannerConfig) => void;
  products: Product[];
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  categories: Category[];
  onSaveCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onDeleteOrder: (orderId: string) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  storeConfig,
  onUpdateStoreConfig,
  banner,
  onUpdateBanner,
  products,
  onSaveProduct,
  onDeleteProduct,
  categories,
  onSaveCategory,
  onDeleteCategory,
  orders,
  onUpdateOrderStatus,
  onDeleteOrder,
}) => {
  if (!isOpen) return null;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [activeTab, setActiveTab] = useState<'banner' | 'products' | 'categories' | 'settings' | 'orders'>('orders');

  // Product editing state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);

  // Category editing state
  const [newCatName, setNewCatName] = useState('');

  // Banner local state
  const [bannerForm, setBannerForm] = useState<BannerConfig>({ ...banner });

  // Store config local state
  const [storeForm, setStoreForm] = useState<StoreConfig>({ ...storeConfig });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length !== 6 || !/^\d{6}$/.test(pinInput)) {
      alert('A senha numérica deve ter exatamente 6 dígitos numéricos.');
      return;
    }

    if (usernameInput === storeConfig.adminUsername && pinInput === storeConfig.adminPin) {
      setIsAuthenticated(true);
    } else {
      alert('Usuário ou senha incorretos. (Padrão: admin / 123456)');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const publicUrl = await uploadMediaToSupabase(file);
      if (publicUrl) {
        callback(publicUrl);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#D48331]/30 relative max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#23120B] text-[#FFF8EE] px-6 py-5 flex items-center justify-between border-b border-[#D48331]/30">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-[#E5983A]" />
            <h2 className="text-xl font-bold">Painel Administrativo • Bendito Cookies</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#FFF8EE]/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!isAuthenticated ? (
          /* Login Screen */
          <div className="p-8 sm:p-12 max-w-md mx-auto my-auto space-y-6 text-center">
            <div className="w-20 h-20 bg-[#FFF8EE] text-[#D48331] rounded-full flex items-center justify-center mx-auto shadow-inner border border-[#D48331]/30">
              <Lock className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-[#23120B]">Acesso Restrito</h3>
              <p className="text-sm text-gray-600">
                Digite seu usuário e a senha numérica de 6 dígitos para gerenciar a loja.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Nome de Usuário</label>
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="admin"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D48331] text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Senha Numérica (6 dígitos)</label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D48331] text-sm tracking-widest font-mono text-center text-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#D48331] hover:bg-[#E5983A] text-[#23120B] font-extrabold py-3.5 rounded-xl shadow-lg transition-transform active:scale-98"
              >
                Entrar no Painel
              </button>
            </form>
          </div>
        ) : (
          /* Admin Dashboard Layout */
          <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 bg-[#FFF8EE] border-r border-[#D48331]/20 p-4 flex md:flex-col gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${
                  activeTab === 'orders' ? 'bg-[#23120B] text-[#FFF8EE]' : 'text-[#3A1E14] hover:bg-[#F3E5D8]'
                }`}
              >
                <ClipboardList className="w-5 h-5 text-[#D48331]" />
                <span>Pedidos ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${
                  activeTab === 'products' ? 'bg-[#23120B] text-[#FFF8EE]' : 'text-[#3A1E14] hover:bg-[#F3E5D8]'
                }`}
              >
                <UtensilsCrossed className="w-5 h-5 text-[#D48331]" />
                <span>Cardápio / Produtos</span>
              </button>

              <button
                onClick={() => setActiveTab('categories')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${
                  activeTab === 'categories' ? 'bg-[#23120B] text-[#FFF8EE]' : 'text-[#3A1E14] hover:bg-[#F3E5D8]'
                }`}
              >
                <FolderTree className="w-5 h-5 text-[#D48331]" />
                <span>Categorias</span>
              </button>

              <button
                onClick={() => setActiveTab('banner')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${
                  activeTab === 'banner' ? 'bg-[#23120B] text-[#FFF8EE]' : 'text-[#3A1E14] hover:bg-[#F3E5D8]'
                }`}
              >
                <Image className="w-5 h-5 text-[#D48331]" />
                <span>Banner Promocional</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${
                  activeTab === 'settings' ? 'bg-[#23120B] text-[#FFF8EE]' : 'text-[#3A1E14] hover:bg-[#F3E5D8]'
                }`}
              >
                <Settings className="w-5 h-5 text-[#D48331]" />
                <span>Configurações</span>
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              
              {/* ORDERS TAB */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-[#23120B]">Gerenciamento de Pedidos</h3>
                    <span className="text-xs bg-[#D48331]/20 text-[#D48331] font-bold px-3 py-1 rounded-full">
                      Total: {orders.length} pedidos
                    </span>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                      <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">Nenhum pedido recebido ainda.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
                            <div>
                              <span className="text-xs font-bold text-[#D48331]">#{order.orderNsu}</span>
                              <h4 className="font-extrabold text-[#23120B] text-base">{order.customerName}</h4>
                              <p className="text-xs text-gray-500">{order.customerPhone} • {order.createdAt}</p>
                            </div>

                            <div className="flex items-center gap-2">
                              <select
                                value={order.status}
                                onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border ${
                                  order.status === 'Pago' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                                  order.status === 'Em preparo' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                                  order.status === 'Saiu para entrega' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                                  order.status === 'Concluído' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                                  'bg-gray-100 text-gray-800 border-gray-300'
                                }`}
                              >
                                <option value="Pendente">Pendente</option>
                                <option value="Pago">Pago</option>
                                <option value="Em preparo">Em preparo</option>
                                <option value="Saiu para entrega">Saiu para entrega</option>
                                <option value="Concluído">Concluído</option>
                              </select>

                              <button
                                onClick={() => onDeleteOrder(order.id)}
                                className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                                title="Excluir pedido"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="text-xs space-y-1 text-gray-600">
                            <p><strong>Tipo:</strong> {order.deliveryType === 'delivery' ? `Delivery (${order.address})` : 'Retirada na Loja'}</p>
                            {order.notes && <p><strong>Obs:</strong> {order.notes}</p>}
                          </div>

                          <div className="bg-gray-50 p-3 rounded-xl space-y-1">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-xs text-gray-700">
                                <span>{item.quantity}x {item.product.name}</span>
                                <span className="font-semibold">R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                              </div>
                            ))}
                            <div className="flex justify-between pt-2 border-t border-gray-200 font-extrabold text-sm text-[#23120B]">
                              <span>Total ({order.paymentMethod === 'online_infinitepay' ? 'InfinitePay Online' : 'WhatsApp'}):</span>
                              <span className="text-[#D48331]">R$ {order.total.toFixed(2).replace('.', ',')}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* PRODUCTS TAB */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-[#23120B]">Gerenciar Cardápio</h3>
                    <button
                      onClick={() => {
                        setEditingProduct({
                          id: 'prod-' + Date.now(),
                          name: '',
                          description: '',
                          price: 15.00,
                          categoryId: categories[0]?.id || 'tradicionais',
                          image: LOGO_PATH,
                          isAvailable: true,
                          badge: '',
                        });
                        setIsProductFormOpen(true);
                      }}
                      className="bg-[#D48331] hover:bg-[#E5983A] text-[#23120B] font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Novo Produto</span>
                    </button>
                  </div>

                  {/* Product Form Modal / Editor */}
                  {isProductFormOpen && editingProduct && (
                    <div className="bg-white p-6 rounded-2xl border-2 border-[#D48331] shadow-lg space-y-4">
                      <h4 className="font-bold text-lg text-[#23120B]">
                        {products.some(p => p.id === editingProduct.id) ? 'Editar Produto' : 'Adicionar Novo Produto'}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700">Nome do Cookie / Produto *</label>
                          <input
                            type="text"
                            value={editingProduct.name}
                            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700">Preço (R$) *</label>
                          <input
                            type="number"
                            step="0.50"
                            value={editingProduct.price}
                            onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700">Categoria *</label>
                          <select
                            value={editingProduct.categoryId}
                            onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                          >
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700">Destaque / Badge (opcional)</label>
                          <input
                            type="text"
                            value={editingProduct.badge || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                            placeholder="Ex: Mais Vendido, Novo"
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">Descrição Detalhada *</label>
                        <textarea
                          rows={2}
                          value={editingProduct.description}
                          onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                        />
                      </div>

                      {/* Image Upload / URL */}
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-700 block">Foto do Produto</label>
                        
                        <div className="space-y-2">
                          <label className="cursor-pointer bg-[#D48331] hover:bg-[#E5983A] text-[#23120B] font-extrabold px-4 py-2.5 rounded-xl text-xs inline-flex items-center gap-2 shadow-sm transition-all">
                            <Upload className="w-4 h-4" />
                            <span>Escolher Foto da Galeria / Computador</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, (url) => setEditingProduct({ ...editingProduct, image: url }))}
                            />
                          </label>

                          {/* Preview */}
                          {editingProduct.image && (
                            <div className="pt-1">
                              <img
                                src={editingProduct.image}
                                alt="Preview"
                                className="w-24 h-24 rounded-2xl object-cover bg-gray-200 border-2 border-[#D48331]/30 shadow-md"
                              />
                            </div>
                          )}
                        </div>

                        {/* Secondary web link input */}
                        <div className="pt-1">
                          <input
                            type="text"
                            value={editingProduct.image}
                            onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                            placeholder="Ou cole a URL da imagem da web"
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-600"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 pt-2">
                        <input
                          type="checkbox"
                          id="isAvailable"
                          checked={editingProduct.isAvailable}
                          onChange={(e) => setEditingProduct({ ...editingProduct, isAvailable: e.target.checked })}
                          className="w-4 h-4 text-[#D48331] rounded"
                        />
                        <label htmlFor="isAvailable" className="text-sm font-bold text-gray-700">
                          Disponível para venda (Ativo)
                        </label>
                      </div>

                      <div className="flex justify-end gap-3 pt-3">
                        <button
                          onClick={() => setIsProductFormOpen(false)}
                          className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-100"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => {
                            if (!editingProduct.name) {
                              alert('Insira o nome do produto.');
                              return;
                            }
                            onSaveProduct(editingProduct);
                            setIsProductFormOpen(false);
                          }}
                          className="px-5 py-2 rounded-xl bg-[#D48331] text-[#23120B] font-bold text-sm shadow-md hover:bg-[#E5983A]"
                        >
                          Salvar Produto
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {products.map((prod) => (
                      <div key={prod.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between gap-4">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-16 h-16 rounded-xl object-cover bg-gray-200 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-[#23120B] text-sm truncate">{prod.name}</h4>
                          <p className="text-xs font-semibold text-[#D48331]">R$ {prod.price.toFixed(2).replace('.', ',')}</p>
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${prod.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                            {prod.isAvailable ? 'Disponível' : 'Esgotado'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingProduct({ ...prod });
                              setIsProductFormOpen(true);
                            }}
                            className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteProduct(prod.id)}
                            className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CATEGORIES TAB */}
              {activeTab === 'categories' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-[#23120B]">Gerenciar Categorias</h3>

                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 max-w-lg">
                    <h4 className="font-bold text-sm text-gray-700">Adicionar Nova Categoria</h4>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="Ex: Brownies & Tortas"
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                      />
                      <button
                        onClick={() => {
                          if (!newCatName.trim()) return;
                          const newCat: Category = {
                            id: newCatName.toLowerCase().replace(/\s+/g, '-'),
                            name: newCatName.trim(),
                          };
                          onSaveCategory(newCat);
                          setNewCatName('');
                        }}
                        className="bg-[#D48331] hover:bg-[#E5983A] text-[#23120B] font-bold px-5 py-2.5 rounded-xl text-sm shadow-md"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categories.map((cat) => (
                      <div key={cat.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                        <span className="font-bold text-[#23120B] text-sm">{cat.name}</span>
                        <button
                          onClick={() => onDeleteCategory(cat.id)}
                          className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                          title="Excluir categoria"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BANNER TAB */}
              {activeTab === 'banner' && (
                <div className="space-y-6 max-w-2xl">
                  <h3 className="text-xl font-bold text-[#23120B]">Gerenciar Banner Promocional</h3>

                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="bannerEnabled"
                        checked={bannerForm.enabled}
                        onChange={(e) => setBannerForm({ ...bannerForm, enabled: e.target.checked })}
                        className="w-5 h-5 text-[#D48331] rounded"
                      />
                      <label htmlFor="bannerEnabled" className="font-bold text-[#23120B] text-sm">
                        Exibir Banner Promocional na Tela Inicial
                      </label>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Título do Banner</label>
                      <input
                        type="text"
                        value={bannerForm.title}
                        onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Subtítulo / Descrição</label>
                      <textarea
                        rows={2}
                        value={bannerForm.subtitle}
                        onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">Texto do Botão</label>
                        <input
                          type="text"
                          value={bannerForm.buttonText || ''}
                          onChange={(e) => setBannerForm({ ...bannerForm, buttonText: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">Tipo de Mídia</label>
                        <select
                          value={bannerForm.type}
                          onChange={(e) => setBannerForm({ ...bannerForm, type: e.target.value as 'image' | 'video' })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                        >
                          <option value="image">Imagem (JPG/PNG/WEBP)</option>
                          <option value="video">Vídeo (MP4/WEBM autoplay)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-700 block">Mídia do Banner (Foto ou Vídeo)</label>
                      
                      <div className="space-y-2">
                        <label className="cursor-pointer bg-[#D48331] hover:bg-[#E5983A] text-[#23120B] font-extrabold px-4 py-2.5 rounded-xl text-xs inline-flex items-center gap-2 shadow-sm transition-all">
                          <Upload className="w-4 h-4" />
                          <span>Escolher Foto ou Vídeo da Galeria / Computador</span>
                          <input
                            type="file"
                            accept="image/*,video/mp4,video/webm"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, (url) => setBannerForm({ ...bannerForm, mediaUrl: url }))}
                          />
                        </label>

                        {/* Preview */}
                        {bannerForm.mediaUrl && (
                          <div className="pt-1">
                            {bannerForm.type === 'video' || bannerForm.mediaUrl.match(/\.(mp4|webm)$/i) ? (
                              <video
                                src={bannerForm.mediaUrl}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-48 h-28 rounded-2xl object-cover bg-black border-2 border-[#D48331]/30 shadow-md"
                              />
                            ) : (
                              <img
                                src={bannerForm.mediaUrl}
                                alt="Banner Preview"
                                className="w-48 h-28 rounded-2xl object-cover bg-gray-200 border-2 border-[#D48331]/30 shadow-md"
                              />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Secondary web link input */}
                      <div className="pt-1">
                        <input
                          type="text"
                          value={bannerForm.mediaUrl}
                          onChange={(e) => setBannerForm({ ...bannerForm, mediaUrl: e.target.value })}
                          placeholder="Ou cole a URL da imagem/vídeo da web"
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-600"
                        />
                      </div>
                    </div>

                    <div className="pt-3">
                      <button
                        onClick={() => {
                          onUpdateBanner(bannerForm);
                          alert('Banner atualizado com sucesso!');
                        }}
                        className="bg-[#D48331] hover:bg-[#E5983A] text-[#23120B] font-extrabold px-6 py-3 rounded-xl shadow-md text-sm flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Salvar Alterações do Banner</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-2xl">
                  <h3 className="text-xl font-bold text-[#23120B]">Configurações da Loja & InfinitePay</h3>

                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">Nome da Loja</label>
                        <input
                          type="text"
                          value={storeForm.name}
                          onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">Subtítulo</label>
                        <input
                          type="text"
                          value={storeForm.subtitle}
                          onChange={(e) => setStoreForm({ ...storeForm, subtitle: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">WhatsApp Number (Ex: 5586995153061)</label>
                        <input
                          type="text"
                          value={storeForm.whatsappNumber}
                          onChange={(e) => setStoreForm({ ...storeForm, whatsappNumber: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">WhatsApp Display ((86) 99515-3061)</label>
                        <input
                          type="text"
                          value={storeForm.whatsappDisplay}
                          onChange={(e) => setStoreForm({ ...storeForm, whatsappDisplay: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">Instagram Handle (@bendito.cookies_)</label>
                        <input
                          type="text"
                          value={storeForm.instagramHandle}
                          onChange={(e) => setStoreForm({ ...storeForm, instagramHandle: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">Taxa de Entrega Padrão (R$)</label>
                        <input
                          type="number"
                          step="0.50"
                          value={storeForm.deliveryFee}
                          onChange={(e) => setStoreForm({ ...storeForm, deliveryFee: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">InfiniteTag (InfinitePay Handle, sem $)</label>
                        <input
                          type="text"
                          value={storeForm.infiniteTag}
                          onChange={(e) => setStoreForm({ ...storeForm, infiniteTag: e.target.value })}
                          placeholder="benditookies"
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-mono text-emerald-700 font-bold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">Horário de Funcionamento</label>
                        <input
                          type="text"
                          value={storeForm.operatingHours}
                          onChange={(e) => setStoreForm({ ...storeForm, operatingHours: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                        />
                      </div>
                    </div>

                    <div className="pt-3">
                      <button
                        onClick={() => {
                          onUpdateStoreConfig(storeForm);
                          alert('Configurações da loja salvas com sucesso!');
                        }}
                        className="bg-[#D48331] hover:bg-[#E5983A] text-[#23120B] font-extrabold px-6 py-3 rounded-xl shadow-md text-sm flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Salvar Configurações</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
};
