# ConnectDevs — Feature Specifications

> Detailed specs for each planned feature, organized by priority tier.
> Each spec includes: description, scope, new files, API needs, and acceptance criteria.

---

## Tier 1 — Quick Wins

### FEAT-01: Protected Routes & Auth Guard

**Goal**: Prevent unauthenticated users from seeing feed/profile/connections. Redirect to `/login`.

**Scope**:
- New component: `src/components/ProtectedRoute.jsx`
- Wraps authenticated routes in `App.jsx`
- Shows a skeleton/loading state while verifying auth
- Redirects to `/login` if no user in store and API returns 401

**New Files**:
- `src/components/ProtectedRoute.jsx`

**Changes**:
- `src/App.jsx` — wrap authenticated routes with `<ProtectedRoute>`
- `src/Body.jsx` — move auth check logic into ProtectedRoute

**API**: Uses existing `GET /profile/view`

**Acceptance Criteria**:
- [ ] Visiting `/` without auth redirects to `/login`
- [ ] Visiting `/profile`, `/connections`, `/requests` without auth redirects to `/login`
- [ ] Login page is accessible without auth
- [ ] After login, user is redirected to `/`
- [ ] Loading skeleton shows while auth is being checked

---

### FEAT-02: Custom 404 Page

**Goal**: Show a terminal-themed "command not found" page for invalid routes.

**Scope**:
- New component: `src/components/NotFound.jsx`
- Add catch-all route `*` in `App.jsx`

**New Files**:
- `src/components/NotFound.jsx`

**Changes**:
- `src/App.jsx` — add `<Route path="*" element={<NotFound />} />`

**Design**:
```
$ cd /invalid-path
bash: cd: /invalid-path: No such file or directory

[Go Home]
```

**Acceptance Criteria**:
- [ ] Visiting any undefined route shows the 404 page
- [ ] "Go Home" button navigates to `/`
- [ ] Terminal aesthetic matches the rest of the app

---

## Tier 2 — Profile & Feed Enhancement

### FEAT-03: Tech Stack / Skills Tags

**Goal**: Users can add their tech skills to their profile. Skills appear as tags on UserCard and profile.

**Scope**:
- Update `EditProfile.jsx` — add a tag input for skills
- Update `UserCard.jsx` — display skill tags below the bio
- Update `Connections.jsx` and `Requests.jsx` — show skill tags inline

**New Files**:
- `src/components/SkillTagInput.jsx` — reusable tag input component
- `src/components/SkillBadge.jsx` — individual skill tag pill

**Changes**:
- `src/components/EditProfile.jsx` — add skills field
- `src/components/UserCard.jsx` — render skill badges
- `src/components/Connections.jsx` — show skills
- `src/components/Requests.jsx` — show skills

**Backend Needed**:
- Add `skills: [String]` to User model
- Allow `skills` in `PATCH /profile/edit`

**Design**:
- Tags styled as small pills: amber border, transparent bg, monospace text
- On UserCard: max 4 tags shown, "+N more" if overflow
- Edit: Type skill + Enter to add, click × to remove

**Acceptance Criteria**:
- [ ] User can add/remove skills on profile edit page
- [ ] Skills appear on UserCard in feed
- [ ] Skills appear on connection/request cards
- [ ] Max display limit with "+N more" overflow

---

### FEAT-04: Swipe Card UI

**Goal**: Replace pass/connect buttons with Tinder-style swipe gestures on the feed.

**Scope**:
- Install `react-tinder-card` or implement custom drag with CSS transforms
- Refactor `Feed.jsx` to show a stack of cards
- Add directional overlay (PASS ← → CONNECT) while dragging
- Animate card exit on swipe

**New Dependencies**:
- `react-tinder-card` (or `framer-motion`)

**Changes**:
- `src/components/Feed.jsx` — card stack + swipe logic
- `src/components/UserCard.jsx` — add swipe overlay states, make buttons optional fallback

**Design**:
- Card stack: current card on top, next card peeking behind (slightly smaller, offset)
- Swipe right: amber "CONNECT" overlay fades in
- Swipe left: red "PASS" overlay fades in
- On release: card flies off screen, next card animates up
- Keep pass/connect buttons below the card as fallback (mobile accessibility)

**Acceptance Criteria**:
- [ ] User can swipe cards left/right
- [ ] Correct API call fires on swipe (ignore/interested)
- [ ] Smooth card exit animation
- [ ] Next card animates into position
- [ ] Buttons still work as fallback
- [ ] Works on mobile touch

---

### FEAT-05: Skeleton Loaders

**Goal**: Show animated loading placeholders instead of blank screens while data loads.

**Scope**:
- Create reusable skeleton components
- Add to Feed, Connections, Requests, Profile pages

