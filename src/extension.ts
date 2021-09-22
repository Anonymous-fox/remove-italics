import * as vscode from 'vscode';

interface Theme {
	id: any,
	label: any,
	uiTheme: any,
	path: any
}

interface MyQuickPickItem extends vscode.QuickPickItem {
	label: string,
	path: string
}

export function activate(context: vscode.ExtensionContext) {
	let themes = vscode.extensions.all.filter(
		ext => ext.packageJSON.categories && ext.packageJSON.categories.includes("Themes")
	);
	console.log(themes);

	let singleItalics = vscode.commands.registerCommand('remove-italics.removeSingleItalics', async () => {
		let theme = vscode.window.showQuickPick(
			getQuickPick('themes'), { placeHolder: "Select Color Theme" }
		);
		// console.log(await theme);
		// removeItalics(getTheme(await theme));
	});

	let multipleItalics = vscode.commands.registerCommand('remove-italics.removeMultipleItalics', async () => {
		let extension = vscode.window.showQuickPick(
			getQuickPick('ext'), { placeHolder: "Select Extension" }
		);
		// console.log(await extension);
		// let themes = getExtension(await extension);
		// if (themes !== undefined) {
		// 	themes.forEach((theme: any) => {
		// 		removeItalics(getTheme(theme));
		// 	});
		// }
	});

	function getQuickPick(type: string) {
		let quickPick: Array<MyQuickPickItem> = [];
		themes.forEach(themeArr => {
			if (type === 'ext') {
				quickPick.push({
					label: themeArr.packageJSON.displayName,
					path: themeArr.extensionPath,
				});
			} else if (type === 'themes') {
				let extPath = themeArr.extensionPath;
				themeArr.packageJSON.contributes.themes.forEach((theme: Theme) => {
					quickPick.push({
						label: theme.label,
						path: extPath + theme.path,
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

// function getExtension(par: any) {
// 	let arr: Array<Theme> = [];
// 	return arr;
// }

// function getTheme(par: any) {
// 	let theme: Theme;
// 	return theme.empty();
// }

// function removeItalics(theme: Theme) {
// 	let path = theme.path;
// }
