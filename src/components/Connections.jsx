import axios from "axios";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addConnections } from "../utils/connectionSlice";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!connections) return null;

  if (connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="font-mono text-muted text-sm space-y-2">
          <p>
            <span className="text-accent">$</span> ls connections/
          </p>
          <p className="text-muted/60">
            Directory empty. Start connecting with developers!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-body">
          Connections
        </h1>
        <p className="font-mono text-xs text-muted mt-1">
          <span className="text-accent">$</span> ls connections/ —{" "}
          {connections.length} found
        </p>
      </div>

      <div className="space-y-3">
        {connections.map((connection, index) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } =
            connection;

          return (
            <div
              key={_id}
              className="flex items-center gap-4 p-4 bg-elevated border border-border rounded-xl card-glow animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <img
                alt={firstName}
                className="w-14 h-14 rounded-full object-cover border-2 border-border"
                src={photoUrl}
              />
              <div className="flex-1 min-w-0">
                <h2 className="font-display font-semibold text-body truncate">
                  {firstName + " " + lastName}
                </h2>
                {age && gender && (
                  <p className="font-mono text-xs text-muted">
                    <span className="text-accent/60">#</span> {age} · {gender}
                  </p>
                )}
                {about && (
                  <p className="text-sm text-muted/80 mt-1 truncate">{about}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Connections;