# Uses Wikipedia's REST API to get thumbnail URLs, then downloads them
# This avoids the thumbnail CDN robot policy

$ua   = 'Mozilla/5.0 (compatible; StudentProject/1.0; educational use)'
$dest = 'C:\my laptop\Claude skills\Website generation\leonardo-davinci-website'

function Get-WikiThumb($title, $size) {
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
    $msg = $_.Exception.Message; return "FAIL: $msg"
  }
}

# Paintings — Wikipedia article title → output filename
$paintings = @(
  @{ title='The Last Supper (Leonardo)';            out='last-supper.jpg' }
  @{ title='The Baptism of Christ (Verrocchio and Leonardo)'; out='baptism-of-christ.jpg' }
  @{ title='Virgin of the Rocks';                   out='virgin-rocks.jpg' }
)

# For sketches/inventions use direct Wikimedia commons (small sizes to avoid 429)
$sketches = @(
  @{ name='flying-machine.jpg';  url='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Leonardo_da_Vinci_helicopter.jpg/320px-Leonardo_da_Vinci_helicopter.jpg' }
  @{ name='armored-vehicle.jpg'; url='https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Panzer_vinci.jpg/320px-Panzer_vinci.jpg' }
  @{ name='aerial-screw.jpg';    url='https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Leonardo_da_vinci%2C_aerial_screw.jpg/320px-Leonardo_da_vinci%2C_aerial_screw.jpg' }
  @{ name='robotic-knight.jpg';  url='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Leonardo-Robot.jpg/320px-Leonardo-Robot.jpg' }
  @{ name='parachute.jpg';       url='https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Parachute_Leonardo_da_Vinci.jpg/320px-Parachute_Leonardo_da_Vinci.jpg' }
  @{ name='solar-power.jpg';     url='https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Leonardo_da_vinci%2C_study_of_a_flying_machine.jpg/320px-Leonardo_da_vinci%2C_study_of_a_flying_machine.jpg' }
)

Write-Host "=== Fetching paintings via Wikipedia REST API ==="
foreach ($p in $paintings) {
  $out = Join-Path $dest $p.out
  if (Test-Path $out) { Write-Host "SKIP $($p.out)"; continue }
  Write-Host "Getting thumbnail URL for: $($p.title)"
  $thumbUrl = Get-WikiThumb $p.title 640
  if ($thumbUrl) {
    Write-Host "  URL: $thumbUrl"
    $result = Download-Image $thumbUrl $out
    Write-Host "  $result"
  } else {
    Write-Host "  Could not get thumbnail URL"
  }
  Start-Sleep -Seconds 2
}

Write-Host "`n=== Downloading invention sketches ==="
foreach ($s in $sketches) {
  $out = Join-Path $dest $s.name
  if (Test-Path $out) { Write-Host "SKIP $($s.name)"; continue }
  Write-Host "Downloading $($s.name)..."
  $result = Download-Image $s.url $out
  Write-Host "  $result"
  Start-Sleep -Seconds 4
}

Write-Host "`n=== Final file list ==="
Get-ChildItem $dest -Filter *.jpg | Sort-Object Name | ForEach-Object {
  Write-Host "  $($_.Name.PadRight(30)) $([math]::Round($_.Length/1KB,1)) KB"
}
