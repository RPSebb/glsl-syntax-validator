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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = messagesToDiagnostics;
const vscode = __importStar(require("vscode"));
function getSeverity(value) {
    switch (value) {
        case ("ERROR"): return vscode.DiagnosticSeverity.Error;
        case ("WARNING"): return vscode.DiagnosticSeverity.Warning;
        case ("INFO"): return vscode.DiagnosticSeverity.Information;
        case ("DEBUG"): return vscode.DiagnosticSeverity.Hint;
        default: return vscode.DiagnosticSeverity.Information;
    }
}
function messagesToDiagnostics(stdout, stderr) {
    const diagnostics = [];
    // injection/ ERROR: 0:7:5: '' :  syntax error, unexpected IDENTIFIER
    // shader/    ERROR: stdin:1:5: '' :  syntax error, unexpected IDENTIFIER
    const r = /^(ERROR|WARNING):\s+(stdin|\d+):(\d+):(\d+):\s+(.*)$/gm;
    const matches = [...stdout.matchAll(r)];
    for (const match of matches) {
        const msg = match[5];
        const severity = getSeverity(match[1]);
        const col = Number(match[4]);
        const line = Number(match[3]) - 1;
        const range = new vscode.Range(line, 0, line, col);
        const diagnostic = new vscode.Diagnostic(range, msg, severity);
        diagnostics.push(diagnostic);
    }
    return diagnostics;
}
//# sourceMappingURL=glslangValidatorParser.js.map