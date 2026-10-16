import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Trophy, Activity, ArrowUpRight, Check, ChevronDown, ClipboardList, Download, Droplets, Eye,
  GraduationCap, HeartPulse, Link2, Mail, MessageCircle, Plus, Presentation, RotateCw,
  Search, Send, Upload, X, FileText, Lightbulb, Play, Users, LogOut, Shield, Trash2, Bell, Megaphone,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const IG_URL = "https://instagram.com/afsudiyalizteam";
const IG_DM = "https://ig.me/m/afsudiyalizteam";
const YT_URL = "https://youtube.com/@afsudiyalizteam"; // Boş bırakırsan simge görünmez.
const FEEDBACK_EMAIL = "afsudiyalizteam@gmail.com";
const WEB3FORMS_KEY = ""; // web3forms.com anahtarı. Boşsa e-posta uygulaması hazır mesajla açılır.
// Sunucu bağlantısı. İstersen .env.local ile değiştirilebilir.
// Publishable anahtar herkese açık olacak şekilde tasarlanmıştır; yetkiyi RLS kuralları belirler.
const SB_URL = import.meta.env.VITE_SUPABASE_URL || "https://dhkhlptixkbyennclhji.supabase.co";
const SB_KEY = import.meta.env.VITE_SUPABASE_KEY || "sb_publishable_TSKGByByQcjLoa5F7FseeQ_bMDGErae";
const sb = SB_URL && SB_KEY ? createClient(SB_URL, SB_KEY) : null;
// Ana ekrana ekleme (PWA): tarayıcının "yükle" isteğini erken yakala, sonra butonla göster.
let installEvt = null;
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); installEvt = e; window.dispatchEvent(new Event("afsu-install")); });
  window.addEventListener("appinstalled", () => { installEvt = null; window.dispatchEvent(new Event("afsu-install")); });
}
const isStandalone = () => { try { return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true; } catch { return false; } };
const SHOW_SEED_NOTES = false; // Gerçek notlar gelince false yap, örnek kartlar kalkar.
// Logo gömülü (webp). Dosya yolu sorunlarından etkilenmez.
const LOGO_SRC = "data:image/webp;base64,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";

/* ---------- Yardımcılar ---------- */
const load = (k, f) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch { return f; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sessizce geç */ } };
const parseIg = (u) => {
  const m = String(u).trim().match(/instagram\.com\/(?:[A-Za-z0-9._]+\/)?(p|reels?|tv)\/([A-Za-z0-9_-]{5,20})/i);
  if (!m) return null;
  const k = m[1].toLowerCase();
  return { kind: k === "reels" ? "reel" : k, code: m[2] };
};
const isUrl = (s) => { try { return /^https?:$/.test(new URL(s).protocol); } catch { return false; } };

const Insta = ({ className = "h-5 w-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
);

const YouTube = ({ className = "h-5 w-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2.5" y="5" width="19" height="14" rx="4" /><path d="M10 9.5v5l4.5-2.5z" fill="currentColor" />
  </svg>
);

/* ---------- Veri ---------- */
/* ---------- Dersler (müfredat) ---------- */
const slug = (t) => t.toLocaleLowerCase("tr").replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
// Ders eklemek ya da çıkarmak için ilgili satırı değiştir: ["kısa ad / kod", "Dersin tam adı"]
const TERM_DEFS = [
  { id: "s1", label: "1. Sınıf Güz", chip: "bg-teal-500/25 text-teal-100 ring-teal-400/50", courses: [
    ["AİİT101", "Atatürk İlkeleri ve İnkılap Tarihi I"], ["TDİ101", "Türk Dili I"], ["YAD101", "Yabancı Dil I (İngilizce)"],
    ["DİZ107", "Biyokimya"], ["DİZ109", "Mesleki Temel Kavramlar ve Uygulamalar I"], ["DİZ112", "Tıbbi Terminoloji"],
    ["Anatomi-Fizyoloji", "Temel Anatomi ve Fizyoloji Bilgisi"] ] },
  { id: "s2", label: "1. Sınıf Bahar", chip: "bg-sky-500/25 text-sky-100 ring-sky-400/50", courses: [
    ["AİİT102", "Atatürk İlkeleri ve İnkılap Tarihi II"], ["TDİ102", "Türk Dili II"], ["YAD102", "Yabancı Dil II (İngilizce)"],
    ["DİZ104", "Diyaliz Uygulamaları I"], ["DİZ106", "Mesleki Temel Kavramlar ve Uygulamalar II"],
    ["Farmakoloji-Mikrobiyoloji", "Genel Farmakoloji ve Mikrobiyoloji"] ] },
  { id: "s3", label: "2. Sınıf Güz", chip: "bg-indigo-500/25 text-indigo-100 ring-indigo-400/50", courses: [
    ["DİZ201", "Diyaliz Uygulamaları II"], ["DİZ211", "Hematoloji"], ["DİZ200", "Kronik Hasta Psikolojisi"],
    ["DİZ203", "Nefroloji ve İç Hastalıkları"] ] },
  { id: "s4", label: "2. Sınıf Bahar", chip: "bg-cyan-500/25 text-cyan-100 ring-cyan-400/50", courses: [
    ["DİZ202", "Diyaliz Uygulamaları III"], ["DİZ204", "Hastalıklar Bilgisi ve Klinik Araştırmalar"],
    ["DİZ206", "Enfeksiyon Hastalıkları ve Sterilizasyon"] ] },
  { id: "sec", label: "Seçmeli", chip: "bg-amber-500/25 text-amber-100 ring-amber-400/50", courses: [["Seçmeli", "Seçmeli Dersler"]] },
  { id: "kpt", label: "KPSS", chip: "bg-rose-500/25 text-rose-100 ring-rose-400/50", courses: [["KPSS", "KPSS Önlisans"]] },
];
const TERMS = TERM_DEFS.map((t) => ({ ...t, courses: t.courses.map(([short, name]) => ({ id: slug(short), short, name, term: t.id, chip: t.chip })) }));
const COURSES = TERMS.flatMap((t) => t.courses);
const catOf = (id) => COURSES.find((c) => c.id === id) || { id, short: "Diğer", name: "Diğer", term: "", chip: "bg-white/10 text-slate-300 ring-white/20" };

// Örnek kartlar: gerçek notlar gelince `url` ekle ya da sil.
const SEED_NOTES = []; // Örnek kartlar kaldırıldı.

/* ---------- Doğru mu, yanlış mı? soru bankası ---------- */
const LEVELS = [
  { id: 1, label: "Kolay", desc: "Herkesin bilmesi gereken temel bilgiler", chip: "bg-teal-500/25 text-teal-100 ring-teal-400/50" },
  { id: 2, label: "Orta", desc: "Seans ve salon pratiğinden sorular", chip: "bg-amber-500/25 text-amber-100 ring-amber-400/50" },
  { id: 3, label: "Zor", desc: "Mekanizma ve klinik karar gerektiren sorular", chip: "bg-rose-500/25 text-rose-100 ring-rose-400/50" },
];
const levelOf = (id) => LEVELS.find((l) => l.id === id);
const TF_ROUND = 10; // her turdaki soru sayısı
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};

// Yeni soru eklemek için aynı biçimde bir satır ekle. level: 1 kolay, 2 orta, 3 zor.
const QUESTIONS = [
  /* ---- Kolay ---- */
  { id: 1, level: 1, topic: "Genel", isTrue: false, text: "Diyalize girmek, hayattan vazgeçmek demektir.",
    fact: "Birçok hasta düzenli diyalizle yıllarca çalışmaya, okumaya ve seyahat etmeye devam eder. Bazı hastalar böbrek nakliyle diyalizi bırakabilir." },
  { id: 2, level: 1, topic: "Genel", isTrue: false, text: "Böbrek hastalığı erken dönemde mutlaka belirti verir.",
    fact: "Böbrek hastalıkları çoğu zaman sessiz ilerler. Kan basıncı takibi ile kan ve idrar tahlilleri erken tanıda en önemli adımlardır." },
  { id: 3, level: 1, topic: "Genel", isTrue: false, text: "Diyaliz, böbrek hastalığını tamamen iyileştirir.",
    fact: "Diyaliz, böbreğin süzme, sıvı ve elektrolit dengesi gibi işlevlerinin bir kısmını üstlenir. Hastalığı iyileştirmez; uygun hastalarda kalıcı seçenek böbrek naklidir." },
  { id: 4, level: 1, topic: "Meslek", isTrue: false, text: "Diyaliz teknikerliği sadece makineyi açıp kapatmaktır.",
    fact: "Makine hazırlığı işin bir parçası. Seans boyunca hasta takibi, alarm yönetimi, enfeksiyon kontrolü, dezenfeksiyon ve hastayla iletişim de teknikerin sorumluluğundadır." },
  { id: 5, level: 1, topic: "Genel", isTrue: true, text: "Ağrı kesici ve romatizma ilaçlarının (NSAİİ) uzun süreli, kontrolsüz kullanımı böbreğe zarar verebilir.",
    fact: "Bu ilaçlar böbrek kan akımını azaltabilir. İlaç kullanımında hekim ve eczacıya danışmak gerekir." },
  { id: 6, level: 1, topic: "Genel", isTrue: true, text: "Diyabet ve yüksek tansiyon, kronik böbrek hastalığının en sık nedenleri arasındadır.",
    fact: "Kan şekerini ve tansiyonu kontrol altında tutmak, böbrekleri korumanın en önemli yollarından biridir." },
  { id: 7, level: 1, topic: "Genel", isTrue: false, text: "Böbrek hastalığı sadece yaşlılarda görülür.",
    fact: "Her yaşta görülebilir. Doğuştan yapı bozuklukları, glomerülonefrit, genetik hastalıklar ve diyabet gibi pek çok neden vardır." },
  { id: 8, level: 1, topic: "Hasta eğitimi", isTrue: true, text: "Diyaliz hastaları için sıvı ve beslenme düzenine uymak çok önemlidir.",
    fact: "Sıvı, potasyum ve fosfor gibi sınırlar hastaya göre değişir; hekim ve diyetisyen planına uymak seansların güvenliğini artırır." },
  { id: 9, level: 1, topic: "Fistül", isTrue: true, text: "Hemodiyaliz hastasının fistül koluna tansiyon manşonu bağlanmamalı ve o koldan kan alınmamalıdır.",
    fact: "Fistül hastanın 'yaşam hattı'dır. Kolda baskı, sıkan giysi veya gereksiz girişim fistülün tıkanma riskini artırır." },
  { id: 10, level: 1, topic: "Staj", isTrue: false, text: "Stajın ilk gününden itibaren hastaya tek başına iğne takılır.",
    fact: "Staj genellikle gözlem, hazırlık, cihaz kurulumu ve vital bulgu takibiyle başlar. Uygulamalar kurumun protokolüne göre, sorumlu personelin gözetiminde ve kademeli olarak yapılır." },

  /* ---- Orta ---- */
  { id: 11, level: 2, topic: "Fistül", isTrue: true, text: "Fistülde thrill (titreşim) ve ses (bruit), her seansta kontrol edilmelidir.",
    fact: "Thrill ve bruit, fistül çalışmasının en basit göstergesidir. Kaybolmuşsa hemen sorumlu hekime bildirilir." },
  { id: 12, level: 2, topic: "Alarmlar", isTrue: false, text: "Hava dedektörü alarmında kan pompası çalışmaya devam eder, sadece ses çıkar.",
    fact: "Hava dedektörü alarmında kan pompası durur ve venöz klemp kapanır. Hava kaynağı bulunup giderilmeden sistem yeniden başlatılmaz." },
  { id: 13, level: 2, topic: "Seans", isTrue: true, text: "Seans sırasında tansiyon belirgin düşüp terleme başlarsa ilk adımlardan biri UF'yi azaltmak veya durdurmaktır.",
    fact: "Amaç dolaşımı desteklemektir: UF azaltılır ya da durdurulur, hasta sırtüstü yatırılıp ayakları yükseltilir, gerekirse hekim talimatıyla serum fizyolojik verilir." },
  { id: 14, level: 2, topic: "Alarmlar", isTrue: false, text: "İletkenlik alarmı çalarken alarmı susturup seansa devam etmek güvenlidir.",
    fact: "Yanlış iletkenlikteki diyalizat hemoliz ve sodyum dengesizliğine yol açabilir. Makinenin bypass'a aldığı doğrulanır, konsantreler ve emiş hortumları kontrol edilir." },
  { id: 15, level: 2, topic: "Seans", isTrue: true, text: "Disequilibrium sendromu en çok ilk seanslarda, üre düzeyi çok yüksek hastalarda görülür.",
    fact: "Üre beyinden kandan daha yavaş temizlendiği için ozmotik fark beyin ödemine yol açabilir; baş ağrısı, bulantı ve konfüzyon görülür. İlk seanslarda kısa süre ve düşük kan akımı planlanır." },
  { id: 16, level: 2, topic: "Seans", isTrue: false, text: "Kuru kilo, hastanın ilk muayenedeki kilosudur ve bir daha değişmez.",
    fact: "Kuru kilo klinik olarak belirlenir; ödem, tansiyon, akciğer bulguları ve seans toleransına göre zamanla hekimle birlikte güncellenir." },
  { id: 17, level: 2, topic: "Seans", isTrue: true, text: "Kramp, hızlı sıvı çekimi ve kuru kilonun altına inme ile tetiklenebilir.",
    fact: "Hızlı UF kas perfüzyonunu bozar. Müdahalede UF azaltılır, gerekirse hekim talimatıyla serum verilir." },
  { id: 18, level: 2, topic: "Enfeksiyon kontrolü", isTrue: false, text: "HBsAg pozitif hastalar, diğer hastalarla aynı makine ve malzemeyi paylaşabilir; ek bir önlem gerekmez.",
    fact: "Hepatit B pozitif hastalar için kurum protokolüne göre ayrı oda veya makine ile ayrı malzeme kullanılır; bakım veren personelin aynı anda duyarlı hastalara bakmaması önerilir. El hijyeni ve eldiven değişimi her hastada esastır." },
  { id: 19, level: 2, topic: "Elektrolit", isTrue: true, text: "Hiperkalemi, diyaliz hastalarında kalp ritim bozukluğuna yol açabilen ciddi bir sorundur.",
    fact: "Potasyum yüksekliği EKG'de değişikliklere ve ritim bozukluklarına neden olabilir. Bu yüzden potasyum kısıtlaması ve yeterli diyaliz önemlidir." },
  { id: 20, level: 2, topic: "Alarmlar", isTrue: true, text: "Venöz basınç alarmında önce venöz hatta kıvrılma, kapalı klemp ve damlalıkta pıhtı gibi nedenlere bakılır.",
    fact: "Venöz basınç, kan dönüş hattındaki dirençle ilgilidir. Hat, damlalık ve iğne pozisyonu ilk kontrol edilecek yerlerdir." },

  /* ---- Zor ---- */
  { id: 21, level: 3, topic: "Diyaliz fiziği", isTrue: true, text: "Ultrafiltrasyon, diyalizör membranı boyunca oluşan basınç farkıyla fazla sıvının çekilmesidir.",
    fact: "Üre ve kreatinin gibi küçük moleküller ağırlıklı olarak difüzyonla (konsantrasyon farkıyla), fazla sıvı ise ultrafiltrasyonla (basınç farkıyla) uzaklaştırılır." },
  { id: 22, level: 3, topic: "Alarmlar", isTrue: false, text: "Yüksek TMP alarmı her zaman konsantrenin bitmesinden kaynaklanır.",
    fact: "TMP yüksekliği çoğunlukla diyalizör pıhtılaşması veya çok yüksek UF hızıyla ilgilidir. Konsantre sorunları iletkenlik alarmı verir." },
  { id: 23, level: 3, topic: "Enfeksiyon kontrolü", isTrue: true, text: "Santral venöz kateterli hastada seans sırasında ateş ve titreme, kateter ilişkili enfeksiyonu düşündürür ve hekime hemen bildirilmelidir.",
    fact: "Kateter ilişkili kan dolaşımı enfeksiyonu ciddi bir komplikasyondur. Aseptik teknik, düzenli pansuman bakımı ve erken bildirim hayati önem taşır." },
  { id: 24, level: 3, topic: "Antikoagülasyon", isTrue: false, text: "Aktif kanaması olan bir hastada heparin her zaman standart dozda verilir.",
    fact: "Aktif kanama ya da yüksek kanama riskinde hekim heparinsiz veya düşük doz protokol belirler. Bu durumda diyalizör pıhtılaşması daha yakından izlenir." },
  { id: 25, level: 3, topic: "Fistül", isTrue: true, text: "Tekrarlayan yüksek venöz basınç, fistülde venöz stenoz olasılığını düşündürmelidir.",
    fact: "Venöz çıkış darlığında dönüş direnci artar. Tekrarlayan yüksek basınç, iğne yerinde uzayan kanama ve thrill değişikliği hekime bildirilmesi gereken işaretlerdir." },
  { id: 26, level: 3, topic: "Alarmlar", isTrue: false, text: "Düşük venöz basınç alarmı önemsizdir, sadece hat gevşemesini gösterir.",
    fact: "Düşük venöz basınç, iğnenin çıkması veya bağlantının kopması anlamına gelebilir ve ciddi kanamaya yol açar. Önce hastayı ve kanamayı değerlendir, bağlantıları güvene al ve hekime bildir." },
  { id: 27, level: 3, topic: "Alarmlar", isTrue: true, text: "Kan kaçağı alarmında diyalizat çıkışında pembe veya kırmızı renk görülmesi, membran yırtığını düşündürür.",
    fact: "Diyalizat tarafına kan geçmiş olabilir. Hekime bildirilir ve kurum protokolüne göre diyalizör ile set değiştirilir. Dedektör kirliliği veya hava kabarcığı yanlış alarm da verebilir." },
  { id: 28, level: 3, topic: "UF hesabı", isTrue: true, text: "UF hedefi hesaplanırken giriş ve kuru kilo farkına, seans sırasında alınan sıvılar (yıkama, serum, ikram) da eklenmelidir.",
    fact: "Toplam çekilecek sıvı = (giriş kilosu − kuru kilo) + seans boyunca verilen sıvılar. Saatlik UF hızı, bu toplamın seans süresine bölünmesiyle bulunur." },
  { id: 29, level: 3, topic: "Kemik-mineral", isTrue: true, text: "Uzun süreli hiperfosfatemi, kemik-mineral bozukluğu ve damar kalsifikasyonu riskini artırır.",
    fact: "Diyaliz hastalarında yüksek fosfor, hiperparatiroidi ve damar kireçlenmesiyle ilişkilidir. Diyet, fosfor bağlayıcılar ve yeterli diyaliz birlikte yönetilir." },
  { id: 30, level: 3, topic: "Su arıtma", isTrue: false, text: "Diyalizat suyundaki kloramin hemolize yol açamaz, bu yüzden su arıtma sisteminde karbon filtre takibine gerek yoktur.",
    fact: "Kloramin eritrositlere zarar vererek hemolitik anemiye yol açabilir. Su arıtma sisteminde karbon filtrelerin ve klor/kloramin testlerinin düzenli takibi gerekir." },
  { id: 31, level: 3, topic: "UF hesabı", isTrue: true, text: "Saatlik UF hızı yaklaşık 13 ml/kg/saatin üzerine çıktığında intradiyalitik hipotansiyon ve kardiyovasküler risk artar.",
    fact: "Gözlemsel çalışmalar bu eşiğin üzerinde riskin arttığını gösterir. Bu yüzden UF hedefi gerekirse seans süresi uzatılarak ya da ek seansla bölünerek hekimle birlikte planlanır." },
];


const POLL = { q: "Bu dönem en çok hangi içeriğe ihtiyacın var?", opts: ["Nefroloji notları", "Staj defteri örnekleri", "Vaka sunumları", "KPSS Önlisans"] };

const QA = [
  { q: "Paylaştığım not hemen yayınlanır mı?", a: "Hayır. Önce yöneticiler kontrol eder, onaylanınca not havuzunda herkese görünür. Bekleyen notunu \"Onay bekliyor\" rozetiyle sen görürsün." },
  { q: "Not paylaşmak için ne yapmalıyım?", a: "Giriş yap, Not havuzunda \"Not paylaş\"a bas. Dersi seç, başlığı yaz ve telefonundan PDF dosyanı seç. Dosya en fazla 10 MB olabilir." },
  { q: "Hesaba nasıl katkı sağlayabilirim?", a: "Deneyimlerini, sorularını ya da paylaşmak istediğin bir içeriği Instagram'dan DM ile iletebilir, sitedeki geri bildirim butonunu da kullanabilirsin." },
];

const inp = "w-full rounded-xl border border-sky-300/15 bg-[#0a1a30]/90 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-teal-300/60 focus:ring-2 focus:ring-teal-300/20";

/* ---------- Küçük bileşenler ---------- */
function Logo({ size = "h-10 w-10" }) {
  const [bad, setBad] = useState(false);
  if (bad) {
    return (
      <span className={`${size} grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-teal-400 to-sky-600 text-white shadow-lg shadow-teal-500/30`}>
        <HeartPulse className="h-1/2 w-1/2" />
      </span>
    );
  }
  return <img src={LOGO_SRC} alt="AFSÜ Diyaliz Team logosu" onError={() => setBad(true)} className={`${size} shrink-0 rounded-full bg-white object-cover shadow-lg ring-2 ring-white/20`} />;
}

function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-[#030a14]/80 backdrop-blur-sm" onClick={onClose} />
      <div className="pop relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-sky-300/15 bg-[#0b1a2e]/95 p-6 shadow-2xl backdrop-blur-xl sm:max-w-md sm:rounded-3xl">
        <button onClick={onClose} aria-label="Kapat" className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white">
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-200">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-rose-300">{error}</span>}
    </label>
  );
}

function InstallCard({ compact }) {
  const [, tick] = useState(0);
  const [hide, setHide] = useState(() => { try { return localStorage.getItem("afsu_install_hide") === "1"; } catch { return false; } });
  useEffect(() => { const f = () => tick((n) => n + 1); window.addEventListener("afsu-install", f); return () => window.removeEventListener("afsu-install", f); }, []);
  if (isStandalone() || (compact && hide)) return null;
  const ua = navigator.userAgent || "";
  const ios = /iPhone|iPad|iPod/i.test(ua);
  const close = () => { try { localStorage.setItem("afsu_install_hide", "1"); } catch { /* sessizce geç */ } setHide(true); };
  const install = async () => { if (!installEvt) return; installEvt.prompt(); await installEvt.userChoice.catch(() => null); installEvt = null; tick((n) => n + 1); };
  return (
    <div className="mb-3 flex items-center gap-3 rounded-2xl border border-sky-300/20 bg-sky-500/10 px-4 py-3">
      <Download className="h-5 w-5 shrink-0 text-sky-200" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white">Telefonuna ekle</p>
        <p className="text-xs text-slate-300">
          {installEvt ? "Ana ekrana simge olarak ekle, düelloya tek dokunuşla gir." : ios ? "Safari'de Paylaş simgesine, sonra \"Ana Ekrana Ekle\"ye dokun." : "Tarayıcı menüsünden (⋮) \"Ana ekrana ekle\" ya da \"Uygulamayı yükle\"yi seç."}
        </p>
      </div>
      {installEvt && <button onClick={install} className="shrink-0 rounded-xl bg-sky-500 px-3.5 py-2 text-sm font-semibold text-slate-950">Ekle</button>}
      {compact && <button onClick={close} aria-label="Kapat" className="shrink-0 p-1 text-slate-400"><X className="h-4 w-4" /></button>}
    </div>
  );
}

function SectionHead({ title, desc }) {
  return (
    <div className="mb-4 max-w-xl">
      <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{desc}</p>
    </div>
  );
}

/* ---------- Modallar ---------- */
const trErr = (m = "") =>
  /invalid login/i.test(m) ? "E-posta ya da şifre hatalı."
  : /already registered/i.test(m) ? "Bu e-posta zaten kayıtlı. Giriş yapmayı dene."
  : /not confirmed/i.test(m) ? "Önce e-postandaki doğrulama bağlantısına tıkla."
  : /rate limit|too many/i.test(m) ? "Çok fazla deneme yapıldı. Biraz bekleyip tekrar dene."
  : /password/i.test(m) ? "Şifre yeterince güçlü değil."
  : "Bir sorun oluştu. Tekrar dene.";

