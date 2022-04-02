# Release Notes

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


For a full list of changes, please see the projects [Changelog](CHANGELOG.md) file.

I hope you enjoy using the Extension, and if you find any bugs, or would like to see a certain feature added, please feel free to contact me.

Enjoy! William McKeever
