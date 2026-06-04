/**
 * Navbar — 築夢人生涯諮詢服務有限公司
 * 設計：溫暖敘事設計 | 靛藍 + 暖橘 | Noto Serif TC
 * 滾動後加入背景模糊效果，手機版漢堡選單
 */
import { useState, useEffect } from "react";
import { Menu, X, Lock } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";

const navItems = [
  { label: "服務特色", href: "#features" },
  { label: "核心服務", href: "#services" },
  { label: "服務流程", href: "#process" },
  { label: "品牌故事", href: "#about" },
  { label: "文章故事", href: "https://bravocareercenter.medium.com", external: true },
  { label: "聯絡我們", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleAdminClick = () => {
    setMobileOpen(false);
    navigate("/admin/contacts");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100"
          : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16 lg:h-20">
        {/* Logo */}
        <a
          href="#"
          className="flex items-center gap-2 leading-tight"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        >
          <img
            src="/manus-storage/bravo-logo_76062bf7.webp"
            alt="Bravo Career Center Logo"
            className="h-10 lg:h-12 w-auto"
          />
          <div className="hidden sm:flex flex-col">
            <span
              className="font-serif-tc font-bold text-sm lg:text-base"
              style={{ color: "oklch(0.28 0.08 250)" }}
            >
              策夢人
            </span>
            <span
              className="font-lato text-xs tracking-widest leading-none"
              style={{ color: "oklch(0.62 0.15 45)", fontSize: "0.65rem" }}
            >
              BRAVO CAREER CENTER
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans-tc text-sm font-medium transition-colors duration-200 hover:text-amber-600 relative group"
                style={{ color: scrolled ? "oklch(0.28 0.08 250)" : "oklch(0.28 0.08 250)" }}
              >
                {item.label}
                <span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-200 group-hover:w-full rounded-full"
                  style={{ backgroundColor: "oklch(0.62 0.15 45)" }}
                />
              </a>
            ) : (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="font-sans-tc text-sm font-medium transition-colors duration-200 hover:text-amber-600 relative group"
                style={{ color: scrolled ? "oklch(0.28 0.08 250)" : "oklch(0.28 0.08 250)" }}
              >
                {item.label}
                <span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-200 group-hover:w-full rounded-full"
                  style={{ backgroundColor: "oklch(0.62 0.15 45)" }}
                />
              </button>
            )
          )}

          {/* Admin Button - Only show for logged-in admin users */}
          {user?.role === "admin" && (
            <button
              onClick={handleAdminClick}
              className="font-sans-tc text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 border"
              style={{
                color: "oklch(0.28 0.08 250)",
                borderColor: "oklch(0.28 0.08 250)",
              }}
              title="進入後台管理"
            >
              <Lock size={16} />
              <span>後台</span>
            </button>
          )}

          <button
            onClick={() => handleNavClick("#contact")}
            className="font-sans-tc text-sm font-semibold px-5 py-2 rounded-full text-white transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "oklch(0.62 0.15 45)" }}
          >
            立即諮詢
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-md"
          style={{ color: "oklch(0.28 0.08 250)" }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="開啟選單"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 shadow-lg">
            <nav className="container py-4 flex flex-col gap-1">
              {navItems.map((item) =>
                item.external ? (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans-tc text-sm font-medium py-3 px-2 text-left rounded-lg transition-colors hover:bg-slate-50"
                    style={{ color: "oklch(0.28 0.08 250)" }}
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    key={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className="font-sans-tc text-sm font-medium py-3 px-2 text-left rounded-lg transition-colors hover:bg-slate-50"
                    style={{ color: "oklch(0.28 0.08 250)" }}
                  >
                    {item.label}
                  </button>
                )
              )}

              {/* Admin Button - Mobile */}
              {user?.role === "admin" && (
                <button
                  onClick={handleAdminClick}
                  className="font-sans-tc text-sm font-medium py-3 px-2 text-left rounded-lg transition-colors hover:bg-slate-50 flex items-center gap-2"
                  style={{ color: "oklch(0.28 0.08 250)" }}
                >
                  <Lock size={16} />
                  <span>進入後台</span>
                </button>
              )}

              <button
                onClick={() => handleNavClick("#contact")}
                className="mt-2 font-sans-tc text-sm font-semibold py-3 rounded-full text-white text-center"
                style={{ backgroundColor: "oklch(0.62 0.15 45)" }}
              >
                立即諮詢
              </button>
            </nav>
          </div>
        )}
    </header>
  );
}
