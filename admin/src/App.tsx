import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import DashboardPage from "@/pages/DashboardPage";
import BusinessPage from "@/pages/BusinessPage";
import CampaignForm from "@/pages/CampaignForm";
import GroupsPage from "./components/groups/Groups.jsx";
import Login from "@/pages/Login";
import Settings from "./pages/Settings.jsx";
import CampaignsPage from "./pages/Campaigns.jsx";
import CampaignDetails from "./pages/CampaignDetails.jsx";
import Wallet from './pages/Wallet.jsx'

// Create QueryClient instance
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

// Protected Route Component
const ProtectedRoute = ({ children, activeSection }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const [businesses, setBusinesses] = useState([]);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout
      projects={[]}
      selectedProject={null}
      setSelectedProject={() => {}}
      companies={businesses}
      selectedCompany="all"
      setSelectedCompany={() => {}}
      activeSection={activeSection}
      setActiveSection={() => {}}
    >
      {children}
    </MainLayout>
  );
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const PlaceholderPage = ({ title }) => {
  return (
    <div className="container mx-auto p-6">
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚧</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600 mb-6">This page is under development</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

function AppContent() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute activeSection="dashboard">
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wallet"
            element={
              <ProtectedRoute activeSection="wallet">
                <Wallet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/business"
            element={
              <ProtectedRoute activeSection="businesses">
                <BusinessPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/campaignform"
            element={
              <ProtectedRoute activeSection="campaigns">
                <CampaignForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/campaigns"
            element={
              <ProtectedRoute activeSection="campaigns">
                <CampaignsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/campaigns/:id"
            element={
              <ProtectedRoute activeSection="campaigns/:id">
                <CampaignDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute activeSection="campaigns">
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/groups"
            element={
              <ProtectedRoute activeSection="groups">
                <GroupsPage />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to login if not authenticated, dashboard if authenticated */}
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
