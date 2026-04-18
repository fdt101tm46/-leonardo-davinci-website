$ua   = 'Mozilla/5.0 (compatible; StudentProject/1.0; educational use)'
$dest = 'C:\my laptop\Claude skills\Website generation\leonardo-davinci-website'

function Get-WikiThumb($title) {
  $encoded = [uri]::EscapeDataString($title)
  $api = "https://en.wikipedia.org/api/rest_v1/page/summary/$encoded"
  try {
    $resp = Invoke-RestMethod -Uri $api -UserAgent $ua -TimeoutSec 15
    return $resp.thumbnail.source
  } catch { return $null }
}

function Download-Image($url, $outPath) {
  try {
    Invoke-WebRequest -Uri $url -OutFile $outPath -UserAgent $ua -TimeoutSec 30
    $kb = [math]::Round((Get-Item $outPath).Length / 1KB, 1)
    return "OK ($kb KB)"
  } catch {
    $msg = $_.Exception.Message
    return "FAIL: $msg"
  }
}

$sketches = @(
  @{ title="Flying machine (Leonardo da Vinci)";  out='flying-machine.jpg' }
  @{ title="Leonardo da Vinci's tank";            out='armored-vehicle.jpg' }
  @{ title="Aerial screw";                        out='aerial-screw.jpg' }
  @{ title="Leonardo's robot";                    out='robotic-knight.jpg' }
  @{ title="History of parachuting";              out='parachute.jpg' }
  @{ title="Leonardo da Vinci";                   out='solar-power.jpg' }
)

foreach ($s in $sketches) {
  $out = Join-Path $dest $s.out
  if (Test-Path $out) { Write-Host "SKIP $($s.out)"; continue }
  Write-Host "Fetching: $($s.title)"
  $url = Get-WikiThumb $s.title
  if ($url) {
    Write-Host "  URL: $url"
    $result = Download-Image $url $out
    Write-Host "  $result"
  } else {
    Write-Host "  No thumbnail found"
  }
  Start-Sleep -Seconds 2
}

Write-Host "`nDone."
Get-ChildItem $dest -Filter *.jpg | Sort-Object Name | ForEach-Object {
  Write-Host "  $($_.Name.PadRight(35)) $([math]::Round($_.Length/1KB,1)) KB"
}
