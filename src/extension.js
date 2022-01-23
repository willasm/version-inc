const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const { readFile } = require('fs/promises')
const { join } = require('path')

module.exports = {
    activate,
    deactivate,
};

let myStatusBarItem;
let myContext;
let globalSettingsPath;
let globalSettingsFile;
let packageJsonFile;
let workspaceName;
let projectName;
let settings = vscode.workspace.getConfiguration("version-inc");
let promptStatusBarCommand = settings.get("statusBarPrompt");

// ========================================================================== //
// ---=== Function Activate (Extension Activation) ===---
// ========================================================================== //
async function activate(context) {

    // ========================================================================== //
    //      Activate - Initialize Extension
    globalSettingsPath = context.globalStoragePath;
    workspaceName = path.basename(vscode.workspace.workspaceFolders[0].uri.fsPath);
    packageJsonFile = join(vscode.workspace.workspaceFolders[0].uri.fsPath, 'package.json');
    const packageFile = await readFile(packageJsonFile); // Read file into memory
    const packageJson = JSON.parse(packageFile.toString()); // Parse json
    projectName = packageJson['displayName']; // Get displayName for status bar project name
    if (projectName === undefined) {
        projectName = packageJson['name']; // Get displayName for status bar project name
    }
    globalSettingsFile = globalSettingsPath + '\\' + 'version-inc-' + projectName + '.json'; // Files list json file
    myContext = context; // Save context
    await initSettingsFilePath(context); // Initialize settings and example files
    createStatusBarItem(); // Create status bar item
    await initStatusBar(); // Initialize status bar item
    myStatusBarItem.show(); // Show status bar item

    // ========================================================================== //
    //      Activate - Register Extension Commands
    vscode.commands.registerCommand('version-inc.version-inc', incVersion);
    vscode.commands.registerCommand('version-inc.version-dec', decVersion);
    vscode.commands.registerCommand('version-inc.edit-files-list', editFilesList);
    vscode.commands.registerCommand('version-inc.version-pick', pickCommand);

    // ========================================================================== //
    //      Activate - Push Subscriptions
    context.subscriptions.push(incVersion);
    context.subscriptions.push(decVersion);
    context.subscriptions.push(editFilesList);
    context.subscriptions.push(pickCommand);
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(fileSaved));
}

// ========================================================================== //
// ---=== initStatusBar (Initialize Status Bar Item) ===---
// ========================================================================== //
async function initStatusBar() {
    const packageFile = await readFile(packageJsonFile); // Read file into memory
    const packageJson = JSON.parse(packageFile.toString()); // Parse json
    const version = packageJson['version']; // Get projects current version for status bar
    myStatusBarItem.text = '$(versions) ' + projectName + ' ' + 'v' + version // Update status bar items text
}

// ========================================================================== //
// ---=== createStatusBarItem (Create Status Bar Item) ===---
// ========================================================================== //
function createStatusBarItem() {
    // If status bar item is undefined then create it
    if (myStatusBarItem === undefined) {
        myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1); // Place on left side of status bar
        myStatusBarItem.command = 'version-inc.version-pick'; // Set command to version inc/dec picker command
        myStatusBarItem.tooltip = 'Update package.json version'; // Set tooltip text
    }
}

// ========================================================================== //
// ---=== fileSaved (Called Everytime User Saves a File) ===---
// ========================================================================== //
function fileSaved() {
    initStatusBar(); // Update status bar (Ensures update if user edits package.json)
}

// ========================================================================== //
// ---=== pickCommand (Prompt User for Version Update Method) ===---
// ========================================================================== //
async function pickCommand() {

    if (!promptStatusBarCommand) { // Increment version if prompt is disabled
        incVersion(); // Increment version
        return;
    }

    // Prompt user for choice of inc/dec version
    let options = {
        placeHolder: "Increment or Decrement Version?",
        title: "---=== Version Inc - Select Version Update Format ===---"
    };
    const pick = await vscode.window.showQuickPick([{
            label: 'Increment',
            detail: `Increment Version`
        },
        {
            label: 'Decrement',
            detail: `Decrement Version`
        }
    ], options);

    if (!pick) // Canceled
        return;

    if (pick == 'Increment') {
        incVersion(); // Increment version
    } else {
        decVersion(); // Decrement version
    }
}

