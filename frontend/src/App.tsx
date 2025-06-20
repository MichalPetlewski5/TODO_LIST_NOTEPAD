import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import TodoPage from "./pages/TodoPage";
import Error404 from "./pages/Error404";
import Login from "./pages/Login";
import { useEffect, useState, type ReactElement } from "react";




function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") || sessionStorage.getItem("isLoggedIn")
    setIsAuthenticated(!!loggedIn)
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const ProtectedRoute = ({ children }: { children: ReactElement }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
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

          {/**Error page */}
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Router>
    </>

  )
}

export default App
