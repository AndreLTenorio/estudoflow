import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./Auth.jsx";
import ResetPassword from "./ResetPassword.jsx";
import EstudoFlow from "./EstudoFlow.jsx";
import { BookOpen } from "lucide-react";

function Splash() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50" style={{ fontFamily: "'Outfit',sans-serif" }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg animate-pulse">
          <BookOpen size={22} className="text-white" />
        </div>
        <p className="text-sm font-semibold text-gray-500">Carregando...</p>
      </div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(undefined); // undefined = carregando
  const [recovery, setRecovery] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((event, sess) => {
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
      setSession(sess);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (session === undefined) return <Splash />;
  if (recovery) return <ResetPassword onDone={() => setRecovery(false)} />;
  if (!session) return <Auth />;
  return <EstudoFlow user={session.user} key={session.user.id} />;
}
