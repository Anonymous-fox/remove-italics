import * as vscode from 'vscode';
import { Theme, ThemeItem } from './interfaces';


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
			let parentDirName = await getParentDirName(value!);
			let themes = await vscode.workspace.fs.readDirectory(vscode.Uri.joinPath(value!.uri, parentDirName));
			themes.forEach(async theme => {
				let themeUri = vscode.Uri.joinPath(value!.uri, parentDirName, theme[0]);
				let content = await vscode.workspace.fs.readFile(themeUri);
				removeItalics(content.toString());
			});
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
						uri: vscode.Uri.file(extPath + theme.path.slice(1)),
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

async function getParentDirName(theme: ThemeItem) {
	let dir = vscode.workspace.fs.readDirectory(theme.uri);
	let parentDir = (await dir).find(theme => (theme[0] === "themes" || theme[0] === "theme") && theme[1] === 2);

	return `/${parentDir![0]}/`;
}

function removeItalics(content: string) {
	console.log(content); //TODO: change JSON, create and save new file
}
