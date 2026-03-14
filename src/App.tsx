import { ShoppingCart, User, Mail, ShieldCheck, Lock, Zap, CreditCard, IdCard, Star, CheckCircle2, Timer, ChevronRight, MessageSquare, ArrowLeft, QrCode, Copy, Barcode, Download, Calendar, Settings, X, Palette } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { useState, useEffect, MouseEvent } from 'react';

type PaymentMethod = 'pix' | 'card' | 'boleto';

export default function App() {
  const [primaryColor, setPrimaryColor] = useState('#D1105A');
  const [bgColor, setBgColor] = useState('#0A0A0A');
  const [showSettings, setShowSettings] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [showSuccess, setShowSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

  // Input Masking Functions
  const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const maskCard = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{4})(\d)/, '$1 $2')
      .replace(/(\d{4})(\d)/, '$1 $2')
      .replace(/(\d{4})(\d)/, '$1 $2')
      .replace(/(\s\d{4})\d+?$/, '$1');
  };

  const maskExpiry = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\/\d{2})\d+?$/, '$1');
  };

  const handleInputChange = (field: string, value: string) => {
    let maskedValue = value;
    if (field === 'cpf') maskedValue = maskCPF(value);
    if (field === 'cardNumber') maskedValue = maskCard(value);
    if (field === 'expiry') maskedValue = maskExpiry(value);
    if (field === 'cvv') maskedValue = value.replace(/\D/g, '').slice(0, 4);
    
    setFormData(prev => ({ ...prev, [field]: maskedValue }));
  };

  const handleFinalize = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setShowSuccess(true);
  };

  // 3D Tilt Effect for Product Card
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePaymentSelect = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setStep(3);
  };

  if (showSuccess) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4 transition-colors duration-500"
        style={{ 
          backgroundColor: `${primaryColor}10`,
          '--primary': primaryColor,
          '--bg': bgColor,
        } as any}
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[3rem] p-12 shadow-2xl text-center max-w-md w-full border-4"
          style={{ borderColor: `${primaryColor}1A` }}
        >
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            style={{ backgroundColor: primaryColor, boxShadow: `0 10px 30px ${primaryColor}4D` }}
          >
            <CheckCircle2 className="text-white w-12 h-12" />
          </div>
          <h1 className="text-3xl font-black text-[#1A1A1A] mb-2 uppercase tracking-tighter">Pedido Confirmado!</h1>
          <p className="text-[#666666] mb-8">Sua compra foi processada com sucesso. Verifique seu e-mail para mais detalhes.</p>
          <button 
            onClick={() => {
              setShowSuccess(false);
              setStep(1);
              setPaymentMethod(null);
            }}
            className="w-full text-white py-4 rounded-2xl font-bold uppercase tracking-widest transition-all"
            style={{ backgroundColor: primaryColor }}
          >
            Voltar ao Início
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 font-sans overflow-hidden selection:text-white transition-colors duration-500"
      style={{ 
        backgroundColor: bgColor,
        '--primary': primaryColor,
        '--bg': bgColor,
        selectionBackgroundColor: primaryColor 
      } as any}
    >
      {/* Color Settings Toggle */}
      <button 
        onClick={() => setShowSettings(true)}
        className="fixed top-6 right-6 z-50 p-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white/20 transition-all shadow-xl"
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 h-full w-80 bg-white z-[70] shadow-2xl p-8 flex flex-col gap-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-[#1A1A1A]" />
                  <h3 className="font-black uppercase text-sm tracking-widest text-[#1A1A1A]">Personalização</h3>
                </div>
                <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-[#1A1A1A]" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-[#1A1A1A] opacity-40">Cor Primária</label>
                  <div className="flex flex-wrap gap-2">
                    {['#D1105A', '#7C3AED', '#2563EB', '#059669', '#D97706', '#DC2626'].map(color => (
                      <button 
                        key={color}
                        onClick={() => setPrimaryColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${primaryColor === color ? 'border-[#1A1A1A]' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <input 
                      type="color" 
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-8 h-8 rounded-full border-none cursor-pointer bg-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-[#1A1A1A] opacity-40">Cor de Fundo</label>
                  <div className="flex flex-wrap gap-2">
                    {['#0A0A0A', '#1A1A1A', '#0F172A', '#171717', '#262626', '#FFFFFF'].map(color => (
                      <button 
                        key={color}
                        onClick={() => setBgColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${bgColor === color ? 'border-[#1A1A1A]' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <input 
                      type="color" 
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-8 h-8 rounded-full border-none cursor-pointer bg-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-auto bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                  As cores selecionadas são aplicadas instantaneamente em todo o checkout para visualização em tempo real.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Background Abstract Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-colors duration-1000" 
          style={{ backgroundColor: `${primaryColor}1A` }}
        />
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-colors duration-1000" 
          style={{ backgroundColor: `${primaryColor}0D` }}
        />
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Left Column: Product & Social Proof */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-center">
          {/* Urgency Banner */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-white p-3 rounded-2xl flex items-center justify-between px-6 shadow-lg"
            style={{ backgroundColor: primaryColor, boxShadow: `0 10px 20px ${primaryColor}33` }}
          >
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Oferta Expira em:</span>
            </div>
            <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
          </motion.div>

          {/* Product Card with 3D Tilt */}
          <motion.div 
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 relative group"
          >
            <div 
              className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]" 
              style={{ backgroundImage: `linear-gradient(to bottom right, ${primaryColor}33, transparent)` }}
            />
            
            <div style={{ transform: "translateZ(50px)" }} className="relative">
              <div className="flex items-center justify-between mb-6">
                <span className="bg-white/10 text-white/60 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/5">
                  Premium Access
                </span>
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://picsum.photos/seed/${i+10}/32/32`} className="w-6 h-6 rounded-full border-2 border-[#1A1A1A]" alt="user" referrerPolicy="no-referrer" />
                  ))}
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-[#1A1A1A] flex items-center justify-center text-[8px] font-bold text-white"
                    style={{ backgroundColor: primaryColor }}
                  >+842</div>
                </div>
              </div>

              <div className="flex items-center gap-6 mb-8">
                <div 
                  className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl"
                  style={{ 
                    background: `linear-gradient(to bottom right, ${primaryColor}, ${primaryColor}CC)`,
                    boxShadow: `0 20px 40px ${primaryColor}66` 
                  }}
                >
                  <ShoppingCart className="text-white w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-white font-black text-3xl tracking-tighter leading-none mb-2">Teste do Lucas</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                      {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                    </div>
                    <span className="text-white/40 text-[10px] font-bold uppercase">4.9/5 (1.2k reviews)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-end gap-3">
                  <p className="font-black text-5xl tracking-tighter" style={{ color: primaryColor }}>R$ 1,00</p>
                  <p className="text-white/20 line-through text-xl font-bold mb-1">R$ 97,00</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <p className="text-white/60 text-xs leading-relaxed italic">
                    "O melhor investimento que já fiz este ano. O suporte é incrível e o conteúdo superou todas as minhas expectativas!"
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <img src="https://picsum.photos/seed/jane/24/24" className="w-6 h-6 rounded-full" alt="avatar" referrerPolicy="no-referrer" />
                    <span className="text-white font-bold text-[10px] uppercase">Mariana Silva</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Satisfaction Seal */}
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="w-12 h-12 rounded-full border-2 border-yellow-500/30 flex items-center justify-center">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-[#1A1A1A] font-black text-[10px]">7D</div>
            </div>
            <div>
              <p className="text-white font-bold text-xs uppercase tracking-wider">Garantia Incondicional</p>
              <p className="text-white/40 text-[10px]">7 dias para testar ou seu dinheiro de volta.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Form */}
        <div className="lg:col-span-7">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[3rem] p-10 shadow-2xl h-full flex flex-col min-h-[600px]"
          >
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8 flex-1 flex flex-col"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="text-white w-8 h-8 rounded-xl flex items-center justify-center font-black shadow-lg"
                        style={{ backgroundColor: primaryColor, boxShadow: `0 4px 12px ${primaryColor}33` }}
                      >1</div>
                      <h2 className="text-[#1A1A1A] font-black uppercase text-sm tracking-widest">Dados Pessoais</h2>
                    </div>
                    <span className="text-[10px] font-bold uppercase flex items-center gap-1" style={{ color: primaryColor }}>
                      <Lock className="w-3 h-3" /> Seguro
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[#1A1A1A] text-[10px] font-black uppercase ml-1 opacity-40">Nome Completo</label>
                      <div className="relative group">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-transform group-focus-within:scale-110" style={{ color: primaryColor }} />
                        <input 
                          type="text" 
                          placeholder="Como quer ser chamado?"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full bg-[#F9F9F9] border-2 border-transparent rounded-2xl py-4 pl-14 pr-6 text-sm font-medium focus:bg-white outline-none transition-all placeholder:text-[#CCCCCC]"
                          style={{ borderColor: 'transparent' }}
                          onFocus={(e) => e.target.style.borderColor = primaryColor}
                          onBlur={(e) => e.target.style.borderColor = 'transparent'}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[#1A1A1A] text-[10px] font-black uppercase ml-1 opacity-40">E-mail</label>
                      <div className="relative group">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-transform group-focus-within:scale-110" style={{ color: primaryColor }} />
                        <input 
                          type="email" 
                          placeholder="seu@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full bg-[#F9F9F9] border-2 border-transparent rounded-2xl py-4 pl-14 pr-6 text-sm font-medium focus:bg-white outline-none transition-all placeholder:text-[#CCCCCC]"
                          onFocus={(e) => e.target.style.borderColor = primaryColor}
                          onBlur={(e) => e.target.style.borderColor = 'transparent'}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[#1A1A1A] text-[10px] font-black uppercase ml-1 opacity-40">CPF</label>
                      <div className="relative group">
                        <IdCard className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-transform group-focus-within:scale-110" style={{ color: primaryColor }} />
                        <input 
                          type="text" 
                          placeholder="000.000.000-00"
                          value={formData.cpf}
                          onChange={(e) => handleInputChange('cpf', e.target.value)}
                          className="w-full bg-[#F9F9F9] border-2 border-transparent rounded-2xl py-4 pl-14 pr-6 text-sm font-medium focus:bg-white outline-none transition-all placeholder:text-[#CCCCCC]"
                          onFocus={(e) => e.target.style.borderColor = primaryColor}
                          onBlur={(e) => e.target.style.borderColor = 'transparent'}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-8">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={!formData.name || !formData.email || !formData.cpf}
                      onClick={() => setStep(2)}
                      className="w-full text-white rounded-[2rem] py-6 font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-2xl transition-all relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: primaryColor, boxShadow: `0 20px 40px ${primaryColor}66` }}
                    >
                      Próximo Passo
                      <ChevronRight className="w-6 h-6" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8 flex-1 flex flex-col"
                >
                  <div className="flex items-center gap-4">
                    <button onClick={() => setStep(1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <ArrowLeft className="w-5 h-5" style={{ color: primaryColor }} />
                    </button>
                    <div className="flex items-center gap-3">
                      <div 
                        className="text-white w-8 h-8 rounded-xl flex items-center justify-center font-black shadow-lg"
                        style={{ backgroundColor: primaryColor, boxShadow: `0 4px 12px ${primaryColor}33` }}
                      >2</div>
                      <h2 className="text-[#1A1A1A] font-black uppercase text-sm tracking-widest">Forma de Pagamento</h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {/* PIX */}
                    <button 
                      onClick={() => handlePaymentSelect('pix')}
                      className="w-full border-2 border-[#F0F0F0] rounded-[2rem] p-6 flex items-center justify-between bg-white relative overflow-hidden group transition-all"
                      style={{ borderColor: '#F0F0F0' }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = primaryColor}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = '#F0F0F0'}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm" style={{ backgroundColor: `${primaryColor}10` }}>
                          <Zap className="w-6 h-6" style={{ color: primaryColor }} />
                        </div>
                        <div className="text-left">
                          <p className="text-[#1A1A1A] font-black text-sm uppercase">PIX</p>
                          <p className="text-[10px] font-bold" style={{ color: primaryColor }}>Aprovação imediata</p>
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" style={{ color: primaryColor }} />
                    </button>

                    {/* Cartão de Crédito */}
                    <button 
                      onClick={() => handlePaymentSelect('card')}
                      className="w-full border-2 border-[#F0F0F0] rounded-[2rem] p-6 flex items-center justify-between bg-white relative overflow-hidden group transition-all"
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = primaryColor}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = '#F0F0F0'}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm" style={{ backgroundColor: `${primaryColor}10` }}>
                          <CreditCard className="w-6 h-6" style={{ color: primaryColor }} />
                        </div>
                        <div className="text-left">
                          <p className="text-[#1A1A1A] font-black text-sm uppercase">Cartão de Crédito</p>
                          <p className="text-[10px] font-bold" style={{ color: primaryColor }}>Em até 12x sem juros</p>
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" style={{ color: primaryColor }} />
                    </button>

                    {/* Boleto */}
                    <button 
                      onClick={() => handlePaymentSelect('boleto')}
                      className="w-full border-2 border-[#F0F0F0] rounded-[2rem] p-6 flex items-center justify-between bg-white relative overflow-hidden group transition-all"
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = primaryColor}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = '#F0F0F0'}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm" style={{ backgroundColor: `${primaryColor}10` }}>
                          <Barcode className="w-6 h-6" style={{ color: primaryColor }} />
                        </div>
                        <div className="text-left">
                          <p className="text-[#1A1A1A] font-black text-sm uppercase">Boleto Bancário</p>
                          <p className="text-[10px] font-bold" style={{ color: primaryColor }}>Aprovação em até 3 dias</p>
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" style={{ color: primaryColor }} />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8 flex-1 flex flex-col"
                >
                  <div className="flex items-center gap-4">
                    <button onClick={() => setStep(2)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <ArrowLeft className="w-5 h-5" style={{ color: primaryColor }} />
                    </button>
                    <div className="flex items-center gap-3">
                      <div 
                        className="text-white w-8 h-8 rounded-xl flex items-center justify-center font-black shadow-lg"
                        style={{ backgroundColor: primaryColor, boxShadow: `0 4px 12px ${primaryColor}33` }}
                      >3</div>
                      <h2 className="text-[#1A1A1A] font-black uppercase text-sm tracking-widest">
                        {paymentMethod === 'pix' ? 'Finalizar com PIX' : paymentMethod === 'card' ? 'Dados do Cartão' : 'Gerar Boleto'}
                      </h2>
                    </div>
                  </div>

                  {paymentMethod === 'pix' && (
                    <div className="space-y-6 flex flex-col items-center">
                      <div 
                        className="p-8 rounded-[2.5rem] border-2 border-dashed flex flex-col items-center gap-4 w-full max-w-xs mx-auto"
                        style={{ backgroundColor: `${primaryColor}10`, borderColor: `${primaryColor}4D` }}
                      >
                        <QrCode className="w-48 h-48" style={{ color: primaryColor }} />
                        <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: primaryColor }}>Escaneie o QR Code</p>
                      </div>
                      
                      <div className="w-full space-y-3">
                        <p className="text-[#1A1A1A] text-[10px] font-black uppercase ml-1 opacity-40">Código PIX (Copia e Cola)</p>
                        <div className="flex gap-2">
                          <input 
                            readOnly 
                            value="00020126580014br.gov.bcb.pix0136..."
                            className="flex-1 bg-[#F9F9F9] border-2 border-transparent rounded-2xl py-4 px-6 text-xs font-mono outline-none"
                          />
                          <button 
                            className="text-white p-4 rounded-2xl transition-all"
                            style={{ backgroundColor: primaryColor }}
                          >
                            <Copy className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[#1A1A1A] text-[10px] font-black uppercase ml-1 opacity-40">Número do Cartão</label>
                        <div className="relative group">
                          <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: primaryColor }} />
                          <input 
                            type="text" 
                            placeholder="0000 0000 0000 0000"
                            value={formData.cardNumber}
                            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                            className="w-full bg-[#F9F9F9] border-2 border-transparent rounded-2xl py-4 pl-14 pr-6 text-sm font-medium focus:bg-white outline-none transition-all"
                            onFocus={(e) => e.target.style.borderColor = primaryColor}
                            onBlur={(e) => e.target.style.borderColor = 'transparent'}
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[#1A1A1A] text-[10px] font-black uppercase ml-1 opacity-40">Nome no Cartão</label>
                        <div className="relative group">
                          <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: primaryColor }} />
                          <input 
                            type="text" 
                            placeholder="Como está no cartão"
                            value={formData.cardName}
                            onChange={(e) => handleInputChange('cardName', e.target.value)}
                            className="w-full bg-[#F9F9F9] border-2 border-transparent rounded-2xl py-4 pl-14 pr-6 text-sm font-medium focus:bg-white outline-none transition-all"
                            onFocus={(e) => e.target.style.borderColor = primaryColor}
                            onBlur={(e) => e.target.style.borderColor = 'transparent'}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[#1A1A1A] text-[10px] font-black uppercase ml-1 opacity-40">Validade</label>
                        <div className="relative group">
                          <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: primaryColor }} />
                          <input 
                            type="text" 
                            placeholder="MM/AA"
                            value={formData.expiry}
                            onChange={(e) => handleInputChange('expiry', e.target.value)}
                            className="w-full bg-[#F9F9F9] border-2 border-transparent rounded-2xl py-4 pl-14 pr-6 text-sm font-medium focus:bg-white outline-none transition-all"
                            onFocus={(e) => e.target.style.borderColor = primaryColor}
                            onBlur={(e) => e.target.style.borderColor = 'transparent'}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[#1A1A1A] text-[10px] font-black uppercase ml-1 opacity-40">CVV</label>
                        <div className="relative group">
                          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: primaryColor }} />
                          <input 
                            type="text" 
                            placeholder="123"
                            value={formData.cvv}
                            onChange={(e) => handleInputChange('cvv', e.target.value)}
                            className="w-full bg-[#F9F9F9] border-2 border-transparent rounded-2xl py-4 pl-14 pr-6 text-sm font-medium focus:bg-white outline-none transition-all"
                            onFocus={(e) => e.target.style.borderColor = primaryColor}
                            onBlur={(e) => e.target.style.borderColor = 'transparent'}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'boleto' && (
                    <div className="space-y-8 flex flex-col items-center py-10">
                      <div className="bg-[#F9F9F9] p-10 rounded-[2.5rem] flex flex-col items-center gap-6 w-full text-center">
                        <Barcode className="w-32 h-32 text-[#1A1A1A] opacity-20" />
                        <div>
                          <p className="text-[#1A1A1A] font-black text-xl uppercase tracking-tighter">Boleto Gerado!</p>
                          <p className="text-[#666666] text-xs mt-2">Vencimento em 3 dias úteis.</p>
                        </div>
                        <button className="flex items-center gap-2 font-bold text-sm hover:underline" style={{ color: primaryColor }}>
                          <Download className="w-4 h-4" /> Baixar PDF do Boleto
                        </button>
                      </div>
                      
                      <div className="w-full space-y-3">
                        <p className="text-[#1A1A1A] text-[10px] font-black uppercase ml-1 opacity-40">Linha Digitável</p>
                        <div className="flex gap-2">
                          <input 
                            readOnly 
                            value="34191.79001 01043.510047 91020.150008..."
                            className="flex-1 bg-[#F9F9F9] border-2 border-transparent rounded-2xl py-4 px-6 text-xs font-mono outline-none"
                          />
                          <button 
                            className="text-white p-4 rounded-2xl transition-all"
                            style={{ backgroundColor: primaryColor }}
                          >
                            <Copy className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-auto pt-8">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isProcessing}
                      onClick={handleFinalize}
                      className="w-full text-white rounded-[2rem] py-6 font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-2xl transition-all relative overflow-hidden group disabled:opacity-80"
                      style={{ backgroundColor: primaryColor, boxShadow: `0 20px 40px ${primaryColor}66` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                      {isProcessing ? (
                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <ShoppingCart className="w-6 h-6" />
                      )}
                      {isProcessing ? 'Processando...' : paymentMethod === 'pix' ? 'Já realizei o PIX' : paymentMethod === 'card' ? 'Pagar Agora' : 'Concluir Pedido'}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer Trust */}
            <div className="flex flex-col items-center gap-4 mt-8">
              <div className="flex justify-center gap-8 text-[#CCCCCC] text-[9px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#00BFA5]" />
                  Checkout Seguro
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#00BFA5]" />
                  SSL Criptografado
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-[#999999] font-medium">
                <MessageSquare className="w-3 h-3" />
                Precisa de ajuda? <span className="font-bold cursor-pointer hover:underline" style={{ color: primaryColor }}>Fale conosco</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

