# User Stories - Bingoooal

## Application Structure

## UX / UI

## User Management

### Story: Existing user can share a board via link

- [x] **As a** logged-in user  
       **I want to** share a board with others  
       **So that** I share my goal progress

**Acceptance Criteria:**

- [x] Existing User can share a board with others - non-users can view the board
- [x] If the board owner is viewing their shared board using the share link, the board should not show the read-only banner and be editable
- [x] A viewer in read-only mode should be able to see the details of the goal, but the mark as complete button should not be available

### Story: Existing user can invite a new user to the platform

- [x] **As a** logged-in user
      **I want to** invite a new user to the platform
      **So that** I can share my board with others

**Acceptance Criteria:**

- [x] Existing User can invite an email of another user to the platform from the dashboard.
- [x] The user will be given an invite link.
- [x] The new user who clicks on the invite link will be taken to the login page and prompted to login with OAuth
- [x] The new user will have a reference to the existing user who invited them in their database for tracking purposes.
- [x] The new user will be taken to the dashboard after logging in
- [ ] The new user will be automatically added to the inviter's group (see Group Management stories below)

## Group Management

**Design Notes:**

- Each user has one personal group (no group names needed at this time)
- Users cannot create multiple groups
- The invite link system is extended to add users to groups
- If an existing user clicks an invite link, they are added to the inviter's group
- If a new user clicks an invite link, they register and are automatically added to the inviter's group

### Story: Automatic Group Creation on User Registration

- [ ] **As a** new user
      **I want to** have a personal group created automatically when I sign up
      **So that** I can manage friends and share boards with them

**Acceptance Criteria:**

- [ ] New users automatically get a personal group created on registration
- [ ] Existing users get a personal group created via migration
- [ ] User is automatically added as the owner of their personal group
- [ ] Group has no name (single group per user design)

### Story: Add Users to Group via Invite Link

- [ ] **As a** group owner
      **I want to** share an invite link that adds users to my group
      **So that** I can easily add friends to share boards with

**Acceptance Criteria:**

- [ ] User can generate an invite/add-to-group link from the dashboard
- [ ] Link can be shared via any method (email, messaging, etc.)
- [ ] When an existing logged-in user clicks the link, they are immediately added to the inviter's group
- [ ] When a new user clicks the link, they are prompted to register and then added to the inviter's group
- [ ] When a logged-out existing user clicks the link, they are prompted to log in and then added to the inviter's group
- [ ] User receives confirmation when successfully added to a group
- [ ] Invite link reuses/extends the existing invitation system

### Story: View and Manage Group Members

- [ ] **As a** group owner
      **I want to** view and manage members in my group
      **So that** I can control who has access to my shared boards

**Acceptance Criteria:**

- [ ] User can view a list of all members in their group
- [ ] User can see when each member joined
- [ ] User can remove members from their group
- [ ] Removed members lose access to shared boards immediately
- [ ] User receives confirmation before removing a member
- [ ] User cannot remove themselves from the group
- [ ] User cannot see themselves in the list of friends

### Story: Leave a Group

- [ ] **As a** group member
      **I want to** leave a group I've been added to
      **So that** I can manage my own group memberships

**Acceptance Criteria:**

- [ ] User can see which groups they are a member of (not owner)
- [ ] User can leave a group they've been added to
- [ ] User receives confirmation before leaving
- [ ] Leaving a group removes access to that group's shared boards
- [ ] User cannot leave their own personal group (they are the owner)

### Story: Share Board with Group (View Only)

- [ ] **As a** board owner
      **I want to** share my board with my group as view-only
      **So that** my friends can see my goals and progress

**Acceptance Criteria:**

- [ ] Board owner can toggle "Share with Friends" on any of their boards
- [ ] Shared boards are visible to all members of the owner's group
- [ ] Group members can view shared boards but cannot edit them
- [ ] Shared boards clearly indicate who owns them
- [ ] Board owner can unshare a board at any time
- [ ] Unsharing immediately removes access for all group members
- [ ] Shared boards appear in a dedicated section or are clearly marked on the dashboard

### Story: Collaborative Boards (Edit Permission)

- [ ] **As a** board owner
      **I want to** allow my group members to edit my board
      **So that** we can collaborate on shared goals

**Acceptance Criteria:**

- [ ] Board owner can set permission level when sharing (view or edit)
- [ ] Group members with edit permission can add/edit/delete goals (on unlocked boards)
- [ ] Group members with edit permission can mark goals as complete (on locked boards)
- [ ] Board owner can change permission level after sharing (view ↔ edit)
- [ ] Board owner always retains full control (can lock, delete, unshare)
- [ ] Collaborative boards clearly show they are editable
- [ ] (Optional) Activity log shows who made changes for accountability

