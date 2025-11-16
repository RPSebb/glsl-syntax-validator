"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const codeInjectionService_1 = __importDefault(require("./codeInjectionService"));
const process_1 = __importDefault(require("./process"));
const configService_1 = require("./configService");
const glslangValidatorParser_1 = __importDefault(require("./glslangValidatorParser"));
const logger_1 = require("./logger");
const NAME = 'glsl-syntax-validator';
const CHANNEL = "GLSL Syntax Validator";
const diagnosticCollection = vscode.languages.createDiagnosticCollection(NAME);
const config = new configService_1.ConfigService(NAME);
function activate(context) {
    logger_1.Logger.init(CHANNEL);
    context.subscriptions.push(logger_1.Logger, vscode.workspace.onDidSaveTextDocument(document => validate(document)), vscode.workspace.onDidOpenTextDocument(document => validate(document)), vscode.workspace.onDidChangeTextDocument(event => validate(event.document)), vscode.workspace.onDidChangeConfiguration(event => { config.reload(); validateAllDocuments(); }), vscode.window.onDidChangeActiveTextEditor(editor => { if (editor) {
        validate(editor.document);
    } }), vscode.workspace.onDidCloseTextDocument(document => diagnosticCollection.delete(document.uri)));
    validateAllDocuments();
}
function validateAllDocuments() {
    for (const document of vscode.workspace.textDocuments) {
        validate(document);
    }
}
async function validate(document) {
    if (document.languageId !== 'glsl')
        return;
    const stage = path.extname(document.fileName).substring(1);
    const versionAtLaunch = document.version;
    const args = ["--enhanced-msgs", "--error-column", "--stdin", "-S", stage === "injection" ? "vert" : stage];
    if (stage !== "injection" && config.codeInjectionEnable) {
        let codeInjection = (await (0, codeInjectionService_1.default)(document.fileName) ?? config.codeInjectionText)
            .replaceAll('\n', '');
        args.push("--preamble-text", codeInjection, "-l");
    }
    try {
        const res = await (0, process_1.default)(config.validatorPath, document.getText(), args, 2000);
        const diagnostics = (0, glslangValidatorParser_1.default)(res.stdout, res.stderr);
        if (document.version === versionAtLaunch) {
            diagnosticCollection.set(document.uri, diagnostics);
        }
    }
    catch (error) {
        if (error instanceof Error) {
            logger_1.Logger.log("Error: " + error.message);
        }
    }
}
function deactivate() { }
//# sourceMappingURL=extension.js.map