import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import TodoPage from "./pages/TodoPage";
import Error404 from "./pages/Error404";
import Login from "./pages/Login";
import { useEffect, useState, type ReactElement } from "react";
import Register from "./pages/Register";




function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
   const local = localStorage.getItem("isLoggedIn")
   const session = sessionStorage.getItem("isLoggedIn")
   setIsAuthenticated(local === "true" || session === "true")
  }, [])


  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const ProtectedRoute = ({ children }: { children: ReactElement }) => {
      if(localStorage.getItem("isLoggedIn") === "true" || sessionStorage.getItem("isLoggedIn") === "true"){
        return children
      } else{
        return <Navigate to="/login/" />
      }
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
