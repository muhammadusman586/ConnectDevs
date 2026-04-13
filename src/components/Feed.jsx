/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    if (feed) return;

    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getFeed();
  }, []);

  if (!feed) return null;

  if (feed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="font-mono text-muted text-sm space-y-2">
          <p>
            <span className="text-accent">$</span> scanning network...
          </p>
          <p className="text-muted/60">
            No new developers found. Check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="mb-6 text-center">
        <p className="font-mono text-xs text-muted">
          <span className="text-accent">$</span> discover developers
          <span className="animate-blink ml-1 text-accent">▋</span>
        </p>
      </div>
      <UserCard user={feed[0]} />
    </div>
  );
};

export default Feed;
