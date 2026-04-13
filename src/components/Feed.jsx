/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addFeed, removeUserFromFeed } from "../utils/feedSlice";
import { useEffect, useMemo, useState, useCallback } from "react";
import TinderCard from "react-tinder-card";
import UserCard from "./UserCard";
import SkeletonCard from "./skeletons/SkeletonCard";
import FilterPanel from "./FilterPanel";

const DEFAULT_FILTERS = { skills: [], minAge: "", maxAge: "", gender: "" };

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(false);

  const buildQuery = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.skills.length > 0)
      params.set("skills", filters.skills.join(","));
    if (filters.minAge) params.set("minAge", filters.minAge);
    if (filters.maxAge) params.set("maxAge", filters.maxAge);
    if (filters.gender) params.set("gender", filters.gender);
    return params.toString();
  }, [filters]);

  const getFeed = async (force = false) => {
    if (feed && !force) return;
    setLoading(true);
    try {
      const query = buildQuery();
      const url = BASE_URL + "/feed" + (query ? "?" + query : "");
      const res = await axios.get(url, { withCredentials: true });
      dispatch(addFeed(res?.data?.data));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  // Re-fetch when filters change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const applyFilters = () => {
    getFeed(true);
  };

  // Apply filters on filter change (debounced via user clicking)
  useEffect(() => {
    // Only refetch if feed already loaded (skip initial)
    if (feed !== null) {
      getFeed(true);
    }
  }, [filters]);

  // Build refs for each card so we can trigger swipe programmatically
  const cardRefs = useMemo(() => {
    if (!feed) return [];
    return feed.map(() => ({ current: null }));
  }, [feed]);

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (error) {
      console.error(error);
    }
  };

  const onSwipe = (direction, user) => {
    setSwipeDirection(null);
    const status = direction === "right" ? "interested" : "ignore";
    handleSendRequest(status, user._id);
  };

  const onCardLeftScreen = () => {
    setSwipeDirection(null);
  };

  const swipeProgrammatic = (dir) => {
    if (!feed || feed.length === 0) return;
    const topIndex = feed.length - 1;
    const ref = cardRefs[topIndex];
    if (ref?.current) {
      ref.current.swipe(dir);
    }
  };

  if (!feed || loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <p className="font-mono text-xs text-muted mb-6">
          <span className="text-accent">$</span> loading feed
          <span className="animate-blink ml-1 text-accent">▋</span>
        </p>
        <SkeletonCard />
      </div>
    );

  if (feed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="mb-6 w-full max-w-sm">
          <FilterPanel
            filters={filters}
            onChange={handleFilterChange}
            onReset={() => setFilters(DEFAULT_FILTERS)}
          />
        </div>
        <div className="font-mono text-muted text-sm space-y-2">
          <p>
            <span className="text-accent">$</span> scanning network...
          </p>
          <p className="text-muted/60">
            No developers found. Try adjusting your filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="mb-4 w-full max-w-sm">
        <FilterPanel
          filters={filters}
          onChange={handleFilterChange}
          onReset={() => setFilters(DEFAULT_FILTERS)}
        />
      </div>

      <div className="mb-4 text-center">
        <p className="font-mono text-xs text-muted">
          <span className="text-accent">$</span> discover developers
          <span className="animate-blink ml-1 text-accent">▋</span>
        </p>
      </div>

      {/* Card stack */}
      <div className="relative w-full max-w-sm h-[480px]">
        {feed.map((user, index) => (
          <TinderCard
            ref={(el) => {
              if (cardRefs[index]) cardRefs[index].current = el;
            }}
            key={user._id}
            onSwipe={(dir) => onSwipe(dir, user)}
            onCardLeftScreen={onCardLeftScreen}
            onSwipeRequirementFulfilled={(dir) => setSwipeDirection(dir)}
            onSwipeRequirementUnfulfilled={() => setSwipeDirection(null)}
            preventSwipe={["up", "down"]}
            swipeRequirementType="position"
            swipeThreshold={80}
            className="absolute inset-0"
          >
            <div
              className="w-full transition-transform duration-300"
              style={{
                // Cards behind the top card are slightly scaled down and offset
                transform:
                  index < feed.length - 1
                    ? `scale(${0.95 - (feed.length - 1 - index) * 0.03}) translateY(${(feed.length - 1 - index) * 12}px)`
                    : "none",
                zIndex: index,
                opacity: index < feed.length - 3 ? 0 : 1,
              }}
            >
              <UserCard
                user={user}
                hideActions
                swipeDirection={
                  index === feed.length - 1 ? swipeDirection : null
                }
              />
            </div>
          </TinderCard>
        ))}
      </div>

      {/* Fallback buttons */}
      <div className="flex gap-4 mt-6 animate-fade-in">
        <button
          onClick={() => swipeProgrammatic("left")}
          className="w-14 h-14 flex items-center justify-center rounded-full bg-surface border border-border text-muted hover:border-red-400/40 hover:text-red-400 transition-all duration-200 active:scale-90"
          aria-label="Pass"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <button
          onClick={() => swipeProgrammatic("right")}
          className="w-14 h-14 flex items-center justify-center rounded-full bg-accent text-bg hover:bg-accent-bright transition-all duration-200 active:scale-90 shadow-glow-sm"
          aria-label="Connect"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      <p className="font-mono text-[10px] text-muted/40 mt-3">
        swipe or tap · {feed.length} remaining
      </p>
    </div>
  );
};

export default Feed;
