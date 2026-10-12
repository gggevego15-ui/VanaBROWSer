# VanaBROWSer

A Windows desktop browser built with Electron and Chromium.

## Features

- Chrome-inspired dark tab strip and toolbar
- Create, switch, and close tabs
- Search the web or open websites from the address bar
- Back, forward, reload, and home controls
- Bookmark the current URL with the star button or `Ctrl+D`
- Compact browser menu and profile placeholder
- Links that request a new window open in a new tab
- Quick links on the start screen

## Keyboard shortcuts

- `Ctrl+T` — new tab
- `Ctrl+W` — close active tab
- `Ctrl+L` — focus the address bar
- `Ctrl+R` — reload
- `Ctrl+D` — add or remove a bookmark

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

Electron Builder is configured to create a portable Windows x64 executable in the `dist` folder. The latest repository changes have not been run or tested on a Windows PC yet, so build and verify locally.

## Roadmap

- Show and manage saved bookmarks
- Browsing history
- Download manager
- Settings and privacy controls
- Mobile version after the desktop browser is mature
