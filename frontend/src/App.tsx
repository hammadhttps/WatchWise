import { Route, Routes } from "react-router-dom"
import Navbar from "./components/navigations/Navbar"
import HomePage from "./pages/HomePage"
import MoviePage from "./pages/MoviePage"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"

const App = () => {
  return (
    <div >
      <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MoviePage />} />
        <Route path="/sign" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>

    </div>
  )
}

export default App