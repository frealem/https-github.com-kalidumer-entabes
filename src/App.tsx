import React, { useState, useEffect } from "react";
import DatingGallery from "./components/DatingGallery";
import RegistrationModal from "./components/RegistrationModal";
import ChatHub from "./components/ChatHub";
import { Profile, UserRegistration } from "./types";
import {
  Heart,
  Shield,
  MessageSquare,
  Sparkles,
  Smartphone,
  CheckCircle,
  HelpCircle,
  Clock,
  ChevronDown,
  Lock,
  Compass,
  Copy,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [registration, setRegistration] = useState<UserRegistration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText("0966782412");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Load profiles and registration status on mount
  const loadInitialData = async () => {
    try {
      // Load user status
      const statusRes = await fetch("/api/user-status");
      const statusData = await statusRes.json();
      if (statusData.success && statusData.registration) {
        setRegistration(statusData.registration);
      }

      // Load dating profiles
      const profilesRes = await fetch("/api/profiles");
      const profilesData = await profilesRes.json();
      if (profilesData.success && profilesData.profiles) {
        setProfiles(profilesData.profiles);
      }
    } catch (err) {
      console.error("Error loading initial data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleScrollToGallery = () => {
    const element = document.getElementById("members-gallery");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleRegisterComplete = (regData: UserRegistration) => {
    setRegistration(regData);
    setSelectedProfile(null);
  };

  const handleReset = async () => {
    if (confirm("Are you sure you want to reset your registration and payment status for this test?")) {
      try {
        await fetch("/api/reset", { method: "POST" });
        setRegistration(null);
        setSelectedProfile(null);
        loadInitialData();
      } catch (err) {
        console.error("Error resetting app:", err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-rose-600/30 border-t-rose-500 rounded-full animate-spin mb-4"></div>
        <p className="text-sm text-stone-400 animate-pulse">የሐበሻ ፍቅር መተግበሪያ እየጫነ ነው... Loading...</p>
      </div>
    );
  }

  // If user is registered and payment is verified, directly present the ChatHub!
  if (registration && registration.isVerified) {
    return <ChatHub registration={registration} onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen bg-stone-950 text-white font-sans selection:bg-rose-600 selection:text-white">
      {/* 1. Header / Navbar */}
      <header className="fixed top-0 left-0 w-full z-40 bg-stone-950/80 backdrop-blur border-b border-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-rose-600 p-1.5 rounded-lg shadow-lg shadow-rose-600/35">
              <Heart className="w-5 h-5 fill-white text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-stone-200 to-rose-400 bg-clip-text text-transparent">
              እንጣበስ <span className="text-rose-500">/ Entabes</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-stone-400 font-semibold items-center gap-1.5 hidden sm:flex bg-stone-900 border border-stone-800 px-3 py-1 rounded-full">
              <Shield className="w-3.5 h-3.5 text-green-500" />
              100% Secure (E2EE)
            </span>
            <button
              onClick={handleScrollToGallery}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/20 transition-all"
            >
              አጋር ፈልግ / Find Match
            </button>
          </div>
        </div>
      </header>

      {/* 2. Stunning Hero Section */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-16 bg-radial from-stone-900 via-stone-950 to-stone-950">
        {/* Abstract traditional background pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>ሀገራዊ እና ባህላዊ የፍቅር ትስስር / Matchmaking For Ethiopians</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight"
          >
            ለአኗኗርዎ የሚስማማውን <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-rose-500 via-amber-400 to-rose-400 bg-clip-text text-transparent">
              እውነተኛ የሐበሻ አጋርዎን
            </span>{" "}
            ያግኙ!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-6 text-base sm:text-xl text-stone-400 max-w-3xl leading-relaxed"
          >
            የተከበሩና ጨዋ የሆኑ የኢትዮጵያ ወንዶች እና ቆንጆ ሴቶች የሚገናኙበት ብቸኛው ታማኝ መድረክ። ሙሉ በሙሉ በምስጠራ (End-To-End Encryption) የተቆለፈ ውይይት፣ የድምፅ መልእክት፣ እና የፍቅር ስነ-ልቦና ባለሙያ አማካሪ ድጋፍ።
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto"
          >
            <button
              onClick={handleScrollToGallery}
              className="px-8 py-4 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-base rounded-2xl shadow-xl shadow-rose-600/25 transition-all w-full sm:w-auto hover:scale-[1.02]"
            >
              አጋርዎን ይፈልጉ / Find Your Partner
            </button>
            <a
              href="#why-us"
              className="px-8 py-4 bg-stone-900 hover:bg-stone-850 text-stone-300 font-bold text-base rounded-2xl border border-stone-800 transition-all w-full sm:w-auto text-center"
            >
              ተጨማሪ መረጃ / Learn More
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 text-xs text-stone-500 font-medium flex items-center gap-4 flex-wrap justify-center border-t border-stone-900/60 pt-6 w-full max-w-lg"
          >
            <span>🔒 AES-256 GCM encrypted</span>
            <span>📱 Telebirr Integration</span>
            <span>💬 Voice & Emoji active</span>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mt-12 cursor-pointer text-stone-500 hover:text-rose-400 transition-colors"
            onClick={handleScrollToGallery}
          >
            <ChevronDown className="w-8 h-8" />
          </motion.div>
        </div>
      </section>

      {/* 3. Core Trust & Security Features */}
      <section id="why-us" className="py-20 bg-stone-900/40 border-t border-b border-stone-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-stone-100 sm:text-4xl">
              ደህንነቱ የተጠበቀ ዘመናዊ መተግበሪያ
            </h2>
            <p className="mt-4 text-stone-400">
              ለግላዊነትዎ እና ለአስተማማኝ ግንኙነት ቅድሚያ እንሰጣለን።
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1: E2EE Privacy */}
            <div className="bg-stone-900 p-8 rounded-2xl border border-stone-800/80 hover:border-stone-700/80 transition-all flex flex-col items-center text-center">
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl mb-6">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-stone-100 mb-3">
                የምስጠራ ግላዊነት (End-to-End Encryption)
              </h3>
              <p className="text-sm text-stone-400 leading-relaxed">
                የእርስዎ ፅሁፎች እና የድምፅ መልእክቶች በሁለታችሁ ስልኮች መካከል ብቻ እንዲነበቡ ሆነው በኢንክሪፕሽን ቁልፍ ይጠበቃሉ። እኛም ሆንን ማንም ሶስተኛ ወገን ማየት አይችልም።
              </p>
            </div>

            {/* Feature 2: Simulated voice message */}
            <div className="bg-stone-900 p-8 rounded-2xl border border-stone-800/80 hover:border-stone-700/80 transition-all flex flex-col items-center text-center">
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-xl mb-6">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-stone-100 mb-3">
                የድምፅ መልእክት እና ገላጭ ገጾች (Emojis)
              </h3>
              <p className="text-sm text-stone-400 leading-relaxed">
                የበለጠ ለመቀራረብ በድምፅ መልእክቶች ያውሩ። እንዲሁም ውይይትዎን ህያው ለማድረግ የተለያዩ ገላጭ ምስሎችን (Emojis) በመጠቀም ስሜትዎን ይግለጹ።
              </p>
            </div>

            {/* Feature 3: Expert guidance */}
            <div className="bg-stone-900 p-8 rounded-2xl border border-stone-800/80 hover:border-stone-700/80 transition-all flex flex-col items-center text-center">
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-xl mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-stone-100 mb-3">
                የፍቅር ስነ-ልቦና አማካሪ (Matchmaker)
              </h3>
              <p className="text-sm text-stone-400 leading-relaxed">
                የተረጋገጠ የስነ-ልቦና ባለሙያ አማካሪያችን ዶ/ር አልማዝ (Dr. Almaz) በሳይንሳዊ እና በባህላዊ የፍቅር ስነ-ስርዓት በመደገፍ ምርጥ አጋር እንዲመርጡ እና በትክክለኛው አቀራረብ እንዲያወሩ ትመክሮታለች።
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Profiles Gallery */}
      <DatingGallery
        profiles={profiles}
        onSelectProfile={(profile) => setSelectedProfile(profile)}
      />

      {/* 5. Stat Banner */}
      <section className="py-16 bg-stone-950 border-t border-stone-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-rose-500">8,400+</p>
              <p className="text-xs sm:text-sm text-stone-400 mt-1">የተመዘገቡ አባላት</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-amber-500">1,200+</p>
              <p className="text-xs sm:text-sm text-stone-400 mt-1">ትዳር የመሰረቱ</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-green-500">100%</p>
              <p className="text-xs sm:text-sm text-stone-400 mt-1">የደህንነት ምስጠራ (E2EE)</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-2">
                <p className="text-2xl sm:text-3xl font-extrabold text-blue-500">0966782412</p>
                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 hover:bg-stone-800 hover:border-stone-700 text-stone-300 transition-all active:scale-95 cursor-pointer"
                  title="Copy Number"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-blue-400" />}
                </button>
              </div>
              <p className="text-xs sm:text-sm text-stone-400 mt-1">የቴሌብር ቁጥር (TEKALIGH)</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="py-8 bg-stone-950 border-t border-stone-900 text-stone-500 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="mb-2">&copy; 2026 እንጣበስ (Entabes Dating). መብቱ በህግ የተጠበቀ ነው።</p>
          <p>Designed with deep cultural care & secure cryptographic systems. Payment Admin: TEKALIGH.</p>
        </div>
      </footer>

      {/* Registration & Payment onboarding modal wrapper */}
      <AnimatePresence>
        {selectedProfile && (
          <RegistrationModal
            selectedProfile={selectedProfile}
            onClose={() => setSelectedProfile(null)}
            onRegisterComplete={handleRegisterComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
