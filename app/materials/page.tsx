'use client';

import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function MaterialsMarketplace() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const materialsRef = ref(db, 'materials');
    const unsubscribe = onValue(materialsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMaterials(Object.values(data));
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredMaterials = materials.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen pt-24 pb-20 px-6 bg-slate-950">
      <Navbar />
      
      {/* Background Glows */}
      <div className="glow-sphere top-20 right-1/4 w-[400px] h-[400px] bg-rose-600/10" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-10">
          <div className="space-y-4">
            <h1 className="text-6xl font-black uppercase tracking-tighter leading-none italic">
              Supply <span className="text-gradient-rose">Chain</span>
            </h1>
            <p className="text-slate-500 max-w-lg font-medium">Source industrial-grade raw materials directly from verified local distributors at wholesale rates.</p>
          </div>
          <div className="glass-card flex items-center px-8 py-2 w-full md:w-[450px] border-white/5 shadow-2xl">
            <i className="bx bx-search text-rose-500 mr-4 text-2xl"></i>
            <input 
              type="text" 
              placeholder="Filter materials (Cement, Steel...)" 
              className="bg-transparent border-none outline-none text-white w-full py-5 text-sm font-bold uppercase tracking-widest placeholder:text-slate-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
           {loading ? (
             [1,2,3,4].map(n => <div key={n} className="glass-card h-80 animate-pulse"></div>)
           ) : (
             filteredMaterials.map((mat) => (
               <div key={mat.id} className="glass-card p-10 flex flex-col group hover:-translate-y-2 hover:border-rose-500/30 transition-all duration-500 border-white/5 relative overflow-hidden">
                  <div className="absolute -right-5 -top-5 opacity-5 group-hover:opacity-10 transition-opacity">
                     <i className={`bx ${mat.category === 'Steel' ? 'bx-cube-alt' : 'bx-layer'} text-8xl`}></i>
                  </div>
                  
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 text-3xl text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-lg border border-white/5">
                     <i className={`bx ${
                        mat.category === 'Steel' ? 'bx-radar' : 
                        mat.category === 'Cement' ? 'bx-square-rounded' : 
                        mat.category === 'Paint' ? 'bx-color-fill' : 'bx-grid-alt'
                     }`}></i>
                  </div>
                  
                  <h3 className="font-bold text-xl mb-1 group-hover:text-white transition-colors">{mat.name}</h3>
                  <p className="text-[9px] text-slate-500 font-extrabold uppercase tracking-[0.2em] mb-8">{mat.category}</p>
                  
                  <div className="mt-auto space-y-6">
                     <div className="flex justify-between items-end">
                        <p className="text-2xl font-black text-white tracking-tighter">{mat.price}</p>
                        <span className={`text-[9px] px-2 py-1 rounded-md font-black border uppercase tracking-tighter ${mat.stock === 'In Stock' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-rose-500 border-rose-500/20 bg-rose-500/5'}`}>
                           {mat.stock}
                        </span>
                     </div>
                     <div className="space-y-4 pt-6 border-t border-white/5">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                           <span className="flex items-center gap-1.5"><i className="bx bxs-user-circle text-xs text-rose-500"></i> {mat.supplier}</span>
                           <span className="flex items-center gap-1.5"><i className="bx bx-map-pin text-xs"></i> {mat.location}</span>
                        </div>
                        <button className="w-full btn-secondary !py-3 !text-[10px] !uppercase !tracking-widest !rounded-xl group-hover:!bg-rose-600 group-hover:!border-rose-600 transition-all">
                           Contact Supplier
                        </button>
                     </div>
                  </div>
               </div>
             ))
           )}
        </div>
      </div>
    </main>
  );
}
