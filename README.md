# GLSL Syntax Validator

## Fonctionnalités
- Coloration syntaxique pour les shaders GLSL
- Validation de syntaxe en temps réel via glslangValidator
- Diagnostics intégrés avec repérage des erreurs
- Système d'injection de code flexible

## Prérequis

- glslangValidator doit être installé sur votre système
  - Assurez-vous qu'il est accessible dans votre PATH
  - ou mettre sa location dans settings
- Travailler dans un workspace.

## Paramètres

- `glsl-syntax-validator.glslangValidator`  
  Nom de la variable globale du validator ou path vers celle-ci.

- `glsl-syntax-validator.enableCodeInjection`  
  Permet d'activer l'injection de code.

- `glsl-syntax-validator.codeInjectionFolder`  
  Dossier conteant les source .injection à injecter.  
  La valeur par défaut est .vscode.

- `glsl-syntax-validator.codeInjection`  
  Code injecter si aucun fichier d'injection n'est trouvé.

## Code Injection

Les fichiers `.injection` seront recherché dans le dossier définit par <a href="vscode://settings/[GLSL Syntax Validator]">codeInjectionFolder</a>.

Priorité d'injection (du plus spécifique au plus général):
- `[target_shader_name].[target_shader_extension].injection`
- `[target_shader_name].injection`
- `[target_shader_extension].injection`
- `global.injection`

### Exemple

Pour un shader `pbr.vert`, l’extension applique la logique suivante :

```
          ┌ ┌───────────────────────────────┐
          │ │       pbr.vert.injection      │ / S'applique au fichier pbr.vert
          │ └───────────────────────────────┘
          │                 ↓
          │ ┌───────────────────────────────┐
          │ │         pbr.injection         │ / S'applique à tous les shaders prb n'ayant pas d'injection [shader_name][shader.ext].injection
          │ └───────────────────────────────┘
WORKSPACE │                 ↓
          │ ┌───────────────────────────────┐
          │ │         vert.injection        │ / S'applique à tous les vertex shader n'ayant pas d'injection [shader_name].injection
          │ └───────────────────────────────┘
          │                 ↓
          │ ┌───────────────────────────────┐
          │ │       global.injection        │ / S'applique à tous les shaders
          └ └───────────────────────────────┘
                            ↓
          ┌ ┌───────────────────────────────┐
GLOBAL    │ │    settings.json (VS Code)    │ / S'applique à tous les shaders
          └ └───────────────────────────────┘
```
