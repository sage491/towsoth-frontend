# Towsoth Edu Color System Guide

## Philosophy: Black & White + 30% Accent

The Towsoth Edu interface uses a **disciplined 70/30 rule**:
- **70% Black/White/Gray** – Creates calm, premium, long-session safe experience
- **30% Accent Color** – Muted indigo-violet for intellectual, academic feel

---

## Color Variables (CSS Custom Properties)

### Base Palette (70% of UI)
```css
--bg-main: #f9fafb          /* Main background */
--bg-secondary: #f5f6f8     /* Secondary background */
--bg-card: #ffffff          /* Card background */
--text-primary: #0f172a     /* Primary text (near-black) */
--text-secondary: #475569   /* Secondary text (gray) */
--text-tertiary: #64748b    /* Tertiary text (light gray) */
--border-soft: #e5e7eb      /* Soft borders */
--border-medium: #cbd5e1    /* Medium borders */
```

### Accent Palette (30% of UI)
```css
--accent-primary: #5B5F8D   /* Muted indigo-violet */
--accent-hover: #4A4D73     /* Hover state */
--accent-soft: rgba(91, 95, 141, 0.1)   /* Soft background */
--accent-border: rgba(91, 95, 141, 0.2) /* Accent borders */
```

### Functional Colors (Rare Usage)
```css
--success: #10b981   /* Only for true success states */
--warning: #f59e0b   /* Only for true warnings */
--danger: #ef4444    /* Only for true errors/danger */
```

---

## Dark Mode Adaptation

```css
[data-theme="dark"] {
  --bg-main: #0b1220
  --bg-secondary: #0f1729
  --bg-card: #111827
  --text-primary: #e5e7eb
  --text-secondary: #9ca3af
  --text-tertiary: #6b7280
  --border-soft: #1f2937
  --border-medium: #374151
  
  --accent-primary: #8B8FC7    /* Brighter for dark mode */
  --accent-hover: #A5A8D8
  --accent-soft: rgba(139, 143, 199, 0.15)
  --accent-border: rgba(139, 143, 199, 0.25)
}
```

---

## Where Accent Color IS ALLOWED (✓)

### Primary CTAs
```tsx
<button style={{ 
  background: 'var(--accent-primary)',
  color: '#ffffff'
}}>
  Primary Action
</button>
```

### Active Sidebar Item
```tsx
<button style={{
  background: isActive ? 'var(--accent-primary)' : 'transparent',
  color: isActive ? '#ffffff' : 'var(--text-secondary)'
}}>
  Navigation Item
</button>
```

### Progress Bars (Subtle)
```tsx
<div style={{ background: 'var(--accent-primary)', height: '4px' }} />
```

### AI Context Indicators
```tsx
<div style={{ 
  background: 'var(--accent-soft)',
  borderLeft: '3px solid var(--accent-primary)'
}}>
  AI Intelligence Context
</div>
```

### Selected Tabs
```tsx
<button style={{
  borderBottom: isActive ? '2px solid var(--accent-primary)' : 'none'
}}>
  Tab Item
</button>
```

### Focus Mode Indicators
```tsx
<div style={{ color: 'var(--accent-primary)' }}>
  Focus Mode Active
</div>
```

---

## Where Accent Color is FORBIDDEN (✗)

❌ Background fills for large sections
❌ Entire cards
❌ Long text blocks
❌ Decorative icons without purpose
❌ Charts without specific meaning
❌ Multiple accent colors (one only!)

---

## Hover & Active States

### Hover
```tsx
// For text/icons
<button className="hover:opacity-70">

// For buttons with accent
<button style={{ 
  background: 'var(--accent-primary)',
}} 
onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
>
```

### Active State
- Accent color solid
- Bold text
- Optional thin left indicator bar (2-3px)

---

## Back Button (Special Case)

The "Back to Dashboard" button uses **accent color for text only**, no background:

```tsx
<button
  onClick={onExit}
  className="flex items-center gap-2 text-xs font-medium hover:opacity-70"
  style={{ color: 'var(--accent-primary)' }}
>
  <ArrowLeft className="w-4 h-4" />
  <span>Back to Dashboard</span>
</button>
```

