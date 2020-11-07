# Vote casting site
This folder contains the files for a voting website for a demo election. For project wide installation instruction, see the main folder's [README](../README.md).

## Running the flow
This website can be opened locally without installing or compiling anything. Make sure you have an `irma server` running to connect with. To do this, simply run:
```bash
irma server --url http://localhost:8088 --sse
```

## Changing functionality
If you wish to change the behaviour of this example, feel free to change the `vote.js` file in the `assets` folder. This file controls `index.html` after it has been compiled.
First, run the command
```bash
npm install
```
This will add a `node_modules` folder that contains all the necessary dependencies.

To then recompile the changed JavaScript, run
```bash
npm run build
```
in this directory. This updates the `bundle_vote.js` file in the `assets` folder, giving you the updated functionality.

## Changing the look
The styling of everything but the interactive IRMA elements is controlled by the `assets/style.css` file.
If refreshing the page after changing the stylesheet doesn't change the interface, and the new rules aren't the problem, try a 'hard refresh' by hitting `Ctrl + F5` on Windows or Linux, or `Cmd + Shift + R` on macOS.
