@echo off
REM ^--- runs in Windows cmd shell

REM Remove old container if exists (force)  
docker rm -f layer-container 2>nul

REM Build the image  
docker build -t base-layer .

REM Run container to produce layer.zip  
docker run --name layer-container base-layer

REM Copy layer.zip from container to local directory  
docker cp layer-container:/opt/layer/layer.zip . 
if %ERRORLEVEL% EQU 0 (
    echo Created layer.zip with updated base layer.
) else (
    echo ERROR: Failed to copy layer.zip from container.
    exit /b 1
)

REM Optionally, remove the container to clean up  
docker rm layer-container >nul
