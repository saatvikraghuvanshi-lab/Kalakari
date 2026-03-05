'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Heart, User, X, Instagram, Facebook, 
  ChevronRight, MessageCircle, Ruler, Scissors, ArrowLeft, Trash2, Check 
} from 'lucide-react';

// --- TYPES & INTERFACES ---
interface Product {
  id: number;
  category: string;
  fabric: string;
  color: string;
  type: 'ready' | 'custom';
  size?: string;
  measurements?: { bust: string; waist: string; hips: string; sleeves: string; length: string; };
  blouse?: { cut: string; buttons: string; };
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
}

// --- CONSTANTS ---
const SAMPLE_IMAGES = [
  "https://cdn.cosmos.so/d87eaebb-5652-4e0c-8ec4-7214d4d45097?format=jpeg",
  "https://cdn.cosmos.so/c236e60f-4d49-46cc-a98e-ee06d0e845d8?format=jpeg",
  "https://media.samyakk.in/pub/media/catalog/product/b/e/beige-and-gold-dual-tone-tissue-designer-saree-with-thread-work-and-unstitched-blouse-gh1568-a.jpg"
];

const FABRICS = ['Silk', 'Georgette', 'Organza', 'Chiffon', 'Chanderi', 'Raw Silk', 'Cotton'];
const COLORS = ['Champagne Gold', 'Midnight Blue', 'Emerald Green', 'Ruby Red', 'Ivory'];

