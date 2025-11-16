import * as cp from 'child_process';

interface ExecResult {
    stdout: string;
    stderr: string;
    code: number | null;
}

function execProcess(validatorPath: string, source: string, args: readonly string[]) {
    const controller = new AbortController();
    const { signal } = controller;

    const p = cp.spawn(validatorPath, args, { stdio: ['pipe', 'pipe', 'pipe'], signal });

    let stdout = '';
    let stderr = '';

    const promise = new Promise<ExecResult>((resolve, reject) => {
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
export default async function runProcessWithTimeout(validatorPath: string, source: string, args: readonly string[], timeoutMs: number) {
    const { promise, controller } = execProcess(validatorPath, source, args);

    const timeout = new Promise<ExecResult>((_, reject) =>
        setTimeout(() => {
            controller.abort(); // kill le process
            reject(new Error(`Command timed out after ${timeoutMs}ms`));
        }, timeoutMs)
    );

    const result = await Promise.race([promise, timeout]);
    return result;
}