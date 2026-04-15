/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
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
  const user = useSelector((store) => store.user.data);
  const authChecked = useSelector((store) => store.user.authChecked);
  const dispatch = useDispatch();
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(false);
  const [guestFeed, setGuestFeed] = useState(null);

  const isGuest = !user;

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

  const getGuestFeed = async () => {
    if (guestFeed) return;
    setLoading(true);
    try {
      const res = await axios.get(BASE_URL + "/feed/public?limit=20");
      setGuestFeed(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authChecked) return;
    if (isGuest) {
      getGuestFeed();
    } else {
      getFeed();
    }
  }, [isGuest, authChecked]);

  // Re-fetch when filters change (auth only)
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    if (!isGuest && feed !== null) {
      getFeed(true);
    }
  }, [filters]);

  const activeFeed = isGuest ? guestFeed : feed;

  // Build refs for each card so we can trigger swipe programmatically
  const cardRefs = useMemo(() => {
    if (!activeFeed) return [];
    return activeFeed.map(() => ({ current: null }));
  }, [activeFeed]);

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

  const onSwipe = (direction, swipedUser) => {
    setSwipeDirection(null);
    if (isGuest) return; // guests can't swipe
    const status = direction === "right" ? "interested" : "ignore";
    handleSendRequest(status, swipedUser._id);
  };

  const onCardLeftScreen = () => {
    setSwipeDirection(null);
  };

  const swipeProgrammatic = (dir) => {
    if (isGuest) return;
    if (!activeFeed || activeFeed.length === 0) return;
    const topIndex = activeFeed.length - 1;
    const ref = cardRefs[topIndex];
    if (ref?.current) {
      ref.current.swipe(dir);
    }
  };

  if (!activeFeed || loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <p className="font-mono text-xs text-muted mb-6">
          <span className="text-accent">$</span> loading feed
          <span className="animate-blink ml-1 text-accent">▋</span>
        </p>
        <SkeletonCard />
      </div>
    );

  if (activeFeed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        {!isGuest && (
          <div className="mb-6 w-full max-w-sm">
            <FilterPanel
              filters={filters}
              onChange={handleFilterChange}
              onReset={() => setFilters(DEFAULT_FILTERS)}
            />
          </div>
        )}
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
      {/* Guest banner */}
      {isGuest && (
        <div className="w-full max-w-sm mb-4 animate-fade-in">
          <div className="bg-accent/10 border border-accent/30 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
            <p className="font-mono text-xs text-accent">
              👋 Browsing as guest
            </p>
            <Link
              to="/login"
              className="shrink-0 px-3 py-1.5 bg-accent text-bg font-mono text-xs font-semibold rounded-lg hover:bg-accent-bright transition-all duration-200"
            >
              Sign up
            </Link>
          </div>
        </div>
      )}

      {!isGuest && (
        <div className="mb-4 w-full max-w-sm">
          <FilterPanel
            filters={filters}
            onChange={handleFilterChange}
            onReset={() => setFilters(DEFAULT_FILTERS)}
          />
        </div>
      )}

      <div className="mb-4 text-center">
        <p className="font-mono text-xs text-muted">
          <span className="text-accent">$</span> discover developers
          <span className="animate-blink ml-1 text-accent">▋</span>
        </p>
      </div>

      {/* Card stack */}
      <div className="relative w-full max-w-sm h-[480px]">
        {activeFeed.map((cardUser, index) => (
          <TinderCard
            ref={(el) => {
              if (cardRefs[index]) cardRefs[index].current = el;
            }}
            key={cardUser._id}
            onSwipe={(dir) => onSwipe(dir, cardUser)}
            onCardLeftScreen={onCardLeftScreen}
            onSwipeRequirementFulfilled={(dir) => setSwipeDirection(dir)}
            onSwipeRequirementUnfulfilled={() => setSwipeDirection(null)}
            preventSwipe={isGuest ? ["left", "right", "up", "down"] : ["up", "down"]}
            swipeRequirementType="position"
            swipeThreshold={80}
            className="absolute inset-0"
          >
            <div
              className="w-full transition-transform duration-300"
              style={{
                transform:
                  index < activeFeed.length - 1
                    ? `scale(${0.95 - (activeFeed.length - 1 - index) * 0.03}) translateY(${(activeFeed.length - 1 - index) * 12}px)`
                    : "none",
                zIndex: index,
                opacity: index < activeFeed.length - 3 ? 0 : 1,
              }}
            >
              <UserCard
                user={cardUser}
                hideActions
                swipeDirection={
                  index === activeFeed.length - 1 ? swipeDirection : null
                }
              />
            </div>
          </TinderCard>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-4 mt-6 animate-fade-in">
        {isGuest ? (
          <Link
            to="/login"
            className="px-6 py-3 bg-accent text-bg font-display font-semibold rounded-full hover:bg-accent-bright transition-all duration-200 shadow-glow-sm"
          >
            Sign up to connect →
          </Link>
        ) : (
          <>
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
          </>
        )}
      </div>

      <p className="font-mono text-[10px] text-muted/40 mt-3">
        {isGuest ? "sign up to swipe and connect" : `swipe or tap · ${activeFeed.length} remaining`}
      </p>
    </div>
  );
};

export default Feed;
