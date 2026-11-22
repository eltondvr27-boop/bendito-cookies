import React from 'react';
import { MessageCircle } from 'lucide-react';
import { StoreConfig } from '../types';

interface WhatsAppFloatingButtonProps {
  storeConfig: StoreConfig;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({ storeConfig }) => {
  const whatsappUrl = `https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent(
    'Olá! Gostaria de tirar dúvidas sobre os cookies artesanais da Bendito Cookies.'
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transform hover:scale-110 transition-all duration-300 group"
      aria-label="Atendimento via WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
      <span className="absolute right-full mr-3 bg-[#23120B] text-[#FFF8EE] text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Fale Conosco
      </span>
    </a>
  );
};
