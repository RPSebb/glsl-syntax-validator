import * as vscode from 'vscode';

export class Logger {
    private static output: vscode.OutputChannel | null = null;
    private static DEBUG = process.env._DEBUG === "1";

    static init(name: string) {
        if(this.output) { return; }
        this.output = vscode.window.createOutputChannel(name);
    }

    static log(text: any) {
        if(!this.DEBUG) { return; }
        this.output?.appendLine(text as string);
    }

    static dispose() {
        this.output?.dispose();
    }

}
