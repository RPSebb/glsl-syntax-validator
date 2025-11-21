import * as vscode from 'vscode';

export class ConfigService {
    private config: vscode.WorkspaceConfiguration;
    private name: string;

    constructor(name: string) {
        this.name = name;
        this.config = vscode.workspace.getConfiguration(name);
    }

    get validatorPath(): string {
        return this.config.get<string>('validatorPath', 'glslangValidator');
    }

    get codeInjectionEnable(): boolean {
        return this.config.get<boolean>('enableCodeInjection', false);
    }

    get codeInjectionText(): string {
        return this.config.get<string>('codeInjection', '');
    }

    get codeInjectionFolder(): string {
        return this.config.get<string>('codeInjectionFolder', '.vscode');
    }

    reload() {
        this.config = vscode.workspace.getConfiguration(this.name);
    }
}
