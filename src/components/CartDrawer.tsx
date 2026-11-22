import React from 'react';
import { CartItem, StoreConfig } from '../types';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  storeConfig: StoreConfig;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  storeConfig,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryFee = storeConfig.deliveryFee;
  const total = subtotal + (cart.length > 0 ? deliveryFee : 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="bg-[#23120B] text-[#FFF8EE] px-6 py-5 flex items-center justify-between border-b border-[#D48331]/30">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-6 h-6 text-[#E5983A]" />
              <h2 className="text-xl font-bold">Seu Carrinho</h2>
            </div>
            <button
              onClick={onClose}
              className="text-[#FFF8EE]/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Fechar carrinho"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <div className="w-20 h-20 bg-[#FFF8EE] text-[#D48331] rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-[#23120B]">Seu carrinho está vazio</h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">
                  Escolha seus cookies artesanais favoritos no cardápio e adicione aqui!
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 bg-[#D48331] hover:bg-[#E5983A] text-[#23120B] font-bold px-6 py-2.5 rounded-full shadow-md transition-all"
                >
                  Ver Cardápio
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-[#FFF8EE]/60 border border-[#D48331]/20 rounded-2xl p-4 flex gap-4 items-center shadow-xs"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-[#23120B] flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=200';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[#23120B] text-sm truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-xs font-semibold text-[#D48331] mt-0.5">
                      R$ {item.product.price.toFixed(2).replace('.', ',')}
                    </p>
                    {item.observation && (
                      <p className="text-xs text-gray-500 italic mt-1 line-clamp-1">
                        Obs: {item.observation}
                      </p>
                    )}

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2 bg-white border border-gray-200 px-2.5 py-1 rounded-lg">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          className="text-gray-600 hover:text-black"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-extrabold text-[#23120B] w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="text-gray-600 hover:text-black"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-red-500 hover:text-red-700 p-1 transition-colors"
                        title="Remover item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout button */}
          {cart.length > 0 && (
            <div className="bg-[#FFF8EE] border-t border-[#D48331]/30 p-6 space-y-4 shadow-lg">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Taxa de Entrega</span>
                  <span className="font-semibold">R$ {deliveryFee.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-lg font-extrabold text-[#23120B] pt-2 border-t border-[#D48331]/20">
                  <span>Total</span>
                  <span className="text-[#D48331]">R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              <button
                onClick={onProceedTest => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full bg-[#D48331] hover:bg-[#E5983A] text-[#23120B] font-extrabold py-4 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-transform active:scale-98"
              >
                <span>Finalizar Pedido</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
