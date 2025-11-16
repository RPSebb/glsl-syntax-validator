import * as vscode from 'vscode';
import * as path from "path";
import getCodeInjection from './codeInjectionService';
import runProcessWithTimeout from './process';
import { ConfigService } from './configService';
import messagesToDiagnostics from './glslangValidatorParser';
import { Logger } from './logger';

const NAME = 'glsl-syntax-validator';
const CHANNEL = "GLSL Syntax Validator";

const diagnosticCollection = vscode.languages.createDiagnosticCollection(NAME);
const config = new ConfigService(NAME);

export function activate(context: vscode.ExtensionContext) {

	Logger.init(CHANNEL);

	context.subscriptions.push(
		Logger,
		vscode.workspace.onDidSaveTextDocument   (document => validate(document)),
		vscode.workspace.onDidOpenTextDocument   (document => validate(document)),
		vscode.workspace.onDidChangeTextDocument (event    => validate(event.document)),
		vscode.workspace.onDidChangeConfiguration(event    => { config.reload(); validateAllDocuments(); }),
		vscode.window.onDidChangeActiveTextEditor(editor   => { if(editor) { validate(editor.document); } }),
		vscode.workspace.onDidCloseTextDocument  (document => diagnosticCollection.delete(document.uri))
	);

	validateAllDocuments();
}

function validateAllDocuments() {
	for(const document of vscode.workspace.textDocuments) {
		validate(document);
	}
}

async function validate(document: vscode.TextDocument) {

	if(document.languageId !== 'glsl') return;

	const stage = path.extname(document.fileName).substring(1);
	const versionAtLaunch = document.version;
	const args = [ "--enhanced-msgs", "--error-column", "--stdin", "-S", stage === "injection" ? "vert" : stage ];

	if(stage !== "injection" && config.codeInjectionEnable) {
		let codeInjection = (await getCodeInjection(document.fileName) ?? config.codeInjectionText)
			.replaceAll('\n', '');
		args.push("--preamble-text", codeInjection, "-l");
	}
	
	try {
		const res = await runProcessWithTimeout(config.validatorPath, document.getText(), args, 2000);
		const diagnostics = messagesToDiagnostics(res.stdout, res.stderr);
		if(document.version === versionAtLaunch) {
			diagnosticCollection.set(document.uri, diagnostics);
		}
	} catch (error) {
		if(error instanceof Error) {
            Logger.log("Error: " + error.message);
        }
	}
}

export function deactivate() {}