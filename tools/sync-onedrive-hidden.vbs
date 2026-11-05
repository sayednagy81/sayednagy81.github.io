' Runs sync-onedrive.ps1 with no visible window (avoids the console flash).
Set sh = CreateObject("WScript.Shell")
sh.Run "powershell.exe -NoProfile -NonInteractive -WindowStyle Hidden -ExecutionPolicy Bypass -File ""C:\academic-site\tools\sync-onedrive.ps1""", 0, False
