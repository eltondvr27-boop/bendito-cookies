import React from 'react';
import { Category } from '../types';
import { Cookie, Sparkles, Gift, Coffee, Grid } from 'lucide-react';

interface CategoryTabsProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  const allTab: Category = { id: 'all', name: 'Todos os Cookies' };
  const combinedCategories = [allTab, ...categories];

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'all':
        return <Grid className="w-4 h-4" />;
      case 'tradicionais':
        return <Cookie className="w-4 h-4" />;
      case 'recheados':
        return <Sparkles className="w-4 h-4" />;
      case 'combos':
        return <Gift className="w-4 h-4" />;
      case 'bebidas':
        return <Coffee className="w-4 h-4" />;
      default:
        return <Cookie className="w-4 h-4" />;
    }
  };

  return (
    <div className="sticky top-20 z-30 bg-[#FFF8EE]/95 backdrop-blur-md border-b border-[#D48331]/20 shadow-sm py-3 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Horizontal scroll container on mobile, flex center on desktop */}
        <div 
          className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1 justify-start md:justify-center"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {combinedCategories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 shadow-sm ${
                  isSelected
                    ? 'bg-[#23120B] text-[#FFF8EE] shadow-md ring-2 ring-[#D48331]'
                    : 'bg-white text-[#3A1E14] hover:bg-[#F3E5D8] border border-[#D48331]/30'
                }`}
              >
                <span className={isSelected ? 'text-[#E5983A]' : 'text-[#D48331]'}>
                  {getCategoryIcon(cat.id)}
                </span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
