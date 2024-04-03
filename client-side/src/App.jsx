import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import TodoPage from "./pages/TodoPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function App() {
  const clientId = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TodoPage />} />
          <Route path="/auth" element={<Outlet />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}