export default function KalakariBoutique() {
  // Navigation State: 'home' | 'custom' | 'readymade' | 'samples' | 'checkout'
  const [view, setView] = useState<'home' | 'custom' | 'readymade' | 'samples' | 'checkout'>('home');
  const [checkoutStep, setCheckoutStep] = useState<'contact' | 'address'>('contact');
  
  // App Data
  const [cart, setCart] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [user, setUser] = useState<UserProfile>({ name: '', email: '', phone: '' });
  const [address, setAddress] = useState({ pincode: '', city: '', state: '', house: '' });

  // UI States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Saree');

  // Bespoke Configurator Selection
  const [selections, setSelections] = useState<Product>({
    id: 0,
    category: 'Saree',
    fabric: 'Silk',
    color: 'Champagne Gold',
    type: 'custom',
    measurements: { bust: '', waist: '', hips: '', sleeves: '', length: '' },
    blouse: { cut: 'Round Cut', buttons: 'Back' }
  });

  // --- LOGIC HANDLERS ---
  const handleWhatsAppCheckout = () => {
    const whatsappNumber = "917991464638";
    let msg = `*NEW ORDER - KALAKARI*\n\n`;
    msg += `*CUSTOMER*\nName: ${user.name}\nPhone: ${user.phone}\nEmail: ${user.email}\n\n`;
    msg += `*ADDRESS*\n${address.house}, ${address.city}, ${address.state} - ${address.pincode}\n\n`;
    msg += `*ORDER DETAILS*\n`;
    cart.forEach((item, i) => {
      msg += `\n${i+1}. ${item.category} (${item.type})\n   Fabric: ${item.fabric}\n   Color: ${item.color}\n`;
      if (item.type === 'custom') {
        msg += `   Blouse: ${item.blouse?.cut}, Buttons: ${item.blouse?.buttons}\n`;
      }
    });
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const addToCart = (product: Product) => {
    setCart([...cart, { ...product, id: Date.now() }]);
    setIsCartOpen(true);
  };

  const toggleWishlist = (product: Product) => {
    if (wishlist.find(i => i.id === product.id)) {
      setWishlist(wishlist.filter(i => i.id !== product.id));
    } else {
      setWishlist([...wishlist, { ...product, id: Date.now() }]);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2926] font-sans selection:bg-[#B19470] selection:text-white">
      
      {/* --- NAVIGATION --- */}
      <nav className="sticky top-0 z-[100] bg-white/90 backdrop-blur-md px-6 md:px-12 py-5 flex justify-between items-center border-b border-stone-100">
        <div className="flex items-baseline gap-8">
          <span onClick={() => setView('home')} className="font-serif text-2xl font-black italic tracking-tighter cursor-pointer">KALAKARI</span>
          <div className="hidden md:flex gap-6 text-[10px] font-bold uppercase tracking-widest text-stone-400">
            <div className="relative group">
              <button className="hover:text-black italic lowercase font-sans">collections</button>
              <div className="absolute top-full left-0 hidden group-hover:block bg-white shadow-xl p-4 min-w-[140px] rounded-xl border border-stone-50">
                <button onClick={() => setView('readymade')} className="block w-full text-left py-2 hover:text-black">Ready-made</button>
                <button onClick={() => setView('custom')} className="block w-full text-left py-2 hover:text-black">Bespoke</button>
              </div>
            </div>
            <button onClick={() => setView('samples')} className="hover:text-black italic lowercase font-sans">samples</button>
            <button className="hover:text-black italic lowercase font-sans">our story</button>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <User size={18} className="text-stone-400 hover:text-black cursor-pointer" onClick={() => setShowUserModal(true)} />
          <div className="relative cursor-pointer" onClick={() => setShowWishlist(true)}>
            <Heart size={18} className="text-stone-400 hover:text-black" />
            {wishlist.length > 0 && <span className="absolute -top-1.5 -right-1.5 bg-[#B19470] text-white text-[7px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">{wishlist.length}</span>}
          </div>
          <button onClick={() => setIsCartOpen(true)} className="relative">
            <ShoppingBag size={18} />
            {cart.length > 0 && <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>}
          </button>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        
        {/* VIEW: HOME */}
        {view === 'home' && (
          <motion.section key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-6 md:px-20 py-16 text-center">
            <h1 className="font-serif text-5xl md:text-[100px] leading-tight tracking-tighter mb-12">
              Your Boutique, <br/> <span className="italic text-stone-300 underline decoration-1">Your Way.</span>
            </h1>
            <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-center">
              <img src={SAMPLE_IMAGES[0]} className="w-full md:w-1/2 h-[60vh] object-cover rounded-2xl shadow-xl" alt="Luxe 1" />
              <img src={SAMPLE_IMAGES[1]} className="w-full md:w-1/3 h-[50vh] object-cover rounded-2xl shadow-xl md:mt-24" alt="Luxe 2" />
              <button 
                onClick={() => setView('custom')}
                className="absolute bg-white text-black px-12 py-5 rounded-full font-bold uppercase text-xs tracking-widest shadow-2xl hover:bg-black hover:text-white transition-all transform hover:scale-105"
              >
                Shop Now
              </button>
            </div>
          </motion.section>
        )}

        {/* VIEW: CUSTOMIZER */}
        {view === 'custom' && (
          <motion.section key="custom" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-16">
            <div className="space-y-10">
              <div className="flex items-center gap-4">
                <button onClick={() => setView('home')} className="p-2 hover:bg-stone-100 rounded-full"><ArrowLeft size={18}/></button>
                <h2 className="font-serif text-4xl italic">Bespoke Designer</h2>
              </div>
              
              <div className="flex gap-3 overflow-x-auto pb-2">
                {['Saree', 'Lehenga', 'Kurta Set'].map(cat => (
                  <button key={cat} onClick={() => {setActiveCategory(cat); setSelections({...selections, category: cat})}} className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${activeCategory === cat ? 'bg-black text-white' : 'bg-white border-stone-200 text-stone-400'}`}>
                    {cat}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block mb-4">Choice of Fabric</label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {FABRICS.map(f => (
                    <button key={f} onClick={() => setSelections({...selections, fabric: f})} className={`py-3 rounded-xl text-[10px] font-bold border transition-all ${selections.fabric === f ? 'bg-stone-100 border-black' : 'border-stone-100'}`}>{f}</button>
                  ))}
                </div>
              </div>

              <div className="bg-stone-50 p-8 rounded-3xl space-y-6">
                <div className="flex items-center gap-2 font-serif italic text-xl border-b border-stone-200 pb-4"><Ruler size={18}/> Measurement Guide</div>
                <div className="grid grid-cols-2 gap-4">
                  {['bust', 'waist', 'hips', 'sleeves', 'length'].map(m => (
                    <div key={m}>
                      <label className="text-[9px] font-bold uppercase text-stone-400 mb-1 block">{m}</label>
                      <input type="number" placeholder="inches" className="w-full p-4 rounded-xl border-none shadow-sm text-sm outline-none focus:ring-1 focus:ring-black" onChange={(e) => setSelections({...selections, measurements: {...selections.measurements!, [m]: e.target.value}})} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block"><Scissors size={14} className="inline mr-1"/> Tailoring Details</label>
                <div className="grid grid-cols-2 gap-4">
                  <select className="p-4 bg-white border border-stone-100 rounded-xl text-xs font-bold outline-none" onChange={(e) => setSelections({...selections, blouse: {...selections.blouse!, cut: e.target.value}})}>
                    <option>Front Cut: Round</option>
                    <option>Front Cut: V-Neck</option>
                    <option>Front Cut: Sweetheart</option>
                  </select>
                  <select className="p-4 bg-white border border-stone-100 rounded-xl text-xs font-bold outline-none" onChange={(e) => setSelections({...selections, blouse: {...selections.blouse!, buttons: e.target.value}})}>
                    <option>Buttons: Back</option>
                    <option>Buttons: Front</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => addToCart(selections)} className="flex-1 bg-black text-white py-6 rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-transform">Add to Bag</button>
                <button onClick={() => toggleWishlist(selections)} className="p-6 bg-white border border-stone-100 rounded-2xl text-stone-300 hover:text-red-400 transition-colors"><Heart size={20}/></button>
              </div>
            </div>
            
            <div className="hidden lg:block relative">
               <img src={SAMPLE_IMAGES[2]} className="w-full h-[85vh] object-cover rounded-[3rem] shadow-2xl sticky top-32" alt="Preview" />
            </div>
          </motion.section>
        )}

        {/* VIEW: CHECKOUT */}
        {view === 'checkout' && (
          <motion.section key="checkout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen grid lg:grid-cols-2">
            <div className="bg-stone-50 p-12 md:p-20 border-r border-stone-200">
              <span className="font-serif text-3xl font-black italic block mb-20">KALAKARI</span>
              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400">Your Selection</h3>
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                    <div>
                      <p className="font-bold text-sm uppercase">{item.category}</p>
                      <p className="text-[10px] text-stone-400 uppercase">{item.fabric} • {item.color}</p>
                    </div>
                    <Trash2 size={16} className="text-stone-300 cursor-pointer" onClick={() => setCart(cart.filter(i => i.id !== item.id))} />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-12 md:p-20 bg-white">
              <div className="max-w-md mx-auto h-full flex flex-col justify-center">
                <div className="flex gap-4 mb-16 text-[10px] font-black uppercase tracking-widest items-center">
                  <span className={checkoutStep === 'contact' ? 'text-black underline decoration-2' : 'text-stone-300'}>Contact</span>
                  <ChevronRight size={12} className="text-stone-200"/>
                  <span className={checkoutStep === 'address' ? 'text-black underline decoration-2' : 'text-stone-300'}>Address</span>
                </div>

                {checkoutStep === 'contact' ? (
                  <div className="space-y-4">
                    <div className="bg-stone-50 p-4 rounded-2xl">
                      <label className="text-[9px] font-bold text-stone-400 uppercase">Full Name</label>
                      <input type="text" placeholder="Ayesha Kapoor" className="w-full bg-transparent outline-none font-bold" value={user.name} onChange={(e)=>setUser({...user, name: e.target.value})} />
                    </div>
                    <div className="bg-stone-50 p-4 rounded-2xl">
                      <label className="text-[9px] font-bold text-stone-400 uppercase">Email</label>
                      <input type="email" placeholder="ayesha@email.com" className="w-full bg-transparent outline-none font-bold" value={user.email} onChange={(e)=>setUser({...user, email: e.target.value})} />
                    </div>
                    <div className="bg-stone-50 p-4 rounded-2xl">
                      <label className="text-[9px] font-bold text-stone-400 uppercase">Mobile Number</label>
                      <input type="tel" placeholder="+91" className="w-full bg-transparent outline-none font-bold" value={user.phone} onChange={(e)=>setUser({...user, phone: e.target.value})} />
                    </div>
                    <button onClick={() => setCheckoutStep('address')} className="w-full bg-black text-white py-6 rounded-2xl font-bold uppercase text-[10px] tracking-widest mt-8 shadow-xl">Continue to Shipping</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button onClick={() => setCheckoutStep('contact')} className="flex items-center gap-2 text-[10px] font-black text-stone-300 uppercase mb-4 hover:text-black transition-colors"><ArrowLeft size={14}/> Change Details</button>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-stone-50 p-4 rounded-2xl">
                        <label className="text-[9px] font-bold text-stone-400 uppercase">Pincode</label>
                        <input type="text" className="w-full bg-transparent outline-none font-bold" onChange={(e)=>setAddress({...address, pincode: e.target.value})} />
                      </div>
                      <div className="bg-stone-50 p-4 rounded-2xl">
                        <label className="text-[9px] font-bold text-stone-400 uppercase">City</label>
                        <input type="text" className="w-full bg-transparent outline-none font-bold" onChange={(e)=>setAddress({...address, city: e.target.value})} />
                      </div>
                    </div>
                    <div className="bg-stone-50 p-4 rounded-2xl">
                      <label className="text-[9px] font-bold text-stone-400 uppercase">House Address</label>
                      <textarea rows={3} className="w-full bg-transparent outline-none font-bold resize-none" onChange={(e)=>setAddress({...address, house: e.target.value})} />
                    </div>
                    <button onClick={handleWhatsAppCheckout} className="w-full bg-green-600 text-white py-6 rounded-2xl font-bold uppercase text-[10px] tracking-widest mt-8 flex items-center justify-center gap-3 shadow-xl hover:bg-green-700 transition-colors">
                      <MessageCircle size={18}/> Pay & Order via WhatsApp
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        )}

      </AnimatePresence>

      {/* --- SIDEBARS & MODALS --- */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[200]">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }} className="absolute right-0 top-0 h-full w-full max-w-md bg-white p-10 flex flex-col shadow-2xl">
              <div className="flex justify-between items-center mb-12 border-b border-stone-100 pb-6">
                <h2 className="font-serif text-3xl italic">The Bag ({cart.length})</h2>
                <X className="cursor-pointer text-stone-300 hover:text-black" onClick={() => setIsCartOpen(false)} />
              </div>
              <div className="flex-grow overflow-y-auto space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center text-stone-300 uppercase text-[9px] tracking-[0.2em] py-40">Your bag is empty</div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center bg-stone-50 p-6 rounded-2xl border border-stone-100">
                       <div>
                         <p className="font-bold uppercase text-[10px] tracking-widest">{item.category}</p>
                         <p className="text-[10px] text-stone-400">{item.fabric} • Custom Made</p>
                       </div>
                       <Trash2 size={16} className="text-stone-300 hover:text-red-400 cursor-pointer" onClick={() => setCart(cart.filter(i => i.id !== item.id))} />
                    </div>
                  ))
                )}
              </div>
              {cart.length > 0 && (
                <button onClick={() => {setView('checkout'); setIsCartOpen(false)}} className="w-full bg-black text-white py-6 rounded-2xl font-bold uppercase text-[10px] tracking-[0.3em] mt-8">Check out now</button>
              )}
            </motion.div>
          </div>
        )}

        {showUserModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowUserModal(false)} className="absolute inset-0 bg-black/40 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-md p-12 rounded-[3rem] shadow-2xl">
              <X className="absolute top-8 right-8 cursor-pointer text-stone-200 hover:text-black" onClick={() => setShowUserModal(false)} />
              <h2 className="font-serif text-3xl italic mb-8">Identification</h2>
              <div className="space-y-4">
                <input type="text" placeholder="Full Name" className="w-full p-5 bg-stone-50 rounded-2xl outline-none text-sm" onChange={(e)=>setUser({...user, name: e.target.value})} />
                <input type="email" placeholder="Email Address" className="w-full p-5 bg-stone-50 rounded-2xl outline-none text-sm" onChange={(e)=>setUser({...user, email: e.target.value})} />
                <button className="w-full bg-black text-white py-5 rounded-2xl font-bold uppercase text-[10px] tracking-widest mt-4" onClick={()=>setShowUserModal(false)}>Save Identity</button>
              </div>
            </motion.div>
          </div>
        )}

        {showWishlist && (
          <div className="fixed inset-0 z-[300] flex items-end md:items-center justify-center p-0 md:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setShowWishlist(false)} className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="relative bg-[#FDFBF7] w-full max-w-2xl p-10 rounded-t-[3rem] md:rounded-[3rem] shadow-2xl max-h-[80vh] overflow-y-auto">
              <h2 className="font-serif text-3xl italic mb-10 flex items-center gap-2">Wishlist <Heart size={24} className="fill-red-400 text-red-400"/></h2>
              {wishlist.length === 0 ? (
                <p className="text-stone-300 py-10 uppercase text-[10px] tracking-widest text-center">No favorites yet</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wishlist.map(item => (
                    <div key={item.id} className="bg-white p-6 rounded-3xl border border-stone-100 flex justify-between items-center">
                       <p className="font-bold text-xs uppercase">{item.category}</p>
                       <button onClick={() => addToCart(item)} className="p-3 bg-stone-50 rounded-full hover:bg-black hover:text-white transition-colors"><ShoppingBag size={14}/></button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- FOOTER --- */}
      <footer className="mt-20 px-10 py-16 bg-white border-t border-stone-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left">
            <div className="font-serif text-2xl font-black italic mb-4">KALAKARI</div>
            <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest">Handcrafted in Rajasthan, Delivered Globally.</p>
          </div>
          <div className="flex gap-10 text-[9px] font-black uppercase tracking-[0.2em] text-stone-400">
            <button className="hover:text-black">Terms</button>
            <button className="hover:text-black">Privacy</button>
            <button className="hover:text-black">Support</button>
          </div>
          <div className="flex gap-4">
            <a href="https://instagram.com/hajelachhaya" target="_blank" className="p-4 bg-stone-50 rounded-full hover:bg-black hover:text-white transition-all"><Instagram size={18}/></a>
            <a href="#" className="p-4 bg-stone-50 rounded-full hover:bg-black hover:text-white transition-all"><Facebook size={18}/></a>
          </div>
        </div>
      </footer>

    </div>
  );
}