@echo off
setlocal enabledelayedexpansion

:: Set the directory to the articles folder (adjust the path as needed)
set "directory=%~dp0src\content\articles"

:: Loop through all .md files in the directory and subdirectories
for /r "%directory%" %%F in (*.md) do (
    set "filename=%%~nxF"
    set "newname=!filename:'=!"
    set "newname=!newname:’=!"
    if not "!newname!"=="!filename!" (
        echo Renaming "%%F" to "!newname!"
        ren "%%F" "!newname!"
    )
)

echo Done!
pause