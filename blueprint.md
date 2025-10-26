# Water Polo Timer

This application is a feature-rich, interactive timer for water polo matches. It is built with the latest version of Angular, leveraging modern features like standalone components, signals, and native control flow for a performant and maintainable codebase.

## Project Overview

### Style and Design

*   **Modern and Interactive:** The application features a clean, intuitive, and visually appealing user interface with a dark theme.
*   **Responsive:** The layout is fully responsive, ensuring a seamless experience on both mobile and desktop devices.
*   **Aesthetics:** The design incorporates a balanced layout, clean spacing, and a polished, easy-to-understand visual hierarchy. The settings modal is organized into a two-column grid for clarity.

### Features

*   **Game Clock:** A prominent, editable timer for the current quarter.
*   **Attack Clock:** A dedicated timer for the shot clock, which visually indicates when the time is low.
*   **Scoreboard:** A clear and concise scoreboard to display the scores of both teams, with controls to increment and decrement scores.
*   **Exclusion Timers:** A section to manage and display multiple 20-second exclusion timers for both teams.
*   **Game Controls:** Intuitive controls to start, stop, and reset the timers, as well as to manage the game state (e.g., `Next Quarter`, `Reset Quarter`).
*   **Overtime Logic:** The game automatically proceeds to overtime (`OT`) if the score is tied at the end of the 4th quarter.
*   **Undo Functionality:** A temporary "undo" option appears after most actions, allowing users to revert the last state change.
*   **Settings Panel:** A customizable settings panel to adjust game parameters:
    *   Quarter duration
    *   Attack and continued attack duration
    *   Team names
    *   Language selection (English and Croatian)
*   **Game Log Management:**
    *   The application automatically logs all significant game events.
    *   The current game's log can be downloaded as a CSV file at any time.
    *   Past game logs are stored and can be reviewed and downloaded from the settings panel.
    *   Options are provided to clear all historical logs or only those from incomplete games.
*   **Localization:** The application supports both English and Croatian languages, with a simple flag-based language switcher.
*   **Sound Effects:** Audio cues are provided for the end of a quarter and the end of an attack, enhancing the user experience.

## Recent Updates

*   **UI Refinement:**
    *   The quarter indicator's color has been changed to grey for better visual consistency.
    *   The settings modal has been redesigned into a more organized two-column layout.
    *   The language selector was moved to a more prominent position at the top of the settings modal.
    *   The display of recent logs has been made more compact.
*   **Log Management Enhancements:**
    *   Added buttons to the settings panel to "Clear all logs" and "Clear incomplete logs".
    *   Improved the logic to correctly identify an "incomplete" log (a game that did not reach the "End of Quarter 4" event).
*   **Overtime Correction:**
    *   Fixed the game flow logic to ensure that if the score is tied at the end of the 4th quarter, the game correctly transitions into an overtime period (`OT`).
