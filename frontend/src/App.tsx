import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import TodoPage from "./pages/TodoPage";
import Error404 from "./pages/Error404";
import Login from "./pages/Login";
import { useEffect, useState, type ReactElement } from "react";
import Register from "./pages/Register";
import { isAuthenticated } from "./utils/auth";




function App() {
  const [authState, setAuthState] = useState<boolean>(isAuthenticated());

  useEffect(() => {
    setAuthState(isAuthenticated());
  }, [])


  const handleAuthUpdate = () => {
    setAuthState(isAuthenticated());
  };

  const ProtectedRoute = ({ children }: { children: ReactElement }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
  };

return (
    <Router>
      <Routes>
        
        {/* Strona główna – chroniona JWT */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <TodoPage />
            </ProtectedRoute>
          }
        />

        {/* Logowanie – po zalogowaniu aktualizujemy stan */}
        <Route
          path="/login"
          element={<Login onLogin={handleAuthUpdate} />}
        />

        {/* Rejestracja – po rejestracji również zapisujemy token */}
        <Route
          path="/register"
          element={<Register onLogin={handleAuthUpdate} />}
        />

        {/* Strona błędu */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Router>
  );
}

export default App
