import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import {
  LayoutDashboard, BookOpen, Clock, Settings, Sun, Moon, Play, Pause,
  Square, SkipForward, Plus, X, Check, Flame, TrendingUp, Calendar,
  ChevronLeft, ChevronRight, Trash2, Edit3, Save, FileText, Filter, Menu,
  Dumbbell, BookMarked, Beaker, Globe, Calculator, Atom, Pen, Music,
  Code, Palette, Heart, Mountain, Bike, Target, BarChart3, RotateCcw,
  Download, Upload, Printer, Award, Wifi, WifiOff, Database, LogOut, KeyRound,
  Info, Sparkles, GraduationCap, Users, Rocket, Cloud,
  ListTodo, Columns3, GripVertical, Circle, CheckCircle2, Flag, ArrowRight, CalendarDays,
  Repeat, Hourglass, Archive, ArchiveRestore,
  Timer, CalendarRange, Trophy, Zap, Coffee, Star, Lock
} from "lucide-react";
import { supabase } from "./supabaseClient";
import { loadUserData, saveUserData } from "./data";

/* ─── Helpers ─── */
const uid = () => Math.random().toString(36).slice(2, 10);
const pad = (n) => String(n).padStart(2, "0");
const fmtDur = (m) => { if (!m) return "0m"; const h = Math.floor(m / 60); return h > 0 ? `${h}h ${pad(m % 60)}m` : `${m % 60}m`; };
const fmtT = (s) => `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
const TODAY = new Date();
const toK = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const pK = (k) => { const p = k.split("-").map(Number); return new Date(p[0], p[1] - 1, p[2]); };
const MO = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

const CATS = [
  { id: "estudos", label: "Estudos", icon: BookOpen, color: "#6366f1" },
  { id: "exercicios", label: "Exercícios Físicos", icon: Dumbbell, color: "#10b981" },
  { id: "leituras", label: "Leituras", icon: BookMarked, color: "#f59e0b" },
];
const PRIOS = { alta: { l: "Alta", c: "#ef4444" }, media: { l: "Média", c: "#f59e0b" }, baixa: { l: "Baixa", c: "#10b981" } };
const DEFAULT_COLS = [{ id: "todo", label: "A Fazer", color: "#6366f1" }, { id: "doing", label: "Fazendo", color: "#f59e0b" }, { id: "done", label: "Concluído", color: "#10b981" }];
const ICO = [
  { n: "Beaker", c: Beaker },{ n: "Globe", c: Globe },{ n: "Calculator", c: Calculator },
  { n: "Atom", c: Atom },{ n: "Pen", c: Pen },{ n: "BookMarked", c: BookMarked },
  { n: "Code", c: Code },{ n: "Palette", c: Palette },{ n: "Music", c: Music },
  { n: "Heart", c: Heart },{ n: "Mountain", c: Mountain },{ n: "Bike", c: Bike },
  { n: "Dumbbell", c: Dumbbell },{ n: "Target", c: Target },{ n: "BookOpen", c: BookOpen },
  { n: "Flame", c: Flame },
];
const COLS = ["#6366f1","#8b5cf6","#ec4899","#f43f5e","#f59e0b","#10b981","#06b6d4","#3b82f6","#84cc16","#d946ef"];
const EMO = ["🧑‍💻","👨‍🎓","👩‍🔬","🧑‍🏫","🦸","🧑‍💼","🧑‍🚀","🧙","🦊","🐱","🦉","🐼","🎯","🚀","💎","🔥","⚡","🌊","🎨","🏆","🎓","📚","🧬","🏋️"];
const gI = (n) => ICO.find((i) => i.n === n)?.c || BookOpen;

const mkSubs = () => [
  { id: uid(), name: "Biologia", icon: "Beaker", color: "#6366f1", category: "estudos" },
  { id: uid(), name: "História", icon: "Globe", color: "#f59e0b", category: "estudos" },
  { id: uid(), name: "Matemática", icon: "Calculator", color: "#10b981", category: "estudos" },
  { id: uid(), name: "Literatura", icon: "BookMarked", color: "#ec4899", category: "estudos" },
  { id: uid(), name: "Química", icon: "Atom", color: "#06b6d4", category: "estudos" },
  { id: uid(), name: "CTFL - Fundamentos de Teste", icon: "Code", color: "#8b5cf6", category: "estudos" },
  { id: uid(), name: "Jiu-Jitsu", icon: "Dumbbell", color: "#10b981", category: "exercicios" },
  { id: uid(), name: "Musculação", icon: "Flame", color: "#f43f5e", category: "exercicios" },
  { id: uid(), name: "O Programador Pragmático", icon: "BookOpen", color: "#3b82f6", category: "leituras" },
  { id: uid(), name: "Clean Code", icon: "Code", color: "#84cc16", category: "leituras" },
];

/* ─── Tiny components ─── */
function Mdl({ open, onClose, title, children, dk }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`w-full max-w-md rounded-2xl p-5 max-h-[85vh] overflow-y-auto ${dk ? "bg-gray-900 border border-white/10" : "bg-white shadow-2xl border border-gray-100"}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-base font-bold ${dk ? "text-white" : "text-gray-800"}`}>{title}</h3>
          <button onClick={onClose} className={`p-1.5 rounded-lg ${dk ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-100 text-gray-400"}`}><X size={16} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Ring({ pct, sz = 110, sw = 9, dk }) {
  const r = (sz - sw) / 2, c = 2 * Math.PI * r, v = Math.min(pct || 0, 100);
  return (
    <svg width={sz} height={sz} className="-rotate-90">
      <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={dk ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} strokeWidth={sw} />
      <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke="url(#rg)" strokeWidth={sw} strokeDasharray={c} strokeDashoffset={c - (v / 100) * c} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.8s" }} />
      <defs><linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#a78bfa" /></linearGradient></defs>
    </svg>
  );
}

