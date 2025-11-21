import path from "node:path";
import * as vscode from 'vscode';
import { Logger } from "./logger";

export default async function getCodeInjection(folder: string, filename: string) : Promise<string | null> {

    const fileList = createFileList(filename);

    for(const file of fileList) {
		const content = await getContent(folder, file);
		if(content) { return content; }
	}

    return null;
}

function createFileList(filename: string) {
    const fileList = [];
    const basename = path.basename(filename);
    const name     = path.parse(filename).name;
    const ext      = path.parse(filename).ext.substring(1);

    fileList.push(basename + '.injection');
    fileList.push(name + '.injection');
    fileList.push(ext + '.injection');
    fileList.push('global.injection');

    return fileList;
}

async function getContent(folder: string, filename: string) : Promise<string | null> {
    const uri = vscode.Uri.joinPath(
        vscode.workspace.workspaceFolders![0].uri,
        folder,
        filename
    );
    Logger.log(uri);
    try {
        const content = await vscode.workspace.fs.readFile(uri);
        const text = Buffer.from(content).toString('utf8');
        return text;
    } catch {
        return null;
    }
}