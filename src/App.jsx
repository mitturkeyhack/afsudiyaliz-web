import { useMemo, useState } from "react";
import {
  Activity,
  BookOpen,
  Calculator,
  Check,
  ChevronDown,
  ClipboardList,
  Droplets,
  GraduationCap,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  X,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Sabitler                                                           */
/* ------------------------------------------------------------------ */

const INSTAGRAM_URL = "https://instagram.com/afsudiyalizteam";
const UF_LIMIT = 12; // ml/kg/saat

const TABS = [
  { id: "uf", label: "UF Hesaplayıcı", icon: Calculator },
  { id: "alarm", label: "Makine Alarmları", icon: ShieldAlert },
  { id: "quiz", label: "Vaka Quiz", icon: Stethoscope },
  { id: "student", label: "Öğrenci Köşesi", icon: GraduationCap },
];

const ALARMS = [
  {
    id: "tmp",
    title: "Yüksek TMP (transmembran basınç)",
    level: "amber",
    short: "Diyalizör membranı tıkanıyor veya UF çok hızlı.",
    causes: [
      "Diyalizörde pıhtılaşma (lifler koyu renkli, çizgili)",
      "Aşırı yüksek UF hızı veya UF hedefi",
      "Yüksek hematokrit / yüksek kan akım hızı",
      "Yetersiz antikoagülasyon",
    ],
    steps: [
      "UF hedefini ve UF hızını kontrol et, gerekirse hekim onayıyla düşür.",
      "Diyalizör liflerini ve venöz damlalığı pıhtı açısından incele.",
      "Heparin protokolünü hekimle birlikte gözden geçir.",
      "Pıhtılaşma belirgin ise kurum protokolüne göre yıkama yap veya diyalizörü değiştir.",
    ],
  },
  {
    id: "venous",
    title: "Venöz basınç alarmı",
    level: "amber",
    short: "Yüksek: dönüş hattında direnç. Düşük: bağlantı kopması riski.",
    causes: [
      "Venöz hatta kıvrılma veya kapalı klemp",
      "Venöz damlalık filtresinde pıhtı",
      "Venöz iğne pozisyon bozukluğu veya infiltrasyon",
      "Fistülde venöz stenoz (tekrarlayan yüksek basınç)",
      "Düşük alarmda: iğne çıkması, hat bağlantısı gevşemesi",
    ],
    steps: [
      "Hattı hastadan makineye doğru takip et; kıvrılma ve klemp durumunu kontrol et.",
      "Venöz damlalığı pıhtı açısından incele.",
      "İğne bölgesinde şişlik, ağrı, hematom var mı bak; iğne pozisyonunu değerlendir.",
      "Düşük basınç alarmında önce kanama olup olmadığına bak; bağlantıları sıkıştır ve hekime bildir.",
    ],
  },
  {
    id: "arterial",
    title: "Arteriyel basınç alarmı (aşırı negatif)",
    level: "amber",
    short: "Kan pompaya yeterince gelmiyor.",
    causes: [
      "Arteriyel iğne duvara yapışmış veya yanlış pozisyonda",
      "Arteriyel hatta kıvrılma",
      "Kan akım hızı damar akımına göre yüksek",
      "Hastada hipotansiyon veya hipovolemi",
    ],
    steps: [
      "Hasta tansiyonunu ve genel durumunu kontrol et.",
      "Hattı ve iğne bölgesini incele; iğne pozisyonunu hafifçe değiştir.",
      "Kan akım hızını kademeli düşür.",
      "Sorun sürerse hekime bildir; iğne yenilenmesi gerekebilir.",
    ],
  },
  {
    id: "air",
    title: "Hava dedektörü alarmı",
    level: "rose",
    short: "Kritik: kan pompası durur, venöz klemp kapanır.",
    causes: [
      "Serum seti bitmesi veya hat bağlantısı gevşekliği",
      "Venöz damlalık seviyesinin düşmesi",
      "Hatta mikro köpük oluşumu",
      "Hat veya iğne bağlantısından hava girişi",
    ],
    steps: [
      "Hastayı hemen değerlendir: öksürük, nefes darlığı, göğüs ağrısı, bilinç değişikliği var mı?",
      "Hava hastaya ulaştıysa hekimi acil çağır; kurum acil protokolünü uygula (hasta sol yana yatırılır, baş aşağı pozisyon, oksijen).",
      "Hava kaynağını bul ve gider; damlalık seviyesini düzelt.",
      "Hat güvenli hale gelmeden klempi açıp pompayı yeniden başlatma.",
    ],
  },
  {
    id: "conductivity",
    title: "İletkenlik alarmı",
    level: "rose",
    short: "Diyalizat içeriği hatalı olabilir; makine bypass'a alır.",
    causes: [
      "A veya B konsantresi bitmiş ya da yanlış bağlanmış",
      "Konsantre emiş hattında hava veya tıkanıklık",
      "Su kalitesi veya karışım sistemi sorunu",
      "Makine kalibrasyon hatası",
    ],
    steps: [
      "Makinenin bypass'a aldığını doğrula; hastaya hatalı diyalizat gitmemeli.",
      "Konsantre türünü, miktarını ve emiş hortumlarını kontrol et.",
      "Sorun giderilmezse hekime ve teknik servise haber ver.",
      "Düzelmezse seansı sonlandırma kararı hekim ve kurum protokolüyle verilir.",
    ],
  },
  {
    id: "blood-leak",
    title: "Kan kaçağı dedektörü alarmı",
    level: "rose",
    short: "Diyalizat tarafına kan geçmiş olabilir.",
    causes: [
      "Diyalizör membranında yırtılma",
      "Dedektörde kirlenme veya hava kabarcığı (yanlış alarm)",
    ],
    steps: [
      "Diyalizat çıkışını gözle kontrol et; pembe veya kırmızı renk var mı bak.",
      "Hekime bildir; membran yırtığından şüpheleniliyorsa kan dolaşımını kurum protokolüne göre sonlandır.",
      "Diyalizörü ve gerekirse seti değiştirmek için hekim talimatını bekle.",
      "Hastayı enfeksiyon ve kanama belirtileri yönünden izle.",
    ],
  },
];

const QUIZ = [
  {
    q: "Seans sırasında hastanın tansiyonu belirgin düşüyor, terleme ve baş dönmesi başlıyor. İlk müdahale hangisidir?",
    options: [
      "UF'yi artırıp seansı hızlandırmak",
      "UF'yi durdurmak/azaltmak, hastayı Trendelenburg pozisyonuna almak ve hekim talimatıyla serum fizyolojik vermek",
      "Kan akımını maksimuma çıkarmak",
      "Hastaya oral yüksek miktarda su içirmek",
    ],
    answer: 1,
    why: "İntradiyalitik hipotansiyonda hedef dolaşım hacmini hızla desteklemektir: UF azaltılır veya durdurulur, ayaklar yükseltilir, hekim talimatıyla izotonik sıvı bolusu verilir.",
  },
  {
    q: "Venöz basınç alarmı sürekli çalıyor. Hangisi ilk bakılacak nedenlerden biri DEĞİLDİR?",
    options: [
      "Venöz hatta kıvrılma",
      "Venöz damlalıkta pıhtı",
      "Venöz iğne pozisyonu",
      "Dializat konsantresinin renk tonu",
    ],
    answer: 3,
    why: "Venöz basınç, kan dönüş hattındaki dirençle ilgilidir. Kıvrılma, pıhtı ve iğne pozisyonu önce kontrol edilir. Konsantre sorunları iletkenlik alarmıyla ilgilidir.",
  },
  {
    q: "Hava dedektörü alarmı verdiğinde makine ne yapar?",
    options: [
      "Kan pompasını durdurur ve venöz klempi kapatır",
      "UF hızını artırır",
      "Diyalizatı hastaya yönlendirir",
      "Hiçbir şey yapmaz, sadece ses çıkarır",
    ],
    answer: 0,
    why: "Hava hastaya ulaşmasın diye kan pompası durur ve venöz klemp kapanır. Hava kaynağı bulunmadan sistem yeniden başlatılmaz.",
  },
  {
    q: "Arteriyovenöz fistül ile ilgili hangisi doğrudur?",
    options: [
      "Fistül koluna tansiyon manşonu bağlanabilir",
      "Her seansta thrill (titreşim) ve ses kontrol edilmelidir",
      "Fistül koluyla ağır yük taşımak önerilir",
      "Fistül kolundan rutin kan alınması güvenlidir",
    ],
    answer: 1,
    why: "Thrill ve bruit fistül fonksiyonunun en basit göstergesidir. Fistül kolunda tansiyon ölçümü, kan alma ve sıkan giysi/yük taşımadan kaçınılır.",
  },
  {
    q: "Disequilibrium sendromu en çok hangi durumda görülür?",
    options: [
      "Kronik stabil hastada kısa seansta",
      "İlk seanslarda, çok yüksek üre düzeyi ve hızlı üre klirensi olan hastada",
      "Sadece çocuk hastalarda",
      "Yalnızca hipertansif hastalarda",
    ],
    answer: 1,
    why: "Üre beyinden kandan daha yavaş temizlenir; ozmotik fark beyin ödemine yol açar. Baş ağrısı, bulantı, konfüzyon görülür. İlk seanslarda kısa süre ve düşük kan akımı önlem olarak planlanır.",
  },
  {
    q: "Seans sırasında kramp başlayan hastada hangisi en olası katkıda bulunan faktördür?",
    options: [
      "Düşük UF hızı",
      "Hızlı sıvı çekimi ve kuru kilonun altına inme",
      "Yüksek dializat sıcaklığı",
      "Fazla uyku",
    ],
    answer: 1,
    why: "Hızlı UF ve gerçek kuru kilonun altına inmek kas perfüzyonunu bozarak krampı tetikler. Müdahalede UF azaltılır, hekim talimatıyla serum verilir.",
  },
  {
    q: "Kuru kilo (hedef kilo) nedir?",
    options: [
      "Hastanın ilk muayenedeki kilosu",
      "Diyaliz sonunda hipotansiyon ve aşırı sıvı belirtisi olmadan ulaşılabilen en düşük tolere edilen kilo",
      "Giriş kilosundan 5 kg çıkarılmış değer",
      "Her seansta sabit tutulan resmi kilo",
    ],
    answer: 1,
    why: "Kuru kilo klinik olarak belirlenir ve zamanla değişebilir. Ödem, tansiyon, akciğer bulguları ve seans toleransına göre hekimle birlikte güncellenir.",
  },
  {
    q: "İletkenlik alarmı sırasında hasta seansta. Öncelikli güvenlik önlemi nedir?",
    options: [
      "Alarmı susturup devam etmek",
      "Diyalizatın hastaya gitmediğinden (bypass) emin olup nedeni araştırmak",
      "Kan akımını düşürüp hiçbir şey yapmamak",
      "Seti hemen çıkarıp atmak",
    ],
    answer: 1,
    why: "Yanlış iletkenlikteki diyalizat hemoliz, hipo/hipernatremi gibi ciddi sonuçlar doğurabilir. Makine bypass'a alınır, konsantreler ve karışım sistemi kontrol edilir.",
  },
];

const LOG_TEMPLATE = [
  "Tarih / seans no / hasta kodu (isim yazma)",
  "Hasta durumu: giriş-çıkış kilosu, tansiyon, nabız, şikayet",
  "Makine ve diyalizör bilgisi: model, UF hedefi, kan akımı, süre",
  "Yapılan işlem: kanülasyon, bağlantı, izlem",
  "Karşılaşılan sorun ve yapılan müdahale",
  "Öğrendiklerim ve sorularım",
];

const COURSES = [
  {
    title: "Nefroloji temelleri",
    items: [
      "Böbrek fonksiyonları, GFR ve evrelendirme",
      "Üremi bulguları, hiperkalemi ve asidoz",
      "Kronik böbrek yetmezliğinde diyaliz endikasyonları",
    ],
  },
  {
    title: "Ekipman ve hemodiyaliz fiziği",
    items: [
      "Difüzyon, konveksiyon ve ultrafiltrasyon",
      "Diyalizör tipleri, set ve damlalık bileşenleri",
      "Su arıtma ve diyalizat hazırlama sistemi",
    ],
  },
  {
    title: "Vasküler giriş ve enfeksiyon kontrolü",
    items: [
      "AVF, greft ve kateter bakımı",
      "El hijyeni, aseptik kanülasyon, izolasyon önlemleri",
      "Hepatit B/C ve HIV bulaş önleme",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Küçük bileşenler                                                   */
/* ------------------------------------------------------------------ */

function InstagramIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

function Logo() {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="w-11 h-11 rounded-full bg-slate-900 border border-cyan-400/40 flex items-center justify-center shrink-0">
        <Stethoscope className="w-5 h-5 text-cyan-400" />
      </div>
    );
  }
  return (
    <img
      src="/logo.png"
      alt="AFSÜ Diyaliz Team logosu"
      onError={() => setFailed(true)}
      className="w-11 h-11 rounded-full object-cover border border-cyan-400/40 shrink-0"
    />
  );
}

function Field({ label, unit, value, onChange, step = "0.1", id }) {
  return (
    <label htmlFor={id} className="block">
      <span className="text-sm text-slate-300">{label}</span>
      <div className="mt-1.5 flex items-stretch rounded-xl bg-slate-950 border border-slate-700 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/30">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min="0"
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-h-[48px] bg-transparent px-3 text-lg text-slate-50 outline-none"
        />
        <span className="px-3 flex items-center text-sm text-slate-400 border-l border-slate-800">
          {unit}
        </span>
      </div>
    </label>
  );
}

/* ------------------------------------------------------------------ */
/*  Modül 1: UF Hesaplayıcı                                            */
/* ------------------------------------------------------------------ */

function UFCalculator() {
  const [entry, setEntry] = useState("72.5");
  const [dry, setDry] = useState("69");
  const [hours, setHours] = useState("4");
  const [extra, setExtra] = useState("300");

  const r = useMemo(() => {
    const e = parseFloat(entry);
    const d = parseFloat(dry);
    const h = parseFloat(hours);
    const x = parseFloat(extra) || 0;
    if (![e, d, h].every((n) => Number.isFinite(n)) || d <= 0 || h <= 0) {
      return { valid: false, msg: "Giriş kilosu, kuru kilo ve süreyi gir." };
    }
    const gain = (e - d) * 1000;
    const total = gain + x;
    if (total <= 0) {
      return {
        valid: false,
        msg: "Toplam çekilecek sıvı sıfır veya negatif. Kilo değerlerini ve ek sıvıyı kontrol et.",
      };
    }
    const perHour = total / h;
    const perKg = perHour / d;
    const idwg = ((e - d) / d) * 100;
    return { valid: true, gain, total, perHour, perKg, idwg };
  }, [entry, dry, hours, extra]);

  const high = r.valid && r.perKg > UF_LIMIT;

  return (
    <section className="space-y-5">
      <div className="rounded-2xl bg-slate-900/70 backdrop-blur border border-slate-800 p-4 sm:p-6">
        <h2 className="text-xl font-semibold text-slate-50">Ultrafiltrasyon hesaplayıcı</h2>
        <p className="mt-1 text-sm text-slate-400">
          Hedef UF hızı kuru kilo üzerinden ml/kg/saat olarak hesaplanır.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4">
          <Field id="entry" label="Giriş kilosu" unit="kg" value={entry} onChange={setEntry} />
          <Field id="dry" label="Kuru kilo" unit="kg" value={dry} onChange={setDry} />
          <Field id="hours" label="Seans süresi" unit="saat" value={hours} onChange={setHours} step="0.25" />
          <Field id="extra" label="Ek sıvı (çay, yıkama, ikram)" unit="ml" value={extra} onChange={setExtra} step="50" />
        </div>
      </div>

      {!r.valid ? (
        <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 text-sm text-slate-300">
          {r.msg}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-3 sm:p-4">
              <p className="text-xs text-slate-400">Toplam çekilecek</p>
              <p className="mt-1 text-xl sm:text-2xl font-semibold text-cyan-400">
                {Math.round(r.total)}
                <span className="text-xs sm:text-sm font-normal text-slate-400"> ml</span>
              </p>
            </div>
            <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-3 sm:p-4">
              <p className="text-xs text-slate-400">Saatlik UF hızı</p>
              <p className="mt-1 text-xl sm:text-2xl font-semibold text-sky-400">
                {Math.round(r.perHour)}
                <span className="text-xs sm:text-sm font-normal text-slate-400"> ml/sa</span>
              </p>
            </div>
            <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-3 sm:p-4">
              <p className="text-xs text-slate-400">Ağırlığa oran</p>
              <p className={`mt-1 text-xl sm:text-2xl font-semibold ${high ? "text-rose-400" : "text-emerald-400"}`}>
                {r.perKg.toFixed(1)}
                <span className="text-xs sm:text-sm font-normal text-slate-400"> ml/kg/sa</span>
              </p>
            </div>
          </div>

          {high ? (
            <div role="alert" className="rounded-2xl border border-rose-500/50 bg-rose-950/40 p-4 sm:p-5">
              <div className="flex items-center gap-2 text-rose-300 font-semibold">
                <ShieldAlert className="w-5 h-5" />
                Kardiyovasküler risk: {UF_LIMIT} ml/kg/saat eşiği aşıldı
              </div>
              <ul className="mt-3 space-y-1.5 text-sm text-rose-100/90 list-disc pl-5">
                <li>Intradiyalitik hipotansiyon riski artar.</li>
                <li>Kas krampları ve bulantı sık görülür.</li>
                <li>Tekrarlayan hipoperfüzyon miyokardiyal sersemlemeye (myocardial stunning) yol açabilir.</li>
              </ul>
              <p className="mt-3 text-sm text-rose-100/90">
                Hekimle konuş: seans süresini uzatmak, ek seans planlamak veya UF hedefini bölmek değerlendirilebilir.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-4 sm:p-5">
              <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                <ShieldCheck className="w-5 h-5" />
                UF hızı güvenli aralıkta
              </div>
              <p className="mt-2 text-sm text-emerald-100/90">
                Hız {UF_LIMIT} ml/kg/saat eşiğinin altında. Seans boyunca tansiyon ve belirtileri yine de izle.
              </p>
            </div>
          )}

          <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-4 text-sm text-slate-300 flex items-start gap-3">
            <Droplets className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <p>
              Seanslar arası kilo artışı <b className="text-slate-50">{Math.round(r.gain)} ml</b> (kuru kilonun %
              {r.idwg.toFixed(1)}'i).
              {r.idwg > 4 && " %4 üzeri kilo artışı için diyet ve sıvı kısıtlaması eğitimi gözden geçirilmelidir."}
            </p>
          </div>
        </>
      )}

      <p className="text-xs text-slate-500">
        Bu araç eğitim amaçlıdır. Hasta bazlı UF ve süre kararları hekim talimatı ve kurum protokolüne göre verilir.
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Modül 2: Makine Alarmları                                          */
/* ------------------------------------------------------------------ */

function AlarmGuide() {
  const [open, setOpen] = useState("air");

  const tone = {
    rose: { dot: "bg-rose-400", border: "border-rose-500/40", chip: "text-rose-300 bg-rose-500/10", label: "Kritik" },
    amber: { dot: "bg-amber-400", border: "border-amber-500/40", chip: "text-amber-300 bg-amber-500/10", label: "Dikkat" },
  };

  return (
    <section className="space-y-3">
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-slate-50">Makine alarmları ve hızlı müdahale</h2>
        <p className="mt-1 text-sm text-slate-400">
          Önce hastayı değerlendir, sonra makineyi. Alarmın nedenini bulmadan susturma.
        </p>
      </div>

      {ALARMS.map((a) => {
        const t = tone[a.level];
        const isOpen = open === a.id;
        return (
          <div key={a.id} className={`rounded-2xl bg-slate-900/70 backdrop-blur border ${isOpen ? t.border : "border-slate-800"}`}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : a.id)}
              aria-expanded={isOpen}
              className="w-full min-h-[56px] flex items-center gap-3 p-4 text-left"
            >
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${t.dot}`} />
              <span className="flex-1">
                <span className="block font-medium text-slate-50">{a.title}</span>
                <span className="block text-sm text-slate-400 mt-0.5">{a.short}</span>
              </span>
              <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${t.chip}`}>{t.label}</span>
              <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
              <div className="px-4 pb-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold text-cyan-400">Olası nedenler</h3>
                  <ul className="mt-2 space-y-1.5 text-sm text-slate-300 list-disc pl-5">
                    {a.causes.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-sky-400">Müdahale adımları</h3>
                  <ol className="mt-2 space-y-1.5 text-sm text-slate-300 list-decimal pl-5">
                    {a.steps.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <p className="text-xs text-slate-500 pt-1">
        Makine modeline göre alarm limitleri ve ekranlar değişir. Kullanım kılavuzu ve kurum protokolü esastır.
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Modül 3: Quiz                                                      */
/* ------------------------------------------------------------------ */

function Quiz() {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = QUIZ[index];
  const answered = picked !== null;

  const choose = (i) => {
    if (answered) return;
    setPicked(i);
    if (i === current.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (index + 1 >= QUIZ.length) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setPicked(null);
    }
  };

  const restart = () => {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / QUIZ.length) * 100);
    return (
      <section className="rounded-2xl bg-slate-900/70 backdrop-blur border border-slate-800 p-6 text-center">
        <Activity className="w-10 h-10 text-cyan-400 mx-auto" />
        <h2 className="mt-3 text-xl font-semibold text-slate-50">Quiz tamamlandı</h2>
        <p className="mt-2 text-4xl font-semibold text-cyan-400">
          {score}/{QUIZ.length}
        </p>
        <p className="mt-2 text-sm text-slate-300">
          {pct >= 80
            ? "Çok iyi. Klinik temelin sağlam."
            : pct >= 50
            ? "İyi gidiyorsun. Yanlış yaptığın konuları tekrar et."
            : "Alarmlar ve komplikasyonlar bölümlerini gözden geçirip tekrar dene."}
        </p>
        <button
          type="button"
          onClick={restart}
          className="mt-5 min-h-[48px] inline-flex items-center gap-2 rounded-xl bg-cyan-400 text-slate-950 font-medium px-5 hover:bg-cyan-300"
        >
          <RotateCcw className="w-4 h-4" />
          Yeniden başla
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between text-sm text-slate-400">
        <span>
          Soru {index + 1} / {QUIZ.length}
        </span>
        <span>Puan: {score}</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div className="h-full bg-cyan-400 transition-all" style={{ width: `${((index + (answered ? 1 : 0)) / QUIZ.length) * 100}%` }} />
      </div>

      <div className="rounded-2xl bg-slate-900/70 backdrop-blur border border-slate-800 p-4 sm:p-6">
        <h2 className="text-lg font-medium text-slate-50 leading-snug">{current.q}</h2>

        <div className="mt-4 space-y-2.5">
          {current.options.map((opt, i) => {
            const isCorrect = i === current.answer;
            const isPicked = i === picked;
            let cls = "border-slate-700 bg-slate-950 hover:border-cyan-400/60";
            if (answered && isCorrect) cls = "border-emerald-500/60 bg-emerald-950/40";
            else if (answered && isPicked) cls = "border-rose-500/60 bg-rose-950/40";
            else if (answered) cls = "border-slate-800 bg-slate-950 opacity-60";

            return (
              <button
                key={opt}
                type="button"
                onClick={() => choose(i)}
                disabled={answered}
                className={`w-full min-h-[52px] flex items-start gap-3 text-left rounded-xl border px-3.5 py-3 text-sm text-slate-100 transition-colors ${cls}`}
              >
                <span className="mt-0.5 shrink-0 w-5 h-5 flex items-center justify-center">
                  {answered && isCorrect ? (
                    <Check className="w-5 h-5 text-emerald-400" />
                  ) : answered && isPicked ? (
                    <X className="w-5 h-5 text-rose-400" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-slate-500" />
                  )}
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="mt-4 rounded-xl border border-sky-500/30 bg-sky-950/30 p-3.5">
            <p className={`text-sm font-semibold ${picked === current.answer ? "text-emerald-300" : "text-rose-300"}`}>
              {picked === current.answer ? "Doğru" : "Yanlış"}
            </p>
            <p className="mt-1 text-sm text-slate-200">{current.why}</p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={next}
        disabled={!answered}
        className="w-full min-h-[48px] rounded-xl bg-cyan-400 text-slate-950 font-medium disabled:bg-slate-800 disabled:text-slate-500 hover:bg-cyan-300 disabled:hover:bg-slate-800"
      >
        {index + 1 >= QUIZ.length ? "Sonucu gör" : "Sonraki soru"}
      </button>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Modül 4: Öğrenci Köşesi                                            */
/* ------------------------------------------------------------------ */

function StudentCorner() {
  const [sub, setSub] = useState("log");
  const subs = [
    { id: "log", label: "Staj defteri", icon: ClipboardList },
    { id: "notes", label: "Ders özetleri", icon: BookOpen },
    { id: "kpss", label: "KPSS Önlisans", icon: GraduationCap },
  ];

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-50">Stajyer ve öğrenci köşesi</h2>
        <p className="mt-1 text-sm text-slate-400">Staj, ders ve kariyer için kısa başvuru notları.</p>
      </div>

      <div className="grid grid-cols-3 gap-2" role="tablist">
        {subs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={sub === id}
            onClick={() => setSub(id)}
            className={`min-h-[56px] flex flex-col items-center justify-center gap-1 rounded-xl border text-xs sm:text-sm px-2 ${
              sub === id
                ? "border-cyan-400/60 bg-cyan-400/10 text-cyan-300"
                : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-600"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {sub === "log" && (
        <div className="rounded-2xl bg-slate-900/70 backdrop-blur border border-slate-800 p-4 sm:p-6 space-y-4">
          <h3 className="font-semibold text-slate-50">Her seans için günlük yapısı</h3>
          <ol className="space-y-2 text-sm text-slate-300 list-decimal pl-5">
            {LOG_TEMPLATE.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ol>
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 text-sm text-amber-100/90">
            Hasta adı, TC kimlik numarası ve telefon gibi kişisel verileri deftere yazma. Hasta kodu veya baş harfleri
            yeterlidir.
          </div>
          <p className="text-sm text-slate-400">
            İyi bir kayıt kısa, tarihli ve tekrar edilebilir olur: ne gördün, ne yaptın, bir sonraki seferde neyi farklı
            yaparsın.
          </p>
        </div>
      )}

      {sub === "notes" && (
        <div className="space-y-3">
          {COURSES.map((c) => (
            <div key={c.title} className="rounded-2xl bg-slate-900/70 backdrop-blur border border-slate-800 p-4">
              <h3 className="font-semibold text-cyan-400">{c.title}</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-slate-300 list-disc pl-5">
                {c.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {sub === "kpss" && (
        <div className="rounded-2xl bg-slate-900/70 backdrop-blur border border-slate-800 p-4 sm:p-6 space-y-4">
          <h3 className="font-semibold text-slate-50">KPSS Önlisans ve atama</h3>
          <p className="text-sm text-slate-300">
            Atama taban puanları her dönem kurum, kadro ve kontenjana göre değişir. Güncel puanlar için ÖSYM sonuçlarını
            ve ilgili kurumun (ör. Sağlık Bakanlığı) ilanlarını takip et.
          </p>
          <ul className="space-y-1.5 text-sm text-slate-300 list-disc pl-5">
            <li>Genel Yetenek ve Genel Kültür testlerine düzenli deneme çöz.</li>
            <li>Alan puanı ve tercih kılavuzundaki unvan koşullarını önceden kontrol et.</li>
            <li>Mezuniyet sonrası tercih döneminde kadro unvanının "Diyaliz Teknikeri" veya ilgili sağlık unvanıyla eşleştiğinden emin ol.</li>
            <li>DGS ile lisans tamamlama planlıyorsan başvuru ve sınav takvimini yıl başında not al.</li>
          </ul>
          <a
            href="https://www.osym.gov.tr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center rounded-xl border border-sky-400/50 px-4 text-sky-300 hover:bg-sky-400/10"
          >
            ÖSYM resmi sitesi
          </a>
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Ana uygulama                                                       */
/* ------------------------------------------------------------------ */

export default function App() {
  const [tab, setTab] = useState("uf");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Logo />
            <div className="min-w-0 leading-tight">
              <p className="font-semibold text-slate-50 truncate">@afsudiyalizteam</p>
              <p className="text-xs text-slate-400 truncate">AFSÜ Diyaliz Programı</p>
            </div>
          </div>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] inline-flex items-center gap-2 rounded-xl bg-cyan-400 text-slate-950 text-sm font-medium px-3.5 hover:bg-cyan-300 shrink-0"
          >
            <InstagramIcon className="w-4 h-4" />
            Takip et
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pb-16">
        {/* Hero */}
        <div className="pt-8 pb-5">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-50">
            Diyaliz salonunun cep rehberi
          </h1>
          <p className="mt-3 text-slate-400 max-w-xl">
            Afyonkarahisar Sağlık Bilimleri Üniversitesi diyaliz öğrencileri, stajyerleri ve teknikerleri için UF hesabı,
            alarm kılavuzu, vaka soruları ve staj notları.
          </p>
        </div>

        {/* Sekmeler */}
        <nav
          className="sticky top-16 z-20 -mx-4 px-4 py-2 bg-slate-950/80 backdrop-blur overflow-x-auto"
          aria-label="Modüller"
        >
          <div className="flex gap-2 w-max" role="tablist">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={`min-h-[44px] inline-flex items-center gap-2 rounded-full border px-4 text-sm whitespace-nowrap ${
                  tab === id
                    ? "border-cyan-400/60 bg-cyan-400/10 text-cyan-300"
                    : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-600"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </nav>

        <div className="mt-4">
          {tab === "uf" && <UFCalculator />}
          {tab === "alarm" && <AlarmGuide />}
          {tab === "quiz" && <Quiz />}
          {tab === "student" && <StudentCorner />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 px-4 text-center text-xs text-slate-500">
        <p>© 2026 AFSÜ Diyaliz Team. Tüm hakları saklıdır.</p>
        <p className="mt-1">Bu platform eğitim amaçlıdır; klinik kararların yerine geçmez.</p>
      </footer>
    </div>
  );
}
