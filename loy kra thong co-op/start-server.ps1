# Built-in Windows PowerShell HTTP Server for Loy Krathong Co-op
$port = 8080
$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "✨ Loy Krathong Co-op Web Server Running!" -ForegroundColor Yellow
    Write-Host "👉 Open in your browser: http://localhost:$port/" -ForegroundColor Cyan
    Write-Host "👉 Share with partner on same Wi-Fi or send Room Code!" -ForegroundColor Magenta
    Write-Host "Press Ctrl+C to stop the server." -ForegroundColor Gray
    Write-Host "==========================================================" -ForegroundColor Green

    # Launch default browser
    Start-Process $prefix

    $baseDir = $PSScriptRoot
    if (-not $baseDir) { $baseDir = Get-Location }

    $mimeTypes = @{
        ".html" = "text/html; charset=utf-8"
        ".css"  = "text/css; charset=utf-8"
        ".js"   = "application/javascript; charset=utf-8"
        ".json" = "application/json; charset=utf-8"
        ".png"  = "image/png"
        ".jpg"  = "image/jpeg"
        ".svg"  = "image/svg+xml"
        ".ico"  = "image/x-icon"
    }

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $path = $request.Url.LocalPath
        if ($path -eq "/" -or [string]::IsNullOrWhiteSpace($path)) {
            $path = "/index.html"
        }

        $localPath = Join-Path $baseDir ($path.TrimStart("/").Replace("/", "\"))

        if (Test-Path $localPath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
            $contentType = "application/octet-stream"
            if ($mimeTypes.ContainsKey($ext)) {
                $contentType = $mimeTypes[$ext]
            }

            $bytes = [System.IO.File]::ReadAllBytes($localPath)
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.Close()
    }
}
finally {
    $listener.Stop()
    $listener.Close()
}
