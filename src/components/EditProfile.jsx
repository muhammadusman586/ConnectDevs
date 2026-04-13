/* eslint-disable react/prop-types */
import { useState } from "react";
import UserCard from "./UserCard";
import SkillTagInput from "./SkillTagInput";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [skills, setSkills] = useState(user.skills || []);
  const [toast, setToast] = useState(false);

  const dispatch = useDispatch();

  const [error, setError] = useState("");

  const setProfile = async () => {
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photoUrl,
          age,
          gender,
          about,
          skills,
        },
        { withCredentials: true }
      );

      dispatch(addUser(res?.data?.data));
      setToast(true);
      setTimeout(() => {
        setToast(false);
      }, 3000);
    } catch (error) {
      setError(error.response.data);
    }
  };

  const fields = [
    { label: "firstName", value: firstName, setter: setFirstName },
    { label: "lastName", value: lastName, setter: setLastName },
    { label: "photoUrl", value: photoUrl, setter: setPhotoUrl },
    { label: "age", value: age, setter: setAge },
    { label: "gender", value: gender, setter: setGender },
    { label: "about", value: about, setter: setAbout },
  ];

  return (
    <>
      <div className="flex flex-col lg:flex-row items-start justify-center gap-8 px-4 py-6 max-w-5xl mx-auto">
        {/* Edit form */}
        <div className="w-full max-w-md animate-slide-up">
          <div className="bg-elevated border border-border rounded-xl shadow-term overflow-hidden">
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]/90" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/90" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]/90" />
              <span className="ml-3 font-mono text-xs text-muted">
                edit-profile.sh
              </span>
            </div>

            <div className="p-6 space-y-4">
              <h2 className="font-display font-bold text-xl text-body">
                Edit Profile
              </h2>

              {fields.map(({ label, value, setter }) => (
                <div key={label}>
                  <label className="block font-mono text-xs text-muted mb-1.5">
                    {label}
                  </label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    className="terminal-input"
                  />
                </div>
              ))}

              <SkillTagInput skills={skills} onChange={setSkills} />

              {error && (
                <p className="font-mono text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-lg">
                  ✗ {error}
                </p>
              )}

              <button
                className="w-full py-2.5 px-4 bg-accent text-bg font-display font-semibold rounded-lg hover:bg-accent-bright transition-all duration-200 active:scale-[0.98] shadow-glow-sm mt-2"
                onClick={setProfile}
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>

        {/* Preview card */}
        <div
          className="w-full max-w-sm animate-slide-up"
          style={{ animationDelay: "0.15s" }}
        >
          <p className="font-mono text-xs text-muted mb-3">
            <span className="text-accent">$</span> preview
          </p>
          <UserCard
            user={{ firstName, lastName, photoUrl, age, gender, about, skills }}
          />
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="bg-elevated border border-accent/30 text-accent font-mono text-sm px-5 py-3 rounded-xl shadow-glow">
            ✓ Profile updated successfully
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
