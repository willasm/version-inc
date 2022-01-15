![](https://vsmarketplacebadge.apphb.com/version-short/willasm.version-inc.svg)
![](https://vsmarketplacebadge.apphb.com/installs-short/willasm.version-inc.svg)
![](https://vsmarketplacebadge.apphb.com/downloads-short/willasm.version-inc.svg)
![](https://vsmarketplacebadge.apphb.com/rating/willasm.version-inc.svg)

# Version Inc
Increases the version in projects package.json file.


## Features
- Increase the version in projects package.json file.
- Optionally, insert new version string into other project files.
- Current version is displayed on the status bar.
- Update version by clicking status bar item.


## Screenshot
![Example Screenshot](./images/version-inc-demo.gif)


## Usage
The following commands are available from the command pallette:
- `Version Inc: Increment Package.json Version` (Increment Project Version)
- `Version Inc: Decrement Package.json Version` (Decrement Project Version)
- `Version Inc: Edit Settings for Update Files` (Edit Project Files to Update List)

Or simply click on the status bar item to increment the current version.

## Configure Project Files to Update
The string `"V-INC"` can be iserted into any project file and this will optionally be replaced with the new versions string. These files are maintained in the `version-inc.json` file stored in this extensions Global Storage folder. This settings file can be edited with the command `Version Inc: Edit Settings for Update Files`. By default it contains 2 example files, `example.md` and `example.js` (also stored in the Global Storage folder).

Here is the default settings...

```
[
	{
		"filename": "example.md",
		"filelocation": "${globalStorage}",
		"enable": false,
		"insertbefore": "",
		"insertafter": ""
	},
	{
		"filename": "example.js",
		"filelocation": "${globalStorage}",
		"enable": false,
		"insertbefore": "v",
		"insertafter": "-Beta"
	}
]
```
The `"filename":` entry contains the file name to update.

The `"filelocation":` entry is the path to the file to update. This can be set to `${workspaceFolder}` or simply `""` to set location to the projects root folder. To set location to a sub-folder within the projects root folder enter `"subfoldername"` or `subfoldername\\secondlevelfolder` without a trailing `\\`. The name `"${globalStorage}"` used for the example files simply points to this extensions Global Storage storage location.

`"enable":` Enable (`true`) or disable (`false`) updating this file.

`"insertbefore":` String to insert before the new version string.

`"insertafter":` String to insert after the new version string.


To see this in operation enable the example files, then run the increment version command to see the results.

Note: The updated files are not automatically saved. This allows you to review the changes made and to continue making any other changes you require.


## Settings

`"version-inc.statusBarPrompt"` - Status Bar item when clicked with the mouse - prompt for Version Increment or Decrement

Default: No prompt, just perform version increment.


## Release Notes
See the [Release Notes](RELEASE.md) for details.

