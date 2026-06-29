@echo off
SETLOCAL Enabledelayedexpansion

echo ===================================================
echo   DESPLIEGUE DEL FRONTEND ANGULAR EN AWS (S3 + CDN)
echo ===================================================
echo.

:: Verificar AWS CLI
aws --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] AWS CLI no esta instalado o no se encuentra en el PATH.
    echo Por favor, instalalo desde https://aws.amazon.com/cli/ y ejecuta 'aws configure' primero.
    pause
    exit /b 1
)

:: Variables del S3 y CloudFront
set /p S3_BUCKET="Introduce el nombre del Bucket S3 (ej. emergencia-vehicular-front): "
if "%S3_BUCKET%"=="" (
    echo [ERROR] El nombre del Bucket S3 es obligatorio.
    pause
    exit /b 1
)

set /p API_URL="Introduce la URL de produccion de tu API (ej. https://api.tudominio.com/api): "
if "%API_URL%"=="" (
    echo [ERROR] La URL de la API es obligatoria.
    pause
    exit /b 1
)

set /p CLOUDFRONT_DIST_ID="Introduce el ID de Distribucion de CloudFront (Opcional, presiona Enter para omitir): "

:: Configurar archivo .env temporal para el build
echo API_URL=%API_URL%> .env
echo [INFO] Archivo .env configurado con API_URL=%API_URL%

:: Ejecutar compilacion del Frontend
echo [INFO] Iniciando construccion de produccion del Frontend...
call npm run build

if %ERRORLEVEL% neq 0 (
    echo [ERROR] La compilacion fallo. Revisa los mensajes de error.
    pause
    exit /b 1
)

:: Detectar la carpeta de salida en dist/
echo [INFO] Detectando directorio de salida en dist/...
set OUT_DIR=
for /d %%i in (dist\*) do (
    set OUT_DIR=%%i
)

if "%OUT_DIR%"=="" (
    echo [ERROR] No se encontro ninguna carpeta de salida en 'dist/'.
    pause
    exit /b 1
)

:: Si existe la carpeta browser dentro del directorio detectado, usarla (Angular 17+)
if exist "%OUT_DIR%\browser" (
    set TARGET_DIR=%OUT_DIR%\browser
) else (
    set TARGET_DIR=%OUT_DIR%
)

echo [INFO] Directorio a subir: %TARGET_DIR%

:: Subir a S3
echo [INFO] Subiendo archivos estaticos al bucket S3 's3://%S3_BUCKET%'...
aws s3 sync "%TARGET_DIR%" "s3://%S3_BUCKET%" --delete

if %ERRORLEVEL% neq 0 (
    echo [ERROR] La subida a S3 fallo. Verifica tus permisos y credenciales de AWS.
    pause
    exit /b 1
)
echo [OK] Archivos subidos con exito a S3.

:: Invalidad cache de CloudFront si se proporciono el ID
if not "%CLOUDFRONT_DIST_ID%"=="" (
    echo [INFO] Invalidando cache de CloudFront para '%CLOUDFRONT_DIST_ID%'...
    aws cloudfront create-invalidation --distribution-id "%CLOUDFRONT_DIST_ID%" --paths "/*"
    if %ERRORLEVEL% neq 0 (
        echo [WARNING] No se pudo invalidar la cache de CloudFront. Verifica el ID o tus permisos.
    ) else (
        echo [OK] Cache invalidada con exito en CloudFront.
    )
)

echo.
echo ===================================================
echo DESPLIEGUE FINALIZADO EXITOSAMENTE
echo ===================================================
pause
