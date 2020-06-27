# Unide release process

Master branch is always a working version of Unide that can be placed to
the webpage and installed in Electron.

VSCode (and IntelliJ?) installs might come in the future, but will probably
be infrequent for now.

Work will happen in branches, and every time a branch is merged a new version
is released. That means doing a production build with `npm run build, increasing
the version numbers and tagging the new release once merged.

That's it. That's the process.
