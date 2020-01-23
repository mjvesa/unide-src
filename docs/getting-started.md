# Getting started with Unide

If you are new to Unide, the first step is to try making some small designs
in the online version [here](https://mjvesa.github.io/unide). If that goes well,
you can set the target platform in the settings page, if the default Java
target is not what you want, and export your designs as a project for that platform.
The project is exported as a zip file.

## What to do with the exported project

It is possible to continue editing the design on the online version, but
a nicer experience can be had by installing Unide either into Visual Studio
Code as an extension, or as a standalone Electron version. The key feature
of both is the file `unide_model.json` which contains the designs in the native
format of Unide.

## Electron

To install the electron version you need npm. On the command line type
`npm install -g unide` to install it. To use it, go the root of the exported
project you have unzipped somewhere and invoke `unide`.

## Visual Studio Code

Install Unide trough the marketplace. Open the folder where the unzipped
project resides and enter then press `Ctrl-Shift-P` to bring up the
command palette. Search for `Unide`in there and run the command. Unide will
appear in a new tab with your designs.

## Local installation

It is possible install Unide on your own server. There are two ways:
either clone the repository and follow the instructions for building it. The files
in the `public` folder can be copied to any server and accessed there.

Alternatively you can clone the repository of the online version
[here](https://github.com/mjvesa/unide) and put that on a server like above.
