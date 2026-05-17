@echo off
REM ===== TMFashion SMPL Service Startup =====
echo ===== SMPL Service =====

cd /d "%~dp0"

REM Check if .venv exists at project root
if exist "..\..\..\.venv\Scripts\activate.bat" (
    echo Using project .venv...
    call "..\..\..\.venv\Scripts\activate.bat"
) else if exist "venv\Scripts\activate.bat" (
    echo Using local venv...
    call venv\Scripts\activate.bat
) else (
    echo No venv found, using system Python...
)

echo Installing dependencies...
pip install -r requirements.txt -q 2>nul

echo Starting SMPL FastAPI service on port 8001...
python -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload
