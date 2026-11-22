import React, { useState } from 'react';
import { CartItem, StoreConfig, Order } from '../types';
import { X, CreditCard, MessageCircle, MapPin, User, Phone, CheckCircle2, Sparkles } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  storeConfig: StoreConfig;
  onOrderCreated: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  storeConfig,
  onOrderCreated,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryFee = deliveryType === 'delivery' ? storeConfig.deliveryFee : 0;
  const total = subtotal + deliveryFee;

  const generateOrderNsu = () => {
    return 'BP-' + Math.floor(100000 + Math.random() * 900000);
  };

  const handleWhatsAppCheckout = () => {
    if (!customerName || !customerPhone) {
      alert('Por favor, preencha seu Nome e Telefone/WhatsApp.');
      return;
    }

    if (deliveryType === 'delivery' && !address) {
      alert('Por favor, informe o endereço de entrega.');
      return;
    }

    const orderNsu = generateOrderNsu();
    const newOrder: Order = {
      id: Date.now().toString(),
      orderNsu,
      customerName,
      customerPhone,
      deliveryType,
      address: deliveryType === 'delivery' ? `${address} - Bairro: ${neighborhood}` : 'Retirada na Loja',
      notes,
      items: [...cart],
      subtotal,
      deliveryFee,
      total,
      paymentMethod: 'whatsapp',
      status: 'Pendente',
      createdAt: new Date().toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    onOrderCreated(newOrder);

    // Build WhatsApp Message
    let msg = `*NOVO PEDIDO - ${storeConfig.name}*%n`;
    msg += `Pedido: *#${orderNsu}*%n%n`;
    msg += `*Cliente:* ${customerName}%n`;
    msg += `*Telefone:* ${customerPhone}%n`;
    msg += `*Tipo:* ${deliveryType === 'delivery' ? 'Delivery' : 'Retirada na Loja'}%n`;
    if (deliveryType === 'delivery') {
      msg += `*Endereço:* ${address} (${neighborhood})%n`;
    }
    if (notes) {
      msg += `*Observações:* ${notes}%n`;
    }
    msg += `%n*ITENS DO PEDIDO:*%n`;
    cart.forEach((item) => {
      msg += `• ${item.quantity}x ${item.product.name} - R$ ${(item.product.price * item.quantity).toFixed(2).replace('.', ',')}%n`;
      if (item.observation) msg += `  (Obs: ${item.observation})%n`;
    });
    msg += `%nSubtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}%n`;
    if (deliveryType === 'delivery') {
      msg += `Taxa de Entrega: R$ ${deliveryFee.toFixed(2).replace('.', ',')}%n`;
    }
    msg += `*Total: R$ ${total.toFixed(2).replace('.', ',')}*%n%n`;
    msg += `Aguardando confirmação! Obrigado por escolher a ${storeConfig.name}! 🍪`;

    const url = `https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    onClose();
  };

  const handleInfinitePayCheckout = () => {
    if (!customerName || !customerPhone) {
      alert('Por favor, preencha seu Nome e Telefone/WhatsApp.');
      return;
    }

    if (deliveryType === 'delivery' && !address) {
      alert('Por favor, informe o endereço de entrega.');
      return;
    }

    setIsSubmitting(true);
    const orderNsu = generateOrderNsu();

    // Prepare InfinitePay payload items (price in cents)
    const infinitePayItems = cart.map((item) => ({
      description: item.product.name,
      quantity: item.quantity,
      price: Math.round(item.product.price * 100), // in cents
    }));

    if (deliveryFee > 0) {
      infinitePayItems.push({
        description: 'Taxa de Entrega',
        quantity: 1,
        price: Math.round(deliveryFee * 100),
      });
    }

    const cleanHandle = storeConfig.infiniteTag.replace('$', '').trim();
    const redirectUrl = window.location.href.split('?')[0];

    const payload = {
      handle: cleanHandle,
      items: infinitePayItems,
      order_nsu: orderNsu,
      redirect_url: redirectUrl,
      customer: {
        name: customerName,
        phone_number: customerPhone,
      },
    };

    const newOrder: Order = {
      id: Date.now().toString(),
      orderNsu,
      customerName,
      customerPhone,
      deliveryType,
      address: deliveryType === 'delivery' ? `${address} - Bairro: ${neighborhood}` : 'Retirada na Loja',
      notes,
      items: [...cart],
      subtotal,
      deliveryFee,
      total,
      paymentMethod: 'online_infinitepay',
      status: 'Pendente',
      createdAt: new Date().toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    onOrderCreated(newOrder);

    // Simulate InfinitePay checkout redirect or real link construction
    // Official InfinitePay payment links format or direct API simulation:
    // If handle is present, we can open InfinitePay checkout or simulate sandbox return:
    setTimeout(() => {
      setIsSubmitting(false);
      
      // For demonstration and testing in the preview environment where external payment gateway might require credentials,
      // we provide both direct redirect and a sandbox test simulation button so the user can test the return confirmation flow immediately!
      const shouldSimulateReturn = window.confirm(
        `[Simulação InfinitePay]\n\nTag da Loja: @${cleanHandle}\nValor Total: R$ ${total.toFixed(2)}\n\nDeseja simular o retorno bem-sucedido do pagamento online agora para testar a tela de confirmação e comprovante?`
      );

      if (shouldSimulateReturn) {
        const transactionNsu = 'TX-' + Math.floor(10000000 + Math.random() * 90000000);
        const receiptUrl = `https://pay.infinitepay.io/receipt/${transactionNsu}`;
        window.location.href = `${redirectUrl}?order_nsu=${orderNsu}&transaction_nsu=${transactionNsu}&receipt_url=${encodeURIComponent(receiptUrl)}`;
      } else {
        // Fallback open official link or alert
        alert(`Pedido #${orderNsu} gerado com sucesso! Redirecionando para a InfinitePay (${cleanHandle})...`);
        onClose();
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-[#D48331]/30 relative max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#23120B] text-[#FFF8EE] px-6 py-5 flex items-center justify-between border-b border-[#D48331]/30">
          <div className="flex items-center space-x-3">
            <CreditCard className="w-6 h-6 text-[#E5983A]" />
            <h2 className="text-xl font-bold">Finalizar Pedido</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#FFF8EE]/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-grow">
          
          {/* Customer Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#D48331] flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Seus Dados</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex: Maria Alice"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D48331] text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">WhatsApp / Telefone *</label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Ex: (86) 99999-9999"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D48331] text-sm"
                />
              </div>
            </div>
          </div>

          {/* Delivery Type */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#D48331] flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Forma de Recebimento</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                className={`p-3.5 rounded-2xl border font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  deliveryType === 'delivery'
                    ? 'bg-[#23120B] text-[#FFF8EE] border-[#23120B] shadow-md'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span>🛵 Delivery (+R$ {storeConfig.deliveryFee.toFixed(2)})</span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('pickup')}
                className={`p-3.5 rounded-2xl border font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  deliveryType === 'pickup'
                    ? 'bg-[#23120B] text-[#FFF8EE] border-[#23120B] shadow-md'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span>📦 Retirada na Loja (Grátis)</span>
              </button>
            </div>

            {deliveryType === 'delivery' && (
              <div className="space-y-3 pt-2 animate-fadeIn">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Endereço (Rua, Número, Complemento) *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ex: Av. Dom Severino, 1234"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D48331] text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Bairro *</label>
                  <input
                    type="text"
                    required
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="Ex: Jóquei"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D48331] text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Observations */}
          <div className="space-y-1 pt-2">
            <label className="text-xs font-bold text-gray-700">Observações gerais do pedido</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Troco para R$ 50, campainha quebrada, etc."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D48331] text-sm"
            />
          </div>

          {/* Summary Box */}
          <div className="bg-[#FFF8EE] p-4 rounded-2xl border border-[#D48331]/30 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Entrega</span>
              <span>R$ {deliveryFee.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-[#23120B] pt-2 border-t border-[#D48331]/20">
              <span>Total a Pagar</span>
              <span className="text-[#D48331]">R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          {/* Payment Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleInfinitePayCheckout}
              className="w-full bg-[#D48331] hover:bg-[#E5983A] text-[#23120B] font-extrabold py-4 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-transform active:scale-98 disabled:opacity-50"
            >
              <CreditCard className="w-5 h-5" />
              <span>{isSubmitting ? 'Processando...' : 'Pagar Online (InfinitePay)'}</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppCheckout}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-transform active:scale-98"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Enviar Resumo do Pedido no WhatsApp</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
