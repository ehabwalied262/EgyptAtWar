@echo off
setlocal enabledelayedexpansion

:: Check if the directory exists
if not exist "src\content\library-topics" (
    echo Directory src\content\library-topics does not exist.
    pause
    exit /b
)

:: Loop through all .md files in src\content\library-topics and its subdirectories
for /r "src\content\library-topics" %%f in (*.md) do (
    echo Processing file: %%f
    :: Use powershell to replace any image path with image: "/egypt-map.png"
    powershell -Command "(Get-Content '%%f') -replace 'image: \".*\"', 'image: \"/egypt-map.png\"' | Set-Content '%%f'"
)

echo All image paths have been updated to "/egypt-map.png".
pause