import React, { useState } from 'react';
import { 
  HeartPulse, 
  BookOpen, 
  FileText, 
  ExternalLink, 
  Stethoscope, 
  Droplets, 
  ChevronRight,
  GraduationCap
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('klinik');

  const alarms = [
    {
      title: "Yüksek TMP (Transmembran Basınç)",
      cause: "Diyalizör membranının pıhtılaşması veya aşırı ultrafiltrasyon.",
      action: "Filtrede pıhtı kontrolü yap, UF hızını gözden geçir, gerekirse heparinizasyonu değerlendir.",
      level: "Yüksek Risk"
    },
    {
      title: "Venöz Basınç Yüksekliği",
      cause: "Venöz iğnede tıkanma, sette kıvrılma veya damar spazmı.",
      action: "Venöz hattı kıvrılmalara karşı tara, iğne pozisyonunu ve fistül debisini kontrol et.",
      level: "Acil"
    },
    {
      title: "Hava Dedektörü Alarmı",
      cause: "Venöz hatta mikro kabarcık ya da hazne seviyesinin düşmesi.",
      action: "Kan pompasını durdur, hattı klemple, hastaya hava gitmediğinden emin ol ve hazneyi doldur.",
      level: "Kritik"
    }
  ];

  const clinicalTips = [
    {
      topic: "Arteriovenöz Fistül (AVF) Muayenesi",
      detail: "Her diyaliz öncesi tril (palpasyon) ve üfürüm (oskültasyon) kontrol edilir. Asla o koldan tansiyon ölçülmez ve kan alınmaz."
    },
    {
      topic: "Akut Hipotansiyon Yönetimi",
      detail: "Ultrafiltrasyon derhal durdurulur, hasta Trendelenburg pozisyonuna alınır ve hekim istemiyle %0.9 NaCl puşe edilir."
    },
    {
      topic: "Antikoagülasyon (Standart Heparin)",
      detail: "Bolus doz genellikle bağlantı öncesi verilir, kanama riski olan hastalarda heparinsiz (serum yıkamalı) protokol uygulanır."
    },
    {
      topic: "Diyaliz Yeterliliği (Kt/V ve URR)",
      detail: "Hedef Kt/V minimum 1.2 (ideal 1.4+), Üre Azalma Oranı (URR) ise en az %65 seviyesinde olmalıdır."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-cyan-500/10 p-2 rounded-xl border border-cyan-500/20 text-cyan-400">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                AFSÜ Diyaliz Team
              </span>
              <p className="text-[11px] text-slate-400 -mt-1">Afyonkarahisar Sağlık Bilimleri Üniversitesi</p>
            </div>
          </div>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 px-3.5 py-1.5 rounded-full border border-slate-700 transition"
          >
            <span>Instagram</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      <section className="relative px-4 pt-12 pb-10 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/50 text-cyan-300 text-xs font-medium mb-6">
          <Droplets className="w-3.5 h-3.5 text-cyan-400" />
          <span>Diyaliz Teknikerleri & Öğrenci Platformu</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          Klinik Uygulamalar, <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
            Pratik Rehberler ve Ders Notları
          </span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mb-8">
          AFSÜ Diyaliz topluluğu için hazırlanan bu platformda; hemodiyaliz makineleri, alarm yönetimi, staj defteri ipuçları ve KPSS kaynaklarına tek tıkla ulaşabilirsiniz.
        </p>

        <div className="flex justify-center gap-2 bg-slate-900 p-1 rounded-xl max-w-md mx-auto border border-slate-800">
          <button 
            onClick={() => setActiveTab('klinik')}
            className={`flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition ${activeTab === 'klinik' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
          >
            Klinik Bilgiler
          </button>
          <button 
            onClick={() => setActiveTab('alarmlar')}
            className={`flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition ${activeTab === 'alarmlar' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
          >
            Alarmlar
          </button>
          <button 
            onClick={() => setActiveTab('notlar')}
            className={`flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition ${activeTab === 'notlar' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
          >
            Öğrenci & Staj
          </button>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 flex-1 pb-16 w-full">
        {activeTab === 'klinik' && (
          <div className="grid gap-4 sm:grid-cols-2">
            {clinicalTips.map((tip, idx) => (
              <div key={idx} className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl hover:border-cyan-500/40 transition">
                <div className="flex items-center gap-2.5 text-cyan-400 mb-2 font-semibold text-sm">
                  <Stethoscope className="w-4 h-4" />
                  <h4>{tip.topic}</h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{tip.detail}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'alarmlar' && (
          <div className="space-y-3">
            {alarms.map((alarm, idx) => (
              <div key={idx} className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      {alarm.level}
                    </span>
                    <h4 className="font-semibold text-white text-sm sm:text-base">{alarm.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400"><strong className="text-slate-300">Neden:</strong> {alarm.cause}</p>
                  <p className="text-xs text-cyan-300"><strong className="text-slate-300">İlk Müdahale:</strong> {alarm.action}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'notlar' && (
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <BookOpen className="w-6 h-6 text-cyan-400 mb-3" />
                <h4 className="font-semibold text-sm mb-1">Staj Defteri Kılavuzu</h4>
                <p className="text-xs text-slate-400">Vaka sunumları ve prosedür yazım şablonları.</p>
              </div>
              <button className="mt-4 inline-flex items-center text-xs font-semibold text-cyan-400 gap-1 hover:underline">
                İncele <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <FileText className="w-6 h-6 text-sky-400 mb-3" />
                <h4 className="font-semibold text-sm mb-1">Ders Özetleri (PDF)</h4>
                <p className="text-xs text-slate-400">Nefroloji ve Diyaliz Ekipmanları özet notları.</p>
              </div>
              <button className="mt-4 inline-flex items-center text-xs font-semibold text-sky-400 gap-1 hover:underline">
                İndir <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <GraduationCap className="w-6 h-6 text-indigo-400 mb-3" />
                <h4 className="font-semibold text-sm mb-1">KPSS & DGS Rehberi</h4>
                <p className="text-xs text-slate-400">Önlisans atama puanları ve kontenjan dağılımları.</p>
              </div>
              <button className="mt-4 inline-flex items-center text-xs font-semibold text-indigo-400 gap-1 hover:underline">
                Göz At <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>© 2026 AFSÜ Diyaliz Team</p>
      </footer>
    </div>
  );
}
