import React, { useState } from "react";
import { Profile } from "../types";
import { Heart, Search, Users, Shield, MapPin, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface DatingGalleryProps {
  profiles: Profile[];
  onSelectProfile: (profile: Profile) => void;
}

export default function DatingGallery({ profiles, onSelectProfile }: DatingGalleryProps) {
  const [filterSex, setFilterSex] = useState<"all" | "female" | "male">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = profiles.filter((p) => {
    const matchesSex = filterSex === "all" || p.sex === filterSex;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSex && matchesSearch;
  });

  return (
    <div id="members-gallery" className="py-20 bg-stone-950 text-white relative overflow-hidden">
      {/* Decorative patterns mimicking traditional Ethiopian Tibeb borders */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-yellow-400 to-green-600 opacity-60"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium mb-4"
          >
            <Sparkles className="w-4 h-4" />
            <span>እውነተኛ የሀበሻ ፍቅር / Authentic Habesha Connection</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4"
          >
            የእኛ የተመዘገቡ አባላት <span className="text-rose-500">/ Registered Members</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-stone-400"
          >
            ክፍያ ፈጽመው ከተመዘገቡ በኋላ ከእነዚህ ቆንጆ እጩዎች እና ከአስተዋይ ወንዶች ጋር በጥንቃቄ የተቀረጸ፣ ደህንነቱ የተጠበቀ እና ሚስጥራዊ የፍቅር ግንኙነት ይጀምሩ።
          </motion.p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-12 bg-stone-900/60 p-4 rounded-2xl border border-stone-800/80 backdrop-blur">
          <div className="flex items-center gap-2 bg-stone-950 border border-stone-800 rounded-xl px-4 py-2 w-full md:max-w-md">
            <Search className="w-5 h-5 text-stone-500" />
            <input
              type="text"
              placeholder="ስም፣ የስራ ዘርፍ ወይም ከተማ ይፈልጉ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-white w-full text-sm placeholder-stone-500 focus:ring-0"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-stone-950 p-1.5 rounded-xl border border-stone-800 w-full md:w-auto overflow-x-auto justify-around">
            <button
              onClick={() => setFilterSex("all")}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                filterSex === "all"
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-600/20"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <Users className="w-4 h-4 inline mr-1.5" />
              ሁሉንም (All)
            </button>
            <button
              onClick={() => setFilterSex("female")}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                filterSex === "female"
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-600/20"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <Heart className="w-4 h-4 inline mr-1.5 text-rose-300" />
              ቆንጆ ሴቶች (Girls)
            </button>
            <button
              onClick={() => setFilterSex("male")}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                filterSex === "male"
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-600/20"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <Heart className="w-4 h-4 inline mr-1.5 text-blue-300" />
              ተግባቢ ወንዶች (Boys)
            </button>
          </div>
        </div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filtered.map((profile, idx) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              onClick={() => onSelectProfile(profile)}
              className="group cursor-pointer bg-stone-900 rounded-2xl overflow-hidden border border-stone-800/80 transition-all hover:border-rose-500/50 flex flex-col h-full shadow-xl relative"
            >
              {/* E2EE badge indicator for premium feel */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-950/80 backdrop-blur-md border border-green-500/30 text-green-400 text-[10px] font-semibold uppercase tracking-wider">
                <Shield className="w-3 h-3 text-green-500" />
                <span>E2EE Active</span>
              </div>

              {/* Profile Image with Blur overlay to excite interest */}
              <div className="relative aspect-square w-full overflow-hidden bg-stone-950">
                <img
                  src={profile.image}
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter group-hover:brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent opacity-80"></div>

                {/* Pulsing Match Circle */}
                <div className="absolute bottom-4 right-4 bg-rose-600/90 text-white p-2.5 rounded-full shadow-lg border border-rose-400/30">
                  <Heart className="w-4 h-4 fill-white animate-pulse" />
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-xl text-stone-100 group-hover:text-rose-400 transition-colors">
                    {profile.name}
                  </h3>
                  <span className="bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded text-xs font-semibold">
                    {profile.age} ዓመት
                  </span>
                </div>

                <p className="text-stone-400 text-xs font-medium mb-3 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                  {profile.profession}
                </p>

                <p className="text-stone-500 text-xs flex items-center gap-1 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-stone-600" />
                  {profile.location}
                </p>

                {/* Cultural bio teaser */}
                <div className="mt-auto bg-stone-950/50 p-3 rounded-xl border border-stone-800/40">
                  <p className="text-stone-300 text-xs italic line-clamp-2 leading-relaxed">
                    &ldquo;{profile.description}&rdquo;
                  </p>
                </div>

                {/* Action button */}
                <div className="mt-4 pt-3 border-t border-stone-800/50 flex justify-between items-center">
                  <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">
                    ለመገናኘት ይጫኑ
                  </span>
                  <span className="text-xs text-rose-400 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                    ተዋወቅ / Connect &rarr;
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-stone-500">ያልተገኘ እጩ የለም። እባክዎ ፍለጋዎን ይለውጡ።</p>
          </div>
        )}
      </div>
    </div>
  );
}
