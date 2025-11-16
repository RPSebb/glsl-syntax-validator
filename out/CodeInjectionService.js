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
exports.default = getCodeInjection;
const node_path_1 = __importDefault(require("node:path"));
const vscode = __importStar(require("vscode"));
async function getCodeInjection(filename) {
    const fileList = createFileList(filename);
    for (const file of fileList) {
        const content = await getContent(file);
        if (content) {
            return content;
        }
    }
    return null;
}
function createFileList(filename) {
    const fileList = [];
    const basename = node_path_1.default.basename(filename);
    const name = node_path_1.default.parse(filename).name;
    const ext = node_path_1.default.parse(filename).ext.substring(1);
    fileList.push(basename + '.injection');
    fileList.push(name + '.injection');
    fileList.push(ext + '.injection');
    fileList.push('global.injection');
    return fileList;
}
async function getContent(filename) {
    const uri = vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, '.vscode', filename);
    try {
        const content = await vscode.workspace.fs.readFile(uri);
        const text = Buffer.from(content).toString('utf8');
        return text;
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=codeInjectionService.js.map