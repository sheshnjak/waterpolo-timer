# Water Polo Timer

This application is a feature-rich, interactive timer for water polo matches. It is built with the latest version of Angular, leveraging modern features like standalone components, signals, and native control flow.

## Project Overview

### Style and Design

*   **Modern and Interactive:** The application features a clean, intuitive, and visually appealing user interface.
*   **Responsive:** The layout is fully responsive, ensuring a seamless experience on both mobile and desktop devices.
*   **Aesthetics:** The design incorporates a balanced layout, clean spacing, and a polished, easy-to-understand visual hierarchy.

### Features

*   **Game Clock:** A prominent timer for the current quarter.
*   **Attack Clock:** A dedicated timer for the 30-second shot clock.
*   **Scoreboard:** A clear and concise scoreboard to display the scores of both teams.
*   **Exclusion Timers:** A section to manage and display exclusion timers for both teams.
*   **Game Controls:** Intuitive controls to start, stop, and reset the timers, as well as to manage the game state.
*   **Settings:** A customizable settings panel to adjust the game parameters, such as quarter duration, attack duration, and team names.
*   **Localization:** The application supports both English and Croatian languages.
*   **Game Log:** A comprehensive game log that can be downloaded as a CSV file.
*   **Undo Functionality:** The ability to undo the last action.

## Current Task: Implement New Timer Logic

The following changes will be implemented to improve the timer functionality:

1.  **Stop Attack Timer with Game Clock:** The attack timer will now stop when the main game clock is stopped.
2.  **Attack Timer Obeys Game Clock:** The attack timer will not be able to be set to a time greater than the main game clock.
3.  **Automatic Attack Clock Reset:** When the attack clock reaches zero, it will automatically reset to the full 30 seconds.
4.  **End of Quarter Handling:** When the quarter timer reaches zero, both timers will stop, and the end-of-quarter horn will sound.
5.  **Game Over Dialog:** At the end of the 4th quarter, a "Game Over" dialog will be displayed, and the game log will be saved to local storage.
6.  **"New Attack" Translation:** The translation for "Reset Attack" will be changed to "New Attack" in both English and Croatian.
