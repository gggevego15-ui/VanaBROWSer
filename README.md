# VanaBROWSer

A Windows desktop browser built with Electron and Chromium.

## Features

- Custom dark/purple start screen
- Real browser tabs with independent page sessions
- Create, switch, and close tabs
- Open websites or search with Google
- Back, forward, reload, and home controls
- Open links that request a new window in a new browser tab
- Quick links to Google, YouTube, GitHub, and Wikipedia

## Keyboard shortcuts

- `Ctrl+T` — new tab
- `Ctrl+W` — close active tab
- `Ctrl+L` — focus the address bar

## Run on Windows

Install [Node.js LTS](https://nodejs.org/), download or clone this repository, then open a terminal in the project folder and run:

```bash
npm install
npm start
```

## Build a standalone Windows EXE

```bash
npm install
npm run dist
```

Electron Builder is configured to create a portable Windows x64 executable in the `dist` folder. The repository changes have not been run or tested on a Windows PC yet, so build and verify locally.

## Roadmap

- Browsing history and bookmarks
- Download manager
- Settings and privacy controls
- Mobile version after the desktop browser is mature
