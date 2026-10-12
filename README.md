# VanaBROWSer

A Windows desktop browser prototype built with Electron and Chromium.

## Features

- Native desktop application window (not a website)
- Custom dark/purple start screen
- Search the web with Google using any text
- Open websites inside the app using Chromium
- Back, forward, reload, and home controls
- Quick links to Google, YouTube, GitHub, and Wikipedia

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

Electron Builder will create a portable Windows x64 executable in the `dist` folder. The EXE has not been built or tested by the repository update itself; run the commands on a Windows PC to produce it.

## Roadmap

- Tabs and tab management
- Browsing history and bookmarks
- Download manager
- Settings and privacy controls
- Mobile version after the desktop browser is mature