function CTip({ active, payload, dark }) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload, l = d.day || d.date || d.name || "", v = payload[0].value;
  return <div className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-xl ${dark ? "bg-gray-800 text-white" : "bg-white text-gray-800 border"}`}>{l}: {v < 200 ? v + "h" : fmtDur(v)}</div>;
}

/* ═══════════════ MAIN ═══════════════ */
export default function EstudoFlow({ user }) {
  const defaultProfile = {
    name: user?.user_metadata?.name || (user?.email ? user.email.split("@")[0] : "Usuário"),
    emoji: "🧑‍💻",
  };
  const [dk, setDk] = useState(false);
  const [pg, setPg] = useState("Dashboard");
  const [sb, setSb] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [syncStatus, setSyncStatus] = useState("idle"); // "idle" | "saving" | "saved" | "error"

  const [subjects, setSubjects] = useState([]);
  const [records, setRecords] = useState([]);
  const [goals, setGoals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState(DEFAULT_COLS);
  const [profile, setProfile] = useState(defaultProfile);
  const [notif, setNotif] = useState(null);

  /* ── Conta / segurança ── */
  const [npw1, setNpw1] = useState("");
  const [npw2, setNpw2] = useState("");
  const [pwBusy, setPwBusy] = useState(false);

  /* ── Load from Supabase ── */
  useEffect(() => {
    const fallback = setTimeout(() => {
      if (!loaded) { setSubjects(mkSubs()); setLoaded(true); }
    }, 5000);

    loadUserData(user.id).then((d) => {
      clearTimeout(fallback);
      if (d && d.subjects && d.subjects.length > 0) {
        setSubjects(d.subjects);
        setRecords(d.records || []);
        setGoals(d.goals || []);
        setTasks(d.tasks || []);
        setColumns(d.columns && d.columns.length ? d.columns : DEFAULT_COLS);
        setSchedule(d.schedule || null);
        if (d.pomo) { setPomo(d.pomo); setPmSec((d.pomo.focus || 25) * 60); }
        setProfile(d.profile || defaultProfile);
        if (typeof d.dark === "boolean") setDk(d.dark);
      } else {
        // Primeiro acesso (sem dados na nuvem) → leva o novato pro "Sobre"
        const seed = mkSubs();
        setSubjects(seed);
        setPg("Sobre");
        // cria a linha do usuário já no 1º acesso → nas próximas vezes cai no Dashboard
        saveUserData(user.id, { subjects: seed, records: [], goals: [], tasks: [], columns: DEFAULT_COLS, schedule: null, pomo, profile: defaultProfile, dark: dk }).catch(() => {});
      }
      setLoaded(true);
    }).catch(() => {
      clearTimeout(fallback);
      setSubjects(mkSubs());
      setLoaded(true);
      setSyncStatus("error");
    });

    return () => clearTimeout(fallback);
  }, [user.id]);

  /* ── Save to Supabase (debounced) ── */
  const saveRef = useRef(null);
  const isFirst = useRef(true);
  useEffect(() => {
    if (!loaded) return;
    if (isFirst.current) { isFirst.current = false; return; }
    clearTimeout(saveRef.current);
    setSyncStatus("saving");
    saveRef.current = setTimeout(() => {
      saveUserData(user.id, { subjects, records, goals, tasks, columns, schedule, pomo, profile, dark: dk })
        .then(() => setSyncStatus("saved"))
        .catch(() => setSyncStatus("error"));
    }, 1200);
  }, [subjects, records, goals, tasks, columns, schedule, pomo, profile, dk, loaded, user.id]);

  /* ── Marca o tema no <html> (para barras de rolagem tema-aware) ── */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dk);
    return () => document.documentElement.classList.remove("dark");
  }, [dk]);

  const [tText, setTText] = useState("");
  const [tCat, setTCat] = useState("estudos");
  const [tOn, setTOn] = useState(false);
  const [tP, setTP] = useState(false);
  const [sec, setSec] = useState(0);
  const [tStartedAt, setTStartedAt] = useState(null);
  const [tAccum, setTAccum] = useState(0);
  const tRef = useRef(null);
  const [dF, setDF] = useState("month");
  const [dD, setDD] = useState(new Date());
  const [hC, setHC] = useState("all");
  const [hS, setHS] = useState("all");
  const [hSel, setHSel] = useState(new Set());
  const [hSelMode, setHSelMode] = useState(false);
  const [rP, setRP] = useState("month");
  const [mt, setMt] = useState(null);
  // Tarefas / Kanban
  const [tkId, setTkId] = useState("");
  const [tkTitle, setTkTitle] = useState("");
  const [tkNotes, setTkNotes] = useState("");
  const [tkPrio, setTkPrio] = useState("media");
  const [tkDue, setTkDue] = useState("");
  const [tkSubj, setTkSubj] = useState("");
  const [tkStatus, setTkStatus] = useState("todo");
  const [quickTask, setQuickTask] = useState("");
  const [taskFilter, setTaskFilter] = useState("all");
  const [dragId, setDragId] = useState(null);
  const [dragColId, setDragColId] = useState(null);
  const [colId, setColId] = useState("");
  const [colLabel, setColLabel] = useState("");
  const [colColor, setColColor] = useState("#6366f1");
  const [tkRec, setTkRec] = useState("none");
  const [tkEst, setTkEst] = useState("");
  const [tkUsed, setTkUsed] = useState("");
  const [tkChecklist, setTkChecklist] = useState([]);
  const [tkNewItem, setTkNewItem] = useState("");
  // Pomodoro
  const [pomo, setPomo] = useState({ focus: 25, short: 5, long: 15, untilLong: 4 });
  const [pmMode, setPmMode] = useState("focus");
  const [pmSec, setPmSec] = useState(25 * 60);
  const [pmOn, setPmOn] = useState(false);
  const [pmCount, setPmCount] = useState(0);
  const [pmSubj, setPmSubj] = useState("");
  const pmRef = useRef(null);
  // Cronograma
  const [schedule, setSchedule] = useState(null);
  const [schBlocks, setSchBlocks] = useState(3);
  const [schDays, setSchDays] = useState(["Seg", "Ter", "Qua", "Qui", "Sex"]);
  const [schSubs, setSchSubs] = useState([]);
  const [mDate, smDate] = useState("");
  const [mSub, smSub] = useState("");
  const [mDur, smDur] = useState("60");
  const [mNotes, smNotes] = useState("");
  const [mName, smName] = useState("");
  const [mIcon, smIcon] = useState("BookOpen");
  const [mColor, smColor] = useState("#6366f1");
  const [mCat, smCat] = useState("estudos");
  const [mId, smId] = useState("");
  const [mTitle, smTitle] = useState("");
  const [mSD, smSD] = useState("");
  const [mED, smED] = useState("");
  const [mHE, smHE] = useState(true);
  const [mTH, smTH] = useState(50);
  const [mPN, smPN] = useState("");
  const [printMode, setPrintMode] = useState(null);
  const [tDrop, setTDrop] = useState(false);
  const [mRecCat, setMRecCat] = useState("all");
  const [calM, setCalM] = useState(TODAY.getMonth());
  const [calY, setCalY] = useState(TODAY.getFullYear());
  const [confirmReset, setConfirmReset] = useState(false);
  const [rCatView, setRCatView] = useState("cat");

  const flash = useCallback((m) => { setNotif(m); setTimeout(() => setNotif(null), 2200); }, []);

  const sair = useCallback(async () => { await supabase.auth.signOut(); }, []);

  const mudarSenha = useCallback(async () => {
    if (npw1.length < 6) { flash("Senha precisa de 6+ caracteres"); return; }
    if (npw1 !== npw2) { flash("As senhas não conferem"); return; }
    setPwBusy(true);
    const { error } = await supabase.auth.updateUser({ password: npw1 });
    setPwBusy(false);
    if (error) { flash("Erro ao trocar senha"); return; }
    setNpw1(""); setNpw2(""); flash("Senha alterada!");
  }, [npw1, npw2, flash]);

  useEffect(() => {
    if (tOn && !tP && tStartedAt) {
      tRef.current = setInterval(() => {
        setSec(tAccum + Math.floor((Date.now() - tStartedAt) / 1000));
      }, 1000);
    } else clearInterval(tRef.current);
    return () => clearInterval(tRef.current);
  }, [tOn, tP, tStartedAt, tAccum]);

  const cd = dk ? "bg-white/[0.04] border border-white/[0.07]" : "bg-white/80 border border-gray-200/60 shadow-sm";
  const tx = dk ? "text-gray-100" : "text-gray-800";
  const mu = dk ? "text-gray-400" : "text-gray-500";
  const ip = `w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 transition ${dk ? "bg-gray-800 border-white/10 text-white placeholder-gray-600" : "bg-white border-gray-200 text-gray-800 placeholder-gray-400"}`;

  const gS = useCallback((id) => subjects.find((s) => s.id === id), [subjects]);

  const getR = useCallback(() => {
    const d = dD, y = d.getFullYear(), m = d.getMonth();
    if (dF === "day") return [toK(d), toK(d)];
    if (dF === "week") { const s = new Date(d); s.setDate(s.getDate() - ((s.getDay() + 6) % 7)); const e = new Date(s); e.setDate(e.getDate() + 6); return [toK(s), toK(e)]; }
    if (dF === "month") return [`${y}-${pad(m+1)}-01`, `${y}-${pad(m+1)}-${pad(new Date(y, m+1, 0).getDate())}`];
    return [`${y}-01-01`, `${y}-12-31`];
  }, [dF, dD]);

  const fR = useMemo(() => { const [s, e] = getR(); return records.filter((r) => r.date >= s && r.date <= e); }, [records, getR]);
  const tM = useMemo(() => fR.reduce((a, r) => a + r.duration, 0), [fR]);
  const uD = useMemo(() => [...new Set(fR.map((r) => r.date))].length, [fR]);
  const aD = uD > 0 ? Math.round(tM / uD) : 0;
  const streak = useMemo(() => { let c = 0, d = new Date(TODAY); while (records.some((r) => r.date === toK(d))) { c++; d.setDate(d.getDate() - 1); } return c; }, [records]);

  const dashChart = useMemo(() => {
    const mp = {}; fR.forEach((r) => { mp[r.date] = (mp[r.date] || 0) + r.duration; });
    if (dF === "day") {
      const bySubj = {}; fR.forEach((r) => { const s = gS(r.subjectId); if (s) bySubj[s.name] = (bySubj[s.name] || 0) + r.duration; });
      const entries = Object.entries(bySubj);
      return entries.length > 0 ? entries.map(([name, m]) => ({ day: name.length > 12 ? name.slice(0,12)+"…" : name, horas: +(m/60).toFixed(1) })) : [{ day: "Hoje", horas: 0 }];
    }
    if (dF === "week") {
      const [s] = getR(); const start = pK(s);
      return ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"].map((la, i) => { const d = new Date(start); d.setDate(d.getDate()+i); return { day: la, horas: +((mp[toK(d)]||0)/60).toFixed(1) }; });
    }
    if (dF === "month") {
      const y = dD.getFullYear(), m = dD.getMonth(), dim = new Date(y, m+1, 0).getDate();
      return Array.from({ length: dim }, (_, i) => ({ day: String(i+1), horas: +((mp[`${y}-${pad(m+1)}-${pad(i+1)}`]||0)/60).toFixed(1) }));
    }
    const y = dD.getFullYear(), mpM = {};
    fR.forEach((r) => { const mk = r.date.slice(0,7); mpM[mk] = (mpM[mk]||0) + r.duration; });
    return MO.map((name, i) => ({ day: name.slice(0,3), horas: +((mpM[`${y}-${pad(i+1)}`]||0)/60).toFixed(1) }));
  }, [fR, dF, dD, gS, getR]);
  const dashChartLabel = { day:"Detalhamento do Dia", week:"Evolução Semanal", month:`Evolução ${MO[dD.getMonth()]}`, year:`Evolução ${dD.getFullYear()}` }[dF];

  const pD = useMemo(() => {
    const mp = {}; fR.forEach((r) => { mp[r.subjectId] = (mp[r.subjectId]||0) + r.duration; });
    return Object.entries(mp).map(([id, m]) => { const s = gS(id); return s ? { name: s.name, value: m, color: s.color } : null; }).filter(Boolean).sort((a,b)=>b.value-a.value).slice(0,6);
  }, [fR, gS]);

  const gPct = useCallback((g) => {
    const ids = subjects.filter((s) => s.category === g.category).map((s) => s.id);
    const mn = records.filter((r) => ids.includes(r.subjectId) && r.date >= g.startDate && r.date <= (g.endDate || toK(TODAY))).reduce((a,r)=>a+r.duration,0);
    return g.targetHours > 0 ? Math.min(100, Math.round(mn/60/g.targetHours*100)) : 0;
  }, [subjects, records]);
  const gDL = (g) => { if (!g.endDate) return null; return Math.max(0, Math.ceil((pK(g.endDate)-TODAY)/864e5)); };

  const addRec = (sId, date, dur, notes) => { setRecords((p) => [...p, { id: uid(), subjectId: sId, date, duration: parseInt(dur)||0, notes: notes||"" }]); flash("Registro adicionado!"); };
  const delRec = (id) => { setRecords((p) => p.filter((r) => r.id !== id)); flash("Removido"); };
  const delSub = (id) => { setSubjects((p) => p.filter((s) => s.id !== id)); setRecords((p) => p.filter((r) => r.subjectId !== id)); flash("Conteúdo removido"); };
  const delGoal = (id) => { setGoals((p) => p.filter((g) => g.id !== id)); flash("Meta removida"); };

  // ── Tarefas / Kanban (colunas dinâmicas) ──
  const firstCol = () => columns[0]?.id || "todo";
  const lastCol = () => columns[columns.length - 1]?.id || "done";
  const colOf = (id) => columns.find((c) => c.id === id) || columns[0] || DEFAULT_COLS[0];

  const addTask = (title, status) => {
    if (!title.trim()) return;
    setTasks((p) => [...p, { id: uid(), title: title.trim(), notes: "", status: status || firstCol(), priority: "media", due: "", subjectId: "", recurrence: "none", checklist: [], estMin: "", usedMin: "", createdAt: Date.now() }]);
    flash("Tarefa criada!");
  };
  const updTask = (id, patch) => setTasks((p) => p.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  const delTask = (id) => { setTasks((p) => p.filter((t) => t.id !== id)); flash("Tarefa removida"); };
  const toggleArchive = (id, val) => { updTask(id, { archived: val }); flash(val ? "Tarefa arquivada" : "Tarefa restaurada"); };

  const addRecurrence = (dateStr, rec) => {
    if (!dateStr) return "";
    const d = pK(dateStr);
    if (rec === "daily") d.setDate(d.getDate() + 1);
    else if (rec === "weekly") d.setDate(d.getDate() + 7);
    else if (rec === "monthly") d.setMonth(d.getMonth() + 1);
    return toK(d);
  };
  const logTaskTime = (task) => {
    const mins = parseInt(task.usedMin || task.estMin || 0) || 0;
    if (mins > 0) {
      setRecords((p) => [...p, { id: uid(), subjectId: task.subjectId || "", date: toK(TODAY), duration: mins, notes: "Tarefa: " + task.title }]);
    }
  };
  // Muda o status tratando conclusão (última coluna): registra tempo no histórico e regenera recorrentes
  const setTaskStatus = (task, newStatus) => {
    const wasDone = task.status === lastCol();
    const willDone = newStatus === lastCol();
    if (willDone && !wasDone && !task.logged) {
      logTaskTime(task);
      if (task.recurrence && task.recurrence !== "none") {
        const nextDue = addRecurrence(task.due, task.recurrence);
        setTasks((p) => p.map((t) => (t.id === task.id ? { ...t, status: firstCol(), logged: false, due: nextDue, checklist: (t.checklist || []).map((c) => ({ ...c, done: false })) } : t)));
        flash("Concluída! Próxima ocorrência gerada 🔁");
        return;
      }
      setTasks((p) => p.map((t) => (t.id === task.id ? { ...t, status: newStatus, logged: true } : t)));
      flash(parseInt(task.usedMin || task.estMin || 0) > 0 ? "Concluída! Tempo lançado no histórico ✓" : "Tarefa concluída!");
      return;
    }
    const patch = !willDone && wasDone ? { status: newStatus, logged: false } : { status: newStatus };
    setTasks((p) => p.map((t) => (t.id === task.id ? { ...t, ...patch } : t)));
  };
  const moveTask = (task, dir) => {
    const order = columns.map((c) => c.id);
    const i = Math.min(order.length - 1, Math.max(0, order.indexOf(task.status) + dir));
    setTaskStatus(task, order[i]);
  };
  const moveCol = (id, dir) => {
    setColumns((p) => {
      const i = p.findIndex((c) => c.id === id); const j = i + dir;
      if (i < 0 || j < 0 || j >= p.length) return p;
      const n = [...p]; [n[i], n[j]] = [n[j], n[i]]; return n;
    });
  };
  const reorderCol = (fromId, toId) => {
    if (fromId === toId) return;
    setColumns((p) => {
      const from = p.findIndex((c) => c.id === fromId), to = p.findIndex((c) => c.id === toId);
      if (from < 0 || to < 0) return p;
      const n = [...p]; const [m] = n.splice(from, 1); n.splice(to, 0, m); return n;
    });
  };
  const openAddTask = (status) => { setTkId(""); setTkTitle(""); setTkNotes(""); setTkPrio("media"); setTkDue(""); setTkSubj(""); setTkStatus(status || firstCol()); setTkRec("none"); setTkEst(""); setTkUsed(""); setTkChecklist([]); setTkNewItem(""); setMt("task"); };
  const openEditTask = (t) => { setTkId(t.id); setTkTitle(t.title); setTkNotes(t.notes || ""); setTkPrio(t.priority || "media"); setTkDue(t.due || ""); setTkSubj(t.subjectId || ""); setTkStatus(t.status || firstCol()); setTkRec(t.recurrence || "none"); setTkEst(t.estMin || ""); setTkUsed(t.usedMin || ""); setTkChecklist(t.checklist || []); setTkNewItem(""); setMt("task"); };
  const saveTask = () => {
    if (!tkTitle.trim()) return;
    const d = { title: tkTitle.trim(), notes: tkNotes, priority: tkPrio, due: tkDue, subjectId: tkSubj, recurrence: tkRec, estMin: tkEst, usedMin: tkUsed, checklist: tkChecklist };
    if (tkId) {
      const existing = tasks.find((t) => t.id === tkId);
      updTask(tkId, d);
      if (existing && tkStatus !== existing.status) setTaskStatus({ ...existing, ...d }, tkStatus);
      else updTask(tkId, { status: tkStatus });
      flash("Tarefa atualizada!");
    } else {
      setTasks((p) => [...p, { id: uid(), createdAt: Date.now(), status: tkStatus, ...d }]);
      flash("Tarefa criada!");
    }
    cl();
  };
  // checklist helpers (dentro do modal)
  const addChkItem = () => { if (!tkNewItem.trim()) return; setTkChecklist((p) => [...p, { id: uid(), text: tkNewItem.trim(), done: false }]); setTkNewItem(""); };
  const toggleChkItem = (id) => setTkChecklist((p) => p.map((c) => (c.id === id ? { ...c, done: !c.done } : c)));
  const delChkItem = (id) => setTkChecklist((p) => p.filter((c) => c.id !== id));

  // ── Colunas/Status personalizados ──
  const openAddCol = () => { setColId(""); setColLabel(""); setColColor(COLS[columns.length % COLS.length]); setMt("col"); };
  const openEditCol = (c) => { setColId(c.id); setColLabel(c.label); setColColor(c.color); setMt("col"); };
  const saveCol = () => {
    if (!colLabel.trim()) return;
    if (colId) { setColumns((p) => p.map((c) => (c.id === colId ? { ...c, label: colLabel.trim(), color: colColor } : c))); flash("Status atualizado!"); }
    else { setColumns((p) => [...p, { id: uid(), label: colLabel.trim(), color: colColor }]); flash("Status criado!"); }
    cl();
  };
  const delCol = (id) => {
    if (columns.length <= 1) { flash("Precisa de ao menos 1 status"); return; }
    const fb = columns.find((c) => c.id !== id).id;
    setTasks((p) => p.map((t) => (t.status === id ? { ...t, status: fb } : t)));
    setColumns((p) => p.filter((c) => c.id !== id));
    flash("Status removido");
  };

  // ── Pomodoro ──
  useEffect(() => {
    if (pmOn) pmRef.current = setInterval(() => setPmSec((s) => Math.max(0, s - 1)), 1000);
    else clearInterval(pmRef.current);
    return () => clearInterval(pmRef.current);
  }, [pmOn]);
  const pomoTransition = () => {
    if (pmMode === "focus") {
      if (pmSubj) setRecords((p) => [...p, { id: uid(), subjectId: pmSubj, date: toK(TODAY), duration: pomo.focus, notes: "Pomodoro" }]);
      const n = pmCount + 1; setPmCount(n);
      const longNext = n % pomo.untilLong === 0;
      setPmMode(longNext ? "long" : "short"); setPmSec((longNext ? pomo.long : pomo.short) * 60);
      flash(pmSubj ? "Foco concluído! Tempo no histórico ☕" : "Foco concluído! Pausa ☕");
    } else { setPmMode("focus"); setPmSec(pomo.focus * 60); flash("Pausa acabou! Bora focar 🎯"); }
  };
  useEffect(() => { if (pmOn && pmSec === 0) pomoTransition(); }, [pmSec, pmOn]); // eslint-disable-line
  const pmReset = () => { setPmOn(false); setPmMode("focus"); setPmSec(pomo.focus * 60); };
  const pmSetMode = (m) => { setPmOn(false); setPmMode(m); setPmSec((m === "focus" ? pomo.focus : m === "short" ? pomo.short : pomo.long) * 60); };

  // ── Cronograma ──
  const DOW = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const gerarCronograma = () => {
    const subs = schSubs.length ? schSubs : subjects.map((s) => s.id);
    if (!subs.length) { flash("Cadastre conteúdos primeiro"); return; }
    if (!schDays.length) { flash("Escolha ao menos 1 dia"); return; }
    const pool = [...subs].sort(() => Math.random() - 0.5);
    let k = 0; const grid = {};
    DOW.filter((d) => schDays.includes(d)).forEach((d) => { grid[d] = []; for (let b = 0; b < schBlocks; b++) { grid[d].push(pool[k % pool.length]); k++; } });
    setSchedule({ grid, days: DOW.filter((d) => schDays.includes(d)), blocks: schBlocks, generatedAt: Date.now() });
    flash("Cronograma gerado!");
  };

  const resetAll = async () => {
    if (!confirmReset) { setConfirmReset(true); setTimeout(() => setConfirmReset(false), 3000); return; }
    const ns = mkSubs(); setSubjects(ns); setRecords([]); setGoals([]); setTasks([]); setColumns(DEFAULT_COLS); setSchedule(null);
    setSec(0); setTOn(false); setTP(false); setTText(""); setTAccum(0); setTStartedAt(null);
    setPmOn(false); setPmMode("focus"); setPmSec(pomo.focus * 60); setPmCount(0);
    setConfirmReset(false); flash("Tudo resetado!");
  };

  const startT = () => {
    if (!tText.trim()) return;
    const found = subjects.find((sub) => sub.name.toLowerCase() === tText.trim().toLowerCase());
    if (!found) {
      const color = COLS[Math.floor(Math.random()*COLS.length)];
      const icons = ["BookOpen","Code","Pen","Target","Beaker","Globe"];
      setSubjects((p) => [...p, { id: uid(), name: tText.trim(), icon: icons[Math.floor(Math.random()*icons.length)], color, category: tCat }]);
      flash(`"${tText.trim()}" criado!`);
    } else setTCat(found.category);
    setTOn(true); setTP(false); setTAccum(0); setTStartedAt(Date.now()); setSec(0);
  };
  const pauseT = () => { setTAccum((a) => a + (tStartedAt ? Math.floor((Date.now()-tStartedAt)/1000) : 0)); setTStartedAt(null); setTP(true); };
  const contT = () => { setTStartedAt(Date.now()); setTP(false); };
  const stopT = () => {
    const mins = Math.max(1, Math.round(sec/60));
    if (sec > 0) {
      const s = subjects.find((sub) => sub.name.toLowerCase() === tText.trim().toLowerCase());
      if (s) { setRecords((p) => [...p, { id: uid(), subjectId: s.id, date: toK(TODAY), duration: mins, notes: "" }]); flash(`Sessão de ${fmtDur(mins)} salva!`); }
    }
    setTOn(false); setTP(false); setSec(0); setTAccum(0); setTStartedAt(null);
  };

  const stepD = (dir) => { const d = new Date(dD); if (dF==="day") d.setDate(d.getDate()+dir); else if (dF==="week") d.setDate(d.getDate()+dir*7); else if (dF==="month") d.setMonth(d.getMonth()+dir); else d.setFullYear(d.getFullYear()+dir); setDD(d); };
  const fLbl = () => { const d = dD; if (dF==="day") return `${pad(d.getDate())} ${MO[d.getMonth()]} ${d.getFullYear()}`; if (dF==="week") { const s=new Date(d); s.setDate(s.getDate()-((s.getDay()+6)%7)); const e=new Date(s); e.setDate(e.getDate()+6); return `${pad(s.getDate())}/${pad(s.getMonth()+1)} – ${pad(e.getDate())}/${pad(e.getMonth()+1)}`; } if (dF==="month") return `${MO[d.getMonth()]} ${d.getFullYear()}`; return `${d.getFullYear()}`; };

  const openRec = (date) => { smDate(date||toK(TODAY)); smSub(subjects[0]?.id||""); smDur("60"); smNotes(""); setMRecCat("all"); setMt("addRec"); };
  const openAddSub = () => { smName(""); smIcon("BookOpen"); smColor("#6366f1"); smCat("estudos"); setMt("addSub"); };
  const openEditSub = (s) => { smId(s.id); smName(s.name); smIcon(s.icon); smColor(s.color); smCat(s.category); setMt("editSub"); };
  const openAddGoal = () => { smTitle(""); smSD(toK(TODAY)); smED(""); smHE(true); smTH(50); smCat("estudos"); setMt("addGoal"); };
  const openEditGoal = (g) => { smId(g.id); smTitle(g.title); smSD(g.startDate); smED(g.endDate||""); smHE(!!g.endDate); smTH(g.targetHours); smCat(g.category); setMt("editGoal"); };
  const openProfile = () => { smPN(profile.name); setMt("profile"); };
  const cl = () => setMt(null);

  const hData = useMemo(() => [...records].sort((a,b)=>b.date.localeCompare(a.date)||b.duration-a.duration).filter((r) => {
    const s = gS(r.subjectId); if (!s) return false;
    if (hC !== "all" && s.category !== hC) return false;
    if (hS !== "all" && r.subjectId !== hS) return false;
    return true;
  }), [records, hC, hS, gS]);

  const rRecs = useMemo(() => {
    const n = TODAY;
    if (rP==="day") return records.filter((r)=>r.date===toK(n));
    if (rP==="week") { const s=new Date(n); s.setDate(s.getDate()-((s.getDay()+6)%7)); const e=new Date(s); e.setDate(e.getDate()+6); return records.filter((r)=>r.date>=toK(s)&&r.date<=toK(e)); }
    if (rP==="month") { const pf=`${n.getFullYear()}-${pad(n.getMonth()+1)}`; return records.filter((r)=>r.date.startsWith(pf)); }
    return records.filter((r)=>r.date.startsWith(`${n.getFullYear()}`));
  }, [records, rP]);
  const rT = useMemo(()=>rRecs.reduce((a,r)=>a+r.duration,0),[rRecs]);
  const rDy = useMemo(()=>[...new Set(rRecs.map((r)=>r.date))].length,[rRecs]);
  const rTrend = useMemo(() => {
    const mp = {}; rRecs.forEach((r)=>{mp[r.date]=(mp[r.date]||0)+r.duration;});
    if (rP==="day") { const bySubj={}; rRecs.forEach((r)=>{const s=gS(r.subjectId); if(s) bySubj[s.name]=(bySubj[s.name]||0)+r.duration;}); const e=Object.entries(bySubj); return e.length>0?e.map(([name,m])=>({date:name.length>12?name.slice(0,12)+"…":name,horas:+(m/60).toFixed(1)})):[{date:"Hoje",horas:0}]; }
    if (rP==="week") { const now=TODAY; const start=new Date(now); start.setDate(start.getDate()-((start.getDay()+6)%7)); return ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"].map((label,i)=>{const d=new Date(start); d.setDate(d.getDate()+i); return {date:label,horas:+((mp[toK(d)]||0)/60).toFixed(1)};}); }
    if (rP==="month") { const y=TODAY.getFullYear(),m=TODAY.getMonth(),dim=new Date(y,m+1,0).getDate(); return Array.from({length:dim},(_,i)=>({date:String(i+1),horas:+((mp[`${y}-${pad(m+1)}-${pad(i+1)}`]||0)/60).toFixed(1)})); }
    const y=TODAY.getFullYear(),mpM={}; rRecs.forEach((r)=>{const mk=r.date.slice(0,7); mpM[mk]=(mpM[mk]||0)+r.duration;}); return MO.map((name,i)=>({date:name.slice(0,3),horas:+((mpM[`${y}-${pad(i+1)}`]||0)/60).toFixed(1)}));
  }, [rRecs, rP, gS]);
  const rTrendLabel = {day:"Detalhamento do Dia",week:"Tendência Semanal (Seg–Dom)",month:`Tendência ${MO[TODAY.getMonth()]}`,year:`Tendência ${TODAY.getFullYear()}`}[rP];
  const rByCat = useMemo(()=>CATS.map((cat)=>{const ids=subjects.filter((s)=>s.category===cat.id).map((s)=>s.id); const mins=rRecs.filter((r)=>ids.includes(r.subjectId)).reduce((a,r)=>a+r.duration,0); return {name:cat.label,horas:+(mins/60).toFixed(1),color:cat.color};}).filter((c)=>c.horas>0),[rRecs,subjects]);
  const rByContent = useMemo(()=>{const mp={}; rRecs.forEach((r)=>{mp[r.subjectId]=(mp[r.subjectId]||0)+r.duration;}); return Object.entries(mp).map(([id,mins])=>{const s=gS(id); return s?{name:s.name.length>20?s.name.slice(0,20)+"…":s.name,horas:+(mins/60).toFixed(1),color:s.color}:null;}).filter(Boolean).sort((a,b)=>b.horas-a.horas).slice(0,8);}, [rRecs,gS]);
  const rTop = useMemo(()=>{const mp={}; rRecs.forEach((r)=>{mp[r.subjectId]=(mp[r.subjectId]||0)+r.duration;}); return Object.entries(mp).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([id,m])=>{const s=gS(id); return s?{...s,mins:m,pct:rT>0?Math.round(m/rT*100):0}:null;}).filter(Boolean);}, [rRecs,rT,gS]);

  const cDIM = new Date(calY, calM+1, 0).getDate(), cFD = new Date(calY, calM, 1).getDay();
  const nav = (p) => { setPg(p); setSb(false); };
  const menus = [{n:"Dashboard",i:LayoutDashboard},{n:"Conteúdos",i:BookOpen},{n:"Tarefas",i:ListTodo},{n:"Quadro",i:Columns3},{n:"Pomodoro",i:Timer},{n:"Cronograma",i:CalendarRange},{n:"Conquistas",i:Trophy},{n:"Histórico",i:Clock},{n:"Relatórios",i:BarChart3},{n:"Configurações",i:Settings},{n:"Sobre",i:Info}];

  const BtnAct = ({ children, color, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled} className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-lg ${color} text-white text-xs font-bold shadow-md transition hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed`}>{children}</button>
  );

  /* ── Sync badge ── */
  const SyncBadge = () => {
    if (syncStatus === "saving") return <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500/10 text-amber-400 text-[10px] font-bold"><Database size={11} className="animate-pulse" />Salvando...</div>;
    if (syncStatus === "saved") return <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold"><Wifi size={11} />Salvo</div>;
    if (syncStatus === "error") return <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-red-500/10 text-red-400 text-[10px] font-bold"><WifiOff size={11} />Offline</div>;
    return null;
  };

  if (!loaded) return (
    <div className={`min-h-screen flex items-center justify-center ${dk ? "bg-gray-950" : "bg-gray-50"}`} style={{fontFamily:"'Outfit',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg animate-pulse"><BookOpen size={22} className="text-white" /></div>
        <p className="text-sm font-semibold text-gray-500">Carregando do Supabase...</p>
        <div className="flex items-center gap-1.5 text-xs text-gray-400"><Database size={13} />Buscando seus dados...</div>
      </div>
    </div>
  );

  return (
    <div className={`${dk?"bg-gray-950 text-gray-100":"bg-gray-50 text-gray-800"} min-h-screen flex transition-colors duration-500`} style={{fontFamily:"'Outfit',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {notif && <div className="fixed top-4 right-4 z-[100]"><div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold shadow-2xl text-xs animate-bounce"><Check size={14}/>{notif}</div></div>}
      {sb && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={()=>setSb(false)}/>}

      {/* SIDEBAR */}
      <aside className={`fixed lg:static z-40 h-full w-56 flex flex-col transition-transform duration-300 ${sb?"translate-x-0":"-translate-x-full lg:translate-x-0"} ${dk?"bg-gray-900 border-r border-white/5":"bg-white border-r border-gray-200/70"} p-4 flex-shrink-0 overflow-y-auto`}>
        <div className="flex items-center gap-2.5 mb-7 px-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30"><BookOpen size={15} className="text-white"/></div>
          <div><p className={`text-sm font-extrabold tracking-tight ${tx}`}>EstudoFlow</p><p className={`text-[9px] ${mu}`}>Controle Pessoal</p></div>
        </div>
        <nav className="flex flex-col gap-0.5 flex-1">
          {menus.map((m)=>(
            <button key={m.n} onClick={()=>nav(m.n)} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${pg===m.n?"bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20":dk?"text-gray-400 hover:text-white hover:bg-white/5":"text-gray-500 hover:text-gray-800 hover:bg-gray-100"}`}>
              <m.i size={16}/>{m.n}
            </button>
          ))}
        </nav>
        <div className="mt-auto space-y-2 pt-3 border-t border-gray-200/50">
          {goals.slice(0,2).map((g)=>{
            const pct=gPct(g),days=gDL(g);
            return (
              <div key={g.id} className={`p-2.5 rounded-lg ${dk?"bg-white/5":"bg-indigo-50/70"}`}>
                <div className="flex items-center justify-between"><p className={`text-[11px] font-bold ${dk?"text-indigo-300":"text-indigo-600"} truncate`}>{g.title}</p>{days!==null&&<span className={`text-[9px] ${mu} ml-1 flex-shrink-0`}>{days}d</span>}</div>
                {g.endDate&&<p className={`text-[9px] ${mu}`}>{g.endDate.split("-").reverse().join("/")}</p>}
                <div className={`w-full h-1 rounded-full mt-1.5 ${dk?"bg-white/10":"bg-indigo-100"}`}><div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all" style={{width:`${pct}%`}}/></div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className={`flex items-center justify-between px-4 md:px-5 py-2.5 ${dk?"border-b border-white/5":"border-b border-gray-200/60"} flex-shrink-0`}>
          <div className="flex items-center gap-2">
            <button onClick={()=>setSb(true)} className={`p-1.5 rounded-lg lg:hidden ${dk?"hover:bg-white/10 text-gray-400":"hover:bg-gray-100 text-gray-500"}`}><Menu size={18}/></button>
            <div>
              <p className={`text-base md:text-lg font-bold ${tx}`}>{pg}</p>
              <p className={`text-[10px] ${mu}`}>{TODAY.toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <SyncBadge/>
            <button onClick={()=>openRec()} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[11px] font-bold shadow-md"><Plus size={13}/><span className="hidden sm:inline">Registro</span></button>
            <button onClick={resetAll} title="Resetar tudo" className={`p-1.5 rounded-lg transition ${dk?"hover:bg-white/10 text-gray-500":"hover:bg-gray-100 text-gray-400"}`}><RotateCcw size={15}/></button>
            <div className={`flex items-center gap-1.5 pl-2 ml-0.5 ${dk?"border-l border-white/10":"border-l border-gray-200"}`}>
              <button onClick={openProfile} className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-sm hover:scale-105 transition-transform">{profile.emoji}</button>
              <span className={`text-xs font-semibold ${tx} hidden md:block`}>{profile.name}</span>
              <button onClick={()=>setDk(!dk)} className={`p-1.5 rounded-lg transition ${dk?"bg-yellow-500/20 text-yellow-400":"bg-indigo-50 text-indigo-500"}`}>{dk?<Sun size={15}/>:<Moon size={15}/>}</button>
              <button onClick={sair} title="Sair" className={`p-1.5 rounded-lg transition ${dk?"hover:bg-red-500/20 text-red-400":"hover:bg-red-50 text-red-500"}`}><LogOut size={15}/></button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto p-4 md:p-5 space-y-4">

            {/* DASHBOARD */}
            {pg==="Dashboard"&&(<>
              <div className={`${cd} rounded-xl p-2.5 flex flex-wrap items-center gap-1.5`}>
                <Filter size={13} className={mu}/>
                {[{k:"day",l:"Dia"},{k:"week",l:"Semana"},{k:"month",l:"Mês"},{k:"year",l:"Ano"}].map((f)=>(
                  <button key={f.k} onClick={()=>{setDF(f.k);setDD(new Date());}} className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${dF===f.k?"bg-indigo-500 text-white shadow":mu}`}>{f.l}</button>
                ))}
                <div className="flex items-center gap-1 ml-auto">
                  <button onClick={()=>stepD(-1)} className={`p-0.5 rounded ${dk?"hover:bg-white/10":"hover:bg-gray-100"}`}><ChevronLeft size={15}/></button>
                  <span className={`text-[11px] font-semibold ${tx} min-w-[110px] text-center`}>{fLbl()}</span>
                  <button onClick={()=>stepD(1)} className={`p-0.5 rounded ${dk?"hover:bg-white/10":"hover:bg-gray-100"}`}><ChevronRight size={15}/></button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className={`lg:col-span-3 ${cd} rounded-xl p-4`}>
                  <p className={`text-[9px] font-bold ${mu} uppercase tracking-widest mb-3`}>Adicionar Estudo Atual</p>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="relative">
                        <input value={tText} onChange={(e)=>{setTText(e.target.value);setTDrop(true);}} onFocus={()=>setTDrop(true)} placeholder="O que você está estudando hoje?" className={ip}/>
                        {tDrop&&(
                          <div className={`absolute left-0 right-0 top-full mt-1 rounded-xl border shadow-xl z-20 max-h-48 overflow-y-auto ${dk?"bg-gray-800 border-white/10":"bg-white border-gray-200"}`}>
                            {subjects.filter((s)=>!tText||s.name.toLowerCase().includes(tText.toLowerCase())).map((s)=>{
                              const Ic=gI(s.icon);
                              return <button key={s.id} onClick={()=>{setTText(s.name);setTCat(s.category);setTDrop(false);}} className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition ${dk?"hover:bg-white/10":"hover:bg-indigo-50"}`}>
                                <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{background:s.color+"18"}}><Ic size={12} style={{color:s.color}}/></div>
                                <span className={`text-xs font-semibold ${tx} truncate`}>{s.name}</span>
                                <span className={`text-[9px] ${mu} ml-auto flex-shrink-0`}>{CATS.find(c=>c.id===s.category)?.label}</span>
                              </button>;
                            })}
                          </div>
                        )}
                        {tDrop&&<div className="fixed inset-0 z-10" onClick={()=>setTDrop(false)}/>}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <BtnAct color="bg-emerald-500" onClick={startT} disabled={tOn&&!tP}><Play size={13}/>Iniciar</BtnAct>
                        <BtnAct color="bg-amber-500" onClick={pauseT} disabled={!tOn||tP}><Pause size={13}/>Pausar</BtnAct>
                        <BtnAct color="bg-blue-500" onClick={contT} disabled={!tP}><SkipForward size={13}/>Continuar</BtnAct>
                        <BtnAct color="bg-red-500" onClick={stopT} disabled={!tOn}><Square size={11}/>Parar</BtnAct>
                        <select value={tCat} onChange={(e)=>setTCat(e.target.value)} className={`${ip} w-auto py-2 text-xs`}>{CATS.map((c)=><option key={c.id} value={c.id}>{c.label}</option>)}</select>
                      </div>
                    </div>
                    <div className="text-center flex-shrink-0 flex flex-col items-center justify-center md:min-w-[180px]">
                      <p className={`text-4xl font-extrabold tracking-tight ${tx}`} style={{fontVariantNumeric:"tabular-nums"}}>{fmtT(sec)}</p>
                      <p className={`text-[10px] mt-0.5 ${mu}`}>{tOn?(tP?"⏸ Pausado":"● Estudando"):"Pronto para começar"}</p>
                      {tOn&&tText&&<p className={`text-[10px] font-semibold mt-0.5 ${dk?"text-indigo-400":"text-indigo-600"}`}>{tText.length>30?tText.slice(0,30)+"…":tText}</p>}
                    </div>
                  </div>
                </div>
                <div className={`lg:col-span-1 ${cd} rounded-xl p-4 flex flex-col items-center justify-center`}>
                  <p className={`text-[9px] font-bold ${mu} uppercase tracking-widest mb-2`}>Meta Principal</p>
                  {goals.length>0?(<>
                    <div className="relative"><Ring pct={gPct(goals[0])} sz={100} sw={8} dk={dk}/><div className="absolute inset-0 flex items-center justify-center"><span className={`text-lg font-extrabold ${tx}`}>{gPct(goals[0])}%</span></div></div>
                    <p className={`text-[11px] mt-1.5 font-bold ${tx} text-center`}>{goals[0].title}</p>
                    {gDL(goals[0])!==null&&<p className={`text-[10px] ${mu}`}>{gDL(goals[0])} dias restantes</p>}
                  </>):<p className={`text-xs ${mu}`}>Sem metas</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  {l:"Total Período",v:fmtDur(tM),i:Clock,g:"from-indigo-500 to-purple-500"},
                  {l:"Média Diária",v:fmtDur(aD),i:TrendingUp,g:"from-emerald-500 to-teal-500"},
                  {l:"Dias Ativos",v:String(uD),i:Calendar,g:"from-blue-500 to-cyan-500"},
                  {l:"Sequência",v:`${streak} dias`,i:Flame,g:"from-amber-500 to-orange-500"},
                ].map((s,i)=>(
                  <div key={i} className={`${cd} rounded-xl p-3 flex items-center gap-2.5`}>
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${s.g} flex items-center justify-center flex-shrink-0 shadow`}><s.i size={16} className="text-white"/></div>
                    <div className="min-w-0"><p className={`text-[10px] ${mu}`}>{s.l}</p><p className={`text-sm font-extrabold ${tx}`}>{s.v}</p></div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className={`md:col-span-2 ${cd} rounded-xl p-4`}>
                  <p className={`text-[9px] font-bold ${mu} uppercase tracking-widest mb-2`}>{dashChartLabel}</p>
                  <ResponsiveContainer width="100%" height={170}>
                    {dF==="month"||dF==="year"?(
                      <AreaChart data={dashChart}><defs><linearGradient id="dg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke={dk?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.05)"} vertical={false}/><XAxis dataKey="day" tick={{fill:dk?"#6b7280":"#9ca3af",fontSize:9}} axisLine={false} tickLine={false}/><YAxis tick={{fill:dk?"#6b7280":"#9ca3af",fontSize:9}} axisLine={false} tickLine={false} unit="h" width={30}/><Tooltip content={<CTip dark={dk}/>} cursor={false}/><Area type="monotone" dataKey="horas" stroke="#6366f1" strokeWidth={2} fill="url(#dg)"/></AreaChart>
                    ):(
                      <BarChart data={dashChart} barCategoryGap="20%"><CartesianGrid strokeDasharray="3 3" stroke={dk?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.05)"} vertical={false}/><XAxis dataKey="day" tick={{fill:dk?"#6b7280":"#9ca3af",fontSize:9}} axisLine={false} tickLine={false}/><YAxis tick={{fill:dk?"#6b7280":"#9ca3af",fontSize:9}} axisLine={false} tickLine={false} unit="h" width={30}/><Tooltip content={<CTip dark={dk}/>} cursor={false}/><Bar dataKey="horas" radius={[6,6,2,2]} fill="#6366f1"/></BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
                <div className={`md:col-span-2 ${cd} rounded-xl p-4`}>
                  <p className={`text-[9px] font-bold ${mu} uppercase tracking-widest mb-2`}>Distribuição por Conteúdo</p>
                  {pD.length>0?(<>
                    <ResponsiveContainer width="100%" height={140}><PieChart><Pie data={pD} cx="50%" cy="50%" innerRadius={35} outerRadius={58} paddingAngle={3} dataKey="value" stroke="none">{pD.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie><Tooltip content={<CTip dark={dk}/>} cursor={false}/></PieChart></ResponsiveContainer>
                    <div className="flex flex-wrap gap-x-2.5 gap-y-0.5 mt-1">{pD.map((s)=><div key={s.name} className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{background:s.color}}/><span className={`text-[9px] ${mu}`}>{s.name}</span></div>)}</div>
                  </>):<p className={`text-xs ${mu} text-center mt-8`}>Sem dados no período</p>}
                </div>
                <div className={`md:col-span-1 ${cd} rounded-xl p-4`}>
                  <p className={`text-[9px] font-bold ${mu} uppercase tracking-widest mb-2`}>Histórico Recente</p>
                  <div className="space-y-1.5">
                    {records.slice(-4).reverse().map((r)=>{const s=gS(r.subjectId); if(!s) return null; const Ic=gI(s.icon); return(
                      <div key={r.id} className={`flex items-center gap-2 p-2 rounded-lg ${dk?"bg-white/[0.03]":"bg-gray-50"}`}>
                        <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{background:s.color+"15"}}><Ic size={12} style={{color:s.color}}/></div>
                        <div className="min-w-0 flex-1"><p className={`text-[11px] font-bold ${tx} truncate`}>{s.name}</p><p className={`text-[9px] ${mu}`}>{fmtDur(r.duration)} · {r.date.split("-").reverse().join("/")}</p></div>
                      </div>
                    );})}
                    {records.length===0&&<p className={`text-[10px] ${mu} text-center py-4`}>Sem registros</p>}
                  </div>
                </div>
              </div>

              <div className={`${cd} rounded-xl p-4`}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <p className={`text-[9px] font-bold ${mu} uppercase tracking-widest`}>Calendário de Estudos</p>
                  <div className="flex items-center gap-2">
                    <button onClick={()=>{if(calM===0){setCalM(11);setCalY(calY-1);}else setCalM(calM-1);}} className={`p-1 rounded-md ${dk?"hover:bg-white/10":"hover:bg-gray-100"}`}><ChevronLeft size={14}/></button>
                    <select value={calM} onChange={(e)=>setCalM(Number(e.target.value))} className={`${ip} w-auto py-1 px-2 text-xs`}>{MO.map((m,i)=><option key={i} value={i}>{m}</option>)}</select>
                    <select value={calY} onChange={(e)=>setCalY(Number(e.target.value))} className={`${ip} w-auto py-1 px-2 text-xs`}>{[2024,2025,2026,2027,2028,2029,2030].map((y)=><option key={y} value={y}>{y}</option>)}</select>
                    <button onClick={()=>{if(calM===11){setCalM(0);setCalY(calY+1);}else setCalM(calM+1);}} className={`p-1 rounded-md ${dk?"hover:bg-white/10":"hover:bg-gray-100"}`}><ChevronRight size={14}/></button>
                    <button onClick={()=>{setCalM(TODAY.getMonth());setCalY(TODAY.getFullYear());}} className={`px-2 py-1 rounded-md text-[10px] font-bold ${dk?"bg-white/5 text-gray-400":"bg-gray-100 text-gray-500"}`}>Hoje</button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {["D","S","T","Q","Q","S","S"].map((d,i)=><div key={i} className={`text-center text-[9px] font-bold ${mu} py-0.5`}>{d}</div>)}
                  {Array.from({length:cFD}).map((_,i)=><div key={`e${i}`}/>)}
                  {Array.from({length:cDIM},(_,i)=>{
                    const dn=i+1,dk2=`${calY}-${pad(calM+1)}-${pad(dn)}`;
                    const dayRecs=records.filter((r)=>r.date===dk2);
                    const mn=dayRecs.reduce((a,r)=>a+r.duration,0);
                    const hr=mn/60,isT=dk2===toK(TODAY);
                    let bg=dk?"bg-white/[0.03] text-gray-600":"bg-gray-50 text-gray-400";
                    if(mn>0) bg=hr>5?"bg-indigo-500 text-white":hr>3?"bg-indigo-400 text-white":hr>1?"bg-indigo-300 text-white":"bg-indigo-200 text-indigo-700";
                    const tip=mn>0?dayRecs.map((r)=>{const s=gS(r.subjectId); return s?`${s.name}: ${fmtDur(r.duration)}`:""}).filter(Boolean).join("\n")+`\nTotal: ${hr.toFixed(1)}h`:"Clique para adicionar";
                    return <button key={dn} onClick={()=>openRec(dk2)} className={`flex items-center justify-center h-8 rounded-lg text-[11px] font-semibold transition hover:scale-105 ${bg} ${isT?"ring-2 ring-indigo-500 ring-offset-1 "+(dk?"ring-offset-gray-950":"ring-offset-gray-50"):""}`} title={tip}>{dn}</button>;
                  })}
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={`text-[9px] ${mu}`}>Menos</span>
                  <div className={`w-2.5 h-2.5 rounded-sm ${dk?"bg-white/[0.03]":"bg-gray-100"}`}/>
                  <div className="w-2.5 h-2.5 rounded-sm bg-indigo-200"/><div className="w-2.5 h-2.5 rounded-sm bg-indigo-300"/><div className="w-2.5 h-2.5 rounded-sm bg-indigo-400"/><div className="w-2.5 h-2.5 rounded-sm bg-indigo-500"/>
                  <span className={`text-[9px] ${mu}`}>Mais</span>
                </div>
              </div>
            </>)}

            {/* CONTEÚDOS */}
            {pg==="Conteúdos"&&(
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className={`text-xs ${mu}`}>{subjects.length} conteúdos</p>
                  <button onClick={openAddSub} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold shadow-md"><Plus size={14}/>Novo</button>
                </div>
                {CATS.map((cat)=>{
                  const sbs=subjects.filter((s)=>s.category===cat.id);
                  if(!sbs.length) return null;
                  return <div key={cat.id}>
                    <div className="flex items-center gap-1.5 mb-2"><cat.icon size={14} style={{color:cat.color}}/><span className={`text-[11px] font-bold ${tx} uppercase tracking-wider`}>{cat.label}</span><span className={`text-[10px] ${mu}`}>({sbs.length})</span></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {sbs.map((sub)=>{const Ic=gI(sub.icon); const tH=(records.filter((r)=>r.subjectId===sub.id).reduce((a,r)=>a+r.duration,0)/60).toFixed(1); return(
                        <div key={sub.id} className={`${cd} rounded-xl p-3 flex items-center gap-3 group`}>
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:sub.color+"15"}}><Ic size={16} style={{color:sub.color}}/></div>
                          <div className="flex-1 min-w-0"><p className={`text-[13px] font-bold ${tx} truncate`}>{sub.name}</p><p className={`text-[10px] ${mu}`}>{tH}h registradas</p></div>
                          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
                            <button onClick={()=>openEditSub(sub)} className={`p-1.5 rounded-md ${dk?"hover:bg-white/10":"hover:bg-gray-100"}`}><Edit3 size={12} className={mu}/></button>
                            <button onClick={()=>delSub(sub.id)} className="p-1.5 rounded-md hover:bg-red-500/10"><Trash2 size={12} className="text-red-400"/></button>
                          </div>
                        </div>
                      );})}
                    </div>
                  </div>;
                })}
              </div>
            )}

            {/* HISTÓRICO */}
            {pg==="Histórico"&&(
              <div className="space-y-3">
                <div className={`${cd} rounded-xl p-2.5 flex flex-wrap gap-2 items-center`}>
                  <Filter size={13} className={mu}/>
                  <select value={hC} onChange={(e)=>{setHC(e.target.value);setHS("all");}} className={`${ip} w-auto text-xs py-2`}><option value="all">Todas categorias</option>{CATS.map((c)=><option key={c.id} value={c.id}>{c.label}</option>)}</select>
                  <select value={hS} onChange={(e)=>setHS(e.target.value)} className={`${ip} w-auto text-xs py-2`}><option value="all">Todos os conteúdos</option>{subjects.filter((s)=>hC==="all"||s.category===hC).map((s)=><option key={s.id} value={s.id}>{s.name}</option>)}</select>
                  <span className={`text-[10px] ${mu} ml-auto`}>{hData.length} registros · {(hData.reduce((a,r)=>a+r.duration,0)/60).toFixed(1)}h</span>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <button onClick={()=>{setHSelMode(!hSelMode);setHSel(new Set());}} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition ${hSelMode?"bg-indigo-500 text-white":dk?"bg-white/5 text-gray-400":"bg-gray-100 text-gray-500"}`}><Edit3 size={12}/>{hSelMode?"Cancelar":"Selecionar"}</button>
                  {hSelMode&&hSel.size>0&&<button onClick={()=>{setRecords(p=>p.filter(r=>!hSel.has(r.id)));flash(`${hSel.size} removidos`);setHSel(new Set());setHSelMode(false);}} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500 text-white text-[11px] font-bold shadow"><Trash2 size={12}/>Deletar {hSel.size}</button>}
                </div>
                {hData.slice(0,50).map((r)=>{const s=gS(r.subjectId); if(!s) return null; const Ic=gI(s.icon); const sel=hSel.has(r.id); return(
                  <div key={r.id} onClick={()=>{if(hSelMode){const n=new Set(hSel); if(n.has(r.id))n.delete(r.id);else n.add(r.id); setHSel(n);}}} className={`${cd} rounded-xl p-3 flex items-center gap-3 group ${hSelMode?"cursor-pointer":""} ${sel?"ring-2 ring-indigo-500":""}`}>
                    {hSelMode&&<div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${sel?"bg-indigo-500 border-indigo-500":dk?"border-white/20":"border-gray-300"}`}>{sel&&<Check size={12} className="text-white"/>}</div>}
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:s.color+"15"}}><Ic size={14} style={{color:s.color}}/></div>
                    <div className="flex-1 min-w-0"><p className={`text-[13px] font-semibold ${tx} truncate`}>{s.name}</p><p className={`text-[9px] ${mu}`}>{r.date.split("-").reverse().join("/")} {r.notes&&`· ${r.notes}`}</p></div>
                    <p className={`text-xs font-bold ${tx} flex-shrink-0`}>{fmtDur(r.duration)}</p>
                    {!hSelMode&&<button onClick={()=>delRec(r.id)} className="p-1 rounded-md hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition flex-shrink-0"><Trash2 size={12} className="text-red-400"/></button>}
                  </div>
                );})}
                {hData.length===0&&<p className={`text-center py-10 ${mu} text-sm`}>Nenhum registro</p>}
              </div>
            )}

            {/* RELATÓRIOS */}
            {pg==="Relatórios"&&(
              <div className="space-y-4">
                <div className={`${cd} rounded-xl p-2.5 flex flex-wrap gap-2 items-center`}>
                  <BarChart3 size={13} className={mu}/>
                  {[{k:"day",l:"Diário"},{k:"week",l:"Semanal"},{k:"month",l:"Mensal"},{k:"year",l:"Anual"}].map((p)=>(
                    <button key={p.k} onClick={()=>setRP(p.k)} className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${rP===p.k?"bg-indigo-500 text-white shadow":mu}`}>{p.l}</button>
                  ))}
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[{l:"Total",v:fmtDur(rT),i:Clock,g:"from-indigo-500 to-purple-500"},{l:"Sessões",v:String(rRecs.length),i:FileText,g:"from-blue-500 to-cyan-500"},{l:"Dias Ativos",v:String(rDy),i:Calendar,g:"from-emerald-500 to-teal-500"},{l:"Média/Dia",v:rDy>0?fmtDur(Math.round(rT/rDy)):"—",i:TrendingUp,g:"from-amber-500 to-orange-500"}].map((s,i)=>(
                    <div key={i} className={`${cd} rounded-xl p-3 flex items-center gap-2.5`}>
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${s.g} flex items-center justify-center flex-shrink-0 shadow`}><s.i size={16} className="text-white"/></div>
                      <div className="min-w-0"><p className={`text-[10px] ${mu}`}>{s.l}</p><p className={`text-sm font-extrabold ${tx}`}>{s.v}</p></div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className={`${cd} rounded-xl p-4`}>
                    <p className={`text-[9px] font-bold ${mu} uppercase tracking-widest mb-2`}>{rTrendLabel}</p>
                    <ResponsiveContainer width="100%" height={180}>
                      {rP==="day"?(
                        <BarChart data={rTrend} barCategoryGap="20%"><CartesianGrid strokeDasharray="3 3" stroke={dk?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.05)"} vertical={false}/><XAxis dataKey="date" tick={{fill:dk?"#6b7280":"#9ca3af",fontSize:9}} axisLine={false} tickLine={false}/><YAxis tick={{fill:dk?"#6b7280":"#9ca3af",fontSize:9}} axisLine={false} tickLine={false} unit="h" width={30}/><Tooltip content={<CTip dark={dk}/>} cursor={false}/><Bar dataKey="horas" radius={[6,6,2,2]} fill="#6366f1"/></BarChart>
                      ):(
                        <AreaChart data={rTrend}><defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke={dk?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.05)"} vertical={false}/><XAxis dataKey="date" tick={{fill:dk?"#6b7280":"#9ca3af",fontSize:9}} axisLine={false} tickLine={false}/><YAxis tick={{fill:dk?"#6b7280":"#9ca3af",fontSize:9}} axisLine={false} tickLine={false} unit="h" width={30}/><Tooltip content={<CTip dark={dk}/>} cursor={false}/><Area type="monotone" dataKey="horas" stroke="#6366f1" strokeWidth={2} fill="url(#ag)"/></AreaChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                  <div className={`${cd} rounded-xl p-4`}>
                    <div className="flex items-center gap-2 mb-2">
                      <p className={`text-[9px] font-bold ${mu} uppercase tracking-widest`}>{rCatView==="cat"?"Por Categoria":"Por Conteúdo"}</p>
                      <div className="flex ml-auto">
                        <button onClick={()=>setRCatView("cat")} className={`px-2 py-0.5 rounded-l-md text-[9px] font-bold transition ${rCatView==="cat"?"bg-indigo-500 text-white":dk?"bg-white/5 text-gray-500":"bg-gray-100 text-gray-400"}`}>Categoria</button>
                        <button onClick={()=>setRCatView("content")} className={`px-2 py-0.5 rounded-r-md text-[9px] font-bold transition ${rCatView==="content"?"bg-indigo-500 text-white":dk?"bg-white/5 text-gray-500":"bg-gray-100 text-gray-400"}`}>Conteúdo</button>
                      </div>
                    </div>
                    {rCatView==="cat"?(
                      rByCat.length>0?<ResponsiveContainer width="100%" height={180}><BarChart data={rByCat} layout="vertical" barSize={16}><CartesianGrid strokeDasharray="3 3" stroke={dk?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.05)"} horizontal={false}/><XAxis type="number" tick={{fill:dk?"#6b7280":"#9ca3af",fontSize:9}} axisLine={false} tickLine={false} unit="h"/><YAxis type="category" dataKey="name" tick={{fill:dk?"#6b7280":"#9ca3af",fontSize:10}} axisLine={false} tickLine={false} width={100}/><Tooltip content={<CTip dark={dk}/>} cursor={false}/><Bar dataKey="horas" radius={[0,6,6,0]}>{rByCat.map((e,i)=><Cell key={i} fill={e.color}/>)}</Bar></BarChart></ResponsiveContainer>:<p className={`text-xs ${mu} text-center mt-8`}>Sem dados</p>
                    ):(
                      rByContent.length>0?<ResponsiveContainer width="100%" height={Math.max(180,rByContent.length*30)}><BarChart data={rByContent} layout="vertical" barSize={14}><CartesianGrid strokeDasharray="3 3" stroke={dk?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.05)"} horizontal={false}/><XAxis type="number" tick={{fill:dk?"#6b7280":"#9ca3af",fontSize:9}} axisLine={false} tickLine={false} unit="h"/><YAxis type="category" dataKey="name" tick={{fill:dk?"#6b7280":"#9ca3af",fontSize:9}} axisLine={false} tickLine={false} width={120}/><Tooltip content={<CTip dark={dk}/>} cursor={false}/><Bar dataKey="horas" radius={[0,6,6,0]}>{rByContent.map((e,i)=><Cell key={i} fill={e.color}/>)}</Bar></BarChart></ResponsiveContainer>:<p className={`text-xs ${mu} text-center mt-8`}>Sem dados</p>
                    )}
                  </div>
                </div>
                <div className={`${cd} rounded-xl p-4`}>
                  <p className={`text-[9px] font-bold ${mu} uppercase tracking-widest mb-2`}>Top Conteúdos</p>
                  <div className="space-y-2">
                    {rTop.map((s)=>{const Ic=gI(s.icon); return(
                      <div key={s.id} className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{background:s.color+"15"}}><Ic size={12} style={{color:s.color}}/></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5"><span className={`text-[11px] font-bold ${tx} truncate`}>{s.name}</span><span className={`text-[9px] ${mu} flex-shrink-0 ml-2`}>{fmtDur(s.mins)} ({s.pct}%)</span></div>
                          <div className={`w-full h-1 rounded-full ${dk?"bg-white/10":"bg-gray-200"}`}><div className="h-full rounded-full transition-all" style={{width:`${s.pct}%`,background:s.color}}/></div>
                        </div>
                      </div>
                    );})}
                    {rTop.length===0&&<p className={`text-xs ${mu} text-center py-4`}>Sem dados</p>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={()=>setPrintMode("report")} className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition ${dk?"bg-white/5 text-gray-300 hover:bg-white/10":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}><Printer size={14}/>Gerar Relatório PDF</button>
                  <button onClick={()=>setPrintMode("cert")} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold shadow-md"><Award size={14}/>Gerar Certificado</button>
                </div>
              </div>
            )}

            {/* CONFIGURAÇÕES */}
            {pg==="Configurações"&&(
              <div className="space-y-4 max-w-2xl">
                <div className={`${cd} rounded-xl p-4`}>
                  <p className={`text-[9px] font-bold ${mu} uppercase tracking-widest mb-3`}>Perfil</p>
                  <div className="flex items-center gap-3">
                    <button onClick={()=>setMt("avatar")} className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-xl hover:scale-105 transition shadow-lg">{profile.emoji}</button>
                    <div className="flex-1"><label className={`text-[9px] ${mu} mb-0.5 block`}>Nome</label><input value={profile.name} onChange={(e)=>setProfile((p)=>({...p,name:e.target.value}))} className={ip}/></div>
                  </div>
                </div>
                {/* CONTA */}
                <div className={`${cd} rounded-xl p-4`}>
                  <p className={`text-[9px] font-bold ${mu} uppercase tracking-widest mb-3`}>Conta</p>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-base flex-shrink-0">{profile.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[12px] font-bold ${tx} truncate`}>{profile.name}</p>
                      <p className={`text-[10px] ${mu} truncate`}>{user?.email}</p>
                    </div>
                    <button onClick={sair} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition bg-red-500/10 text-red-500 hover:bg-red-500/20"><LogOut size={13}/>Sair</button>
                  </div>
                  <div className={`border-t pt-3 ${dk?"border-white/10":"border-gray-100"}`}>
                    <div className="flex items-center gap-1.5 mb-2"><KeyRound size={13} className="text-indigo-400"/><p className={`text-[11px] font-bold ${tx}`}>Alterar senha</p></div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input type="password" value={npw1} onChange={(e)=>setNpw1(e.target.value)} placeholder="Nova senha" className={`${ip} sm:flex-1`}/>
                      <input type="password" value={npw2} onChange={(e)=>setNpw2(e.target.value)} placeholder="Confirmar" className={`${ip} sm:flex-1`}/>
                      <button onClick={mudarSenha} disabled={pwBusy} className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow disabled:opacity-50 flex-shrink-0"><Save size={13}/>Salvar</button>
                    </div>
                  </div>
                </div>
                {/* DADOS */}
                <div className={`${cd} rounded-xl p-4`}>
                  <div className="flex items-center gap-3 mb-2">
                    <Database size={14} className="text-indigo-400"/>
                    <div className="flex-1">
                      <p className={`text-[11px] font-bold ${tx}`}>Sincronização na nuvem</p>
                      <p className={`text-[9px] ${mu}`}>Dados privados, isolados por conta</p>
                    </div>
                    <div className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${syncStatus==="error"?"bg-red-500/15 text-red-400":"bg-emerald-500/15 text-emerald-400"}`}>{syncStatus==="error"?"Offline":"Online"}</div>
                  </div>
                  <p className={`text-[10px] ${mu} mb-3`}>Tudo é salvo automaticamente a cada alteração.</p>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={async()=>{ setSyncStatus("saving"); try { const d=await loadUserData(user.id); if(d&&d.subjects){ setSubjects(d.subjects); setRecords(d.records||[]); setGoals(d.goals||[]); if(d.profile)setProfile(d.profile); if(typeof d.dark==="boolean")setDk(d.dark);} setSyncStatus("saved"); flash("Dados recarregados!"); } catch{ setSyncStatus("error"); flash("Falha ao recarregar"); } }} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition ${dk?"bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30":"bg-indigo-50 text-indigo-600 hover:bg-indigo-100"}`}><RotateCcw size={13}/>Recarregar</button>
                    <button onClick={()=>{ const json=JSON.stringify({subjects,records,goals,profile,dark:dk}); if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(json).then(()=>flash("Backup copiado!")).catch(()=>flash("Não foi possível copiar")); } else flash("Clipboard indisponível"); }} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition ${dk?"bg-white/5 text-gray-300 hover:bg-white/10":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}><Download size={13}/>Copiar backup</button>
                  </div>
                </div>
                <div className={`${cd} rounded-xl p-4`}>
                  <div className="flex items-center justify-between mb-3">
                    <p className={`text-[9px] font-bold ${mu} uppercase tracking-widest`}>Metas</p>
                    <button onClick={openAddGoal} className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow"><Plus size={12}/>Nova</button>
                  </div>
                  <div className="space-y-2.5">
                    {goals.map((g)=>{const pct=gPct(g),days=gDL(g),ci=CATS.find((c)=>c.id===g.category); return(
                      <div key={g.id} className={`p-3 rounded-lg ${dk?"bg-white/[0.04]":"bg-gray-50"} group`}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5 min-w-0">{ci&&<ci.icon size={12} style={{color:ci.color}}/>}<span className={`text-[12px] font-bold ${tx} truncate`}>{g.title}</span></div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {days!==null?<span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${days<=7?"bg-red-500/15 text-red-400":"bg-indigo-500/15 text-indigo-400"}`}>{days}d</span>:<span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">Sem prazo</span>}
                            <button onClick={()=>openEditGoal(g)} className="p-1 rounded opacity-0 group-hover:opacity-100 transition"><Edit3 size={11} className={mu}/></button>
                            <button onClick={()=>delGoal(g.id)} className="p-1 rounded opacity-0 group-hover:opacity-100 transition"><Trash2 size={11} className="text-red-400"/></button>
                          </div>
                        </div>
                        <div className={`w-full h-1.5 rounded-full ${dk?"bg-white/10":"bg-gray-200"}`}><div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all" style={{width:`${pct}%`}}/></div>
                      </div>
                    );})}
                    {goals.length===0&&<p className={`text-xs ${mu} text-center py-4`}>Nenhuma meta</p>}
                  </div>
                </div>
                <div className={`${cd} rounded-xl p-4`}>
                  <p className={`text-[9px] font-bold ${mu} uppercase tracking-widest mb-2`}>Aparência</p>
                  <div className="flex gap-2.5">
                    <button onClick={()=>setDk(false)} className={`flex-1 p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition ${!dk?"border-indigo-500 bg-indigo-50":"border-transparent"}`}><Sun size={16} className={!dk?"text-indigo-600":mu}/><span className={`text-[11px] font-bold ${tx}`}>Claro</span></button>
                    <button onClick={()=>setDk(true)} className={`flex-1 p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition ${dk?"border-indigo-500 bg-indigo-500/10":"border-transparent"}`}><Moon size={16} className={dk?"text-indigo-400":mu}/><span className={`text-[11px] font-bold ${tx}`}>Escuro</span></button>
                  </div>
                </div>
                <div className={`${cd} rounded-xl p-4`}>
                  <p className={`text-[9px] font-bold ${mu} uppercase tracking-widest mb-2`}>Zona de Perigo</p>
                  <button onClick={resetAll} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition ${confirmReset?"bg-red-500 text-white animate-pulse":"bg-red-500/10 text-red-400 hover:bg-red-500/20"}`}><RotateCcw size={13}/>{confirmReset?"Clique de novo para confirmar!":"Resetar todos os dados"}</button>
                </div>
              </div>
            )}

            {/* TAREFAS (LISTA) */}
            {pg==="Tarefas"&&(
              <div className="space-y-3 max-w-3xl">
                <div className={`${cd} rounded-xl p-3 flex flex-col sm:flex-row gap-2`}>
                  <input value={quickTask} onChange={(e)=>setQuickTask(e.target.value)} onKeyDown={(e)=>{if(e.key==='Enter'){addTask(quickTask);setQuickTask("");}}} placeholder="Adicionar tarefa e apertar Enter..." className={`${ip} flex-1`}/>
                  <button onClick={()=>{addTask(quickTask);setQuickTask("");}} className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold shadow flex-shrink-0"><Plus size={14}/>Adicionar</button>
                  <button onClick={()=>openAddTask()} className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-bold flex-shrink-0 ${dk?"bg-white/5 text-gray-300 hover:bg-white/10":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}><Edit3 size={13}/>Detalhada</button>
                </div>
                <div className="flex flex-wrap gap-1.5 items-center">
                  {[{k:"all",l:"Todas"},...columns.map((c)=>({k:c.id,l:c.label})),{k:"archived",l:`Arquivadas${tasks.filter((t)=>t.archived).length?` (${tasks.filter((t)=>t.archived).length})`:""}`}].map((f)=>(
                    <button key={f.k} onClick={()=>setTaskFilter(f.k)} className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${taskFilter===f.k?"bg-indigo-500 text-white shadow":mu}`}>{f.l}</button>
                  ))}
                  <span className={`text-[10px] ${mu} ml-auto`}>{tasks.filter((t)=>!t.archived).length} tarefas · {tasks.filter((t)=>t.status===lastCol()&&!t.archived).length} concluídas</span>
                </div>
                <div className="space-y-2">
                  {tasks.filter((t)=>taskFilter==='archived'?t.archived:(!t.archived&&(taskFilter==='all'||t.status===taskFilter))).sort((a,b)=>{const pr={alta:0,media:1,baixa:2}; return ((a.status===lastCol())-(b.status===lastCol()))||((pr[a.priority]??1)-(pr[b.priority]??1));}).map((t)=>{
                    const s=t.subjectId?gS(t.subjectId):null; const done=t.status===lastCol(); const overdue=t.due&&t.due<toK(TODAY)&&!done; const st=colOf(t.status);
                    return (
                      <div key={t.id} className={`${cd} rounded-xl p-3 flex items-center gap-3 group`}>
                        <button onClick={()=>setTaskStatus(t,done?firstCol():lastCol())} className="flex-shrink-0">{done?<CheckCircle2 size={20} className="text-emerald-500"/>:<Circle size={20} className={mu}/>}</button>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[13px] font-semibold truncate ${done?"line-through "+mu:tx}`}>{t.title}</p>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{background:(PRIOS[t.priority]||PRIOS.media).c+"22",color:(PRIOS[t.priority]||PRIOS.media).c}}>{(PRIOS[t.priority]||PRIOS.media).l}</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{background:st.color+"22",color:st.color}}>{st.label}</span>
                            {t.due&&<span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${overdue?"bg-red-500/15 text-red-500":dk?"bg-white/5 text-gray-400":"bg-gray-100 text-gray-500"}`}><CalendarDays size={9}/>{t.due.split("-").reverse().join("/")}</span>}
                            {s&&<span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-1" style={{background:s.color+"18",color:s.color}}><span className="w-1.5 h-1.5 rounded-full" style={{background:s.color}}/>{s.name}</span>}
                            {t.recurrence&&t.recurrence!=='none'&&<span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 bg-indigo-500/15 text-indigo-500"><Repeat size={9}/>{({daily:'Diária',weekly:'Semanal',monthly:'Mensal'})[t.recurrence]}</span>}
                            {t.checklist&&t.checklist.length>0&&<span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${dk?"bg-white/5 text-gray-400":"bg-gray-100 text-gray-500"}`}><CheckCircle2 size={9}/>{t.checklist.filter((c)=>c.done).length}/{t.checklist.length}</span>}
                            {(t.usedMin||t.estMin)&&<span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${dk?"bg-white/5 text-gray-400":"bg-gray-100 text-gray-500"}`}><Hourglass size={9}/>{t.usedMin?fmtDur(parseInt(t.usedMin)):"~"+fmtDur(parseInt(t.estMin))}</span>}
                          </div>
                        </div>
                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
                          {t.archived
                            ? <button onClick={()=>toggleArchive(t.id,false)} title="Restaurar" className={`p-1.5 rounded-md ${dk?"hover:bg-white/10":"hover:bg-gray-100"}`}><ArchiveRestore size={12} className="text-emerald-500"/></button>
                            : <button onClick={()=>toggleArchive(t.id,true)} title="Arquivar" className={`p-1.5 rounded-md ${dk?"hover:bg-white/10":"hover:bg-gray-100"}`}><Archive size={12} className={mu}/></button>}
                          <button onClick={()=>openEditTask(t)} className={`p-1.5 rounded-md ${dk?"hover:bg-white/10":"hover:bg-gray-100"}`}><Edit3 size={12} className={mu}/></button>
                          <button onClick={()=>delTask(t.id)} className="p-1.5 rounded-md hover:bg-red-500/10"><Trash2 size={12} className="text-red-400"/></button>
                        </div>
                      </div>
                    );
                  })}
                  {tasks.filter((t)=>taskFilter==='archived'?t.archived:(!t.archived&&(taskFilter==='all'||t.status===taskFilter))).length===0&&(
                    <div className={`${cd} rounded-xl p-10 text-center`}>
                      {taskFilter==='archived'?<Archive size={32} className={`mx-auto mb-2 ${mu}`}/>:<ListTodo size={32} className={`mx-auto mb-2 ${mu}`}/>}
                      <p className={`text-sm font-bold ${tx}`}>{taskFilter==='archived'?"Nenhuma tarefa arquivada":"Nenhuma tarefa por aqui"}</p>
                      <p className={`text-xs ${mu}`}>{taskFilter==='archived'?"As tarefas que você arquivar aparecem aqui":"Adicione sua primeira tarefa acima 👆"}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* QUADRO (KANBAN) */}
            {pg==="Quadro"&&(
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className={`text-xs ${mu}`}>Arraste os cards entre as colunas (ou use as setas ◂ ▸ no celular).</p>
                  <div className="flex gap-2">
                    <button onClick={openAddCol} className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold transition ${dk?"bg-white/5 text-gray-300 hover:bg-white/10":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}><Columns3 size={14}/>Novo status</button>
                    <button onClick={()=>openAddTask()} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold shadow"><Plus size={14}/>Nova tarefa</button>
                  </div>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {columns.map((col)=>{
                    const items=tasks.filter((t)=>t.status===col.id&&!t.archived); const ci=columns.findIndex((c)=>c.id===col.id);
                    return (
                      <div key={col.id} onDragOver={(e)=>e.preventDefault()} onDrop={()=>{ if(dragColId){reorderCol(dragColId,col.id);setDragColId(null);} else if(dragId){const tk=tasks.find((x)=>x.id===dragId); if(tk)setTaskStatus(tk,col.id); setDragId(null);} }} className={`group rounded-xl p-3 min-h-[140px] w-[270px] flex-shrink-0 transition ${dk?"bg-white/[0.03] border border-white/[0.06]":"bg-gray-100/70 border border-gray-200/60"} ${dragColId===col.id?"opacity-40":""} ${dragColId&&dragColId!==col.id?"ring-2 ring-indigo-400/50":""}`}>
                        <div className="flex items-center justify-between mb-3 px-1">
                          <div draggable onDragStart={(e)=>{e.stopPropagation();setDragColId(col.id);}} onDragEnd={()=>setDragColId(null)} title="Arraste para reordenar" className="flex items-center gap-1.5 min-w-0 cursor-grab active:cursor-grabbing select-none"><GripVertical size={13} className={`${mu} flex-shrink-0`}/><span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:col.color}}/><p className={`text-[12px] font-bold ${tx} truncate`}>{col.label}</p><span className={`text-[10px] ${mu} flex-shrink-0`}>{items.length}</span></div>
                          <div className="flex items-center gap-0.5 flex-shrink-0">
                            <button disabled={ci===0} onClick={()=>moveCol(col.id,-1)} title="Mover para a esquerda" className={`p-1 rounded opacity-0 group-hover:opacity-100 transition disabled:opacity-0 ${dk?"hover:bg-white/10 text-gray-400":"hover:bg-white text-gray-500"}`}><ChevronLeft size={13}/></button>
                            <button disabled={ci===columns.length-1} onClick={()=>moveCol(col.id,1)} title="Mover para a direita" className={`p-1 rounded opacity-0 group-hover:opacity-100 transition disabled:opacity-0 ${dk?"hover:bg-white/10 text-gray-400":"hover:bg-white text-gray-500"}`}><ChevronRight size={13}/></button>
                            <button onClick={()=>openAddTask(col.id)} title="Nova tarefa" className={`p-1 rounded ${dk?"hover:bg-white/10 text-gray-400":"hover:bg-white text-gray-500"}`}><Plus size={14}/></button>
                            <button onClick={()=>openEditCol(col)} title="Editar status" className={`p-1 rounded opacity-0 group-hover:opacity-100 transition ${dk?"hover:bg-white/10 text-gray-400":"hover:bg-white text-gray-500"}`}><Edit3 size={12}/></button>
                            <button onClick={()=>delCol(col.id)} title="Excluir status" className="p-1 rounded opacity-0 group-hover:opacity-100 transition hover:bg-red-500/10 text-red-400"><Trash2 size={12}/></button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {items.map((t)=>{
                            const s=t.subjectId?gS(t.subjectId):null; const overdue=t.due&&t.due<toK(TODAY)&&col.id!==lastCol();
                            return (
                              <div key={t.id} draggable onDragStart={()=>setDragId(t.id)} onDragEnd={()=>setDragId(null)} className={`rounded-lg p-3 cursor-grab active:cursor-grabbing group/card ${dk?"bg-gray-900 border border-white/10":"bg-white border border-gray-200 shadow-sm"} ${dragId===t.id?"opacity-40":""}`} style={{borderLeft:`3px solid ${(PRIOS[t.priority]||PRIOS.media).c}`}}>
                                <div className="flex items-start gap-1.5">
                                  <GripVertical size={13} className={`${mu} mt-0.5 flex-shrink-0 hidden md:block`}/>
                                  <p className={`text-[12px] font-semibold leading-snug flex-1 ${col.id===lastCol()?"line-through "+mu:tx}`}>{t.title}</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-1 mt-2">
                                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{background:(PRIOS[t.priority]||PRIOS.media).c+"22",color:(PRIOS[t.priority]||PRIOS.media).c}}>{(PRIOS[t.priority]||PRIOS.media).l}</span>
                                  {t.due&&<span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${overdue?"bg-red-500/15 text-red-500":dk?"bg-white/5 text-gray-400":"bg-gray-100 text-gray-500"}`}><CalendarDays size={8}/>{t.due.split("-").reverse().join("/")}</span>}
                                  {t.recurrence&&t.recurrence!=='none'&&<span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 bg-indigo-500/15 text-indigo-500"><Repeat size={8}/></span>}
                                  {t.checklist&&t.checklist.length>0&&<span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${dk?"bg-white/5 text-gray-400":"bg-gray-100 text-gray-500"}`}><CheckCircle2 size={8}/>{t.checklist.filter((c)=>c.done).length}/{t.checklist.length}</span>}
                                  {(t.usedMin||t.estMin)&&<span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${dk?"bg-white/5 text-gray-400":"bg-gray-100 text-gray-500"}`}><Hourglass size={8}/>{t.usedMin?fmtDur(parseInt(t.usedMin)):"~"+fmtDur(parseInt(t.estMin))}</span>}
                                  {s&&<span className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full" style={{background:s.color+"18",color:s.color}}>{s.name.length>12?s.name.slice(0,12)+"…":s.name}</span>}
                                </div>
                                <div className="flex items-center gap-0.5 mt-2 pt-2 border-t border-dashed opacity-60 group-hover/card:opacity-100 transition" style={{borderColor:dk?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.08)"}}>
                                  <button disabled={ci===0} onClick={()=>moveTask(t,-1)} className={`p-1 rounded disabled:opacity-20 ${dk?"hover:bg-white/10":"hover:bg-gray-100"}`}><ChevronLeft size={13} className={mu}/></button>
                                  <button disabled={ci===columns.length-1} onClick={()=>moveTask(t,1)} className={`p-1 rounded disabled:opacity-20 ${dk?"hover:bg-white/10":"hover:bg-gray-100"}`}><ChevronRight size={13} className={mu}/></button>
                                  <button onClick={()=>toggleArchive(t.id,true)} title="Arquivar" className={`p-1 rounded ml-auto ${dk?"hover:bg-white/10":"hover:bg-gray-100"}`}><Archive size={12} className={mu}/></button>
                                  <button onClick={()=>openEditTask(t)} className={`p-1 rounded ${dk?"hover:bg-white/10":"hover:bg-gray-100"}`}><Edit3 size={12} className={mu}/></button>
                                  <button onClick={()=>delTask(t.id)} className="p-1 rounded hover:bg-red-500/10"><Trash2 size={12} className="text-red-400"/></button>
                                </div>
                              </div>
                            );
                          })}
                          {items.length===0&&<div className={`text-center py-6 text-[11px] rounded-lg border-2 border-dashed ${mu} ${dk?"border-white/10":"border-gray-200"}`}>Solte aqui</div>}
                        </div>
                      </div>
                    );
                  })}
                  <button onClick={openAddCol} className={`flex-shrink-0 w-[120px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition self-start min-h-[140px] ${dk?"border-white/10 text-gray-400 hover:bg-white/5":"border-gray-300 text-gray-500 hover:bg-gray-50"}`}><Plus size={20}/>Novo status</button>
                </div>
              </div>
            )}

            {/* POMODORO */}
            {pg==="Pomodoro"&&(
              <div className="max-w-md mx-auto space-y-4">
                <div className={`${cd} rounded-2xl p-6 text-center`}>
                  <div className="flex justify-center gap-1.5 mb-5">
                    {[{k:'focus',l:'Foco'},{k:'short',l:'Pausa'},{k:'long',l:'Pausa longa'}].map((m)=>(
                      <button key={m.k} onClick={()=>pmSetMode(m.k)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${pmMode===m.k?"bg-indigo-500 text-white shadow":dk?"bg-white/5 text-gray-400":"bg-gray-100 text-gray-500"}`}>{m.l}</button>
                    ))}
                  </div>
                  <p className="text-6xl md:text-7xl font-extrabold tracking-tight" style={{fontVariantNumeric:'tabular-nums',color:pmMode==='focus'?'#6366f1':'#10b981'}}>{pad(Math.floor(pmSec/60))}:{pad(pmSec%60)}</p>
                  <p className={`text-xs ${mu} mt-1`}>{pmMode==='focus'?(pmOn?'● Focando':'Pronto para focar'):(pmOn?'☕ Em pausa':'Pausa')} · {pmCount} ciclos</p>
                  <div className="flex justify-center gap-2 mt-5">
                    {!pmOn
                      ? <button onClick={()=>setPmOn(true)} className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-sm shadow hover:brightness-110"><Play size={15}/>Iniciar</button>
                      : <button onClick={()=>setPmOn(false)} className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-sm shadow hover:brightness-110"><Pause size={15}/>Pausar</button>}
                    <button onClick={pmSkip} className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-bold ${dk?"bg-white/5 text-gray-300 hover:bg-white/10":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}><SkipForward size={15}/>Pular</button>
                    <button onClick={pmReset} className={`flex items-center justify-center px-3 py-2.5 rounded-xl text-sm font-bold ${dk?"bg-white/5 text-gray-300 hover:bg-white/10":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}><RotateCcw size={15}/></button>
                  </div>
                </div>
                <div className={`${cd} rounded-xl p-4`}>
                  <p className={`text-[9px] font-bold ${mu} uppercase tracking-widest mb-2 flex items-center gap-1`}><Coffee size={11}/>Vincular a um conteúdo (lança no histórico ao concluir o foco)</p>
                  <select value={pmSubj} onChange={(e)=>setPmSubj(e.target.value)} className={ip}><option value="">— Não registrar —</option>{subjects.map((s)=><option key={s.id} value={s.id}>{s.name}</option>)}</select>
                </div>
                <div className={`${cd} rounded-xl p-4`}>
                  <p className={`text-[9px] font-bold ${mu} uppercase tracking-widest mb-3`}>Tempos (min)</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[{k:'focus',l:'Foco'},{k:'short',l:'Pausa curta'},{k:'long',l:'Pausa longa'},{k:'untilLong',l:'Ciclos p/ pausa longa'}].map((f)=>(
                      <div key={f.k}><label className={`text-[10px] ${mu} mb-0.5 block`}>{f.l}</label>
                        <input type="number" min="1" value={pomo[f.k]} onChange={(e)=>{const v=Math.max(1,parseInt(e.target.value)||1); setPomo((p)=>({...p,[f.k]:v})); if(!pmOn&&((f.k==='focus'&&pmMode==='focus')||(f.k==='short'&&pmMode==='short')||(f.k==='long'&&pmMode==='long'))) setPmSec(v*60);}} className={ip}/>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CRONOGRAMA */}
            {pg==="Cronograma"&&(
              <div className="space-y-4">
                <div className={`${cd} rounded-xl p-4`}>
                  <p className={`text-[9px] font-bold ${mu} uppercase tracking-widest mb-3`}>Gerar cronograma da semana</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {DOW.map((d)=>(
                      <button key={d} onClick={()=>setSchDays((p)=>p.includes(d)?p.filter((x)=>x!==d):[...p,d])} className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${schDays.includes(d)?"bg-indigo-500 text-white":dk?"bg-white/5 text-gray-400":"bg-gray-100 text-gray-500"}`}>{d}</button>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-end gap-3">
                    <div><label className={`text-[10px] ${mu} mb-0.5 block`}>Blocos por dia</label><input type="number" min="1" max="8" value={schBlocks} onChange={(e)=>setSchBlocks(Math.max(1,Math.min(8,parseInt(e.target.value)||1)))} className={`${ip} w-28`}/></div>
                    <button onClick={gerarCronograma} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-bold shadow"><Zap size={15}/>Gerar</button>
                    {schedule&&<button onClick={()=>setSchedule(null)} className={`px-3 py-2.5 rounded-xl text-sm font-bold ${dk?"bg-white/5 text-gray-300":"bg-gray-100 text-gray-600"}`}>Limpar</button>}
                  </div>
                  <p className={`text-[10px] ${mu} mt-2`}>Distribui os conteúdos (sorteados) nos dias escolhidos.</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {subjects.map((s)=>{const on=schSubs.includes(s.id); return (
                      <button key={s.id} onClick={()=>setSchSubs((p)=>p.includes(s.id)?p.filter((x)=>x!==s.id):[...p,s.id])} className="text-[10px] font-semibold px-2 py-0.5 rounded-full border transition" style={on?{background:s.color,color:'#fff',borderColor:s.color}:{borderColor:s.color,color:s.color}}>{s.name}</button>
                    );})}
                  </div>
                  {schSubs.length>0&&<p className={`text-[9px] ${mu} mt-1`}>{schSubs.length} selecionados (vazio = todos)</p>}
                </div>
                {schedule?(
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {schedule.days.map((d)=>(
                      <div key={d} className={`${cd} rounded-xl p-3`}>
                        <p className={`text-[12px] font-bold ${tx} mb-2`}>{d}</p>
                        <div className="space-y-1.5">
                          {schedule.grid[d].map((sid,i)=>{const s=gS(sid); const Ic=s?gI(s.icon):BookOpen; return (
                            <div key={i} className="flex items-center gap-2 p-2 rounded-lg" style={{background:(s?s.color:'#888')+"15"}}>
                              <Ic size={13} style={{color:s?s.color:'#888'}}/>
                              <span className={`text-[11px] font-semibold ${tx} truncate`}>{s?s.name:"—"}</span>
                            </div>
                          );})}
                        </div>
                      </div>
                    ))}
                  </div>
                ):(
                  <div className={`${cd} rounded-xl p-10 text-center`}>
                    <CalendarRange size={32} className={`mx-auto mb-2 ${mu}`}/>
                    <p className={`text-sm font-bold ${tx}`}>Nenhum cronograma ainda</p>
                    <p className={`text-xs ${mu}`}>Escolha os dias e clique em Gerar 👆</p>
                  </div>
                )}
              </div>
            )}

            {/* CONQUISTAS (GAMIFICAÇÃO) */}
            {pg==="Conquistas"&&(()=>{
              const totalMin=records.reduce((a,r)=>a+r.duration,0); const totalH=totalMin/60;
              const tasksDone=tasks.filter((t)=>t.status===lastCol()).length;
              const daysActive=new Set(records.map((r)=>r.date)).size;
              const xp=Math.round(totalMin+tasksDone*10+streak*15);
              const level=Math.floor(Math.sqrt(xp/100))+1;
              const xpThis=100*(level-1)*(level-1), xpNext=100*level*level;
              const pctLvl=Math.min(100,Math.round((xp-xpThis)/(xpNext-xpThis)*100));
              const ws=new Date(TODAY); ws.setDate(ws.getDate()-((ws.getDay()+6)%7)); const weStart=toK(ws); const we=new Date(ws); we.setDate(we.getDate()+6); const weEnd=toK(we);
              const weekMin=records.filter((r)=>r.date>=weStart&&r.date<=weEnd).reduce((a,r)=>a+r.duration,0); const weekGoal=300;
              const trophies=[
                {ic:Flame,c:"#f59e0b",t:"Primeiro passo",d:"Registre 1 sessão",ok:records.length>=1,pr:Math.min(100,records.length*100)},
                {ic:Clock,c:"#6366f1",t:"10 horas",d:"Acumule 10h",ok:totalH>=10,pr:Math.min(100,totalH/10*100)},
                {ic:Star,c:"#8b5cf6",t:"50 horas",d:"Acumule 50h",ok:totalH>=50,pr:Math.min(100,totalH/50*100)},
                {ic:Flame,c:"#ef4444",t:"Pegando fogo",d:"7 dias seguidos",ok:streak>=7,pr:Math.min(100,streak/7*100)},
                {ic:CheckCircle2,c:"#10b981",t:"Produtivo",d:"Conclua 25 tarefas",ok:tasksDone>=25,pr:Math.min(100,tasksDone/25*100)},
                {ic:CalendarDays,c:"#06b6d4",t:"Constância",d:"30 dias ativos",ok:daysActive>=30,pr:Math.min(100,daysActive/30*100)},
              ];
              return (
                <div className="space-y-4 max-w-4xl">
                  <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-indigo-500 via-purple-600 to-fuchsia-600 text-white">
                    <div className="absolute -top-12 -right-8 w-48 h-48 rounded-full bg-white/10 blur-3xl"/>
                    <div className="relative flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex flex-col items-center justify-center flex-shrink-0"><Trophy size={20}/><span className="text-[10px] font-bold mt-0.5">Nv {level}</span></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-2xl font-extrabold">Nível {level}</p>
                        <p className="text-white/80 text-xs mb-2">{xp} XP · faltam {Math.max(0,xpNext-xp)} XP para o nível {level+1}</p>
                        <div className="w-full h-2 rounded-full bg-white/20"><div className="h-full rounded-full bg-white transition-all" style={{width:`${pctLvl}%`}}/></div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[{l:"Tempo total",v:fmtDur(totalMin),i:Clock},{l:"Tarefas feitas",v:String(tasksDone),i:CheckCircle2},{l:"Sequência",v:streak+"d",i:Flame}].map((s,i)=>(
                      <div key={i} className={`${cd} rounded-xl p-3 text-center`}><s.i size={16} className="mx-auto text-indigo-500 mb-1"/><p className={`text-sm font-extrabold ${tx}`}>{s.v}</p><p className={`text-[10px] ${mu}`}>{s.l}</p></div>
                    ))}
                  </div>
                  <div className={`${cd} rounded-xl p-4`}>
                    <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><Zap size={15} className="text-amber-500"/><p className={`text-sm font-bold ${tx}`}>Desafio da semana</p></div><span className={`text-[11px] font-bold ${weekMin>=weekGoal?"text-emerald-500":mu}`}>{fmtDur(weekMin)} / {fmtDur(weekGoal)}</span></div>
                    <p className={`text-xs ${mu} mb-2`}>Estude 5 horas nesta semana {weekMin>=weekGoal&&"— concluído! 🎉"}</p>
                    <div className={`w-full h-2 rounded-full ${dk?"bg-white/10":"bg-gray-200"}`}><div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all" style={{width:`${Math.min(100,Math.round(weekMin/weekGoal*100))}%`}}/></div>
                  </div>
                  <div>
                    <p className={`text-[9px] font-bold ${mu} uppercase tracking-widest mb-2`}>Troféus</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {trophies.map((tr,i)=>(
                        <div key={i} className={`${cd} rounded-xl p-3 ${tr.ok?"":"opacity-75"}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:tr.ok?tr.c+"22":(dk?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.05)")}}>{tr.ok?<tr.ic size={17} style={{color:tr.c}}/>:<Lock size={15} className={mu}/>}</div>
                            <div className="min-w-0"><p className={`text-[12px] font-bold ${tx} truncate`}>{tr.t}</p><p className={`text-[10px] ${mu} truncate`}>{tr.d}</p></div>
                          </div>
                          {tr.ok?<p className="text-[9px] font-bold text-emerald-500 mt-0.5">✓ Conquistado</p>:<div className={`w-full h-1 rounded-full mt-1 ${dk?"bg-white/10":"bg-gray-200"}`}><div className="h-full rounded-full" style={{width:`${tr.pr}%`,background:tr.c}}/></div>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* SOBRE */}
            {pg==="Sobre"&&(
              <div className="space-y-4 max-w-4xl">
                {/* HERO */}
                <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-br from-indigo-500 via-purple-600 to-fuchsia-600 text-white">
                  <div className="absolute -top-16 -right-10 w-56 h-56 rounded-full bg-white/10 blur-3xl"/>
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center"><BookOpen size={24}/></div>
                      <div>
                        <h2 className="text-2xl font-extrabold tracking-tight">EstudoFlow</h2>
                        <p className="text-white/70 text-xs">Controle Pessoal de Estudos</p>
                      </div>
                    </div>
                    <p className="text-white/90 text-sm md:text-base leading-relaxed max-w-2xl">
                      O EstudoFlow transforma cada sessão de estudo em <strong>dados</strong>: você cronometra,
                      registra e acompanha sua evolução com gráficos, metas e relatórios — tudo salvo na nuvem
                      e <strong>privado por conta</strong>. Em vez de anotações soltas, você enxerga de verdade
                      quanto estudou e onde pode melhorar.
                    </p>
                  </div>
                </div>

                {/* OBJETIVO + PARA QUEM */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`${cd} rounded-xl p-5`}>
                    <div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center"><Target size={16} className="text-indigo-500"/></div><p className={`text-sm font-bold ${tx}`}>Qual o objetivo</p></div>
                    <p className={`text-[13px] leading-relaxed ${dk?"text-gray-300":"text-gray-600"}`}>
                      Dar clareza e constância aos seus estudos. Medindo o tempo dedicado e visualizando sua
                      rotina, fica mais fácil criar o hábito, manter a disciplina e bater suas metas.
                    </p>
                  </div>
                  <div className={`${cd} rounded-xl p-5`}>
                    <div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center"><Users size={16} className="text-emerald-500"/></div><p className={`text-sm font-bold ${tx}`}>Para quem é</p></div>
                    <p className={`text-[13px] leading-relaxed ${dk?"text-gray-300":"text-gray-600"}`}>
                      Estudantes de concursos, vestibular e faculdade, profissionais em certificações, e qualquer
                      pessoa que queira organizar <strong>estudos</strong>, <strong>exercícios físicos</strong> e
                      <strong> leituras</strong> em um só lugar.
                    </p>
                  </div>
                </div>

                {/* O QUE DÁ PRA FAZER */}
                <div className={`${cd} rounded-xl p-5`}>
                  <div className="flex items-center gap-2 mb-4"><Sparkles size={16} className="text-indigo-500"/><p className={`text-sm font-bold ${tx}`}>O que dá pra fazer</p></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      {i:Clock,c:"#6366f1",t:"Cronometrar sessões",d:"Inicie, pause e retome — cada sessão vira registro automático."},
                      {i:BookOpen,c:"#f59e0b",t:"Organizar conteúdos",d:"Matérias, treinos e livros com ícone e cor próprios."},
                      {i:Target,c:"#10b981",t:"Definir metas",d:"Metas de horas com prazo e barra de progresso."},
                      {i:BarChart3,c:"#8b5cf6",t:"Ver relatórios",d:"Gráficos por dia, semana, mês e ano + ranking."},
                      {i:Award,c:"#ec4899",t:"Gerar certificado",d:"Relatório em PDF e certificado de horas com seu nome."},
                      {i:Cloud,c:"#06b6d4",t:"Acessar de qualquer lugar",d:"Dados sincronizados e seguros, no PC ou no celular."},
                    ].map((f,i)=>(
                      <div key={i} className={`rounded-xl p-3.5 ${dk?"bg-white/[0.03]":"bg-gray-50"}`}>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2" style={{background:f.c+"1f"}}><f.i size={17} style={{color:f.c}}/></div>
                        <p className={`text-[13px] font-bold ${tx} mb-0.5`}>{f.t}</p>
                        <p className={`text-[11px] leading-snug ${mu}`}>{f.d}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PRIVACIDADE */}
                <div className={`${cd} rounded-xl p-5`}>
                  <div className="flex items-center gap-2 mb-2"><KeyRound size={16} className="text-indigo-500"/><p className={`text-sm font-bold ${tx}`}>Privacidade & segurança</p></div>
                  <p className={`text-[13px] leading-relaxed ${dk?"text-gray-300":"text-gray-600"}`}>
                    Cada usuário tem sua própria conta e seus dados são <strong>totalmente isolados</strong> —
                    ninguém vê o que é seu. As senhas são protegidas e a conexão é criptografada.
                  </p>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl p-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                  <div className="flex items-center gap-3">
                    <Rocket size={22}/>
                    <div>
                      <p className="font-bold text-sm">Pronto para começar?</p>
                      <p className="text-white/80 text-xs">Vá para o painel e registre sua primeira sessão.</p>
                    </div>
                  </div>
                  <button onClick={()=>nav("Dashboard")} className="px-4 py-2.5 rounded-xl bg-white text-indigo-600 font-bold text-sm shadow hover:bg-indigo-50 transition flex-shrink-0">Ir para o Dashboard</button>
                </div>

                <p className={`text-center text-[10px] ${mu} pt-1`}>EstudoFlow · feito com 💜 para sua jornada de estudos</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODALS */}
      <Mdl open={mt==="addRec"} onClose={cl} title="Adicionar Registro" dk={dk}>
        <div className="space-y-2.5">
          <div><label className={`text-[9px] ${mu} mb-0.5 block`}>Data</label><input type="date" value={mDate} onChange={(e)=>smDate(e.target.value)} className={ip}/></div>
          <div><label className={`text-[9px] ${mu} mb-0.5 block`}>Categoria</label><select value={mRecCat} onChange={(e)=>{setMRecCat(e.target.value); const f=subjects.filter(s=>e.target.value==="all"||s.category===e.target.value); if(f.length>0)smSub(f[0].id);}} className={ip}><option value="all">Todas</option>{CATS.map((c)=><option key={c.id} value={c.id}>{c.label}</option>)}</select></div>
          <div><label className={`text-[9px] ${mu} mb-0.5 block`}>Conteúdo</label><select value={mSub} onChange={(e)=>smSub(e.target.value)} className={ip}>{subjects.filter(s=>mRecCat==="all"||s.category===mRecCat).map((s)=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
          <div><label className={`text-[9px] ${mu} mb-0.5 block`}>Duração (min)</label><input type="number" min="1" value={mDur} onChange={(e)=>smDur(e.target.value)} className={ip}/></div>
          <div><label className={`text-[9px] ${mu} mb-0.5 block`}>Notas</label><input value={mNotes} onChange={(e)=>smNotes(e.target.value)} placeholder="Opcional..." className={ip}/></div>
          <button onClick={()=>{if(mSub&&mDur){addRec(mSub,mDate,mDur,mNotes);cl();}}} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm shadow flex items-center justify-center gap-1.5"><Save size={14}/>Salvar</button>
        </div>
      </Mdl>

      <Mdl open={mt==="addSub"||mt==="editSub"} onClose={cl} title={mt==="addSub"?"Novo Conteúdo":"Editar Conteúdo"} dk={dk}>
        <div className="space-y-2.5">
          <div><label className={`text-[9px] ${mu} mb-0.5 block`}>Nome</label><input value={mName} onChange={(e)=>smName(e.target.value)} className={ip} placeholder="Ex: Fundamentos de Teste"/></div>
          <div><label className={`text-[9px] ${mu} mb-0.5 block`}>Categoria</label><select value={mCat} onChange={(e)=>smCat(e.target.value)} className={ip}>{CATS.map((c)=><option key={c.id} value={c.id}>{c.label}</option>)}</select></div>
          <div><label className={`text-[9px] ${mu} mb-0.5 block`}>Cor</label><div className="flex gap-1.5 flex-wrap">{COLS.map((c)=><button key={c} onClick={()=>smColor(c)} className={`w-6 h-6 rounded-md transition ${mColor===c?"scale-110 ring-2 ring-offset-1 ring-indigo-500":""}`} style={{background:c}}/>)}</div></div>
          <div><label className={`text-[9px] ${mu} mb-0.5 block`}>Ícone</label><div className="flex gap-1 flex-wrap">{ICO.map((ic)=>{const IC=ic.c; return <button key={ic.n} onClick={()=>smIcon(ic.n)} className={`w-7 h-7 rounded-md flex items-center justify-center transition ${mIcon===ic.n?"bg-indigo-500 text-white":dk?"bg-white/5 text-gray-400":"bg-gray-100 text-gray-500"}`}><IC size={13}/></button>;})}</div></div>
          <button onClick={()=>{if(!mName) return; if(mt==="addSub"){setSubjects((p)=>[...p,{id:uid(),name:mName,icon:mIcon,color:mColor,category:mCat}]);flash("Criado!");}else{setSubjects((p)=>p.map((s)=>s.id===mId?{...s,name:mName,icon:mIcon,color:mColor,category:mCat}:s));flash("Atualizado!");} cl();}} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm shadow flex items-center justify-center gap-1.5"><Save size={14}/>{mt==="addSub"?"Criar":"Salvar"}</button>
        </div>
      </Mdl>

      <Mdl open={mt==="addGoal"||mt==="editGoal"} onClose={cl} title={mt==="addGoal"?"Nova Meta":"Editar Meta"} dk={dk}>
        <div className="space-y-2.5">
          <div><label className={`text-[9px] ${mu} mb-0.5 block`}>Título</label><input value={mTitle} onChange={(e)=>smTitle(e.target.value)} className={ip} placeholder="Ex: Certificação CTFL"/></div>
          <div><label className={`text-[9px] ${mu} mb-0.5 block`}>Categoria</label><select value={mCat} onChange={(e)=>smCat(e.target.value)} className={ip}>{CATS.map((c)=><option key={c.id} value={c.id}>{c.label}</option>)}</select></div>
          <div><label className={`text-[9px] ${mu} mb-0.5 block`}>Meta (horas)</label><input type="number" min="1" value={mTH} onChange={(e)=>smTH(parseInt(e.target.value)||0)} className={ip}/></div>
          <div><label className={`text-[9px] ${mu} mb-0.5 block`}>Data Início</label><input type="date" value={mSD} onChange={(e)=>smSD(e.target.value)} className={ip}/></div>
          <div className="flex items-center gap-2"><label className={`text-[10px] ${mu}`}>Data fim?</label><button onClick={()=>smHE(!mHE)} className={`w-9 h-5 rounded-full transition flex items-center px-0.5 ${mHE?"bg-indigo-500":"bg-gray-300"}`}><div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${mHE?"translate-x-4":""}`}/></button></div>
          {mHE&&<div><label className={`text-[9px] ${mu} mb-0.5 block`}>Data Fim</label><input type="date" value={mED} onChange={(e)=>smED(e.target.value)} className={ip}/></div>}
          <button onClick={()=>{if(!mTitle) return; const d={title:mTitle,startDate:mSD,endDate:mHE?mED||null:null,targetHours:mTH,category:mCat}; if(mt==="addGoal"){setGoals((p)=>[...p,{id:uid(),...d}]);flash("Meta criada!");}else{setGoals((p)=>p.map((g)=>g.id===mId?{...g,...d}:g));flash("Atualizada!");} cl();}} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm shadow flex items-center justify-center gap-1.5"><Save size={14}/>{mt==="addGoal"?"Criar":"Salvar"}</button>
        </div>
      </Mdl>

      <Mdl open={mt==="profile"} onClose={cl} title="Editar Perfil" dk={dk}>
        <div className="space-y-3">
          <div className="flex justify-center"><button onClick={()=>setMt("avatar")} className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-2xl hover:scale-105 transition shadow-lg">{profile.emoji}</button></div>
          <div><label className={`text-[9px] ${mu} mb-0.5 block`}>Nome</label><input value={mPN} onChange={(e)=>smPN(e.target.value)} className={ip}/></div>
          <button onClick={()=>{setProfile((p)=>({...p,name:mPN||p.name}));flash("Salvo!");cl();}} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm shadow flex items-center justify-center gap-1.5"><Save size={14}/>Salvar</button>
        </div>
      </Mdl>

      <Mdl open={mt==="avatar"} onClose={cl} title="Avatar" dk={dk}>
        <div className="grid grid-cols-6 gap-2">{EMO.map((em)=><button key={em} onClick={()=>{setProfile((p)=>({...p,emoji:em}));flash("Avatar!");cl();}} className={`w-10 h-10 rounded-lg text-lg flex items-center justify-center transition hover:scale-110 ${profile.emoji===em?"ring-2 ring-indigo-500 bg-indigo-500/20":""} ${dk?"hover:bg-white/10":"hover:bg-gray-100"}`}>{em}</button>)}</div>
      </Mdl>

      <Mdl open={mt==="task"} onClose={cl} title={tkId?"Editar Tarefa":"Nova Tarefa"} dk={dk}>
        <div className="space-y-2.5">
          <div><label className={`text-[9px] ${mu} mb-0.5 block`}>Título</label><input value={tkTitle} onChange={(e)=>setTkTitle(e.target.value)} className={ip} placeholder="Ex: Revisar capítulo 3" autoFocus/></div>
          <div><label className={`text-[9px] ${mu} mb-0.5 block`}>Status</label><select value={tkStatus} onChange={(e)=>setTkStatus(e.target.value)} className={ip}>{columns.map((c)=><option key={c.id} value={c.id}>{c.label}</option>)}</select></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className={`text-[9px] ${mu} mb-0.5 block`}>Prioridade</label><select value={tkPrio} onChange={(e)=>setTkPrio(e.target.value)} className={ip}><option value="alta">Alta</option><option value="media">Média</option><option value="baixa">Baixa</option></select></div>
            <div><label className={`text-[9px] ${mu} mb-0.5 block`}>Prazo</label><input type="date" value={tkDue} onChange={(e)=>setTkDue(e.target.value)} className={ip}/></div>
          </div>
          <div><label className={`text-[9px] ${mu} mb-0.5 block`}>Conteúdo (opcional)</label><select value={tkSubj} onChange={(e)=>setTkSubj(e.target.value)} className={ip}><option value="">— Nenhum —</option>{subjects.map((s)=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
          <div><label className={`text-[9px] ${mu} mb-0.5 block flex items-center gap-1`}><Repeat size={10}/>Repetir</label><select value={tkRec} onChange={(e)=>setTkRec(e.target.value)} className={ip}><option value="none">Não repetir</option><option value="daily">Diariamente</option><option value="weekly">Semanalmente</option><option value="monthly">Mensalmente</option></select></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className={`text-[9px] ${mu} mb-0.5 block`}>Tempo estimado (min)</label><input type="number" min="0" value={tkEst} onChange={(e)=>setTkEst(e.target.value)} className={ip} placeholder="ex: 30"/></div>
            <div><label className={`text-[9px] ${mu} mb-0.5 block`}>Tempo utilizado (min)</label><input type="number" min="0" value={tkUsed} onChange={(e)=>setTkUsed(e.target.value)} className={ip} placeholder="conta no histórico"/></div>
          </div>
          <p className={`text-[9px] ${mu} -mt-1`}>⏱️ Ao concluir a tarefa, o tempo utilizado (ou o estimado) é lançado no seu histórico.</p>
          <div>
            <label className={`text-[9px] ${mu} mb-0.5 block`}>Checklist</label>
            <div className="space-y-1.5">
              {tkChecklist.map((c)=>(
                <div key={c.id} className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${dk?"bg-white/[0.04]":"bg-gray-50"}`}>
                  <button onClick={()=>toggleChkItem(c.id)} className="flex-shrink-0">{c.done?<CheckCircle2 size={16} className="text-emerald-500"/>:<Circle size={16} className={mu}/>}</button>
                  <span className={`text-[12px] flex-1 ${c.done?"line-through "+mu:tx}`}>{c.text}</span>
                  <button onClick={()=>delChkItem(c.id)} className="flex-shrink-0 p-0.5 rounded hover:bg-red-500/10"><Trash2 size={12} className="text-red-400"/></button>
                </div>
              ))}
              <div className="flex gap-2">
                <input value={tkNewItem} onChange={(e)=>setTkNewItem(e.target.value)} onKeyDown={(e)=>{if(e.key==='Enter'){e.preventDefault();addChkItem();}}} placeholder="Novo item + Enter..." className={`${ip} flex-1`}/>
                <button onClick={addChkItem} className="px-3 rounded-xl bg-indigo-500 text-white flex items-center justify-center flex-shrink-0"><Plus size={14}/></button>
              </div>
            </div>
          </div>
          <div><label className={`text-[9px] ${mu} mb-0.5 block`}>Notas</label><input value={tkNotes} onChange={(e)=>setTkNotes(e.target.value)} className={ip} placeholder="Opcional..."/></div>
          <button onClick={saveTask} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm shadow flex items-center justify-center gap-1.5"><Save size={14}/>{tkId?"Salvar":"Criar"}</button>
        </div>
      </Mdl>

      <Mdl open={mt==="col"} onClose={cl} title={colId?"Editar Status":"Novo Status"} dk={dk}>
        <div className="space-y-2.5">
          <div><label className={`text-[9px] ${mu} mb-0.5 block`}>Nome do status</label><input value={colLabel} onChange={(e)=>setColLabel(e.target.value)} className={ip} placeholder="Ex: Revisar, Em pausa, Urgente..." autoFocus/></div>
          <div><label className={`text-[9px] ${mu} mb-0.5 block`}>Cor</label><div className="flex gap-1.5 flex-wrap">{COLS.map((c)=><button key={c} onClick={()=>setColColor(c)} className={`w-6 h-6 rounded-md transition ${colColor===c?"scale-110 ring-2 ring-offset-1 ring-indigo-500":""}`} style={{background:c}}/>)}</div></div>
          <div className={`rounded-lg p-2.5 flex items-center gap-2 ${dk?"bg-white/[0.04]":"bg-gray-50"}`}>
            <span className="w-2.5 h-2.5 rounded-full" style={{background:colColor}}/>
            <span className={`text-[12px] font-bold ${tx}`}>{colLabel||"Pré-visualização"}</span>
          </div>
          <button onClick={saveCol} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm shadow flex items-center justify-center gap-1.5"><Save size={14}/>{colId?"Salvar":"Criar status"}</button>
          {colId && columns.length>1 && <button onClick={()=>{delCol(colId);cl();}} className="w-full py-2 rounded-xl bg-red-500/10 text-red-500 font-bold text-xs flex items-center justify-center gap-1.5"><Trash2 size={13}/>Excluir este status</button>}
        </div>
      </Mdl>

      {/* PRINT */}
      {printMode&&(
        <div className="fixed inset-0 z-[200] bg-white overflow-auto" id="print-area">
          <div className="fixed top-4 right-4 flex gap-2 z-10">
            <button onClick={()=>{const el=document.getElementById("print-content"); if(!el) return; const w=window.open("","_blank"); if(!w) return; w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>EstudoFlow</title><style>body{font-family:'Segoe UI',system-ui,sans-serif;margin:0;padding:0;color:#1f2937}</style></head><body>${el.innerHTML}</body></html>`); w.document.close(); setTimeout(()=>w.print(),400);}} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-lg flex items-center gap-2"><Printer size={16}/>Imprimir / PDF</button>
            <button onClick={()=>setPrintMode(null)} className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 text-sm font-bold shadow"><X size={16}/></button>
          </div>
          <div id="print-content">
            {printMode==="cert"&&(
              <div className="min-h-screen flex items-center justify-center p-8">
                <div className="w-full max-w-2xl border-4 border-indigo-600 rounded-3xl p-12 text-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage:"repeating-linear-gradient(45deg,#6366f1 0,#6366f1 1px,transparent 0,transparent 50%)",backgroundSize:"20px 20px"}}/>
                  <div className="relative">
                    <div className="flex justify-center mb-4"><div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg"><Award size={32} className="text-white"/></div></div>
                    <p className="text-xs font-bold text-indigo-500 uppercase tracking-[0.3em] mb-2">EstudoFlow</p>
                    <h1 className="text-3xl font-extrabold text-gray-800 mb-1">Certificado de Horas</h1>
                    <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full mb-6"/>
                    <p className="text-gray-600 text-sm mb-3">Certificamos que</p>
                    <p className="text-2xl font-extrabold text-gray-900 mb-6 border-b-2 border-indigo-200 pb-3 inline-block px-8">{profile.name}</p>
                    <p className="text-gray-600 text-sm mb-2">completou um total de</p>
                    <p className="text-5xl font-extrabold text-indigo-600 mb-6">{fmtDur(rT)}</p>
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="bg-indigo-50 rounded-xl p-3"><p className="text-xl font-extrabold text-indigo-600">{rRecs.length}</p><p className="text-[10px] text-gray-500 font-semibold">Sessões</p></div>
                      <div className="bg-indigo-50 rounded-xl p-3"><p className="text-xl font-extrabold text-indigo-600">{rDy}</p><p className="text-[10px] text-gray-500 font-semibold">Dias Ativos</p></div>
                      <div className="bg-indigo-50 rounded-xl p-3"><p className="text-xl font-extrabold text-indigo-600">{rDy>0?fmtDur(Math.round(rT/rDy)):"—"}</p><p className="text-[10px] text-gray-500 font-semibold">Média/Dia</p></div>
                    </div>
                    {rTop.length>0&&<div className="mb-8"><p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Conteúdos</p><div className="flex flex-wrap justify-center gap-2">{rTop.map((s)=><span key={s.id} className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">{s.name} — {fmtDur(s.mins)}</span>)}</div></div>}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                      <div className="text-left"><p className="text-[10px] text-gray-400">Emitido em</p><p className="text-sm font-bold text-gray-700">{toK(TODAY).split("-").reverse().join("/")}</p></div>
                      <div className="text-right"><div className="w-32 border-b border-gray-300 mb-1"/><p className="text-xs text-gray-500">Assinatura Digital</p><p className="text-[10px] text-gray-400 font-mono mt-1">ID: EF-{uid()}</p></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {printMode==="report"&&(
              <div className="max-w-3xl mx-auto p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"><BookOpen size={20} className="text-white"/></div>
                  <div><p className="text-lg font-extrabold text-gray-800">EstudoFlow — Relatório {rP==="day"?"Diário":rP==="week"?"Semanal":rP==="month"?"Mensal":"Anual"}</p><p className="text-xs text-gray-400">Gerado em {toK(TODAY).split("-").reverse().join("/")}</p></div>
                </div>
                <div className="grid grid-cols-4 gap-3 mb-6">{[{l:"Total",v:fmtDur(rT)},{l:"Sessões",v:rRecs.length},{l:"Dias Ativos",v:rDy},{l:"Média/Dia",v:rDy>0?fmtDur(Math.round(rT/rDy)):"—"}].map((s,i)=><div key={i} className="border border-gray-200 rounded-xl p-3 text-center"><p className="text-xs text-gray-400">{s.l}</p><p className="text-lg font-extrabold text-gray-800">{s.v}</p></div>)}</div>
                {rByCat.length>0&&<div className="mb-6"><p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Por Categoria</p>{rByCat.map((c)=><div key={c.name} className="flex items-center gap-3 mb-2"><span className="text-sm font-semibold text-gray-700 w-32">{c.name}</span><div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{width:`${rT>0?Math.round(c.horas*60/rT*100):0}%`,background:c.color}}/></div><span className="text-xs font-bold text-gray-500 w-16 text-right">{c.horas}h</span></div>)}</div>}
                {rTop.length>0&&<div className="mb-6"><p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Top Conteúdos</p><table className="w-full text-sm"><thead><tr className="border-b border-gray-200"><th className="text-left py-2 text-xs text-gray-400 font-bold">Conteúdo</th><th className="text-right py-2 text-xs text-gray-400 font-bold">Tempo</th><th className="text-right py-2 text-xs text-gray-400 font-bold">%</th></tr></thead><tbody>{rTop.map((s)=><tr key={s.id} className="border-b border-gray-100"><td className="py-2 font-semibold text-gray-700">{s.name}</td><td className="py-2 text-right text-gray-600">{fmtDur(s.mins)}</td><td className="py-2 text-right text-gray-500">{s.pct}%</td></tr>)}</tbody></table></div>}
                {rRecs.length>0&&<div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Registros ({rRecs.length})</p><table className="w-full text-xs"><thead><tr className="border-b border-gray-200"><th className="text-left py-1.5 text-gray-400 font-bold">Data</th><th className="text-left py-1.5 text-gray-400 font-bold">Conteúdo</th><th className="text-right py-1.5 text-gray-400 font-bold">Duração</th></tr></thead><tbody>{[...rRecs].sort((a,b)=>a.date.localeCompare(b.date)).map((r)=>{const s=gS(r.subjectId); return s?<tr key={r.id} className="border-b border-gray-50"><td className="py-1.5 text-gray-500">{r.date.split("-").reverse().join("/")}</td><td className="py-1.5 text-gray-700 font-medium">{s.name}</td><td className="py-1.5 text-right text-gray-600">{fmtDur(r.duration)}</td></tr>:null;})}</tbody></table></div>}
                <div className="mt-8 pt-4 border-t border-gray-200 flex items-center justify-between text-[10px] text-gray-400"><span>EstudoFlow · {profile.name}</span><span>{toK(TODAY).split("-").reverse().join("/")}</span></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
