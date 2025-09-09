import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import TodoPage from "./pages/TodoPage";
import Error404 from "./pages/Error404";
import Login from "./pages/Login";
import { useEffect, useState, type ReactElement } from "react";
import Register from "./pages/Register";
import { isAuthenticated } from "./utils/auth";




function App() {
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, [])


  const handleLogin = () => {
    setAuthenticated(true);
  };

  const ProtectedRoute = ({ children }: { children: ReactElement }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
  };

  return (
    <>
      <Router>
        <Routes>
          <Route 
          path="/" 
          element={<ProtectedRoute>
            <TodoPage />
          </ProtectedRoute>} />

          <Route path="/login" element={<Login onLogin={handleLogin}/>} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />

          {/**Error page */}
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Router>
    </>

  )
}

export default App
