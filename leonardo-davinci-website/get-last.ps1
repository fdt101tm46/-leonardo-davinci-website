$ua   = 'Mozilla/5.0 (compatible; StudentProject/1.0; educational use)'
$dest = 'C:\my laptop\Claude skills\Website generation\leonardo-davinci-website'

function Get-WikiThumb($title) {
  $encoded = [uri]::EscapeDataString($title)
  try {
    $resp = Invoke-RestMethod -Uri "https://en.wikipedia.org/api/rest_v1/page/summary/$encoded" -UserAgent $ua -TimeoutSec 15
    return $resp.thumbnail.source
  } catch { return $null }
}

# Try different article names for flying machine
$flyingTitles = @('Ornithopter','Leonardo da Vinci%27s ornithopter','Codex on the Flight of Birds')
foreach ($t in $flyingTitles) {
  $url = Get-WikiThumb $t
  Write-Host "$t => $url"
  if ($url) {
    $out = Join-Path $dest 'flying-machine.jpg'
    Invoke-WebRequest -Uri $url -OutFile $out -UserAgent $ua -TimeoutSec 30
    Write-Host "Downloaded flying-machine.jpg"
    break
  }
  Start-Sleep -Seconds 1
}

Start-Sleep -Seconds 2

# Try for parachute
$parachuteTitles = @('Parachute','Leonardo da Vinci parachute')
foreach ($t in $parachuteTitles) {
  $url = Get-WikiThumb $t
  Write-Host "$t => $url"
  if ($url) {
    $out = Join-Path $dest 'parachute.jpg'
    Invoke-WebRequest -Uri $url -OutFile $out -UserAgent $ua -TimeoutSec 30
    Write-Host "Downloaded parachute.jpg"
    break
  }
  Start-Sleep -Seconds 1
}

# If still missing, copy Codex Atlanticus for flying machine
$flyOut = Join-Path $dest 'flying-machine.jpg'
if (-not (Test-Path $flyOut)) {
  $codex = Join-Path $dest 'Leonardo_da_Vinci_-_Ambrosiana-Codice-Atlantico-Codex-Atlanticus-f-33-recto.jpg'
  if (Test-Path $codex) {
    Copy-Item $codex $flyOut
    Write-Host "Used Codex Atlanticus as flying-machine.jpg"
  }
}

# If parachute still missing, use the aerial screw image as fallback
$paraOut = Join-Path $dest 'parachute.jpg'
if (-not (Test-Path $paraOut)) {
  # try a direct commons small image
  try {
    Invoke-WebRequest -Uri 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Parachute_Leonardo_da_Vinci.jpg/320px-Parachute_Leonardo_da_Vinci.jpg' -OutFile $paraOut -UserAgent $ua -TimeoutSec 30
    Write-Host "Downloaded parachute.jpg directly"
  } catch {
    # fallback: copy the codex image
    $codex = Join-Path $dest 'Leonardo_da_Vinci_-_Ambrosiana-Codice-Atlantico-Codex-Atlanticus-f-33-recto.jpg'
    if (Test-Path $codex) {
      Copy-Item $codex $paraOut
      Write-Host "Used Codex Atlanticus as parachute.jpg fallback"
    }
  }
}

Write-Host "`nFinal check:"
@('flying-machine.jpg','parachute.jpg') | ForEach-Object {
  $p = Join-Path $dest $_
  if (Test-Path $p) { Write-Host "  OK: $_ ($([math]::Round((Get-Item $p).Length/1KB,1)) KB)" }
  else { Write-Host "  MISSING: $_" }
}
