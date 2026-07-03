export default {
  slug: 'vscode',
  title: 'VS Code',
  tagline: 'Set up an editor that won\'t fight you.',
  icon: '/images/vscode.png',
  estTime: '10 min',
  intro: `Visual Studio Code is the most widely used code editor for a reason — it's free, fast, and has an extension for almost anything. This guide installs it and gets the handful of extensions and settings that make the first week of coding less painful.`,
  steps: [
    {
      id: 'install-vscode',
      title: 'Download and install VS Code',
      os: {
        windows: { instructions: `Download the installer and run it. During setup, check "Add to PATH" if offered — it lets you type "code ." in any folder to open it in VS Code.`, commands: [], link: { label: 'Download VS Code', url: 'https://code.visualstudio.com/download' } },
        macos: { instructions: `Install via Homebrew, or download the .zip from the site and drag it to Applications.`, commands: ['brew install --cask visual-studio-code'] },
        linux: { instructions: `Download the .deb (Debian/Ubuntu) or use the snap:`, commands: ['sudo snap install code --classic', '# or download the .deb from the VS Code site and: sudo dpkg -i code_*.deb'] }
      },
      verify: { command: 'code --version', expect: 'A version number prints' }
    },
    {
      id: 'enable-code-command',
      title: 'Enable the "code" command (if it didn\'t work above)',
      os: {
        windows: { instructions: `Reinstall and make sure "Add to PATH" is checked, or add the VS Code bin folder to your PATH manually.`, commands: [] },
        macos: { instructions: `Open VS Code, press Cmd+Shift+P, type "Shell Command", and select "Install 'code' command in PATH".`, commands: [] },
        linux: { instructions: `If you installed via snap or apt, this should already work. If not, check that /usr/bin or /snap/bin is in your PATH.`, commands: ['echo $PATH'] }
      },
      verify: { command: 'cd ~/Desktop && code .', expect: 'VS Code opens with that folder loaded' }
    },
    {
      id: 'extensions',
      title: 'Install essential extensions',
      os: {
        windows: { instructions: `Open the Extensions panel (Ctrl+Shift+X) and install these to start:`, commands: [] },
        macos: { instructions: `Open the Extensions panel (Cmd+Shift+X) and install these to start:`, commands: [] },
        linux: { instructions: `Open the Extensions panel (Ctrl+Shift+X) and install these to start:`, commands: [] }
      },
      list: [
        { name: 'Python', why: 'IntelliSense, linting, and debugging for .py files (skip if you don\'t code in Python)' },
        { name: 'ESLint', why: 'Catches JavaScript bugs and style issues as you type' },
        { name: 'Prettier', why: 'Auto-formats your code so you never argue about spacing/semicolons again' },
        { name: 'GitLens', why: 'Shows who changed each line and when, right inside the editor' },
        { name: 'Live Server', why: 'Auto-refreshing local server for HTML/CSS/JS projects' }
      ]
    },
    {
      id: 'format-on-save',
      title: 'Turn on format-on-save',
      os: {
        windows: { instructions: `Press Ctrl+, to open Settings, search "format on save", and check the box. Your code will auto-format every time you save.`, commands: [] },
        macos: { instructions: `Press Cmd+, to open Settings, search "format on save", and check the box.`, commands: [] },
        linux: { instructions: `Press Ctrl+, to open Settings, search "format on save", and check the box.`, commands: [] }
      }
    },
    {
      id: 'integrated-terminal',
      title: 'Get comfortable with the integrated terminal',
      os: {
        windows: { instructions: `Toggle it with Ctrl+\` (backtick). This is a real terminal inside the editor — use it instead of switching windows constantly.`, commands: [] },
        macos: { instructions: `Toggle it with Cmd+\` (backtick).`, commands: [] },
        linux: { instructions: `Toggle it with Ctrl+\` (backtick).`, commands: [] }
      }
    }
  ],
  troubleshooting: [
    { problem: `"code" command not found in terminal`, solution: `See the "Enable the code command" step above — this is an explicit setup step, not automatic on every OS.` },
    { problem: `Extensions installed but not working`, solution: `Reload the window: Ctrl/Cmd+Shift+P → "Developer: Reload Window". Some extensions need a restart to activate.` },
    { problem: `Format-on-save isn't using Prettier`, solution: `Open Settings, search "default formatter", and explicitly set it to "Prettier - Code formatter" — VS Code sometimes defaults to its built-in formatter instead.` }
  ]
};
