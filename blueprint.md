
# Water Polo Timer

This application is a feature-rich water polo timer designed for both official games and practice sessions. It provides a comprehensive set of tools to manage game time, attack clocks, exclusions, and logging, ensuring a smooth and accurately recorded game.

## Features

- **Game Clock:** A primary timer for the entire game, configurable for different quarter lengths.
- **Attack Clock:** A secondary timer for the 30-second attack rule.
- **Exclusion Timer:** Manages 20-second player exclusions.
- **Scoring:** Buttons to add goals for both the home and away teams.
- **Team Names:** Editable names for both competing teams.
- **Sound Notifications:** Audio cues for the end of a quarter and the end of an attack.
- **Multilingual Support:** The interface is available in English and Croatian.
- **Game Log:** A detailed log of all game events, which can be downloaded as a CSV file.
- **Settings Panel:** A comprehensive settings panel to customize game parameters.
- **Recent Logs:** A list of recent game logs, with the ability to download each one.
- **Persistent State:** All settings and game state are saved to local storage, so you can pick up where you left off.
- **Responsive Design:** The application is designed to work on a variety of screen sizes.

## Current Plan

I will continue to add more features and improvements to the application. The following is a list of changes that I have just implemented:

- Added an `addGoal` translation to the `language.service.ts` to support internationalization for the goal buttons.
- Updated the `game-board.component.ts` to provide the `addGoal` translation to the template.
- Replaced the hard-coded "+ GOL" text in `game-board.html` with the new `addGoal` translation key.
- Fixed a bug in `settings.component.html` that was causing a build error due to an incorrect method call on the `LanguageService`.
