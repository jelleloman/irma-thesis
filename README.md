# Small-scale digital elections with IRMA
This repository contains the code for my Master's thesis project: a prototype of how to use the [IRMA framework](https://irma.app/docs/what-is-irma/) for small-scale digital elections.

It consists of three 'websites' run locally with Apache.
This environment was built on a MacBook, therefore only macOS specific instructions are listed here.

## Installation and configuration

### Apache
Apache, PHP, and MySQL were installed and configured according to [this tutorial](https://jasonmccreary.me/articles/install-apache-php-mysql-mac-os-x-catalina/) (with the 'Additional Configuration' steps), and the VirtualHosts according to [this one](https://jasonmccreary.me/articles/configure-apache-virtualhost-mac-os-x/).
All virtual host configuration files can be found in the ```vhosts``` folder.

Once the VirtualHosts were running--i.e. all three websites could be accessed locally via their URL ```election-<type>.local```--they were troubled by a noticeably slow loading time.
To fix this, I edited the system-wide ```/etc/hosts``` file to include the following (after finding [this tip](https://stackoverflow.com/a/17982964)):
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
