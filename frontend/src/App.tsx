import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import TodoPage from "./pages/TodoPage";
import Error404 from "./pages/Error404";




function App() {


  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<TodoPage />} />

          {/**Error page */}
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Router>
    </>

  )
}

export default App