// ========================================================================== //
// ---=== incVersion (Increment Project Version) ===---
// ========================================================================== //
async function incVersion() {
    packagePath = join(vscode.workspace.workspaceFolders[0].uri.fsPath, 'package.json');
    if (!fs.existsSync(packagePath)) {
        vscode.window.showWarningMessage('No package.json File Found!');
        return;
    }
    const packageFile = await readFile(this.packagePath);
    const packageJson = JSON.parse(packageFile.toString());
    const displayName = packageJson['displayName'];
    const version = packageJson['version'];
    const versionArr = version.split('.').map(Number);
    const versions = {
        major: [versionArr[0] + 1, 0, 0].join('.'),
        minor: [versionArr[0], versionArr[1] + 1, 0].join('.'),
        patch: [versionArr[0], versionArr[1], versionArr[2] + 1].join('.')
    };

    // Create list of options
    let options = {
        placeHolder: "Select which version to update",
        title: "---=== Version Inc - Increment Version ===---"
    };
    const pick = await vscode.window.showQuickPick([{
            label: 'Patch',
            detail: `${version} → ${versions.patch}`
        },
        {
            label: 'Minor',
            detail: `${version} → ${versions.minor}`
        },
        {
            label: 'Major',
            detail: `${version} → ${versions.major}`
        }
    ], options);

    if (!pick) {
        return;
    }

    // Choose new version
    const newVersion = versions[pick.label.toLowerCase()];
    // Replace original file version with new one
    packageJson.version = newVersion;
    // Update package.json with new version
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, '\t'));
    // Notify user of new version
    vscode.window.showInformationMessage(`Version Bumped to ${newVersion}`);
    myStatusBarItem.text = '$(versions) ' + displayName + ' ' + 'v' + newVersion;
    updateOtherFiles(newVersion);
}

// ========================================================================== //
// ---=== decVersion (Decrement Project Version) ===---
// ========================================================================== //
async function decVersion() {
    packagePath = join(vscode.workspace.workspaceFolders[0].uri.fsPath, 'package.json');
    if (!fs.existsSync(packagePath)) {
        vscode.window.showWarningMessage('No package.json File Found!');
        return;
    }
    const packageFile = await readFile(this.packagePath);
    const packageJson = JSON.parse(packageFile.toString());
    const displayName = packageJson['displayName'];
    const version = packageJson['version'];
    const versionArr = version.split('.').map(Number);
    const versions = {
        major: [versionArr[0] - 1, versionArr[1], versionArr[2]].join('.'),
        minor: [versionArr[0], versionArr[1] - 1, versionArr[2]].join('.'),
        patch: [versionArr[0], versionArr[1], versionArr[2] - 1].join('.')
    }
    if (versionArr[0] == '0' && versionArr[1] == '0' && versionArr[2] == '0') {
        vscode.window.showWarningMessage('Cannot reduce v0.0.0');
        return;
    }
    versions.major = versions.major.replace('-1', '0')
    versions.minor = versions.minor.replace('-1', '0')
    versions.patch = versions.patch.replace('-1', '0')

    // Create list of options
    let options = {
        placeHolder: "Select which version to update",
        title: "---=== Version Inc - Decrement Version ===---"
    };
    const pick = await vscode.window.showQuickPick([{
            label: 'Patch',
            detail: `${version} → ${versions.patch}`
        },
        {
            label: 'Minor',
            detail: `${version} → ${versions.minor}`
        },
        {
            label: 'Major',
            detail: `${version} → ${versions.major}`
        }
    ], options);

    if (!pick) {
        return;
    }

    // Choose new version
    const newVersion = versions[pick.label.toLowerCase()];
    // Replace original file version with new one
    packageJson.version = newVersion;
    // Update package.json with new version
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, '\t'));
    // Notify user of new version
    vscode.window.showInformationMessage(`Version Bumped to ${newVersion}`);
    myStatusBarItem.text = '$(versions) ' + displayName + ' ' + 'v' + newVersion;
    updateOtherFiles(newVersion);
}

// ========================================================================== //
// ---=== editFiles (Edit Files in version-inc.json) ===---
// ========================================================================== //
async function editFilesList() {
    // Default files list settings json file
    const defaultSettings = "[\n\t{\n\t\t\"filename\": \"example.md\",\n\t\t\"filelocation\": \"${globalStorage}\",\n\t\t\"enable\": false,\n\t\t\"insertbefore\": \"\",\n\t\t\"insertafter\": \"\"\n\t},\n\t{\n\t\t\"filename\": \"example.js\",\n\t\t\"filelocation\": \"${globalStorage}\",\n\t\t\"enable\": false,\n\t\t\"insertbefore\": \"v\",\n\t\t\"insertafter\": \"-Beta\"\n\t}\n]\n";
    // example.md file
    const exampleMD = "# Example of using Version-Inc in a markdown file\n\n## Change Log\n\n## [v-inc]\n\n[comment]: # (Markdown comment examples: V-INC)\n\n<!-- V-INC -->\n";
    // example.js file
    const exampleJS = "//----------------------------------\n// Version-Inc example in a java script file\n//\n// File version: V-INC\n//\n// Product version: v-inc\n//----------------------------------\n";
    if (fs.existsSync(globalSettingsPath)) { // Folder exists so verify settings file exists
        if (fs.existsSync(globalSettingsFile)) {
            // File exists
            var document = await vscode.workspace.openTextDocument(globalSettingsFile); // Open it for editing
            await vscode.window.showTextDocument(document);
            return;
        } else { // Write new settings file if it does not exist
            // Default files list settings json file
            fs.writeFileSync(globalSettingsFile, defaultSettings, 'utf8');
            var document = await vscode.workspace.openTextDocument(globalSettingsFile); // Open it for editing
            await vscode.window.showTextDocument(document);
            return;
        }
    }
    fs.mkdirSync(globalSettingsPath, { recursive: true });
    const exampleMDFilePath = path.join(globalSettingsPath, 'example.md');
    const exampleJSFilePath = path.join(globalSettingsPath, 'example.js');
    fs.writeFileSync(globalSettingsFile, defaultSettings, 'utf8');
    fs.writeFileSync(exampleMDFilePath, exampleMD, 'utf8');
    fs.writeFileSync(exampleJSFilePath, exampleJS, 'utf8');
    var document = await vscode.workspace.openTextDocument(globalSettingsFile); // Open it for editing
    await vscode.window.showTextDocument(document);
}

