$dest  = 'C:\my laptop\Claude skills\Website generation\leonardo-davinci-website'
$codex = "$dest\Leonardo_da_Vinci_-_Ambrosiana-Codice-Atlantico-Codex-Atlanticus-f-33-recto.jpg"
Copy-Item $codex "$dest\flying-machine.jpg" -Force
Copy-Item $codex "$dest\parachute.jpg"      -Force
Write-Host "Done - replaced with Codex Atlanticus"
Get-ChildItem $dest -Filter *.jpg | Sort-Object Name | ForEach-Object {
  Write-Host "  $($_.Name.PadRight(35)) $([math]::Round($_.Length/1KB,1)) KB"
}
