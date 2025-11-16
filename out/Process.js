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
exports.default = runProcessWithTimeout;
const cp = __importStar(require("child_process"));
function execProcess(validatorPath, source, args) {
    const controller = new AbortController();
    const { signal } = controller;
    const p = cp.spawn(validatorPath, args, { stdio: ['pipe', 'pipe', 'pipe'], signal });
    let stdout = '';
    let stderr = '';
    const promise = new Promise((resolve, reject) => {
        p.stdout.on('data', d => { stdout += d.toString(); });
        p.stderr.on('data', d => { stderr += d.toString(); });
        p.on('error', reject);
        p.on('close', code => resolve({ stdout, stderr, code }));
        p.stdin.write(source);
        p.stdin.end();
    });
    return { promise, controller };
}
// Exemple d'utilisation avec timeout
async function runProcessWithTimeout(validatorPath, source, args, timeoutMs) {
    const { promise, controller } = execProcess(validatorPath, source, args);
    const timeout = new Promise((_, reject) => setTimeout(() => {
        controller.abort(); // kill le process
        reject(new Error(`Command timed out after ${timeoutMs}ms`));
    }, timeoutMs));
    const result = await Promise.race([promise, timeout]);
    return result;
}
//# sourceMappingURL=process.js.map