import React from 'react';
import { StoreConfig } from '../types';
import { Instagram, MessageCircle, Shield, Clock, MapPin } from 'lucide-react';
import { LOGO_PATH } from '../data/initialData';

interface FooterProps {
  storeConfig: StoreConfig;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ storeConfig, onOpenAdmin }) => {
  return (
    <footer className="bg-[#1A0E0A] text-[#FFF8EE] border-t border-[#D48331]/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        
        {/* Brand & Logo */}
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#D48331] bg-[#23120B] flex-shrink-0 shadow-md">
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
            <h3 className="text-xl font-bold text-[#FFF8EE]">{storeConfig.name}</h3>
            <p className="text-xs text-[#E5983A] uppercase tracking-wider">{storeConfig.subtitle}</p>
          </div>
        </div>

        {/* Operating Hours & Contact */}
        <div className="space-y-2 text-sm text-[#FFF8EE]/80 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Clock className="w-4 h-4 text-[#D48331]" />
            <span>{storeConfig.operatingHours}</span>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-2">
            <MapPin className="w-4 h-4 text-[#D48331]" />
            <span>Entregas rápidas e artesanais com amor</span>
          </div>
        </div>

        {/* Social Links & Admin button */}
        <div className="flex flex-col md:items-end space-y-4">
          <div className="flex items-center space-x-4">
            <a
              href={`https://instagram.com/${storeConfig.instagramHandle.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-[#23120B] hover:bg-[#3A1E14] text-[#E5983A] border border-[#D48331]/30 transition-colors"
              title="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>

            <a
              href={`https://wa.me/${storeConfig.whatsappNumber}?text=Olá!%20Gostaria%20de%20fazer%20um%20pedido.`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-[#23120B] hover:bg-[#3A1E14] text-emerald-400 border border-[#D48331]/30 transition-colors"
              title="WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>

          <button
            onClick={onOpenAdmin}
            className="text-xs text-[#FFF8EE]/60 hover:text-[#E5983A] flex items-center gap-1.5 transition-colors pt-2"
          >
            <Shield className="w-3.5 h-3.5 text-[#D48331]" />
            <span>Área Administrativa</span>
          </button>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[#D48331]/20 text-center text-xs text-[#FFF8EE]/50">
        © {new Date().getFullYear()} {storeConfig.name} • Todos os direitos reservados.
      </div>
    </footer>
  );
};
