# Script to enable symlink creation for non-admin users on Windows
# Run this once to enable developer mode for your user account

Write-Host "Checking if running as Administrator..." -ForegroundColor Cyan

if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "This script needs to be run as Administrator." -ForegroundColor Yellow
    Write-Host "Right-click PowerShell and select 'Run as Administrator', then run this script again." -ForegroundColor Yellow
    exit 1
}

try {
    Write-Host "Enabling Developer Mode for symlink support..." -ForegroundColor Cyan
    $RegistryPath = "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock"
    
    if (-NOT (Test-Path $RegistryPath)) {
        New-Item $RegistryPath -Force | Out-Null
    }
    
    Set-ItemProperty -Path $RegistryPath -Name AllowDevelopmentWithoutDevLicense -Value 1 -Type DWord
    
    Write-Host "Developer Mode enabled successfully!" -ForegroundColor Green
    Write-Host "You may need to restart your terminal for changes to take effect." -ForegroundColor Yellow
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

