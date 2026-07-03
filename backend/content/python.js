export default {
  slug: 'python',
  title: 'Python',
  tagline: 'The interpreter, pip, and a virtual environment that actually works.',
  icon: '/images/python.png',
  estTime: '10–15 min',
  intro: `Python itself installs in two minutes. The part that trips people up is virtual environments — isolated spaces so each project's packages don't fight with each other. This guide covers both, properly, the first time.`,
  steps: [
    {
      id: 'install-python',
      title: 'Install Python',
      os: {
        windows: {
          instructions: `Download the installer from python.org. On the first screen of the installer, check the box that says "Add python.exe to PATH" before clicking Install — this is the single most common mistake.`,
          commands: [],
          link: { label: 'Download Python', url: 'https://www.python.org/downloads/' }
        },
        macos: {
          instructions: `macOS ships an old system Python you should not touch. Install a fresh one via Homebrew:`,
          commands: ['brew install python3']
        },
        linux: {
          instructions: `Most distros have Python 3 pre-installed. Check first, then install if missing:`,
          commands: ['python3 --version', 'sudo apt update && sudo apt install python3 python3-pip python3-venv -y']
        }
      },
      verify: { command: 'python --version  (or python3 --version)', expect: 'Python 3.1x.x' }
    },
    {
      id: 'check-pip',
      title: 'Confirm pip is working',
      os: {
        windows: { instructions: `pip (Python's package installer) ships with Python automatically. Check it:`, commands: ['pip --version'] },
        macos: { instructions: `Check pip is present:`, commands: ['pip3 --version'] },
        linux: { instructions: `Check pip is present:`, commands: ['pip3 --version'] }
      },
      note: `If "pip" isn't found but "pip3" is, your system just prefers explicit versioning — use pip3 / python3 everywhere going forward, or set up an alias.`
    },
    {
      id: 'venv',
      title: 'Create your first virtual environment',
      os: {
        windows: {
          instructions: `Inside your project folder, create and activate a virtual environment:`,
          commands: ['python -m venv venv', 'venv\\Scripts\\activate']
        },
        macos: {
          instructions: `Inside your project folder:`,
          commands: ['python3 -m venv venv', 'source venv/bin/activate']
        },
        linux: {
          instructions: `Inside your project folder:`,
          commands: ['python3 -m venv venv', 'source venv/bin/activate']
        }
      },
      note: `You'll know it worked because your terminal prompt will show "(venv)" at the start of the line. Every project should get its own venv — don't install packages globally.`,
      verify: { command: 'which python  (macOS/Linux) or where python (Windows)', expect: 'Path should point inside your project\'s venv folder' }
    },
    {
      id: 'install-package',
      title: 'Install a package and freeze requirements',
      os: {
        windows: { instructions: `With your venv active:`, commands: ['pip install requests', 'pip freeze > requirements.txt'] },
        macos: { instructions: `With your venv active:`, commands: ['pip install requests', 'pip freeze > requirements.txt'] },
        linux: { instructions: `With your venv active:`, commands: ['pip install requests', 'pip freeze > requirements.txt'] }
      },
      note: `requirements.txt lists every package your project needs. Commit this file to Git so classmates (or future-you) can recreate the exact same environment with "pip install -r requirements.txt".`
    },
    {
      id: 'deactivate',
      title: 'Deactivate when you\'re done',
      os: {
        windows: { instructions: `Just run:`, commands: ['deactivate'] },
        macos: { instructions: `Just run:`, commands: ['deactivate'] },
        linux: { instructions: `Just run:`, commands: ['deactivate'] }
      }
    }
  ],
  troubleshooting: [
    { problem: `"python is not recognized" on Windows`, solution: `You didn't check "Add to PATH" during install. Reinstall and check the box, or manually add Python's install folder to your system PATH environment variable.` },
    { problem: `"externally-managed-environment" error on pip install (Linux/macOS)`, solution: `Recent Python versions block global pip installs to protect your system Python. This is exactly why you use a venv — activate one first and the error disappears.` },
    { problem: `python vs python3 confusion`, solution: `On Windows, "python" usually works. On macOS/Linux, "python" may not exist or may point to an old Python 2 — use "python3" and "pip3" explicitly to be safe.` }
  ]
};
