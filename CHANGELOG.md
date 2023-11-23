# Change Log
<!--
## [1.1.0] 2023-11-23
### Added
- Settings option for addition package.json folder locations.
### Changed
### Deprecated
### Removed
### Fixed
### Security
### Updated 
-->

<!-- ## [v-inc] ${YEAR4}-${MONTHNUMBER}-${DATE} -->

## [1.1.0] 2023-11-22
### Added
- Settings option for additional package.json folder locations.

## [1.0.0] 2022-04-01
### Added
- "activationEvents" now set to "workspaceContains:package.json"
  (Extension will only load if package.json exists)
- Optionally use package.json displayName: "value" for status bar button text added to settings
  (Uses name: "value" by default)
- "menus", "commandPalette", "command", "when": "workspaceHasPackageJSON" to manifest
  (Command pallette commands will now only appear when package.json exists)
- Screenshots of before and after version increment on one of the example files
### Changed
- Now uses "name" value from manifest for status bar button text (Use displayName value option added to settings)
### Fixed
- The "description" keys for "InsertBefore" and "InsertAfter" in `version-inc-schema.json` were reversed
- Pick command from status bar button was not working properly
- Version-inc menu commands now only show when workspace has manifest file (package.json)
- Version decrement now displays appropiate pick options

## [0.0.8] 2022-02-06
### Updated 
- Updated CHANGELOG.md

## [0.0.7] 2022-02-06
### Added
- Added version-inc-schema.json for settings validation (Greatly simplifies adding new file entries)

## [0.0.6] 2022-02-01
- Added - Files settings option to retain v-inc macro line in file (`RetainLine`).

ed - Files settings option to retain 1.0.0 macro line in file (`RetainLin
- Added - Files settings option to trim characters from start of line with V-INC macro (`TrimTextStart`).

ed - Files settings option to trim characters from start of line with 1.0.0 macro (`TrimTextStar
- Added - Files settings option to trim characters from end of line with V-INC macro (`TrimTextEnd`).

ed - Files settings option to trim characters from end of line with 1.0.0 macro (`TrimTextEn
- Added - Date and Time macros.
- Added - Edit example files command.
- Updated - Screenshot has been updated to reflect the new changes.

## [0.0.5] 2022-01-23
- Fixed - Status bar item text will default to `"name"` entry if `"displayName"` entry is not defined.

## [0.0.4] 2022-01-17
- Fixed - Will now create projects files list json file if it does not exist.

## [0.0.3] 2022-01-16
- Fixed - Each project now has its own files list json file.

## [0.0.2] 2022-01-15
- Added - `Version Inc: Edit Settings for Update Files`

## [0.0.1] 2022-01-15

- Initial release