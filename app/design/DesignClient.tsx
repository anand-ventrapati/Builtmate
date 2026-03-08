'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

import { Suspense } from 'react';

export default function DesignStudioContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialPrompt = searchParams.get('prompt') || '';
  
  const [prompt, setPrompt] = useState(initialPrompt);
  const [plotSize, setPlotSize] = useState('1200');
  const [floors, setFloors] = useState('1');
  const [bhk, setBhk] = useState('2');
  const [style, setStyle] = useState('Modern');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  // Auto-trigger if prompt from landing page
  useEffect(() => {
    if (initialPrompt && !result && !loading) {
      handleGenerate();
    }
  }, [initialPrompt]);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/generate-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${style} house design on a ${plotSize} sqft plot, with ${floors} floors and ${bhk} BHK. ${prompt}`
        })
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      // Fallback dummy data
      setResult({
        description: "A stunning architecture concept blending glass and natural stone. The layout prioritizes ventilation and open-plan living.",
        features: ["Floor-to-ceiling windows", "Double-height living room", "Sustainable materials", "Smart energy control"],
        materials: ["TEMPERED GLASS", "TEXTURED CONCRETE", "TEAK WOOD"],
        estimatedBudget: "₹35L - ₹55L"
      });
      setError('AI service busy. Showing fallback design concept.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-20 px-6 bg-slate-950">
      <Navbar />
      
      {/* Background Glows */}
      <div className="glow-sphere top-[-100px] left-[-100px] w-[500px] h-[500px] bg-indigo-600/20" />
      <div className="glow-sphere bottom-20 right-20 w-[400px] h-[400px] bg-emerald-600/10" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
           <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">
             AI Design <span className="text-gradient">Studio</span>
           </h1>
           <p className="text-slate-500 max-w-2xl mx-auto font-medium">
             Turn your imagination into architectural blueprints using our ultra-advanced AI engine.
           </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* Sidebar Inputs */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-10 space-y-8 bg-slate-900/60 sticky top-32">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Dimensions & Scale</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400">Plot Size (SqFt)</p>
                    <input 
                      type="number" 
                      className="w-full bg-slate-950 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-indigo-500/50 transition-all font-bold"
                      value={plotSize}
                      onChange={(e) => setPlotSize(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400">Total Floors</p>
                    <select 
                      className="w-full bg-slate-950 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-indigo-500/50 transition-all font-bold"
                      value={floors}
                      onChange={(e) => setFloors(e.target.value)}
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Living Space</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400">BHK</p>
                    <select 
                      className="w-full bg-slate-950 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-indigo-500/50 transition-all font-bold"
                      value={bhk}
                      onChange={(e) => setBhk(e.target.value)}
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4+</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400">Aesthetic</p>
                    <select 
                      className="w-full bg-slate-950 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-indigo-500/50 transition-all font-bold"
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                    >
                      <option>Modern</option>
                      <option>Minimalist</option>
                      <option>Industrial</option>
                      <option>Traditional</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400">Detail your vision</p>
                <textarea 
                  placeholder="e.g. A garden workspace, rooftop terrace, glass walls..."
                  className="w-full bg-slate-950 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-indigo-500/50 h-32 transition-all font-medium text-sm"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <button 
                onClick={handleGenerate}
                disabled={loading}
                className="w-full btn-primary py-5 uppercase tracking-widest font-black text-sm flex items-center justify-center gap-3 active:scale-95"
              >
                {loading ? (
                  <>
                    <i className="bx bx-loader-alt animate-spin text-xl"></i>
                    Thinking...
                  </>
                ) : (
                  <>
                    <i className="bx bxs-magic-wand text-xl"></i>
                    Generate AI Design
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-2 space-y-10">
             {loading ? (
                <div className="glass-card h-[600px] flex flex-col items-center justify-center text-center p-20 animate-pulse border-indigo-500/20">
                   <div className="w-24 h-24 rounded-full bg-indigo-600/20 flex items-center justify-center mb-10 border border-indigo-500/30">
                      <i className="bx bx-atom text-5xl text-indigo-500 animate-spin-slow"></i>
                   </div>
                   <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">AI Architect is <span className="text-gradient">thinking</span>...</h3>
                   <p className="text-slate-500 font-medium">Drafting floor plans, material specs, and cost optimizations for your dream project.</p>
                </div>
             ) : result ? (
               <div className="space-y-10 animate-fade-in">
                  <div className="glass-card overflow-hidden bg-gradient-to-br from-slate-900 to-indigo-950/20">
                     <div className="aspect-video relative group">
                        <img 
                          src="https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&q=80&w=800" 
                          className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                        <div className="absolute top-10 left-10">
                           <span className="bg-indigo-600 text-white text-[10px] font-black px-4 py-2 rounded-full tracking-widest uppercase shadow-lg shadow-indigo-500/40">Concept Ready</span>
                        </div>
                     </div>
                     <div className="p-12 relative -mt-32 z-10">
                        <h2 className="text-4xl font-black mb-6 uppercase tracking-tighter">Architectural <span className="text-gradient">Description</span></h2>
                        <p className="text-slate-300 text-xl leading-relaxed font-light italic bg-slate-950/50 p-8 rounded-3xl border border-white/5 backdrop-blur-md">
                          "{result.description}"
                        </p>
                        
                        {error && <p className="mt-6 text-rose-400 text-xs font-bold uppercase tracking-widest"><i className="bx bx-error-circle"></i> {error}</p>}
                     </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                     <div className="glass-card p-10 bg-slate-900/40">
                        <h3 className="text-xl font-black mb-8 uppercase tracking-tighter border-b border-white/5 pb-4">Key <span className="text-gradient">Features</span></h3>
                        <ul className="space-y-4">
                           {result.features.map((f: string, i: number) => (
                             <li key={i} className="flex items-center gap-4 text-slate-300 font-medium">
                                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20">
                                   <i className="bx bx-check"></i>
                                </div>
                                {f}
                             </li>
                           ))}
                        </ul>
                     </div>

                     <div className="glass-card p-10 bg-slate-900/40 border-indigo-500/20">
                        <h3 className="text-xl font-black mb-8 uppercase tracking-tighter border-b border-white/5 pb-4">Budgetary <span className="text-gradient">HUD</span></h3>
                        <div className="space-y-8">
                           <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 font-bold">Estimated Cost Range</p>
                              <p className="text-4xl font-black text-indigo-400 tracking-tighter leading-none">{result.estimatedBudget}</p>
                           </div>
                           <div className="flex flex-wrap gap-2">
                              {result.materials.map((m: string, i: number) => (
                                <span key={i} className="bg-white/5 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-white/5 text-slate-400">
                                   {m}
                                </span>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="glass-card p-10 bg-gradient-to-r from-violet-600/10 to-indigo-600/10 border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative">
                     <div className="absolute -right-10 -top-10 w-48 h-48 bg-indigo-600/20 blur-3xl rounded-full" />
                     <div className="relative z-10">
                        <h3 className="text-3xl font-black mb-2 uppercase tracking-tighter">Ready to <span className="text-gradient">Build</span>?</h3>
                        <p className="text-slate-400 font-medium">We've found builders specializing in this architectural style.</p>
                     </div>
                     <Link href="/builders" prefetch={false} className="btn-primary relative z-10 whitespace-nowrap px-12 group">
                        Match with Builders
                        <i className="bx bx-right-arrow-alt ml-2 group-hover:translate-x-2 transition-transform"></i>
                     </Link>
                  </div>
               </div>
             ) : (
                <div className="glass-card h-[600px] flex flex-col items-center justify-center text-center p-20 border-dashed border-white/5">
                   <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center mb-8 border border-white/5 shadow-2xl">
                      <i className="bx bx-pencil text-5xl text-slate-700"></i>
                   </div>
                   <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">Draft Your <span className="text-gradient">Legacy</span></h3>
                   <p className="text-slate-500 max-w-md font-medium leading-relaxed">Adjust your preferences on the left and trigger the AI Architect to generate your bespoke construction concept.</p>
                </div>
             )}
          </div>
        </div>
      </div>
    </main>
  );
}


