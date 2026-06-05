import { useState } from "react";
import { supabase } from "./supabaseClient";
import { BookOpen, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

export default function ResetPassword({ onDone }) {
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const salvar = async (e) => {
    e.preventDefault();
    setErr(""); setMsg("");
    if (pw.length < 6) return setErr("A senha precisa ter pelo menos 6 caracteres.");
    if (pw !== pw2) return setErr("As senhas não conferem.");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setLoading(false);
    if (error) return setErr(error.message);
    setMsg("Senha alterada com sucesso! Redirecionando...");
    setTimeout(() => onDone && onDone(), 1200);
  };

  const ip =
    "w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition";

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50" style={{ fontFamily: "'Outfit',sans-serif" }}>
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-3">
            <BookOpen size={26} className="text-white" />
          </div>
          <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">Definir nova senha</h1>
          <p className="text-xs text-gray-400">Escolha uma senha nova para sua conta</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          {err && <div className="mb-3 px-3 py-2 rounded-lg bg-red-50 border border-red-100 text-[12px] font-medium text-red-600">{err}</div>}
          {msg && <div className="mb-3 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-100 text-[12px] font-medium text-emerald-700">{msg}</div>}
          <form onSubmit={salvar} className="space-y-3">
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type={showPw ? "text" : "password"} className={ip} placeholder="Nova senha" value={pw} onChange={(e) => setPw(e.target.value)} required />
              <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type={showPw ? "text" : "password"} className={ip} placeholder="Confirmar nova senha" value={pw2} onChange={(e) => setPw2(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm shadow-md hover:brightness-110 transition flex items-center justify-center gap-2 disabled:opacity-60">
              {loading && <Loader2 size={15} className="animate-spin" />}
              Salvar nova senha
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
