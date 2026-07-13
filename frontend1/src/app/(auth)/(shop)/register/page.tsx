"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock } from "lucide-react";

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

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();

  const [settings, setSettings] =
    useState<AuthPageSetting>(DEFAULT_AUTH_SETTING);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
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
      await register({ name, email, password });
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Kayıt başarısız. Lütfen tekrar deneyin.");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden font-[family-name:var(--font-merienda)] ">
      <AuthCard title={settings.registerTitle} settings={settings}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8d6b3d]" />

            <Input
              type="text"
              placeholder="Ad Soyad"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
              className={authInputClassName}
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8d6b3d]" />

            <Input
              type="email"
              placeholder="E-posta"
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
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
              className={authInputClassName}
            />
          </div>

          <p className="text-right text-[12px] text-[#4b2a17]/75">
            {settings.haveAccountText}{" "}
            <Link href="/login" className="underline underline-offset-2">
              {settings.loginLinkText}
            </Link>
          </p>

          {error && <ErrorMessage message={error} />}

          <Button
            type="submit"
            disabled={isLoading}
            className={authButtonClassName}
            style={{
              font: "font-[family-name:var(--font-merienda)] ",
              backgroundImage: `url('${settings.cardBgImage || "/cardDuvar.png"}') `,
            }}
          >
            {isLoading ? "Kayıt Yapılıyor..." : settings.registerButtonText}
          </Button>
        </form>
      </AuthCard>
    </main>
  );
}
