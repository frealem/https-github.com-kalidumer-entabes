import React, { useState } from "react";
import { Profile, MembershipPackage } from "../types";
import { X, ShieldCheck, Heart, Sparkles, Upload, FileText, Smartphone, CheckCircle, ArrowRight, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface RegistrationModalProps {
  selectedProfile: Profile;
  onClose: () => void;
  onRegisterComplete: (registrationData: any) => void;
}

export default function RegistrationModal({ selectedProfile, onClose, onRegisterComplete }: RegistrationModalProps) {
  const [step, setStep] = useState<"details" | "packages">("details");

  // Onboarding Form States
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [sex, setSex] = useState<"male" | "female">(selectedProfile.sex === "female" ? "male" : "female");
  const [ageRange, setAgeRange] = useState("18-25");
  const [kindOfPartner, setKindOfPartner] = useState("");

  // Payment Form States
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptBase64, setReceiptBase64] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText("0966782412");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Dynamic packages based on sex
  const packages: MembershipPackage[] =
    sex === "male"
      ? [
          { id: "m_pkg1", name: "Date girl in 1 day (ፈጣን ውይይት)", price: 400, durationDays: 1, isMarriage: false, sex: "male" },
          { id: "m_pkg2", name: "Date girl in 3 days (መካከለኛ)", price: 300, durationDays: 3, isMarriage: false, sex: "male" },
          { id: "m_pkg3", name: "Date girl in 7 days (ረጋ ያለ)", price: 250, durationDays: 7, isMarriage: false, sex: "male" },
          { id: "m_pkg4", name: "For Marriage (ለዘላቂ ትዳር)", price: 5000, durationDays: 90, isMarriage: true, sex: "male" },
        ]
      : [
          { id: "f_pkg1", name: "Date boy in 1 day (ፈጣን ግንኙነት)", price: 200, durationDays: 1, isMarriage: false, sex: "female" },
          { id: "f_pkg2", name: "Date boy in 2 days (መካከለኛ)", price: 300, durationDays: 2, isMarriage: false, sex: "female" },
          { id: "f_pkg3", name: "Date boy in 3 days (የፍቅር አጋር)", price: 400, durationDays: 3, isMarriage: false, sex: "female" },
          { id: "f_pkg4", name: "Date boy for Marriage (ለትዳር)", price: 10000, durationDays: 180, isMarriage: true, sex: "female" },
        ];

  // Auto-set first package
  React.useEffect(() => {
    if (packages.length > 0 && !selectedPackageId) {
      setSelectedPackageId(packages[0].id);
    }
  }, [sex, selectedPackageId, packages]);

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !profession || !kindOfPartner) {
      setErrorMessage("እባክዎ ሁሉንም መስኮች በትክክል ይሙሉ / Please fill all required fields.");
      return;
    }
    setErrorMessage("");
    setStep("packages");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReceiptFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId && !receiptFile) {
      setErrorMessage("እባክዎ የትራንዛክሽን መለያ (Transaction ID) ያስገቡ ወይም የደረሰኝ ፎቶ (Screenshot) ይጫኑ። / Please enter Transaction ID or upload a receipt screenshot.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // First, register the profile
      const regResponse = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          profession,
          sex,
          ageRange,
          kindOfPartner,
          selectedPackageId,
        }),
      });

      const regData = await regResponse.json();
      if (!regResponse.ok || !regData.success) {
        throw new Error(regData.error || "ምዝገባው አልተሳካም። እባክዎ እንደገና ይሞክሩ።");
      }

      // Next, confirm the Telebirr payment
      const payResponse = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId,
          receiptName: receiptFile ? receiptFile.name : "receipt_image.png",
          receiptData: receiptBase64,
        }),
      });

      const payData = await payResponse.json();
      if (!payResponse.ok || !payData.success) {
        throw new Error(payData.error || "የክፍያ ማረጋገጫው አልተሳካም።");
      }

      // Success! Pass registration to App
      onRegisterComplete(payData.registration);
    } catch (err: any) {
      setErrorMessage(err.message || "ስህተት ተከስቷል። እባክዎ እንደገና ይሞክሩ።");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/95 flex items-center justify-center p-4 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-stone-900 border border-stone-800 text-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
      >
        {/* Top Header */}
        <div className="p-6 border-b border-stone-800 flex justify-between items-center bg-stone-900/80 sticky top-0 z-10 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20 text-rose-500">
              <Heart className="w-5 h-5 fill-rose-500 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold">ለመገናኘት ይመዝገቡ</h2>
              <p className="text-xs text-stone-400">ከ {selectedProfile.name} ጋር ለመገናኘት 2 ቀላል እርምጃዎች</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-800 transition-colors border border-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {errorMessage}
            </div>
          )}

          {step === "details" ? (
            /* STAGE 1: Dating Profile Particulars */
            <form onSubmit={handleDetailsSubmit} className="space-y-5">
              <div className="text-center py-4 bg-stone-950/40 border border-stone-800/60 rounded-2xl mb-2">
                <p className="text-sm text-rose-400 font-semibold mb-1">
                  አጋርዎ እንዲያገኝዎት የእርስዎን መረጃ ያስገቡ
                </p>
                <p className="text-xs text-stone-400">
                  እነዚህ መረጃዎች የእርስዎን ፍጹም አጋር ለመምረጥ ይረዳሉ።
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-stone-300">ሙሉ ስም / Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ስምዎን እዚህ ያስገቡ (ለምሳሌ፡ ሀብታሙ በቀለ)"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-stone-300">ጾታ / Gender</label>
                  <select
                    value={sex}
                    onChange={(e) => {
                      setSex(e.target.value as "male" | "female");
                      setSelectedPackageId(""); // reset package selection for gender
                    }}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500 transition-all"
                  >
                    <option value="male">ወንድ (Male)</option>
                    <option value="female">ሴት (Female)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-stone-300">የዕድሜ ክልል / Age Range</label>
                  <select
                    value={ageRange}
                    onChange={(e) => setAgeRange(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500 transition-all"
                  >
                    <option value="18-25">18 - 25 ዓመት</option>
                    <option value="26-30">26 - 30 ዓመት</option>
                    <option value="31-35">31 - 35 ዓመት</option>
                    <option value="36-45">36 - 45 ዓመት</option>
                    <option value="46+">46 ዓመት በላይ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-stone-300">የስራ ዘርፍ (ሙያ) / Profession</label>
                <input
                  type="text"
                  required
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  placeholder="የስራዎን አይነት ይግለጹ (ለምሳሌ፡ ባንክ ሰራተኛ፣ ነጋዴ...)"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-stone-300">የሚፈልጉት የፍቅር አጋር ሁኔታ / Partner Preference</label>
                <textarea
                  required
                  rows={3}
                  value={kindOfPartner}
                  onChange={(e) => setKindOfPartner(e.target.value)}
                  placeholder="እንደ ጨዋ፣ ደግ፣ ቆንጆ፣ ስራ ወዳድ እና ጨዋነትን የምታከብር... (አጭር መግለጫ)"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 transition-all placeholder-stone-500"
                />
                <p className="text-[11px] text-stone-500 mt-1 italic">
                  * ማሳሰቢያ፡ የሚፈልጉትን ባህሪ በአማርኛ መግለጽ እጩዎችን ይበልጥ ለማቅረብ ይረዳል።
                </p>
              </div>

              <div className="pt-4 border-t border-stone-800/50 flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-xs text-stone-400">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span>ሁሉም መረጃዎች በምስጠራ (E2EE) ይጠበቃሉ</span>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 font-bold text-sm transition-all shadow-lg shadow-rose-600/20 inline-flex items-center gap-1.5"
                >
                  ፓኬጅ ምረጥ / Choose Package
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            /* STAGE 2: Package selection & Payment details */
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <div className="text-center py-4 bg-rose-600/5 border border-rose-500/20 rounded-2xl">
                <Sparkles className="w-6 h-6 text-rose-500 mx-auto mb-1 animate-pulse" />
                <h4 className="text-sm font-bold text-rose-400">🎉 አሁን ቆንጆ ሴት ወይም ቆንጆ ወንድ እያዘጋጀንልዎ ነው!</h4>
                <p className="text-xs text-stone-400 mt-1">
                  ከእጩ ጋር ለመገናኘት እና ከአማካሪዋ ዶ/ር አልማዝ ጋር ውይይት ለመጀመር እባክዎ ተገቢውን ፓኬጅ ይምረጡ።
                </p>
              </div>

              {/* Package Cards List */}
              <div>
                <label className="block text-sm font-bold mb-3 text-stone-300">አባልነት ፓኬጆች / Available Packages ({sex === "male" ? "ለወንዶች" : "ለሴቶች"})</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {packages.map((pkg) => {
                    const isSelected = selectedPackageId === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                          isSelected
                            ? "bg-rose-600/10 border-rose-500 shadow-lg shadow-rose-600/10"
                            : "bg-stone-950 border-stone-800/80 hover:border-stone-700"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${isSelected ? "bg-rose-500 text-white" : "bg-stone-800 text-stone-300"}`}>
                            {pkg.isMarriage ? "ለዘላቂ ትዳር" : "የፍቅር ዴቲንግ"}
                          </span>
                          <span className="text-rose-400 font-extrabold text-lg">{pkg.price} Birr</span>
                        </div>
                        <h5 className="font-bold text-stone-100 mb-1">{pkg.name}</h5>
                        <p className="text-[11px] text-stone-500 leading-tight">
                          {pkg.isMarriage
                            ? "የፍቅር አማካሪው በቀጥታ ለትዳር ዝግጁ የሆኑ እጮችን ይመድባል እና ያገናኛል።"
                            : `${pkg.durationDays} ቀን የፍቅር እና የውይይት አጋር ለማግኘት።`}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Telebirr Instructions */}
              <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800/80 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-xl">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-stone-100">ቴሌብር ክፍያ መመሪያ / Telebirr Payment</h4>
                    <p className="text-xs text-stone-400 mt-1.5 leading-relaxed flex items-center gap-2 flex-wrap">
                      <span>እባክዎ ክፍያውን በቴሌብር (Telebirr) ቁጥር</span>
                      <span className="font-bold text-white bg-blue-600/20 px-1.5 py-0.5 rounded border border-blue-500/25">0966782412</span>
                      <button
                        type="button"
                        onClick={handleCopyNumber}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-800 border border-stone-700 hover:bg-stone-700 hover:border-stone-600 text-stone-200 text-[11px] transition-all font-medium active:scale-95 cursor-pointer shadow-sm"
                        title="Copy Number"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-green-400" />
                            <span className="text-green-400 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-blue-400" />
                            <span>Copy Number</span>
                          </>
                        )}
                      </button>
                      <span>ይላኩ።</span>
                    </p>
                    <p className="text-xs text-stone-400 mt-2">
                      የመቀበያ ስም (Recipient Name)፡ <span className="font-bold text-white uppercase bg-blue-600/20 px-1.5 py-0.5 rounded border border-blue-500/25">TEKALIGH</span> መሆኑን ያረጋግጡ።
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-800/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-2 text-stone-400">የክፍያ መለያ ቁጥር / Unique Transaction ID</label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="ለምሳሌ፡ TXN-9483726"
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-rose-500 placeholder-stone-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-2 text-stone-400">ደረሰኝ ይጫኑ (Screenshot / PDF Receipt)</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id="receipt-upload"
                      />
                      <label
                        htmlFor="receipt-upload"
                        className="w-full flex items-center justify-center gap-2 cursor-pointer bg-stone-900 border border-dashed border-stone-800 rounded-xl px-3 py-2.5 text-xs text-stone-400 hover:border-rose-500 hover:text-white transition-all text-center"
                      >
                        {receiptFile ? (
                          <>
                            <FileText className="w-4 h-4 text-green-500" />
                            <span className="truncate max-w-[120px] text-green-400 font-medium">
                              {receiptFile.name}
                            </span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            <span>ደረሰኝ አስገባ</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back / Next actions */}
              <div className="pt-4 border-t border-stone-800/50 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="px-5 py-2.5 rounded-xl border border-stone-800 hover:bg-stone-800 text-xs font-medium transition-all"
                >
                  &larr; ተመለስ / Back
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-sm transition-all shadow-lg shadow-rose-600/20 inline-flex items-center gap-2 disabled:opacity-55"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ክፍያ እየተረጋገጠ ነው...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      ክፍያ ፈጽሜያለሁ / Confirm Payment
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
