import * as vscode from 'vscode';

function getSeverity(value: string) : vscode.DiagnosticSeverity {
	switch(value) {
		case("ERROR"):   return vscode.DiagnosticSeverity.Error;
		case("WARNING"): return vscode.DiagnosticSeverity.Warning;
		case("INFO"):    return vscode.DiagnosticSeverity.Information;
		case("DEBUG"):   return vscode.DiagnosticSeverity.Hint;
		default:         return vscode.DiagnosticSeverity.Information
	}
}

export default function messagesToDiagnostics(stdout: string, stderr: string) {
	const diagnostics: vscode.Diagnostic[] = [];
	// injection/ ERROR: 0:7:5: '' :  syntax error, unexpected IDENTIFIER
	// shader/    ERROR: stdin:1:5: '' :  syntax error, unexpected IDENTIFIER
	const r = /^(ERROR|WARNING):\s+(stdin|\d+):(\d+):(\d+):\s+(.*)$/gm;
	const matches = [...stdout.matchAll(r)];

	for(const match of matches) {
		const msg: string = match[5];
		const severity: vscode.DiagnosticSeverity = getSeverity(match[1]);
		const col:  number = Number(match[4]);
		const line: number = Number(match[3]) - 1;
		const range = new vscode.Range(line, 0, line, col);
		const diagnostic = new vscode.Diagnostic(range, msg, severity);

		diagnostics.push(diagnostic);
	}

	return diagnostics;
}