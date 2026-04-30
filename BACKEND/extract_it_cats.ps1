$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
try {
    $wb = $excel.Workbooks.Open('F:\Desipath-code\desipath_it_training_categories.xlsx')
    $ws = $wb.Sheets.Item(1)
    for ($i = 1; $i -le 300; $i++) {
        $c1 = $ws.Cells.Item($i, 1).Text
        $c2 = $ws.Cells.Item($i, 2).Text
        if (-not $c1 -and -not $c2) { break }
        Write-Host "$c1|$c2"
    }
    $wb.Close($false)
} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