function AuthModal({ open, onClose, user, profile, onAdmin, onDone, onPrivacy, recovery, onRecovered, podiums, onClass, onKarne, onProfile }) {
  const [mode, setMode] = useState("signup");
  const [step, setStep] = useState("form"); // form | code | forgot | reset
  const [f, setF] = useState({ name: "", email: "", pass: "" });
  const [code, setCode] = useState("");
  const [agree, setAgree] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  useEffect(() => { if (recovery) { setErr(""); setStep("reset"); } }, [recovery]);
  const close = () => { setErr(""); setStep("form"); setCode(""); if (recovery) onRecovered(); onClose(); };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    const email = f.email.trim();
    if (mode === "signup" && f.name.trim().length < 3) return setErr("Adını ve soyadını yaz.");
    if (!emailOk(email)) return setErr("Geçerli bir e-posta adresi yaz.");
    if (f.pass.length < 8) return setErr("Şifre en az 8 karakter olmalı.");
    if (mode === "signup" && !agree) return setErr("Devam etmek için gizlilik metnini onaylamalısın.");
    setBusy(true);
    const { data, error } = mode === "signup"
      ? await sb.auth.signUp({ email, password: f.pass, options: { data: { full_name: f.name.trim(), kvkk_consent: true, consent_at: new Date().toISOString() } } })
      : await sb.auth.signInWithPassword({ email, password: f.pass });
    const unconfirmed = error && /not confirmed/i.test(error.message);
    if (unconfirmed) await sb.auth.resend({ type: "signup", email });
    setBusy(false);
    if (unconfirmed) { setCode(""); return setStep("code"); }
    if (error) return setErr(trErr(error.message));
    if (mode === "signup" && !data.session) { setCode(""); return setStep("code"); }
    setF({ name: "", email: "", pass: "" });
    onDone(mode === "signup" ? "Aramıza hoş geldin!" : "Giriş yapıldı.");
    close();
  };

  const verify = async (e) => {
    e.preventDefault();
    setErr("");
    const email = f.email.trim();
    if (!/^\d{6,8}$/.test(code)) return setErr("E-postandaki kodu yaz.");
    setBusy(true);
    let { error } = await sb.auth.verifyOtp({ email, token: code, type: "email" });
    if (error) ({ error } = await sb.auth.verifyOtp({ email, token: code, type: "signup" }));
    setBusy(false);
    if (error) return setErr("Kod hatalı ya da süresi dolmuş.");
    setF({ name: "", email: "", pass: "" });
    onDone("Aramıza hoş geldin!");
    close();
  };

  const resend = async () => {
    const { error } = await sb.auth.resend({ type: "signup", email: f.email.trim() });
    if (error) return setErr("Kod şimdi gönderilemedi. Bir dakika bekleyip tekrar dene.");
    setErr("");
    onDone("Yeni kod gönderildi.");
  };

  const sendReset = async (e) => {
    e?.preventDefault();
    setErr("");
    const email = f.email.trim();
    if (!emailOk(email)) return setErr("Geçerli bir e-posta adresi yaz.");
    setBusy(true);
    const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
    setBusy(false);
    if (error) return setErr("Kod şimdi gönderilemedi. Bir dakika bekleyip tekrar dene.");
    if (step === "forgot") { setCode(""); setF({ ...f, pass: "" }); setStep("reset"); } else onDone("Yeni kod gönderildi.");
  };

  const doReset = async (e) => {
    e.preventDefault();
    setErr("");
    if (!recovery && !/^\d{6,8}$/.test(code)) return setErr("E-postandaki kodu yaz.");
    if (f.pass.length < 8) return setErr("Yeni şifre en az 8 karakter olmalı.");
    setBusy(true);
    if (!recovery) {
      const { error } = await sb.auth.verifyOtp({ email: f.email.trim(), token: code, type: "recovery" });
      if (error) { setBusy(false); return setErr("Kod hatalı ya da süresi dolmuş."); }
    }
    const { error } = await sb.auth.updateUser({ password: f.pass });
    setBusy(false);
    if (error) return setErr(trErr(error.message));
    setF({ name: "", email: "", pass: "" });
    onDone("Şifren güncellendi.");
    close();
  };

  const logout = async () => { await sb.auth.signOut(); onDone("Çıkış yapıldı."); close(); };
  const tab = (m, label) => (
    <button type="button" onClick={() => { setMode(m); setErr(""); }} className={`flex-1 rounded-lg py-2 text-sm font-semibold ${mode === m ? "bg-teal-500 text-slate-950" : "text-slate-300"}`}>{label}</button>
  );
  const view = !sb ? "off" : step === "reset" ? "reset" : user ? "account" : step;
  const primary = "w-full rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/20 active:scale-[0.98] disabled:opacity-60";
  const codeInput = (
    <input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} inputMode="numeric" autoComplete="one-time-code" maxLength={8} placeholder="______" aria-label="Doğrulama kodu" className={`${inp} text-center font-display text-2xl tracking-[0.4em]`} />
  );
  const badge = <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal-500/25 text-teal-100 ring-1 ring-teal-400/50"><Mail className="h-8 w-8" /></div>;

  return (
    <Modal open={open} onClose={close} title="Giriş ve kayıt">
      {view === "off" && (
        <div className="text-center">
          <h3 className="font-display text-xl font-bold text-white">Kayıt sistemi henüz bağlı değil</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">Sunucu bağlantısı kurulunca giriş ve kayıt burada çalışacak.</p>
        </div>
      )}

      {view === "account" && (
        <div className="text-center">
          <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full bg-teal-500/25 font-display text-2xl font-bold text-teal-100 ring-1 ring-teal-400/50">{(profile?.full_name || user.email || "?")[0].toUpperCase()}</div>
          <h3 className="font-display text-xl font-bold text-white">{profile?.full_name || "Öğrenci"}</h3>
          <p className="text-sm text-slate-400">{user.email}</p>
          {profile?.role === "admin" && <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-rose-500/25 px-3 py-1 text-xs text-rose-100 ring-1 ring-rose-400/50"><Shield className="h-3.5 w-3.5" /> Yönetici</span>}
          {podiums?.length > 0 && <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-500/25 px-3 py-1 text-xs text-amber-100 ring-1 ring-amber-400/50">🏆 {podiums.some((p) => p.rank === 1) ? "Düello Şampiyonu" : "Düello Podyumu"}{podiums.length > 1 ? ` · ${podiums.length}×` : ""}</span>}
          {profile && "entry_year" in profile && <ClassChip entry={profile.entry_year} onClass={onClass} />}
          <div className="mt-5 grid gap-3">
            {profile?.role === "admin" && <button onClick={onAdmin} className="rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 px-4 py-3 text-sm font-semibold text-slate-950">Yönetim paneli</button>}
            {onProfile && <button onClick={onProfile} className="rounded-xl border border-teal-400/40 px-4 py-3 text-sm font-semibold text-teal-100 hover:bg-teal-500/10">Profilim</button>}
            {onKarne && <button onClick={onKarne} className="rounded-xl border border-teal-400/40 px-4 py-3 text-sm font-semibold text-teal-100 hover:bg-teal-500/10">Karnem</button>}
            <button onClick={logout} className="flex items-center justify-center gap-2 rounded-xl border border-sky-300/15 px-4 py-3 text-sm text-slate-200 hover:bg-white/5"><LogOut className="h-4 w-4" /> Çıkış yap</button>
          </div>
        </div>
      )}

      {view === "code" && (
        <form onSubmit={verify} noValidate className="space-y-4 text-center">
          {badge}
          <h3 className="font-display text-2xl font-bold text-white">Doğrulama kodunu yaz</h3>
          <p className="text-sm leading-relaxed text-slate-300"><span className="text-teal-200">{f.email.trim()}</span> adresine bir kod gönderdik. Gelmediyse spam klasörüne de bak.</p>
          {codeInput}
          {err && <p role="alert" className="text-sm text-rose-300">{err}</p>}
          <button type="submit" disabled={busy} className={primary}>{busy ? "Bekle…" : "Doğrula"}</button>
          <div className="flex justify-between text-xs text-slate-400">
            <button type="button" onClick={() => { setStep("form"); setErr(""); }} className="hover:text-slate-200">Geri dön</button>
            <button type="button" onClick={resend} className="hover:text-slate-200">Kodu tekrar gönder</button>
          </div>
        </form>
      )}

      {view === "forgot" && (
        <form onSubmit={sendReset} noValidate className="space-y-4">
          <div className="text-center">{badge}<h3 className="mt-3 font-display text-2xl font-bold text-white">Şifreni sıfırla</h3><p className="mt-1 text-sm text-slate-300">E-postanı yaz, sana bir kod gönderelim.</p></div>
          <Field label="E-posta"><input type="email" value={f.email} onChange={set("email")} autoComplete="email" placeholder="ornek@mail.com" className={inp} /></Field>
          {err && <p role="alert" className="text-sm text-rose-300">{err}</p>}
          <button type="submit" disabled={busy} className={primary}>{busy ? "Bekle…" : "Kod gönder"}</button>
          <button type="button" onClick={() => { setStep("form"); setErr(""); }} className="block w-full text-center text-xs text-slate-400 hover:text-slate-200">Geri dön</button>
        </form>
      )}

      {view === "reset" && (
        <form onSubmit={doReset} noValidate className="space-y-4">
          <div className="text-center">{badge}<h3 className="mt-3 font-display text-2xl font-bold text-white">Yeni şifre belirle</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-300">{recovery ? "Yeni şifreni yaz." : "Bu e-posta kayıtlıysa bir kod gönderdik. Kodu ve yeni şifreni yaz."}</p></div>
          {!recovery && codeInput}
          <Field label="Yeni şifre"><input type="password" value={f.pass} onChange={set("pass")} autoComplete="new-password" placeholder="En az 8 karakter" className={inp} /></Field>
          {err && <p role="alert" className="text-sm text-rose-300">{err}</p>}
          <button type="submit" disabled={busy} className={primary}>{busy ? "Bekle…" : "Şifreyi güncelle"}</button>
          {!recovery && (
            <div className="flex justify-between text-xs text-slate-400">
              <button type="button" onClick={() => { setStep("form"); setErr(""); }} className="hover:text-slate-200">Geri dön</button>
              <button type="button" onClick={() => { setStep("reset"); sendReset(); }} className="hover:text-slate-200">Kodu tekrar gönder</button>
            </div>
          )}
        </form>
      )}

      {view === "form" && (
        <form onSubmit={submit} noValidate className="space-y-4">
          <div className="flex items-center gap-3"><Logo size="h-12 w-12" /><div><h3 className="font-display text-xl font-bold text-white">{mode === "signup" ? "Masamızda yerin hazır" : "Tekrar hoş geldin"}</h3><p className="text-xs text-slate-400">AFSÜ Diyaliz Team</p></div></div>
          <div className="flex gap-1 rounded-xl bg-white/5 p-1">{tab("signup", "Kayıt ol")}{tab("login", "Giriş yap")}</div>
          {mode === "signup" && <Field label="Ad soyad"><input value={f.name} onChange={set("name")} autoComplete="name" placeholder="Adın ve soyadın" className={inp} /></Field>}
          <Field label="E-posta">
            <div className="relative"><Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><input type="email" value={f.email} onChange={set("email")} autoComplete="email" placeholder="ornek@mail.com" className={`${inp} pl-10`} /></div>
          </Field>
          <Field label="Şifre"><input type="password" value={f.pass} onChange={set("pass")} autoComplete={mode === "signup" ? "new-password" : "current-password"} placeholder="En az 8 karakter" className={inp} /></Field>
          {mode === "login" && <button type="button" onClick={() => { setStep("forgot"); setErr(""); }} className="-mt-2 block text-xs text-teal-300 underline underline-offset-2">Şifremi unuttum</button>}
          {mode === "signup" && (
            <label className="flex items-start gap-3 text-xs leading-relaxed text-slate-300">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-teal-500" />
              <span><button type="button" onClick={onPrivacy} className="text-teal-300 underline underline-offset-2">Gizlilik ve KVKK aydınlatma metnini</button> okudum, kabul ediyorum.</span>
            </label>
          )}
          {err && <p role="alert" className="text-sm text-rose-300">{err}</p>}
          <button type="submit" disabled={busy} className={primary}>{busy ? "Bekle…" : mode === "signup" ? "Topluluğa katıl" : "Giriş yap"}</button>
        </form>
      )}
    </Modal>
  );
}

// NOT: Aşağıdaki metin taslaktır. Yayından önce topluluk/üniversite yetkilileri gözden geçirmelidir.
const PRIVACY = [
  ["Veri sorumlusu", "AFSÜ Diyaliz Team öğrenci topluluğu. İletişim: afsudiyalizteam@gmail.com"],
  ["Hangi verileri topluyoruz?", "Kayıtta ad soyad ve e-posta adresin; şifren (yalnızca şifrelenmiş olarak); paylaştığın PDF notlar ve not bilgileri; çözdüğün test sorularının sonuçları. Geri bildirim gönderirsen mesajın, adın, e-postan, baktığın sayfa ve cihaz bilgin. Ayrıca günlük ziyaretçi sayısını göstermek için IP adresin geri döndürülemez biçimde şifrelenip (hash) sayılır; IP adresin açık haliyle saklanmaz."],
  ["Ne için kullanıyoruz?", "Hesabını oluşturmak ve doğrulamak, not paylaşımını yönetmek ve denetlemek, geri bildirimlerine yanıt vermek ve siteyi güvenli tutmak için."],
  ["Hukuki sebep", "Kayıt sırasında verdiğin açık rıza ve hizmetin sunulması için gerekli olması."],
  ["Verilerin kimlerle paylaşılıyor?", "Hizmeti sunmak için Supabase (veritabanı ve dosya depolama), Vercel (site yayını), Google (doğrulama e-postaları) ve etkinse Web3Forms (geri bildirim iletimi) kullanılır. Bu sağlayıcıların sunucuları yurt dışında olabilir. Instagram gönderileri gömülü gösterildiğinde Meta kendi çerezlerini kullanabilir."],
  ["Ne kadar saklıyoruz?", "Hesabın silinene kadar. Onaylanmayan ya da uygunsuz notlar yöneticiler tarafından silinebilir."],
  ["Paylaştığın içerik", "Yüklediğin notları paylaşma hakkına sahip olduğunu kabul edersin. Telif hakkı ihlali içeren içerikler kaldırılır. Bildirim için geri bildirim formunu kullanabilirsin."],
  ["Haklarının", "6698 sayılı KVKK'nın 11. maddesi uyarınca verilerine erişme, düzeltme ve silinmesini isteme hakkın vardır. Başvuru için afsudiyalizteam@gmail.com adresine yazabilirsin."],
];

function PrivacyModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Gizlilik ve KVKK">
      <h3 className="pr-8 font-display text-xl font-bold text-white">Gizlilik ve KVKK aydınlatma metni</h3>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-300">
        {PRIVACY.map(([h, t]) => (<div key={h}><h4 className="font-semibold text-white">{h}</h4><p className="mt-1">{t}</p></div>))}
      </div>
      <button onClick={onClose} className="mt-6 w-full rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 px-4 py-3 text-sm font-semibold text-slate-950">Anladım</button>
    </Modal>
  );
}

const FB_TYPES = [
  { id: "oneri", label: "Öneri", ph: "Sitede neyi eklemek ya da değiştirmek isterdin?" },
  { id: "hata", label: "Hata", ph: "Ne oldu? Hangi sayfada? Ne bekliyordun?" },
  { id: "soru", label: "Soru", ph: "Merak ettiğini buraya yaz." },
  { id: "tesekkur", label: "Teşekkür", ph: "Bize iletmek istediğin güzel bir söz var mı?" },
];

