# User Stories - Bingoal

## Application Structure

### Story: Base Technologies

- [ ] **As a** developer
      **I want to** use Astro as the base framework
      **So that** I can build a fast and modern web application

**Acceptance Criteria:**

- [ ] Astro is installed and configured
- [ ] Basic project structure is in place
- [ ] Development server runs without errors
- [ ] Basic routing is implemented

## User Management

### Story: User Registration

- [ ] **As a** new user
      **I want to** create an account using the "Sign in with XXX" method.
      **So that** I can track my personal yearly goals

**Acceptance Criteria:**

- [ ] User can use an existing account - OAuth with Google, GitHub, etc.
- [ ] User receives confirmation of successful registration
- [ ] No personal information is required beyond existing account information

### Story: User Login

- [ ] **As a** registered user  
       **I want to** log into my account  
       **So that** I can access my bingo boards

**Acceptance Criteria:**

- [ ] User can log in with existing account - "Sign in with Google", etc.
- [ ] User session is maintained across page refreshes

### Story: User Logout

- [ ] **As a** logged-in user  
       **I want to** log out of my account  
       **So that** I can keep my goals private on shared devices

**Acceptance Criteria:**

- [ ] User can log out from any page
- [ ] Session is cleared upon logout
- [ ] User is redirected to login page

---

**Note for AI Agent:** Do not work on anything below this line!

---

### Story: User Can Create Group

**As a** logged-in user  
**I want to** create a group that other users can join
**So that** I can share or collaborate on goals with others

**Acceptance Criteria:**

- User can create a group
- User can invite other users to join the group
- User can add goal boards to the group

---

**Note for AI Agent:** Do not work on anything below this line!

---

## User Management

### US-003: User Logout

**As a** logged-in user  
**I want to** log out of my account  
**So that** I can keep my goals private on shared devices

**Acceptance Criteria:**

- User can log out from any page
- Session is cleared upon logout
- User is redirected to login page

## Bingo Board Management

### US-004: Create Bingo Board

**As a** user  
**I want to** create a new bingo board for the year  
**So that** I can organize my yearly goals

**Acceptance Criteria:**

- User can create a new 5x5 bingo board
- User can set a title/name for the board
- User can specify the year for the board
- Board is saved and associated with the user

### US-005: View Bingo Boards

**As a** user  
**I want to** view all my bingo boards  
**So that** I can see my different goal collections

**Acceptance Criteria:**

- User sees a list/grid of all their boards
- Each board shows its title and year
- User can click to view board details

### US-006: Edit Bingo Board

**As a** user  
**I want to** edit my bingo board details  
**So that** I can update the title or year if needed

**Acceptance Criteria:**

- User can edit board title
- User can edit board year
- Changes are saved immediately or with confirmation

### US-007: Delete Bingo Board

**As a** user  
**I want to** delete a bingo board  
**So that** I can remove boards I no longer need

**Acceptance Criteria:**

- User can delete a board
- User receives confirmation before deletion
- Deleted boards are permanently removed

## Goal Management

### US-008: Add Goal to Board

**As a** user  
**I want to** add a goal to a specific square on my bingo board  
**So that** I can fill my board with yearly objectives

**Acceptance Criteria:**

- User can click on an empty square to add a goal
- User can enter goal text/description
- Goal is saved to the specific square
- Maximum character limit is enforced for readability

### US-009: Edit Goal

**As a** user  
**I want to** edit an existing goal  
**So that** I can refine or update my objectives

**Acceptance Criteria:**

- User can click on a filled square to edit
- User can modify the goal text
- Changes are saved

### US-010: Delete Goal

**As a** user  
**I want to** remove a goal from a square  
**So that** I can clear unwanted goals

**Acceptance Criteria:**

- User can delete a goal from a square
- Square becomes empty after deletion
- User receives confirmation before deletion

### US-011: Mark Goal as Complete

**As a** user  
**I want to** mark a goal as completed  
**So that** I can track my progress throughout the year

**Acceptance Criteria:**

- User can mark/unmark a goal as complete
- Completed goals are visually distinct (e.g., different color, checkmark)
- Completion status is saved

### US-012: View Goal Details

**As a** user  
**I want to** view full details of a goal  
**So that** I can see the complete description if it's long

**Acceptance Criteria:**

