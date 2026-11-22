import React from 'react';
import { ShoppingBag, Instagram, MessageCircle, Shield, Clock } from 'lucide-react';
import { StoreConfig } from '../types';
import { LOGO_PATH } from '../data/initialData';

interface NavbarProps {
  storeConfig: StoreConfig;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  storeConfig,
  cartCount,
  onOpenCart,
  onOpenAdmin,
}) => {
  // Check if store is currently open (e.g. between 10h and 23h or based on operatingHours)
  const currentHour = new Date().getHours();
  const isOpenNow = currentHour >= 10 && currentHour < 23;

  return (
    <header className="sticky top-0 z-40 bg-[#23120B]/95 backdrop-blur-md text-[#FFF8EE] border-b border-[#D48331]/30 shadow-lg transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#D48331] shadow-md bg-[#3A1E14] flex-shrink-0 group-hover:scale-105 transition-transform">
              <img
                src={LOGO_PATH}
                alt={storeConfig.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=200';
                }}
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide text-[#FFF8EE] font-serif">
                {storeConfig.name}
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#E5983A] font-medium tracking-wider uppercase">
                  {storeConfig.subtitle}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {isOpenNow ? 'Aberto agora' : 'Horário de Pedidos'}
                </span>
              </div>
            </div>
          </div>

          {/* Social & Contact links (Desktop) */}
          <div className="hidden lg:flex items-center space-x-5 text-sm font-medium">
            <a
              href={`https://instagram.com/${storeConfig.instagramHandle.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#FFF8EE]/90 hover:text-[#E5983A] transition-colors"
            >
              <Instagram className="w-4 h-4 text-[#E5983A]" />
              <span>{storeConfig.instagramHandle}</span>
            </a>

            <a
              href={`https://wa.me/${storeConfig.whatsappNumber}?text=Olá!%20Gostaria%20de%20tirar%20dúvidas%20sobre%20os%20cookies.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#FFF8EE]/90 hover:text-emerald-400 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-500" />
              <span>{storeConfig.whatsappDisplay}</span>
            </a>
          </div>

          {/* Actions (Cart & Admin trigger) */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenCart}
              className="relative bg-[#D48331] hover:bg-[#E5983A] text-[#23120B] px-4 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-md transition-all transform active:scale-95"
              aria-label="Abrir Carrinho"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline">Carrinho</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-extrabold shadow-lg animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenAdmin}
              className="p-2.5 rounded-full bg-[#3A1E14] hover:bg-[#4A261A] text-[#FFF8EE]/80 hover:text-[#FFF8EE] border border-[#D48331]/30 transition-colors"
              title="Área Administrativa"
              aria-label="Área Administrativa"
            >
              <Shield className="w-5 h-5 text-[#E5983A]" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
