@echo off
setlocal

REM Set the path where the ZIP file is located and where it will be extracted
set "zipFile=Mini Control.zip"
set "extractPath=Mini Control"

REM Check if the ZIP file exists
if not exist "%zipFile%" (
    echo Error: ZIP file not found.
    echo Make sure "%zipFile%" is in the same directory as this script.
    pause
    exit /b 1
)

REM Create the extraction directory if it does not exist
if not exist "%extractPath%" mkdir "%extractPath%"

REM Extract the ZIP file
echo Extracting "%zipFile%" to "%extractPath%"...
powershell -command "Expand-Archive -Path '%zipFile%' -DestinationPath '%extractPath%' -Force"

REM Check if extraction was successful
if %errorlevel% neq 0 (
    echo Error: Failed to extract the ZIP file.
    pause
    exit /b 1
)

REM Open the HTML file with installation instructions
start "" "%cd%\Mini Control\instructions.html"

REM Notify the user
echo The ZIP file has been extracted. Please follow the instructions in the opened HTML file to install the Mini Control.

REM Pause to allow user to see the instructions
echo Press any key to close this window.
pause
