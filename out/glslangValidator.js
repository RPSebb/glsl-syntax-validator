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
exports.default = execSpawn;
exports.execSpawnAsync = execSpawnAsync;
const cp = __importStar(require("child_process"));
function execSpawn(validatorPath, source, args, callback) {
    const p = cp.spawn(validatorPath, args, { stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    p.stdout.on("data", d => { stdout += d.toString(); });
    p.stderr.on("data", d => { stderr += d.toString(); });
    p.on("error", err => {
        callback(err, stdout, stderr);
    });
    p.on("close", code => {
        if (code === 0) {
            callback(null, stdout, stderr);
        }
        else {
            const err = new Error(`Command failed: ${validatorPath} ${args.join(' ')}`);
            err.code = code ?? undefined;
            err.cmd = `${validatorPath} ${args.join(' ')}`;
            callback(err, stdout, stderr);
        }
    });
    p.stdin.write(source);
    p.stdin.end();
    return p;
}
async function execSpawnAsync(validatorPath, source, args, timeoutMs = 2000) {
    return new Promise((resolve, reject) => {
        const p = cp.spawn(validatorPath, args, { stdio: ["pipe", "pipe", "pipe"] });
        let stdout = "";
        let stderr = "";
        let isTimedOut = false;
        // Timeout
        const timer = setTimeout(() => {
            isTimedOut = true;
            p.kill('SIGTERM'); // Essaie d'abord SIGTERM
            // Si le processus ne se termine pas, force avec SIGKILL après 500ms
            setTimeout(() => {
                if (!p.killed) {
                    p.kill('SIGKILL');
                }
            }, 500);
            reject(new Error(`Command timed out after ${timeoutMs}ms: ${validatorPath} ${args.join(' ')}`));
        }, timeoutMs);
        p.stdout.on("data", d => { stdout += d.toString(); });
        p.stderr.on("data", d => { stderr += d.toString(); });
        p.on("error", err => {
            clearTimeout(timer);
            if (!isTimedOut) {
                reject(err);
            }
        });
        p.on("close", code => {
            clearTimeout(timer);
            if (!isTimedOut) {
                resolve({ stdout, stderr, code });
            }
        });
        p.stdin.write(source);
        p.stdin.end();
    });
}
//# sourceMappingURL=glslangValidator.js.map