This reinforces: **"This is navigation, not an action"**

---

## Button Hierarchy

### Primary Action (Accent)
```tsx
<button style={{ 
  background: 'var(--accent-primary)',
  color: '#ffffff',
  padding: '10px 16px',
  fontSize: '12px',
  fontWeight: 700
}}>
  Start Learning
</button>
```

### Secondary Action (Black)
```tsx
<button style={{ 
  background: 'var(--text-primary)',
  color: '#ffffff',
  padding: '10px 16px',
  fontSize: '12px',
  fontWeight: 700
}}>
  View Details
</button>
```

### Tertiary Action (Outline)
```tsx
<button style={{ 
  background: 'transparent',
  border: '1px solid var(--border-medium)',
  color: 'var(--text-primary)',
  padding: '10px 16px',
  fontSize: '12px'
}}>
  Cancel
</button>
```

### Danger Action (Red - Rare)
```tsx
<button style={{ 
  background: 'var(--danger)',
  color: '#ffffff',
  padding: '10px 16px',
  fontSize: '12px',
  fontWeight: 700
}}>
  Delete Permanently
</button>
```

---

## Workspace-Specific Colors

### All Workspaces Use SAME Accent
All workspaces (My Subjects, Tests & Guidelines, Plan My Journey, Towsoth Global) use the **same muted indigo-violet accent**.

### Sidebar Background
All workspace sidebars use:
```tsx
background: 'var(--bg-card)',
borderRight: '1px solid var(--border-soft)'
```

No colored backgrounds (blue/red/green/purple).

---

## Cards & Containers

### Standard Card
```tsx
<div style={{ 
  background: 'var(--bg-card)',
  border: '1px solid var(--border-soft)',
  padding: '20px'
}}>
  Content
</div>
```

### Hover Card (Interactive)
```tsx
<div 
  className="hover:border-opacity-100 transition-all"
  style={{ 
    background: 'var(--bg-card)',
    border: '1px solid var(--border-soft)',
  }}
  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
>
  Interactive Content
</div>
```

### Warning/Alert Card
```tsx
<div style={{ 
  background: 'var(--accent-soft)',
  borderLeft: '3px solid var(--accent-primary)',
  padding: '16px'
}}>
  Important Information
</div>
```

---

## Status Indicators (Functional Color Exceptions)

These are the ONLY places where green/orange/red are used:

### Progress Status
- **Critical**: `--danger` (red)
- **Due Soon**: `--warning` (orange)
- **Good**: `--success` (green)

### Accuracy Indicators
- **Low (<50%)**: `--danger`
- **Medium (50-70%)**: `--warning`
- **High (>70%)**: `--success`

---

## Typography

### Headings
```tsx
<h1 style={{ 
  color: 'var(--text-primary)',
  fontSize: '24px',
  fontWeight: 700
}}>
  Page Title
</h1>
```

### Body Text
```tsx
<p style={{ 
  color: 'var(--text-secondary)',
  fontSize: '14px'
}}>
  Description text
</p>
```

### Subtle Text
```tsx
<span style={{ 
  color: 'var(--text-tertiary)',
  fontSize: '12px'
}}>
  Metadata or timestamps
</span>
```

---

## Implementation Checklist

When building a component:

- [ ] Background is white/gray (not colored)
- [ ] Text is black/gray (not colored)
- [ ] Borders are gray (not colored)
- [ ] Primary CTA uses accent color
- [ ] Accent usage is <30% of screen
- [ ] Functional colors only for status/meaning
- [ ] Hover states are subtle (opacity change)
- [ ] No decorative colors
- [ ] Dark mode compatible
- [ ] Feels calm and premium

---

## Final Experience Check

The student should feel:
✓ Calm entering a workspace
✓ Safe knowing they can exit
✓ Focused for long sessions (4-6 hours)
✓ Guided without visual noise

The UI should feel:
> **"Quietly intelligent. Academic authority. Not a startup."**
