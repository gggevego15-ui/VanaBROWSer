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

## Build the EXE with GitHub Actions

The repository includes a workflow at [Build Windows EXE](.github/workflows/build-windows.yml). It runs automatically when code is pushed to `main`, when a `v*` tag is pushed, or when started manually.

To build and download the Windows executable:

1. Open the repository's **Actions** tab.
2. Select **Build Windows EXE**.
3. Click **Run workflow** and confirm **Run workflow** (or open the run started by a push).
4. Wait until the workflow finishes successfully.
5. Open that run and download the **VanaBROWSer-Windows-x64** artifact.
6. Extract the downloaded ZIP; the portable `.exe` is inside.

Artifacts are kept for 14 days. This workflow builds the Windows x64 portable executable; it does not yet publish a permanent GitHub Release.

## Roadmap

- Show and manage saved bookmarks
- Browsing history
- Download manager
- Settings and privacy controls
- Mobile version after the desktop browser is mature
