# pre-commit.ps1
# Prevent certain files from being committed by unstaging them

# List of blocked patterns (regex-like)
$blockedPatterns = @(
    "minecraftinstance.json"
)

# Get staged files
$stagedFiles = git diff --cached --name-only --diff-filter=ACM

foreach ($pattern in $blockedPatterns) {
    $matches = $stagedFiles | Where-Object { $_ -match $pattern }
    foreach ($file in $matches) {
        Write-Host "Unstaging blocked file: $file" -ForegroundColor Yellow
        git restore --staged -- "$file"
    }
}