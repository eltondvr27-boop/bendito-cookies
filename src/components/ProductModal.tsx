import React, { useState } from 'react';
import { Product } from '../types';
import { X, Plus, Minus, ShoppingBag, Sparkles } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, observation: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [observation, setObservation] = useState('');

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAdd = () => {
    onAddToCart(product, quantity, observation);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#D48331]/30 relative animate-scaleUp max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="relative h-64 sm:h-72 w-full bg-[#23120B]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=600';
            }}
          />
          {product.badge && (
            <span className="absolute bottom-4 left-4 bg-[#D48331] text-[#23120B] text-xs font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
              {product.badge}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-grow">
          <div>
            <h2 className="text-2xl font-extrabold text-[#23120B]">{product.name}</h2>
            <p className="text-xl font-bold text-[#D48331] mt-1">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </p>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed">
            {product.description}
          </p>

          {/* Observation input */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#3A1E14]">
              Observações do item (opcional)
            </label>
            <input
              type="text"
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Ex: Sem nozes, bem aquecido, etc."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D48331] text-sm text-gray-800"
            />
          </div>

          {/* Quantity selector */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="text-sm font-bold text-[#3A1E14]">Quantidade</span>
            <div className="flex items-center space-x-3 bg-gray-100 px-4 py-2 rounded-xl">
              <button
                onClick={handleDecrement}
                className="p-1 rounded-lg hover:bg-white text-[#3A1E14] transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-extrabold text-lg text-[#23120B] w-6 text-center">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="p-1 rounded-lg hover:bg-white text-[#3A1E14] transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Add Button */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={handleAdd}
            className="w-full bg-[#D48331] hover:bg-[#E5983A] text-[#23120B] font-extrabold py-3.5 px-6 rounded-xl shadow-lg flex items-center justify-center gap-3 transition-transform active:scale-98"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Adicionar • R$ {(product.price * quantity).toFixed(2).replace('.', ',')}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
