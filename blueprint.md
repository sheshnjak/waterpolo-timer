
# Water Polo Timer Blueprint

## Overview

This application is a specialized, feature-rich timer and scoreboard designed for water polo referees, coaches, and players. It provides a comprehensive and intuitive interface for managing all critical aspects of a water polo match, ensuring accuracy and ease of use during fast-paced games. The app is built with the latest version of Angular, leveraging modern features like standalone components, signals, and native control flow for optimal performance and maintainability.

## Features

- **Main Game Clock**: A large, clear display for the quarter time, which can be easily started, stopped, and edited.
- **Attack Clock**: A dedicated 30-second attack clock that automatically resets and can also be manually reset to the full duration or a continued (20-second) duration.
- **Scoreboard**: Simple, clickable scores for both the home (White) and away (Blue) teams.
- **Exclusion Timers**: Functionality to add and manage 20-second exclusion periods for each team.
- **Quarter Management**: A "Next Quarter" button to advance the game state, with logic for handling regulation and overtime periods.
- **Game State Management**: The app accurately tracks game state, including running/paused, quarter number, and game over conditions.
- **Settings Panel**: A comprehensive settings dialog to customize:
    - Quarter duration
    - Attack duration
    - Continued attack duration
    - Exclusion duration
    - Team names
- **Game Log**: The application automatically logs every significant event (goals, exclusions, time adjustments) and provides the ability to download the game log as a text file.
- **Undo Functionality**: A crucial feature that allows the referee to undo the last action, preventing critical errors.
- **Multi-language Support**: The UI is fully translated into English and Croatian, with a simple language selector.
- **Responsive Design**: The interface is optimized for both wide (desktop/tablet landscape) and narrow (mobile portrait) screens, ensuring a seamless experience on any device.

## Design and Styling

The application follows a clean, dark-mode aesthetic designed for high visibility in various lighting conditions. The styling is managed at a component level, ensuring that styles are encapsulated and easy to maintain.

- **Color Palette**:
    - **Primary Action (Start/Stop)**: Green (`#4CAF50`) for "Start" and Red (`#f44336`) for "Stop."
    - **Attack Resets**: A bright, distinct yellow (`#fcf800`) for a new attack and orange (`#ff9800`) for a continued attack.
    - **Team Colors**: White (`#fff`) for the home team and Blue (`#2196f3`) for the away team.
- **Typography**: `Roboto Mono` is used for timers and scores to provide a clear, fixed-width digital clock feel. A standard sans-serif font is used for other UI elements.
- **Component-Specific Styles**: Instead of a global stylesheet, each component has its own `.css` file. This approach keeps styling concerns localized and avoids unintended side effects. For example, button styles are defined within the component that uses them (e.g., `game-board.component.css`, `settings.component.css`), using semantic class names like `.button-save` or `.button-white` that describe their function or appearance within that specific context.
- **Layout**: The layout is built with Flexbox to ensure flexibility and responsiveness across different screen sizes and orientations.

## Deployment Strategy

- **Deployment Target**: The project **MUST** be deployed to **GitHub Pages**.
- **Deployment Branch**: The application is built and deployed to the `gh-pages` branch.
- **Deployment Tool**: The `gh-pages` npm package is the designated and sole tool for all deployments. The `deploy` script in `package.json` is configured for this purpose.
- **Forbidden Platform**: **Firebase is NOT to be used for deployment under any circumstances.** All deployment efforts must be directed to GitHub Pages as specified.
