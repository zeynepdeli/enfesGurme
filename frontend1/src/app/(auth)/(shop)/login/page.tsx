"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";

import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/shared/error-message";
import {
  AuthCard,
  AuthPageSetting,
  DEFAULT_AUTH_SETTING,
  authButtonClassName,
  authInputClassName,
} from "@/components/auth/auth-card";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const [settings, setSettings] =
    useState<AuthPageSetting>(DEFAULT_AUTH_SETTING);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("saved-email");
    if (savedEmail) setEmail(savedEmail);

    async function loadSettings() {
      try {
        const res = await api.get<AuthPageSetting>("/api/auth-page-settings");
        setSettings({ ...DEFAULT_AUTH_SETTING, ...(res.data || {}) });
      } catch (error) {
        console.error("Auth settings load error:", error);
      }
    }

    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      localStorage.setItem("saved-email", email);
      await login(email, password);
      router.push("/");
    } catch (err: any) {
      setError(
        err.message || "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.",
      );
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden font-[family-name:var(--font-merienda)] ">
      <AuthCard title={settings.loginTitle} settings={settings}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8d6b3d]" />

            <Input
              name="email"
              autoComplete="email"
              type="email"
              placeholder="E-posta veya Telefon"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className={authInputClassName}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8d6b3d]" />

            <Input
              name="password"
              autoComplete="current-password"
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className={authInputClassName}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pr-1 text-[12px] text-[#4b2a17]">
            <button type="button" className="hover:underline">
              {settings.forgotText}
            </button>

            <Link href="/register" className="underline underline-offset-2">
              {settings.registerLinkText}
            </Link>
          </div>

          {error && <ErrorMessage message={error} />}

          <Button
            type="submit"
            disabled={isLoading}
            className={authButtonClassName}
            style={{
              font: "font-[family-name:var(--font-merienda)] ",
              backgroundImage: `url('${settings.cardBgImage || "/cardDuvar.png"}')`,
            }}
          >
            {isLoading ? "Giriş Yapılıyor..." : settings.loginButtonText}
          </Button>
        </form>
      </AuthCard>
    </main>
  );
}
