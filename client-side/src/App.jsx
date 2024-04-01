import { BrowserRouter, Routes, Route } from "react-router-dom";
import TodoPage from "./pages/TodoPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import { Outlet } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
// import { DATA } from "./utils.js";

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
          {/* <Route path="/login" element={<LoginPage/>}/> */}
          {/* <Route path="/register" element={<RegisterPage/>}/> */}
          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}
