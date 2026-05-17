@echo off
echo [SMPL] Starting FastAPI backend...
call .\venv\Scripts\activate.bat
uvicorn main:app --reload --port 8001
pause