- User can click/hover to see full goal text
- Modal or tooltip displays complete information
- Easy to close and return to board view

## Progress Tracking

### US-013: View Board Progress

**As a** user  
**I want to** see my completion progress on each board  
**So that** I can track how many goals I've achieved

**Acceptance Criteria:**

- Board shows percentage or count of completed goals
- Progress indicator is visible on board list view
- Progress updates in real-time when goals are marked complete

### US-014: Check for Bingo

**As a** user  
**I want to** see when I've completed a bingo (row, column, or diagonal)  
**So that** I can celebrate milestone achievements

**Acceptance Criteria:**

- System detects completed rows, columns, and diagonals
- Completed bingos are visually highlighted
- User receives notification/celebration when achieving a bingo

## Multi-User Features

### US-015: View Other Users' Boards (Optional)

**As a** user  
**I want to** view other users' public boards  
**So that** I can get inspiration for my own goals

**Acceptance Criteria:**

- User can browse public boards from other users
- User cannot edit others' boards
- Privacy settings are respected

### US-016: Share Board

**As a** user
**I want to** share my bingo board with others
**So that** I can show my goals and progress to friends/family

**Acceptance Criteria:**

- User can generate a shareable link
- Shared boards are view-only for recipients
- User can make boards public or private

## User Experience

### US-017: Responsive Design

**As a** user
**I want to** access the app on any device
**So that** I can view and update my goals on mobile, tablet, or desktop

**Acceptance Criteria:**

- App is fully functional on mobile devices
- App is fully functional on tablets
- App is fully functional on desktop browsers
- Layout adapts appropriately to screen size

### US-018: Dashboard View

**As a** user
**I want to** see a dashboard of all my boards
**So that** I can quickly access and overview my goals

**Acceptance Criteria:**

- Dashboard shows all user's boards in a grid or list
- Each board preview shows title, year, and progress
- User can click to open any board
- User can create new board from dashboard

### US-019: Year Filter

**As a** user
**I want to** filter boards by year
**So that** I can focus on current or past year goals

**Acceptance Criteria:**

- User can filter boards by year
- Filter shows available years
- Current year is selected by default

### US-020: Search Goals

**As a** user
**I want to** search across all my goals
**So that** I can quickly find specific objectives

**Acceptance Criteria:**

- User can enter search text
- Results show matching goals across all boards
- User can click result to navigate to that goal's board

## Data Management

### US-021: Data Persistence

**As a** user
**I want to** have my data automatically saved
**So that** I don't lose my goals and progress

**Acceptance Criteria:**

- All changes are automatically saved
- Data persists across sessions
- User sees confirmation of save status

### US-022: Export Board

**As a** user
**I want to** export my bingo board
**So that** I can save a copy or share it outside the app

**Acceptance Criteria:**

- User can export board as image (PNG/JPG)
- User can export board as PDF
- Export includes all goals and completion status

### US-023: Archive Board

**As a** user
**I want to** archive completed or old boards
**So that** I can keep them for reference without cluttering my active boards

**Acceptance Criteria:**

- User can archive a board
- Archived boards are hidden from main view
- User can view archived boards in separate section
- User can unarchive boards

## Customization

### US-024: Customize Board Appearance

**As a** user
**I want to** customize the look of my bingo board
**So that** I can personalize my goal tracking experience

**Acceptance Criteria:**

- User can choose color themes for boards
- User can select different visual styles
- Customizations are saved per board

### US-025: Set Goal Categories

**As a** user
**I want to** categorize my goals (e.g., health, career, personal)
**So that** I can organize goals by type

**Acceptance Criteria:**

- User can assign categories to goals
- Goals can be color-coded by category
- User can filter/view goals by category

## Notifications & Reminders

### US-026: Goal Reminders

**As a** user
**I want to** set reminders for specific goals
**So that** I stay on track with my objectives

**Acceptance Criteria:**

- User can set reminder dates for goals
- User receives notifications for upcoming goals
- User can dismiss or snooze reminders

### US-027: Progress Notifications

**As a** user
**I want to** receive notifications when I achieve milestones
**So that** I feel motivated and celebrated

**Acceptance Criteria:**

- User receives notification when completing a bingo
- User receives notification at progress milestones (25%, 50%, 75%, 100%)
- Notifications can be enabled/disabled in settings
