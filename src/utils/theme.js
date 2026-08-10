import { flushSync } from "react-dom";

/**
 * Utility to toggle theme with a circular wave/reveal transition.
 * Optimized for mobile devices (including Redmi Note 12 / MIUI / HyperOS).
 * 
 * @param {MouseEvent|TouchEvent} event - The click or touch event triggering the toggle.
 * @param {string} theme - The current theme ('light' or 'dark').
 * @param {Function} setTheme - React state setter function for the theme.
 * @param {string} [targetTheme] - The target theme to switch to ('light' or 'dark'). Optional.
 */
export function toggleThemeWithTransition(event, theme, setTheme, targetTheme) {
  const newTheme = targetTheme !== undefined ? targetTheme : (theme === "dark" ? "light" : "dark");
  
  if (theme === newTheme) return;

  // Fallback for browsers that do not support View Transitions API
  if (!document.startViewTransition) {
    setTheme(newTheme);
    return;
  }

  // Calculate exact center coordinates of the button (works for SVG path targets, touch events, and mobile viewports)
  let x = Math.round(window.innerWidth / 2);
  let y = Math.round(window.innerHeight / 2);

  const rawTarget = event?.currentTarget || event?.target;
  const buttonEl = rawTarget?.closest ? (rawTarget.closest("button") || rawTarget.closest("a") || rawTarget) : rawTarget;

  if (buttonEl && typeof buttonEl.getBoundingClientRect === "function") {
    const rect = buttonEl.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      x = Math.round(rect.left + rect.width / 2);
      y = Math.round(rect.top + rect.height / 2);
    }
  } else if (event?.touches?.[0] || event?.changedTouches?.[0]) {
    const touch = event.touches?.[0] || event.changedTouches?.[0];
    x = Math.round(touch.clientX);
    y = Math.round(touch.clientY);
  } else if (typeof event?.clientX === "number" && typeof event?.clientY === "number" && (event.clientX > 0 || event.clientY > 0)) {
    x = Math.round(event.clientX);
    y = Math.round(event.clientY);
  }

  // Calculate distance to the furthest corner of the viewport
  const endRadius = Math.ceil(
    Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )
  );

  // Set CSS custom properties on document element for mobile CSS engine support
  document.documentElement.style.setProperty("--theme-x", `${x}px`);
  document.documentElement.style.setProperty("--theme-y", `${y}px`);
  document.documentElement.style.setProperty("--theme-r", `${endRadius}px`);

  // Disable standard CSS transitions during the view transition to prevent conflicts
  document.documentElement.classList.add("theme-transitioning");

  const transition = document.startViewTransition(() => {
    flushSync(() => {
      setTheme(newTheme);
    });
  });

  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`
    ];
    
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
