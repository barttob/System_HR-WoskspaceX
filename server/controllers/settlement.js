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

function countWeekdays(startDate, endDate) {
  const weekdays = {
    0: "sunday",
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday",
  };

  const occurrences = {
    sunday: 0,
    monday: 0,
    tuesday: 0,
    wednesday: 0,
    thursday: 0,
    friday: 0,
    saturday: 0,
  };

  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const weekday = weekdays[currentDate.getDay()];
    occurrences[weekday]++;
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return occurrences;
}

function toHoursAndMinutes(totalSeconds) {
  const totalMinutes = Math.floor(totalSeconds / 60);

  const seconds = totalSeconds % 60;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const formattedTime = {
    h: String(hours).padStart(2, "0"),
    m: String(minutes).padStart(2, "0"),
    s: String(seconds).padStart(2, "0"),
  };
  return [formattedTime.h, formattedTime.m, formattedTime.s];
  // return `${formattedTime.h}:${formattedTime.m}:${formattedTime.s}`;
}

function multiplyHours(hours, number) {
  const [hoursPart, minutesPart, secondsPart] = hours.split(":");
  const totalSeconds =
    ((hoursPart * 60 + Number(minutesPart)) * 60 + Number(secondsPart)) *
    number;
  return toHoursAndMinutes(totalSeconds);
}

