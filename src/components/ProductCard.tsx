import React from 'react';
import { Product } from '../types';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onAddToCart,
}) => {
  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-[#D48331]/20 flex flex-col justify-between cursor-pointer group transform hover:-translate-y-1.5"
    >
      {/* Image & Badge */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#23120B]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=400';
          }}
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="bg-[#23120B]/80 backdrop-blur-sm text-[#FFF8EE] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider border border-[#D48331]/30">
            Artesanal
          </span>
          {product.badge && (
            <span className="bg-[#D48331] text-[#23120B] text-[10px] font-black px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
              {product.badge}
            </span>
          )}
        </div>

        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-20">
            <span className="bg-gray-800 text-gray-200 font-extrabold text-xs px-4 py-2 rounded-full uppercase tracking-wider shadow-lg border border-gray-600">
              Esgotado
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow justify-between bg-gradient-to-b from-white to-[#FFFDFB]">
        <div>
          <h3 className="text-lg font-extrabold text-[#23120B] group-hover:text-[#D48331] transition-colors line-clamp-1 font-serif">
            {product.name}
          </h3>
          <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed font-sans">
            {product.description}
          </p>
        </div>

        <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Valor</span>
            <span className="text-lg font-black text-[#23120B]">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
          </div>

          <button
            disabled={!product.isAvailable}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product, e);
            }}
            className={`p-3 rounded-2xl font-bold shadow-md transition-all flex items-center justify-center ${
              product.isAvailable
                ? 'bg-[#D48331] hover:bg-[#E5983A] text-[#23120B] active:scale-95 shadow-orange-500/20'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            aria-label={`Adicionar ${product.name} ao carrinho`}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
