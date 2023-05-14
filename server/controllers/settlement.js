import { db } from "../connect.js";
import PDFDocument from "pdfkit";

function getBusinessDays(startDate, endDate) {
  let businessDays = 0;
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      businessDays++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return businessDays;
}

export const getSettlement = (req, res) => {
  db.query(
    "SELECT * FROM contracts WHERE user_id = ? ORDER BY end_date DESC LIMIT 1",
    [req.params.id],
    (err, result) => {
      if (err || result[0] == null) {
        res.status(500).send({ error: err });
      } else {
        if (result[0].contract_type === "Umowa o pracę tymczasową") {
          result[0].rate *=
            getBusinessDays(
              new Date(result[0].start_date),
              new Date(result[0].end_date)
            ) * 8;
          result[0].netto_rate =
            Math.floor(
              (result[0].rate -
                result[0].rate * 0.24 -
                result[0].rate * 0.0775) *
                100
            ) / 100;
          res.send(result);
        } else if (
          result[0].contract_type === "Umowa o pracę na czas określony"
        ) {
          result[0].netto_rate =
            Math.floor(
              (result[0].rate -
                result[0].rate * 0.24 -
                result[0].rate * 0.0775) *
                100
            ) / 100;
          res.send(result);
        } else if (result[0].contract_type === "Umowa zlecenie") {
          db.query(
            "SELECT * FROM jobs WHERE job_id = (SELECT job_id FROM jobs_assigment WHERE contract_id = ? AND contract_id NOT IN (SELECT contract_id FROM salaries) ORDER BY add_date DESC LIMIT 1) ",
            [result[0].contract_id],
            (err, subResult) => {
              if (err || subResult[0] == null) {
                res.status(500).send({ error: err });
              } else {
                result[0].rate =
                  subResult[0].emp_rate *
                  getBusinessDays(
                    new Date(subResult[0].start_date),
                    new Date(subResult[0].end_date)
                  ) *
                  8;
                result[0].netto_rate =
                  Math.floor(
                    (result[0].rate -
                      result[0].rate * 0.12 -
                      result[0].rate * 0.0775) *
                      100
                  ) / 100;
                res.send(result);
              }
            }
          );
        } else if (result[0].contract_type === "Umowa o dzieło") {
          db.query(
            "SELECT * FROM jobs WHERE job_id = (SELECT job_id FROM jobs_assigment WHERE contract_id = ? AND contract_id NOT IN (SELECT contract_id FROM salaries) ORDER BY add_date DESC LIMIT 1)",
            [result[0].contract_id],
            (err, subResult) => {
              if (err) {
                res.status(500).send({ error: err.message });
              } else {
                result[0].rate *=
                  getBusinessDays(
                    new Date(subResult[0].start_date),
                    new Date(subResult[0].end_date)
                  ) * 8;
                result[0].netto_rate = result[0].rate;
                res.send(result);
              }
            }
          );
        }
      }
    }
  );
};

export const setSettle = (req, res) => {
  db.query(
    "INSERT INTO salaries (user_id, contract_id, from_date, to_date, salary_gross, salary_net) VALUES (?,?,?,?,?,?)",
    [
      req.body.settle.user_id,
      req.body.settle.contract_id,
      new Date(req.body.settle.start_date),
      new Date(req.body.settle.end_date),
      req.body.settle.rate,
      req.body.settle.netto_rate,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ error: err.message });
      } else {
        res.send({ success: true, result: result });
      }
    }
  );
};

export const generatePdf = (req, res) => {
  // console.log(req.query);
  const date = new Date();
  const currDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  const start_date_raw = new Date(req.query.settle.start_date);
  const start_date = new Date(
    start_date_raw.getTime() - start_date_raw.getTimezoneOffset() * 60000
  );
  const end_date_raw = new Date(req.query.settle.end_date);
  const end_date = new Date(
    end_date_raw.getTime() - end_date_raw.getTimezoneOffset() * 60000
  );

  const doc = new PDFDocument();

  // Dodaj zawartość do dokumentu
  doc.fontSize(18).text("Raport rozliczeniowy", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Imie: ${req.query.first_name}`);
  doc.fontSize(12).text(`Nazwisko: ${req.query.last_name}`);
  doc.fontSize(12).text(`Typ umowy: ${req.query.settle.contract_type}`);
  doc.moveDown();
  doc
    .fontSize(12)
    .text(`Data generowania raportu: ${currDate.toISOString().split("T")[0]}`, {
      align: "right",
    });
  doc.moveDown();
  doc.fontSize(14).text("Podsumowanie", { underline: true });
  doc.moveDown();
  doc
    .fontSize(12)
    .text(
      `Okres rozliczenia: ${start_date.toISOString().split("T")[0]} - ${
        end_date.toISOString().split("T")[0]
      }`
    );
  doc.fontSize(12).text(`Wynagrodzenie brutto: ${req.query.settle.rate} zl`);
  doc
    .fontSize(12)
    .text(`Wynagrodzenie netto: ${req.query.settle.netto_rate} zl`);
  doc.moveDown();

  const stream = doc.pipe(res.type("application/pdf").attachment("raport.pdf"));
  doc.end();
};
