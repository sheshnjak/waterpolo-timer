# Water Polo Timer

## Overview

A simple and intuitive water polo timer application built with the latest features of Angular. This application provides a game timer, attack timer, scoreboard, and exclusion management for two teams. It is fully responsive and supports both English and Croatian languages.

## Features

*   **Game Timer:** A customizable timer for each quarter, with a clickable quarter counter.
*   **Attack Timer:** A customizable 30-second attack timer with tenths-of-a-second precision.
*   **Scoreboard:** A clear and easy-to-read scoreboard for two teams.
*   **Click-to-Score:** Increment a team's score by simply clicking on the score display.
*   **Exclusion Timers:** A section to display and manage 20-second exclusion timers for each team.
*   **Undo Functionality:** A temporary undo button appears after a quarter change, allowing for quick reversal of accidental actions.
*   **Settings:** A settings dialog to customize quarter duration, attack times, team names, and language.
*   **Persistence:** All settings, including language preference, are saved to `localStorage`.
*   **Responsive Design:** The application is optimized for a great experience on both desktop and mobile devices.
*   **Audio Cues:** Sound alerts for the end of the quarter and the end of the attack clock.
*   **Bilingual Interface:** The interface is available in both English and Croatian, with Croatian as the default.
*   **Game Logging**: The application logs key game events and provides the option to download the log as a CSV file.
*   **Recent Logs**: The last five game logs are stored in `localStorage` and can be downloaded from the settings menu.

## Design and Style

*   **Theme:** A modern dark theme for better visibility in different lighting conditions.
*   **Layout:** A streamlined and minimalist layout that maximizes vertical space by removing unnecessary titles and headers. The quarter display is integrated with the main timer for a cleaner look.
*   **Color-Coding:** Team-specific colors are used for scores, exclusion timers, and controls to improve readability and quick recognition.
*   **Visual Effects:** A glowing effect on the active `Start/Stop` button provides clear visual feedback.
*   **Responsiveness:** The application is designed to be responsive and work on various screen sizes.
*   **Iconography:** Icons are used for settings and undo functionality, and flags are used in the language selector.

## Project Phases

### Phase 1: Core Functionality (Completed)

*   [x] Create the main `game-board` component.
*   [x] Implement the quarter time and attack time timers.
*   [x] Implement the scoreboard for the white and blue teams.
*   [x] Add basic controls to start/stop the timers and adjust the scores.
*   [x] Style the application with a dark theme.

### Phase 2: Advanced Controls & Exclusions (Completed)

*   [x] Add functionality to add exclusion timers for both teams.
*   [x] Display and manage exclusion timers.
*   [x] Add controls to reset the attack timer to 30 or 20 seconds.
*   [x] Add controls to manage quarters (next, reset).

### Phase 3: Settings & Persistence (Completed)

*   [x] Create a `SettingsComponent` to manage game settings.
*   [x] Allow customization of quarter duration, attack duration, and team names.
*   [x] Save the settings to `localStorage` to persist them between sessions.

### Phase 4: Polishing & Refinements (Completed)

*   [x] Improve the visual design and user experience.
*   [x] Add sounds for the end of the quarter and the end of the attack time.
*   [x] Make the application responsive for different screen sizes.

### Phase 5: Bilingual Interface (Completed)

*   [x] Create a translation service to handle English and Croatian languages.
*   [x] Set Croatian as the default language.
*   [x] Add a language selector with flags to the settings dialog.
*   [x] Integrate translations throughout the application.
*   [x] Persist the selected language in `localStorage`.

### Phase 6: UI Redesign and Undo Functionality (Completed)

*   [x] Relocated the settings button to the top-right corner with a gear icon.
*   [x] Implemented a conditional undo button that appears for 3 seconds after a quarter change.
*   [x] Redesigned the main controls for better usability, including a larger start/stop button.
*   [x] Applied team-specific colors to goal and exclusion buttons, as well as scores and exclusion timers for improved readability.

### Phase 7: UI Correction and Refinement (Completed)

*   [x] Corrected the button layout to match the user's specifications.
*   [x] Restored the glowing effect for the active `Start/Stop` button.
*   [x] Ensured all team-related elements are correctly color-coded.
*   [x] Re-introduced visual separators for timers to improve clarity.
*   [x] Consolidated the "Exclusions" title.

### Phase 8: UI and Functionality Enhancements (Completed)

*   [x] Integrated the quarter counter directly into the quarter timer display, removing the separate title.
*   [x] Enhanced the attack timer to display tenths of a second for higher precision.
*   [x] Implemented a "click-to-score" feature on the main scoreboard for faster score updates.

### Phase 9: UI Streamlining and Usability Improvements (Completed)

*   [x] Restored the click-to-increment functionality on the main quarter timer display.
*   [x] Enlarged the quarter counter to match the timer's font size for better readability.
*   [x] Removed the attack timer's title and the top header to maximize vertical space.
*   [x] Relocated the settings and undo buttons to the top-right corner of the main content area for a cleaner layout.

### Phase 10: Game Logging and Download (Completed)

*   [x] Created a new service to manage game logs.
*   [x] Implemented event logging for key game events (game start, score changes, exclusions, quarter ends).
*   [x] Stored the last five game logs in `localStorage`.
*   [x] Added a dialog to offer a log download at the end of the game.
*   [x] Added a section in the settings to view and download recent logs.
*   [x] Changed the language selector to use flags for a more intuitive experience.
