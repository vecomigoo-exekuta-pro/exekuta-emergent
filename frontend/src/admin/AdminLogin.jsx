import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Lock } from "lucide-react";
import { Logo } from "@/components/Logo";
import { login } from "@/cms/adminApi";

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      onLogin();
    } catch (err) {
      setError(err.message || "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-white/15 bg-black px-4 py-3 text-sm text-paper placeholder:text-zinc-600 outline-none focus:border-acid";

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4" data-testid="admin-login-page">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl border border-white/10 bg-card2 p-8" data-testid="admin-login-form">
        <div className="flex justify-center">
          <Logo className="h-10 w-auto" />
        </div>
        <p className="mt-6 flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-acid">
          <Lock className="h-3.5 w-3.5" />
          Área administrativa
        </p>
        <div className="mt-7 space-y-4">
          <div>
            <label htmlFor="admin-email" className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">
              E-mail
            </label>
            <input id="admin-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} data-testid="admin-login-email" className={inputCls} placeholder="admin@exekuta.com.br" autoComplete="username" />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">
              Senha
            </label>
            <input id="admin-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} data-testid="admin-login-password" className={inputCls} placeholder="••••••••" autoComplete="current-password" />
          </div>
        </div>
        {error && (
          <p className="mt-4 text-sm text-[#FF4D67]" data-testid="admin-login-error">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          data-testid="admin-login-submit"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-acid px-6 py-3 text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
        </button>
        <Link to="/" data-testid="admin-back-to-site" className="mt-6 flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500 transition-colors hover:text-acid">
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar ao site
        </Link>
      </form>
    </div>
  );
}
