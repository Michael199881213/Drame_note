/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  Tv, 
  Plus, 
  Minus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Sparkles, 
  Clock, 
  ArrowUpDown, 
  Bookmark, 
  CheckCircle,
  HelpCircle,
  TrendingUp,
  RotateCcw
} from "lucide-react";
import { Drama } from "./types";

// Seed data to make the app look immediately lively if storage is empty
const INITIAL_SEED_DATA: Drama[] = [
  {
    id: "seed-1",
    title: "葬送的芙莉蓮",
    totalEpisodes: 28,
    currentEpisode: 14,
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    note: "超級神作！淚腺崩壞，勇者辛美爾太溫柔了 🌸"
  },
  {
    id: "seed-2",
    title: "鬼滅之刃 柱訓練篇",
    totalEpisodes: 8,
    currentEpisode: 8,
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    note: "無限城決戰前哨戰！特效拉滿 ⚡"
  },
  {
    id: "seed-3",
    title: "間諜家家酒 (SPY x FAMILY) S2",
    totalEpisodes: 12,
    currentEpisode: 5,
    updatedAt: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
    note: "安妮亞喜歡花生！哇庫哇庫 🥜"
  }
];

// Selector for dynamic vibrant Lego block styling (Red, Yellow, Blue, Purple etc.)
const getVibrantTheme = (id: string, isCompleted: boolean) => {
  if (isCompleted) {
    return {
      cardBg: "bg-emerald-400",
      cardBorder: "border-[3px] border-black shadow-[6px_6px_0px_0px_#000000]",
      badgeBg: "bg-black text-emerald-300",
      badgeText: "已完結 BRICK",
      progressBarBg: "bg-emerald-950/20",
      progressBarFill: "bg-white border-2 border-black",
      btnMinusBg: "bg-emerald-600 hover:bg-emerald-700 text-black",
      btnPlusBg: "bg-black text-white hover:bg-neutral-900 border-none",
      studColor: "bg-emerald-500",
      studBorderColor: "border-black",
      textColor: "text-black font-semibold",
      titleColor: "text-black",
      metaColor: "text-black/80"
    };
  }
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const options = [
    {
      cardBg: "bg-red-500",
      cardBorder: "border-[3px] border-black shadow-[6px_6px_0px_0px_#000000]",
      badgeBg: "bg-black text-red-200",
      badgeText: "熱血新番",
      progressBarBg: "bg-red-950/20",
      progressBarFill: "bg-white border-2 border-black",
      btnMinusBg: "bg-red-700 hover:bg-red-800 text-white",
      btnPlusBg: "bg-black text-white hover:bg-neutral-900 border-none",
      studColor: "bg-red-600",
      studBorderColor: "border-black",
      textColor: "text-white",
      titleColor: "text-white",
      metaColor: "text-white/80"
    },
    {
      cardBg: "bg-amber-400",
      cardBorder: "border-[3px] border-black shadow-[6px_6px_0px_0px_#000000]",
      badgeBg: "bg-black text-amber-200",
      badgeText: "經典影劇",
      progressBarBg: "bg-amber-950/20",
      progressBarFill: "bg-black border-2 border-black",
      btnMinusBg: "bg-amber-600 hover:bg-amber-700 text-black",
      btnPlusBg: "bg-black text-white hover:bg-neutral-900 border-none",
      studColor: "bg-amber-500",
      studBorderColor: "border-black",
      textColor: "text-black",
      titleColor: "text-black",
      metaColor: "text-black/80"
    },
    {
      cardBg: "bg-sky-400",
      cardBorder: "border-[3px] border-black shadow-[6px_6px_0px_0px_#000000]",
      badgeBg: "bg-black text-sky-200",
      badgeText: "悠閒日常",
      progressBarBg: "bg-sky-950/20",
      progressBarFill: "bg-white border-2 border-black",
      btnMinusBg: "bg-sky-600 hover:bg-sky-700 text-black",
      btnPlusBg: "bg-black text-white hover:bg-neutral-900 border-none",
      studColor: "bg-sky-500",
      studBorderColor: "border-black",
      textColor: "text-black",
      titleColor: "text-black",
      metaColor: "text-black/80"
    },
    {
      cardBg: "bg-purple-500",
      cardBorder: "border-[3px] border-black shadow-[6px_6px_0px_0px_#000000]",
      badgeBg: "bg-black text-purple-200",
      badgeText: "奇幻冒險",
      progressBarBg: "bg-purple-950/20",
      progressBarFill: "bg-white border-2 border-black",
      btnMinusBg: "bg-purple-700 hover:bg-purple-800 text-white",
      btnPlusBg: "bg-black text-white hover:bg-neutral-900 border-none",
      studColor: "bg-purple-600",
      studBorderColor: "border-black",
      textColor: "text-white",
      titleColor: "text-white",
      metaColor: "text-white/80"
    }
  ];
  return options[hash % options.length];
};

