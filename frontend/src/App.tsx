import { Route, Routes } from "react-router-dom"
import Navbar from "./components/navigations/Navbar"
import HomePage from "./pages/HomePage"
import MoviePage from "./pages/MoviePage"
import AnimePage from "./pages/AnimePage"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import ForgotPassword from "./pages/ForgotPassword"
import VerifyQuestions from "./pages/VerifyQuestions"
import SetNewPassword from "./pages/SetNewPassword"
import { AuthProvider } from "./context/AuthContext"
import ProfilePage from "./pages/ProfilePage"
import PartyPage from "./pages/PartyPage"
import BrowsePage from "./pages/BrowsePage"

const App = () => {
  return (
    <AuthProvider>
      <div >
        <Navbar/>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MoviePage />} />
          <Route path="/anime" element={<AnimePage />} />
          <Route path="/movies" element={<BrowsePage label="Browse" heading="Popular Movies" category="popular" badge="Popular" />} />
          <Route path="/trending" element={<BrowsePage label="This Week" heading="Trending Movies" category="trending" badge="Trending" />} />
          <Route path="/coming-soon" element={<BrowsePage label="Mark Your Calendar" heading="Coming Soon" category="upcoming" badge="Coming Soon" />} />
          <Route path="/sign" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-questions" element={<VerifyQuestions />} />
          <Route path="/set-password" element={<SetNewPassword />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/party/:id" element={<PartyPage />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
