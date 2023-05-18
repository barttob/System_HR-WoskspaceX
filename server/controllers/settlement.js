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
  let startDate = new Date(req.query.contract[0].start_date);
  startDate = new Date(
    startDate.getTime() - startDate.getTimezoneOffset() * 60000
  );
  let endDate = new Date(req.query.contract[0].end_date);
  endDate = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000);
  const monthlyRecords = [];

  let currentDate = new Date(startDate);
  if (req.query.contract[0].contract_type === "Umowa o pracę tymczasową") {
    const existingSalaryQuery = "SELECT * FROM salaries WHERE user_id = ?";
    const existingSalaryParams = [req.params.id];

    db.query(
      existingSalaryQuery,
      existingSalaryParams,
      (salaryErr, salaryResult) => {
        if (salaryErr) {
          res.status(500).send({ error: salaryErr });
          return;
        }
        const existingSalaries = salaryResult;

        while (currentDate < endDate) {
          const lastDayOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            currentDate.getDate()
          );

          const daysInMonth = getBusinessDays(currentDate, lastDayOfMonth);
          const dailyRate = req.query.contract[0].rate;
          const monthlyRate = dailyRate * daysInMonth * 8;
          const monthlyNettoRate =
            Math.floor(
              (monthlyRate - monthlyRate * 0.24 - monthlyRate * 0.0775) * 100
            ) / 100;

          const existingSalary = existingSalaries.find((salary) => {
            const salaryStartDate = new Date(salary.from_date);
            const salaryEndDate = new Date(salary.to_date);

            return (
              salaryStartDate <= currentDate && currentDate <= salaryEndDate
            );
          });

          if (existingSalary) {
            currentDate.setMonth(currentDate.getMonth() + 1);
          } else {
            monthlyRecords.push({
              month: currentDate.toLocaleString("default", {
                month: "long",
              }),
              year: currentDate.getFullYear(),
              start_date: currentDate.toISOString().slice(0, 10),
              end_date: lastDayOfMonth.toISOString().slice(0, 10),
              contract_type: req.query.contract[0].contract_type,
              contract_id: req.query.contract[0].contract_id,
              user_id: req.query.contract[0].user_id,
              rate: monthlyRate,
              netto_rate: monthlyNettoRate,
            });
            currentDate.setMonth(currentDate.getMonth() + 1);
          }
          if (currentDate >= endDate) {
            res.send(monthlyRecords);
          }
        }
      }
    );
  } else if (
    req.query.contract[0].contract_type === "Umowa o pracę na czas określony"
  ) {
    const existingSalaryQuery = "SELECT * FROM salaries WHERE user_id = ?";
    const existingSalaryParams = [req.params.id];

    db.query(
      existingSalaryQuery,
      existingSalaryParams,
      (salaryErr, salaryResult) => {
        if (salaryErr) {
          res.status(500).send({ error: salaryErr });
          return;
        }
        const existingSalaries = salaryResult;

        while (currentDate < endDate) {
          const lastDayOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            currentDate.getDate()
          );

          // const daysInMonth = getBusinessDays(currentDate, lastDayOfMonth);
          const monthlyRate = req.query.contract[0].rate;
          const monthlyNettoRate =
            Math.floor(
              (monthlyRate - monthlyRate * 0.24 - monthlyRate * 0.0775) * 100
            ) / 100;

          const existingSalary = existingSalaries.find((salary) => {
            const salaryStartDate = new Date(salary.from_date);
            const salaryEndDate = new Date(salary.to_date);

            return (
              salaryStartDate <= currentDate && currentDate <= salaryEndDate
            );
          });

          if (existingSalary) {
            currentDate.setMonth(currentDate.getMonth() + 1);
          } else {
            monthlyRecords.push({
              month: currentDate.toLocaleString("default", {
                month: "long",
              }),
              year: currentDate.getFullYear(),
              start_date: currentDate.toISOString().slice(0, 10),
              end_date: lastDayOfMonth.toISOString().slice(0, 10),
              contract_type: req.query.contract[0].contract_type,
              contract_id: req.query.contract[0].contract_id,
              user_id: req.query.contract[0].user_id,
              rate: monthlyRate,
              netto_rate: monthlyNettoRate,
            });
            currentDate.setMonth(currentDate.getMonth() + 1);
          }
          if (currentDate >= endDate) {
            res.send(monthlyRecords);
          }
        }
      }
    );
  } else if (req.query.contract[0].contract_type === "Umowa zlecenie") {
    db.query(
      "SELECT * FROM jobs WHERE job_id IN (SELECT job_id FROM jobs_assigment WHERE contract_id IN (?) AND contract_id NOT IN (SELECT contract_id FROM salaries) ORDER BY add_date DESC)",
      [req.query.contract.map((contract) => contract.contract_id)],
      // "SELECT * FROM jobs WHERE job_id = (SELECT job_id FROM jobs_assigment WHERE contract_id = ? AND contract_id NOT IN (SELECT contract_id FROM salaries) ORDER BY add_date DESC LIMIT 1) ",
      // [req.query.contract[0].contract_id],
      (err, subResult) => {
        if (err || subResult[0] == null) {
          res.status(500).send({ error: err });
        } else {
          const records = [];
          let i = 0;
          subResult.forEach((element) => {
            i = 0;
            const rate =
              element.emp_rate *
              getBusinessDays(
                new Date(element.start_date),
                new Date(element.end_date)
              ) *
              8;
            records.push({
              start_date: startDate.toISOString().slice(0, 10),
              end_date: endDate.toISOString().slice(0, 10),
              contract_type: req.query.contract[i].contract_type,
              contract_id: req.query.contract[i].contract_id,
              user_id: req.query.contract[i].user_id,
              rate: rate,
              netto_rate:
                Math.floor((rate - rate * 0.12 - rate * 0.0775) * 100) / 100,
            });
            i++;
          });
          res.send(records);
        }
      }
    );
  } else if (req.query.contract[0].contract_type === "Umowa o dzieło") {
    db.query(
      "SELECT * FROM jobs WHERE job_id IN (SELECT job_id FROM jobs_assigment WHERE contract_id IN (?) AND contract_id NOT IN (SELECT contract_id FROM salaries) ORDER BY add_date DESC)",
      [req.query.contract.map((contract) => contract.contract_id)],
      (err, subResult) => {
        if (err) {
          res.status(500).send({ error: err.message });
        } else {
          const records = [];
          let i = 0;
          subResult.forEach((element) => {
            const rate =
              element.emp_rate *
              getBusinessDays(
                new Date(element.start_date),
                new Date(element.end_date)
              ) *
              8;
            records.push({
              start_date: startDate.toISOString().slice(0, 10),
              end_date: endDate.toISOString().slice(0, 10),
              contract_type: req.query.contract[i].contract_type,
              contract_id: req.query.contract[i].contract_id,
              user_id: req.query.contract[i].user_id,
              rate: rate,
              netto_rate: rate,
            });
            i++;
          });
          res.send(records);
        }
      }
    );
  }
};