export const getSettlement = (req, res) => {
  const contract = JSON.parse(req.query.contract);
  let startDate = new Date(contract[0].start_date);
  startDate = new Date(
    startDate.getTime() - startDate.getTimezoneOffset() * 60000
  );
  let endDate = new Date(contract[0].end_date);
  endDate = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000);
  const monthlyRecords = [];

  const jobScheduleQuery =
    "SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(IFNULL(monday_end, '00:00:00'), IFNULL(monday_start, '00:00:00'))))) AS monday, SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(IFNULL(tuesday_end, '00:00:00'), IFNULL(tuesday_start, '00:00:00'))))) AS tuesday, SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(IFNULL(wednesday_end, '00:00:00'), IFNULL(wednesday_start, '00:00:00'))))) AS wednesday, SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(IFNULL(thursday_end, '00:00:00'), IFNULL(thursday_start, '00:00:00'))))) AS thursday, SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(IFNULL(friday_end, '00:00:00'), IFNULL(friday_start, '00:00:00'))))) AS friday, SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(IFNULL(saturday_end, '00:00:00'), IFNULL(saturday_start, '00:00:00'))))) AS saturday, SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(IFNULL(sunday_end, '00:00:00'), IFNULL(sunday_start, '00:00:00'))))) AS sunday FROM job_schedule WHERE job_id = (SELECT job_id FROM jobs_assigment WHERE contract_id = ?)";
  const jobScheduleParams = [contract[0].contract_id];

  let currentDate = new Date(startDate);
  if (contract[0].contract_type === "Umowa o pracę tymczasową") {
    const existingSalaryQuery = "SELECT * FROM salaries WHERE user_id = ?";
    const existingSalaryParams = [req.params.id];
    db.query(
      jobScheduleQuery,
      jobScheduleParams,
      (jobScheduleErr, jobScheduleResult) => {
        if (jobScheduleErr) {
          res.status(500).send({ error: jobScheduleErr });
          return;
        }
        const jobSchedule = jobScheduleResult[0];

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
              let lastDayOfMonth = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                currentDate.getDate()
              );

              lastDayOfMonth > endDate
                ? (lastDayOfMonth = endDate)
                : (lastDayOfMonth = lastDayOfMonth);

              const dayCount = countWeekdays(currentDate, lastDayOfMonth);

              const multiplied = {};

              for (const day in jobSchedule) {
                const hours = jobSchedule[day];
                const number = dayCount[day];
                const multipliedHours = multiplyHours(hours, number);
                multiplied[day] = multipliedHours;
              }

              const hourRate = contract[0].rate;
              const monthlyRate =
                hourRate *
                (Number(multiplied.monday[0]) +
                  Number(multiplied.tuesday[0]) +
                  Number(multiplied.wednesday[0]) +
                  Number(multiplied.thursday[0]) +
                  Number(multiplied.friday[0]) +
                  Number(multiplied.saturday[0]) +
                  Number(multiplied.sunday[0]));

              const monthlyNettoRate =
                Math.floor(
                  (monthlyRate - monthlyRate * 0.24 - monthlyRate * 0.0775) *
                    100
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
                  contract_type: contract[0].contract_type,
                  contract_id: contract[0].contract_id,
                  user_id: contract[0].user_id,
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
      }
    );
  } else if (contract[0].contract_type === "Umowa o pracę na czas określony") {
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
          let lastDayOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            currentDate.getDate()
          );

          lastDayOfMonth > endDate
            ? (lastDayOfMonth = endDate)
            : (lastDayOfMonth = lastDayOfMonth);

          const monthlyRate = contract[0].rate;
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
              contract_type: contract[0].contract_type,
              contract_id: contract[0].contract_id,
              user_id: contract[0].user_id,
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
  } else if (contract[0].contract_type === "Umowa zlecenie") {
    const existingSalaryQuery = "SELECT * FROM salaries WHERE user_id = ?";
    const existingSalaryParams = [req.params.id];

    db.query(
      jobScheduleQuery,
      jobScheduleParams,
      (jobScheduleErr, jobScheduleResult) => {
        if (jobScheduleErr) {
          res.status(500).send({ error: jobScheduleErr });
          return;
        }
        const jobSchedule = jobScheduleResult[0];

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
              let lastDayOfMonth = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                currentDate.getDate()
              );

              lastDayOfMonth > endDate
                ? (lastDayOfMonth = endDate)
                : (lastDayOfMonth = lastDayOfMonth);

              const dayCount = countWeekdays(currentDate, lastDayOfMonth);

              const multiplied = {};

              for (const day in jobSchedule) {
                const hours = jobSchedule[day];
                const number = dayCount[day];
                const multipliedHours = multiplyHours(hours, number);
                multiplied[day] = multipliedHours;
              }

              const hourRate = contract[0].rate;
              const monthlyRate =
                hourRate *
                (Number(multiplied.monday[0]) +
                  Number(multiplied.tuesday[0]) +
                  Number(multiplied.wednesday[0]) +
                  Number(multiplied.thursday[0]) +
                  Number(multiplied.friday[0]) +
                  Number(multiplied.saturday[0]) +
                  Number(multiplied.sunday[0]));

              const monthlyNettoRate =
                Math.floor(
                  (monthlyRate - monthlyRate * 0.12 - monthlyRate * 0.0775) *
                    100
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
                  contract_type: contract[0].contract_type,
                  contract_id: contract[0].contract_id,
                  user_id: contract[0].user_id,
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
      }
    );
  } else if (contract[0].contract_type === "Umowa o dzieło") {
    const existingSalaryQuery = "SELECT * FROM salaries WHERE user_id = ?";
    const existingSalaryParams = [req.params.id];
    db.query(
      jobScheduleQuery,
      jobScheduleParams,
      (jobScheduleErr, jobScheduleResult) => {
        if (jobScheduleErr) {
          res.status(500).send({ error: jobScheduleErr });
          return;
        }
        const jobSchedule = jobScheduleResult[0];
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
              let lastDayOfMonth = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                currentDate.getDate()
              );

              lastDayOfMonth > endDate
                ? (lastDayOfMonth = endDate)
                : (lastDayOfMonth = lastDayOfMonth);

              const dayCount = countWeekdays(currentDate, lastDayOfMonth);

              const multiplied = {};

              for (const day in jobSchedule) {
                const hours = jobSchedule[day];
                const number = dayCount[day];
                const multipliedHours = multiplyHours(hours, number);
                multiplied[day] = multipliedHours;
              }

              const hourRate = contract[0].rate;
              const monthlyRate =
                hourRate *
                (Number(multiplied.monday[0]) +
                  Number(multiplied.tuesday[0]) +
                  Number(multiplied.wednesday[0]) +
                  Number(multiplied.thursday[0]) +
                  Number(multiplied.friday[0]) +
                  Number(multiplied.saturday[0]) +
                  Number(multiplied.sunday[0]));

              const monthlyNettoRate = monthlyRate;

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
                  contract_type: contract[0].contract_type,
                  contract_id: contract[0].contract_id,
                  user_id: contract[0].user_id,
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
      }
    );
  }
};

export const setSettle = (req, res) => {
  db.query(
    "INSERT INTO salaries (user_id, contract_id, from_date, to_date, salary_gross, salary_net, contract_type) VALUES (?,?,?,?,?,?,?)",
    [
      req.body.settle.user_id,
      req.body.settle.contract_id,
      new Date(req.body.start_date),
      new Date(req.body.end_date),
      req.body.settle.rate,
      req.body.settle.netto_rate,
      req.body.settle.contract_type,
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
  console.log(req.query.settle.start_date);
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

export const getSalaries = (req, res) => {
  db.query(
    "SELECT * FROM salaries WHERE user_id = ? ORDER BY to_date DESC",
    [req.params.id],
    (err, result) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.send(result);
      }
    }
  );
};
