import { db } from "../connect.js";
/*
export const getEvents = (req, res) => {
  db.query(
    "SELECT * FROM calendar WHERE user_id = ?",
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
*/

export const getApplications = (req, res) => {
  db.query(
    "SELECT c.event_name, c.event_desc, c.event_date_start, c.event_date_end, a.app_type, a.app_desc, a.from_date, a.to_date FROM emp_applications AS a LEFT JOIN calendar AS c ON c.user_id = a.user_id WHERE a.user_id = ? AND a.approved = TRUE",
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

export const dodZwolnienie = (req, res) => {
  db.query(
    "INSERT INTO emp_applications (app_type, from_date, to_date, app_desc, user_id) VALUES (?,?,?,?,?)",
    [
      req.body.appInputs.app_type,
      req.body.fromDate,
      req.body.toDate,
      req.body.appInputs.app_desc,
      req.body.user_id,
    ],
    (err, result) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.send(result);
      }
    }
  );
};

export const addSchedule = (req, res) => {
  db.query(
    "INSERT INTO job_schedule (job_id, monday_start, monday_end, tuesday_start, tuesday_end, wednesday_start, wednesday_end, thursday_start, thursday_end, friday_start, friday_end, saturday_start, saturday_end, sunday_start, sunday_end) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      req.params.id,
      req.body.monday_start,
      req.body.monday_end,
      req.body.tuesday_start,
      req.body.tuesday_end,
      req.body.wednesday_start,
      req.body.wednesday_end,
      req.body.thursday_start,
      req.body.thursday_end,
      req.body.friday_start,
      req.body.friday_end,
      req.body.saturday_start,
      req.body.saturday_end,
      req.body.sunday_start,
      req.body.sunday_end,
    ],
    (err, result) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.send(result);
      }
    }
  );
};

export const getJobSchedule = (req, res) => {
  db.query(
    "SELECT * FROM job_schedule_view WHERE job_id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        const { start_date, end_date } = result[0];
        const jobSchedule = [];
        let currentDate = new Date(start_date);
        const endDate = new Date(end_date);

        while (currentDate <= endDate) {
          const dayOfWeek = currentDate.toLocaleDateString("en-US", {
            weekday: "long",
          });
          const dayOfWeekStart = dayOfWeek.toLowerCase().concat("_start");
          const dayOfWeekEnd = dayOfWeek.toLowerCase().concat("_end");

          const startTime = new Date(currentDate);
          startTime.setHours(result[0][dayOfWeekStart].slice(0, 2));
          startTime.setMinutes(result[0][dayOfWeekStart].slice(0, 2));

          const endTime = new Date(currentDate);
          endTime.setHours(result[0][dayOfWeekEnd].slice(0, 2));
          endTime.setMinutes(result[0][dayOfWeekEnd].slice(0, 2));

          if (startTime.getTime() != endTime.getTime()) {
            const dailySchedule = {
              day: dayOfWeek,
              schedule: {
                start: startTime,
                end: endTime,
              },
            };
            jobSchedule.push(dailySchedule);
          }

          currentDate.setDate(currentDate.getDate() + 1);
        }
        res.send(jobSchedule);
      }
    }
  );
};

export const getUserJobSchedule = (req, res) => {
  db.query(
    "SELECT * FROM job_schedule_view WHERE job_id = (SELECT job_id FROM jobs_assigment WHERE user_id = ? ORDER BY add_date DESC LIMIT 1)",
    [req.params.id],
    (err, result) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        const { start_date, end_date } = result[0];
        const jobSchedule = [];
        let currentDate = new Date(start_date);
        const endDate = new Date(end_date);

        while (currentDate <= endDate) {
          const dayOfWeek = currentDate.toLocaleDateString("en-US", {
            weekday: "long",
          });
          const dayOfWeekStart = dayOfWeek.toLowerCase().concat("_start");
          const dayOfWeekEnd = dayOfWeek.toLowerCase().concat("_end");

          const startTime = new Date(currentDate);
          startTime.setHours(result[0][dayOfWeekStart].slice(0, 2));
          startTime.setMinutes(result[0][dayOfWeekStart].slice(0, 2));

          const endTime = new Date(currentDate);
          endTime.setHours(result[0][dayOfWeekEnd].slice(0, 2));
          endTime.setMinutes(result[0][dayOfWeekEnd].slice(0, 2));

          if (startTime.getTime() != endTime.getTime()) {
            const dailySchedule = {
              day: dayOfWeek,
              schedule: {
                start: startTime,
                end: endTime,
              },
            };
            jobSchedule.push(dailySchedule);
          }

          currentDate.setDate(currentDate.getDate() + 1);
        }
        res.send(jobSchedule);
      }
    }
  );
};
