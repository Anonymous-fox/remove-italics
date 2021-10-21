import * as vscode from 'vscode';
import { Theme, ThemeItem, ThemeJSON } from './interfaces';


export function activate(context: vscode.ExtensionContext) {
	let themes = vscode.extensions.all.filter(
		ext => ext.packageJSON.categories && ext.packageJSON.categories.includes("Themes")
	);

	let singleItalics = vscode.commands.registerCommand('remove-italics.removeSingleItalics', async () => {
		let theme = vscode.window.showQuickPick(
			getQuickPick('themes'), { placeHolder: "Select Color Theme" }
		).then(async (value) => {
			let content = await vscode.workspace.fs.readFile(value!.uri);
			console.log(content);
			let modified = modifyTheme(content);
			vscode.workspace.fs.writeFile(value?.extUri!, modified);
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
				let modified = modifyTheme(content);
				vscode.workspace.fs.writeFile(themeUri, modified);
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
						extUri: themeArr.extensionUri,
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

function modifyTheme(themeFile: Uint8Array) {
	let themeFileStr = themeFile.toString();
	let modified = changeThemeName(JSON.parse(removeItalics(themeFileStr)));
	return Uint8Array.from(Array.from(modified).map(letter => letter.charCodeAt(0)));;
}

function removeItalics(content: string) {
	return content.split('"italic"').join('""');
}

function changeThemeName(content: ThemeJSON) {
	content.name += " - removed italics";
	return JSON.stringify(content);
}