**New Files**:
- `src/components/skeletons/SkeletonCard.jsx` — mimics UserCard shape
- `src/components/skeletons/SkeletonListItem.jsx` — mimics connection/request row
- `src/components/skeletons/SkeletonProfile.jsx` — mimics edit profile layout

**Changes**:
- `src/components/Feed.jsx` — show SkeletonCard while `feed === null`
- `src/components/Connections.jsx` — show SkeletonListItem × 5 while loading
- `src/components/Requests.jsx` — show SkeletonListItem × 5 while loading
- `src/components/Profile.jsx` — show SkeletonProfile while loading

**Design**:
- Amber-tinted pulsing rectangles on elevated bg
- Terminal-style: pulsing `$ loading...` text above skeletons
- Card skeleton: gray rectangle for photo, 3 lines for text, 2 buttons

**Acceptance Criteria**:
- [ ] Each page shows skeleton while data is null/loading
- [ ] Skeletons match the shape of actual content
- [ ] Smooth transition from skeleton to real content
- [ ] No layout shift when content loads

---

## Tier 3 — Communication & Social

### FEAT-06: Real-time Chat

**Goal**: Let connected users chat in real time via Socket.io.

**Scope**:
- New pages: chat list + individual conversation
- Socket.io client for real-time messaging
- Message storage and retrieval
- Unread message indicator in navbar

**New Dependencies**:
- `socket.io-client`

**New Files**:
- `src/components/Chat.jsx` — chat list page
- `src/components/ChatWindow.jsx` — individual conversation view
- `src/components/MessageBubble.jsx` — single message component
- `src/utils/chatSlice.js` — Redux slice for chats
- `src/utils/socketManager.js` — Socket.io connection manager

**Changes**:
- `src/App.jsx` — add `/chat` and `/chat/:connectionId` routes
- `src/utils/appStore.js` — add chatReducer
- `src/components/Navbar.jsx` — add chat icon with unread badge
- `src/components/Connections.jsx` — add "Message" button on each connection

**Backend Needed**:
- Message model (sender, receiver, text, timestamp, read)
- `GET /chat/:userId` — get messages with a user
- `POST /chat/:userId` — send a message
- Socket.io events: `sendMessage`, `receiveMessage`, `typing`, `online`

**Design**:
- Chat list: connection avatars with last message preview, unread dot
- Chat window: terminal-style — messages look like command output
- Sent messages: right-aligned, amber bg
- Received messages: left-aligned, elevated bg
- Typing indicator: `user is typing...` with blinking cursor
- Timestamps in monospace, relative format ("2m ago")

**Acceptance Criteria**:
- [ ] User can see list of chat-able connections
- [ ] User can send and receive messages in real time
- [ ] Messages persist (reload shows history)
- [ ] Typing indicator shows when other user is typing
- [ ] Unread badge shows in navbar
- [ ] Clicking a connection in Connections page opens their chat

---

### FEAT-07: Notifications System

**Goal**: Real-time notifications for connection requests, acceptances, and messages.

**New Files**:
- `src/components/NotificationDropdown.jsx`
- `src/components/NotificationItem.jsx`
- `src/utils/notificationSlice.js`

**Changes**:
- `src/components/Navbar.jsx` — add bell icon with badge + dropdown
- `src/utils/appStore.js` — add notificationReducer

**Backend Needed**:
- Notification model (type, fromUser, message, read, createdAt)
- `GET /notifications` — get user notifications
- `PATCH /notifications/read` — mark as read
- Socket.io event: `newNotification`

**Notification Types**:
- `request_received` — "John sent you a connection request"
- `request_accepted` — "Jane accepted your request"
- `new_message` — "Mike sent you a message"

**Design**:
- Bell icon in navbar with amber badge count
- Dropdown: terminal-style list of notifications
- Each notification: avatar + message + relative timestamp
- Click notification → navigate to relevant page

**Acceptance Criteria**:
- [ ] Notifications appear in real time via Socket.io
- [ ] Badge count shows unread count
- [ ] Clicking notification navigates to relevant page
- [ ] "Mark all as read" clears badge
- [ ] Notifications persist on reload

---

## Tier 4 — Discovery & Integration

### FEAT-08: Search & Filter Developers

**Goal**: Search connections by name and filter the feed by skills/location.

**New Files**:
- `src/components/SearchBar.jsx` — debounced search input
- `src/components/FilterPanel.jsx` — filter options (skills, age, gender)

**Changes**:
- `src/components/Navbar.jsx` — add search icon/toggle
- `src/components/Connections.jsx` — add SearchBar above list, client-side filter
- `src/components/Feed.jsx` — add FilterPanel, pass filters to API

**Backend Needed**:
- `GET /feed?skills=React,Node&minAge=20&maxAge=35` — filtered feed
- `GET /user/connections?search=john` — search connections

