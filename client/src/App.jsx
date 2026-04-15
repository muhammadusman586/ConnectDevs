import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Body from "./Body";
import Login from "./components/Login";
import { Provider } from "react-redux";
import { appStore } from "./utils/appStore";
import Feed from "./components/Feed";
import Profile from "./components/Profile";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound";
import Chat from "./components/Chat";
import ChatWindow from "./components/ChatWindow";
import Explore from "./components/Explore";
import Leaderboard from "./components/Leaderboard";
import DevProfile from "./components/DevProfile";

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
            {/* Public routes */}
            <Route index element={<Feed />} />
            <Route path="/login" element={<Login />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/dev/:userId" element={<DevProfile />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat/:userId" element={<ChatWindow />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
