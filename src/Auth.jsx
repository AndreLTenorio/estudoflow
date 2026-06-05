import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import {
  BookOpen, Mail, Lock, User, Eye, EyeOff, ArrowLeft, Loader2,
  Clock, TrendingUp, Target, Award, Cloud, CalendarCheck, Sparkles,
} from "lucide-react";

const redirectTo =
  typeof window !== "undefined" ? window.location.origin : undefined;

/* ── Slides do carrossel de apresentação ── */
const FEATURES = [
  {
    icon: Clock,
    tag: "Cronômetro inteligente",
    title: "Registre cada minuto de foco",
    desc: "Inicie, pause e retome o cronômetro. Cada sessão de estudo é salva automaticamente.",
  },
  {
    icon: TrendingUp,
    tag: "Evolução visual",
    title: "Veja seu progresso crescer",
    desc: "Gráficos por dia, semana, mês e ano. Entenda seus hábitos e melhore de verdade.",
  },
  {
    icon: Target,
    tag: "Metas com prazo",
    title: "Estude com objetivo claro",
    desc: "Defina metas de horas e acompanhe quanto falta para conquistar cada uma.",
  },
  {
    icon: Award,
    tag: "Relatórios & certificado",
    title: "Comprove suas horas",
    desc: "Gere relatórios em PDF e até um certificado de horas estudadas com seu nome.",
  },
  {
    icon: Cloud,
    tag: "Na nuvem, com você",
    title: "Acesse de qualquer lugar",
    desc: "Seus dados são privados, sincronizados e seguros — no computador ou no celular.",
  },
];

function Carrossel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % FEATURES.length), 4500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative z-10 flex flex-col h-full w-full max-w-md mx-auto">
      {/* marca */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
          <BookOpen size={18} className="text-white" />
        </div>
        <div>
          <p className="text-white font-extrabold tracking-tight leading-none">EstudoFlow</p>
          <p className="text-white/60 text-[10px]">Controle Pessoal de Estudos</p>
        </div>
      </div>

      {/* carrossel */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="overflow-hidden">
          <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${i * 100}%)` }}>
            {FEATURES.map((f, idx) => {
              const Ic = f.icon;
              return (
                <div key={idx} className="min-w-full pr-2">
                  <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center shadow-lg mb-6">
                    <Ic size={30} className="text-white" />
                  </div>
                  <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-white/70 mb-2">{f.tag}</span>
                  <h2 className="text-3xl font-extrabold text-white leading-tight mb-3">{f.title}</h2>
                  <p className="text-white/80 text-sm leading-relaxed max-w-sm">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* indicadores */}
        <div className="flex gap-2 mt-8">
          {FEATURES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${idx === i ? "w-8 bg-white" : "w-2 bg-white/30 hover:bg-white/50"}`}
            />
          ))}
        </div>
      </div>

      {/* rodapé */}
      <div className="flex items-center gap-2 text-white/70 text-xs">
        <Sparkles size={14} />
        <span>Estudos, exercícios e leituras — tudo em um só lugar.</span>
      </div>
    </div>
  );
}

/* Banner compacto rotativo (mobile) */
function BannerMobile() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % FEATURES.length), 4000);
    return () => clearInterval(t);
  }, []);
  const f = FEATURES[i];
  const Ic = f.icon;
  return (
    <div className="lg:hidden mb-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white shadow-lg overflow-hidden">
      <div key={i} className="flex items-center gap-3 anim-fade">
        <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center flex-shrink-0">
          <Ic size={20} className="text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-white/70">{f.tag}</p>
          <p className="text-sm font-bold leading-snug">{f.title}</p>
        </div>
      </div>
      <div className="flex gap-1.5 mt-3">
        {FEATURES.map((_, idx) => (
          <span key={idx} className={`h-1 rounded-full transition-all duration-500 ${idx === i ? "w-5 bg-white" : "w-1.5 bg-white/40"}`} />
        ))}
      </div>
    </div>
  );
}

