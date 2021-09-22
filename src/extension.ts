import * as vscode from 'vscode';

interface Theme {
	id: any,
	label: any,
	uiTheme: any,
	path: any,
}

export function activate(context: vscode.ExtensionContext) {
	let themes = vscode.extensions.all.filter(
		ext => ext.packageJSON.categories && ext.packageJSON.categories.includes("Themes")
	);
	// let themesQuickPick: any[];
	// themes.forEach(
	// 	themeArr => themeArr.packageJSON.contributes.themes.forEach(
	// 		(theme: Theme) => themesQuickPick.push(theme.label)
	// 	)
	// );

	let singleItalics = vscode.commands.registerCommand('remove-italics.removeSingleItalics', async () => {
		let theme = vscode.window.showQuickPick(
			getQuickPick('theme'), { placeHolder: "Select Color Theme" }
		);
		// removeItalics(await theme);
	});

	let multipleItalics = vscode.commands.registerCommand('remove-italics.removeMultipleItalics', async () => {
		let themes = vscode.window.showQuickPick(
			getQuickPick('extensions'), { placeHolder: "Select Extension" }
		);
		// await themes.forEach((theme: Theme) => {
		// 	removeItalics(theme);
		// });
	});

	function getQuickPick(type: string) {
		let quickPick: any[] = [];
		themes.forEach(themeArr => {
			type === 'extensions' 
			? quickPick.push(themeArr.packageJSON.displayName) 
			: themeArr.packageJSON.contributes.themes.forEach((theme: Theme) => {
				quickPick.push(theme.label);
			}); 
		});
		return quickPick || null;
	}

	context.subscriptions.push(singleItalics);
	context.subscriptions.push(multipleItalics);
}

export function deactivate() { }



function removeItalics(theme: Theme) {
	let path = theme.path;
}