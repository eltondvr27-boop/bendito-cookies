import React from 'react';
import { BannerConfig } from '../types';
import { Sparkles, ArrowRight } from 'lucide-react';

interface PromotionalBannerProps {
  banner: BannerConfig;
}

export const PromotionalBanner: React.FC<PromotionalBannerProps> = ({ banner }) => {
  if (!banner || !banner.enabled) return null;

  const isVideo = banner.type === 'video' || banner.mediaUrl?.match(/\.(mp4|webm|ogg)$/i);

  const handleScrollToMenu = () => {
    const menuEl = document.getElementById('cardapio-section');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-gradient-to-r from-[#23120B] via-[#3A1E14] to-[#23120B] text-[#FFF8EE] py-12 md:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-[#D48331]/20">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D48331_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Text Content */}
        <div className="md:col-span-7 space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-[#D48331]/20 border border-[#D48331]/40 px-3 py-1 rounded-full text-xs font-semibold text-[#E5983A] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Destaque Bendito</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#FFF8EE] leading-tight">
            {banner.title}
          </h2>
          
          <p className="text-base sm:text-lg text-[#FFF8EE]/80 max-w-2xl font-normal leading-relaxed">
            {banner.subtitle}
          </p>

          <div className="pt-2 flex flex-wrap gap-4 justify-center md:justify-start">
            <button
              onClick={handleScrollToMenu}
              className="bg-[#D48331] hover:bg-[#E5983A] text-[#23120B] font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2 text-base"
            >
              <span>{banner.buttonText || 'Ver Cardápio'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Media (Image or Video) */}
        <div className="md:col-span-5 flex justify-center">
          <div className="relative w-full max-w-md aspect-video md:aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-[#D48331]/50 bg-[#1A0E0A]">
            {isVideo ? (
              <video
                src={banner.mediaUrl}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={banner.mediaUrl}
                alt="Banner Promocional"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=600';
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
          </div>
        </div>

      </div>
    </section>
  );
};
