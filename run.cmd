@echo off
title Start My Node.js Server with Nodemon

REM Change to your project directory
cd /d %~dp0

REM Start the server with nodemon
nodemon app.js