export default function App() {
  // Load initial tracker items
  const [dramas, setDramas] = useState<Drama[]>(() => {
    const saved = localStorage.getItem("my-drama-tracker");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed parsing dramas from localStorage", e);
      }
    }
    return INITIAL_SEED_DATA;
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("my-drama-tracker", JSON.stringify(dramas));
  }, [dramas]);

  // Form states
  const [title, setTitle] = useState("");
  const [totalEpisodes, setTotalEpisodes] = useState<number | "">("");
  const [note, setNote] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // UI state filters
  const [statusFilter, setStatusFilter] = useState<"all" | "ongoing" | "completed">("all");
  const [sortBy, setSortBy] = useState<"updatedAt" | "title" | "progress">("updatedAt");
  const [searchQuery, setSearchQuery] = useState("");

  // Card Editing modes
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTotal, setEditTotal] = useState<number>(1);
  const [editNote, setEditNote] = useState("");

  // Stats
  const totalDramasCount = dramas.length;
  const completedCount = dramas.filter(d => d.currentEpisode === d.totalEpisodes).length;
  const ongoingCount = totalDramasCount - completedCount;

  // Add a new drama
  const handleAddDrama = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg("請輸入劇名或動漫名！");
      return;
    }
    
    const episodes = Number(totalEpisodes);
    if (!totalEpisodes || isNaN(episodes) || episodes <= 0) {
      setErrorMsg("總集數必須是高於 0 的有效數字！");
      return;
    }

    const newDrama: Drama = {
      id: "drama-" + Date.now(),
      title: title.trim(),
      totalEpisodes: episodes,
      currentEpisode: 0,
      updatedAt: new Date().toISOString(),
      note: note.trim() || undefined
    };

    setDramas(prev => [newDrama, ...prev]);
    setTitle("");
    setTotalEpisodes("");
    setNote("");
    setErrorMsg("");
  };

  // Quick preset buttons for total episodes helper
  const applyPresetEpisodes = (num: number) => {
    setTotalEpisodes(num);
  };

  // Increment current episode
  const incrementProgress = (id: string) => {
    setDramas(prev => 
      prev.map(drama => {
        if (drama.id === id) {
          const next = Math.min(drama.currentEpisode + 1, drama.totalEpisodes);
          return {
            ...drama,
            currentEpisode: next,
            updatedAt: new Date().toISOString()
          };
        }
        return drama;
      })
    );
  };

  // Decrement current episode
  const decrementProgress = (id: string) => {
    setDramas(prev => 
      prev.map(drama => {
        if (drama.id === id) {
          const next = Math.max(drama.currentEpisode - 1, 0);
          return {
            ...drama,
            currentEpisode: next,
            updatedAt: new Date().toISOString()
          };
        }
        return drama;
      })
    );
  };

  // Quick reset or complete
  const resetProgress = (id: string) => {
    setDramas(prev =>
      prev.map(drama => {
        if (drama.id === id) {
          return {
            ...drama,
            currentEpisode: 0,
            updatedAt: new Date().toISOString()
          };
        }
        return drama;
      })
    );
  };

  const completeProgress = (id: string) => {
    setDramas(prev =>
      prev.map(drama => {
        if (drama.id === id) {
          return {
            ...drama,
            currentEpisode: drama.totalEpisodes,
            updatedAt: new Date().toISOString()
          };
        }
        return drama;
      })
    );
  };

  // Edit fields triggered
  const startEditing = (drama: Drama) => {
    setEditingId(drama.id);
    setEditTitle(drama.title);
    setEditTotal(drama.totalEpisodes);
    setEditNote(drama.note || "");
  };

  // Save edit changes
  const saveEditing = (id: string) => {
    if (!editTitle.trim()) return;
    if (editTotal <= 0) return;

    setDramas(prev => 
      prev.map(drama => {
        if (drama.id === id) {
          const current = Math.min(drama.currentEpisode, editTotal);
          return {
            ...drama,
            title: editTitle.trim(),
            totalEpisodes: editTotal,
            currentEpisode: current,
            note: editNote.trim() || undefined,
            updatedAt: new Date().toISOString()
          };
        }
        return drama;
      })
    );
    setEditingId(null);
  };

  // Delete card
  const deleteDrama = (id: string) => {
    setDramas(prev => prev.filter(drama => drama.id !== id));
  };

  // Seed baseline reset
  const resetToSeed = () => {
    if (window.confirm("確定要重設為預設範例資料嗎？（這將會覆蓋您目前的追劇紀錄）")) {
      setDramas(INITIAL_SEED_DATA);
    }
  };

  // Filter and sort items
  const filteredAndSortedDramas = dramas
    .filter(drama => {
      const isCompleted = drama.currentEpisode === drama.totalEpisodes;
      if (statusFilter === "completed" && !isCompleted) return false;
      if (statusFilter === "ongoing" && isCompleted) return false;

      if (searchQuery.trim()) {
        const text = searchQuery.toLowerCase();
        const titleMatch = drama.title.toLowerCase().includes(text);
        const noteMatch = drama.note?.toLowerCase().includes(text) || false;
        return titleMatch || noteMatch;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "updatedAt") {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title, "zh-Hant");
      }
      if (sortBy === "progress") {
        const progressA = a.currentEpisode / a.totalEpisodes;
        const progressB = b.currentEpisode / b.totalEpisodes;
        return progressB - progressA;
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-[#F0F3F8] lego-studs-pattern text-slate-900 antialiased selection:bg-yellow-300 selection:text-black pb-16">
      
      {/* Upper playful header pattern */}
      <div className="bg-amber-400 border-b-[4px] border-black py-3 px-4 flex justify-between items-center text-xs font-bold shadow-[0_4px_0_rgba(0,0,0,0.15)]">
        <div className="flex items-center gap-2 text-black">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
          <span>LEGO-STYLE BRICKS SYSTEM ACTIVE 🎮</span>
        </div>
        <div className="text-black/80 font-mono text-[10px]">
          BUILD OR TRACK • MAY 2026
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative">
        
        {/* Playful block header */}
        <header className="flex flex-col md:flex-row items-center justify-between pb-8 mb-8 gap-6 border-b-4 border-dashed border-slate-300">
          
          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* Lego Brick spelling style logo "B I N G E" */}
            <div className="flex gap-1.5" id="logo-brick-spelling">
              {[
                { char: "B", bg: "bg-red-500 text-white" },
                { char: "I", bg: "bg-blue-500 text-white" },
                { char: "N", bg: "bg-amber-400 text-black" },
                { char: "G", bg: "bg-emerald-500 text-white" },
                { char: "E", bg: "bg-purple-500 text-white" },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  {/* Lego stud on top of logo brick */}
                  <div className="w-5 h-1.5 bg-black/20 border-t-2 border-x-2 border-black rounded-t-sm z-10 -mb-[1px]"></div>
                  <div className={`w-10 h-10 ${item.bg} border-[3px] border-black rounded-md flex items-center justify-center font-display font-black text-xl tracking-tighter shadow-[2px_2px_0px_#000000]`}>
                    {item.char}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-black text-black tracking-tight flex items-center justify-center sm:justify-start gap-1.5" id="app-title-literal">
                劇集進度追蹤器 <span className="text-xs bg-black text-yellow-300 px-2 py-0.5 rounded-md border-2 border-black shadow-[2px_2px_0_#000000] rotate-2">積木版</span>
              </h1>
              <p className="text-xs text-slate-500 mt-1 font-bold">
                這是一座追劇進度塔！用不同顏色、堆疊式的樂高積木紀錄每部動漫影劇進度 🧱
              </p>
            </div>
          </div>

          {/* Quick controls & counter panel */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="bg-white px-5 py-2.5 rounded-xl border-3 border-black shadow-[4px_4px_0px_#000000] flex items-center gap-4 text-xs font-black text-slate-800" id="header-stats-pill">
              <span className="text-red-500 flex items-center gap-1">🟥 進行中 {ongoingCount}</span>
              <div className="w-px h-4 bg-black"></div>
              <span className="text-emerald-600 flex items-center gap-1">🟩 完結 {completedCount}</span>
            </div>

            <button
              onClick={resetToSeed}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-black text-slate-700 hover:text-black bg-white hover:bg-slate-50 rounded-xl border-2 border-black transition-all cursor-pointer shadow-[3px_3px_0px_#000000] active:translate-y-0.5 active:shadow-[1px_1px_0px_#000000]"
              id="btn-load-demo"
              title="載入預設樂高範例資料"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              重設樂高積木
            </button>
          </div>
        </header>

        {/* LEGO-style vibrant dashboard stats panels */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8" id="stats-summary-grid">
          
          <div className="bg-red-100 p-5 rounded-2xl border-3 border-black shadow-[4px_4px_0px_#000000] flex flex-col justify-between hover:translate-y-[-2px] transition-transform">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-red-900 uppercase tracking-widest">樂高盒中總數 🧱</span>
              <span className="w-4 h-4 rounded-full bg-red-400 border border-black shadow-inner"></span>
            </div>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="font-display text-4xl font-black text-black">{totalDramasCount}</span>
              <span className="text-xs font-black text-red-900">個積木塊</span>
            </div>
          </div>

          <div className="bg-amber-100 p-5 rounded-2xl border-3 border-black shadow-[4px_4px_0px_#000000] flex flex-col justify-between hover:translate-y-[-2px] transition-transform">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-amber-900 uppercase tracking-widest">疊砌組裝中 🛠️</span>
              <span className="w-4 h-4 rounded-full bg-amber-400 border border-black shadow-inner"></span>
            </div>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="font-display text-4xl font-black text-black">{ongoingCount}</span>
              <span className="text-xs font-black text-amber-900">部未完結</span>
            </div>
          </div>

          <div className="bg-emerald-150 bg-[#E0FBEF] p-5 rounded-2xl border-3 border-black shadow-[4px_4px_0px_#000000] flex flex-col justify-between hover:translate-y-[-2px] transition-transform">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-emerald-950 uppercase tracking-widest">完美組裝完成 🏆</span>
              <span className="w-4 h-4 rounded-full bg-emerald-400 border border-black shadow-inner"></span>
            </div>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="font-display text-4xl font-black text-black">{completedCount}</span>
              <span className="text-xs font-black text-emerald-900">座完成塔</span>
            </div>
          </div>

        </section>

        {/* Input Form & List columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Lego brick adder container */}
          <div className="lg:col-span-1" id="add-drama-card-container">
            
            {/* Stud header for adder box container */}
            <div className="flex justify-around px-8 -mb-[6px] relative z-10">
              <div className="w-5 h-2 bg-yellow-400 border-[3px] border-b-0 border-black rounded-t-md shadow-[1px_0_0_rgba(0,0,0,0.1)]"></div>
              <div className="w-5 h-2 bg-yellow-400 border-[3px] border-b-0 border-black rounded-t-md shadow-[1px_0_0_rgba(0,0,0,0.1)]"></div>
              <div className="w-5 h-2 bg-yellow-400 border-[3px] border-b-0 border-black rounded-t-md shadow-[1px_0_0_rgba(0,0,0,0.1)]"></div>
              <div className="w-5 h-2 bg-yellow-400 border-[3px] border-b-0 border-black rounded-t-md shadow-[1px_0_0_rgba(0,0,0,0.1)]"></div>
            </div>

            <div className="bg-yellow-300 p-6 rounded-2xl border-3 border-black shadow-[6px_6px_0px_0px_#000000] sticky top-8">
              <div className="flex items-center gap-2 mb-5 border-b-2 border-black/20 pb-3">
                <Sparkles className="w-5 h-5 text-black" />
                <h2 className="font-black text-lg text-black tracking-tight" id="form-header-title">
                  新增追劇積木
                </h2>
              </div>

              <form onSubmit={handleAddDrama} className="space-y-4">
                <div>
                  <label htmlFor="input-title" className="block text-xs font-black text-black uppercase tracking-wider mb-2 ml-1">
                    劇名 / 動漫名稱 <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="input-title"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setErrorMsg("");
                    }}
                    placeholder="放入劇名（例如：間諜家家酒...）"
                    className="w-full bg-white border-2 border-black rounded-xl px-4 py-3 text-slate-800 text-sm font-bold shadow-[2px_2px_0px_#000000] focus:ring-0 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="input-episodes" className="block text-xs font-black text-black uppercase tracking-wider mb-2 ml-1">
                    總集數 <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    id="input-episodes"
                    min="1"
                    value={totalEpisodes}
                    onChange={(e) => {
                      const val = e.target.value === "" ? "" : Number(e.target.value);
                      setTotalEpisodes(val);
                      setErrorMsg("");
                    }}
                    placeholder="例如：12 或 24"
                    className="w-full bg-white border-2 border-black rounded-xl px-4 py-3 text-slate-800 text-sm font-bold shadow-[2px_2px_0px_#000000] focus:ring-0 focus:outline-none"
                  />

                  {/* Preset Buttons */}
                  <div className="flex flex-wrap gap-1 mt-2.5 px-0.5">
                    {[1, 12, 24, 26, 50].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => applyPresetEpisodes(preset)}
                        className={`text-[10px] font-black px-2 py-1 rounded-md border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_#000000] active:translate-y-0.5 active:shadow-none ${
                          totalEpisodes === preset 
                            ? "bg-black text-white" 
                            : "bg-white hover:bg-slate-100 text-black"
                        }`}
                      >
                        {preset === 1 ? "單發電影" : `${preset}集`}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="input-note" className="block text-xs font-black text-black uppercase tracking-wider mb-2 ml-1">
                    備註註記（選填）
                  </label>
                  <textarea
                    id="input-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="在哪看、追劇感悟、備忘資訊"
                    rows={2}
                    className="w-full bg-white border-2 border-black rounded-xl px-4 py-2.5 text-slate-850 text-sm font-bold shadow-[2px_2px_0px_#000000] focus:ring-0 focus:outline-none resize-none"
                  />
                </div>

                {errorMsg && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-red-700 font-extrabold px-1 bg-red-100 border border-black p-2 rounded-lg"
                    id="error-msg-element"
                  >
                    ⚠️ {errorMsg}
                  </motion.p>
                )}

                <button
                  type="submit"
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-black py-4.5 px-6 rounded-xl border-[3px] border-black shadow-[4px_4px_0px_#000000] transition-all hover:translate-y-[-2px] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 cursor-pointer mt-4"
                  id="btn-add-submit"
                >
                  新增卡片積木 <Plus className="w-5 h-5 stroke-[3]" />
                </button>
              </form>
            </div>
          </div>

          {/* Filtering and Listing Column */}
          <div className="lg:col-span-2">
            
            {/* Filter control panel designed like another grey toy baseplate */}
            <div className="bg-slate-200 p-4 rounded-2xl border-3 border-black shadow-[4px_4px_0px_#000000] mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4" id="filter-controls-panel">
              
              {/* Category tabs */}
              <div className="flex bg-slate-300 p-1 rounded-xl border-2 border-black max-w-fit gap-1">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all duration-200 border-2 border-transparent ${
                    statusFilter === "all"
                      ? "bg-black text-white shadow-sm"
                      : "text-slate-700 hover:text-black hover:bg-slate-100"
                  }`}
                  id="filter-all"
                >
                  全部 ({dramas.length})
                </button>
                <button
                  onClick={() => setStatusFilter("ongoing")}
                  className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all duration-200 border-2 border-transparent ${
                    statusFilter === "ongoing"
                      ? "bg-red-500 text-black border-black shadow-[1px_1px_0_#000000]"
                      : "text-slate-700 hover:text-black hover:bg-slate-100"
                  }`}
                  id="filter-ongoing"
                >
                  正在追 ({ongoingCount})
                </button>
                <button
                  onClick={() => setStatusFilter("completed")}
                  className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all duration-200 border-2 border-transparent ${
                    statusFilter === "completed"
                      ? "bg-emerald-400 text-black border-black shadow-[1px_1px_0_#000000]"
                      : "text-slate-700 hover:text-black hover:bg-slate-100"
                  }`}
                  id="filter-completed"
                >
                  已完結 ({completedCount})
                </button>
              </div>

              {/* Search and sorting controllers */}
              <div className="flex items-center gap-2 flex-1 md:justify-end">
                
                {/* Search */}
                <div className="relative flex-1 max-w-xs">
                  <input
                    type="text"
                    placeholder="搜尋文字與備註..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-white border-2 border-black rounded-xl text-xs font-bold text-slate-800 outline-none placeholder:text-slate-400 shadow-[2px_2px_0px_#000000]"
                    id="search-input"
                  />
                  <Bookmark className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-black" />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")} 
                      className="absolute right-2.5 top-2.5 hover:text-red-500 text-slate-500"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Sort */}
                <div className="flex items-center gap-1 text-black bg-white border-2 border-black rounded-xl px-2 py-1.5 text-xs font-black shadow-[2px_2px_0px_#000000]">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent border-none text-slate-800 font-black outline-none cursor-pointer text-xs"
                    id="sort-select"
                  >
                    <option value="updatedAt">更新時間</option>
                    <option value="title">劇名 A-Z</option>
                    <option value="progress">完成進度</option>
                  </select>
                </div>

              </div>

            </div>

            {/* List with stacked layout */}
            <div className="space-y-8" id="drama-cards-grid">
              <AnimatePresence mode="popLayout">
                {filteredAndSortedDramas.map((drama) => {
                  const isCompleted = drama.currentEpisode === drama.totalEpisodes;
                  const progressPercentage = Math.round(
                    (drama.currentEpisode / drama.totalEpisodes) * 100
                  );
                  const theme = getVibrantTheme(drama.id, isCompleted);

                  return (
                    <motion.div
                      layout
                      key={drama.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="relative block"
                      id={`drama-card-${drama.id}`}
                    >
                      {/* Lego 3D top studs overlapping the card border to look exactly like real plastic blocks */}
                      <div className="flex justify-around px-12 -mb-[7px] relative z-10">
                        <div className={`w-6 h-2.5 ${theme.studColor} border-[3px] border-b-0 border-black rounded-t-sm shadow-[1px_0_0_rgba(255,255,255,0.2)]`}></div>
                        <div className={`w-6 h-2.5 ${theme.studColor} border-[3px] border-b-0 border-black rounded-t-sm shadow-[1px_0_0_rgba(255,255,255,0.2)]`}></div>
                        <div className={`w-6 h-2.5 ${theme.studColor} border-[3px] border-b-0 border-black rounded-t-sm shadow-[1px_0_0_rgba(255,255,255,0.2)]`}></div>
                        <div className={`w-6 h-2.5 ${theme.studColor} border-[3px] border-b-0 border-black rounded-t-sm shadow-[1px_0_0_rgba(255,255,255,0.2)]`}></div>
                      </div>

                      <div className={`${theme.cardBg} ${theme.textColor} rounded-2xl p-6 ${theme.cardBorder}`}>
                        
                        {/* Finished Trophy Badge label */}
                        {isCompleted && (
                          <div className="absolute -top-1.5 -right-2 bg-yellow-300 text-black border-2 border-black font-black px-3 py-1 rounded-md text-xs shadow-[3px_3px_0_#000000] rotate-6 select-none uppercase tracking-wider z-20">
                            ⭐ GOLD MEDAL Complete
                          </div>
                        )}

                        <div className="flex justify-between items-start gap-4">
                          
                          <div className="flex-1">
                            {editingId === drama.id ? (
                              /* Edit block mode in simple forms */
                              <div className="space-y-3 p-4 bg-white/95 text-slate-900 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000]" id={`edit-form-${drama.id}`}>
                                <div className="text-xs font-black text-rose-500 uppercase tracking-widest bg-rose-50 border border-black p-1 text-center rounded-sm">
                                  🔧 進入積木編輯模式
                                </div>
                                <div>
                                  <label className="block text-[10px] font-black text-slate-600 mb-1 uppercase tracking-wider">劇名或影劇名稱</label>
                                  <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border-2 border-black text-xs font-bold text-slate-800 bg-white"
                                    id={`edit-title-input-${drama.id}`}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-[10px] font-black text-slate-600 mb-1 uppercase tracking-wider">總集數</label>
                                    <input
                                      type="number"
                                      min="1"
                                      value={editTotal}
                                      onChange={(e) => setEditTotal(Math.max(1, Number(e.target.value)))}
                                      className="w-full px-3 py-2 rounded-lg border-2 border-black text-xs font-bold text-slate-800 bg-white"
                                      id={`edit-total-input-${drama.id}`}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-black text-slate-600 mb-1 uppercase tracking-wider">當前進度</label>
                                    <div className="text-xs py-2 px-3 bg-slate-150 border-2 border-black rounded-lg text-slate-800 font-extrabold text-center">
                                      第 {drama.currentEpisode} 集
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-black text-slate-600 mb-1 uppercase tracking-wider">備註資訊</label>
                                  <input
                                    type="text"
                                    value={editNote}
                                    onChange={(e) => setEditNote(e.target.value)}
                                    placeholder="備註空狀態"
                                    className="w-full px-3 py-2 rounded-lg border-2 border-black text-xs font-bold text-slate-800 bg-white"
                                    id={`edit-note-input-${drama.id}`}
                                  />
                                </div>
                                <div className="flex gap-2 justify-end pt-1">
                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-black bg-slate-200 hover:bg-slate-300 border-2 border-black rounded-lg font-black shadow-[2px_2px_0_#000000] cursor-pointer"
                                    id={`edit-cancel-${drama.id}`}
                                  >
                                    取消
                                  </button>
                                  <button
                                    onClick={() => saveEditing(drama.id)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-yellow-300 text-black border-2 border-black rounded-lg font-black shadow-[2px_2px_0_#000000] cursor-pointer"
                                    id={`edit-save-${drama.id}`}
                                  >
                                    儲存
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* Standard Display mode with beautiful Toy Text contrast */
                              <>
                                <h3 className={`text-2xl font-black ${theme.titleColor} leading-tight tracking-tight mb-2 pr-6`} id={`drama-title-${drama.id}`}>
                                  {drama.title}
                                </h3>
                                
                                {drama.note && (
                                  <p className="text-xs bg-black/10 py-2.5 px-3 rounded-lg border-l-4 border-black font-bold my-3 text-current max-w-2xl" id={`drama-note-${drama.id}`}>
                                    {drama.note}
                                  </p>
                                )}

                                <div className={`flex items-center gap-1.5 ${theme.metaColor} text-[10px] font-black tracking-wider uppercase mt-3`}>
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>最後更新：{new Date(drama.updatedAt).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })}</span>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Quick controls and settings */}
                          {editingId !== drama.id && (
                            <div className="flex flex-col items-end gap-2.5 self-start">
                              <span className={`inline-block ${theme.badgeBg} text-[10px] font-black px-2.5 py-1 rounded border-2 border-black shadow-[2px_2px_0px_#000000] uppercase tracking-wider`}>
                                {theme.badgeText}
                              </span>

                              <div className="flex items-center gap-1 bg-black/10 rounded-md p-0.5 border border-black/20">
                                <button
                                  onClick={() => startEditing(drama)}
                                  className="p-1 px-1.5 text-current hover:bg-black/20 rounded transition-colors cursor-pointer"
                                  id={`btn-edit-${drama.id}`}
                                  title="修改此積木"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`確定要將「${drama.title}」積木回收移除嗎？`)) {
                                      deleteDrama(drama.id);
                                    }
                                  }}
                                  className="p-1 px-1.5 text-current hover:text-red-300 hover:bg-black/20 rounded transition-colors cursor-pointer"
                                  id={`btn-delete-${drama.id}`}
                                  title="粉碎回收"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}

                        </div>

                        {/* Middle Progress bar styled like mechanical brick connections */}
                        <div className="mb-6 mt-5 bg-black/10 p-4 border border-black/15 rounded-xl">
                          <div className="flex justify-between items-end mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-80">積木搭建進度</span>
                            <span className="text-sm font-black tracking-wider font-mono">
                              {drama.currentEpisode < 10 ? `0${drama.currentEpisode}` : drama.currentEpisode} / {drama.totalEpisodes < 10 ? `0${drama.totalEpisodes}` : drama.totalEpisodes} 集 ({progressPercentage}%)
                            </span>
                          </div>

                          {/* Lego styled Custom segmented progress track */}
                          <div className="w-full h-4 bg-slate-100 rounded-sm overflow-hidden relative border-2 border-black shadow-[inset_1px_1px_4px_rgba(0,0,0,0.2)]">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progressPercentage}%` }}
                              transition={{ duration: 0.3 }}
                              className="h-full bg-emerald-400 border-r-2 border-black relative"
                              style={{ width: `${progressPercentage}%` }}
                              id={`progress-bar-${drama.id}`}
                            >
                              {/* Slanted plastic lines effect */}
                              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.25)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.25)_50%,rgba(255,255,255,0.25)_75%,transparent_75%,transparent)] bg-[length:16px_16px] opacity-25" />
                            </motion.div>
                          </div>
                        </div>

                        {/* Plus and Minus Action buttons designed with Lego tactile feedback */}
                        <div className="flex gap-4">
                          
                          {/* Decrement Button */}
                          <button
                            disabled={drama.currentEpisode <= 0}
                            onClick={() => decrementProgress(drama.id)}
                            className={`flex-1 font-black py-3 rounded-lg border-2 border-black transition-all flex items-center justify-center gap-1 cursor-pointer active:translate-y-0.5 active:shadow-none shadow-[2px_2px_0px_#000000] ${
                              drama.currentEpisode <= 0 
                                ? "bg-black/5 text-black/20 cursor-not-allowed opacity-50 shadow-none" 
                                : theme.btnMinusBg
                            }`}
                            id={`btn-minus-${drama.id}`}
                            title="扣減進度"
                          >
                            <Minus className="w-4 h-4 stroke-[3.5]" />
                          </button>
                          
                          {/* Increment Button */}
                          <button
                            disabled={drama.currentEpisode >= drama.totalEpisodes}
                            onClick={() => incrementProgress(drama.id)}
                            className={`flex-grow font-black py-3 rounded-lg border-2 border-black transition-all flex items-center justify-center gap-1.5 cursor-pointer active:translate-y-0.5 active:shadow-none shadow-[3px_3px_0px_#000000] ${
                              drama.currentEpisode >= drama.totalEpisodes 
                                ? "bg-slate-300 text-slate-400 cursor-not-allowed shadow-none border-dashed" 
                                : "bg-black text-white hover:bg-neutral-900"
                            }`}
                            id={`btn-plus-${drama.id}`}
                            title="組裝 +1 集"
                          >
                            <span>組裝完看一集</span>
                            <Plus className="w-4 h-4 stroke-[3.5]" />
                          </button>

                        </div>

                        {/* Supplementary utility helpers inside Lego card */}
                        <div className="mt-4 pt-3.5 border-t border-black/10 flex justify-between items-center">
                          
                          <button
                            onClick={() => resetProgress(drama.id)}
                            disabled={drama.currentEpisode === 0}
                            className={`text-[10px] font-black flex items-center gap-1 px-2 py-1 select-none rounded border border-transparent transition-all ${
                              drama.currentEpisode === 0 
                                ? "opacity-30 cursor-not-allowed" 
                                : "hover:bg-black/10 cursor-pointer"
                            }`}
                            id={`btn-reset-${drama.id}`}
                          >
                            <RotateCcw className="w-3 h-3" /> 打掉重練
                          </button>

                          <button
                            onClick={() => completeProgress(drama.id)}
                            disabled={drama.currentEpisode === drama.totalEpisodes}
                            className={`text-[10px] font-black flex items-center gap-1 px-2 py-1 select-none rounded border border-transparent transition-all ${
                              drama.currentEpisode === drama.totalEpisodes 
                                ? "opacity-30 cursor-not-allowed" 
                                : "bg-white/35 hover:bg-white/50 text-black border-black/30 cursor-pointer shadow-[1px_1px_0_rgba(0,0,0,0.15)]"
                            }`}
                            id={`btn-complete-${drama.id}`}
                          >
                            <CheckCircle className="w-3 h-3" /> 直接封頂
                          </button>

                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Empty state container styled as matching toy storage */}
              {filteredAndSortedDramas.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white p-12 rounded-2xl border-3 border-black text-center shadow-[6px_6px_0px_#000000] flex flex-col items-center justify-center bg-radial from-slate-50 to-slate-100"
                  id="empty-state-card"
                >
                  <div className="bg-yellow-300 p-4 border-2 border-black rounded-lg text-black mb-4 shadow-[2px_2px_0px_#000000]">
                    <Tv className="w-8 h-8" />
                  </div>
                  <h3 className="font-black text-slate-900 text-base">樂高收納箱是空的！</h3>
                  <p className="text-xs font-bold text-slate-500 max-w-xs mt-1">
                    {searchQuery ? "找不到符合此排序與過濾屬性的積木，請嘗試變更搜尋字。" : "點選左方黃色新增控制台，親手搭建第一部追劇積木組件吧！"}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="mt-4 px-4 py-2 bg-black text-white hover:bg-neutral-900 text-xs font-black rounded-lg border-2 border-black shadow-[3px_3px_0px_#000000] active:translate-y-0.5 transition-all cursor-pointer"
                      id="btn-clear-search"
                    >
                      重置過濾器
                    </button>
                  )}
                </motion.div>
              )}
            </div>

          </div>

        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t-4 border-dashed border-slate-350 text-center text-slate-500 text-xs font-bold">
          <p>© 2026 劇集進度追蹤器（積木樂高專屬主題）• 親手砌建，輕鬆記錄您的所有影片進程 🧱 Popcorn & Bricks</p>
          <div className="flex justify-center gap-3 mt-3">
            <button
              onClick={() => {
                if (window.confirm("確定要把所有追劇積木粉碎倒空嗎？（此資料將會永久遺失）")) {
                  setDramas([]);
                }
              }}
              className="text-xxs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-md font-bold cursor-pointer transition-colors"
              id="btn-clear-all"
            >
              🚀 倒空整箱積木資料
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
}
