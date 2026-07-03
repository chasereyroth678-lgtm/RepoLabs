export default {
  slug: 'nodejs',
  title: 'Node.js & npm',
  tagline: 'JavaScript outside the browser, plus the package manager that comes with it.',
  icon: '/images/nodejs.png',
  estTime: '10–15 min',
  intro: `Node.js lets you run JavaScript outside a browser — for backend servers, build tools, and scripts. npm (Node Package Manager) ships with it and installs packages from a registry of millions of open-source libraries. The trick most guides skip: use a version manager instead of installing Node directly, so you're never stuck on the wrong version for a project.`,
  steps: [
    {
      id: 'install-nvm',
      title: 'Install a Node version manager',
      os: {
        windows: {
          instructions: `Windows doesn't support nvm (the Unix one) directly. Use nvm-windows instead — download the installer from its GitHub releases page.`,
          commands: [],
          link: { label: 'nvm-windows releases', url: 'https://github.com/coreybutler/nvm-windows/releases' }
        },
        macos: {
          instructions: `Install nvm via the official install script:`,
          commands: [
            'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash',
            '# then restart your terminal, or run:',
            'source ~/.bashrc   # or ~/.zshrc if you use zsh'
          ]
        },
        linux: {
          instructions: `Install nvm the same way:`,
          commands: [
            'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash',
            'source ~/.bashrc'
          ]
        }
      },
      note: `Why bother with a version manager instead of just installing Node directly? Different projects need different Node versions. nvm lets you switch instantly instead of reinstalling.`,
      verify: { command: 'nvm --version', expect: 'A version number prints, e.g. 0.40.1' }
    },
    {
      id: 'install-node',
      title: 'Install Node.js (LTS)',
      os: {
        windows: { instructions: `Open a new terminal and run:`, commands: ['nvm install lts', 'nvm use lts'] },
        macos: { instructions: `Install the current LTS (Long Term Support) version:`, commands: ['nvm install --lts', 'nvm use --lts'] },
        linux: { instructions: `Install the current LTS version:`, commands: ['nvm install --lts', 'nvm use --lts'] }
      },
      note: `LTS = stable and recommended for most projects, as opposed to "Current" which has the newest features but less stability.`,
      verify: { command: 'node --version && npm --version', expect: 'Both print version numbers, no errors' }
    },
    {
      id: 'first-project',
      title: 'Initialize your first project',
      os: {
        windows: { instructions: ``, commands: ['mkdir my-project', 'cd my-project', 'npm init -y'] },
        macos: { instructions: ``, commands: ['mkdir my-project', 'cd my-project', 'npm init -y'] },
        linux: { instructions: ``, commands: ['mkdir my-project', 'cd my-project', 'npm init -y'] }
      },
      note: `This creates package.json — the file that tracks your project's name, dependencies, and scripts. The -y flag skips the interactive Q&A and fills in defaults.`
    },
    {
      id: 'install-deps',
      title: 'Install a package',
      os: {
        windows: { instructions: ``, commands: ['npm install express'] },
        macos: { instructions: ``, commands: ['npm install express'] },
        linux: { instructions: ``, commands: ['npm install express'] }
      },
      note: `This creates a node_modules folder (the actual package code) and a package-lock.json (exact installed versions). Add node_modules to a .gitignore file — never commit it, it can be thousands of files.`
    },
    {
      id: 'gitignore',
      title: 'Add a .gitignore',
      os: {
        windows: { instructions: `Create a file named exactly ".gitignore" with this content:`, commands: ['node_modules/', '.env', '*.log'] },
        macos: { instructions: `Create a file named exactly ".gitignore" with this content:`, commands: ['node_modules/', '.env', '*.log'] },
        linux: { instructions: `Create a file named exactly ".gitignore" with this content:`, commands: ['node_modules/', '.env', '*.log'] }
      }
    }
  ],
  troubleshooting: [
    { problem: `"nvm: command not found" after install`, solution: `You need to restart your terminal, or manually source your shell config file (~/.bashrc, ~/.zshrc, or ~/.profile) after installing nvm.` },
    { problem: `Permission errors when running npm install -g`, solution: `Don't use sudo with npm — it causes more problems than it fixes. This is exactly why nvm exists: it installs Node into your home directory, so you never need elevated permissions.` },
    { problem: `"node_modules" got committed to Git by accident`, solution: `Add node_modules/ to .gitignore, then run "git rm -r --cached node_modules" to untrack it without deleting the actual files on disk.` }
  ]
};
