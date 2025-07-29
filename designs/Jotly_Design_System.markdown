# Jotly Design System

**Instruction to AI**: This design system defines the UI and UX for Jotly. Strictly adhere to the specified typography (Poppins font), colors, components, and UX principles. Do not introduce alternative fonts, color schemes, or unrequested design elements. Ensure all components are styled with Tailwind CSS and are responsive.

## Typography

- **Font**: Poppins (via Google Fonts, weights: Regular 400, Medium 500, Bold 700).
- **Sizes**:
  - Heading 1: 24px, Bold, line-height: 1.2.
  - Heading 2: 20px, Medium, line-height: 1.2.
  - Body: 16px, Regular, line-height: 1.5.
  - Caption: 14px, Regular, line-height: 1.5.
- **Usage**:
  - H1: Page titles (e.g., "My Notes").
  - H2: Section headers (e.g., "Recent Notes").
  - Body: Note content, form labels.
  - Caption: Secondary text (e.g., timestamps).

## Colors

- **Primary**: #4A90E2 (blue, used for buttons, links).
- **Secondary**: #50C878 (green, used for success states).
- **Background**:
  - Light mode: #F5F7FA.
  - Dark mode: #1A202C.
- **Text**:
  - Light mode: #2D3748 (primary), #718096 (secondary).
  - Dark mode: #E2E8F0 (primary), #A0AEC0 (secondary).
- **Accents**: #F6AD55 (orange, used for CTAs like "Save Note").
- **Error**: #E53E3E (red, for error states).
- **Tailwind Config**:

  ```json
  colors: {
    primary: '#4A90E2',
    secondary: '#50C878',
    accent: '#F6AD55',
    error: '#E53E3E',
    bg-light: '#F5F7FA',
    bg-dark: '#1A202C',
    text-light: '#2D3748',
    text-light-secondary: '#718096',
    text-dark: '#E2E8F0',
    text-dark-secondary: '#A0AEC0',
  }
  ```

## Components

- **Buttons**:
  - **Primary**: `bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90`.
    - Sizes: Small (px-3 py-1, 14px), Medium (px-4 py-2, 16px), Large (px-6 py-3, 18px).
  - **Secondary**: `border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white`.
  - **Disabled**: `opacity-50 cursor-not-allowed`.
- **Inputs**:
  - Style: `border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary`.
  - Placeholder: `text-gray-400`.
  - Error: `border-error focus:ring-error`.
- **Textareas**:
  - Style: Same as inputs, but `resize-y min-h-[100px]`.
- **Cards**:
  - Style: `bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700`.
  - Hover: `shadow-md transition-shadow`.
  - Usage: Note previews in list view.
- **Search Bar**:
  - Style: `w-full border border-gray-300 rounded-full px-4 py-2 flex items-center`.
  - Icon: Magnifying glass (SVG, 16px, gray).
- **Tags**:
  - Style: `bg-gray-100 dark:bg-gray-700 text-sm px-2 py-1 rounded-full`.
  - Hover: `bg-gray-200 dark:bg-gray-600`.
- **Theme Toggle**:
  - Style: `w-10 h-5 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center p-1`.
  - Knob: `w-4 h-4 bg-white rounded-full transition-transform`.

## Layout

- **Container**: `max-w-4xl mx-auto px-4 sm:px-6 lg:px-8`.
- **Grid**:
  - Desktop: 2-column (sidebar: 250px, content: flexible).
  - Mobile: Single-column, sidebar hidden (toggleable via hamburger menu).
- **Spacing**:
  - Padding: 16px (components), 24px (sections).
  - Margin: 8px (elements), 16px (sections).
- **Responsive**:
  - Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px).
  - Mobile: Stack components, full-width inputs/buttons.
  - Desktop: Sidebar visible, note list in grid (2-3 columns).

## UX Principles

- **Simplicity**: Avoid clutter; prioritize note-taking functionality.
- **Feedback**:
  - Loading: Spinners (`animate-spin w-5 h-5`).
  - Success/Error: Toasts (top-right, auto-dismiss after 3s).
- **Accessibility**:
  - ARIA labels for buttons, inputs, and navigation.
  - Keyboard navigation (Tab focus, Enter for actions).
  - Contrast ratios meet WCAG 2.1 AA.
- **Consistency**:
  - Uniform border-radius: 8px (cards, buttons), 4px (inputs).
  - Consistent spacing: 16px padding, 8px margins.
- **Animation**:
  - Subtle transitions: `transition-all duration-200` for hovers, theme switches.
  - Avoid excessive motion to respect reduced-motion preferences.