export const setSettle = (req, res) => {
  db.query(
    "INSERT INTO salaries (user_id, contract_id, from_date, to_date, salary_gross, salary_net) VALUES (?,?,?,?,?,?)",
    [
      req.body.settle.user_id,
      req.body.settle.contract_id,
      new Date(req.body.start_date),
      new Date(req.body.end_date),
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

  const start_date_raw = new Date(req.query.settle[0].start_date);
  const start_date = new Date(
    start_date_raw.getTime() - start_date_raw.getTimezoneOffset() * 60000
  );
  const end_date_raw = new Date(req.query.settle[0].end_date);
  const end_date = new Date(
    end_date_raw.getTime() - end_date_raw.getTimezoneOffset() * 60000
  );

  const doc = new PDFDocument();

  // Dodaj zawartość do dokumentu
  doc.fontSize(18).text("Raport rozliczeniowy", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Imie: ${req.query.first_name}`);
  doc.fontSize(12).text(`Nazwisko: ${req.query.last_name}`);
  doc.fontSize(12).text(`Typ umowy: ${req.query.settle[0].contract_type}`);
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
  doc.fontSize(12).text(`Wynagrodzenie brutto: ${req.query.settle[0].rate} zl`);
  doc
    .fontSize(12)
    .text(`Wynagrodzenie netto: ${req.query.settle[0].netto_rate} zl`);
  doc.moveDown();

  const stream = doc.pipe(res.type("application/pdf").attachment("raport.pdf"));
  doc.end();
};

// export const getSettlement = (req, res) => {
//   db.query(
//     "SELECT * FROM contracts WHERE user_id = ? ORDER BY end_date DESC LIMIT 1",
//     [req.params.id],
//     (err, result) => {
//       if (err || result[0] == null) {
//         res.status(500).send({ error: err });
//       } else {
//         if (result[0].contract_type === "Umowa o pracę tymczasową") {
//           let startDate = new Date(result[0].start_date);
//           startDate = new Date(
//             startDate.getTime() - startDate.getTimezoneOffset() * 60000
//           );
//           let endDate = new Date(result[0].end_date);
//           endDate = new Date(
//             endDate.getTime() - endDate.getTimezoneOffset() * 60000
//           );
//           const monthlyRecords = [];

//           // Iterate over each month
//           let currentDate = new Date(startDate);

//           const processNextMonth = () => {
//             if (currentDate > endDate) {
//               if (monthlyRecords.length > 0) {
//                 res.send(monthlyRecords);
//               } else {
//                 // Handle case when no records found
//                 res.send({ message: "No records found" });
//               }
//               return;
//             }

//             const lastDayOfMonth = new Date(
//               currentDate.getFullYear(),
//               currentDate.getMonth() + 1,
//               currentDate.getDate()
//             );

//             const daysInMonth = getBusinessDays(currentDate, lastDayOfMonth);
//             const monthlyRate = result[0].rate * daysInMonth * 8;
//             const monthlyNettoRate =
//               Math.floor(
//                 (monthlyRate - monthlyRate * 0.24 - monthlyRate * 0.0775) * 100
//               ) / 100;

//             // console.log(
//             //   `id: ${req.params.id}, from: ${currentDate
//             //     .toISOString()
//             //     .slice(0, 10)}, to ${lastDayOfMonth.toISOString().slice(0, 10)}`
//             // );
//             // let skip = false;
//             const existingSalaryQuery =
//               "SELECT * FROM salaries WHERE user_id = ? AND from_date = ? AND to_date = ?";
//             const existingSalaryParams = [
//               req.params.id,
//               currentDate.toISOString().slice(0, 10),
//               lastDayOfMonth.toISOString().slice(0, 10),
//             ];
//             db.query(
//               existingSalaryQuery,
//               existingSalaryParams,
//               (salaryErr, salaryResult) => {
//                 if (salaryErr) {
//                   res.status(500).send({ error: salaryErr });
//                   return;
//                 }

//                 if (salaryResult.length > 0) {
//                   // Salary entry already exists, skip to next month
//                   currentDate.setMonth(currentDate.getMonth() + 1);
//                   processNextMonth();
//                 } else {
//                   monthlyRecords.push({
//                     month: currentDate.toLocaleString("default", {
//                       month: "long",
//                     }),
//                     year: currentDate.getFullYear(),
//                     start_date: currentDate.toISOString().slice(0, 10),
//                     end_date: lastDayOfMonth.toISOString().slice(0, 10),
//                     contract_type: result[0].contract_type,
//                     contract_id: result[0].contract_id,
//                     user_id: result[0].user_id,
//                     rate: monthlyRate,
//                     netto_rate: monthlyNettoRate,
//                   });
//                 }
//                 currentDate.setMonth(currentDate.getMonth() + 1);
//                 setTimeout(processNextMonth, 0);
//               }
//             );
//             // if (!skip) {
//             //   currentDate.setMonth(currentDate.getMonth() + 1);
//             // }
//           };
//           processNextMonth();
//           // console.log(new Date());
//           // res.send(monthlyRecords);
//         } else if (
//           result[0].contract_type === "Umowa o pracę na czas określony"
//         ) {
//           result[0].netto_rate =
//             Math.floor(
//               (result[0].rate -
//                 result[0].rate * 0.24 -
//                 result[0].rate * 0.0775) *
//                 100
//             ) / 100;
//           res.send(result);
//         } else if (result[0].contract_type === "Umowa zlecenie") {
//           db.query(
//             "SELECT * FROM jobs WHERE job_id = (SELECT job_id FROM jobs_assigment WHERE contract_id = ? AND contract_id NOT IN (SELECT contract_id FROM salaries) ORDER BY add_date DESC LIMIT 1) ",
//             [result[0].contract_id],
//             (err, subResult) => {
//               if (err || subResult[0] == null) {
//                 res.status(500).send({ error: err });
//               } else {
//                 result[0].rate =
//                   subResult[0].emp_rate *
//                   getBusinessDays(
//                     new Date(subResult[0].start_date),
//                     new Date(subResult[0].end_date)
//                   ) *
//                   8;
//                 result[0].netto_rate =
//                   Math.floor(
//                     (result[0].rate -
//                       result[0].rate * 0.12 -
//                       result[0].rate * 0.0775) *
//                       100
//                   ) / 100;
//                 res.send(result);
//               }
//             }
//           );
//         } else if (result[0].contract_type === "Umowa o dzieło") {
//           db.query(
//             "SELECT * FROM jobs WHERE job_id = (SELECT job_id FROM jobs_assigment WHERE contract_id = ? AND contract_id NOT IN (SELECT contract_id FROM salaries) ORDER BY add_date DESC LIMIT 1)",
//             [result[0].contract_id],
//             (err, subResult) => {
//               if (err) {
//                 res.status(500).send({ error: err.message });
//               } else {
//                 result[0].rate *=
//                   getBusinessDays(
//                     new Date(subResult[0].start_date),
//                     new Date(subResult[0].end_date)
//                   ) * 8;
//                 result[0].netto_rate = result[0].rate;
//                 res.send(result);
//               }
//             }
//           );
//         }
//       }
//     }
//   );
// };
