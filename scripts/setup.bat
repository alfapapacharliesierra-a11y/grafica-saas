@echo off
REM ============================================================
REM Script de Setup Automático - Gráfica SaaS (Windows)
REM ============================================================
REM Use este script para automatizar o setup local
REM scripts/setup.bat

echo 🚀 Iniciando setup do Gráfica SaaS...

REM Verificar Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js nao encontrado. Instale em https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% encontrado

REM Instalar dependências
echo 📦 Instalando dependências...
call npm install

REM Criar arquivo .env.local
if not exist .env.local (
    echo 📝 Criando .env.local...
    copy .env.example .env.local
    echo.
    echo ⚠️  IMPORTANTE: Edite o arquivo .env.local com suas credenciais do Supabase
    echo    - NEXT_PUBLIC_SUPABASE_URL
    echo    - NEXT_PUBLIC_SUPABASE_ANON_KEY
) else (
    echo ✅ .env.local já existe
)

echo.
echo ✅ Setup completo!
echo.
echo Próximos passos:
echo 1. Edite .env.local com suas credenciais do Supabase
echo 2. Execute o SQL em scripts/init-database.sql no dashboard do Supabase
echo 3. Execute: npm run dev
echo 4. Abra http://localhost:3000
echo.
echo Para mais informações, veja docs/INSTALL.md
echo.
pause
