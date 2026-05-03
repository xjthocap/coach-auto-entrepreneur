import ExcelJS from "exceljs"

export const C = {
  ink:        "FF0F172A",
  violet:     "FF7C3AED",
  violetLight:"FFF5F3FF",
  violetMid:  "FFEDE9FE",
  rose:       "FFE11D48",
  roseLight:  "FFFFF1F2",
  roseMid:    "FFFECDD3",
  lime:       "FF84CC16",
  white:      "FFFFFFFF",
  grey:       "FFE2E8F0",
  greyText:   "FF64748B",
}

export function fmtDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number)
  return new Date(y, m - 1, d)
}

export function sectionHeader(ws: ExcelJS.Worksheet, label: string, bgColor: string, colCount: number): ExcelJS.Row {
  const row = ws.addRow([label])
  ws.mergeCells(row.number, 1, row.number, colCount)
  const cell = row.getCell(1)
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } }
  cell.font = { bold: true, size: 11, color: { argb: C.white } }
  cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 }
  row.height = 26
  return row
}

export function colHeader(ws: ExcelJS.Worksheet, labels: string[], bgColor: string): ExcelJS.Row {
  const row = ws.addRow(labels)
  row.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } }
    cell.font = { bold: true, size: 10, color: { argb: C.white } }
    cell.alignment = { vertical: "middle", horizontal: "center" }
    cell.border = { top: { style: "thin", color: { argb: C.grey } }, bottom: { style: "thin", color: { argb: C.grey } }, left: { style: "thin", color: { argb: C.grey } }, right: { style: "thin", color: { argb: C.grey } } }
  })
  row.height = 22
  return row
}

export function dataRow(ws: ExcelJS.Worksheet, values: (string | number | Date | null)[], evenRow: boolean, lightColor: string, amountCol: number): ExcelJS.Row {
  const row = ws.addRow(values)
  const bg = evenRow ? lightColor : C.white
  row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bg } }
    cell.font = { size: 10, color: { argb: C.ink } }
    cell.border = { top: { style: "thin", color: { argb: C.grey } }, bottom: { style: "thin", color: { argb: C.grey } }, left: { style: "thin", color: { argb: C.grey } }, right: { style: "thin", color: { argb: C.grey } } }
    cell.alignment = { vertical: "middle" }
    if (colNumber === amountCol) cell.alignment = { vertical: "middle", horizontal: "right" }
  })
  row.height = 20
  return row
}

export function totalRow(ws: ExcelJS.Worksheet, label: string, total: number, colCount: number, amountCol: number, bgColor: string): ExcelJS.Row {
  const values = Array(colCount).fill(null)
  values[0] = label
  values[amountCol - 1] = total
  const row = ws.addRow(values)
  ws.mergeCells(row.number, 1, row.number, amountCol - 1)
  row.eachCell({ includeEmpty: true }, (cell, col) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } }
    cell.font = { bold: true, size: 10, color: { argb: C.ink } }
    cell.border = { top: { style: "medium", color: { argb: bgColor } }, bottom: { style: "medium", color: { argb: bgColor } }, left: { style: "thin", color: { argb: C.grey } }, right: { style: "thin", color: { argb: C.grey } } }
    cell.alignment = { vertical: "middle", horizontal: col === amountCol ? "right" : "left", indent: 1 }
    if (col === amountCol) cell.numFmt = '#,##0.00 "€"'
  })
  row.height = 24
  return row
}

export function docHeader(ws: ExcelJS.Worksheet, title: string, companyName: string, rangeLabel: string, colCount: number) {
  ws.addRow([])
  const titleRow = ws.addRow([title])
  ws.mergeCells(titleRow.number, 1, titleRow.number, colCount)
  const tc = titleRow.getCell(1)
  tc.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.ink } }
  tc.font = { bold: true, size: 14, color: { argb: C.white } }
  tc.alignment = { vertical: "middle", horizontal: "center" }
  titleRow.height = 32

  const infoRow = ws.addRow([`Nom / Entreprise : ${companyName}`, "", "", `Période : ${rangeLabel}`, "", `Généré le : ${new Date().toLocaleDateString("fr-FR")}`])
  ws.mergeCells(infoRow.number, 1, infoRow.number, 3)
  ws.mergeCells(infoRow.number, 4, infoRow.number, 5)
  infoRow.eachCell({ includeEmpty: true }, (cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.grey } }
    cell.font = { size: 10, color: { argb: C.greyText } }
    cell.alignment = { vertical: "middle", indent: 1 }
  })
  infoRow.height = 20
  ws.addRow([])
}

export function legalNote(ws: ExcelJS.Worksheet, colCount: number) {
  ws.addRow([])
  const r = ws.addRow(["Document généré par Keskireste · Tenu conformément à l'article 50-0 du CGI et aux obligations du régime micro-entreprise."])
  ws.mergeCells(r.number, 1, r.number, colCount)
  r.getCell(1).font = { italic: true, size: 8, color: { argb: C.greyText } }
  r.getCell(1).alignment = { horizontal: "center" }
}
