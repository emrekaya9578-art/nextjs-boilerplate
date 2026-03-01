"use client";

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

// Supabase bağlantı bilgilerini buraya doğrudan yazıyoruz (En garantisi budur)
// Eğer Vercel'e eklediysen process.env kısımları çalışır, eklemediysen tırnak içine yapıştırabilirsin.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'SENIN_SUPABASE_URL_BURAYA';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_rlvEQkiv52AkPyTJ78-kwQ_zuZL7dtF';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function Home() {
  const [ilanlar, setIlanlar] = useState<any[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    async function verileriGetir() {
      try {
        const { data, error } = await supabase
          .from('ilanlar')
          .select('*')
          .order('eklenme_tarihi', { ascending: false });

        if (error) throw error;
        setIlanlar(data || []);
      } catch (err) {
        console.error("Veri çekme hatası:", err);
      } finally {
        setYukleniyor(false);
      }
    }
    verileriGetir();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Üst Bar / Logo */}
      <header className="bg-blue-900 text-white shadow-xl p-5 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black tracking-tighter leading-none text-white">🚗 UYGUNARABAM</h1>
            <span className="text-[10px] uppercase tracking-[0.2em] opacity-70 mt-1 font-bold text-blue-100">İkinci Elde Güvenin Adresi</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-10 border-b pb-6">
          <h2 className="text-4xl font-extrabold text-gray-800">Güncel İlanlar</h2>
          <p className="text-gray-500 mt-1">Hızlı, güvenilir ve uygun fiyatlı araçlar.</p>
        </div>

        {yukleniyor ? (
          <div className="text-center py-20 text-blue-900 font-bold text-xl">İlanlar Yükleniyor...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ilanlar.map((ilan) => (
              <div key={ilan.id} className="bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group">
                {/* Resim Alanı */}
                <div className="relative overflow-hidden h-60">
                  <img 
                    src={ilan.gorsel_url || 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366'} 
                    alt={ilan.baslik}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-blue-900 text-xs font-black px-4 py-2 rounded-full shadow-sm">
                    {ilan.yil} Model
                  </div>
                  <div className="absolute bottom-4 right-4 bg-blue-600 text-white text-lg font-black px-4 py-1 rounded-xl shadow-lg">
                    {ilan.fiyat}
                  </div>
                </div>

                {/* Bilgiler */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-1 truncate">{ilan.baslik}</h2>
                  <p className="text-gray-400 text-sm mb-4 font-medium italic">{ilan.marka_model || 'Genel Bilgi'}</p>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-2"><span>🛣️</span> <strong>{ilan.km} km</strong></div>
                    <div className="flex items-center gap-2"><span>⛽</span> <strong>{ilan.yakit}</strong></div>
                    <div className="flex items-center gap-2"><span>⚙️</span> <strong>{ilan.vites}</strong></div>
                    <div className="flex items-center gap-2 text-green-700 font-bold"><span>✅</span> {ilan.boya_durumu}</div>
                  </div>

                  <a 
                    href={`https://wa.me/${ilan.whatsapp_no}?text=Merhaba, ${ilan.baslik} ilanınız için uygunarabam.com üzerinden bilgi almak istiyorum.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-green-500 text-white font-black py-4 rounded-2xl hover:bg-green-600 transition-all shadow-md"
                  >
                    💬 WhatsApp ile Hemen Bağlan
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {!yukleniyor && ilanlar.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
             <h3 className="text-xl font-bold text-gray-800">Henüz İlan Bulunmuyor</h3>
             <p className="text-gray-400">Supabase'den ilan eklediğinizde burada görünecek.</p>
          </div>
        )}
      </main>
      
      <footer className="bg-gray-900 text-gray-500 text-center p-12 mt-20">
        <h2 className="text-white text-xl font-black mb-2">UYGUNARABAM.COM</h2>
        <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">© 2026 Tüm Hakları Saklıdır.</p>
      </footer>
    </div>
  );
}