### Story: View Goal Details

- [ ] **As a** user  
       **I want to** view full details of a goal  
       **So that** I can see the complete description if it's long

**Acceptance Criteria:**

- [ ] User can click/hover to see full goal text
- [ ] Modal or tooltip displays complete information
- [ ] Easy to close and return to board view

## Bingo Board Management

## Goal Management

### Story: Toggle Free Space Checkbox

- [x] **As a** user
      **I want to** be able to toggle the free space checkbox when creating a goal.
      **So that** I can change to and from a free space.

**Aceptance Criteria:**

- [x] User can toggle the free space checkbox when creating a goal
- [x] User can toggle the free space checkbox when editing a goal
- [x] Toggling the free space checkbox on an existing goal updates the goal text to "Free Space"

### Story: Can't change complete status of free space

- [x] **As a** user
      **I want to** not be able to change the completed status of a free space
      **So that** I can't break the game

**Acceptance Criteria:**

- [x] User cannot change the completed status of a free space
- [x] The UI reflects that the free space is completed and cannot be changed

### Story: Goal Square Has Details Modal

- [x] **As a** user
      **I want to** be able to click on a goal square to see more details
      **So that** I can see the full goal text and other information

**Acceptance Criteria:**

- [x] User can click on a goal square to see more details
- [x] A modal or tooltip displays the full goal text and other information
- [x] The modal or tooltip is easy to close and return to the board view
- [x] In the detail model, the user should see the full text of the goal and it's completion status, similar to the board view.

---

# Completed Stories

## Application Structure

### Story: Base Technologies

- [x] **As a** developer
      **I want to** use Next,js as the base framework
      **So that** I can build a fast and modern web application

**Acceptance Criteria:**

- [x] Next.js is installed and configured
- [x] Basic project structure is in place
- [x] Development server runs without errors
- [x] Basic routing is implemented

### Story: Deployment

- [x] **As a** developer
      **I want to** deploy the application to Vercel
      **So that** I can share it with others

**Acceptance Criteria:**

- [x] Vercel is configured
- [x] Application is deployed and accessible
- [x] CI/CD pipeline is set up for automatic deployments

## UX / UI

### Story: Basic Styling

- [x] **As a** developer
      **I want to** apply basic styling to the application
      **So that** it has a consistent look and feel

**Acceptance Criteria:**

- [x] Use Tailwind CSS for styling
- [x] Basic CSS is applied
- [x] Layout is responsive
- [x] Colors and typography are consistent
- [x] Basic form elements are styled

### Story: Fit to Mobile Screen Size Of 375px

- [x] **As a** developer
      **I want to** ensure the application fits to a mobile screen size of 375px
      **So that** it is accessible on mobile devices

**Acceptance Criteria:**

- [x] Application is fully functional on mobile devices
- [x] Layout adapts appropriately to screen size
- [x] Text and elements are legible
- [x] Interactive elements are accessible

### Story: Hand-Drawn Aesthetic

- [x] **As a** developer
      **I want to** apply a hand-drawn aesthetic to the bingo board
      **So that** it has a unique and fun look

**Acceptance Criteria:**

- [x] Hand-drawn borders are applied - IE - 9-slice borders
- [x] hand-drawn shadows are applied
- [x] Organic shapes are applied
- [x] Slight rotations are applied

### Story: All Pages Are Styled

- [x] **As a** developer
      **I want to** apply the hand-drawn aesthetic to all pages
      **So that** the application has a consistent look and feel

**Acceptance Criteria:**

- [x] All pages are styled with the hand-drawn aesthetic - for example the dashboard
- [x] Components are reusable and consistent
- [x] Visual effects are applied consistently

## User Management

### Story: User Registration

- [x] **As a** new user
      **I want to** create an account using the "Sign in with XXX" method.
      **So that** I can track my personal yearly goals

**Acceptance Criteria:**

- [x] User can use an existing account - OAuth with Google, GitHub, etc.
- [x] User receives confirmation of successful registration
- [x] No personal information is required beyond existing account information

### Story: User Login

- [x] **As a** registered user
      **I want to** log into my account
      **So that** I can access my bingo boards

**Acceptance Criteria:**

- [x] User can log in with existing account - "Sign in with Google", etc.
- [x] User session is maintained across page refreshes

### Story: User Logout

- [x] **As a** logged-in user
      **I want to** log out of my account
      **So that** I can keep my goals private on shared devices

**Acceptance Criteria:**

- [x] User can log out from any page
- [x] Session is cleared upon logout
- [x] User is redirected to login page

## Bingo Board Management

### Story: Create Bingo Board

- [x] **As a** user
      **I want to** create a new bingo board for the year
      **So that** I can organize my yearly goals

**Acceptance Criteria:**

