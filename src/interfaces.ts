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

export interface ThemeJSON extends JSON {
	$schema: string,
	colors: object,
	name: string,
	tokenColors: Array<object>,
	semanticHighlighting?: boolean,
	semanticTokenColors?: object,
	type?: string,
}