import * as vscode from 'vscode';

interface Theme {
	id: any,
	label: any,
	uiTheme: any,
	path: any
}

interface ThemeItem extends vscode.QuickPickItem {
	label: string,
	uri: vscode.Uri
}

export function activate(context: vscode.ExtensionContext) {
	let themes = vscode.extensions.all.filter(
		ext => ext.packageJSON.categories && ext.packageJSON.categories.includes("Themes")
	);

	let singleItalics = vscode.commands.registerCommand('remove-italics.removeSingleItalics', async () => {
		let theme = vscode.window.showQuickPick(
			getQuickPick('themes'), { placeHolder: "Select Color Theme" }
		).then(async (value) => {
			let content = await vscode.workspace.fs.readFile(value!.uri);
			removeItalics(content.toString());
		});
	});

	let multipleItalics = vscode.commands.registerCommand('remove-italics.removeMultipleItalics', async () => {
		let extension = vscode.window.showQuickPick(
			getQuickPick('ext'), { placeHolder: "Select Extension" }
		).then(async (value) => {
			let directory = await vscode.workspace.fs.readDirectory(value!.uri);
			// console.log(directory);
			// directory.forEach(async (file) => {
			// 	let content = await vscode.workspace.fs.readFile(vscode.Uri.file(file));
			// 	removeItalics(content.toString());
			// });
		});
	});

	function getQuickPick(type: string) {
		let quickPick: Array<ThemeItem> = [];
		themes.forEach(themeArr => {
			if (type === 'ext') {
				quickPick.push({
					label: themeArr.packageJSON.displayName,
					uri: themeArr.extensionUri,
				});
			} else if (type === 'themes') {
				let extPath = themeArr.extensionPath;
				themeArr.packageJSON.contributes.themes.forEach((theme: Theme) => {
					quickPick.push({
						label: theme.label,
						uri: vscode.Uri.file(extPath + theme.path),
					});
				});
			}
		});
		return quickPick;
	}

	context.subscriptions.push(singleItalics);
	context.subscriptions.push(multipleItalics);
}

export function deactivate() { }

function removeItalics(content: string) {
}
