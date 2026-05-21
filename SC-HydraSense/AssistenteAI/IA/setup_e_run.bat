@echo off
chcp 65001 >nul
title HydraSense AI - Setup e Execucao
echo ============================================
echo   HydraSense AI - Setup Automatico
echo ============================================
echo.

REM 1. Cria .env se nao existir
if not exist ".env" (
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo [OK] .env criado a partir do .env.example
        echo [!!] ATENCAO: Preencha as chaves de API no arquivo .env antes de usar!
    ) else (
        echo [ERRO] .env.example nao encontrado. Crie o .env manualmente.
        pause
        exit /b 1
    )
) else (
    echo [OK] .env ja existe, pulando copia.
)
echo.

REM 2. Cria venv se nao existir
if not exist "venv\Scripts\python.exe" (
    echo [..] Criando ambiente virtual...
    python -m venv venv
    if errorlevel 1 (
        echo [ERRO] Falha ao criar venv. Verifique se o Python 3.11+ esta instalado.
        pause
        exit /b 1
    )
    echo [OK] venv criado com sucesso.
) else (
    echo [OK] venv ja existe.
)
echo.

REM 3. Ativa venv
echo [..] Ativando ambiente virtual...
call venv\Scripts\activate.bat
echo [OK] Ambiente virtual ativado.
echo.

REM 4. Atualiza pip e instala dependencias
echo [..] Instalando dependencias...
python -m pip install --upgrade pip --quiet
pip install -r requirements.txt --only-binary :all: --quiet
if errorlevel 1 (
    echo [WARN] Falha com --only-binary. Tentando instalacao normal...
    pip install -r requirements.txt --quiet
)
echo [OK] Dependencias instaladas.
echo.

REM 5. Inicia o servidor
echo ============================================
echo   Servidor iniciando em http://localhost:8000
echo   Pressione CTRL+C para encerrar
echo ============================================
echo.
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

pause

