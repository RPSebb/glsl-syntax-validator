import * as vscode from 'vscode';

const vec3Regex = /vec3\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/g;
const vec3SingleRegex = /vec3\s*\(\s*([\d.]+)\s*\)/g;

const vec4Regex = /vec4\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/g;
const vec4SingleRegex = /vec4\s*\(\s*([\d.]+)\s*\)/g;

export default function colorProvider() {
    return vscode.languages.registerColorProvider(
        ['glsl', 'hlsl'],
        { provideDocumentColors, provideColorPresentations });
}

function provideDocumentColors(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
): vscode.ColorInformation[] {
    const colors: vscode.ColorInformation[] = [];
    const text = document.getText();
    
    let match;
    while((match = vec3Regex.exec(text)) !== null) {

        const r = parseFloat(match[1]);
        const g = parseFloat(match[2]);
        const b = parseFloat(match[3]);
        
        // Vérifier que les valeurs sont dans la plage [0, 1]
        if(r >= 0 && r <= 1 && g >= 0 && g <= 1 && b >= 0 && b <= 1) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);
            const range = new vscode.Range(startPos, endPos);
            
            // Créer l'objet Color (VS Code utilise des valeurs 0-1)
            const color = new vscode.Color(r, g, b, 1);
            
            colors.push(new vscode.ColorInformation(range, color));
        }
    }
    
    return colors;
}

function provideColorPresentations(
    color: vscode.Color,
    context: { document: vscode.TextDocument; range: vscode.Range },
    token: vscode.CancellationToken
): vscode.ColorPresentation[] {
    const r = color.red.toFixed(3);
    const g = color.green.toFixed(3);
    const b = color.blue.toFixed(3);
    
    // Format vec3
    const vec3Format = new vscode.ColorPresentation(`vec3(${r}, ${g}, ${b})`);
    
    // Format vec3 sans espaces (optionnel)
    const vec3Compact = new vscode.ColorPresentation(`vec3(${r},${g},${b})`);
    
    // Format avec couleur normalisée (optionnel)
    const rNorm = Math.round(color.red * 255);
    const gNorm = Math.round(color.green * 255);
    const bNorm = Math.round(color.blue * 255);
    const vec3Comment = new vscode.ColorPresentation(
        `vec3(${r}, ${g}, ${b}) // RGB(${rNorm}, ${gNorm}, ${bNorm})`
    );
    
    return [vec3Format, vec3Compact, vec3Comment];
}