# Voting registration site

This folder contains the files for a registration website for a demo election. For project wide installation instruction, see the main folder's README.

### Installation
To use this example, make sure you have an `irma server` running.
In this directory, run the command
```bash
npm install
```
This will add a `node_modules` folder that contains all necessary dependencies. Opening the `index.html` file (either locally or via Apache) should now give you a working website.

### Changing functionality
If you wish to change the behaviour of this example, feel free to change either the `register.js` or `retrieve.js` files in the `assets` folder. These control `index.html` and `views/retrieve.html` respectively.

To then recompile the JavaScript, run
```bash
npm run build
```
in this directory. This updates the `bundle_register.js` and `bundle_retrieve.js` files in the `assets` folder, giving you the updated functionality.

### Changing the look
The styling of everything but the interactive IRMA elements is controlled by the `assets/style.css` file.
If refreshing the page after changing the stylesheet doesn't change the interface, and the new rules aren't the problem, try a 'hard refresh' by hitting `Ctrl + F5` on Windows or Linux, or `Cmd + Shift + R` on macOS.
