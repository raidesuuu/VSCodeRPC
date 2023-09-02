// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const RPC = require("discord-rpc");
const path = require('path');
const rpc = new RPC.Client({
	transport: "ipc"
});

const date = new Date();

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const onFileChanged = vscode.workspace.onDidOpenTextDocument(async (ev) => {
		const configuration = vscode.workspace.getConfiguration("vscoderpc");
		if (!configuration.get("privateMode")) {
			rpc.setActivity({
				details: vscode.workspace.name ? `In workspace "${vscode.workspace.name}".` : "No Workspaces",
				state: `Editing file "${path.basename(ev.fileName)}".`,
				startTimestamp: date,
				largeImageKey: ev.languageId ? ev.languageId : "json",
				largeImageText: `Extension: ${ev.languageId ? ev.languageId : "json"}`
			});
		} else {
			rpc.setActivity({
				state: `Private mode is enabled.`,
				startTimestamp: date,
				largeImageKey: "vscode",
				largeImageText: `Visual Studio Code v${vscode.version}`
			});
		}
	})

	rpc.on("ready", () => {
		const configuration = vscode.workspace.getConfiguration("vscoderpc");
		if (vscode.window.activeTextEditor?.document.fileName && !configuration.get("privateMode")) {
			rpc.setActivity({
				details: vscode.workspace.name ? `In workspace "${vscode.workspace.name}".` : "No Workspaces",
				state: `Editing file "${path.basename(vscode.window.activeTextEditor?.document.fileName)}".`,
				startTimestamp: date,
				largeImageKey: vscode.window.activeTextEditor?.document.languageId,
				largeImageText: `Extension: ${vscode.window.activeTextEditor?.document.languageId}`
			});
		} else if (!vscode.window.activeTextEditor?.document.fileName && !configuration.get("privateMode")) {
			rpc.setActivity({
				details: vscode.workspace.name ? `In workspace ${vscode.workspace.name}.` : "No Workspaces",
				state: `No Files.`,
				startTimestamp: date,
				largeImageKey: "vscode",
				largeImageText: `Visual Studio Code v${vscode.version}`
			});
		} else {
			rpc.setActivity({
				state: `Private mode is enabled.`,
				startTimestamp: date,
				largeImageKey: "vscode",
				largeImageText: `Visual Studio Code v${vscode.version}`
			});
		}

	});

	rpc.login({
		clientId: "1147502929687875614"
	});

	context.subscriptions.push(onFileChanged);
	console.log("Completed")
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
