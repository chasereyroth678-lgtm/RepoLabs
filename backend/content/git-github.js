export default {
  slug: 'git-github',
  title: 'Git & GitHub',
  tagline: 'Version control, set up once, used forever.',
  icon: '/images/github.png',
  estTime: '15–20 min',
  intro: `Git tracks changes to your code. GitHub hosts your Git repositories online so you can back them up, share them, and collaborate. Almost every dev job and every CS course at AUPP will expect you to know both. This guide gets you from "nothing installed" to "pushed my first commit."`,
  steps: [
    {
      id: 'install-git',
      title: 'Install Git',
      os: {
        windows: {
          instructions: `Download the Git installer and run it. The default options are fine for almost everyone — just keep clicking "Next" unless you know what you want to change.`,
          commands: [],
          link: { label: 'Download Git for Windows', url: 'https://git-scm.com/download/win' }
        },
        macos: {
          instructions: `The easiest way is via Homebrew. If you don't have Homebrew yet, install it first, then install Git.`,
          commands: [
            '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
            'brew install git'
          ]
        },
        linux: {
          instructions: `Use your distro's package manager.`,
          commands: [
            'sudo apt update && sudo apt install git -y',
            '# Fedora: sudo dnf install git',
            '# Arch: sudo pacman -S git'
          ]
        }
      },
      verify: { command: 'git --version', expect: 'Something like: git version 2.4x.x' }
    },
    {
      id: 'configure-git',
      title: 'Set your name and email',
      os: {
        windows: { instructions: `Open Git Bash (it was installed alongside Git) and run:`, commands: ['git config --global user.name "Your Name"', 'git config --global user.email "you@example.com"'] },
        macos: { instructions: `Open Terminal and run:`, commands: ['git config --global user.name "Your Name"', 'git config --global user.email "you@example.com"'] },
        linux: { instructions: `Open your terminal and run:`, commands: ['git config --global user.name "Your Name"', 'git config --global user.email "you@example.com"'] }
      },
      note: `Use the same email you'll use for your GitHub account — it's how GitHub matches commits to your profile.`,
      verify: { command: 'git config --list', expect: 'You should see user.name and user.email in the output' }
    },
    {
      id: 'create-github-account',
      title: 'Create a GitHub account',
      os: {
        windows: { instructions: `Go to github.com and sign up. Pick a username you won't be embarrassed about in a job interview — recruiters check.`, commands: [], link: { label: 'Sign up at GitHub', url: 'https://github.com/signup' } },
        macos: { instructions: `Same link, same advice — go to github.com and sign up.`, commands: [], link: { label: 'Sign up at GitHub', url: 'https://github.com/signup' } },
        linux: { instructions: `Same link, same advice — go to github.com and sign up.`, commands: [], link: { label: 'Sign up at GitHub', url: 'https://github.com/signup' } }
      }
    },
    {
      id: 'ssh-keys',
      title: 'Set up an SSH key',
      os: {
        windows: {
          instructions: `This is the step everyone gets stuck on. SSH keys let you push to GitHub without typing a password every time. In Git Bash:`,
          commands: [
            'ssh-keygen -t ed25519 -C "you@example.com"',
            '# press Enter to accept the default file location',
            '# optionally set a passphrase, or press Enter twice to skip',
            'cat ~/.ssh/id_ed25519.pub'
          ]
        },
        macos: {
          instructions: `In Terminal:`,
          commands: [
            'ssh-keygen -t ed25519 -C "you@example.com"',
            '# press Enter to accept the default file location',
            'cat ~/.ssh/id_ed25519.pub'
          ]
        },
        linux: {
          instructions: `In your terminal:`,
          commands: [
            'ssh-keygen -t ed25519 -C "you@example.com"',
            'cat ~/.ssh/id_ed25519.pub'
          ]
        }
      },
      note: `Copy the entire output of that last command (starts with "ssh-ed25519"). Go to GitHub → Settings → SSH and GPG keys → New SSH key, and paste it in.`,
      verify: { command: 'ssh -T git@github.com', expect: '"Hi <username>! You\'ve successfully authenticated..."' }
    },
    {
      id: 'first-repo',
      title: 'Clone your first repository',
      os: {
        windows: { instructions: `Create a repo on GitHub (the green "New" button), then clone it locally:`, commands: ['git clone git@github.com:your-username/your-repo.git', 'cd your-repo'] },
        macos: { instructions: `Create a repo on GitHub, then clone it:`, commands: ['git clone git@github.com:your-username/your-repo.git', 'cd your-repo'] },
        linux: { instructions: `Create a repo on GitHub, then clone it:`, commands: ['git clone git@github.com:your-username/your-repo.git', 'cd your-repo'] }
      }
    },
    {
      id: 'first-commit',
      title: 'Make and push your first commit',
      os: {
        windows: { instructions: ``, commands: ['echo "# My First Repo" > README.md', 'git add .', 'git commit -m "Initial commit"', 'git push'] },
        macos: { instructions: ``, commands: ['echo "# My First Repo" > README.md', 'git add .', 'git commit -m "Initial commit"', 'git push'] },
        linux: { instructions: ``, commands: ['echo "# My First Repo" > README.md', 'git add .', 'git commit -m "Initial commit"', 'git push'] }
      },
      verify: { command: '', expect: 'Refresh your repo page on GitHub — your README.md should be there.' }
    }
  ],
  troubleshooting: [
    { problem: `"git: command not found" after installing`, solution: `Restart your terminal completely (close and reopen). On Windows, make sure you're using Git Bash, not the old Command Prompt, if PATH wasn't updated.` },
    { problem: `Permission denied (publickey) when pushing`, solution: `Your SSH key isn't added to GitHub, or you cloned with HTTPS instead of SSH. Check the repo URL with "git remote -v" — it should start with git@github.com, not https://.` },
    { problem: `Git asks for username/password every push`, solution: `You're using HTTPS instead of SSH. Either switch the remote to SSH (git remote set-url origin git@github.com:user/repo.git) or set up a credential manager / personal access token.` }
  ]
};
