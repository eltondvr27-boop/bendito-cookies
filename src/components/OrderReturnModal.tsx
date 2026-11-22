import React from 'react';
import { CheckCircle2, MessageCircle, ExternalLink, X } from 'lucide-react';
import { StoreConfig } from '../types';

interface OrderReturnModalProps {
  orderNsu: string;
  transactionNsu: string;
  receiptUrl: string;
  storeConfig: StoreConfig;
  onClose: () => void;
}

export const OrderReturnModal: React.FC<OrderReturnModalProps> = ({
  orderNsu,
  transactionNsu,
  receiptUrl,
  storeConfig,
  onClose,
}) => {
  const decodedReceiptUrl = decodeURIComponent(receiptUrl || `https://pay.infinitepay.io/receipt/${transactionNsu}`);

  const handleSendToWhatsApp = () => {
    const msg = `*COMPROVANTE DE PAGAMENTO - ${storeConfig.name}*%n` +
      `Pedido: *#${orderNsu}*%n` +
      `Transação InfinitePay: *${transactionNsu}*%n` +
      `Status: *PAGO COM SUCESSO!* ✅%n%n` +
      `Comprovante: ${decodedReceiptUrl}%n%n` +
      `Olá! Acabei de realizar o pagamento online do meu pedido. Poderia confirmar o preparo?`;

    const url = `https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-emerald-500/30 relative p-6 text-center space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-[#23120B]">Pedido Pago com Sucesso!</h2>
          <p className="text-sm text-gray-600">
            Seu pagamento via InfinitePay foi aprovado com segurança. Estamos preparando seus cookies artesanais com muito carinho!
          </p>
        </div>

        <div className="bg-[#FFF8EE] p-4 rounded-2xl border border-[#D48331]/30 text-left space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Pedido NSU:</span>
            <span className="font-bold text-[#23120B]">#{orderNsu}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Transação:</span>
            <span className="font-bold text-[#23120B]">{transactionNsu}</span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {decodedReceiptUrl && (
            <a
              href={decodedReceiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gray-100 hover:bg-gray-200 text-[#23120B] font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-colors text-sm"
            >
              <ExternalLink className="w-4 h-4 text-[#D48331]" />
              <span>Ver Comprovante Oficial</span>
            </a>
          )}

          <button
            onClick={handleSendToWhatsApp}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-transform active:scale-98"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Enviar Comprovante no WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
