import { db } from "../connect.js";

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
            "SELECT * FROM jobs WHERE job_id = (SELECT job_id FROM jobs_assigment WHERE contract_id = ? ORDER BY add_date DESC LIMIT 1)",
            [result[0].contract_id],
            (err, subResult) => {
              if (err) {
                res.status(500).send({ error: err.message });
              } else {
                result[0].rate =
                  subResult[0].emp_rate *
                  getBusinessDays(
                    new Date(result[0].start_date),
                    new Date(result[0].end_date)
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
          result[0].rate *=
            getBusinessDays(
              new Date(result[0].start_date),
              new Date(result[0].end_date)
            ) * 8;
          result[0].netto_rate = result[0].rate;
          res.send(result);
        }
      }
    }
  );
};
