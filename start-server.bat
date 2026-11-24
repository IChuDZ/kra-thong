@echo off
title Loy Krathong Co-op Server
echo Starting Loy Krathong Co-op local server...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-server.ps1"
pause
