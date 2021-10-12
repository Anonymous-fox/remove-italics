import * as vscode from 'vscode';

export interface Theme {
	id: any,
	label: any,
	uiTheme: any,
	path: any
}

export interface ThemeItem extends vscode.QuickPickItem {
	label: string,
	uri: vscode.Uri
}
