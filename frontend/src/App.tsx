import { Route, Routes } from "react-router-dom"
import Navbar from "./components/navigations/Navbar"
import HomePage from "./pages/HomePage"
import MoviePage from "./pages/MoviePage"

const App = () => {
  return (
    <div >
      <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MoviePage />} />
      </Routes>

    </div>
  )
}

export default App