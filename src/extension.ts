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
	let themesQuickPick: any[] = [];
	themes.forEach(
		themeArr => themeArr.packageJSON.contributes.themes.forEach(
			(theme: Theme) => themesQuickPick.push(theme.label)
		)
	);

	let disposable = vscode.commands.registerCommand('remove-italics.removeItalics', async () => {
		let theme = vscode.window.showQuickPick(
			themesQuickPick, { placeHolder: "Select Color Theme" }
		);
		removeItalics(await theme);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }

function removeItalics(theme: Theme) {
	let path = theme.path;
}