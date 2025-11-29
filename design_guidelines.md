# PlacementPanic Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from Stripe's dashboard clarity and Apple's premium aesthetic, creating a dark-themed application that balances professional data visualization with motivational, student-friendly design.

## Color System
- **Primary**: #6366F1 (indigo) - CTAs, interactive elements, progress indicators
- **Secondary**: #8B5CF6 (purple) - charts, secondary actions, highlights
- **Accent**: #06B6D4 (cyan) - success states, confidence metrics, active states
- **Background**: #0F172A (dark slate) - main background
- **Surface**: #1E293B (slate) - cards, panels, elevated surfaces
- **Text**: #F1F5F9 (light) - primary text
- **Success**: #10B981 (emerald) - positive feedback, achievements

Apply gradient overlays combining primary/secondary colors (indigo to purple) for hero sections and key CTAs.

## Typography
- **Primary Font**: Inter - body text, UI elements, data (400, 500, 600, 700 weights)
- **Display Font**: Poppins - headlines, section titles, statistics (600, 700 weights)
- **Hierarchy**:
  - Hero headlines: Poppins 48-64px bold
  - Section titles: Poppins 32-40px semibold
  - Card titles: Inter 20-24px semibold
  - Body text: Inter 16px regular
  - Small text/labels: Inter 14px medium

## Layout System
**Tailwind Spacing**: Use 4, 6, 8, 12, 16, 24 as primary spacing units (p-4, m-6, gap-8, etc.)
- Section padding: py-16 to py-24
- Card padding: p-6 to p-8
- Component gaps: gap-4 to gap-6
- Container max-width: max-w-7xl

## Core UI Components

### Glassmorphism Cards
All cards use glassmorphism with backdrop blur, subtle borders, and soft shadows:
- Background: rgba(30, 41, 59, 0.6) with backdrop-blur-xl
- Border: 1px solid rgba(255, 255, 255, 0.1)
- Shadow: 0 8px 32px rgba(0, 0, 0, 0.2)
- Rounded corners: rounded-xl to rounded-2xl

### Navigation
Sticky top navigation with glassmorphism effect:
- Logo (left), nav links (center), "Start Interview" CTA + profile (right)
- Smooth scroll-based background opacity changes
- Active link indicators with accent color underline

### Buttons
- Primary: Gradient (indigo to purple), white text, px-8 py-3, rounded-lg, smooth hover scale (1.02)
- Secondary: Slate surface, light text, same padding
- Ghost: Transparent, light text with hover background
- Buttons on images: Use backdrop-blur-md background with semi-transparent slate

### Data Visualization
- Animated progress rings for panic reduction index
- Gradient-filled bar charts for performance metrics
- Line charts with smooth curves and gradient fills below
- Stat cards with large numbers (Poppins 36-48px) and animated counter effects

### Interview Components
- Question cards: Large glassmorphism card with question text, category badge, difficulty indicator
- Timer: Circular progress indicator with countdown, color transitions (cyan → purple → red as time runs low)
- Rating slider: Custom slider with gradient track, large thumb, visual feedback
- Confidence meter: Animated gradient-filled bar with pulsing effect

### Form Elements
- Input fields: Slate background, light border, indigo focus ring, px-4 py-3 rounded-lg
- Consistent focus states with cyan glow effect
- Smooth transitions on all interactive states

## Page-Specific Layouts

### Landing Page
- **Hero Section** (100vh): Full-viewport with large gradient overlay background image showing stressed student transforming to confident developer
  - Center-aligned headline (Poppins 56-64px): "Panic-Proof Your Interview Skills"
  - Subheading (Inter 20-24px): "92% of students fail due to panic, not skills. Train like a pro."
  - Large gradient CTA with glass effect background
  - Floating glassmorphism stat cards: "10K+ Interviews", "4.8/5 Success Rate"

- **Problem Section**: Dark background with 2-column layout
  - Left: Compelling problem statement with statistics
  - Right: Illustration or screenshot of panic metrics

- **Features Grid**: 3-column grid showcasing core features
  - Icon (gradient circle backgrounds), title, description per card
  - Glassmorphism cards with hover lift effect

- **How It Works**: 3-step process with numbers, animations showing flow

- **CTA Section**: Full-width gradient background with centered CTA

### Dashboard
- **Stats Overview**: 4-column grid of metric cards
  - Large number display (Poppins 48px) with animated count-up
  - Icons, trend indicators (↑), subtle animations

- **Performance Chart Section**: 2-column layout
  - Left: Line chart showing score progression over time
  - Right: Circular panic reduction gauge with percentage

- **Recent Sessions**: Table/card list with session summaries
  - Date, category, score, duration in glassmorphism cards

- **Quick Start**: Prominent "Start New Interview" card with gradient

### Interview Screen
- **Top Bar**: Timer, question counter, exit button with glassmorphism
- **Main Card**: Centered large question card (80% viewport width)
  - Category badge (top-left), difficulty badge (top-right)
  - Question text (Poppins 28-32px centered)
- **Bottom Controls**: Self-rating slider, "Next Question" button
- **Sidebar** (optional): Live confidence meter, tips panel

### Report Page
- **Header**: Score circle with gradient, congratulatory message
- **Metrics Grid**: 2x2 or 3-column grid
  - Questions answered, time spent, average rating, difficulty distribution
  - Animated charts and progress indicators

- **Feedback Section**: 2-column layout
  - Left: "Strengths" card with checkmark icons, green accents
  - Right: "Areas to Improve" card with lightbulb icons, purple accents

- **Action CTA**: "Practice Again" button, "View All Sessions" link

## Images
- **Hero Image**: Full-width background image showing student at desk with dual monitors, coding/interview setup, with dark gradient overlay (0.7 opacity). Image should convey transformation from stressed to confident.
- **Feature Icons**: Use icon library (Heroicons) with gradient backgrounds instead of images
- **Dashboard Charts**: Data visualizations (no static images, use chart libraries)

## Animations
Use sparingly, focus on:
- Fade-in on scroll for sections (0.3s ease)
- Number counter animations on dashboard stats
- Chart drawing animations on load
- Button hover scale (1.02 transform, 0.2s)
- Card hover lift (translateY -4px, 0.3s)
- Timer countdown with smooth rotation
- NO complex page transitions or excessive micro-interactions

## Accessibility
- Maintain 4.5:1 contrast ratio for all text
- Focus indicators on all interactive elements (cyan ring)
- ARIA labels for all icons and interactive components
- Keyboard navigation support throughout