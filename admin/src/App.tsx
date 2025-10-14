import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import DashboardPage from "@/pages/DashboardPage";
import Login from "@/pages/Login";
import Settings from "./pages/Settings.jsx";
import PlaceholderPage from "@/components/ui/PlaceHolderPage";
import CreateBlog from './pages/CreateBlog.jsx'

import AllBlogsPage from './pages/AllBlogs.jsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: (failureCount, error) => {
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

const ProtectedRoute = ({ children, activeSection }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout activeSection={activeSection} setActiveSection={() => {}}>
      {children}
    </MainLayout>
  );
};

const PublicRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppContent() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute activeSection="dashboard">
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/blogs"
            element={
              <ProtectedRoute activeSection="blogs">
                <AllBlogsPage title="All Blogs" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/blogs/create"
            element={
              <ProtectedRoute activeSection="blogs-create">
                <CreateBlog title="Create Blog" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/blogs/:id"
            element={
              <ProtectedRoute activeSection="blogs">
                <PlaceholderPage title="Blog Details" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/comments"
            element={
              <ProtectedRoute activeSection="comments">
                <PlaceholderPage title="Comments Management" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reactions"
            element={
              <ProtectedRoute activeSection="reactions">
                <PlaceholderPage title="Reactions Overview" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute activeSection="users">
                <PlaceholderPage title="User Management" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute activeSection="settings">
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              localStorage.getItem("isLoggedIn") === "true" ? (
                <Navigate to="/" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>

        <Toaster position="top-right" richColors closeButton duration={4000} />
      </div>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;