function FeedbackModal({ open, onClose, user, profile, page, onDone }) {
  const [type, setType] = useState("oneri");
  const [msg, setMsg] = useState("");
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [trap, setTrap] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [viaMail, setViaMail] = useState(false);
  const t = FB_TYPES.find((x) => x.id === type);

  useEffect(() => {
    if (!open) return;
    setName((v) => v || profile?.full_name || "");
    setMail((v) => v || user?.email || "");
  }, [open, user?.email, profile?.full_name]);

  const close = () => { setDone(false); setErr(""); onClose(); };
  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    const text = msg.trim();
    const email = mail.trim();
    const from = name.trim();
    if (text.length < 10) return setErr("Mesajın en az 10 karakter olmalı.");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return setErr("E-posta adresi geçerli görünmüyor.");
    if (trap) { setViaMail(false); return setDone(true); }
    if (Date.now() - Number(load("afsu_fb_last", 0)) < 60000) return setErr("Az önce bir mesaj gönderdin. Bir dakika sonra tekrar dene.");
    const subject = `AFSÜ Diyaliz geri bildirimi: ${t.label}`;
    const body = `${text}\n\n---\nTür: ${t.label}\nGönderen: ${from || "belirtilmedi"}\nE-posta: ${email || "belirtilmedi"}\nSayfa: #/${page}\nCihaz: ${navigator.userAgent.slice(0, 120)}`;
    setBusy(true);
    try {
      if (WEB3FORMS_KEY) {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ access_key: WEB3FORMS_KEY, subject, from_name: from || "AFSÜ Diyaliz sitesi", ...(email ? { email } : {}), message: body }),
        });
        const out = await res.json();
        if (!res.ok || !out.success) throw new Error("gonderilemedi");
        save("afsu_fb_last", Date.now());
        setViaMail(false);
      } else {
        // Anahtar yoksa telefonun e-posta uygulaması hazır mesajla açılır.
        window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setViaMail(true);
      }
      setMsg("");
      setDone(true);
    } catch {
      setErr("Gönderilemedi. İnternetini kontrol edip tekrar dene.");
    }
    setBusy(false);
  };

  return (
    <Modal open={open} onClose={close} title="Geri bildirim">
      {done ? (
        <div className="text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-teal-500/25 text-teal-100 ring-1 ring-teal-400/50"><Check className="h-8 w-8" /></div>
          <h3 className="font-display text-2xl font-bold text-white">{viaMail ? "Neredeyse tamam" : "Teşekkürler!"}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">{viaMail ? "E-posta uygulaman hazır mesajla açıldı. Gönder'e basarak tamamla." : "Mesajın bize ulaştı. En kısa zamanda okuyacağız."}</p>
          <button onClick={close} className="mt-6 w-full rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 px-4 py-3 text-sm font-semibold text-slate-950">Kapat</button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-4">
          <div><h3 className="font-display text-xl font-bold text-white">Geri bildirim</h3><p className="mt-1 text-sm text-slate-400">Fikrin bizim için değerli. Tek dokunuşla bize ulaşır.</p></div>
          <div>
            <span className="mb-1.5 block text-sm font-medium text-slate-200">Ne hakkında?</span>
            <div className="grid grid-cols-4 gap-2">
              {FB_TYPES.map((x) => (
                <button key={x.id} type="button" onClick={() => setType(x.id)} aria-pressed={type === x.id} className={`rounded-xl px-1 py-2.5 text-xs font-semibold transition ${type === x.id ? "bg-teal-500 text-slate-950" : "border border-sky-300/15 bg-white/5 text-slate-300"}`}>{x.label}</button>
              ))}
            </div>
          </div>
          <Field label="Mesajın">
            <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={5} maxLength={1000} placeholder={t.ph} className={`${inp} resize-none`} />
            <span className="mt-1 block text-right text-xs text-slate-500">{msg.length}/1000</span>
          </Field>
          <Field label="Adın (isteğe bağlı)"><input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={inp} /></Field>
          <Field label="E-posta (cevap istersen)"><input type="email" value={mail} onChange={(e) => setMail(e.target.value)} autoComplete="email" placeholder="ornek@mail.com" className={inp} /></Field>
          <input value={trap} onChange={(e) => setTrap(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="sr-only" name="website" />
          {err && <p role="alert" className="text-sm text-rose-300">{err}</p>}
          <button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/20 active:scale-[0.98] disabled:opacity-60">{busy ? "Gönderiliyor…" : <><Send className="h-4 w-4" /> Gönder</>}</button>
        </form>
      )}
    </Modal>
  );
}

function ShareModal({ open, onClose, onSubmit, moderated }) {
  const empty = { title: "", cat: "", author: "" };
  const [f, setF] = useState(empty);
  const [errs, setErrs] = useState({});
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState(null);
  const [rights, setRights] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const close = () => { setDone(false); setF(empty); setFile(null); setRights(false); setErrs({}); onClose(); };
  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    if (!f.cat) er.cat = "Bir ders seç.";
    if (f.title.trim().length < 3) er.title = "Not başlığı en az 3 karakter olmalı.";
    if (!file) er.file = "Bir PDF dosyası seç.";
    else if (!/\.pdf$/i.test(file.name)) er.file = "Sadece PDF dosyası yükleyebilirsin.";
    else if (file.size > 10 * 1024 * 1024) er.file = "Dosya en fazla 10 MB olabilir.";
    else if ((await file.slice(0, 5).text()) !== "%PDF-") er.file = "Bu dosya geçerli bir PDF değil.";
    if (!rights) er.rights = "Devam etmek için onay vermelisin.";
    setErrs(er);
    if (Object.keys(er).length) return;
    setBusy(true);
    const res = await onSubmit({ cat: f.cat, title: f.title.trim(), course: catOf(f.cat).name, author: f.author.trim(), file });
    setBusy(false);
    if (res?.error) return setErrs({ form: res.error });
    setDone(true);
  };
  return (
    <Modal open={open} onClose={close} title="Not paylaş">
      {done ? (
        <div className="text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-teal-400/15 text-teal-200 ring-1 ring-teal-300/30"><Check className="h-8 w-8" /></div>
          <h3 className="font-display text-2xl font-bold text-white">{moderated ? "Notun onaya gönderildi" : "Notun havuzda"}</h3>
          <p className="mt-2 text-sm text-slate-300">{moderated ? "Yöneticiler onayladığında havuzda görünecek. Teşekkürler!" : "Teşekkürler! Bu not, birinin sınav haftasını kurtarabilir."}</p>
          <button onClick={close} className="mt-6 w-full rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 px-4 py-3 text-sm font-semibold text-slate-950">Havuza dön</button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-4">
          <div><h3 className="font-display text-xl font-bold text-white">Not paylaş</h3><p className="mt-1 text-sm text-slate-400">PDF dosyanı seç, gerisini topluluk halleder.</p></div>
          <Field label="Ders" error={errs.cat}>
            <select value={f.cat} onChange={set("cat")} className={inp}>
              <option value="" className="bg-slate-900">Ders seç</option>
              {TERMS.map((t) => (
                <optgroup key={t.id} label={t.label} className="bg-slate-900">
                  {t.courses.map((c) => <option key={c.id} value={c.id} className="bg-slate-900">{c.short === c.name ? c.name : `${c.short} · ${c.name}`}</option>)}
                </optgroup>
              ))}
            </select>
          </Field>
          <Field label="Not başlığı" error={errs.title}><input value={f.title} onChange={set("title")} placeholder="Örn. Vasküler giriş yolları özeti" className={inp} /></Field>
          <Field label="PDF dosyası" error={errs.file}>
            <div className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-sky-300/30 bg-white/5 px-4 py-4 text-sm text-slate-200 hover:bg-white/10">
              <FileText className="h-5 w-5 shrink-0 text-teal-300" />
              <span className="min-w-0 flex-1 truncate">{file ? file.name : "Telefondan PDF seç"}</span>
              <input type="file" accept="application/pdf,.pdf" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>
          </Field>
          <Field label="Adın (isteğe bağlı)"><input value={f.author} onChange={set("author")} placeholder="Boş bırakırsan gizli kalır" className={inp} /></Field>
          <label className="flex items-start gap-3 text-xs leading-relaxed text-slate-300">
            <input type="checkbox" checked={rights} onChange={(e) => setRights(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-teal-500" />
            <span>Bu dosyayı paylaşma hakkına sahibim. Başkasına ait telifli içerik (kitap, ders slaytı vb.) yüklemiyorum. Uygunsuz içerikler kaldırılır.</span>
          </label>
          {errs.rights && <p role="alert" className="-mt-2 text-xs text-rose-300">{errs.rights}</p>}
          {errs.form && <p role="alert" className="text-sm text-rose-300">{errs.form}</p>}
          <button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl disabled:opacity-60 bg-gradient-to-r from-teal-500 to-sky-600 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/20 active:scale-[0.98]">{busy ? "Yükleniyor…" : <><Upload className="h-4 w-4" /> Notu paylaş</>}</button>
        </form>
      )}
    </Modal>
  );
}

/* ---------- Test bölümü ---------- */
// Tüm sorular özgün yazılmıştır. Yeni soru eklemek için listeye bir Q(...) satırı ekle.
// Q(kimlik, ders, konu, zorluk(1-3), soru, [5 şık], doğruŞıkSırası(0-4), açıklama)
// Not: kimlikler kalıcıdır (analiz geçmişi bunlara bağlıdır); var olan bir kimliği değiştirme.
const Q = (id, course, topic, level, text, options, answer, why) => ({ id, course, topic, level, text, options, answer, why });
const TEST_BANK = [
  Q("t01", "diz104", "Diyaliz ilkeleri", 1, "Hemodiyalizde üre gibi küçük moleküllerin kandan diyalizata geçişi esas olarak hangi mekanizmayla olur?", ["Konveksiyon", "Difüzyon", "Adsorpsiyon", "Aktif transport", "Pinositoz"], 1, "Küçük moleküller, membranın iki yanındaki konsantrasyon farkı nedeniyle yüksek konsantrasyondan düşüğe geçer. Buna difüzyon denir."),
  Q("t02", "diz104", "Diyaliz ilkeleri", 2, "Diyalizörde kan ve diyalizat akımının ters yönlü olmasının temel amacı nedir?", ["Hidrostatik basıncı düşürmek", "Membran boyunca konsantrasyon farkını yüksek tutup klirensi artırmak", "Pıhtılaşmayı önlemek", "Hava kabarcıklarını yakalamak", "Diyalizat sıcaklığını sabit tutmak"], 1, "Karşıt akımda kanın her noktası kendinden daha düşük konsantrasyonlu diyalizatla karşılaşır. Gradyan seans boyunca korunur ve klirens artar."),
  Q("t03", "diz104", "Diyaliz ilkeleri", 1, "Hemodiyalizde sıvı çekilmesinin (ultrafiltrasyon) itici gücü hangisidir?", ["Konsantrasyon farkı", "Transmembran basınç (TMP)", "Diyalizat iletkenliği", "Hematokrit düzeyi", "Diyalizat sıcaklığı"], 1, "Ultrafiltrasyon, membranın iki yanı arasındaki basınç farkıyla (TMP) gerçekleşir."),
  Q("t04", "diz104", "Diyaliz ilkeleri", 2, "Online hemodiyafiltrasyon (HDF) için aşağıdakilerden hangisi doğrudur?", ["Yalnızca difüzyonla çalışır", "Büyük hacimli konveksiyonla orta moleküllerin atılımını artırır", "Ultrasaf su gerektirmez", "Replasman sıvısı kullanılmaz", "Yalnızca akut böbrek yetmezliğinde kullanılır"], 1, "HDF difüzyona ek olarak yüksek hacimli konveksiyon uygular. Böylece β2-mikroglobulin gibi orta moleküller daha iyi temizlenir. Ultrasaf su gerekir."),
  Q("t05", "diz104", "Diyaliz ilkeleri", 3, "Bir diyalizörün KUF değeri 10 mL/saat/mmHg'dir. TMP 200 mmHg ise saatte yaklaşık kaç mL ultrafiltrasyon beklenir?", ["200 mL", "1000 mL", "2000 mL", "10 mL", "20 mL"], 2, "UF hızı = KUF × TMP. Yani 10 × 200 = 2000 mL/saat."),
  Q("t06", "diz104", "Su ve diyalizat", 2, "Su arıtma sisteminde aktif karbon filtresinin temel görevi nedir?", ["Kalsiyum ve magnezyumu tutmak", "Klor ve kloramini uzaklaştırmak", "Bakterileri tamamen öldürmek", "Tüm iyonları ayırmak", "Suyun pH'ını yükseltmek"], 1, "Klor ve kloramin eritrositlere zarar verip hemolize yol açabilir. Aktif karbon bunları tutar."),
  Q("t07", "diz104", "Su ve diyalizat", 3, "Bikarbonatlı diyalizatta asidik ve bazik konsantrelerin ayrı tutulmasının nedeni nedir?", ["Renk farkını korumak", "Kalsiyum ve magnezyumun bikarbonatla çökelmesini önlemek", "Sıcaklığı dengelemek", "Glukozun bozunmasını önlemek", "Su tüketimini azaltmak"], 1, "Karışırsa kalsiyum ve magnezyum karbonat tuzları olarak çökebilir. Bu yüzden konsantreler ayrı saklanır, makinede karıştırılır."),
  Q("t08", "diz104", "Su ve diyalizat", 2, "Sert su sendromunun temel nedeni hangisidir?", ["Suyun klor içermesi", "Diyalizatta kalsiyum ve magnezyumun aşırı yüksek olması", "Diyalizat sıcaklığının düşük olması", "Aşırı ultrafiltrasyon", "Heparin fazlalığı"], 1, "Yumuşatma yetersizse suda kalsiyum ve magnezyum artar. Bulantı, kusma, baş ağrısı ve yüzde kızarıklık görülebilir."),
  Q("t09", "diz201", "Damar giriş yolu", 1, "AV fistül koluyla ilgili aşağıdakilerden hangisi yapılmamalıdır?", ["Her gün thrill (titreşim) kontrolü", "Aynı koldan kan basıncı ölçmek ve kan almak", "Hafif egzersiz yapmak", "Cildi temiz tutmak", "Uyurken kolu baskı altında bırakmamak"], 1, "Fistül kolunda tansiyon ölçümü ve kan alma, damar giriş yoluna zarar verebileceği için önerilmez."),
  Q("t10", "diz201", "Damar giriş yolu", 2, "Yeni açılan AV fistülün olgunlaşması genellikle ne kadar sürer?", ["1-2 gün", "1 hafta", "2 hafta", "6-8 hafta", "6 ay"], 3, "Olgunlaşma çoğunlukla 6-8 hafta sürer. En erken yaklaşık 4. haftada, damar olgunlaşması değerlendirilerek iğnelenebilir."),
  Q("t11", "diz201", "Damar giriş yolu", 3, "Kateterle yapılan hemodiyalizin AV fistüle göre en önemli dezavantajı hangisidir?", ["Kan basıncı yükselmesi", "Enfeksiyon ve tromboz riskinin daha yüksek olması", "Diyalizat iletkenliğinin bozulması", "Kasılma ve kramplar", "Hipoglisemi"], 1, "Kateterler yabancı cisimdir. Kan dolaşımı enfeksiyonu, kateter trombozu ve santral ven darlığı riski taşır."),
  Q("t12", "diz201", "Makine ve alarmlar", 2, "Venöz basınç alarmı yükseldiğinde aşağıdakilerden hangisi olası bir nedendir?", ["Arteriyel iğnenin damardan çıkması", "Venöz hattın kıvrılması ya da venöz iğnede pıhtı oluşması", "Diyalizat bidonunun bitmesi", "Kan kaçağı dedektörünün ıslanması", "Diyalizat ısısının düşmesi"], 1, "Kanın dönüş yolunda engel (kıvrılma, pıhtı, damar darlığı) venöz basıncı yükseltir."),
  Q("t13", "diz201", "Makine ve alarmlar", 2, "Venöz hava dedektörü alarm verdiğinde ilk yapılacak uygun işlem hangisidir?", ["Alarmı sessize alıp devam etmek", "Kan pompasının durduğunu ve venöz klempin kapandığını doğrulayıp hava kaynağını araştırmak", "Diyalizat akımını artırmak", "Hastayı ayağa kaldırmak", "Heparin dozunu artırmak"], 1, "Güvenlik sistemi pompayı durdurur, venöz klempi kapatır. Sorumlu kişi hava kaynağını bulur ve hastaya ulaşmasını engeller."),
  Q("t14", "diz201", "Makine ve alarmlar", 1, "Kan kaçağı dedektörü alarmı en olası hangi durumu gösterir?", ["Diyalizör membranında yırtılma", "Diyalizat ısısında artış", "Suyun sertleşmesi", "Fistülde thrill kaybı", "Hasta hipotansiyonu"], 0, "Membran yırtılırsa kan diyalizat tarafına sızar ve dedektör alarm verir."),
  Q("t15", "diz201", "Makine ve alarmlar", 3, "Seans ilerledikçe TMP'nin yükselmesi, diyalizör liflerinin koyulaşması ve venöz basıncın artması hangi durumu düşündürür?", ["Diyalizörde pıhtılaşma", "Hemoliz", "Hava embolisi", "Anafilaksi", "Dengesizlik sendromu"], 0, "Lifler pıhtıyla tıkandıkça membran yüzeyi azalır, TMP ve basınçlar yükselir."),
  Q("t16", "diz201", "Makine ve alarmlar", 2, "İletkenlik alarmı sırasında makine hastayı korumak için ne yapar?", ["Kan pompasını hızlandırır", "Diyalizatı diyalizörden geçirmeden bypass eder", "Ultrafiltrasyonu iki katına çıkarır", "Venöz klempi açar", "Heparini durdurur"], 1, "Diyalizat bileşimi güvenli aralıkta değilse makine diyalizatı bypass eder. Diyalizör bu sıvıyla temas etmez."),
  Q("t17", "diz211", "Antikoagülasyon ve anemi", 1, "Hemodiyalizde heparinin etkisini izlemek için kullanılan testlerden biri hangisidir?", ["Sedimantasyon", "ACT (aktive pıhtılaşma zamanı)", "Total kolesterol", "Serum ürik asit", "İdrar yoğunluğu"], 1, "ACT ve aPTT, heparinin pıhtılaşma üzerindeki etkisini izlemekte kullanılır."),
  Q("t18", "diz211", "Antikoagülasyon ve anemi", 2, "Aktif kanaması olan bir hastada seans için uygun yaklaşım hangisidir?", ["Yüksek doz heparin vermek", "Heparinsiz diyaliz (aralıklı serum fizyolojik yıkamasıyla) ya da hekimin belirlediği düşük doz protokol", "Seansı heparin bolusuyla başlatmak", "Kan akımını düşürüp heparini artırmak", "Warfarin başlamak"], 1, "Kanaması olan hastada antikoagülan azaltılır ya da hiç kullanılmaz. Setler düzenli yıkanarak pıhtılaşma izlenir."),
  Q("t19", "diz211", "Antikoagülasyon ve anemi", 2, "Diyaliz hastalarında eritropoietin (ESA) tedavisine yetersiz yanıtın en sık nedeni hangisidir?", ["Demir eksikliği", "Hipertansiyon", "Hiperkalsemi", "Uyku bozukluğu", "Hipoglisemi"], 0, "Mutlak ya da fonksiyonel demir eksikliği en sık nedendir. Enflamasyon ve yetersiz diyaliz de yanıtı azaltır."),
  Q("t20", "diz202", "Akut komplikasyonlar", 1, "Hemodiyaliz sırasında en sık görülen akut komplikasyon hangisidir?", ["Hava embolisi", "Hipotansiyon", "Hemoliz", "Anafilaksi", "Konvülsiyon"], 1, "Seans sırasında sıvı çekilmesine bağlı hipotansiyon, en sık görülen akut komplikasyondur."),
  Q("t21", "diz202", "Akut komplikasyonlar", 2, "Seans sırasında kas kramplarında ilk yaklaşım için hangisi uygundur?", ["Ultrafiltrasyon hızını artırmak", "Ultrafiltrasyonu azaltmak ya da durdurmak ve hekim talimatıyla izotonik sıvı vermek", "Seansı hemen sonlandırmak", "Diyalizat ısısını yükseltmek", "Heparin dozunu artırmak"], 1, "Kramplar çoğunlukla hızlı sıvı çekilmesi ve damar içi hacim azalmasıyla ilişkilidir."),
  Q("t22", "diz202", "Akut komplikasyonlar", 2, "Dengesizlik (disequilibrium) sendromu riskini azaltmak için ilk seanslarda hangisi tercih edilir?", ["Uzun süre ve yüksek kan akımı", "Daha kısa süre, düşük kan akımı ve küçük yüzey alanlı diyalizör", "Çok yüksek ultrafiltrasyon", "Çok düşük sodyumlu diyalizat", "Seans öncesi uzun süre aç kalmak"], 1, "Üre ve diğer solütler yavaş düşürülürse beyin hücreleri ile kan arasındaki ozmotik fark azalır."),
  Q("t23", "diz202", "Akut komplikasyonlar", 2, "Venöz hatta koyu 'şarap rengi' kan, sırt ağrısı ve nefes darlığı görülen hastada ilk yapılacak nedir?", ["Seansa devam etmek", "Kan pompasını durdurmak, setleri klemplemek, kanı hastaya geri vermemek ve hekimi bilgilendirmek", "Kan akımını artırmak", "Heparin bolusu vermek", "Yalnızca oksijen verip devam etmek"], 1, "Bu tablo hemolizi düşündürür. Hemolize olmuş kan geri verilmez ve nedene yönelik araştırma yapılır."),
  Q("t24", "diz202", "Akut komplikasyonlar", 3, "Seans sırasında venöz hava embolisi şüphesinde hastaya hangi pozisyon verilir?", ["Sırtüstü, ayaklar aşağıda", "Sol yan yatış ve baş aşağı (Trendelenburg)", "Sağ yan yatış, oturur pozisyon", "Yüzüstü", "Ayakta"], 1, "Kan pompası durdurulur, %100 oksijen verilir ve hekim çağrılır. Pozisyon, havanın sağ ventrikül çıkışına yerleşmesini engellemeye yöneliktir."),
  Q("t25", "diz202", "Akut komplikasyonlar", 2, "Diyalizör kaynaklı anafilaktik reaksiyon düşünülen hastada ilk yapılması gereken hangisidir?", ["Seansa devam etmek", "Seansı durdurmak, setleri klemplemek, setlerdeki kanı hastaya vermemek ve acil müdahale başlatmak", "Kan akım hızını artırmak", "Diyalizatı değiştirmek", "Hastayı yalnız bırakmak"], 1, "Alerjik tepkiyi tetikleyen madde dolaşıma girmeye devam etmesin diye seans durdurulur. Acil tedavi hekim yönlendirmesiyle başlar."),
  Q("t26", "diz202", "Akut komplikasyonlar", 2, "Aşağıdakilerden hangisi diyaliz hipotansiyonunu azaltmaya yardımcı olabilir?", ["Diyalizat ısısını biraz düşürmek", "Diyaliz arası kilo artışını artırmak", "Seans başında hastaya yemek yedirmek", "Ultrafiltrasyon hızını artırmak", "Antihipertansifleri seans öncesi yüksek doz vermek"], 0, "Serin diyalizat damar tonusunu destekler. Ağır yemek ve yüksek UF hızı hipotansiyonu artırır."),
  Q("t27", "diz202", "Diyaliz yeterliliği", 1, "Kt/V ifadesinde 'V' neyi gösterir?", ["Diyalizör yüzey alanı", "Üre dağılım hacmi", "Venöz basınç", "Kan akım hızı", "Vücut yüzey alanı"], 1, "K: diyalizörün üre klirensi, t: süre, V: üre dağılım hacmi. Kt/V, verilen diyaliz dozunu gösterir."),
  Q("t28", "diz202", "Diyaliz yeterliliği", 2, "Üre azalma oranı (URR) hangi formülle hesaplanır?", ["(Öncesi üre − sonrası üre) / öncesi üre × 100", "Sonrası üre / öncesi üre", "Öncesi üre × seans süresi", "Kt × V", "(Sonrası üre − öncesi üre) × 100"], 0, "URR, seans boyunca üredeki yüzde azalmayı gösterir."),
  Q("t29", "diz202", "Diyaliz yeterliliği", 2, "Erişim (akses) resirkülasyonu yüksekse diyaliz etkinliği neden azalır?", ["Diyalizör membranı genişler", "Diyalizörden geçmiş kanın bir kısmı yeniden diyalizöre girer ve etkili klirens düşer", "Diyalizat ısısı artar", "Kan pompası durur", "Hematokrit düşer"], 1, "Arteriyel iğne, venöz iğneden dönen kanı çektiğinde temizlenmiş kan tekrar işlem görür ve vücuttan yeterli solüt uzaklaştırılamaz."),
  Q("t30", "diz202", "Diyaliz yeterliliği", 3, "Seans bitiminden kısa süre sonra kan üre düzeyinin hafifçe yükselmesi olayına ne ad verilir?", ["Rebound", "Resirkülasyon", "Ultrafiltrasyon", "Hemokonsantrasyon", "Konveksiyon"], 0, "Vücut kompartmanları arasında üre dengelenir. Bu nedenle sonrası kan örneği alınırken zamanlama önemlidir."),
  Q("t31", "diz206", "Enfeksiyon kontrolü", 1, "Diyaliz ünitesinde hastalar arası bulaşı azaltan en önemli tek uygulama hangisidir?", ["El hijyeni ve eldiven değişimi", "Seansı kısaltmak", "Diyalizat ısısını artırmak", "Sadece maske takmak", "Kapıları kapalı tutmak"], 0, "Ellerin yıkanması ve her hastada eldiven değişimi çapraz bulaşı önleyen en etkili temel önlemdir."),
  Q("t32", "diz206", "Enfeksiyon kontrolü", 2, "HBsAg pozitif hastalar için diyaliz ünitesinde önerilen yaklaşım hangisidir?", ["Diğer hastalarla aynı makine", "Ayrı oda ve ayrı makine (mümkünse ayrı personel)", "Seansı evde yaptırmak", "Yalnızca maske takmak", "Seans sonunda sadece zemin temizliği"], 1, "HBV kolay bulaşır. İzolasyon odası ve ayrılmış cihaz bulaş riskini azaltır."),
  Q("t33", "diz206", "Enfeksiyon kontrolü", 1, "Sterilizasyon için hangisi doğrudur?", ["Bakteri sporları dahil tüm mikroorganizmaların yok edilmesidir", "Yalnızca yüzeyin silinmesidir", "Dezenfeksiyonla aynıdır", "Sadece virüsleri etkiler", "Sadece suyla yıkamadır"], 0, "Dezenfeksiyon çoğu mikroorganizmayı yok eder ama sporları garanti etmez. Sterilizasyon sporları da yok eder."),
  Q("t34", "diz206", "Enfeksiyon kontrolü", 2, "Kan bulaşmış keskin bir alet batması durumunda ilk yapılacak nedir?", ["Yarayı sıkıp kanatmak ve alkolle yıkamak", "Yarayı bol su ve sabunla yıkamak, yetkiliye bildirmek ve risk değerlendirmesi için başvurmak", "Hiçbir şey yapmadan işe devam etmek", "Yarayı bandajlayıp saklamak", "Yalnızca aşı olmak"], 1, "Yara bol su ve sabunla yıkanır, sıkılmaz. Kurum prosedürüne göre bildirilir ve HBV, HCV, HIV riski değerlendirilir."),
  Q("t35", "diz203", "Böbrek hastalıkları ve elektrolit", 1, "Kronik böbrek hastalığı evre 5 hangi GFR düzeyini ifade eder?", ["15 mL/dk/1,73 m²'nin altı", "60-89", "45-59", "30-44", "90 ve üzeri"], 0, "Evre 5, GFR'nin 15 mL/dk/1,73 m²'nin altına düştüğü son dönem böbrek hastalığıdır."),
  Q("t36", "diz203", "Böbrek hastalıkları ve elektrolit", 2, "Hiperkalemide EKG'de erken görülen bulgu hangisidir?", ["Sivri (yüksek) T dalgası", "Belirgin U dalgası", "Yalnızca ST yükselmesi", "QRS'in tamamen kaybolması", "P dalgasında belirginleşme"], 0, "Hiperkalemi ilerledikçe T dalgası sivriler, sonra P kaybolur, QRS genişler."),
  Q("t37", "diz203", "Böbrek hastalıkları ve elektrolit", 2, "Ciddi hiperkalemide kalp zarını stabilize etmek için acil kullanılan ilaç hangisidir?", ["Kalsiyum glukonat", "Potasyum klorür", "Digoksin", "Atropin", "Spironolakton"], 0, "Kalsiyum potasyumu düşürmez ama kalp hücre zarını aritmilere karşı korur. Potasyumu düşürmek için başka tedavi de gerekir."),
  Q("t38", "diz203", "Böbrek hastalıkları ve elektrolit", 2, "Aşağıdakilerden hangisi akut böbrek yetmezliğinin prerenal nedenidir?", ["Ciddi dehidratasyon", "Üreter taşı", "Glomerülonefrit", "Prostat büyümesi", "Nefrotoksik ilaçlara bağlı tübül hasarı"], 0, "Prerenal: böbreğe kan akımı azalır (kanama, dehidratasyon). Taş ve prostat postrenal, tübül hasarı ve glomerülonefrit renal nedenlerdir."),
  Q("t39", "diz203", "Böbrek hastalıkları ve elektrolit", 3, "Sekonder hiperparatiroidinin gelişiminde aşağıdakilerden hangisi rol oynar?", ["Hiperfosfatemi, hipokalsemi ve aktif D vitamini eksikliği", "Yüksek aktif D vitamini düzeyi", "Hipofosfatemi", "Hiperkalsemi", "Yüksek idrar çıkışı"], 0, "Böbrek yetmezliğinde fosfat atılımı azalır, aktif D vitamini yapımı düşer, kalsiyum azalır. Paratiroidler bu yüzden aşırı çalışır."),
  Q("t40", "anatomi-fizyoloji", "Fizyoloji", 1, "Böbrekte eritrosit yapımını uyaran hormon hangisidir?", ["Eritropoietin", "İnsülin", "Aldosteron", "Tiroksin", "Glukagon"], 0, "Eritropoietin böbrekte yapılır ve kemik iliğinde eritrosit üretimini uyarır. Böbrek yetmezliğinde azalması anemiye yol açar."),
  Q("t41", "anatomi-fizyoloji", "Fizyoloji", 2, "Glomerüler filtrasyon bariyerinden normalde hangisi geçemez?", ["Su", "Üre", "Albümin gibi büyük proteinler ve kan hücreleri", "Glukoz", "Sodyum"], 2, "Sağlıklı glomerül küçük molekülleri süzer, büyük proteinleri ve hücreleri tutar. İdrarda albümin ya da eritrosit görülmesi hasarı düşündürür."),
  Q("t42", "diz107", "Böbrek hastalıkları ve elektrolit", 1, "Metabolik asidozda kan bikarbonat düzeyi nasıl değişir?", ["Düşer", "Artar", "Değişmez", "Yalnızca potasyuma bağlı değişir", "Ölçülemez"], 0, "Metabolik asidozda bikarbonat azalır. Diyalizatta bikarbonat bu açığı kapatmaya yardımcı olur."),
];

const LV = ["", "Kolay", "Orta", "Zor"];
const LV_CLS = ["", "bg-teal-500/25 text-teal-100", "bg-amber-500/25 text-amber-100", "bg-rose-500/25 text-rose-100"];
const LETTERS = ["A", "B", "C", "D", "E"];
const pctColor = (p) => (p < 50 ? "bg-rose-500" : p < 70 ? "bg-amber-400" : "bg-teal-400");
const tally = (rows, key) => {
  const m = {};
  rows.forEach((r) => { const k = key(r); m[k] = m[k] || { label: k, ok: 0, total: 0 }; m[k].total += 1; if (r.correct) m[k].ok += 1; });
  return Object.values(m).sort((a, b) => a.ok / a.total - b.ok / b.total);
};

function Bars({ rows }) {
  return (
    <div className="space-y-3">
      {rows.map((r) => {
        const p = Math.round((r.ok / r.total) * 100);
        return (
          <div key={r.label}>
            <div className="mb-1 flex justify-between gap-3 text-xs"><span className="truncate text-slate-200">{r.label}</span><span className="shrink-0 text-slate-400">{r.ok}/{r.total} · %{p}</span></div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/10"><div className={`h-full rounded-full ${pctColor(p)}`} style={{ width: `${p}%` }} /></div>
          </div>
        );
      })}
    </div>
  );
}

function TestPage({ hist, onSave, loggedIn, onLogin }) {
  const [tab, setTab] = useState("solve");
  const [phase, setPhase] = useState("setup");
  const [cfg, setCfg] = useState({ course: "all", level: 0, count: 10, mode: "practice" });
  const [queue, setQueue] = useState([]);
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState({});
  const [shown, setShown] = useState(false);
  const [openWrong, setOpenWrong] = useState(null);

  const courses = [...new Set(TEST_BANK.map((q) => q.course))];
  const pool = TEST_BANK.filter((q) => (cfg.course === "all" || q.course === cfg.course) && (!cfg.level || q.level === cfg.level));
  const total = cfg.count === 0 ? pool.length : Math.min(cfg.count, pool.length);
  const top = () => window.scrollTo({ top: 0 });

  const start = (ids) => {
    const src = ids ? TEST_BANK.filter((q) => ids.includes(q.id)) : pool;
    const n = ids || cfg.count === 0 ? src.length : cfg.count;
    const list = shuffle(src).slice(0, n).map((q) => {
      const order = shuffle(q.options.map((_, k) => k));
      return { ...q, options: order.map((k) => q.options[k]), answer: order.indexOf(q.answer) };
    });
    if (!list.length) return;
    setQueue(list); setI(0); setPicks({}); setShown(false); setOpenWrong(null); setPhase("run"); top();
  };
  const finish = () => {
    onSave(queue.map((q) => ({ question_id: q.id, course: q.course, topic: q.topic, correct: picks[q.id] === q.answer })));
    setPhase("result"); top();
  };

  const chip = (on, label, onClick) => (
    <button type="button" onClick={onClick} className={`rounded-full px-4 py-2 text-sm font-medium transition ${on ? "bg-teal-500 text-slate-950" : "border border-sky-300/15 bg-[#0a1a30]/90 text-slate-300 hover:bg-white/10"}`}>{label}</button>
  );
  const card = "rounded-3xl border border-sky-300/15 bg-[#0a1a30]/90 p-4 backdrop-blur-xl";

  /* ---- Giriş zorunlu ---- */
  if (sb && !loggedIn) {
    return (
      <section className="mx-auto max-w-2xl">
        <SectionHead title="Test" desc="Derslere göre soru çöz, hangi konuda eksiğin olduğunu gör." />
        <div className={`${card} text-center`}>
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal-500/25 text-teal-100 ring-1 ring-teal-400/50"><ClipboardList className="h-8 w-8" /></div>
          <h3 className="mt-4 font-display text-xl font-bold text-white">Test çözmek için giriş yap</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">Testler sadece topluluk üyelerine açık. Üye olunca sonuçların ve analizin hesabında saklanır, hangi konuda eksiğin olduğunu görürsün.</p>
          <button onClick={onLogin} className="mt-5 w-full rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/20 active:scale-[0.98]">Giriş yap / Kayıt ol</button>
        </div>
      </section>
    );
  }

  /* ---- Çözüm ekranı ---- */
  if (phase === "run") {
    const q = queue[i];
    const sel = picks[q.id];
    const practice = cfg.mode === "practice";
    const last = i + 1 === queue.length;
    const cls = (oi) => {
      if (!(practice && shown)) return sel === oi ? "border-teal-300 bg-teal-500/20" : "border-sky-300/15 hover:bg-white/10";
      if (oi === q.answer) return "border-teal-400 bg-teal-500/25";
      if (oi === sel) return "border-rose-400 bg-rose-500/25";
      return "border-sky-300/15 opacity-60";
    };
    return (
      <section className="mx-auto max-w-2xl">
        <div className="mb-3 flex items-center justify-between text-sm text-slate-300">
          <span>Soru {i + 1} / {queue.length}</span>
          <button onClick={() => setPhase("setup")} className="text-xs text-slate-400 underline underline-offset-2 hover:text-slate-200">Testi bırak</button>
        </div>
        <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-teal-400 transition-all" style={{ width: `${((i + 1) / queue.length) * 100}%` }} /></div>
        <article className={card}>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-slate-200">{catOf(q.course).short}</span>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-slate-300">{q.topic}</span>
            <span className={`rounded-full px-2.5 py-1 ${LV_CLS[q.level]}`}>{LV[q.level]}</span>
          </div>
          <h3 className="mt-3 font-display text-lg font-bold leading-snug text-white">{q.text}</h3>
          <div className="mt-4 space-y-2.5">
            {q.options.map((o, oi) => (
              <button key={oi} onClick={() => { if (practice && shown) return; setPicks({ ...picks, [q.id]: oi }); if (practice) setShown(true); }} className={`flex w-full items-start gap-3 rounded-xl border px-3.5 py-3 text-left text-sm transition active:scale-[0.99] ${cls(oi)}`}>
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-semibold text-slate-200">{LETTERS[oi]}</span>
                <span className="pt-0.5 text-slate-100">{o}</span>
              </button>
            ))}
          </div>
          {practice && shown && (
            <div className={`pop mt-4 rounded-2xl border p-4 ${sel === q.answer ? "border-teal-400/50 bg-teal-500/20" : "border-amber-400/50 bg-amber-500/20"}`}>
              <p className={`text-sm font-semibold ${sel === q.answer ? "text-teal-200" : "text-amber-200"}`}>{sel === q.answer ? "Doğru!" : `Doğru cevap: ${LETTERS[q.answer]}`}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-200">{q.why}</p>
            </div>
          )}
        </article>
        <button onClick={() => { if (last) return finish(); setI(i + 1); setShown(false); top(); }} disabled={practice && !shown} className="mt-4 w-full rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/20 active:scale-[0.98] disabled:opacity-40">{last ? "Testi bitir" : "Sonraki soru"}</button>
      </section>
    );
  }

  /* ---- Sonuç ekranı ---- */
  if (phase === "result") {
    const wrong = queue.filter((q) => picks[q.id] !== q.answer);
    const okN = queue.length - wrong.length;
    const pct = Math.round((okN / queue.length) * 100);
    const topics = tally(queue.map((q) => ({ topic: q.topic, correct: picks[q.id] === q.answer })), (r) => r.topic);
    return (
      <section className="mx-auto max-w-2xl">
        <div className={`${card} text-center`}>
          <p className="text-sm text-slate-400">Sonucun</p>
          <p className="font-display text-5xl font-extrabold text-white">%{pct}</p>
          <p className="mt-1 text-sm text-slate-300">{okN} doğru, {wrong.length} yanlış ({queue.length} soru)</p>
          <p className="mt-2 text-sm font-medium text-teal-200">{pct >= 85 ? "Harika gidiyorsun!" : pct >= 70 ? "Çok iyi, biraz daha pekiştir." : pct >= 50 ? "Fena değil. Yanlışlarına bak ve tekrar dene." : "Bu konulara biraz daha çalışalım."}</p>
        </div>
        <h3 className="mb-2 mt-5 font-display text-lg font-bold text-white">Konulara göre</h3>
        <div className={card}><Bars rows={topics} /></div>
        {wrong.length > 0 && (
          <>
            <h3 className="mb-2 mt-5 font-display text-lg font-bold text-white">Yanlışların</h3>
            <div className="space-y-2">
              {wrong.map((q) => (
                <div key={q.id} className={card}>
                  <button onClick={() => setOpenWrong(openWrong === q.id ? null : q.id)} aria-expanded={openWrong === q.id} className="flex w-full items-start justify-between gap-3 text-left text-sm font-medium text-slate-100">
                    {q.text}<ChevronDown className={`mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition ${openWrong === q.id ? "rotate-180" : ""}`} />
                  </button>
                  {openWrong === q.id && (
                    <div className="pop mt-3 space-y-2 text-sm">
                      <p className="text-rose-200">Senin cevabın: {picks[q.id] === undefined ? "Boş bıraktın" : q.options[picks[q.id]]}</p>
                      <p className="text-teal-200">Doğru cevap: {q.options[q.answer]}</p>
                      <p className="leading-relaxed text-slate-300">{q.why}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
        <div className="mt-5 grid gap-3">
          {wrong.length > 0 && <button onClick={() => start(wrong.map((q) => q.id))} className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 px-4 py-3 text-sm font-semibold text-slate-950"><RotateCw className="h-4 w-4" /> Yanlışlarımı tekrar çöz</button>}
          <button onClick={() => { setPhase("setup"); setTab("stats"); top(); }} className="rounded-xl border border-sky-300/15 px-4 py-3 text-sm text-slate-100 hover:bg-white/5">Genel analizime bak</button>
          <button onClick={() => { setPhase("setup"); top(); }} className="rounded-xl border border-sky-300/15 px-4 py-3 text-sm text-slate-100 hover:bg-white/5">Yeni test</button>
        </div>
      </section>
    );
  }

  /* ---- Hazırlık ve analiz ---- */
  const okAll = hist.filter((r) => r.correct).length;
  const byTopic = tally(hist, (r) => r.topic);
  const byCourse = tally(hist, (r) => catOf(r.course).short);
  const weak = byTopic.filter((t) => t.total >= 3 && t.ok / t.total < 0.7).slice(0, 3);

  return (
    <section className="mx-auto max-w-2xl">
      <SectionHead title="Test" desc="Derslere göre soru çöz, hangi konuda eksiğin olduğunu gör." />
      <div className="mb-4 flex gap-1 rounded-xl bg-white/5 p-1">
        {[["solve", "Test çöz"], ["stats", "Analizim"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={`flex-1 rounded-lg py-2 text-sm font-semibold ${tab === id ? "bg-teal-500 text-slate-950" : "text-slate-300"}`}>{label}</button>
        ))}
      </div>

      {tab === "solve" && (
        <div className={`${card} space-y-5`}>
          <div>
            <p className="mb-2 text-sm font-medium text-slate-200">Mod</p>
            <div className="flex flex-wrap gap-2">{chip(cfg.mode === "practice", "Alıştırma", () => setCfg({ ...cfg, mode: "practice" }))}{chip(cfg.mode === "exam", "Sınav", () => setCfg({ ...cfg, mode: "exam" }))}</div>
            <p className="mt-2 text-xs text-slate-400">{cfg.mode === "practice" ? "Her soruda cevap ve açıklama hemen görünür." : "Sonuçlar ve açıklamalar test bitince gösterilir."}</p>
          </div>
          <Field label="Ders">
            <select value={cfg.course} onChange={(e) => setCfg({ ...cfg, course: e.target.value })} className={inp}>
              <option value="all" className="bg-slate-900">Tüm dersler ({TEST_BANK.length} soru)</option>
              {courses.map((c) => <option key={c} value={c} className="bg-slate-900">{catOf(c).short} · {catOf(c).name} ({TEST_BANK.filter((q) => q.course === c).length})</option>)}
            </select>
          </Field>
          <div>
            <p className="mb-2 text-sm font-medium text-slate-200">Zorluk</p>
            <div className="flex flex-wrap gap-2">{[0, 1, 2, 3].map((l) => <span key={l}>{chip(cfg.level === l, l ? LV[l] : "Hepsi", () => setCfg({ ...cfg, level: l }))}</span>)}</div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-slate-200">Soru sayısı</p>
            <div className="flex flex-wrap gap-2">{[10, 20, 0].map((n) => <span key={n}>{chip(cfg.count === n, n ? String(n) : "Hepsi", () => setCfg({ ...cfg, count: n }))}</span>)}</div>
          </div>
          <button onClick={() => start()} disabled={total === 0} className="w-full rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 px-4 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/20 active:scale-[0.98] disabled:opacity-40">{total === 0 ? "Bu seçimde soru yok" : `Teste başla (${total} soru)`}</button>
          <p className="text-xs leading-relaxed text-slate-500">Sorular öğrenme amaçlıdır; klinik uygulamada kurumunuzun protokolü ve hekim talimatı esastır.</p>
        </div>
      )}

      {tab === "stats" && (
        hist.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-sky-300/20 p-8 text-center">
            <p className="font-medium text-white">Henüz çözülmüş soru yok.</p>
            <p className="mt-1 text-sm text-slate-400">Bir test çözünce analizin burada görünür.</p>
            <button onClick={() => setTab("solve")} className="mt-4 rounded-full bg-teal-500 px-5 py-2.5 text-sm font-semibold text-slate-950">Test çöz</button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className={card}><div className="font-display text-2xl font-bold text-white">{hist.length}</div><div className="text-xs text-slate-400">çözülen soru</div></div>
              <div className={card}><div className="font-display text-2xl font-bold text-white">%{Math.round((okAll / hist.length) * 100)}</div><div className="text-xs text-slate-400">doğru oranı</div></div>
            </div>
            <div className={card}>
              <h3 className="font-display text-lg font-bold text-white">Önce şuralara çalış</h3>
              {weak.length === 0 ? (
                <p className="mt-2 text-sm text-slate-300">{byTopic.some((t) => t.total >= 3) ? "Çözdüğün konularda %70'in altında kalan konu yok. Böyle devam!" : "Konu önerisi için her konudan en az 3 soru çözmen gerekiyor."}</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {weak.map((t) => (
                    <li key={t.label} className="rounded-xl bg-rose-500/15 px-3 py-2.5 text-sm text-slate-100">
                      <span className="font-semibold text-rose-100">{t.label}</span> · %{Math.round((t.ok / t.total) * 100)} <span className="text-slate-400">({catOf(TEST_BANK.find((q) => q.topic === t.label)?.course).short})</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className={card}><h3 className="mb-3 font-display text-lg font-bold text-white">Konulara göre</h3><Bars rows={byTopic} /></div>
            <div className={card}><h3 className="mb-3 font-display text-lg font-bold text-white">Derslere göre</h3><Bars rows={byCourse} /></div>
            {!loggedIn && <p className="text-xs leading-relaxed text-slate-500">Giriş yaparsan sonuçların hesabında saklanır. Şimdilik bu cihazda tutuluyor.</p>}
          </div>
        )
      )}
    </section>
  );
}

/* ---------- Site içi onay penceresi (tarayıcının kendi penceresi yerine) ---------- */
let confirmHandler = null;
const ask = (message, opts = {}) => (confirmHandler ? confirmHandler(message, opts) : Promise.resolve(false));

function ConfirmHost() {
  const [st, setSt] = useState(null);
  useEffect(() => {
    confirmHandler = (message, opts) => new Promise((resolve) => setSt({ message, opts, resolve }));
    return () => { confirmHandler = null; };
  }, []);
  if (!st) return null;
  const { message, opts } = st;
  const done = (v) => { st.resolve(v); setSt(null); };
  return (
    <Modal open onClose={() => done(false)} title={opts.title || "Onay"}>
      <div className="text-center">
        <div className={`mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full ring-1 ${opts.danger ? "bg-rose-500/25 text-rose-100 ring-rose-400/50" : "bg-teal-500/25 text-teal-100 ring-teal-400/50"}`}>{opts.danger ? <Trash2 className="h-7 w-7" /> : <Check className="h-7 w-7" />}</div>
        <h3 className="font-display text-xl font-bold text-white">{opts.title || "Emin misin?"}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">{message}</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button onClick={() => done(false)} className="rounded-xl border border-sky-300/15 px-4 py-3 text-sm text-slate-200 hover:bg-white/5">Vazgeç</button>
          <button onClick={() => done(true)} className={`rounded-xl px-4 py-3 text-sm font-semibold active:scale-[0.98] ${opts.danger ? "bg-rose-500 text-white" : "bg-gradient-to-r from-teal-500 to-sky-600 text-slate-950"}`}>{opts.confirmText || "Evet"}</button>
        </div>
      </div>
    </Modal>
  );
}

/* ---------- Düello ---------- */
const pad2 = (n) => String(n).padStart(2, "0");
const clock = (sec) => {
  const s = Math.max(0, Math.floor(sec)), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  return h ? `${h}:${pad2(m)}:${pad2(s % 60)}` : `${pad2(m)}:${pad2(s % 60)}`;
};
const dtText = (iso) => new Date(iso).toLocaleString("tr-TR", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
const hm = (iso) => new Date(iso).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
const MEDAL = ["", "🥇", "🥈", "🥉"];

// Sınıf: profilde "giriş yılı" saklanır, sınıf her Eylülde kendiliğinden hesaplanır (sunucudaki class_year_of ile aynı kural).
const academicStart = () => {
  const p = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Istanbul", year: "numeric", month: "numeric" }).formatToParts(new Date());
  const y = Number(p.find((x) => x.type === "year").value), m = Number(p.find((x) => x.type === "month").value);
  return m >= 9 ? y : y - 1;
};
const classOf = (entry) => (typeof entry === "number" ? academicStart() - entry + 1 : null);
const classLabel = (c) => (c === 1 || c === 2 ? `${c}. Sınıf` : c >= 3 ? "Mezun" : "");

function ClassChip({ entry, onClass }) {
  const c = classOf(entry);
  return (
    <div className="mt-2 flex items-center justify-center gap-2">
      {(c === 1 || c === 2) && <span className="inline-flex items-center rounded-full bg-sky-500/25 px-3 py-1 text-xs text-sky-100 ring-1 ring-sky-400/50">{c}. Sınıf Takımı</span>}
      {c >= 3 && <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">Mezun</span>}
      {onClass && !(c >= 3) && <button type="button" onClick={onClass} className="text-xs text-teal-200 underline underline-offset-2">{c === 1 || c === 2 ? "Değiştir" : "Sınıfını seç"}</button>}
    </div>
  );
}

// Yapay zekâya soru yazdırırken kullanılacak istem (yönetim panelinde kopyalanır)
const AI_PROMPT = `Hemodiyaliz teknikerliği öğrencileri için ORTA ve ZOR düzeyde çoktan seçmeli sorular yaz. Her soru tam olarak şu biçimde olsun, sorular arasına tek satır --- koy:
DERS: ...
KONU: ...
ZORLUK: Orta veya Zor
SORU: ...
A) ...
B) ...
C) ...
D) ...
E) ...
DOĞRU CEVAP: (tek harf)
AÇIKLAMA: ... (1-2 cümle)
Kurallar: 5 şık olsun. TÜM ŞIKLAR BENZER UZUNLUKTA olsun; doğru şık diğerlerinden daha uzun ya da daha ayrıntılı olmasın. Doğru şık harfleri dengeli dağılsın. "Hepsi" ya da "Hiçbiri" şıkkı kullanma. Güncel kılavuzlara (KDIGO, ISPD, ISO/AAMI) uygun yaz, eski eşik değerleri kullanma. Klinik vakalı sorular da olsun.`;

const parseQuestions = (txt) => {
  const ok = [];
  let bad = 0;
  txt.split(/^\s*-{3,}\s*$/m).map((b) => b.trim()).filter(Boolean).forEach((blk) => {
    const f = { opts: [] };
    let cur = null;
    blk.split("\n").forEach((raw) => {
      const line = raw.trim();
      if (!line) return;
      let m;
      if ((m = line.match(/^(DERS|KONU|ZORLUK|SORU|DOĞRU CEVAP|AÇIKLAMA)\s*:\s*(.*)$/i))) { cur = m[1].toUpperCase(); f[cur] = m[2]; }
      else if ((m = line.match(/^([A-E])\s*[).]\s*(.*)$/))) { cur = "OPT"; f.opts.push(m[2]); }
      else if (cur === "OPT") f.opts[f.opts.length - 1] += " " + line;
      else if (cur) f[cur] += " " + line;
    });
    const ans = "ABCDE".indexOf(((f["DOĞRU CEVAP"] || "").trim()[0] || "").toUpperCase());
    const lvl = { KOLAY: 1, ORTA: 2, ZOR: 3 }[(f.ZORLUK || "").trim().toUpperCase()] || 2;
    if (!f.SORU || f.opts.length !== 5 || ans < 0) { bad += 1; return; }
    ok.push({ topic: (f.KONU || f.DERS || "Genel").trim().slice(0, 120), level: lvl, text: f.SORU.trim(), options: f.opts.map((o) => o.trim()), answer: ans, why: (f["AÇIKLAMA"] || "").trim() });
  });
  return { ok, bad };
};

async function makeMedalImage({ rank, name, title, correct, total, used_sec, ends_at }) {
  const W = 1080, H = 1920;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d");
  const th = [null, { a: "#f7e08a", b: "#c9971c", t: "ALTIN" }, { a: "#eef2f8", b: "#8fa0b5", t: "GÜMÜŞ" }, { a: "#f3b988", b: "#a45a22", t: "BRONZ" }][rank] || { a: "#8be0d4", b: "#0d9488", t: "" };
  try { await document.fonts?.ready; } catch { /* yoksay */ }
  const fit = (txt, size, weight, max) => { let s = size; do { g.font = `${weight} ${s}px 'Bricolage Grotesque', system-ui, sans-serif`; s -= 4; } while (g.measureText(txt).width > max && s > 28); };
  const bg = g.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#040b17"); bg.addColorStop(1, "#0b2a4a");
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  const glow = g.createRadialGradient(W / 2, 800, 40, W / 2, 800, 700);
  glow.addColorStop(0, th.b + "88"); glow.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = glow; g.fillRect(0, 0, W, H);
  const img = await new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = LOGO_SRC; });
  if (img) { g.save(); g.beginPath(); g.arc(W / 2, 250, 130, 0, Math.PI * 2); g.clip(); g.drawImage(img, W / 2 - 130, 120, 260, 260); g.restore(); }
  g.textAlign = "center";
  g.fillStyle = "#cfe3f5"; fit("AFSÜ DİYALİZ TEAM · DÜELLO", 46, 600, 940); g.fillText("AFSÜ DİYALİZ TEAM · DÜELLO", W / 2, 470);
  const mg = g.createLinearGradient(W / 2 - 240, 560, W / 2 + 240, 1040);
  mg.addColorStop(0, th.a); mg.addColorStop(1, th.b);
  g.fillStyle = mg; g.beginPath(); g.arc(W / 2, 800, 240, 0, Math.PI * 2); g.fill();
  g.lineWidth = 14; g.strokeStyle = "rgba(255,255,255,.35)"; g.stroke();
  g.fillStyle = "#1b1405"; g.font = "800 320px 'Bricolage Grotesque', system-ui, sans-serif"; g.fillText(String(rank), W / 2, 915);
  g.fillStyle = "#ffffff"; fit("TEBRİKLER", 110, 800, 940); g.fillText("TEBRİKLER", W / 2, 1180);
  g.fillStyle = th.a; fit(name, 96, 800, 940); g.fillText(name, W / 2, 1300);
  g.fillStyle = "#e6f0fa"; fit(`Düelloda ${rank}. oldu`, 64, 600, 940); g.fillText(`Düelloda ${rank}. oldu`, W / 2, 1385);
  g.fillStyle = "#ffffff"; fit(`${correct}/${total} doğru · ${clock(used_sec)}`, 76, 700, 940); g.fillText(`${correct}/${total} doğru · ${clock(used_sec)}`, W / 2, 1520);
  g.fillStyle = "#9fb7cf"; fit(title, 48, 500, 940); g.fillText(title, W / 2, 1610);
  g.fillText(new Date(ends_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }), W / 2, 1670);
  g.fillStyle = th.a; g.font = "700 52px system-ui, sans-serif"; g.fillText("@afsudiyalizteam", W / 2, 1820);
  return new Promise((res) => c.toBlob(res, "image/png"));
}

function PodiumModal({ pod, name, onClose }) {
  const [busy, setBusy] = useState(false);
  if (!pod) return null;
  const download = async () => {
    setBusy(true);
    try {
      const blob = await makeMedalImage({ ...pod, name });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `afsu-diyaliz-duello-${pod.rank}.png`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 3000);
    } catch { /* görsel oluşturulamadı */ }
    setBusy(false);
  };
  return (
    <Modal open onClose={onClose} title="Tebrikler">
      <div className="text-center">
        <div className="text-7xl">{MEDAL[pod.rank]}</div>
        <h3 className="mt-3 font-display text-2xl font-bold text-white">Tebrikler, düelloda {pod.rank}. oldun!</h3>
        <p className="mt-2 text-sm text-slate-300">{pod.title} · {pod.correct}/{pod.total} doğru · {clock(pod.used_sec)}</p>
        <div className="mt-5 grid gap-3">
          <button onClick={download} disabled={busy} className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60"><Download className="h-4 w-4" /> {busy ? "Hazırlanıyor…" : "Instagram görselini indir"}</button>
          <button onClick={onClose} className="rounded-xl border border-sky-300/15 px-4 py-3 text-sm text-slate-200 hover:bg-white/5">Kapat</button>
        </div>
      </div>
    </Modal>
  );
}

function ClassPickModal({ open, onClose, onSaved, current }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [sel, setSel] = useState(null);
  useEffect(() => { if (open) { setSel(null); setErr(""); } }, [open]);
  const save = async () => {
    if (!sel) return;
    setBusy(true); setErr("");
    const { error } = await sb.rpc("set_my_class", { p_class: sel });
    setBusy(false);
    if (error) return setErr("Kaydedilemedi. Biraz sonra tekrar dene.");
    onSaved(sel);
  };
  const opt = (c, desc) => (
    <button type="button" aria-pressed={sel === c} disabled={busy} onClick={() => setSel(c)} className={`w-full rounded-2xl border px-4 py-4 text-left transition active:scale-[0.99] disabled:opacity-50 ${sel === c ? "border-amber-300 bg-amber-500/20 ring-2 ring-amber-300/60" : "border-sky-300/20 bg-white/5 hover:bg-white/10"}`}>
      <span className="flex items-center justify-between gap-3">
        <span className="block font-display text-lg font-bold text-white">{c}. Sınıf</span>
        {sel === c ? <span className="text-sm font-semibold text-amber-200">Seçildi ✓</span> : current === c ? <span className="text-xs text-slate-400">Şu anki sınıfın</span> : null}
      </span>
      <span className="text-xs text-slate-400">{desc}</span>
    </button>
  );
  return (
    <Modal open={open} onClose={onClose} title="Sınıfını seç">
      <div className="space-y-3">
        <p className="text-sm leading-relaxed text-slate-300">Hangi sınıftasın? Sınıf yarışında takımına dahil olursun ve düello sonuçlarında takımın görünür. İstediğin zaman profilinden değiştirebilirsin.</p>
        {opt(1, "Bu yıl başladım")}
        {opt(2, "Geçen yıl başladım")}
        {sel && (
          <div className="pop rounded-2xl border border-amber-300/40 bg-amber-500/10 p-4 text-center">
            <p className="text-sm text-slate-100"><span className="font-semibold text-white">{sel}. Sınıf Takımı</span> olarak devam edilsin mi?</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setSel(null)} disabled={busy} className="rounded-xl border border-sky-300/20 px-4 py-3 text-sm text-slate-200 hover:bg-white/5 disabled:opacity-50">Vazgeç</button>
              <button type="button" onClick={save} disabled={busy} className="rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60">{busy ? "Kaydediliyor…" : "Onayla"}</button>
            </div>
          </div>
        )}
        {err && <p role="alert" className="text-sm text-rose-300">{err}</p>}
        <button type="button" onClick={onClose} className="w-full py-2 text-sm text-slate-400 hover:text-slate-200">Sonra</button>
      </div>
    </Modal>
  );
}

function ClassCard({ cls, total, card }) {
  const rows = cls.classes || [];
  const both = rows.length === 2 && rows.every((c) => c.enough);
  const num = (v) => String(v).replace(".", ",");
  return (
    <div className={`${card} mt-3`}>
      <h3 className="font-display text-lg font-bold text-white">Sınıf yarışı</h3>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {rows.map((c) => (
          <div key={c.class} className={`rounded-2xl border p-3 text-center ${cls.leader === c.class ? "border-amber-300/60 bg-amber-500/15" : "border-sky-300/15 bg-white/5"}`}>
            <p className="text-xs font-semibold text-slate-300">{c.class}. Sınıf Takımı{cls.leader === c.class ? " 🏆" : ""}</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-white">{c.rate == null ? "–" : `%${num(c.rate)}`}</p>
            <p className="text-[11px] text-slate-400">katılım · {c.participants}/{c.members} kişi</p>
            {c.avg_correct != null && <p className="mt-2 text-xs text-slate-300">Ortalama {num(c.avg_correct)}/{total} doğru</p>}
            {c.top && <p className="mt-1 truncate text-xs text-slate-400">Sınıf birincisi: <span className="text-slate-200">{c.top.name}</span></p>}
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-xs leading-relaxed text-slate-400">
        {cls.leader ? `Katılım şampiyonu ${cls.leader}. Sınıf Takımı oldu.` : both ? "İki sınıfın katılım oranı eşit." : "Katılım şampiyonu için her sınıftan en az 3 kişinin katılması gerekir."} İlk dönemde takımlar katılım oranıyla yarışır, ortalama doğru sayısı bilgi amaçlıdır.
      </p>
      {cls.my_class && cls.my_rank && <p className="mt-1 text-center text-xs text-teal-200">Kendi sınıfında {cls.my_rank}. sıradasın.</p>}
      {cls.unclassified > 0 && <p className="mt-1 text-center text-[11px] text-slate-500">{cls.unclassified} katılımcının sınıfı seçili olmadığı için takımlara dahil edilmedi.</p>}
    </div>
  );
}

function KarnePage({ user, onLogin, quizHist, embedded }) {
  const [data, setData] = useState(null);
  const [state, setState] = useState("loading");
  const [more, setMore] = useState(false);
  const uid = user?.id;
  const card = "rounded-3xl border border-sky-300/15 bg-[#0a1a30]/90 p-4 backdrop-blur-xl";
  const head = embedded ? null : <SectionHead title="Karnem" desc="Düello ve test sonuçlarından kişisel analizin. Bir konuda en az 5 soru çözmeden o konu için yorum yapılmaz." />;

  useEffect(() => {
    if (!sb || !uid) return undefined;
    let off = false;
    setState("loading");
    sb.rpc("my_analysis").then(({ data: d, error }) => {
      if (off) return;
      if (error || !d) setState("error"); else { setData(d); setState("ok"); }
    });
    return () => { off = true; };
  }, [uid]);

  if (!user) {
    return (
      <section className="mx-auto max-w-2xl">{head}
        <div className={`${card} text-center`}>
          <p className="text-sm text-slate-300">Karnemi görmek için giriş yap.</p>
          <button onClick={onLogin} className="mt-4 w-full rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 px-4 py-3 text-sm font-semibold text-slate-950">Giriş yap / Kayıt ol</button>
        </div>
      </section>
    );
  }
  if (state === "loading") return <section className="mx-auto max-w-2xl">{head}<p className="text-center text-sm text-slate-400">Karnen hazırlanıyor…</p></section>;
  if (state === "error") return <section className="mx-auto max-w-2xl">{head}<div className={card}><p className="text-sm text-slate-300">Karnen şu an açılamadı. Biraz sonra tekrar dene.</p></div></section>;

  const min = data.min_n || 5;
  const pct = (t) => (t.total ? Math.round((t.correct / t.total) * 100) : 0);
  const level = (p) => (p < 50 ? { t: "Zayıf, tekrar et", c: "text-rose-300" } : p < 70 ? { t: "Orta", c: "text-amber-200" } : { t: "Güçlü", c: "text-teal-200" });
  const topics = data.topics || [];
  const ready = topics.filter((t) => t.enough).sort((a, b) => pct(a) - pct(b));
  const waiting = topics.filter((t) => !t.enough);
  const totalAns = topics.reduce((n, t) => n + t.total, 0);
  const totalOk = topics.reduce((n, t) => n + t.correct, 0);
  const weak = ready.filter((t) => pct(t) < 70).slice(0, 3);
  const duelsList = data.duels || [];
  const dp = (d) => (d.answered ? Math.round((d.correct / d.answered) * 100) : 0);
  const diff = duelsList.length >= 2 ? dp(duelsList[0]) - dp(duelsList[1]) : null;
  const wrong = data.wrong || [];

  // Test bölümü (bu cihazdaki / hesaptaki alıştırma sonuçları)
  const tm = {};
  (quizHist || []).forEach((r) => { const k = (r.topic || "Genel").trim(); tm[k] = tm[k] || { topic: k, total: 0, correct: 0 }; tm[k].total += 1; if (r.correct) tm[k].correct += 1; });
  const testTopics = Object.values(tm).map((t) => ({ ...t, enough: t.total >= min })).sort((a, b) => (b.enough - a.enough) || (pct(a) - pct(b)));

  const row = (t) => {
    const p = pct(t);
    const lv = level(p);
    return (
      <div key={t.topic}>
        <div className="mb-1 flex items-center justify-between gap-3 text-xs">
          <span className="truncate text-slate-200">{t.topic}</span>
          <span className="shrink-0 text-slate-400">{t.correct}/{t.total} · %{p}</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-white/10"><div className={`h-full rounded-full ${t.enough ? pctColor(p) : "bg-slate-500/60"}`} style={{ width: `${p}%` }} /></div>
        <p className="mt-1 text-[11px] text-slate-500">
          {t.enough ? <span className={lv.c}>{lv.t}</span> : t.total === 0 ? "Bu konuda cevap vermedin" : `Yorum için ${min - t.total} soru daha çöz`}
          {t.class_pct != null && ` · Sınıf ortalaması %${t.class_pct}`}
        </p>
      </div>
    );
  };

  return (
    <section className="mx-auto max-w-2xl">
      {head}
      <div className={`${card} text-center`}>
        {totalAns > 0 ? (
          <>
            <p className="text-sm text-slate-400">Düellolardaki genel başarın</p>
            <p className="font-display text-4xl font-extrabold text-white">%{Math.round((totalOk / totalAns) * 100)}</p>
            <p className="text-xs text-slate-400">{totalAns} soru cevapladın · {duelsList.length} düello{data.my_class ? ` · ${data.my_class}. Sınıf Takımı` : ""}</p>
          </>
        ) : (
          <p className="text-sm leading-relaxed text-slate-300">Henüz sonucu açılmış bir düello cevabın yok. Düello bitince sonuçların burada konu konu görünecek.</p>
        )}
      </div>

      <h3 className="mb-2 mt-5 font-display text-lg font-bold text-white">Önce şunlara çalış</h3>
      <div className={card}>
        {ready.length === 0
          ? <p className="text-sm leading-relaxed text-slate-300">Henüz hiçbir konuda yeterli veri yok. Bir konuda en az {min} soru çözdüğünde analiz başlar.</p>
          : weak.length === 0
            ? <p className="text-sm leading-relaxed text-teal-100">Yeterli veri olan tüm konularında %70 ve üzerindesin. Böyle devam!</p>
            : <div className="space-y-3">{weak.map(row)}</div>}
      </div>

      {(ready.length > 0 || waiting.length > 0) && (
        <>
          <h3 className="mb-2 mt-5 font-display text-lg font-bold text-white">Konularım</h3>
          <div className={`${card} space-y-3`}>{[...ready, ...waiting].map(row)}</div>
        </>
      )}

      {duelsList.length > 0 && (
        <>
          <h3 className="mb-2 mt-5 font-display text-lg font-bold text-white">Düello gelişimi</h3>
          <div className={`${card} space-y-3`}>
            {diff !== null && <p className={`text-xs ${diff >= 0 ? "text-teal-200" : "text-amber-200"}`}>{diff === 0 ? "Son düelloda bir öncekiyle aynı başarıdaydın." : `Son düelloda bir öncekine göre %${Math.abs(diff)} ${diff > 0 ? "yükseldin" : "düştün"}.`}</p>}
            {duelsList.map((d) => (
              <div key={d.id}>
                <div className="mb-1 flex justify-between gap-3 text-xs"><span className="truncate text-slate-200">{d.title}</span><span className="shrink-0 text-slate-400">{d.correct}/{d.answered} · %{dp(d)}</span></div>
                <div className="h-2.5 overflow-hidden rounded-full bg-white/10"><div className={`h-full rounded-full ${pctColor(dp(d))}`} style={{ width: `${dp(d)}%` }} /></div>
              </div>
            ))}
          </div>
        </>
      )}

      {testTopics.length > 0 && (
        <>
          <h3 className="mb-2 mt-5 font-display text-lg font-bold text-white">Test bölümünden</h3>
          <div className={`${card} space-y-3`}>{testTopics.map(row)}</div>
        </>
      )}

      {wrong.length > 0 && (
        <>
          <h3 className="mb-2 mt-5 font-display text-lg font-bold text-white">Yanlışlarım</h3>
          <div className="space-y-2">
            {(more ? wrong : wrong.slice(0, 8)).map((w, i) => (
              <details key={i} className={card}>
                <summary className="cursor-pointer list-none text-sm font-medium text-slate-100">
                  <span className="mr-2 rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-slate-300">{w.topic}</span>{w.text}
                </summary>
                <div className="mt-3 space-y-2 text-sm">
                  <p className="text-rose-300">Senin cevabın: {w.mine}</p>
                  <p className="text-teal-200">Doğru cevap: {w.correct}</p>
                  {w.why && <p className="leading-relaxed text-slate-300">{w.why}</p>}
                  <p className="text-[11px] text-slate-500">{w.duel}</p>
                </div>
              </details>
            ))}
          </div>
          {wrong.length > 8 && !more && <button onClick={() => setMore(true)} className="mt-3 w-full rounded-xl border border-sky-300/15 px-4 py-3 text-sm text-slate-200 hover:bg-white/5">Hepsini göster ({wrong.length})</button>}
        </>
      )}
      <p className="mt-6 text-center text-[11px] leading-relaxed text-slate-500">Karnen sadece sana görünür. Yalnızca sonucu açılmış düellolar hesaba katılır. Sınıf ortalaması, aynı sınıftan en az 3 kişi o konuda cevap verdiyse gösterilir.</p>
    </section>
  );
}

function DuelBanner({ duels, go }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const cur = duels.filter((d) => new Date(d.ends_at).getTime() > now).sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at))[0];
  if (!cur) return null;
  const st = new Date(cur.starts_at).getTime(), en = new Date(cur.ends_at).getTime();
  const soon = now < st;
  return (
    <button onClick={() => go("duello")} className="mt-6 flex w-full max-w-xl items-center gap-4 rounded-3xl border border-amber-400/50 bg-gradient-to-br from-amber-600/35 to-amber-950/70 p-4 text-left active:scale-[0.98]">
      <Trophy className="h-9 w-9 shrink-0 text-amber-200" />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-display text-base font-bold text-white">{cur.title}</span>
        <span className="text-xs text-amber-100/90">{soon ? `Başlamasına ${clock((st - now) / 1000)}` : `Şimdi açık! Bitişine ${clock((en - now) / 1000)}`}</span>
      </span>
      <span className="shrink-0 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-semibold text-slate-950">{soon ? "Detay" : "Katıl"}</span>
    </button>
  );
}

function DuelPage({ user, onLogin, setToast, duels, openPod, needClass, onPickClass, onKarne }) {
  const [now, setNow] = useState(Date.now());
  const [mine, setMine] = useState({});
  const [count, setCount] = useState({});
  const [play, setPlay] = useState(null);
  const [res, setRes] = useState(null);
  const [open, setOpen] = useState(null);
  const [busy, setBusy] = useState(false);
  const lastLeave = useRef(0);
  const hid = useRef(false);
  const [warn, setWarn] = useState(null);
  const uid = user?.id;
  const card = "rounded-3xl border border-sky-300/15 bg-[#0a1a30]/90 p-4 backdrop-blur-xl";
  const btn = "w-full rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/20 active:scale-[0.98] disabled:opacity-50";

  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 500); return () => clearInterval(t); }, []);

  const refresh = useCallback(async () => {
    if (!sb || !duels.length) return;
    if (uid) {
      const ids = duels.map((d) => d.id);
      let { data, error } = await sb.from("duel_attempts").select("duel_id,started_at,finished_at,disqualified,disq_reason").in("duel_id", ids).eq("user_id", uid);
      if (error) ({ data } = await sb.from("duel_attempts").select("duel_id,started_at,finished_at").in("duel_id", ids).eq("user_id", uid));
      setMine(Object.fromEntries((data || []).map((a) => [a.duel_id, a])));
    }
    const cur = duels.filter((d) => new Date(d.ends_at).getTime() > Date.now());
    const e = await Promise.all(cur.map(async (d) => [d.id, (await sb.rpc("duel_participants", { p_duel: d.id })).data || 0]));
    setCount(Object.fromEntries(e));
  }, [duels, uid]);
  useEffect(() => { refresh(); const t = setInterval(refresh, 30000); return () => clearInterval(t); }, [refresh]);

  // Sekme/uygulama değiştirme: sunucu sayar, hak aşılırsa katılım iptal edilir.
  const playId = play ? play.duel.id : null;
  useEffect(() => {
    if (!playId) { setWarn(null); return undefined; }
    const f = async () => {
      if (document.hidden) { hid.current = true; return; }
      if (!hid.current) return;
      hid.current = false;
      if (Date.now() - lastLeave.current < 4000) return;
      lastLeave.current = Date.now();
      const { data, error } = await sb.rpc("duel_note_leave", { p_duel: playId });
      if (error || !data) return;
      if (data.disqualified) { setPlay(null); setWarn(null); setToast("Sekme değiştirme hakkın aşıldığı için katılımın iptal edildi. Yönetici inceleyebilir."); refresh(); return; }
      setWarn({ n: data.leaves, max: data.max });
    };
    document.addEventListener("visibilitychange", f);
    return () => document.removeEventListener("visibilitychange", f);
  }, [playId, refresh, setToast]);

  const finish = useCallback(async () => {
    if (!play) return;
    const d = play.duel;
    setPlay(null);
    await sb.rpc("duel_finish", { p_duel: d.id, p_leaves: 0 });
    setToast("Cevapların kaydedildi. Sonuçlar düello bitince açılır.");
    refresh();
  }, [play, refresh, setToast]);
  const left = play ? Math.max(0, Math.ceil((play.deadline - now) / 1000)) : 0;
  useEffect(() => { if (play && left <= 0) finish(); }, [play, left, finish]);

  const begin = async (d) => {
    setBusy(true);
    const { data, error } = await sb.rpc("duel_start", { p_duel: d.id });
    setBusy(false);
    if (error) return setToast(error.message);
    if (data.state === "done") { setToast("Bu düelloyu zaten tamamladın."); return refresh(); }
    const off = new Date(data.server_now).getTime() - Date.now();
    lastLeave.current = 0; hid.current = false; setWarn(null);
    setPlay({ duel: d, qs: data.questions, deadline: new Date(data.deadline).getTime() - off, i: 0, ans: data.answers || {} });
    window.scrollTo({ top: 0 });
  };
  const pick = (oi) => {
    const q = play.qs[play.i];
    setPlay({ ...play, ans: { ...play.ans, [q.id]: oi } });
    sb.rpc("duel_answer", { p_duel: play.duel.id, p_q: q.id, p_choice: oi }).then(({ error }) => { if (error) setToast("Cevabın kaydedilemedi. Bağlantını kontrol et."); });
  };
  const showResults = async (d) => {
    setBusy(true);
    const [r, c] = await Promise.all([sb.rpc("duel_results", { p_duel: d.id }), sb.rpc("duel_class_summary", { p_duel: d.id })]);
    setBusy(false);
    if (r.error) return setToast(r.error.message);
    setRes({ duel: d, ...r.data, cls: c.error ? null : c.data }); setOpen(null); window.scrollTo({ top: 0 });
  };

  const head = <SectionHead title="Düello" desc="Herkes aynı sorularla yarışır. Sonuçlar düello bitince açılır." />;
  if (!sb) return <section className="mx-auto max-w-2xl">{head}<div className={card}><p className="text-sm text-slate-300">Düello için sunucu bağlantısı gerekir.</p></div></section>;
  if (!user) {
    return (
      <section className="mx-auto max-w-2xl">{head}
        <div className={`${card} text-center`}>
          <Trophy className="mx-auto h-12 w-12 text-amber-300" />
          <h3 className="mt-3 font-display text-xl font-bold text-white">Düelloya katılmak için giriş yap</h3>
          <button onClick={onLogin} className={`${btn} mt-4`}>Giriş yap / Kayıt ol</button>
        </div>
      </section>
    );
  }

  /* ---- Oyun ---- */
  if (play) {
    const q = play.qs[play.i];
    const sel = play.ans[q.id];
    const last = play.i + 1 === play.qs.length;
    return (
      <section className="mx-auto max-w-2xl">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="text-slate-300">Soru {play.i + 1} / {play.qs.length}</span>
          <span className={`rounded-full px-3 py-1 font-display text-base font-bold ${left <= 60 ? "bg-rose-500/30 text-rose-100" : "bg-white/10 text-white"}`}>{clock(left)}</span>
        </div>
        <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${((play.i + 1) / play.qs.length) * 100}%` }} /></div>
        {warn && (
          <div role="alert" className="mb-3 rounded-2xl border border-rose-400/40 bg-rose-500/15 px-4 py-3 text-sm text-rose-100">
            <b>Sekme değiştirdin ({warn.n}/{warn.max}).</b> Yöneticiye iletildi. Lütfen tekrarlama. {warn.n >= warn.max ? "Bir sonraki sefer katılımın iptal edilir." : `Kalan hakkın: ${warn.max - warn.n}.`}
          </div>
        )}
        <article className={card}>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-slate-300">{q.topic}</span>
          <h3 className="mt-3 font-display text-lg font-bold leading-snug text-white">{q.text}</h3>
          <div className="mt-4 space-y-2.5">
            {q.options.map((o, oi) => (
              <button key={oi} onClick={() => pick(oi)} className={`flex w-full items-start gap-3 rounded-xl border px-3.5 py-3 text-left text-sm transition active:scale-[0.99] ${sel === oi ? "border-amber-300 bg-amber-500/20" : "border-sky-300/15 hover:bg-white/10"}`}>
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-semibold text-slate-200">{LETTERS[oi]}</span>
                <span className="pt-0.5 text-slate-100">{o}</span>
              </button>
            ))}
          </div>
        </article>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button onClick={() => setPlay({ ...play, i: play.i - 1 })} disabled={play.i === 0} className="rounded-xl border border-sky-300/15 px-4 py-3 text-sm text-slate-100 disabled:opacity-40">Önceki</button>
          {last
            ? <button onClick={() => { ask("Düelloyu bitirmek istiyor musun? Bir daha giremezsin.", { title: "Düelloyu bitir", confirmText: "Bitir" }).then((ok) => ok && finish()); }} className="rounded-xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-950">Bitir</button>
            : <button onClick={() => setPlay({ ...play, i: play.i + 1 })} className={btn}>Sonraki</button>}
        </div>
        <p className="mt-3 text-center text-xs text-slate-500">Düello sırasında başka sekmeye veya uygulamaya geçme; yöneticiye iletilir. Sayfayı kapatsan da süren işler, aynı düelloya girip kaldığın yerden devam edebilirsin.</p>
      </section>
    );
  }

  /* ---- Sonuçlar ---- */
  if (res) {
    const top3 = res.ranking.slice(0, 3);
    const me = res.me;
    return (
      <section className="mx-auto max-w-2xl">
        <button onClick={() => setRes(null)} className="mb-3 text-sm text-slate-400 underline underline-offset-2">← Düello sayfası</button>
        <div className={card}>
          <h3 className="text-center font-display text-xl font-bold text-white">{res.duel.title}</h3>
          <p className="mt-1 text-center text-xs text-slate-400">{res.participants} kişi katıldı · {res.total} soru</p>
          <div className="mt-5 flex items-end gap-2">
            {[1, 0, 2].map((k) => top3[k] && (
              <div key={k} className="flex flex-1 flex-col items-center">
                <div className="text-3xl">{MEDAL[k + 1]}</div>
                <p className="mt-1 w-full truncate text-center text-xs font-semibold text-white">{top3[k].name}</p>
                <p className="text-[11px] text-slate-400">{top3[k].correct}/{res.total} · {clock(top3[k].used_sec)}</p>
                <div className={`mt-2 w-full rounded-t-2xl ${["h-24 bg-amber-400/60", "h-16 bg-slate-300/50", "h-12 bg-orange-500/50"][k]}`} />
              </div>
            ))}
          </div>
        </div>
        {me ? (
          <div className={`${card} mt-3 text-center`}>
            <p className="text-sm text-slate-400">Sıralaman</p>
            <p className="font-display text-3xl font-extrabold text-white">{me.rank}. <span className="text-base font-medium text-slate-300">· {me.correct}/{res.total} doğru · {clock(me.used_sec)}</span></p>
            {me.rank <= 3 && <button onClick={() => openPod({ id: res.duel.id, title: res.duel.title, rank: me.rank, correct: me.correct, total: res.total, used_sec: me.used_sec, ends_at: res.duel.ends_at })} className={`${btn} mt-3`}>{MEDAL[me.rank]} Instagram görselini indir</button>}
          </div>
        ) : <p className="mt-3 text-center text-sm text-slate-400">Bu düelloya katılmadın.</p>}
        {res.cls && <ClassCard cls={res.cls} total={res.total} card={card} />}
        <h3 className="mb-2 mt-5 font-display text-lg font-bold text-white">Sıralama</h3>
        <div className="space-y-1.5">
          {res.ranking.map((r) => (
            <div key={r.rank} className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm ${r.me ? "border-amber-300/60 bg-amber-500/15" : "border-sky-300/15 bg-[#0a1a30]/90"}`}>
              <span className="w-8 shrink-0 text-center font-display font-bold text-white">{MEDAL[r.rank] || r.rank}</span>
              <span className="min-w-0 flex-1 truncate text-slate-100">{r.name}</span>
              <span className="shrink-0 text-xs text-slate-400">{r.correct}/{res.total} · {clock(r.used_sec)}{r.leaves ? ` · ${r.leaves}× sekme` : ""}</span>
            </div>
          ))}
        </div>
        <h3 className="mb-2 mt-5 font-display text-lg font-bold text-white">Doğru cevaplar</h3>
        <div className="space-y-2">
          {(res.questions || []).map((q, n) => (
            <div key={q.id} className={card}>
              <button onClick={() => setOpen(open === q.id ? null : q.id)} aria-expanded={open === q.id} className="flex w-full items-start justify-between gap-3 text-left text-sm font-medium text-slate-100">
                <span>{n + 1}. {q.text}</span><ChevronDown className={`mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition ${open === q.id ? "rotate-180" : ""}`} />
              </button>
              {open === q.id && (
                <div className="pop mt-3 space-y-2 text-sm">
                  {q.voided && <p className="text-amber-200">Bu soru iptal edildi, herkese doğru sayıldı.</p>}
                  <p className="text-teal-200">Doğru cevap: {q.options[q.answer]}</p>
                  {q.why && <p className="leading-relaxed text-slate-300">{q.why}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  /* ---- Düello sayfası ---- */
  const cur = duels.filter((d) => new Date(d.ends_at).getTime() > now).sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at))[0];
  const past = duels.filter((d) => new Date(d.ends_at).getTime() <= now);
  let body = null;
  if (cur) {
    const st = new Date(cur.starts_at).getTime(), en = new Date(cur.ends_at).getTime();
    const lastStart = en - cur.duration_sec * 1000;
    const a = mine[cur.id];
    const running = a && !a.finished_at && now < new Date(a.started_at).getTime() + cur.duration_sec * 1000;
    const done = a && !running && !a.disqualified;
    const dq = a && a.disqualified;
    const maxL = cur.max_leaves;
    body = (
      <div className={`${card} border-amber-400/40`}>
        <div className="flex items-center gap-3"><Trophy className="h-8 w-8 text-amber-300" /><h3 className="font-display text-xl font-bold text-white">{cur.title}</h3></div>
        <ul className="mt-3 space-y-1 text-sm text-slate-300">
          <li>📅 {dtText(cur.starts_at)} – {hm(cur.ends_at)}</li>
          <li>⏱ {Math.round(cur.duration_sec / 60)} dakika süre · {cur.question_ids.length} soru</li>
          <li>👥 {count[cur.id] ?? 0} kişi katıldı</li>
        </ul>
        <div className="mt-4">
          {now < st && <div className="rounded-2xl bg-white/5 p-4 text-center"><p className="text-xs text-slate-400">Başlamasına</p><p className="font-display text-3xl font-bold text-white">{clock((st - now) / 1000)}</p></div>}
          {now >= st && dq && <p className="rounded-2xl bg-rose-500/15 p-4 text-center text-sm text-rose-100">Katılımın iptal edildi{a.disq_reason ? `: ${a.disq_reason}` : ""}. Bir yanlışlık olduğunu düşünüyorsan yöneticiye ulaş.</p>}
          {now >= st && done && <p className="rounded-2xl bg-teal-500/15 p-4 text-center text-sm text-teal-100">Düelloyu tamamladın. Sonuçlar {hm(cur.ends_at)}'de açılacak.</p>}
          {now >= st && running && <button onClick={() => begin(cur)} disabled={busy} className={btn}>Devam et</button>}
          {now >= st && !a && now <= lastStart && (
            <>
              <button onClick={() => { ask(`${Math.round(cur.duration_sec / 60)} dakikalık sürenin başlayacak. Tek hakkın var.${maxL != null ? ` Düello sırasında başka sekmeye veya uygulamaya geçersen yöneticiye iletilir; ${maxL} uyarıdan sonra katılımın iptal edilir.` : ""} Hazır mısın?`, { title: "Düelloya başla", confirmText: "Başla" }).then((ok) => ok && begin(cur)); }} disabled={busy} className={btn}>Şimdi katıl</button>
              <p className="mt-2 text-center text-xs text-slate-500">En geç {hm(new Date(lastStart).toISOString())}'e kadar başlayabilirsin.</p>
            </>
          )}
          {now >= st && !a && now > lastStart && <p className="rounded-2xl bg-white/5 p-4 text-center text-sm text-slate-300">Katılım süresi doldu. Sonuçlar {hm(cur.ends_at)}'de açılacak.</p>}
        </div>
      </div>
    );
  }
  return (
    <section className="mx-auto max-w-2xl">
      {head}
      <InstallCard compact />
      {onKarne && <button onClick={onKarne} className="mb-3 flex w-full items-center justify-between rounded-2xl border border-teal-400/30 bg-teal-500/10 px-4 py-3 text-left text-sm font-semibold text-teal-100"><span>Karnem · konu analizin</span><ArrowUpRight className="h-4 w-4" /></button>}
      {needClass && (
        <div className={`${card} mb-3 flex items-center gap-3`}>
          <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-white">Sınıfını seç</p><p className="text-xs text-slate-400">Takımın düello sonuçlarında görünsün.</p></div>
          <button onClick={onPickClass} className="shrink-0 rounded-xl bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-950">Seç</button>
        </div>
      )}
      {body || <div className="rounded-3xl border border-dashed border-sky-300/20 p-8 text-center"><p className="font-medium text-white">Şu an planlı bir düello yok.</p><p className="mt-1 text-sm text-slate-400">Yeni düello WhatsApp grubundan ve duyurulardan haber verilir.</p></div>}
      {past.length > 0 && (
        <>
          <h3 className="mb-2 mt-6 font-display text-lg font-bold text-white">Düello Salonu</h3>
          <div className="space-y-2">
            {past.map((d) => (
              <button key={d.id} onClick={() => showResults(d)} disabled={busy} className="flex w-full items-center gap-3 rounded-2xl border border-sky-300/15 bg-[#0a1a30]/90 p-3.5 text-left hover:bg-white/5">
                <span className="text-2xl">🏆</span>
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-white">{d.title}</span><span className="text-xs text-slate-400">{dtText(d.starts_at)}</span></span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400" />
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

const toLocalInput = (iso) => {
  const d = new Date(iso); const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};

// Soru düzenleme formu (metin, şıklar, doğru cevap, açıklama). Cevap anahtarını düzeltince sonuçlar kendiliğinden yeniden hesaplanır.
function QuestionEditor({ q, usedIn, onClose, onSaved, setToast }) {
  const [t, setT] = useState({ topic: q.topic, level: q.level, text: q.text, options: [...q.options], answer: q.answer, why: q.why || "" });
  const [busy, setBusy] = useState(false);
  const setOpt = (i, v) => setT({ ...t, options: t.options.map((o, k) => (k === i ? v : o)) });
  const save = async () => {
    const clean = { topic: t.topic.trim(), level: Number(t.level), text: t.text.trim(), options: t.options.map((o) => o.trim()), answer: Number(t.answer), why: t.why.trim() };
    if (clean.topic.length < 2) return setToast("Konu en az 2 harf olmalı.");
    if (clean.text.length < 10) return setToast("Soru metni en az 10 harf olmalı.");
    if (clean.options.some((o) => !o)) return setToast("Beş şıkkın hepsini doldur.");
    if (clean.answer !== q.answer && usedIn > 0 && !(await ask(`Doğru şık değişiyor. Bu soru ${usedIn} düelloda geçiyor; o düellolardaki herkesin puanı yeniden hesaplanır. Devam edilsin mi?`, { title: "Cevap anahtarı değişiyor", confirmText: "Değiştir", danger: true }))) return;
    setBusy(true);
    const { error } = await sb.from("duel_questions").update(clean).eq("id", q.id);
    setBusy(false);
    if (error) return setToast("Kaydedilemedi: " + error.message);
    setToast("Soru güncellendi."); onSaved();
  };
  return (
    <div className="mt-2 space-y-2 rounded-xl border border-amber-300/30 bg-amber-500/5 p-3">
      <div className="grid grid-cols-3 gap-2">
        <input value={t.topic} onChange={(e) => setT({ ...t, topic: e.target.value })} maxLength={120} placeholder="Konu" className={`${inp} col-span-2 !py-2 text-xs`} />
        <select value={t.level} onChange={(e) => setT({ ...t, level: e.target.value })} className={`${inp} !py-2 text-xs`}>{[1, 2, 3].map((l) => <option key={l} value={l}>{LV[l]}</option>)}</select>
      </div>
      <textarea value={t.text} onChange={(e) => setT({ ...t, text: e.target.value })} rows={3} maxLength={1500} className={`${inp} resize-none text-xs`} />
      {t.options.map((o, i) => (
        <label key={i} className="flex items-center gap-2 text-xs">
          <input type="radio" name={`ans-${q.id}`} checked={Number(t.answer) === i} onChange={() => setT({ ...t, answer: i })} className="h-4 w-4 shrink-0 accent-teal-400" aria-label={`${LETTERS[i]} doğru cevap`} />
          <span className="w-4 shrink-0 text-slate-400">{LETTERS[i]}</span>
          <input value={o} onChange={(e) => setOpt(i, e.target.value)} className={`${inp} !py-2 text-xs ${Number(t.answer) === i ? "!border-teal-300/60" : ""}`} />
        </label>
      ))}
      <textarea value={t.why} onChange={(e) => setT({ ...t, why: e.target.value })} rows={2} placeholder="Açıklama" className={`${inp} resize-none text-xs`} />
      <p className="text-[11px] text-slate-500">Soldaki yuvarlak doğru cevabı gösterir.</p>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={save} disabled={busy} className="rounded-xl bg-teal-500 px-3 py-2.5 text-sm font-semibold text-slate-950 disabled:opacity-50">Kaydet</button>
        <button onClick={onClose} className="rounded-xl border border-sky-300/15 px-3 py-2.5 text-sm text-slate-100">Vazgeç</button>
      </div>
    </div>
  );
}

// Katılımcı listesi ve canlı izleme (10 saniyede bir yenilenir)
const STATE_UI = {
  cozuyor: ["Çözüyor", "bg-sky-500/25 text-sky-100"],
  bitirdi: ["Bitirdi", "bg-teal-500/25 text-teal-100"],
  sure_doldu: ["Süresi doldu", "bg-white/10 text-slate-200"],
  iptal: ["İptal", "bg-rose-500/25 text-rose-100"],
};
function DuelLive({ duel, setToast }) {
  const [d, setD] = useState(null);
  const [err, setErr] = useState("");
  const load = useCallback(async () => {
    const { data, error } = await sb.rpc("admin_duel_attempts", { p_duel: duel.id });
    if (error) setErr(error.message); else { setErr(""); setD(data); }
  }, [duel.id]);
  useEffect(() => { load(); const t = setInterval(load, 10000); return () => clearInterval(t); }, [load]);
  const act = async (u, action, text) => {
    if (!(await ask(text, { title: "Katılımcı işlemi", confirmText: "Onayla", danger: action !== "restore" }))) return;
    const { error } = await sb.rpc("admin_attempt_action", { p_duel: duel.id, p_user: u.user_id, p_action: action, p_reason: action === "disqualify" ? "Yönetici kararı" : null });
    setToast(error ? "İşlem başarısız: " + error.message : "Tamam."); load();
  };
  if (err) return <p className="mt-2 text-xs text-rose-300">Canlı izleme açılamadı: {err}. admin_sistemi.sql çalıştırıldı mı?</p>;
  if (!d) return <p className="mt-2 text-xs text-slate-400">Yükleniyor…</p>;
  const s = d.summary;
  return (
    <div className="mt-2 space-y-2">
      <div className="grid grid-cols-4 gap-1.5 text-center">
        {[[s.participants, "katıldı"], [s.solving, "çözüyor"], [s.finished, "bitirdi"], [s.disqualified, "iptal"]].map(([n, l]) => (
          <div key={l} className="rounded-xl bg-white/5 py-2"><p className="font-display text-xl font-bold text-white">{n}</p><p className="text-[11px] text-slate-400">{l}</p></div>
        ))}
      </div>
      <p className="text-[11px] text-slate-500">Sekme hakkı: {d.max_leaves}. Liste 10 saniyede bir kendiliğinden yenilenir.</p>
      {d.rows.length === 0 && <p className="text-xs text-slate-400">Henüz katılan yok.</p>}
      {d.rows.map((r) => {
        const [lab, cls] = STATE_UI[r.state] || ["", ""];
        return (
          <div key={r.user_id} className="rounded-xl bg-white/5 px-3 py-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="min-w-0 flex-1 truncate font-medium text-slate-100">{r.name}{r.class ? ` · ${r.class}. sınıf` : ""}</span>
              <span className={`shrink-0 rounded-full px-2 py-0.5 ${cls}`}>{lab}</span>
            </div>
            <p className="mt-1 text-slate-400">{r.answered}/{d.total} cevap · {r.correct} doğru · {r.leaves} sekme{r.reason ? ` · ${r.reason}` : ""}</p>
            <div className="mt-1.5 flex gap-2">
              {r.state === "iptal"
                ? <button onClick={() => act(r, "restore", `${r.name} katılımı geri alınsın mı? Puanı sıralamaya döner.`)} className="rounded-lg border border-sky-300/15 px-2.5 py-1 text-slate-100">Geri al</button>
                : <button onClick={() => act(r, "disqualify", `${r.name} katılımı iptal edilsin mi? Sıralamadan düşer.`)} className="rounded-lg border border-rose-400/30 px-2.5 py-1 text-rose-200">İptal et</button>}
              <button onClick={() => act(r, "reset", `${r.name} katılımı silinsin ve yeniden hak verilsin mi? Cevapları silinir.`)} className="rounded-lg border border-sky-300/15 px-2.5 py-1 text-slate-100">Yeniden hak ver</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Bakım modu ---------- */
function MaintenancePage({ message, onAdminLogin }) {
  return (
    <div translate="no" lang="tr" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#040b17] px-6 text-center text-slate-100" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes mspin{to{transform:rotate(360deg)}}@keyframes mspinr{to{transform:rotate(-360deg)}}
        @keyframes mfloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes mglow{0%,100%{opacity:.35}50%{opacity:.7}}
      `}</style>
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-sky-500/20 blur-[110px]" style={{ animation: "mglow 4s ease-in-out infinite" }} />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-[380px] w-[380px] rounded-full bg-indigo-500/20 blur-[110px]" style={{ animation: "mglow 5s ease-in-out infinite" }} />
      <div className="relative z-10 w-full max-w-md">
        <div className="mx-auto mb-6 h-28 w-28" style={{ animation: "mfloat 4s ease-in-out infinite" }}>
          <div className="relative h-full w-full">
            <svg viewBox="0 0 24 24" className="absolute left-0 top-2 h-20 w-20 text-sky-300" style={{ animation: "mspin 9s linear infinite" }} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" />
              <circle cx="12" cy="12" r="6.5" />
            </svg>
            <svg viewBox="0 0 24 24" className="absolute bottom-0 right-0 h-14 w-14 text-indigo-300" style={{ animation: "mspinr 6s linear infinite" }} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="2.6" />
              <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" />
              <circle cx="12" cy="12" r="6" />
            </svg>
          </div>
        </div>
        <img src={LOGO_SRC} alt="" className="mx-auto mb-3 h-10 w-10 rounded-xl opacity-90" />
        <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-sky-300/80">AFSÜ Diyaliz Team</div>
        <h1 className="mt-3 font-display text-3xl font-extrabold text-white sm:text-4xl" style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>Sitemiz bakımda</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-slate-300">Daha iyi bir deneyim için siteyi güncelliyoruz. Kısa süre sonra yeniden buradayız.</p>
        {message ? <p className="mt-4 rounded-2xl border border-sky-300/20 bg-sky-400/10 px-4 py-3 text-sm leading-relaxed text-sky-100">{message}</p> : null}
        <a href={IG_URL} target="_blank" rel="noreferrer" className="mt-6 inline-block rounded-full border border-rose-300/30 bg-rose-500/10 px-5 py-2.5 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20">Duyurular için Instagram: @afsudiyalizteam</a>
        <div className="mt-6 text-xs text-slate-500">Bu sayfa kendiliğinden yenilenir, tekrar girmene gerek yok.</div>
        <button type="button" onClick={onAdminLogin} className="mt-8 text-[11px] text-slate-600 underline-offset-2 hover:text-slate-400 hover:underline">Yönetici girişi</button>
      </div>
    </div>
  );
}

function MaintenanceAdmin({ maint, reload, setToast }) {
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { setMsg(maint.message || ""); }, [maint.message]);
  const on = !!maint.on;
  const toggle = async () => {
    const okk = await ask(on ? "Bakım modu kapatılsın mı? Site herkese tekrar açılır." : "Site bakıma alınsın mı? Yönetici dışındaki herkes (giriş yapmış ya da yapmamış) 'Sitemiz bakımda' sayfasını görür.");
    if (!okk) return;
    setBusy(true);
    const { error } = await sb.rpc("admin_set_maintenance", { p_on: !on, p_message: msg.trim() || null });
    setBusy(false);
    if (error) { setToast("Bakım modu değişmedi. bakim_modu.sql Supabase'de çalıştırıldı mı?"); return; }
    setToast(on ? "Bakım modu kapatıldı. Site herkese açık." : "Site bakıma alındı.");
    reload();
  };
  return (
    <div className={"mb-4 rounded-2xl border p-4 " + (on ? "border-amber-300/40 bg-amber-500/10" : "border-sky-300/15 bg-[#0a1a30]/90")}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-display text-base font-bold text-white">Bakım modu</div>
          <div className={"text-xs " + (on ? "text-amber-200" : "text-slate-400")}>{on ? "AÇIK: kullanıcılar bakım sayfasını görüyor" : "Kapalı: site herkese açık"}</div>
        </div>
        <button type="button" disabled={busy} onClick={toggle} className={"shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 " + (on ? "bg-emerald-600 hover:bg-emerald-500" : "bg-amber-600 hover:bg-amber-500")}>{on ? "Bakımı kapat" : "Bakıma al"}</button>
      </div>
      <textarea value={msg} onChange={(e) => setMsg(e.target.value.slice(0, 300))} rows={2} placeholder="İstersen kısa bir not yaz (örn. Gece 02.00'de açılır)" className={inp + " mt-3"} />
      <div className="mt-1 text-right text-[11px] text-slate-500">{msg.length}/300</div>
    </div>
  );
}

// Yönetici işlem kaydı (kim, ne zaman, ne yaptı)
const LOG_LABEL = {
  duels_eklendi: "Düello oluşturuldu", duels_guncellendi: "Düello güncellendi", duels_silindi: "Düello silindi",
  bakim_acildi: "Bakım modu açıldı", bakim_kapandi: "Bakım modu kapatıldı",
  duel_questions_eklendi: "Soru eklendi", duel_questions_guncellendi: "Soru güncellendi", duel_questions_silindi: "Soru silindi",
  kullanici_silindi: "Kullanıcı silindi", kullanici_rolu: "Rol değişti", kullanici_askiya_alindi: "Kullanıcı askıya alındı", kullanici_askisi_kalkti: "Askı kaldırıldı",
  katilim_iptal: "Katılım iptal edildi", katilim_geri_alindi: "Katılım geri alındı", katilim_sifirlandi: "Katılım sıfırlandı", katilim_otomatik_iptal: "Otomatik iptal (sekme hakkı aşıldı)",
};
const LOG_FIELD = { title: "Başlık", starts_at: "Başlangıç", ends_at: "Bitiş", duration_sec: "Süre (sn)", max_leaves: "Sekme hakkı", cancelled_at: "İptal", cancel_reason: "İptal nedeni", voided: "Hatalı sorular", answer: "Doğru şık", text: "Soru metni", options: "Şıklar", why: "Açıklama", topic: "Konu", level: "Seviye", question_ids: "Sorular", neden: "Neden", adet: "Adet" };
const logVal = (k, v) => {
  if (v === null || v === undefined) return "yok";
  if (k.endsWith("_at")) { try { return new Date(v).toLocaleString("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }); } catch { return String(v); } }
  if (k === "answer") return LETTERS[v] || String(v);
  const s = typeof v === "object" ? JSON.stringify(v) : String(v);
  return s.length > 50 ? s.slice(0, 50) + "…" : s;
};
function logDetail(det) {
  if (!det || typeof det !== "object") return [];
  const out = [];
  for (const [k, v] of Object.entries(det)) {
    if (k === "silinen" || (k === "yeni" && v && typeof v === "object" && !("eski" in v))) continue;
    if (v && typeof v === "object" && "eski" in v && "yeni" in v) out.push(`${LOG_FIELD[k] || k}: ${logVal(k, v.eski)} → ${logVal(k, v.yeni)}`);
    else out.push(`${LOG_FIELD[k] || k}: ${logVal(k, v)}`);
  }
  return out.slice(0, 5);
}
function AdminLog() {
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    sb.from("admin_log").select("*").order("at", { ascending: false }).limit(100).then(({ data, error }) => { if (error) setErr(error.message); else setRows(data || []); });
  }, []);
  if (err) return <p className="text-xs text-rose-300">Kayıt açılamadı: {err}. admin_sistemi.sql çalıştırıldı mı?</p>;
  if (!rows) return <p className="text-xs text-slate-400">Yükleniyor…</p>;
  if (!rows.length) return <p className="text-xs text-slate-400">Henüz kayıt yok.</p>;
  return (
    <div className="max-h-96 space-y-1.5 overflow-y-auto">
      {rows.map((r) => (
        <div key={r.id} className="rounded-lg bg-white/5 px-3 py-2 text-xs">
          <p className="text-slate-100"><span className="font-semibold">{LOG_LABEL[r.action] || r.action}</span>{r.target ? ` · ${r.target}` : ""}</p>
          {logDetail(r.detail).map((l, i) => <p key={i} className="text-slate-400">{l}</p>)}
          <p className="mt-0.5 text-[11px] text-slate-500">{r.admin_name || "Sistem"} · {new Date(r.at).toLocaleString("tr-TR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</p>
        </div>
      ))}
    </div>
  );
}

function DuelAdmin({ setToast }) {
  const [qs, setQs] = useState([]);
  const [ds, setDs] = useState([]);
  const [cnt, setCnt] = useState({});
  const [paste, setPaste] = useState("");
  const [pick, setPick] = useState([]);
  const [f, setF] = useState({ title: "", start: "", end: "", min: 10 });
  const [rows, setRows] = useState(null);
  const [showQs, setShowQs] = useState(false);
  const [openD, setOpenD] = useState(null);
  const [liveD, setLiveD] = useState(null);
  const [edit, setEdit] = useState(null);
  const [editQ, setEditQ] = useState(null);
  const [showLog, setShowLog] = useState(false);
  const box = "rounded-2xl border border-sky-300/15 bg-[#0a1a30]/90 p-3";
  const usedIn = (qid) => ds.filter((d) => d.question_ids.includes(qid)).length;

  const load = useCallback(async () => {
    const a = await sb.from("duel_questions").select("*").order("created_at", { ascending: false });
    const b = await sb.from("duels").select("*").order("starts_at", { ascending: false });
    setQs(a.data || []); setDs(b.data || []);
    const e = await Promise.all((b.data || []).map(async (d) => [d.id, (await sb.rpc("duel_participants", { p_duel: d.id })).data || 0]));
    setCnt(Object.fromEntries(e));
  }, []);
  useEffect(() => { load(); }, [load]);

  const importQs = async () => {
    const { ok, bad } = parseQuestions(paste);
    if (!ok.length) return setToast("Soru bulunamadı. Biçimi kontrol et.");
    const { error } = await sb.from("duel_questions").insert(ok);
    if (error) return setToast("Eklenemedi: " + error.message);
    const longest = ok.filter((q) => q.options.every((o, i) => i === q.answer || o.length < q.options[q.answer].length)).length;
    const warn = longest / ok.length > 0.5 ? ` Uyarı: doğru şık %${Math.round((longest / ok.length) * 100)} oranında en uzun şık.` : "";
    setPaste(""); load();
    setToast(`${ok.length} soru eklendi${bad ? `, ${bad} hatalı atlandı` : ""}.${warn}`);
  };
  const delQ = async (id) => {
    if (ds.some((d) => d.question_ids.includes(id))) return setToast("Bu soru bir düelloda kullanılıyor.");
    if (!(await ask("Bu soru havuzdan silinsin mi?", { title: "Soruyu sil", confirmText: "Sil", danger: true }))) return;
    await sb.from("duel_questions").delete().eq("id", id);
    setPick((p) => p.filter((x) => x !== id)); load();
  };
  const randomPick = (n) => { const hard = qs.filter((q) => q.level >= 2); setPick(shuffle(hard.length >= n ? hard : qs).slice(0, n).map((q) => q.id)); };
  const create = async () => {
    const s = new Date(f.start), e = new Date(f.end), sec = Math.round(Number(f.min) * 60);
    if (f.title.trim().length < 3 || isNaN(s) || isNaN(e)) return setToast("Başlık, başlangıç ve bitiş saatini gir.");
    if (!pick.length) return setToast("En az bir soru seç.");
    if (!(sec >= 60) || (e - s) / 1000 < sec) return setToast("Düello penceresi, süreden kısa olamaz.");
    const { error } = await sb.from("duels").insert({ title: f.title.trim(), starts_at: s.toISOString(), ends_at: e.toISOString(), duration_sec: sec, question_ids: pick });
    if (error) return setToast("Oluşturulamadı: " + error.message);
    setPick([]); setF({ title: "", start: "", end: "", min: 10 }); setToast("Düello oluşturuldu."); load();
  };
  const delDuel = async (id) => { if (!(await ask("Düello ve tüm sonuçları silinsin mi? Bu geri alınamaz. (Silmek yerine 'İptal et' seçeneği sonuçları saklar.)", { title: "Düelloyu sil", confirmText: "Sil", danger: true }))) return; await sb.from("duels").delete().eq("id", id); load(); };
  const toggleVoid = async (d, qid) => {
    const v = d.voided.includes(qid) ? d.voided.filter((x) => x !== qid) : [...d.voided, qid];
    const { error } = await sb.from("duels").update({ voided: v }).eq("id", d.id);
    setToast(error ? "İşlem başarısız." : "Güncellendi."); load();
  };
  const results = async (d) => {
    const { data, error } = await sb.rpc("duel_results", { p_duel: d.id });
    if (error) return setToast(error.message);
    setRows({ id: d.id, ...data });
  };
  const startEdit = (d) => setEdit({ id: d.id, title: d.title, start: toLocalInput(d.starts_at), end: toLocalInput(d.ends_at), min: d.duration_sec / 60, leaves: d.max_leaves ?? 3, hasLeaves: "max_leaves" in d, orig: d });
  const shiftEnd = (mins) => setEdit({ ...edit, end: toLocalInput(new Date(new Date(edit.end).getTime() + mins * 60000).toISOString()) });
  const saveEdit = async () => {
    const o = edit.orig, s = new Date(edit.start), e = new Date(edit.end), sec = Math.round(Number(edit.min) * 60);
    if (edit.title.trim().length < 3 || isNaN(s) || isNaN(e)) return setToast("Başlık ve saatleri kontrol et.");
    if (!(sec >= 60) || (e - s) / 1000 < sec) return setToast("Düello penceresi, süreden kısa olamaz.");
    const timeChanged = s.getTime() !== new Date(o.starts_at).getTime() || e.getTime() !== new Date(o.ends_at).getTime() || sec !== o.duration_sec;
    if (timeChanged) {
      const { error } = await sb.rpc("admin_duel_reschedule", { p_duel: o.id, p_starts: s.toISOString(), p_ends: e.toISOString(), p_duration: sec });
      if (error) return setToast(error.message);
    }
    const patch = {};
    if (edit.title.trim() !== o.title) patch.title = edit.title.trim();
    if (edit.hasLeaves && Number(edit.leaves) !== o.max_leaves) patch.max_leaves = Math.min(50, Math.max(0, Math.round(Number(edit.leaves))));
    if (Object.keys(patch).length) {
      const { error } = await sb.from("duels").update(patch).eq("id", o.id);
      if (error) return setToast("Kaydedilemedi: " + error.message);
    }
    setEdit(null); setToast("Düello güncellendi."); load();
  };
  const cancelDuel = async (d, cancel) => {
    const text = cancel ? "Düello iptal edilsin mi? Öğrencilere görünmez, sonuçlar ve rozetler sayılmaz. Veriler silinmez, istersen geri alabilirsin." : "Düello iptali geri alınsın mı?";
    if (!(await ask(text, { title: cancel ? "Düelloyu iptal et" : "İptali geri al", confirmText: "Onayla", danger: cancel }))) return;
    const { error } = await sb.rpc("admin_duel_cancel", { p_duel: d.id, p_cancel: cancel, p_reason: null });
    setToast(error ? "İşlem başarısız: " + error.message : cancel ? "Düello iptal edildi." : "İptal geri alındı."); load();
  };
  const qRow = (q, extra) => (
    <div key={q.id}>
      <div className="flex items-center gap-2 rounded-lg bg-white/5 px-2.5 py-2 text-xs">
        {extra}
        <span className={`shrink-0 rounded px-1.5 py-0.5 ${LV_CLS[q.level]}`}>{LV[q.level]}</span>
        <span className="min-w-0 flex-1 truncate text-slate-200">{q.topic} · {q.text}</span>
        <button onClick={() => setEditQ(editQ === q.id ? null : q.id)} className="shrink-0 text-teal-300 underline underline-offset-2">Düzenle</button>
        <button onClick={() => delQ(q.id)} aria-label="Soruyu sil" className="shrink-0 text-rose-300"><Trash2 className="h-3.5 w-3.5" /></button>
      </div>
      {editQ === q.id && <QuestionEditor q={q} usedIn={usedIn(q.id)} onClose={() => setEditQ(null)} onSaved={() => { setEditQ(null); load(); }} setToast={setToast} />}
    </div>
  );

  return (
    <div className="mt-6">
      <h3 className="mb-2 font-display text-lg font-bold text-white">Düello</h3>
      <div className={`${box} space-y-2`}>
        <p className="text-sm font-medium text-white">1. Soru ekle ({qs.length} soru havuzda)</p>
        <textarea value={paste} onChange={(e) => setPaste(e.target.value)} rows={5} placeholder={"DERS: ...\nKONU: ...\nZORLUK: Orta\nSORU: ...\nA) ...\nB) ...\nC) ...\nD) ...\nE) ...\nDOĞRU CEVAP: B\nAÇIKLAMA: ...\n---"} className={`${inp} resize-none text-xs`} />
        <div className="grid grid-cols-2 gap-2">
          <button onClick={importQs} className="rounded-xl bg-teal-500 px-3 py-2.5 text-sm font-semibold text-slate-950">Soruları ekle</button>
          <button onClick={() => navigator.clipboard?.writeText(AI_PROMPT).then(() => setToast("İstem kopyalandı. Yapay zekâya yapıştır."))} className="rounded-xl border border-sky-300/15 px-3 py-2.5 text-sm text-slate-100">Yapay zekâ istemini kopyala</button>
        </div>
        <button onClick={() => setShowQs(!showQs)} className="text-xs text-teal-300 underline underline-offset-2">{showQs ? "Soru listesini gizle" : "Soru listesini göster / düzenle"}</button>
        {showQs && (
          <div className="max-h-96 space-y-1.5 overflow-y-auto">
            {qs.map((q) => qRow(q, <input type="checkbox" checked={pick.includes(q.id)} onChange={() => setPick(pick.includes(q.id) ? pick.filter((x) => x !== q.id) : [...pick, q.id])} className="h-4 w-4 shrink-0 accent-amber-400" aria-label="Düelloya seç" />))}
          </div>
        )}
      </div>
      <div className={`${box} mt-2 space-y-2`}>
        <p className="text-sm font-medium text-white">2. Düello oluştur ({pick.length} soru seçili)</p>
        <input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} maxLength={120} placeholder="Başlık (ör. Pazartesi Düellosu)" className={inp} />
        <div className="grid grid-cols-2 gap-2">
          <label className="text-xs text-slate-400">Başlangıç<input type="datetime-local" value={f.start} onChange={(e) => setF({ ...f, start: e.target.value })} className={`${inp} mt-1`} /></label>
          <label className="text-xs text-slate-400">Bitiş<input type="datetime-local" value={f.end} onChange={(e) => setF({ ...f, end: e.target.value })} className={`${inp} mt-1`} /></label>
        </div>
        <label className="block text-xs text-slate-400">Kişi başı süre (dakika)<input type="number" min="1" max="120" value={f.min} onChange={(e) => setF({ ...f, min: e.target.value })} className={`${inp} mt-1`} /></label>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="self-center text-slate-400">Rastgele orta/zor seç:</span>
          {[4, 10].map((n) => <button key={n} onClick={() => randomPick(n)} className="rounded-full border border-sky-300/15 px-3 py-1.5 text-slate-100">{n} soru</button>)}
          {pick.length > 0 && <button onClick={() => setPick([])} className="rounded-full px-3 py-1.5 text-slate-400">Temizle</button>}
        </div>
        <button onClick={create} className="w-full rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 px-4 py-3 text-sm font-semibold text-slate-950">Düelloyu oluştur</button>
        <p className="text-xs text-slate-500">Son başlama saati = bitiş − süre. Böylece herkes tam süreyi kullanır.</p>
      </div>
      <div className="mt-2 space-y-2">
        {ds.map((d) => (
          <div key={d.id} className={`${box} ${d.cancelled_at ? "opacity-70" : ""}`}>
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{d.title}{d.cancelled_at && <span className="ml-2 rounded-full bg-rose-500/25 px-2 py-0.5 text-[11px] text-rose-100">İptal edildi</span>}</p>
                <p className="text-xs text-slate-400">{dtText(d.starts_at)} · {Math.round(d.duration_sec / 60)} dk · {d.question_ids.length} soru · {cnt[d.id] ?? 0} katılımcı</p>
              </div>
              <button onClick={() => delDuel(d.id)} aria-label="Düelloyu sil" className="shrink-0 rounded-lg p-2 text-rose-300 hover:bg-rose-500/15"><Trash2 className="h-4 w-4" /></button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <button onClick={() => setLiveD(liveD === d.id ? null : d.id)} className="rounded-lg border border-teal-400/30 px-3 py-1.5 text-teal-100">Katılımcılar / canlı</button>
              <button onClick={() => results(d)} className="rounded-lg border border-sky-300/15 px-3 py-1.5 text-slate-100">Sonuçlar</button>
              <button onClick={() => (edit?.id === d.id ? setEdit(null) : startEdit(d))} className="rounded-lg border border-sky-300/15 px-3 py-1.5 text-slate-100">Düzenle</button>
              <button onClick={() => setOpenD(openD === d.id ? null : d.id)} className="rounded-lg border border-sky-300/15 px-3 py-1.5 text-slate-100">Sorular</button>
              <button onClick={() => cancelDuel(d, !d.cancelled_at)} className={`rounded-lg border px-3 py-1.5 ${d.cancelled_at ? "border-sky-300/15 text-slate-100" : "border-rose-400/30 text-rose-200"}`}>{d.cancelled_at ? "İptali geri al" : "Düelloyu iptal et"}</button>
            </div>
            {liveD === d.id && <DuelLive duel={d} setToast={setToast} />}
            {edit?.id === d.id && (
              <div className="mt-2 space-y-2 rounded-xl border border-amber-300/30 bg-amber-500/5 p-3">
                <input value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} maxLength={120} className={`${inp} !py-2 text-sm`} aria-label="Başlık" />
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-xs text-slate-400">Başlangıç<input type="datetime-local" value={edit.start} onChange={(e) => setEdit({ ...edit, start: e.target.value })} className={`${inp} mt-1 !py-2`} /></label>
                  <label className="text-xs text-slate-400">Bitiş<input type="datetime-local" value={edit.end} onChange={(e) => setEdit({ ...edit, end: e.target.value })} className={`${inp} mt-1 !py-2`} /></label>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-400">Bitişi uzat:</span>
                  {[15, 30, 60].map((m) => <button key={m} onClick={() => shiftEnd(m)} className="rounded-full border border-sky-300/15 px-3 py-1 text-slate-100">+{m} dk</button>)}
                  <button onClick={() => shiftEnd(-15)} className="rounded-full border border-sky-300/15 px-3 py-1 text-slate-100">−15 dk</button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-xs text-slate-400">Kişi başı süre (dk)<input type="number" min="1" max="120" value={edit.min} onChange={(e) => setEdit({ ...edit, min: e.target.value })} className={`${inp} mt-1 !py-2`} /></label>
                  {edit.hasLeaves && <label className="text-xs text-slate-400">Sekme hakkı (0–50)<input type="number" min="0" max="50" value={edit.leaves} onChange={(e) => setEdit({ ...edit, leaves: e.target.value })} className={`${inp} mt-1 !py-2`} /></label>}
                </div>
                <p className="text-[11px] text-slate-500">Katılım başladıysa süre kısaltılamaz, bitiş devam edenlerin süresinden önceye alınamaz. Bunu sistem kendisi denetler.</p>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={saveEdit} className="rounded-xl bg-teal-500 px-3 py-2.5 text-sm font-semibold text-slate-950">Kaydet</button>
                  <button onClick={() => setEdit(null)} className="rounded-xl border border-sky-300/15 px-3 py-2.5 text-sm text-slate-100">Vazgeç</button>
                </div>
              </div>
            )}
            {openD === d.id && (
              <div className="mt-2 space-y-1.5">
                {d.question_ids.map((qid) => { const q = qs.find((x) => x.id === qid); return q ? (
                  <div key={qid}>
                    <div className="flex items-center gap-2 rounded-lg bg-white/5 px-2.5 py-2 text-xs">
                      <span className="min-w-0 flex-1 truncate text-slate-200">{q.text}</span>
                      <button onClick={() => setEditQ(editQ === qid ? null : qid)} className="shrink-0 text-teal-300 underline underline-offset-2">Düzenle</button>
                      <button onClick={() => toggleVoid(d, qid)} className={`shrink-0 rounded px-2 py-1 ${d.voided.includes(qid) ? "bg-amber-500/30 text-amber-100" : "border border-sky-300/15 text-slate-300"}`}>{d.voided.includes(qid) ? "İptal edildi" : "Hatalı → herkese doğru"}</button>
                    </div>
                    {editQ === qid && <QuestionEditor q={q} usedIn={usedIn(qid)} onClose={() => setEditQ(null)} onSaved={() => { setEditQ(null); load(); }} setToast={setToast} />}
                  </div>
                ) : <p key={qid} className="px-2.5 py-2 text-xs text-slate-500">(silinmiş soru)</p>; })}
              </div>
            )}
            {rows?.id === d.id && (
              <div className="mt-2 space-y-1 text-xs text-slate-300">
                <p className="text-slate-400">{rows.participants} katılımcı (iptal edilenler sayılmaz)</p>
                {rows.ranking.map((r) => <p key={r.rank}>{r.rank}. {r.name} · {r.correct}/{rows.total} · {clock(r.used_sec)}{r.leaves ? ` · ${r.leaves}× sekme değiştirdi` : ""}</p>)}
              </div>
            )}
          </div>
        ))}
      </div>
      <button onClick={() => setShowLog(!showLog)} className="mt-4 flex w-full items-center justify-between rounded-2xl border border-sky-300/15 bg-[#0a1a30]/90 px-4 py-3 text-left text-sm font-medium text-white">
        <span>İşlem kaydı</span><ChevronDown className={`h-4 w-4 text-slate-400 transition ${showLog ? "rotate-180" : ""}`} />
      </button>
      {showLog && <div className="mt-2"><AdminLog /></div>}
    </div>
  );
}

/* ---------- Profilim: kişisel bilgiler, Karnem, notlarım ---------- */
function ProfilePage({ user, profile, onLogin, podiums, notes, quizHist, onClass, setToast }) {
  const [tab, setTab] = useState("genel");
  const card = "rounded-3xl border border-sky-300/15 bg-[#0a1a30]/90 p-4 backdrop-blur-xl";
  const head = <SectionHead title="Profilim" desc="Adın, rozetlerin, Karnem ve paylaştığın notlar burada." />;
  if (!user) {
    return (
      <section className="mx-auto max-w-2xl">{head}
        <div className={`${card} text-center`}>
          <p className="text-sm text-slate-300">Profilini görmek için giriş yap.</p>
          <button onClick={onLogin} className="mt-4 w-full rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 px-4 py-3 text-sm font-semibold text-slate-950">Giriş yap / Kayıt ol</button>
        </div>
      </section>
    );
  }
  const name = profile?.full_name || "Öğrenci";
  const mine = (notes || []).filter((n) => n.user_id === user.id);
  const tabs = [["genel", "Genel"], ["karne", "Karnem"], ["notlar", `Notlarım${mine.length ? ` (${mine.length})` : ""}`]];
  const gold = (podiums || []).filter((p) => p.rank === 1).length;
  return (
    <section className="mx-auto max-w-2xl">
      {head}
      <div className={`${card} text-center`}>
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal-500/25 font-display text-2xl font-bold text-teal-100 ring-1 ring-teal-400/50">{name[0].toUpperCase()}</div>
        <h3 className="mt-3 font-display text-xl font-bold text-white">{name}</h3>
        <p className="text-sm text-slate-400">{user.email}</p>
        {profile && "entry_year" in profile && <ClassChip entry={profile.entry_year} onClass={onClass} />}
      </div>
      <div role="tablist" className="mt-3 grid grid-cols-3 gap-2">
        {tabs.map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`rounded-xl px-2 py-2.5 text-sm font-medium transition ${tab === id ? "bg-teal-500 text-slate-950" : "border border-sky-300/15 text-slate-200 hover:bg-white/5"}`}>{label}</button>
        ))}
      </div>
      {tab === "genel" && (
        <div className="mt-3 space-y-3">
          <InstallCard />
          <div className="grid grid-cols-3 gap-2 text-center">
            {[[(podiums || []).length, "podyum"], [gold, "birincilik"], [(quizHist || []).length, "çözülen test"]].map(([n, l]) => (
              <div key={l} className={`${card} !p-3`}><p className="font-display text-2xl font-bold text-white">{n}</p><p className="text-xs text-slate-400">{l}</p></div>
            ))}
          </div>
          {(podiums || []).length > 0 ? (
            <div className={card}>
              <p className="mb-2 text-sm font-semibold text-white">Düello rozetlerin</p>
              <div className="space-y-1.5">
                {podiums.map((p) => (
                  <p key={p.id} className="flex items-center gap-2 text-sm text-slate-200"><span className="text-xl">{MEDAL[p.rank]}</span><span className="min-w-0 flex-1 truncate">{p.title}</span><span className="shrink-0 text-xs text-slate-400">{p.correct}/{p.total}</span></p>
                ))}
              </div>
            </div>
          ) : <div className={card}><p className="text-sm text-slate-300">Henüz düello rozetin yok. İlk üçe girdiğinde burada görünür.</p></div>}
          <button onClick={() => { window.location.hash = "/duello"; }} className="flex w-full items-center justify-between rounded-2xl border border-teal-400/30 bg-teal-500/10 px-4 py-3 text-left text-sm font-semibold text-teal-100"><span>Düelloya git</span><ArrowUpRight className="h-4 w-4" /></button>
          <button onClick={async () => { await sb?.auth.signOut(); setToast("Çıkış yapıldı."); window.location.hash = "/"; }} className="flex w-full items-center justify-center gap-2 rounded-xl border border-sky-300/15 px-4 py-3 text-sm text-slate-200 hover:bg-white/5"><LogOut className="h-4 w-4" /> Çıkış yap</button>
        </div>
      )}
      {tab === "karne" && <div className="mt-3"><KarnePage user={user} onLogin={onLogin} quizHist={quizHist} embedded /></div>}
      {tab === "notlar" && (
        <div className="mt-3 space-y-2">
          {mine.length === 0 && <div className={card}><p className="text-sm text-slate-300">Henüz not paylaşmadın. Not havuzundan ilk notunu paylaşabilirsin.</p></div>}
          {mine.map((n) => (
            <div key={n.id} className={`${card} flex items-center gap-3 !p-3`}>
              <FileText className="h-5 w-5 shrink-0 text-teal-300" />
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-white">{n.title}</p><p className="truncate text-xs text-slate-400">{n.course}</p></div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs ${n.status === "approved" ? "bg-teal-500/25 text-teal-100" : "bg-amber-500/25 text-amber-100"}`}>{n.status === "approved" ? "Yayında" : "Onay bekliyor"}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------- Sayfalar / menü ---------- */
const PAGES = [
  { id: "home", label: "Ana sayfa", Icon: HeartPulse },
  { id: "notlar", label: "Notlar", Icon: FileText },
  { id: "test", label: "Test", Icon: ClipboardList },
  { id: "mitler", label: "Doğru mu?", Icon: Lightbulb },
  { id: "instagram", label: "Instagram", Icon: Insta },
];
const pageFromHash = () => {
  const h = window.location.hash.replace("#/", "");
  return PAGES.some((p) => p.id === h) || h === "yonetim" || h === "hakkimizda" || h === "duello" || h === "karne" || h === "profil" ? h : "home";
};

// Tanıtım videosu: public/tanitim.mp4 için "/tanitim.mp4" ya da bir YouTube linki yaz.
const VIDEO_URL = "/tanitim.mp4";
const VIDEO_PORTRAIT = true; // true: dikey (9:16) çerçeve, false: yatay çerçeve.
const VIDEO_FIT = "cover"; // "cover": çerçeveyi doldurur (kenarlar kırpılabilir), "contain": videonun tamamı görünür.

function VideoCard({ max }) {
  const [playing, setPlaying] = useState(false);
  const [broken, setBroken] = useState(false);
  if (!VIDEO_URL) {
    return (
      <div className="grid aspect-video w-full place-items-center rounded-2xl border border-sky-300/15 bg-gradient-to-br from-teal-700/40 to-[#0a1a30] p-4 text-center">
        <div>
          <Logo size="mx-auto h-16 w-16" />
          <span className="mx-auto mt-3 grid h-11 w-11 place-items-center rounded-full bg-white/15"><Play className="h-5 w-5 text-white" /></span>
          <p className="mt-2 text-sm text-slate-300">Tanıtım videosu hazırlanıyor</p>
        </div>
      </div>
    );
  }
  // YouTube linki ya da kendi dosyan (/tanitim.mp4) olabilir. Dikey video için şık telefon kartı.
  const yt = VIDEO_URL.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  const src = yt ? `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&controls=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&fs=0&disablekb=1&loop=1&playlist=${yt[1]}` : VIDEO_URL;
  const wrap = max || (VIDEO_PORTRAIT ? "max-w-[300px]" : "max-w-full");
  return (
    <div className={`relative mx-auto w-full ${wrap}`}>
      <div className="pointer-events-none absolute -inset-3 rounded-[2.5rem] bg-gradient-to-br from-teal-500/40 via-sky-500/20 to-rose-600/30 blur-2xl" aria-hidden="true" />
      <div className={`relative w-full overflow-hidden border ${VIDEO_PORTRAIT ? "aspect-[9/16] rounded-[2rem]" : "aspect-[850/442] rounded-2xl"} border-sky-300/25 bg-[#050d1b] shadow-2xl shadow-teal-900/40 ring-1 ring-white/10`}>
        {playing ? (
          <>
            {yt
              ? <iframe src={src} title="AFSÜ Diyaliz Team tanıtım videosu" allow="autoplay; encrypted-media; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" className="absolute inset-0 h-full w-full" />
              : <video src={src} autoPlay loop playsInline preload="auto" onError={() => setBroken(true)} onClick={(e) => { const v = e.currentTarget; if (v.paused) v.play(); else v.pause(); }} className={`absolute inset-0 h-full w-full bg-black ${VIDEO_FIT === "contain" ? "object-contain" : "object-cover"}`} />}
            {broken && <div className="absolute inset-0 grid place-items-center bg-[#050d1b] p-6 text-center text-sm text-slate-300">Video şu an yüklenemedi. Biraz sonra tekrar dene.</div>}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#050d1b] to-transparent" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#050d1b] to-transparent" aria-hidden="true" />
            <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2">
              <Logo size="h-8 w-8" />
              <span className="font-display text-xs font-bold text-white drop-shadow">@afsudiyalizteam</span>
            </div>
            <button onClick={() => { setPlaying(false); setBroken(false); }} aria-label="Videoyu kapat" className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/50 text-white backdrop-blur active:scale-90"><X className="h-4 w-4" /></button>
          </>
        ) : (
          <button onClick={() => setPlaying(true)} aria-label="Tanıtım videosunu oynat" className="group absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-teal-700/50 via-[#0a1a30] to-[#050d1b] p-6 text-center">
            <svg viewBox="0 0 300 80" className="absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-40" fill="none" aria-hidden="true" preserveAspectRatio="none">
              <path className="ecg" d="M0 40 H70 L82 40 L92 12 L106 68 L120 26 L130 40 H300" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <Logo size="relative h-16 w-16" />
            <span className="beat relative mt-4 grid h-16 w-16 place-items-center rounded-full bg-white/95 text-slate-950 shadow-xl shadow-teal-500/30 transition group-active:scale-90"><Play className="ml-0.5 h-7 w-7 fill-current" /></span>
            <span className="relative mt-4 font-display text-lg font-bold text-white">Tanıtım videosu</span>
            <span className="relative mt-1 text-xs text-slate-300">Oynatmak için dokun</span>
          </button>
        )}
      </div>
    </div>
  );
}

// Girişte çıkan "Yenilikler" kartı. Yeni duyuru için WELCOME_VER'i değiştir: "Bir daha gösterme" diyenlere de yeniden çıkar.
const WELCOME_VER = "v1";
function WelcomeModal({ open, onClose, onGo }) {
  const [never, setNever] = useState(false);
  const close = () => {
    try { sessionStorage.setItem("afsu_welcome", "1"); } catch { /* sessizce geç */ }
    if (never) save("afsu_welcome_seen", WELCOME_VER);
    onClose();
  };
  const items = [
    ["test", ClipboardList, `Test bölümü: ${TEST_BANK.length} soruyla eksiğini gör`],
    ["mitler", Lightbulb, `Doğru mu, yanlış mı? ${QUESTIONS.length} soru, 3 seviye`],
    ["notlar", FileText, "Not havuzu: PDF notlarını paylaş"],
  ];
  return (
    <Modal open={open} onClose={close} title="Yenilikler">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/25 px-3 py-1 text-xs font-semibold text-teal-100 ring-1 ring-teal-400/50">Yenilikler burada</span>
        <h3 className="mt-3 font-display text-2xl font-bold text-white">AFSÜ Diyaliz Team</h3>
        <p className="mt-1 text-sm text-slate-300">Önce kısa tanıtım videomuza bak.</p>
      </div>
      <div className="mt-5"><VideoCard max="max-w-[230px]" /></div>
      <div className="mt-6 space-y-2">
        {items.map(([id, Icon, text]) => (
          <button key={id} onClick={() => { close(); onGo(id); }} className="flex w-full items-center gap-3 rounded-xl border border-sky-300/15 bg-white/5 px-3.5 py-2.5 text-left text-sm text-slate-100 hover:bg-white/10 active:scale-[0.99]">
            <Icon className="h-5 w-5 shrink-0 text-teal-300" /><span>{text}</span>
          </button>
        ))}
      </div>
      <label className="mt-4 flex items-center gap-3 text-xs text-slate-300">
        <input type="checkbox" checked={never} onChange={(e) => setNever(e.target.checked)} className="h-4 w-4 shrink-0 accent-teal-500" />
        Bir daha gösterme
      </label>
      <button onClick={close} className="mt-4 w-full rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/20 active:scale-[0.98]">Siteye geç</button>
    </Modal>
  );
}

/* ---------- Sayaç animasyonu ve duyurular ---------- */
// Ekrana girince 0'dan değere sayar, ekrandan çıkınca sıfırlanır; tekrar görününce yine sayar.
function CountUp({ value, duration = 1400 }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const run = () => {
      cancelAnimationFrame(raf);
      if (calm) { setN(value); return; }
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / duration);
        setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) run();
      else { cancelAnimationFrame(raf); setN(0); }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, duration]);
  return <span ref={ref}>{n.toLocaleString("tr-TR")}</span>;
}

function AnnouncementsModal({ open, onClose, items, seenAt }) {
  const fmt = (d) => new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
  return (
    <Modal open={open} onClose={onClose} title="Duyurular">
      <div className="flex items-center gap-3 pr-8">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-teal-500/25 text-teal-100 ring-1 ring-teal-400/50"><Megaphone className="h-5 w-5" /></span>
        <div><h3 className="font-display text-xl font-bold text-white">Duyurular</h3><p className="text-xs text-slate-400">@afsudiyalizteam'dan haberler</p></div>
      </div>
      {items.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-sky-300/20 p-6 text-center text-sm text-slate-400">Henüz duyuru yok. Yeni bir şey olunca burada görürsün.</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {items.map((a) => {
            const fresh = !seenAt || new Date(a.created_at) > new Date(seenAt);
            return (
              <li key={a.id} className={`rounded-2xl border p-4 ${fresh ? "border-teal-400/50 bg-teal-500/10" : "border-sky-300/15 bg-white/5"}`}>
                <div className="flex items-center gap-2 text-xs text-slate-400"><span>{fmt(a.created_at)}</span>{fresh && <span className="rounded-full bg-teal-500 px-2 py-0.5 text-[10px] font-semibold text-slate-950">Yeni</span>}</div>
                <h4 className="mt-1 font-display text-base font-bold leading-snug text-white">{a.title}</h4>
                {a.body && <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-slate-300">{a.body}</p>}
              </li>
            );
          })}
        </ul>
      )}
    </Modal>
  );
}

/* ---------- Doğru mu, yanlış mı? oyunu ---------- */
function TrueFalse() {
  const [phase, setPhase] = useState("start"); // start | play | done
  const [level, setLevel] = useState("all");
  const [deck, setDeck] = useState([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [log, setLog] = useState([]);
  const [retry, setRetry] = useState(false);
  const [best, setBest] = useState(() => load("afsu_tf_best", {}));

  const begin = (lv, ids) => {
    const qs = ids
      ? ids.map((id) => QUESTIONS.find((x) => x.id === id))
      : shuffle(QUESTIONS.filter((x) => lv === "all" || x.level === lv)).slice(0, TF_ROUND);
    setLevel(lv); setDeck(qs); setIdx(0); setPicked(null); setLog([]); setRetry(!!ids); setPhase("play");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const q = deck[idx];
  const answer = (v) => {
    if (picked !== null) return;
    setPicked(v);
    setLog((l) => [...l, { id: q.id, level: q.level, ok: v === q.isTrue }]);
  };
  const finish = () => {
    if (!retry) {
      const score = log.filter((x) => x.ok).length;
      const key = String(level);
      if (score > (best[key] ?? -1)) { const nb = { ...best, [key]: score }; setBest(nb); save("afsu_tf_best", nb); }
    }
    setPhase("done");
  };
  const next = () => {
    if (idx + 1 >= deck.length) finish();
    else { setIdx(idx + 1); setPicked(null); }
  };

  /* Seviye seçimi */
  if (phase === "start") {
    const cards = [...LEVELS, { id: "all", label: "Karışık", desc: "Üç seviyeden rastgele sorular", chip: "bg-indigo-500/25 text-indigo-100 ring-indigo-400/50" }];
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {cards.map((c) => {
          const n = QUESTIONS.filter((x) => c.id === "all" || x.level === c.id).length;
          const per = Math.min(TF_ROUND, n);
          const b = best[String(c.id)];
          return (
            <button key={c.id} onClick={() => begin(c.id)} className="flex flex-col rounded-3xl border border-sky-300/15 bg-[#0a1a30]/90 p-4 text-left backdrop-blur-xl transition hover:bg-white/5 active:scale-[0.98]">
              <span className={`self-start rounded-full px-3 py-1 text-xs ring-1 ${c.chip}`}>{c.label}</span>
              <span className="mt-3 font-display text-lg font-bold leading-snug text-white">{c.desc}</span>
              <span className="mt-2 text-xs text-slate-400">{n} soru · her turda {per} soru{b !== undefined ? ` · En iyi: ${b}/${per}` : ""}</span>
            </button>
          );
        })}
      </div>
    );
  }

  /* Soru ekranı */
  if (phase === "play" && q) {
    const lv = levelOf(q.level);
    const answered = picked !== null;
    const ok = answered && picked === q.isTrue;
    return (
      <div>
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>Soru {idx + 1} / {deck.length}</span>
          <button onClick={() => setPhase("start")} className="rounded-full px-3 py-1 text-xs hover:bg-white/5 hover:text-slate-200">Çık</button>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-teal-400 transition-all" style={{ width: `${((idx + (answered ? 1 : 0)) / deck.length) * 100}%` }} />
        </div>
        <article className="mt-4 rounded-3xl border border-sky-300/15 bg-[#0a1a30]/90 p-5 backdrop-blur-xl">
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1 text-xs ring-1 ${lv.chip}`}>{lv.label}</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">{q.topic}</span>
          </div>
          <p className="mt-4 text-xs text-slate-400">Bu ifade doğru mu?</p>
          <h3 className="mt-1 font-display text-xl font-bold leading-snug text-white">{q.text}</h3>
          {!answered ? (
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button onClick={() => answer(true)} className="rounded-xl border border-teal-400/60 bg-teal-500/25 py-3.5 text-sm font-semibold text-teal-50 active:scale-95">Doğru</button>
              <button onClick={() => answer(false)} className="rounded-xl border border-rose-400/60 bg-rose-600/25 py-3.5 text-sm font-semibold text-rose-50 active:scale-95">Yanlış</button>
            </div>
          ) : (
            <div className={`pop mt-4 rounded-2xl border p-4 ${ok ? "border-teal-400/50 bg-teal-500/20" : "border-amber-400/50 bg-amber-500/20"}`}>
              <p className={`flex items-center gap-2 text-sm font-semibold ${ok ? "text-teal-200" : "text-amber-200"}`}>
                {ok ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                {ok ? "Doğru bildin!" : q.isTrue ? "Bu ifade doğruydu." : "Bu ifade yanlıştı."}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-200">{q.fact}</p>
            </div>
          )}
        </article>
        {answered && (
          <button onClick={next} className="mt-4 w-full rounded-2xl bg-gradient-to-r from-teal-500 to-sky-600 px-5 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/20 active:scale-[0.98]">
            {idx + 1 >= deck.length ? "Sonucu gör" : "Sonraki soru"}
          </button>
        )}
      </div>
    );
  }

  /* Sonuç ekranı */
  const total = deck.length;
  const score = log.filter((x) => x.ok).length;
  const wrong = log.filter((x) => !x.ok).map((x) => x.id);
  const pct = total ? Math.round((score / total) * 100) : 0;
  return (
    <div className="space-y-3">
      <div className="rounded-3xl border border-sky-300/15 bg-[#0a1a30]/90 p-6 text-center backdrop-blur-xl">
        <p className="text-sm text-slate-400">{retry ? "Tekrar turu sonucu" : "Tur sonucu"}</p>
        <p className="mt-1 font-display text-5xl font-extrabold text-white">{score}<span className="text-2xl text-slate-400">/{total}</span></p>
        <p className="mt-2 text-sm text-slate-300">
          {pct >= 80 ? "Çok iyi. Temelin sağlam." : pct >= 50 ? "İyi gidiyorsun. Yanlışlarını tekrar etmek işe yarar." : "Önce Kolay seviyeden başlayıp yanlışlarını tekrar etmeni öneririz."}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {LEVELS.map((l) => {
            const t = log.filter((x) => x.level === l.id);
            if (!t.length) return null;
            return <span key={l.id} className={`rounded-full px-3 py-1 text-xs ring-1 ${l.chip}`}>{l.label}: {t.filter((x) => x.ok).length}/{t.length}</span>;
          })}
        </div>
      </div>
      {wrong.length > 0 && (
        <div className="rounded-3xl border border-sky-300/15 bg-[#0a1a30]/90 p-4 backdrop-blur-xl">
          <h3 className="font-display text-base font-bold text-white">Tekrar etmen gerekenler</h3>
          <ul className="mt-2 space-y-2">
            {wrong.map((id) => {
              const x = QUESTIONS.find((y) => y.id === id);
              return (
                <li key={id} className="text-sm leading-relaxed text-slate-300">
                  <span className={`mr-2 rounded-full px-2 py-0.5 text-xs ${x.isTrue ? "bg-teal-500/25 text-teal-100" : "bg-rose-500/25 text-rose-100"}`}>{x.isTrue ? "Doğru" : "Yanlış"}</span>{x.text}
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-3">
        {wrong.length > 0 && <button onClick={() => begin(level, wrong)} className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-600 px-4 py-3.5 text-sm font-semibold text-slate-950 active:scale-[0.98]"><RotateCw className="h-4 w-4" /> Yanlışları tekrar et</button>}
        <button onClick={() => begin(level)} className="rounded-2xl border border-sky-300/15 px-4 py-3.5 text-sm text-slate-100 hover:bg-white/5 active:scale-[0.98]">Yeni tur</button>
        <button onClick={() => setPhase("start")} className="rounded-2xl border border-sky-300/15 px-4 py-3.5 text-sm text-slate-100 hover:bg-white/5 active:scale-[0.98]">Seviye seç</button>
      </div>
    </div>
  );
}

/* ---------- Ana uygulama ---------- */
export default function App() {
  const [page, setPage] = useState(pageFromHash);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [dbNotes, setDbNotes] = useState([]);
  const [users, setUsers] = useState([]);
  const [shareOpen, setShareOpen] = useState(false);
  const [fbOpen, setFbOpen] = useState(false);
  const [privOpen, setPrivOpen] = useState(false);
  const [recovery, setRecovery] = useState(false);
  const [igPosts, setIgPosts] = useState([]);
  const [igLink, setIgLink] = useState("");
  const [quizHist, setQuizHist] = useState([]);
  const [duels, setDuels] = useState([]);
  const [podiums, setPodiums] = useState([]);
  const [pod, setPod] = useState(null);
  const [userNotes, setUserNotes] = useState(() => load("afsu_notes", []));
  const [cat, setCat] = useState("all");
  const [grp, setGrp] = useState("all");
  const [query, setQuery] = useState("");
  const [votes, setVotes] = useState(() => load("afsu_votes", POLL.opts.map(() => 0)));
  const [myVote, setMyVote] = useState(() => load("afsu_myvote", null));
  const [openQ, setOpenQ] = useState(0);
  const [toast, setToast] = useState("");
  const [anns, setAnns] = useState([]);
  const [annOpen, setAnnOpen] = useState(false);
  const [annSeen, setAnnSeen] = useState(() => load("afsu_ann_seen", ""));
  const [annMark, setAnnMark] = useState("");
  const [annTitle, setAnnTitle] = useState("");
  const [annBody, setAnnBody] = useState("");
  const [stats, setStats] = useState(null);
  const [classOpen, setClassOpen] = useState(false);
  const [classLater, setClassLater] = useState(() => { try { return !!sessionStorage.getItem("afsu_class_later"); } catch { return false; } });
  const [welcomeOpen, setWelcomeOpen] = useState(() => { try { return !sessionStorage.getItem("afsu_welcome") && load("afsu_welcome_seen", "") !== WELCOME_VER; } catch { return false; } });

  useEffect(() => {
    const onHash = () => { setPage(pageFromHash()); window.scrollTo({ top: 0 }); };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  useEffect(() => {
    // Uygulama olarak kurulabilirlik: manifest, tema rengi, simge ve hizmet çalışanı.
    const add = (tag, attrs) => { if (document.head.querySelector(`${tag}[data-pwa="${attrs.rel || attrs.name}"]`)) return; const el = document.createElement(tag); Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v)); el.setAttribute("data-pwa", attrs.rel || attrs.name); document.head.appendChild(el); };
    add("link", { rel: "manifest", href: "/manifest.webmanifest" });
    add("link", { rel: "apple-touch-icon", href: "/icon-192.png" });
    add("meta", { name: "theme-color", content: "#040b17" });
    add("meta", { name: "mobile-web-app-capable", content: "yes" });
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  useEffect(() => {
    // Chrome'un otomatik çevirisi yazıları bozuyordu ("Not" -> "Değil"): çeviriyi kapat.
    document.documentElement.lang = "tr";
    document.documentElement.setAttribute("translate", "no");
    let m = document.querySelector('meta[name="google"]');
    if (!m) { m = document.createElement("meta"); m.name = "google"; document.head.appendChild(m); }
    m.content = "notranslate";
  }, []);
  const uid = user?.id;
  const isAdmin = profile?.role === "admin";
  const [maint, setMaint] = useState({ on: false });
  const loadMaint = useCallback(async () => {
    if (!sb) return;
    try {
      const { data, error } = await sb.rpc("site_maintenance");
      if (!error && data && typeof data === "object") setMaint(data);
    } catch (e) { /* ağ hatasında mevcut durum korunur */ }
  }, []);
  useEffect(() => {
    loadMaint();
    const t = setInterval(loadMaint, 45000);
    const vis = () => { if (document.visibilityState === "visible") loadMaint(); };
    document.addEventListener("visibilitychange", vis);
    return () => { clearInterval(t); document.removeEventListener("visibilitychange", vis); };
  }, [loadMaint]);
  useEffect(() => {
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data } = sb.auth.onAuthStateChange((ev, sess) => {
      setUser(sess?.user ?? null);
      if (ev === "PASSWORD_RECOVERY") { setRecovery(true); setAuthOpen(true); }
    });
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!sb || !uid) { setProfile(null); return; }
    sb.from("profiles").select("*").eq("id", uid).maybeSingle().then(({ data }) => setProfile(data));
  }, [uid]);
  const loadNotes = useCallback(async () => {
    if (!sb) return;
    const { data } = await sb.from("notes").select("*").order("created_at", { ascending: false });
    setDbNotes(data || []);
  }, []);
  const loadUsers = useCallback(async () => {
    if (!sb) return;
    const { data } = await sb.from("profiles").select("*").order("created_at", { ascending: false });
    setUsers(data || []);
  }, []);
  useEffect(() => { loadNotes(); }, [loadNotes, uid]);
  useEffect(() => { if (isAdmin) loadUsers(); }, [isAdmin, loadUsers]);
  const loadPosts = useCallback(async () => {
    if (!sb) return;
    const { data } = await sb.from("ig_posts").select("*").order("created_at", { ascending: false });
    setIgPosts(data || []);
  }, []);
  useEffect(() => { loadPosts(); }, [loadPosts]);
  const loadDuels = useCallback(async () => {
    if (!sb) return;
    const { data } = await sb.from("duels").select("*").order("starts_at", { ascending: false }).limit(30);
    setDuels((data || []).filter((d) => !d.cancelled_at));
  }, []);
  useEffect(() => { loadDuels(); const t = setInterval(loadDuels, 60000); return () => clearInterval(t); }, [loadDuels]);
  useEffect(() => {
    if (!sb || !uid) { setPodiums([]); return; }
    sb.rpc("duel_my_podiums").then(({ data }) => {
      const list = Array.isArray(data) ? data : [];
      setPodiums(list);
      const seen = load("afsu_podium_seen", []);
      const fresh = list.find((p) => !seen.includes(p.id));
      if (fresh) setPod(fresh);
    });
  }, [uid]);
  const closePod = () => {
    if (pod?.id) save("afsu_podium_seen", [...new Set([...load("afsu_podium_seen", []), pod.id])]);
    setPod(null);
  };
  const loadAnns = useCallback(async () => {
    if (!sb) return;
    const { data } = await sb.from("announcements").select("*").order("created_at", { ascending: false }).limit(30);
    setAnns(data || []);
  }, []);
  useEffect(() => { loadAnns(); }, [loadAnns]);
  useEffect(() => {
    // Ziyareti (IP'ye göre günde bir kez) say, sonra sayıları getir.
    if (!sb) return;
    (async () => {
      let seen = false;
      try { seen = !!sessionStorage.getItem("afsu_visit"); } catch { /* sessizce geç */ }
      if (!seen) {
        await sb.rpc("track_visit");
        try { sessionStorage.setItem("afsu_visit", "1"); } catch { /* sessizce geç */ }
      }
      const { data } = await sb.rpc("site_stats");
      if (data && typeof data.users === "number") setStats(data);
    })();
  }, []);
  useEffect(() => {
    if (profile?.suspended) {
      sb.auth.signOut();
      setToast("Hesabın askıya alındı. Bilgi için geri bildirim gönderebilirsin.");
    }
  }, [profile]);
  useEffect(() => {
    if (sb && uid) {
      sb.from("quiz_answers").select("question_id,course,topic,correct,created_at").eq("user_id", uid).order("created_at", { ascending: false }).limit(1000)
        .then(({ data }) => setQuizHist(data || []));
    } else {
      setQuizHist(load("afsu_quiz", []));
    }
  }, [uid]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(""), 2600); return () => clearTimeout(t); }, [toast]);

  const notes = useMemo(() => {
    const real = dbNotes
      .filter((n) => n.status === "approved" || n.user_id === uid)
      .map((n) => ({ id: n.id, cat: n.category, title: n.title, course: n.course, author: n.author_name || "Öğrenci", url: n.url, file_path: n.file_path, pending: n.status === "pending" }));
    return [...userNotes, ...real, ...(SHOW_SEED_NOTES ? SEED_NOTES : [])];
  }, [userNotes, dbNotes, uid]);
  const shown = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    return notes.filter((n) => (cat === "all" ? grp === "all" || catOf(n.cat).term === grp : n.cat === cat) && (!q || `${n.title} ${n.course}`.toLocaleLowerCase("tr").includes(q)));
  }, [notes, cat, grp, query]);

  const totalVotes = votes.reduce((a, b) => a + b, 0);
  const grpCourses = grp === "all" ? [] : TERMS.find((t) => t.id === grp)?.courses ?? [];

  const go = (id) => { if (pageFromHash() === id) window.scrollTo({ top: 0, behavior: "smooth" }); else window.location.hash = `/${id}`; };
  const openShare = () => {
    if (sb && !user) { setAuthOpen(true); setToast("Not paylaşmak için önce giriş yap."); return; }
    setShareOpen(true);
  };
  const addNote = async (n) => {
    if (!sb) return { error: "Dosya yüklemek için sunucu bağlantısı gerekir." };
    const rid = crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(36).slice(2, 12);
    const path = `${user.id}/${rid}.pdf`;
    const up = await sb.storage.from("note-files").upload(path, n.file, { contentType: "application/pdf" });
    if (up.error) return { error: "Dosya yüklenemedi. PDF olduğundan ve 10 MB'ı geçmediğinden emin ol." };
    const { data: pub } = sb.storage.from("note-files").getPublicUrl(path);
    const { error } = await sb.from("notes").insert({ user_id: user.id, title: n.title, course: n.course, category: n.cat, url: pub.publicUrl, file_path: path, author_name: n.author || profile?.full_name || null });
    if (error) { await sb.storage.from("note-files").remove([path]); return { error: "Not gönderilemedi. Biraz sonra tekrar dene." }; }
    await loadNotes();
    return {};
  };
  const saveQuiz = async (rows) => {
    const stamped = rows.map((r) => ({ ...r, created_at: new Date().toISOString() }));
    if (sb && user) {
      const { error } = await sb.from("quiz_answers").insert(rows.map((r) => ({ ...r, user_id: user.id })));
      if (error) setToast("Sonuçların hesabına kaydedilemedi.");
      setQuizHist((h) => [...stamped, ...h].slice(0, 1000));
      return;
    }
    const next = [...stamped, ...quizHist].slice(0, 1000);
    setQuizHist(next);
    save("afsu_quiz", next);
  };
  const addPost = async (raw = igLink) => {
    const p = parseIg(raw);
    if (!p) return setToast("Geçerli bir Instagram gönderi linki yapıştır.");
    const { error } = await sb.from("ig_posts").insert({ kind: p.kind, code: p.code, url: `https://www.instagram.com/${p.kind}/${p.code}/` });
    if (error) return setToast(error.code === "23505" ? "Bu gönderi zaten ekli." : "Eklenemedi.");
    setIgLink(""); setToast("Gönderi eklendi."); loadPosts();
  };
  const deletePost = async (id) => {
    if (!(await ask("Bu gönderi sitenden kaldırılsın mı?", { title: "Gönderiyi kaldır", confirmText: "Kaldır", danger: true }))) return;
    const { error } = await sb.from("ig_posts").delete().eq("id", id);
    setToast(error ? "Kaldırılamadı." : "Gönderi kaldırıldı."); loadPosts();
  };
  const approveNote = async (id) => { const { error } = await sb.from("notes").update({ status: "approved" }).eq("id", id); setToast(error ? "İşlem başarısız." : "Not onaylandı."); loadNotes(); };
  const deleteNote = async (n) => {
    if (!(await ask("Bu not ve PDF dosyası silinsin mi?", { title: "Notu sil", confirmText: "Sil", danger: true }))) return;
    const { error } = await sb.from("notes").delete().eq("id", n.id);
    if (!error && n.file_path) await sb.storage.from("note-files").remove([n.file_path]);
    setToast(error ? "Silinemedi." : "Not silindi."); loadNotes();
  };
  const toggleRole = async (u) => {
    if (!(await ask(`${u.full_name || u.email} için rol değiştirilsin mi?`, { title: "Rolü değiştir", confirmText: "Değiştir" }))) return;
    const { error } = await sb.from("profiles").update({ role: u.role === "admin" ? "student" : "admin" }).eq("id", u.id);
    setToast(error ? "İşlem başarısız." : "Rol güncellendi."); loadUsers();
  };
  const unread = anns.filter((a) => !annSeen || new Date(a.created_at) > new Date(annSeen)).length;
  const openAnn = () => {
    setAnnMark(annSeen);
    setAnnOpen(true);
    loadAnns();
    const latest = anns[0]?.created_at;
    if (latest) { setAnnSeen(latest); save("afsu_ann_seen", latest); }
  };
  const addAnn = async () => {
    const title = annTitle.trim();
    const body = annBody.trim();
    if (title.length < 3) return setToast("Başlık en az 3 karakter olmalı.");
    const { error } = await sb.from("announcements").insert({ title, body: body || null, created_by: user.id });
    if (error) return setToast("Duyuru yayınlanamadı. SQL güncellemesini yaptın mı?");
    setAnnTitle(""); setAnnBody(""); setToast("Duyuru yayınlandı."); loadAnns();
  };
  const deleteAnn = async (id) => {
    if (!(await ask("Bu duyuru silinsin mi?", { title: "Duyuruyu sil", confirmText: "Sil", danger: true }))) return;
    const { error } = await sb.from("announcements").delete().eq("id", id);
    setToast(error ? "Silinemedi." : "Duyuru silindi."); loadAnns();
  };
  const needClass = !!user && !!profile && "entry_year" in profile && profile.entry_year == null && !profile.suspended;
  const askClass = needClass && !classLater && !authOpen && !(welcomeOpen && !!VIDEO_URL) && !pod;
  const closeClass = () => { setClassOpen(false); setClassLater(true); try { sessionStorage.setItem("afsu_class_later", "1"); } catch { /* sessizce geç */ } };
  const onClassSaved = async (c) => {
    setClassOpen(false);
    if (sb && uid) {
      const { data } = await sb.from("profiles").select("*").eq("id", uid).maybeSingle();
      if (data) setProfile(data);
    }
    setToast(`${c}. Sınıf Takımına katıldın.`);
  };
  const setUserClass = async (u, v) => {
    const { error } = await sb.rpc("admin_set_class", { target: u.id, p_class: v === "" ? null : Number(v) });
    if (error) return setToast("Sınıf değiştirilemedi. Sınıf SQL'ini çalıştırdın mı?");
    setToast("Sınıf güncellendi."); loadUsers();
  };
  const toggleSuspend = async (u) => {
    const on = !u.suspended;
    const who = u.full_name || u.email;
    if (!(await ask(on ? `${who} askıya alınsın mı? Giriş yapamaz ve not paylaşamaz.` : `${who} için askı kaldırılsın mı?`, { title: on ? "Hesabı askıya al" : "Askıyı kaldır", confirmText: on ? "Askıya al" : "Kaldır", danger: on }))) return;
    const { error } = await sb.rpc("admin_set_suspended", { target: u.id, flag: on });
    if (error) setToast(/yonetici/i.test(error.message) ? "Yönetici askıya alınamaz. Önce öğrenci yap." : "İşlem başarısız. SQL güncellemesini yaptın mı?");
    else setToast(on ? "Hesap askıya alındı." : "Askı kaldırıldı.");
    loadUsers();
  };
  const deleteUser = async (u) => {
    const who = u.full_name || u.email;
    if (!(await ask(`${who} kalıcı olarak silinsin mi? Hesabı, notları ve test sonuçları silinir. Bu geri alınamaz.`, { title: "Kullanıcıyı sil", confirmText: "Kalıcı sil", danger: true }))) return;
    const { data: files } = await sb.from("notes").select("file_path").eq("user_id", u.id);
    const paths = (files || []).map((f) => f.file_path).filter(Boolean);
    if (paths.length) await sb.storage.from("note-files").remove(paths);
    const { error } = await sb.rpc("admin_delete_user", { target: u.id });
    if (error) setToast(/yonetici/i.test(error.message) ? "Yönetici silinemez. Önce öğrenci yap." : "Silinemedi. SQL güncellemesini yaptın mı?");
    else setToast("Kullanıcı silindi.");
    loadUsers(); loadNotes();
  };
  const openNote = (n, download = false) => {
    if (!n.url) return setToast("Bu bir örnek kart. Gerçek not eklenince burada açılır.");
    const href = download && n.file_path ? `${n.url}?download=${encodeURIComponent(`${n.title}.pdf`)}` : n.url;
    window.open(href, "_blank", "noopener,noreferrer");
  };
  const vote = (i) => {
    if (myVote !== null) return;
    const next = votes.map((v, j) => (j === i ? v + 1 : v));
    setVotes(next); setMyVote(i); save("afsu_votes", next); save("afsu_myvote", i);
  };

  const tiles = [
    { id: "notlar", Icon: FileText, title: "Not havuzu", sub: `${notes.length} not`, cls: "border-teal-400/40 from-teal-600/40 to-teal-950/70", ic: "text-teal-200" },
    { id: "test", Icon: ClipboardList, title: "Test çöz", sub: `${TEST_BANK.length} soru`, cls: "border-cyan-400/40 from-cyan-600/40 to-cyan-950/70", ic: "text-cyan-200" },
    { id: "duello", Icon: Trophy, title: "Düello", sub: "Haftalık yarışma", cls: "border-amber-400/40 from-amber-600/40 to-amber-950/70", ic: "text-amber-200" },
    { id: "mitler", Icon: Lightbulb, title: "Doğru mu, yanlış mı?", sub: `${QUESTIONS.length} soru · 3 seviye`, cls: "border-indigo-400/40 from-indigo-600/40 to-indigo-950/70", ic: "text-indigo-200" },
    { id: "instagram", Icon: Insta, title: "Instagram", sub: "Duyuru ve anketler", cls: "border-rose-400/40 from-rose-600/40 to-rose-950/70", ic: "text-rose-200" },
    { id: "hakkimizda", Icon: Play, title: "Bizi tanı", sub: "Video ve amacımız", cls: "border-sky-400/40 from-sky-600/40 to-sky-950/70", ic: "text-sky-200" },
  ];

  const authEl = (
    <AuthModal podiums={podiums} open={authOpen} onClose={() => setAuthOpen(false)} user={user} profile={profile} onAdmin={() => { setAuthOpen(false); go("yonetim"); }} onDone={setToast} onPrivacy={() => setPrivOpen(true)} recovery={recovery} onRecovered={() => setRecovery(false)} onClass={() => { setAuthOpen(false); setClassOpen(true); }} onKarne={() => { setAuthOpen(false); go("karne"); }} onProfile={() => { setAuthOpen(false); go("profil"); }} />
  );

  if (maint.on && !isAdmin) {
    if (user && !profile) {
      return <div className="flex min-h-screen items-center justify-center bg-[#040b17] text-sm text-slate-400">Yükleniyor…</div>;
    }
    return (
      <>
        <MaintenancePage message={maint.message} onAdminLogin={() => setAuthOpen(true)} />
        {authEl}
        <ConfirmHost />
      </>
    );
  }

  return (
    <div translate="no" lang="tr" className="min-h-screen bg-[#040b17] text-slate-100 antialiased" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Fraunces:ital,wght@1,400&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');
        .font-display{font-family:'Bricolage Grotesque',system-ui,sans-serif}
        .font-script{font-family:'Fraunces',Georgia,serif;font-style:italic}
        .no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{scrollbar-width:none}
        @keyframes ecg{from{stroke-dashoffset:1400}to{stroke-dashoffset:0}}
        .ecg{stroke-dasharray:1400;animation:ecg 3.6s ease-in-out infinite alternate}
        @keyframes beat{0%,100%{transform:scale(1)}15%{transform:scale(1.07)}30%{transform:scale(1)}45%{transform:scale(1.05)}}
        .beat{animation:beat 1.6s ease-in-out infinite}
        @keyframes pop{from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:none}}
        .pop{animation:pop .22s ease-out}
        @media (prefers-reduced-motion:reduce){.ecg,.pop,.beat{animation:none}}
      `}</style>

      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-teal-600/20 blur-[100px]" />
        <div className="absolute right-[-6rem] top-1/3 h-96 w-96 rounded-full bg-blue-700/25 blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-rose-800/15 blur-[100px]" />
      </div>

      <div className="relative z-10">
        {/* ÜST BAR */}
        <header className="sticky top-0 z-40 border-b border-sky-300/15 bg-[#040b17]/80 backdrop-blur-xl" style={{ paddingTop: "env(safe-area-inset-top)" }}>
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2.5">
            <button onClick={() => go("home")} className="flex min-w-0 items-center gap-3 text-left" aria-label="Ana sayfa">
              <Logo />
              <span className="min-w-0 leading-tight">
                <span className="block truncate font-display text-base font-bold text-white">@afsudiyalizteam</span>
                <span className="block truncate text-[11px] text-slate-400">Afyonkarahisar Sağlık Bilimleri Üniversitesi</span>
              </span>
            </button>
            <nav className="hidden items-center gap-1 md:flex" aria-label="Ana menü">
              {PAGES.map(({ id, label }) => (
                <button key={id} onClick={() => go(id)} aria-current={page === id ? "page" : undefined} className={`rounded-full px-3.5 py-2 text-sm font-medium transition ${page === id ? "bg-teal-500/20 text-teal-200" : "text-slate-300 hover:bg-white/5"}`}>{label}</button>
              ))}
              <button onClick={() => go("hakkimizda")} aria-current={page === "hakkimizda" ? "page" : undefined} className={`rounded-full px-3.5 py-2 text-sm font-medium transition ${page === "hakkimizda" ? "bg-teal-500/20 text-teal-200" : "text-slate-300 hover:bg-white/5"}`}>Biz kimiz</button>
            </nav>
            <div className="flex shrink-0 items-center gap-2">
              <button onClick={openAnn} aria-label={unread ? `Duyurular, ${unread} yeni` : "Duyurular"} className="relative grid h-10 w-10 place-items-center rounded-full border border-sky-300/15 bg-[#0a1a30]/90 text-slate-200 transition hover:bg-white/10 active:scale-95">
                <Bell className="h-5 w-5" />
                {unread > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-[#040b17]">{unread > 9 ? "9+" : unread}</span>}
              </button>
              <button onClick={() => setAuthOpen(true)} className="flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-teal-500 to-sky-600 px-4 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/20 active:scale-95">
                {user ? <><span className="grid h-5 w-5 place-items-center rounded-full bg-slate-950/20 text-xs">{(profile?.full_name || user.email || "?")[0].toUpperCase()}</span><span className="max-w-[6rem] truncate">{(profile?.full_name || (user.email || "").split("@")[0]).split(" ")[0]}</span></> : <><span className="hidden sm:inline">Topluluğa&nbsp;</span>Katıl</>}
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 pb-8 pt-6">
          {/* ANA SAYFA */}
          {page === "home" && (
            <section className="flex flex-col items-center pt-4 text-center">
              <div className="beat"><Logo size="h-24 w-24" /></div>
              <h1 className="font-display mt-5 text-5xl font-extrabold text-white sm:text-7xl">Hoş geldiniz</h1>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-300 sm:max-w-md sm:text-base">AFSÜ Diyaliz Team: notların, deneyimlerin ve soruların aynı masada buluştuğu öğrenci topluluğu.</p>
              <svg viewBox="0 0 600 120" className="mt-5 h-24 w-full max-w-2xl sm:h-32" fill="none" aria-hidden="true" preserveAspectRatio="none">
                <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stopColor="#2dd4bf" /><stop offset="0.6" stopColor="#38bdf8" /><stop offset="1" stopColor="#e11d48" /></linearGradient></defs>
                <path className="ecg" d="M0 62 H110 L130 62 L146 22 L168 104 L190 42 L206 62 H330 L350 62 L366 22 L388 104 L410 42 L426 62 H600" stroke="url(#g)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <DuelBanner duels={duels} go={go} />
              <div className="mt-6 grid w-full max-w-xl grid-cols-2 gap-3 text-left">
                {tiles.map(({ id, Icon, title, sub, cls, ic }, ti) => (
                  <button key={id} onClick={() => go(id)} className={`flex flex-col justify-between rounded-3xl border bg-gradient-to-br p-4 transition active:scale-[0.97] ${cls} ${ti === tiles.length - 1 && tiles.length % 2 ? "col-span-2" : ""}`} style={{ minHeight: "7.5rem" }}>
                    <Icon className={`h-6 w-6 ${ic}`} />
                    <span><span className="block font-display text-base font-bold leading-tight text-white">{title}</span><span className="mt-0.5 block text-xs text-slate-300">{sub}</span></span>
                  </button>
                ))}
              </div>
              <button onClick={openShare} className="mt-4 flex w-full max-w-xl items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-600 px-5 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/20 active:scale-[0.98]"><Plus className="h-4 w-4" /> Not paylaş</button>
            </section>
          )}

          {/* NOTLAR */}
          {page === "notlar" && (
            <section>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <SectionHead title="Not havuzu" desc="Öğrencilerden öğrencilere: derslere göre notlar ve KPSS kaynakları." />
                <button onClick={openShare} className="mb-4 flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-500 to-sky-600 px-5 py-3 text-sm font-semibold text-slate-950 active:scale-95"><Upload className="h-4 w-4" /> Not paylaş</button>
              </div>
              <div className="relative mb-3">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Not ya da ders ara" className={`${inp} pl-11`} />
              </div>
              <div className={`no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 ${grpCourses.length > 1 ? "mb-2" : "mb-4"}`}>
                {[{ id: "all", label: "Tümü" }, ...TERMS].map((t) => (
                  <button key={t.id} onClick={() => { setGrp(t.id); setCat("all"); }} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${grp === t.id ? "bg-teal-500 text-slate-950" : "border border-sky-300/15 bg-[#0a1a30]/90 text-slate-300 hover:bg-white/10"}`}>{t.label}</button>
                ))}
              </div>
              {grpCourses.length > 1 && (
                <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4">
                  {[{ id: "all", short: "Tüm dersler" }, ...grpCourses].map((c) => (
                    <button key={c.id} onClick={() => setCat(c.id)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${cat === c.id ? "bg-sky-500 text-slate-950" : "border border-sky-300/15 text-slate-300 hover:bg-white/10"}`}>{c.short}</button>
                  ))}
                </div>
              )}
              {shown.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-sky-300/20 p-8 text-center">
                  <p className="font-medium text-white">{notes.length === 0 ? "Henüz paylaşılan not yok." : "Bu aramaya uyan not yok."}</p>
                  <p className="mt-1 text-sm text-slate-400">{notes.length === 0 ? "İlk notu sen paylaş, diğerleri sana teşekkür etsin." : "Aradığın not sende varsa, ilk paylaşan sen ol."}</p>
                  <button onClick={openShare} className="mt-4 rounded-full bg-teal-500 px-5 py-2.5 text-sm font-semibold text-slate-950">Not paylaş</button>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {shown.map((n) => {
                    const c = catOf(n.cat);
                    return (
                      <article key={n.id} className="flex flex-col rounded-3xl border border-sky-300/15 bg-[#0a1a30]/90 p-4 backdrop-blur-xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs ring-1 ${c.chip}`}>{c.short}</span>
                          {n.isNew && <span className="rounded-full bg-teal-500 px-2.5 py-1 text-xs font-semibold text-slate-950">Yeni</span>}
                          {n.pending && <span className="rounded-full bg-amber-500/25 px-2.5 py-1 text-xs text-amber-100">Onay bekliyor</span>}
                          {n.sample && <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-slate-400">Örnek</span>}
                        </div>
                        <h3 className="mt-3 font-display text-lg font-bold leading-snug text-white">{n.title}</h3>
                        <p className="mt-1 text-sm text-slate-400">{n.course} · {n.author}</p>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <button onClick={() => openNote(n)} className="flex items-center justify-center gap-2 rounded-xl border border-sky-300/15 py-2.5 text-sm text-slate-100 hover:bg-white/10"><Eye className="h-4 w-4" /> İncele</button>
                          <button onClick={() => openNote(n, true)} className="flex items-center justify-center gap-2 rounded-xl bg-teal-500/20 py-2.5 text-sm font-semibold text-teal-100 hover:bg-teal-500/30"><Download className="h-4 w-4" /> İndir</button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {page === "test" && <TestPage hist={quizHist} onSave={saveQuiz} loggedIn={!!user} onLogin={() => setAuthOpen(true)} />}

          {/* DOĞRU MU, YANLIŞ MI */}
          {page === "duello" && <DuelPage user={user} onLogin={() => setAuthOpen(true)} setToast={setToast} duels={duels} openPod={setPod} needClass={needClass} onPickClass={() => setClassOpen(true)} onKarne={() => go("karne")} />}
          {page === "profil" && <ProfilePage user={user} profile={profile} onLogin={() => setAuthOpen(true)} podiums={podiums} notes={dbNotes} quizHist={quizHist} onClass={() => setClassOpen(true)} setToast={setToast} />}
          {page === "karne" && <KarnePage user={user} onLogin={() => setAuthOpen(true)} quizHist={quizHist} />}

          {page === "mitler" && (
            <section>
              <SectionHead title="Doğru mu, yanlış mı?" desc="Seviyeni seç, ifadeye karar ver, sonra gerçeği gör." />
              <TrueFalse />
              <p className="mt-4 text-xs leading-relaxed text-slate-500">Eğitim amaçlıdır; klinik karar ve tıbbi tavsiye yerine geçmez.</p>
            </section>
          )}

          {/* INSTAGRAM */}
          {page === "instagram" && (
            <section>
              <SectionHead title="Instagram'dan" desc="Duyurular, anketler ve sorular @afsudiyalizteam hesabında. Burada özetini görürsün." />
              {igPosts.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-sky-300/20 p-8 text-center">
                  <p className="font-medium text-white">Gönderiler çok yakında burada.</p>
                  <p className="mt-1 text-sm text-slate-400">Şimdilik hesabımızı Instagram'dan takip edebilirsin.</p>
                  <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-teal-500 px-5 py-2.5 text-sm font-semibold text-slate-950"><Insta className="h-4 w-4" /> Instagram'a git</a>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {igPosts.slice(0, 6).map((p) => (
                    <div key={p.id} className="overflow-hidden rounded-3xl border border-sky-300/15 bg-white">
                      <iframe src={`https://www.instagram.com/${p.kind}/${p.code}/embed`} title="Instagram gönderisi" loading="lazy" scrolling="no" className="block h-[560px] w-full" />
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#0a1a30] py-3 text-sm text-slate-100"><Insta className="h-4 w-4" /> Instagram'da aç</a>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-3xl border border-sky-300/15 bg-[#0a1a30]/90 p-4 backdrop-blur-xl">
                  <h3 className="font-display text-lg font-bold text-white">{POLL.q}</h3>
                  <div className="mt-3 space-y-2">
                    {POLL.opts.map((o, i) => {
                      const pct = totalVotes ? Math.round((votes[i] / totalVotes) * 100) : 0;
                      return (
                        <button key={o} onClick={() => vote(i)} disabled={myVote !== null} className={`relative w-full overflow-hidden rounded-xl border px-4 py-3 text-left text-sm ${myVote === i ? "border-teal-300/60" : "border-sky-300/15"} ${myVote === null ? "hover:bg-white/10 active:scale-[0.99]" : ""}`}>
                          {myVote !== null && <span className="absolute inset-y-0 left-0 bg-teal-500/25 transition-all duration-500" style={{ width: `${pct}%` }} />}
                          <span className="relative flex items-center justify-between gap-3"><span>{o}</span>{myVote !== null && <span className="text-xs text-slate-300">%{pct}</span>}</span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-3 text-xs text-slate-500">{myVote === null ? "Oyunu ver, sonuçlar açılsın." : "Oyun kaydedildi. Sonuçlar şimdilik bu cihazda tutuluyor."}</p>
                </div>
                <div className="rounded-3xl border border-sky-300/15 bg-[#0a1a30]/90 p-4 backdrop-blur-xl">
                  <h3 className="font-display text-lg font-bold text-white">Sık sorulanlar</h3>
                  <div className="mt-2 divide-y divide-sky-300/15">
                    {QA.map((x, i) => (
                      <div key={x.q}>
                        <button onClick={() => setOpenQ(openQ === i ? -1 : i)} aria-expanded={openQ === i} className="flex w-full items-center justify-between gap-3 py-3 text-left text-sm font-medium text-slate-100">
                          {x.q}<ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition ${openQ === i ? "rotate-180" : ""}`} />
                        </button>
                        {openQ === i && <p className="pop pb-3 text-sm leading-relaxed text-slate-300">{x.a}</p>}
                      </div>
                    ))}
                  </div>
                  <a href={IG_DM} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-sky-300/15 py-3 text-sm text-slate-100 hover:bg-white/10"><MessageCircle className="h-4 w-4" /> Soru sor (Instagram DM)</a>
                </div>
              </div>
              <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-teal-500 to-sky-600 p-5 text-slate-950 active:scale-[0.99]">
                <span><span className="block font-display text-xl font-bold">Bizi takip et</span><span className="text-sm">Yeni notlar ve duyurular ilk orada.</span></span>
                <Send className="h-6 w-6 shrink-0" />
              </a>
            </section>
          )}

          {/* BİZ KİMİZ */}
          {page === "hakkimizda" && (
            <section className="mx-auto max-w-2xl">
              <SectionHead title="Biz kimiz?" desc="Bu siteyi neden kurduk? Videoda kısaca anlatıyoruz." />
              <VideoCard />
              <div className="mt-4 grid gap-3">
                {[
                  ["Yardımlaşma", "Dersler, sınavlar ve KPSS sürecinde birbirimize destek oluruz.", "border-teal-400/40"],
                  ["Not paylaşımı", "Ders notları ve KPSS kaynakları tek havuzda toplanır.", "border-sky-400/40"],
                  ["Doğru bilgi", "Diyaliz ve böbrek sağlığı hakkındaki yaygın yanlışları birlikte düzeltiriz.", "border-rose-400/40"],
                ].map(([t, d, b]) => (
                  <div key={t} className={`rounded-2xl border bg-[#0a1a30]/90 p-4 ${b}`}>
                    <h3 className="font-display text-base font-bold text-white">{t}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-300">{d}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => setFbOpen(true)} className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-teal-400/40 bg-teal-500/15 p-4 text-left active:scale-[0.99]">
                <MessageCircle className="h-6 w-6 shrink-0 text-teal-200" />
                <span><span className="block font-display text-base font-bold text-white">Geri bildirim gönder</span><span className="text-sm text-slate-300">Önerin, hatan ya da sorun varsa bize yaz.</span></span>
              </button>
            </section>
          )}
          {/* YÖNETİM */}
          {page === "yonetim" && (
            <section>
              <SectionHead title="Yönetim paneli" desc="Kullanıcıları ve not paylaşımlarını buradan yönet." />
              {!isAdmin ? (
                <div className="rounded-3xl border border-dashed border-sky-300/20 p-8 text-center text-sm text-slate-300">Bu sayfa sadece yöneticiler içindir.</div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    {[[users.length, "kullanıcı"], [dbNotes.filter((n) => n.status === "pending").length, "bekleyen not"], [dbNotes.filter((n) => n.status === "approved").length, "onaylı not"]].map(([n, l]) => (
                      <div key={l} className="rounded-2xl border border-sky-300/15 bg-[#0a1a30]/90 p-4"><div className="font-display text-2xl font-bold text-white">{n}</div><div className="text-xs text-slate-400">{l}</div></div>
                    ))}
                  </div>
                  <MaintenanceAdmin maint={maint} reload={loadMaint} setToast={setToast} />
                  <DuelAdmin setToast={setToast} />
                  <h3 className="mb-2 mt-6 font-display text-lg font-bold text-white">Duyurular</h3>
                  <div className="space-y-2 rounded-2xl border border-sky-300/15 bg-[#0a1a30]/90 p-3">
                    <input value={annTitle} onChange={(e) => setAnnTitle(e.target.value)} maxLength={120} placeholder="Duyuru başlığı" className={inp} />
                    <textarea value={annBody} onChange={(e) => setAnnBody(e.target.value)} maxLength={1000} rows={3} placeholder="Ayrıntı (isteğe bağlı)" className={`${inp} resize-none`} />
                    <button onClick={addAnn} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 px-4 py-3 text-sm font-semibold text-slate-950 active:scale-[0.98]"><Megaphone className="h-4 w-4" /> Yayınla</button>
                  </div>
                  <div className="mt-2 space-y-2">
                    {anns.map((a) => (
                      <div key={a.id} className="flex items-center gap-3 rounded-2xl border border-sky-300/15 bg-[#0a1a30]/90 p-3">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-white">{a.title}</p>
                          <p className="truncate text-xs text-slate-400">{new Date(a.created_at).toLocaleDateString("tr-TR")}{a.body ? ` · ${a.body}` : ""}</p>
                        </div>
                        <button onClick={() => deleteAnn(a.id)} aria-label="Duyuruyu sil" className="shrink-0 rounded-lg p-2 text-rose-300 hover:bg-rose-500/15"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    ))}
                  </div>
                  <h3 className="mb-2 mt-6 font-display text-lg font-bold text-white">Instagram gönderileri</h3>
                  <div className="flex gap-2">
                    <input value={igLink} onChange={(e) => setIgLink(e.target.value)} onPaste={(e) => { const t = e.clipboardData.getData("text"); if (parseIg(t)) { e.preventDefault(); addPost(t); } }} placeholder="Gönderi linkini yapıştır, otomatik eklenir" inputMode="url" className={inp} />
                    <button onClick={() => addPost()} className="shrink-0 rounded-xl bg-teal-500 px-4 text-sm font-semibold text-slate-950">Ekle</button>
                  </div>
                  <div className="mt-2 space-y-2">
                    {igPosts.map((p) => (
                      <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-sky-300/15 bg-[#0a1a30]/90 p-3">
                        <Insta className="h-4 w-4 shrink-0 text-rose-300" />
                        <a href={p.url} target="_blank" rel="noopener noreferrer" className="min-w-0 flex-1 truncate text-sm text-teal-300 underline">{p.kind === "reel" ? "Reels" : "Gönderi"} · {p.code}</a>
                        <button onClick={() => deletePost(p.id)} aria-label="Gönderiyi kaldır" className="shrink-0 rounded-lg p-2 text-rose-300 hover:bg-rose-500/15"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    ))}
                  </div>
                  <h3 className="mb-2 mt-6 font-display text-lg font-bold text-white">Notlar</h3>
                  {dbNotes.length === 0 && <p className="text-sm text-slate-400">Henüz paylaşılan not yok.</p>}
                  <div className="space-y-2">
                    {[...dbNotes].sort((a, b) => (a.status === "pending" ? 0 : 1) - (b.status === "pending" ? 0 : 1)).map((n) => (
                      <div key={n.id} className="flex items-center gap-3 rounded-2xl border border-sky-300/15 bg-[#0a1a30]/90 p-3">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-white">{n.title}</p>
                          <p className="truncate text-xs text-slate-400">{n.course} · {n.author_name || "Öğrenci"} · <a href={n.url} target="_blank" rel="noopener noreferrer" className="text-teal-300 underline">PDF'i aç</a></p>
                        </div>
                        {n.status === "pending"
                          ? <button onClick={() => approveNote(n.id)} className="shrink-0 rounded-lg bg-teal-500 px-3 py-2 text-xs font-semibold text-slate-950">Onayla</button>
                          : <span className="shrink-0 rounded-full bg-teal-500/20 px-2.5 py-1 text-xs text-teal-200">Yayında</span>}
                        <button onClick={() => deleteNote(n)} aria-label="Notu sil" className="shrink-0 rounded-lg p-2 text-rose-300 hover:bg-rose-500/15"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    ))}
                  </div>
                  <h3 className="mb-2 mt-6 font-display text-lg font-bold text-white">Kullanıcılar</h3>
                  <div className="space-y-2">
                    {users.map((u) => (
                      <div key={u.id} className="rounded-2xl border border-sky-300/15 bg-[#0a1a30]/90 p-3">
                        <div className="flex items-center gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-white">{u.full_name || "İsimsiz"}</p>
                            <p className="truncate text-xs text-slate-400">{u.email} · {new Date(u.created_at).toLocaleDateString("tr-TR")}</p>
                          </div>
                          {u.suspended && <span className="shrink-0 rounded-full bg-amber-500/25 px-2.5 py-1 text-xs text-amber-100">Askıda</span>}
                          {classOf(u.entry_year) > 0 && <span className="shrink-0 rounded-full bg-sky-500/20 px-2.5 py-1 text-xs text-sky-100">{classLabel(classOf(u.entry_year))}</span>}
                          <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs ${u.role === "admin" ? "bg-rose-500/25 text-rose-100" : "bg-white/10 text-slate-300"}`}>{u.role === "admin" ? "Yönetici" : "Öğrenci"}</span>
                        </div>
                        {u.id !== uid && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {"entry_year" in u && (
                              <select aria-label="Sınıf" value={classOf(u.entry_year) >= 3 ? "3" : String(classOf(u.entry_year) ?? "")} onChange={(e) => setUserClass(u, e.target.value)} className="rounded-lg border border-sky-300/15 bg-[#0a1a30] px-2 py-2 text-xs text-slate-200">
                                <option value="">Sınıf yok</option>
                                <option value="1">1. Sınıf</option>
                                <option value="2">2. Sınıf</option>
                                {classOf(u.entry_year) >= 3 && <option value="3" disabled>Mezun</option>}
                              </select>
                            )}
                            <button onClick={() => toggleRole(u)} className="rounded-lg border border-sky-300/15 px-3 py-2 text-xs text-slate-200 hover:bg-white/5">{u.role === "admin" ? "Öğrenci yap" : "Yönetici yap"}</button>
                            {u.role !== "admin" && <button onClick={() => toggleSuspend(u)} className="rounded-lg border border-amber-400/40 px-3 py-2 text-xs text-amber-100 hover:bg-amber-500/10">{u.suspended ? "Askıyı kaldır" : "Askıya al"}</button>}
                            {u.role !== "admin" && <button onClick={() => deleteUser(u)} className="flex items-center gap-1.5 rounded-lg border border-rose-400/40 px-3 py-2 text-xs text-rose-200 hover:bg-rose-500/10"><Trash2 className="h-3.5 w-3.5" /> Sil</button>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>
          )}
        </main>

        {/* ALT BİLGİ */}
        <footer className="border-t border-sky-300/15 bg-[#030813]/80 px-4 pb-28 pt-8 text-center md:pb-10">
          <Logo size="mx-auto h-12 w-12" />
          <p className="mt-2 font-display text-base font-bold text-white">AFSÜ Diyaliz Öğrenci İmzası</p>
          <p className="font-script text-sm text-slate-400">Sağlığın Üniversitesi</p>
          {stats && (
            <div className="mx-auto mt-5 max-w-xs">
              <div className="grid grid-cols-2 gap-3 text-left">
                {[[Users, "Kayıtlı üye", stats.users, "border-teal-400/40 from-teal-600/30 to-teal-950/60", "text-teal-200"], [Activity, "Bugünkü ziyaretçi", stats.today, "border-sky-400/40 from-sky-600/30 to-sky-950/60", "text-sky-200"]].map(([Icon, label, val, cls, ic]) => (
                  <div key={label} className={`rounded-2xl border bg-gradient-to-br p-3.5 ${cls}`}>
                    <Icon className={`h-5 w-5 ${ic}`} />
                    <div className="mt-2 font-display text-3xl font-extrabold leading-none text-white"><CountUp value={Number(val) || 0} /></div>
                    <div className="mt-1 text-xs text-slate-300">{label}</div>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[10px] leading-relaxed text-slate-500">Ziyaretçi sayısı IP adresine göre, günde bir kez sayılır.</p>
            </div>
          )}
          <div className="mt-5 flex items-center justify-center gap-3">
            <a href={IG_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram'da @afsudiyalizteam" className="grid h-12 w-12 place-items-center rounded-full border border-rose-400/40 bg-rose-500/15 text-rose-100 transition active:scale-95"><Insta className="h-6 w-6" /></a>
            {YT_URL && <a href={YT_URL} target="_blank" rel="noopener noreferrer" aria-label="YouTube kanalımız" className="grid h-12 w-12 place-items-center rounded-full border border-red-400/40 bg-red-500/15 text-red-100 transition active:scale-95"><YouTube className="h-6 w-6" /></a>}
          </div>
          <button onClick={() => setFbOpen(true)} className="mx-auto mt-4 flex items-center gap-2 rounded-full border border-sky-300/15 bg-[#0a1a30]/90 px-5 py-2.5 text-sm text-slate-100 hover:bg-white/10"><MessageCircle className="h-4 w-4" /> Geri bildirim gönder</button>
          <button onClick={() => setPrivOpen(true)} className="mx-auto mt-3 block text-xs text-slate-500 underline underline-offset-2 hover:text-slate-300">Gizlilik ve KVKK</button>
          <p className="mx-auto mt-3 max-w-sm text-xs leading-relaxed text-slate-500">Öğrencilerin yardımlaşması için hazırlanmış bir topluluk sayfasıdır. İçerikler bilgilendirme amaçlıdır, klinik karar yerine geçmez.</p>
        </footer>
      </div>

      {/* ALT MENÜ (telefon) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-sky-300/15 bg-[#040b17]/90 backdrop-blur-xl md:hidden" aria-label="Alt menü" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="mx-auto grid max-w-md grid-cols-5">
          {PAGES.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => go(id)} aria-current={page === id ? "page" : undefined} className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${page === id ? "text-teal-300" : "text-slate-400"}`}>
              <Icon className="h-5 w-5" />{label}
            </button>
          ))}
        </div>
      </nav>

      {authEl}
      <ClassPickModal open={classOpen || askClass} onClose={closeClass} onSaved={onClassSaved} current={classOf(profile?.entry_year)} />
      <WelcomeModal open={welcomeOpen && !authOpen && !!VIDEO_URL} onClose={() => setWelcomeOpen(false)} onGo={go} />
      {isAdmin && maint.on && (
        <button type="button" onClick={() => go("yonetim")} className="fixed inset-x-0 top-0 z-[70] bg-amber-500 px-3 py-1.5 text-center text-xs font-semibold text-black">Bakım modu AÇIK — kullanıcılar siteyi göremiyor. Kapatmak için dokun.</button>
      )}
      <ConfirmHost />
      <PodiumModal pod={pod} name={profile?.full_name || "Öğrenci"} onClose={closePod} />
      <PrivacyModal open={privOpen} onClose={() => setPrivOpen(false)} />
      <AnnouncementsModal open={annOpen} onClose={() => setAnnOpen(false)} items={anns} seenAt={annMark} />
      <FeedbackModal open={fbOpen} onClose={() => setFbOpen(false)} user={user} profile={profile} page={page} onDone={setToast} />
      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} onSubmit={addNote} moderated={!!sb} />
      {toast && (
        <div role="status" className="pop fixed inset-x-4 bottom-24 z-[60] mx-auto max-w-sm rounded-2xl border border-sky-300/15 bg-[#0b1a2e]/95 px-4 py-3 text-center text-sm text-slate-100 shadow-2xl backdrop-blur-xl md:bottom-6">{toast}</div>
      )}
    </div>
  );
}
