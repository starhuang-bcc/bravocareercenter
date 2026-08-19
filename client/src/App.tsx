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

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Suspense fallback={<RouteLoading />}>
      <Switch>
      <Route path="/" component={Home} />
      <Route path="/consultation" component={ConsultationPage} />
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