- [x] User can create a new 5x5 bingo board
- [x] User can set a title/name for the board
- [x] User can specify the year for the board
- [x] Board is saved and associated with the user
- [x] Optional center square is free space and already completed

### Story: View Bingo Boards

- [x] **As a** user
      **I want to** view all my bingo boards
      **So that** I can see my different goal collections

**Acceptance Criteria:**

- [x] User sees a list/grid of all their boards
- [x] Each board shows its title and year
- [x] User can click to view board details

### Story: Return to Dashboard from Board View

- [x] **As a** user
      **I want to** return to the dashboard from the board view
      **So that** I can see all my boards at once

**Acceptance Criteria:**

- [x] User can click a back button to return to dashboard
- [x] User is taken to the dashboard when clicking board title

### Story: Edit Bingo Board

- [x] **As a** user
      **I want to** edit my bingo board details
      **So that** I can update the title or year if needed

**Acceptance Criteria:**

- [x] User can edit board title
- [x] User can edit board year
- [x] Changes are saved immediately or with confirmation

### Story: Delete Bingo Board

- [x] **As a** user
      **I want to** delete a bingo board
      **So that** I can remove boards I no longer need

**Acceptance Criteria:**

- [x] User can delete a board
- [x] User receives confirmation before deletion
- [x] Deleted boards are permanently removed

### Story: Lock Board Goals

- [x] **As a** user
      **I want to** lock a bingo board's goals
      **So that** I can prevent further changes

**Acceptance Criteria:**

- [x] User can lock a board's goals
- [x] Locked boards show a visual indicator
- [x] User cannot add, edit, or delete goals on locked boards
- [x] The only function a User can do to a locked board is delete it
- [x] A user can not unlock a board once it is locked. The functionality can stay in the code, but the user interface should not have an unlock button.
- [x] A user should only be able to lock the board once all 25 goals have been added.

## Goal Management

### Story: Add Goal to Board

- [x] **As a** user
      **I want to** add a goal to a specific square on my bingo board
      **So that** I can fill my board with yearly objectives

**Acceptance Criteria:**

- [x] User can click on an empty square to add a goal
- [x] User can enter goal text/description
- [x] Goal is saved to the specific square
- [x] Maximum character limit is enforced for readability
- [x] Sample goals are populated for inspiration - data/example-goals.json
- [x] Form element is pre-populated (placeholder) with a random sample goal from data/example-goals.json - if user doesn't change text, placeholder text is saved.
- [x] Inspire me button exists if the form field is empty.
- [x] Create goal has the option be entered as a "free space" in which the UI changes to reflect that it is a free space.
- [x] If the goal is marked as a free space, the text for the goal should be "Free Space"

### Story: Edit Goal

- [x] **As a** user
      **I want to** edit an existing goal
      **So that** I can refine or update my objectives

**Acceptance Criteria:**

- [x] User can click on a filled square to edit
- [x] User can modify the goal text
- [x] Changes are saved
- [x] Edit is only available on an unlocked board.

### Story: Delete Goal

- [x] **As a** user
      **I want to** remove a goal from a square
      **So that** I can clear unwanted goals

**Acceptance Criteria:**

- [x] User can delete a goal from a square
- [x] Square becomes empty after deletion
- [x] User receives confirmation before deletion
- [x] Delete is only available on an unlocked board.

### Story: Mark Goal as Complete

- [x] **As a** user
      **I want to** mark a goal as completed
      **So that** I can track my progress throughout the year

**Acceptance Criteria:**

- [x] User can mark/unmark a goal as complete
- [x] Completed goals are visually distinct (e.g., different color, checkmark)
- [x] Completion status is saved
- [x] Completion triggers small confetti animation - https://github.com/catdad/canvas-confetti
- [x] Completion triggers medium confetti animation if it completes a row, column, or diagonal
- [x] Completion triggers big animation if it completes the board
- [x] Goal completion is only available on a locked board.
- [x] Visually marks the goal as completed with an "X" that becomes the background of the square. The "X"should be of a color that you can see the text over.

---

**Note for AI Agent:** Do not work on anything below this line!

---

## Group Management

### Story: User Can Create Group

- [ ] **As a** logged-in user  
       **I want to** create a group that other users can join
      **So that** I can share or collaborate on goals with others

**Acceptance Criteria:**

- [ ] User can create a group
- [ ] User can invite other users to join the group
- [ ] User can add goal boards to the group
- [ ] All personal boards are in a "Personal" group by default

### Story: View Goal Details

- [ ] **As a** user  
       **I want to** view full details of a goal  
       **So that** I can see the complete description if it's long

**Acceptance Criteria:**

- [ ] User can click/hover to see full goal text
- [ ] Modal or tooltip displays complete information
- [ ] Easy to close and return to board view

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