**Design**:
- Search input: terminal-style with `$` prefix and amber focus
- Filter panel: collapsible, skill tag checkboxes, range sliders
- Results update as user types (300ms debounce)

**Acceptance Criteria**:
- [ ] User can search connections by name
- [ ] User can filter feed by skills
- [ ] Results update with debounce (no excessive API calls)
- [ ] Clear filters button resets to default
- [ ] Empty search results show terminal-style message

---

### FEAT-09: GitHub Integration

**Goal**: Connect GitHub account to enrich profile with repos, languages, and contributions.

**New Files**:
- `src/components/GitHubConnect.jsx` — OAuth connect button
- `src/components/GitHubProfile.jsx` — display GitHub data on profile
- `src/components/RepoCard.jsx` — individual repo display

**Changes**:
- `src/components/EditProfile.jsx` — add "Connect GitHub" section
- `src/components/UserCard.jsx` — show top language badge
- `src/components/Profile.jsx` — show GitHub section if connected

**Backend Needed**:
- GitHub OAuth flow (client_id, redirect, token exchange)
- Store GitHub username + access token on user model
- `GET /github/repos/:userId` — proxy to GitHub API for user repos
- `GET /github/profile/:userId` — GitHub profile data

**Design**:
- "Connect GitHub" button: GitHub icon + amber outline
- Repos displayed as terminal `ls` output:
  ```
  $ ls repos/
  drwxr-xr-x  ConnectDevs     ★ 42  JavaScript
  drwxr-xr-x  portfolio       ★ 18  TypeScript
  ```
- Languages as small colored dots (like GitHub)
- Contribution activity: "X contributions this year" with mini bar chart

**Acceptance Criteria**:
- [ ] User can connect GitHub via OAuth
- [ ] Top repos shown on profile
- [ ] Primary language shown as badge on UserCard
- [ ] Disconnect GitHub option available
- [ ] Graceful handling if GitHub API is down

---

## Tier 5 — Polish & Safety

### FEAT-10: Dark/Light Theme Toggle

**Goal**: Let users switch between Amber Terminal (dark) and a light theme.

**Changes**:
- `tailwind.config.js` — add `"terminal-light"` DaisyUI theme
- `src/components/Navbar.jsx` — add theme toggle icon
- `src/index.css` — light theme variable overrides
- Store preference in `localStorage`

**Acceptance Criteria**:
- [ ] Toggle switches theme instantly
- [ ] Preference persists across sessions
- [ ] All components look correct in both themes

---

### FEAT-11: Block / Report User

**Goal**: Users can block or report inappropriate profiles.

**New Files**:
- `src/components/ReportModal.jsx`

**Changes**:
- `src/components/UserCard.jsx` — add "..." menu with block/report
- `src/components/Connections.jsx` — add block option

**Backend Needed**:
- `POST /user/block/:userId`
- `POST /user/report/:userId` with reason

**Acceptance Criteria**:
- [ ] Blocked users don't appear in feed
- [ ] Block is reversible from settings
- [ ] Report sends data to backend with reason

---

### FEAT-12: Forgot Password & Email Verification

**Goal**: Standard auth recovery and verification flows.

**New Files**:
- `src/components/ForgotPassword.jsx`
- `src/components/ResetPassword.jsx`
- `src/components/VerifyEmail.jsx`

**Changes**:
- `src/App.jsx` — add routes
- `src/components/Login.jsx` — add "Forgot password?" link

**Backend Needed**:
- Email service (SendGrid/Nodemailer)
- `POST /auth/forgot-password` — send reset email
- `POST /auth/reset-password` — reset with token
- `POST /auth/verify-email` — verify email token

**Acceptance Criteria**:
- [ ] User receives password reset email
- [ ] Reset link works and updates password
- [ ] New users receive verification email
- [ ] Unverified users see reminder banner

---

## Build Priority Order

| Order | Feature | Effort | Impact |
|-------|---------|--------|--------|
| 1     | FEAT-01: Protected Routes    | Small  | High   |
| 2     | FEAT-02: 404 Page            | Small  | Medium |
| 3     | FEAT-03: Tech Stack Tags     | Medium | High   |
| 4     | FEAT-05: Skeleton Loaders    | Medium | Medium |
| 5     | FEAT-04: Swipe Card UI       | Medium | High   |
| 6     | FEAT-06: Real-time Chat      | Large  | High   |
| 7     | FEAT-07: Notifications       | Medium | High   |
| 8     | FEAT-08: Search & Filters    | Medium | Medium |
| 9     | FEAT-09: GitHub Integration  | Large  | Medium |
| 10    | FEAT-10: Theme Toggle        | Small  | Low    |
| 11    | FEAT-11: Block/Report        | Medium | Medium |
| 12    | FEAT-12: Auth Flows          | Large  | Medium |
