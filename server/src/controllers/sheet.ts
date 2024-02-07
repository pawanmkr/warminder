import Excel from "exceljs";
import { Campaign } from "../services/databases/queries.js";
import { Request, Response } from "express";

export async function handle_sheet_upload(req: Request, res: Response) {
  const { user_id } = req.body;

  if (!req.file) {
    return res
      .status(500)
      .send({
        error: "Sheet not uploaded!",
      });
  }
  const rows = await get_column_titles_and_rows(req.file.path);

  await Campaign.save_sheet(user_id, rows);

  return res.send(200);
}


export async function handle_finding_sheets(req: Request, res: Response) {
  const sheets = await Campaign.find_all_user_sheets(parseInt(req.query.user_id as string));
  return res.send(sheets);
}


async function get_column_titles_and_rows(sheet_path: string) {
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(sheet_path);
  const worksheet = workbook.worksheets[0];

  const rows_arr: any = [];
  const headers: any = {};

  worksheet.eachRow((row, row_number) => {
    if (row_number === 1) {
      row.eachCell((cell, cell_number) => {
        headers[cell_number] = cell.toString();
      });
    } else {
      const json_row: any = {};
      row.eachCell((cell, cell_number) => {
        json_row[headers[cell_number]] = cell.toString();
      });
      rows_arr.push(json_row);
    }
  });
  return rows_arr;
}
