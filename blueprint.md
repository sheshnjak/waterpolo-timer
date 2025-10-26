
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

- Added `goalScoredBy` and `noRecentLogs` translations to the `language.service.ts` to support internationalization for the goal log message and the "no recent logs" message in the settings panel.
- Updated the `game-board.component.ts` to use the new `goalScoredBy` translation when logging a goal.
- Updated the `settings.component.ts` to use the new `noRecentLogs` translation.
- Fixed a series of build errors in `settings.component.ts` related to incorrectly accessing an `@Input()` property in the constructor, an incorrect import of a `Team` model that didn't exist, type mismatches between the component's understanding of the `GameLog` object and the actual implementation in `log.service.ts` and `models.ts`, and incorrect method calls to the `log.service.ts`.
