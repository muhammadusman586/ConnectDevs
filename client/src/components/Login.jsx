import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          email: emailId,
          password: password,
        },
        {
          withCredentials: true,
        }
      );
      dispatch(addUser(res.data));
      return navigate("/");
    } catch (err) {
      setError(err?.response?.data || "Something went Wrong!");
      console.error(err);
    }
  };
  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, email: emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      return navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="bg-elevated border border-border rounded-xl shadow-term overflow-hidden">
          {/* Terminal title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]/90" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/90" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]/90" />
            <span className="ml-3 font-mono text-xs text-muted">
              {isLoginForm ? "login" : "signup"}.sh
            </span>
          </div>

          {/* Form body */}
          <div className="p-6 space-y-5">
            <div className="text-center space-y-1">
              <h2 className="font-display font-bold text-2xl text-body">
                {isLoginForm ? "Welcome back" : "Create account"}
              </h2>
              <p className="font-mono text-xs text-muted">
                {isLoginForm
                  ? "// authenticate to continue"
                  : "// join the developer network"}
              </p>
            </div>

            <div className="space-y-4">
              {!isLoginForm && (
                <>
                  <div>
                    <label className="block font-mono text-xs text-muted mb-1.5">
                      firstName
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      className="terminal-input"
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-muted mb-1.5">
                      lastName
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      className="terminal-input"
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block font-mono text-xs text-muted mb-1.5">
                  email
                </label>
                <input
                  type="text"
                  value={emailId}
                  className="terminal-input"
                  onChange={(e) => setEmailId(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-muted mb-1.5">
                  password
                </label>
                <input
                  type="password"
                  value={password}
                  className="terminal-input"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <p className="font-mono text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-lg">
                ✗ {error}
              </p>
            )}

            <button
              className="w-full py-2.5 px-4 bg-accent text-bg font-display font-semibold rounded-lg hover:bg-accent-bright transition-all duration-200 active:scale-[0.98] shadow-glow-sm"
              onClick={isLoginForm ? handleLogin : handleSignUp}
            >
              {isLoginForm ? "Login" : "Sign Up"}
            </button>

            <p
              className="text-center font-mono text-xs text-muted cursor-pointer hover:text-accent transition-colors duration-200"
              onClick={() => setIsLoginForm((value) => !value)}
            >
              {isLoginForm
                ? "→ New user? Sign up here"
                : "→ Already have an account? Login"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