export default function Auth() {
  const [mode, setMode] = useState("signin"); // signin | signup | forgot
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const reset = () => { setErr(""); setMsg(""); };

  const traduzErro = (m = "") => {
    const s = m.toLowerCase();
    if (s.includes("invalid login")) return "E-mail ou senha incorretos.";
    if (s.includes("already registered") || s.includes("already been registered"))
      return "Este e-mail já está cadastrado. Tente entrar.";
    if (s.includes("email not confirmed"))
      return "Confirme seu e-mail antes de entrar (veja sua caixa de entrada).";
    if (s.includes("password should be at least"))
      return "A senha precisa ter pelo menos 6 caracteres.";
    if (s.includes("unable to validate email")) return "E-mail inválido.";
    if (s.includes("provider is not enabled"))
      return "Login com Google ainda não está ativado neste projeto.";
    return m || "Algo deu errado. Tente novamente.";
  };

  const entrar = async (e) => {
    e.preventDefault();
    reset(); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pw });
    setLoading(false);
    if (error) setErr(traduzErro(error.message));
  };

  const cadastrar = async (e) => {
    e.preventDefault();
    reset();
    if (pw.length < 6) return setErr("A senha precisa ter pelo menos 6 caracteres.");
    if (pw !== pw2) return setErr("As senhas não conferem.");
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: pw,
      options: { data: { name: name.trim() || "Usuário" }, emailRedirectTo: redirectTo },
    });
    setLoading(false);
    if (error) return setErr(traduzErro(error.message));
    if (data?.session) {
      setMsg("Conta criada! Entrando...");
    } else {
      setMsg("Conta criada! Enviamos um e-mail de confirmação — confirme e depois entre.");
      setMode("signin");
    }
  };

  const recuperar = async (e) => {
    e.preventDefault();
    reset();
    if (!email.trim()) return setErr("Digite seu e-mail.");
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
    setLoading(false);
    if (error) return setErr(traduzErro(error.message));
    setMsg("Se o e-mail existir, enviamos um link para redefinir a senha.");
  };

  const entrarGoogle = async () => {
    reset(); setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo } });
    if (error) { setGoogleLoading(false); setErr(traduzErro(error.message)); }
  };

  const ip =
    "w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition";
  const titulo = { signin: "Bem-vindo de volta", signup: "Criar sua conta", forgot: "Recuperar senha" }[mode];
  const sub = {
    signin: "Entre para acessar seus estudos",
    signup: "Comece a organizar seus estudos",
    forgot: "Enviaremos um link para o seu e-mail",
  }[mode];

  return (
    <div className="min-h-screen w-full flex" style={{ fontFamily: "'Outfit',sans-serif" }}>
      <style>{`
        @keyframes ef-float { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-20px)} }
        @keyframes ef-fade { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        .anim-fade{animation:ef-fade .5s ease-out}
      `}</style>

      {/* PAINEL DE APRESENTAÇÃO (desktop) */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 p-12">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" style={{ animation: "ef-float 9s ease-in-out infinite" }} />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-fuchsia-400/20 blur-3xl" style={{ animation: "ef-float 11s ease-in-out infinite reverse" }} />
        <div className="absolute top-1/3 right-10 w-40 h-40 rounded-full bg-indigo-300/20 blur-2xl" style={{ animation: "ef-float 7s ease-in-out infinite" }} />
        <Carrossel />
      </div>

      {/* FORMULÁRIO */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="w-full max-w-sm">
          {/* marca (só mobile) */}
          <div className="lg:hidden flex flex-col items-center mb-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-3">
              <BookOpen size={26} className="text-white" />
            </div>
            <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">EstudoFlow</h1>
            <p className="text-xs text-gray-400">Controle Pessoal de Estudos</p>
          </div>

          <BannerMobile />

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            {mode === "forgot" && (
              <button onClick={() => { setMode("signin"); reset(); }} className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-gray-600 mb-3">
                <ArrowLeft size={13} /> Voltar
              </button>
            )}

            <h2 className="text-lg font-bold text-gray-800">{titulo}</h2>
            <p className="text-xs text-gray-400 mb-5">{sub}</p>

            {err && <div className="mb-3 px-3 py-2 rounded-lg bg-red-50 border border-red-100 text-[12px] font-medium text-red-600">{err}</div>}
            {msg && <div className="mb-3 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-100 text-[12px] font-medium text-emerald-700">{msg}</div>}

            <form onSubmit={mode === "signin" ? entrar : mode === "signup" ? cadastrar : recuperar} className="space-y-3">
              {mode === "signup" && (
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input className={ip} placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              )}

              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" autoComplete="email" className={ip} placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              {mode !== "forgot" && (
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPw ? "text" : "password"} autoComplete={mode === "signup" ? "new-password" : "current-password"} className={ip + " pr-10"} placeholder="Senha" value={pw} onChange={(e) => setPw(e.target.value)} required />
                  <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              )}

              {mode === "signup" && (
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPw ? "text" : "password"} className={ip} placeholder="Confirmar senha" value={pw2} onChange={(e) => setPw2(e.target.value)} required />
                </div>
              )}

              {mode === "signin" && (
                <div className="flex justify-end">
                  <button type="button" onClick={() => { setMode("forgot"); reset(); }} className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700">
                    Esqueci minha senha
                  </button>
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm shadow-md hover:brightness-110 transition flex items-center justify-center gap-2 disabled:opacity-60">
                {loading && <Loader2 size={15} className="animate-spin" />}
                {mode === "signin" ? "Entrar" : mode === "signup" ? "Criar conta" : "Enviar link"}
              </button>
            </form>

            {mode !== "forgot" && (
              <>
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-[10px] text-gray-400 font-semibold">OU</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                <button onClick={entrarGoogle} disabled={googleLoading} className="w-full py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2 disabled:opacity-60">
                  {googleLoading ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 48 48">
                      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.2-.1-2.3-.4-3.5z" />
                      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 5.1 29.6 3 24 3 16 3 9.1 7.6 6.3 14.7z" />
                      <path fill="#4CAF50" d="M24 45c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 35.9 26.7 37 24 37c-5.3 0-9.7-2.6-11.3-7l-6.5 5C9.1 42.3 16 45 24 45z" />
                      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.6l6.3 5.2C41.4 36 44 30.6 44 24c0-1.2-.1-2.3-.4-3.5z" />
                    </svg>
                  )}
                  Continuar com Google
                </button>
              </>
            )}

            {mode !== "forgot" && (
              <p className="text-center text-xs text-gray-500 mt-5">
                {mode === "signin" ? "Não tem conta?" : "Já tem conta?"}{" "}
                <button onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); reset(); }} className="font-bold text-indigo-600 hover:text-indigo-700">
                  {mode === "signin" ? "Cadastre-se" : "Entrar"}
                </button>
              </p>
            )}
          </div>

          <p className="text-center text-[10px] text-gray-400 mt-4">
            🔒 Seus dados são privados e isolados por conta.
          </p>
        </div>
      </div>
    </div>
  );
}