// ========================================================================== //
// ---=== updateOtherFiles (Update Other Files with the New Version) ===---
// ========================================================================== //
async function updateOtherFiles(newVersion) {

    // Load settings file into memory
    const packageFile = await readFile(globalSettingsFile);
    const packageJson = JSON.parse(packageFile.toString("utf-8"));
    const length = packageJson['length'];

    // Loop through all files in the settings file
    for (let i = 0; i < length; i++) {
        var file = packageJson[i]['filename']; // File name
        var location = packageJson[i]['filelocation']; // File Location
        if (location == "${workspaceFolder}") { // Workspace variable folder provided
            var location = vscode.workspace.workspaceFolders[0].uri.fsPath;
        } else if (location == "${globalStorage}") { // Global storage for example files
            var location = myContext.globalStoragePath;
        } else if (location == "") { // Default to workspace folder if none is provided
            var location = vscode.workspace.workspaceFolders[0].uri.fsPath;
        } else {
            var location = vscode.workspace.workspaceFolders[0].uri.fsPath + '\\' + location; // Path relative to workspace folder
        }

        // Retrieve the rest of the settings
        var enable = packageJson[i]['enable']; // Enable replace flag
        var insBefore = packageJson[i]['insertbefore']; // String to insert before version string
        var insAfter = packageJson[i]['insertafter']; // String to insert after version string
        var newVersionString = insBefore + newVersion + insAfter;

        // If this files update flag is enabled then process it
        if (enable) {
            let targetFile = join(location, file); // Full path to target file
            var document = await vscode.workspace.openTextDocument(targetFile); // Open the file
            await vscode.window.showTextDocument(document); // Show the selected file
            const editor = vscode.window.activeTextEditor;
            let fullText = editor.document.getText(); // Load file into memory
            // 'g' flag is for global search & 'm' flag is for multiline & 'i' is for case insensitive
            let regex = /V-INC/gmi;
            // Replace 'VINC' with new version string
            let textReplace = fullText.replace(regex, newVersionString);
            let invalidRange = new vscode.Range(0, 0, editor.document.lineCount, 0);
            let validFullRange = editor.document.validateRange(invalidRange);

            editor.edit(editBuilder => {
                editBuilder.replace(validFullRange, textReplace);
            }).catch(err => console.log(err));
        }
    }
}

// ========================================================================== //
// ---=== initSettingsFilePath (Global Storage Settings File for My Extension) ===---
// ========================================================================== //
async function initSettingsFilePath(context) {

    // Default files list settings json file
    const defaultSettings = "[\n\t{\n\t\t\"filename\": \"example.md\",\n\t\t\"filelocation\": \"${globalStorage}\",\n\t\t\"enable\": false,\n\t\t\"insertbefore\": \"\",\n\t\t\"insertafter\": \"\"\n\t},\n\t{\n\t\t\"filename\": \"example.js\",\n\t\t\"filelocation\": \"${globalStorage}\",\n\t\t\"enable\": false,\n\t\t\"insertbefore\": \"v\",\n\t\t\"insertafter\": \"-Beta\"\n\t}\n]\n";
    // example.md file
    const exampleMD = "# Example of using Version-Inc in a markdown file\n\n## Change Log\n\n## [v-inc]\n\n[comment]: # (Markdown comment examples: V-INC)\n\n<!-- V-INC -->\n";
    // example.js file
    const exampleJS = "//----------------------------------\n// Version-Inc example in a java script file\n//\n// File version: V-INC\n//\n// Product version: v-inc\n//----------------------------------\n";
    // If folder does exist then return
    if (fs.existsSync(globalSettingsPath)) { // Folder exists so verify settings file exists
        if (fs.existsSync(globalSettingsFile)) {
            // File exists
            return;
        } else { // Write new settings file if it does not exist
            fs.writeFileSync(globalSettingsFile, defaultSettings, 'utf8');
            return;
        }
    }
    // If folder does not exist then create it and the default settings file
    fs.mkdirSync(globalSettingsPath, { recursive: true });
    const exampleMDFilePath = path.join(globalSettingsPath, 'example.md');
    const exampleJSFilePath = path.join(globalSettingsPath, 'example.js');
    fs.writeFileSync(globalSettingsFile, defaultSettings, 'utf8');
    fs.writeFileSync(exampleMDFilePath, exampleMD, 'utf8');
    fs.writeFileSync(exampleJSFilePath, exampleJS, 'utf8');
}

// ========================================================================== //
// ---=== deactivate (Deactivate Extension Cleanup) ===---
// ========================================================================== //
function deactivate() {}