# Mirrors the personal website into the OneDrive folder: source files, a build identical to the live site,
# the full git history (one OneDrive-safe bundle file) and a page with every link.
# Run by the Windows scheduled task "Personal website - OneDrive sync"; safe to run by hand any time.
# Destination and folder names live in tools\sync-config.json (local only, not committed).
param([switch]$NoBuild)

$Repo = Split-Path $PSScriptRoot -Parent
$cfg = Get-Content (Join-Path $PSScriptRoot 'sync-config.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$Dest = $cfg.dest
$n = $cfg.names
$lines = New-Object System.Collections.Generic.List[string]
function Log([string]$m) { $lines.Add("$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  $m") }

New-Item -ItemType Directory -Force $Dest | Out-Null
Set-Location $Repo
$env:GCM_INTERACTIVE = 'never'
$env:PYTHONIOENCODING = 'utf-8'  # the scheduled task has no console, so Python would otherwise fail on Arabic paths
$py = (Get-Command python -ErrorAction SilentlyContinue).Source
if (-not $py) { $py = Join-Path $env:LOCALAPPDATA 'Programs\Python\Python312\python.exe' }

# 1. bring in edits made on github.com (papers, profile, video texts)
$pull = git pull --ff-only 2>&1 | Out-String
Log ("git pull: " + ($pull.Trim() -replace '\s+', ' '))

# 2. rebuild locally so the copy matches the live site (videos, articles and PNG cards included)
if (-not $NoBuild) {
    $b = & $py build.py 2>&1 | Out-String
    Log ("build: " + ($b.Trim() -replace '\s+', ' '))
}

# 3. mirror source and built site (robocopy exit codes below 8 mean success)
robocopy $Repo (Join-Path $Dest $n.source) /MIR /XD .git dist __pycache__ .claude /XF sync-config.json /R:2 /W:2 /NP /NFL /NDL /NJH /NJS | Out-Null
Log "source mirrored (robocopy $LASTEXITCODE)"
robocopy (Join-Path $Repo 'dist') (Join-Path $Dest $n.live) /MIR /R:2 /W:2 /NP /NFL /NDL /NJH /NJS | Out-Null
Log "live-site copy mirrored (robocopy $LASTEXITCODE)"

# 4. full history as one file: restore with  git clone "<bundle>" academic-site
git bundle create (Join-Path $Dest $n.bundle) --all 2>&1 | Out-Null
Log "git bundle written ($(git rev-parse --short HEAD))"

# 5. every link of the site in one page
$l = & $py tools/make_links.py (Join-Path $Dest $n.links) 2>&1 | Out-String
Log ($l.Trim())

Copy-Item (Join-Path $PSScriptRoot 'onedrive-readme.txt') (Join-Path $Dest $n.readme) -Force

# 6. keep the last 400 log lines
$logFile = Join-Path $Dest $n.log
$old = if (Test-Path $logFile) { Get-Content $logFile -Encoding UTF8 } else { @() }
@($old) + $lines + '' | Select-Object -Last 400 | Set-Content $logFile -Encoding UTF8
$lines | ForEach-Object { Write-Output $_ }
