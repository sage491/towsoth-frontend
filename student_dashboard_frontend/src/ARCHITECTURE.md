# Towsoth Edu - Learning Decision Support System Architecture

## Core Philosophy

**This is NOT a traditional LMS. This is a Learning Operating System.**

The system removes decision responsibility and replaces it with guided mental environments.

## The 4 Mental Modes

### 1. Dashboard = Smart Launcher
- **NOT** a navigation hub
- **IS** a launcher for 4 focused environments
- Answers: "What should I do right now?"
- Shows: Current status, next best action, workspace cards

### 2. My Subjects = Learning Workspace
**Mental Mode**: Deep Understanding

- **Own Sidebar**: Subject selector + Learn/Practice/Revise/Test/Weak Topics/Analytics/Notes
- **AI Behavior**: Quiet private tutor, contextual, non-intrusive
- **Design**: Calm, immersive, pressure-free, long-session friendly
- **Forbidden**: Leaderboards, ranks, competitive language
- **Purpose**: Deep focus on concept mastery and recursive learning loops

### 3. Tests & Guidelines = Assessment Workspace  
**Mental Mode**: Exam Seriousness

- **Own Sidebar**: Upcoming Tests/PYQ/Results/Mistakes/Fix Plans
- **AI Behavior**: Strict exam coach, predictive, direct, honest
- **Design**: Serious tone, muted colors, minimal animation
- **Special**: Focus Mode auto-enabled during tests
- **Purpose**: Score improvement, accuracy, strategy development

### 4. Plan My Journey = Strategy Workspace
**Mental Mode**: Strategic Thinking

- **Own Sidebar**: Daily Tasks/Goals/Career/Progress/Mentor
- **AI Behavior**: Calm mentor, reassuring, predictive, non-urgent
- **Design**: Calm, reflective, no urgency, no comparison
- **Forbidden**: Leaderboard pressure, forced competition
- **Purpose**: Long-term planning, sustainability, burnout prevention

### 5. Towsoth Global = Competition Workspace
**Mental Mode**: Competitive Benchmarking

- **Own Sidebar**: Leaderboard/Community/Challenges/Insights
- **AI Behavior**: Guide not judge, never shames or pressures
- **Design**: Opt-in only, can be disabled via Focus Mode
- **Special**: Locked during Focus Mode
- **Purpose**: Optional inspiration and benchmarking

## Critical Rules

### Context Switching
When clicking a workspace card:
1. Global sidebar is **DESTROYED**
2. Workspace-specific sidebar loads
3. Only workspace tools exist
4. Only workspace AI logic runs
5. Student enters ONE mental mode

### No Cross-Contamination
- ❌ No shared sidebars
- ❌ No shortcuts between workspaces
- ❌ No shared notifications
- ❌ No mixed mental modes
- ✅ Complete isolation between workspaces

### The Law
> **The Dashboard is NOT Navigation. The Dashboard is a Launcher of Mental Modes.**

This rule overrides all other design instincts.

## Technical Implementation

### File Structure
```
/components/
  /workspaces/
    MySubjectsWorkspace.tsx         # Full-screen mini-app
    TestsGuidelinesWorkspace.tsx    # Full-screen mini-app
    PlanJourneyWorkspace.tsx        # Full-screen mini-app
    TowsothGlobalWorkspace.tsx      # Full-screen mini-app
    /sidebars/
      MySubjectsSidebar.tsx         # Dark blue, learning-focused
      TestsGuidelinesSidebar.tsx    # Red, exam-focused
      PlanJourneySidebar.tsx        # Emerald, strategy-focused
      TowsothGlobalSidebar.tsx      # Purple, competition-focused
  Sidebar.tsx                       # Global sidebar (dashboard + settings only)
  DashboardLauncher.tsx             # Smart launch pad
```

### App.tsx Logic
```typescript
const isWorkspace = ['my-subjects', 'tests-guidelines', 'plan-journey', 'towsoth-global'].includes(currentPage);
const showGlobalSidebar = !isWorkspace;

// Global sidebar only renders for dashboard and settings
// Workspaces are full-screen with their own sidebars
```

### Workspace Structure
Each workspace:
1. Uses `fixed inset-0` to take full screen
2. Renders its own sidebar on the left
3. Content area adjusts based on sidebar width
4. Has "Exit to Dashboard" button (X icon)
5. Contains workspace-specific AI context bar
6. Implements its own internal navigation

## Design Principles

### Cognitive Load Management
- One workspace = One mental mode
- No decision fatigue
- No context switching overhead
- Long-session usability (4-6 hours/day)

### AI Behavior by Workspace
| Workspace | AI Role | Tone |
|-----------|---------|------|
| My Subjects | Private tutor | Quiet, contextual |
| Tests & Guidelines | Exam coach | Direct, predictive |
| Plan My Journey | Mentor | Calm, reassuring |
| Towsoth Global | Guide | Non-judgmental |

### Visual Identity
| Workspace | Color | Mental State |
|-----------|-------|--------------|
| My Subjects | Blue (slate-900) | Deep learning |
| Tests & Guidelines | Red (red-900) | Exam seriousness |
| Plan My Journey | Emerald (emerald-900) | Reflection |
| Towsoth Global | Purple (purple-900) | Competition |

## User Experience Flow

### Entry Point
1. Student opens app → Sees Dashboard
2. Dashboard shows: Status + Priority + 4 Workspace Cards
3. Student answers: "What should I do right now?"

### Workspace Entry
1. Click workspace card
2. Global context **disappears**
3. Workspace context **loads**
4. Workspace sidebar **appears**
5. Student is now in ONE mental mode

### Workspace Exit
1. Click X button or "Exit to Dashboard"
2. Workspace context **disappears**  
3. Returns to Dashboard
4. Global sidebar **reappears**
5. Student chooses next action

## Distraction Control

### Focus Mode Integration
- When enabled:
  - Towsoth Global workspace becomes **locked**
  - Sidebar shows lock icon
  - Cannot enter competition mode
  - Other workspaces remain accessible

### Notification Rules
- No cross-workspace notifications
- AI messages are contextual to current workspace
- No motivation spam
- No dopamine manipulation

## Success Metrics

The system succeeds when:
1. Student never asks "Where should I go?"
2. Student never feels lost
3. Student can work for 4-6 hours without confusion
4. Each workspace feels like entering a different mental room
5. No context switching fatigue

## Final Validation

At any screen, ask: **"What should I do right now?"**

If the system:
- ✅ Highlights ONE workspace
- ✅ Suggests ONE action
- ✅ Is in ONE mental mode

→ Product is correct

Otherwise → Simplify

---

**Remember**: This is not a website. This is a daily academic operating system.
