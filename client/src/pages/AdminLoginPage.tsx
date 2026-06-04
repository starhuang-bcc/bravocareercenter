/**
 * AdminLoginPage — 後台登錄頁面
 * 使用後端密碼驗證，驗證後可訪問 /submissions
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { Lock } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const verifyPasswordMutation = trpc.contact.verifyPassword.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await verifyPasswordMutation.mutateAsync({ password });
      
      if (result.success) {
        // 保存登錄狀態到 localStorage
        localStorage.setItem("adminLoggedIn", "true");
        localStorage.setItem("adminLoginTime", Date.now().toString());
        localStorage.setItem("adminPassword", password);
        setLocation("/submissions");
      } else {
        setError("密碼錯誤，請重試");
        setPassword("");
      }
    } catch (err) {
      setError("密碼錯誤，請重試");
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "oklch(0.99 0.005 80)" }}
    >
      <div className="w-full max-w-md">
        {/* Card */}
        <div
          className="rounded-lg shadow-lg p-8"
          style={{ backgroundColor: "white" }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div
                className="p-3 rounded-full"
                style={{ backgroundColor: "oklch(0.18 0.06 250)" }}
              >
                <Lock size={24} className="text-white" />
              </div>
            </div>
            <h1
              className="font-serif-tc text-2xl font-bold mb-2"
              style={{ color: "oklch(0.18 0.06 250)" }}
            >
              後台管理
            </h1>
            <p
              className="font-sans-tc text-sm"
              style={{ color: "rgba(0,0,0,0.6)" }}
            >
              請輸入密碼以訪問後台
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block font-sans-tc text-sm font-medium mb-2"
                style={{ color: "rgba(0,0,0,0.7)" }}
              >
                密碼
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="請輸入密碼"
                className="w-full px-4 py-2 border rounded-lg font-sans-tc text-sm focus:outline-none focus:ring-2 transition-all"
                style={{
                  borderColor: error ? "oklch(0.7 0.2 25)" : "rgba(0,0,0,0.15)",
                  "--tw-ring-color": "oklch(0.18 0.06 250)",
                } as React.CSSProperties}
                disabled={isLoading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="p-3 rounded-lg font-sans-tc text-sm"
                style={{ backgroundColor: "oklch(0.7 0.2 25)", color: "white" }}
              >
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full py-2 rounded-lg font-sans-tc font-medium text-white transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "oklch(0.18 0.06 250)" }}
            >
              {isLoading ? "驗證中..." : "登錄"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
            <p
              className="font-sans-tc text-xs text-center"
              style={{ color: "rgba(0,0,0,0.5)" }}
            >
              返回首頁？
              <a
                href="/"
                className="ml-1 font-medium transition-colors hover:opacity-70"
                style={{ color: "oklch(0.18 0.06 250)" }}
              >
                點擊這裡
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
