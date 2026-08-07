import { flushSync } from "react-dom";

/**
 * Utility to toggle theme with a circular wave/reveal transition.
 * Uses the View Transitions API if supported and not disabled by prefers-reduced-motion.
 * 
 * @param {MouseEvent} event - The click event triggering the toggle.
 * @param {string} theme - The current theme ('light' or 'dark').
 * @param {Function} setTheme - React state setter function for the theme.
 * @param {string} [targetTheme] - The target theme to switch to ('light' or 'dark'). Optional.
 */
export function toggleThemeWithTransition(event, theme, setTheme, targetTheme) {
  const newTheme = targetTheme !== undefined ? targetTheme : (theme === "dark" ? "light" : "dark");
  
  if (theme === newTheme) return;

  // Check support for View Transitions API and respects user's motion preferences
  if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setTheme(newTheme);
    return;
  }

  // Get coordinates of the click, fallback to viewport center
  const x = event?.clientX ?? window.innerWidth / 2;
  const y = event?.clientY ?? window.innerHeight / 2;
  
  // Calculate distance to the furthest corner
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  // Disable standard CSS transitions during the view transition to prevent conflicts
  document.documentElement.classList.add("theme-transitioning");

  const transition = document.startViewTransition(() => {
    // flushSync is used to ensure React updates the DOM synchronously
    // so that the new state is captured in the "new" screenshot immediately.
    flushSync(() => {
      setTheme(newTheme);
    });
  });

  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`
    ];
    
    // Animate the new root snapshot on top of the old one
    document.documentElement.animate(
      {
        clipPath: clipPath
      },
      {
        duration: 500,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)"
      }
    );
  });

  // Re-enable CSS transitions when transition is finished
  transition.finished.finally(() => {
    document.documentElement.classList.remove("theme-transitioning");
  });
}
