import { Route, Routes } from "react-router-dom"
import Navbar from "./components/navigations/Navbar"
import HomePage from "./pages/HomePage"
import MoviePage from "./pages/MoviePage"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import ForgotPassword from "./pages/ForgotPassword"
import VerifyQuestions from "./pages/VerifyQuestions"
import SetNewPassword from "./pages/SetNewPassword"
import { AuthProvider } from "./context/AuthContext"

const App = () => {
  return (
    <AuthProvider>
      <div >
        <Navbar/>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MoviePage />} />
          <Route path="/sign" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-questions" element={<VerifyQuestions />} />
          <Route path="/set-password" element={<SetNewPassword />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
