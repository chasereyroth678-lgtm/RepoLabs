import gitGithub from './git-github.js';
import python from './python.js';
import vscode from './vscode.js';
import nodejs from './nodejs.js';

export const guides = [gitGithub, python, vscode, nodejs];

export function getGuideBySlug(slug) {
  return guides.find(g => g.slug === slug);
}
