import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { BreadcrumbSchema } from "./components/BreadcrumbSchema";

const Home = lazy(() => import("./pages/Home"));
const ConsultationPage = lazy(() => import("./pages/ConsultationPage"));
const SubmissionsPage = lazy(() => import("./pages/SubmissionsPage"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));

function RouteLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <p className="text-sm text-muted-foreground">頁面載入中…</p>
    </main>
  );
}

function EnterpriseEntryPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground">
      <section className="w-full max-w-lg rounded-2xl border bg-white p-8 shadow-sm">
        <p className="mb-3 text-sm tracking-widest text-muted-foreground">BRAVO CAREER CENTER</p>
        <h1 className="font-serif-tc text-2xl font-bold">人才管理｜企業登入</h1>
        <p className="mt-4 font-medium">企業平台建置中</p>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          平台將提供招募需求、約聘人才出缺勤紀錄及人才費用查詢。企業帳號登入功能尚未開放。
        </p>
        <a href="/#contact" className="mt-6 inline-flex rounded-full bg-amber-700 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-800">
          聯絡 BRAVO
        </a>
        <a href="/" className="ml-4 inline-block text-sm underline underline-offset-4">返回官網</a>
      </section>
    </main>
  );
}

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Suspense fallback={<RouteLoading />}>
      <Switch>
      <Route path="/" component={Home} />
      <Route path="/consultation" component={ConsultationPage} />
      <Route path="/enterprise/login" component={EnterpriseEntryPage} />
      <Route path="/admin" component={AdminLoginPage} />
      <Route path="/submissions" component={SubmissionsPage} />
      <Route path="/404" component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          {/* BreadcrumbList Schema */}
          <BreadcrumbSchema />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
