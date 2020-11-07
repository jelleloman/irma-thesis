# Small-scale digital elections with IRMA
This repository contains the code for my Master's thesis project: a prototype of how to use the [IRMA framework](https://irma.app/docs/what-is-irma/) for small-scale digital elections.

It consists of three websites that can be run locally with Apache.
If you don't wish to download and/or configure Apache, simply download or clone this repository, and open the `index.html` file of the website folder you wish to use. You can skip the Apache configuration in this case.

## Installation and configuration
This project was created and built on a MacBook, therefore only macOS specific instructions are listed here. Instructions for Linux will likely be very similar.

### Apache
Apache, PHP, and MySQL were installed and configured according to [this tutorial](https://jasonmccreary.me/articles/install-apache-php-mysql-mac-os-x-catalina/) (with the 'Additional Configuration' steps), and the VirtualHosts according to [this one](https://jasonmccreary.me/articles/configure-apache-virtualhost-mac-os-x/).
All virtual host configuration files can be found in the `vhosts` folder.

Once the VirtualHosts were running—i.e. all three websites could be accessed locally via their URL `election-<type>.local`—they were troubled by a noticeably slow loading time. To fix this, I edited the system-wide `/etc/hosts` file to include the following (after finding [this tip](https://stackoverflow.com/a/17982964)):
```
# Apache Virtual Hosts
::1             election-admin.local
fe80::1%lo0     election-admin.local
127.0.0.1       election-admin.local
::1             election-register.local
fe80::1%lo0     election-register.local
127.0.0.1       election-register.local
::1             election-vote.local
fe80::1%lo0     election-vote.local
127.0.0.1       election-vote.local
# End of Apache Virtual Hosts
```

### IRMA
To get IRMA working locally, first [install it](https://irma.app/docs/getting-started/).
Once `irma` commands are working locally, you'll need an `irma server` running for the webpages to connect to.
Run the command
```bash
$ irma server --url http://localhost:8088 --sse
```
This starts a server at the specified URL, with server sent events enabled, an experimental feature that allows for local testing.
**You should only use this configuration for local testing, never for production!**

### Android
To use this demo, you'll need an Android phone with the [IRMA app](https://play.google.com/store/apps/details?id=org.irmacard.cardemu) installed.
Connect your phone to your computer via USB, and [enable USB debugging](https://developer.android.com/studio/debug/dev-options) if you haven't already. Also install the [Android Debug Bridge](https://developer.android.com/studio/command-line/adb), or `adb` for short.

Enable developer mode on the IRMA app by navigating to 'About IRMA' from the hamburger menu, and tapping the version number until 'Developer mode enabled' appears at the bottom of the screen. This is necessary to allow unsecured connections to an IRMA server. **Again, only do this for local testing and demonstration purposes.**

Finally, to allow the IRMA app to find the server running on `localhost`, make sure it's connected via USB, and test the presence of your device by running
```bash
$ adb devices
```
This should show your device as attached. If not, make sure USB debugging is enabled, and try unplugging and plugging it back in.
To forward `localhost` network traffic, run the command
```bash
$ adb reverse tcp:8088 tcp:8088
```
This should simply output `8088` to indicate success.
If your IRMA app is giving error messages that say you need an internet connection, run this command again.
It can be a bit unpredictable, so don't be surprised if you need to run it quite often.

## Using the examples
(Unfinished!) Flow description.

These demos use the `pbdf.pbdf.email.email` attribute to determine election participation.
If you don't have this attribute yet, you can load it into the IRMA app by tapping the hamburger menu, then on 'Adding cards' and 'Email address', and following the instructions.

### election-admin.local
(Not yet implemented)

### election-register.local
See the folder's [README](election-register.local/README.md) for further instructions.

### election-vote.local
Select an option from the list, and click the 'Vote' button. Scan the QR code with the IRMA app to sign your vote with the voting token retrieved during registration. The app should indicate your choice in natural language.
