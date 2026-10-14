@echo off
title SPECTRADE Desktop - PC3 Launcher
echo ========================================================
echo   Launching SPECTRADE Desktop on PC3 (Windows 11)
echo ========================================================
echo.

set APP_URL=%~dp0index.html

:: Check if Microsoft Edge exists (Default on Windows 11)
where msedge >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo Launching with Microsoft Edge App Mode...
    start msedge.exe --app="file:///%APP_URL:\=/%" --window-size=1440,920
    goto end
)

:: Check if Google Chrome exists
where chrome >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo Launching with Google Chrome App Mode...
    start chrome.exe --app="file:///%APP_URL:\=/%" --window-size=1440,920
    goto end
)

:: Fallback to default browser
echo Opening in default browser...
start "" "%APP_URL%"

:end
echo Application window opened. Press F5 inside the window to refresh your edits.
