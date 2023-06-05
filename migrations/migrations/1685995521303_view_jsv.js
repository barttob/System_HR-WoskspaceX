module.exports = {
  up: "CREATE VIEW job_schedule_view AS SELECT j.job_id, j.client_id,j.name,j.description,j.emp_quantity,j.start_date,j.end_date,j.status,js.monday_start,js.monday_end,js.tuesday_start,js.tuesday_end,js.wednesday_start,js.wednesday_end,js.thursday_start,js.thursday_end,js.friday_start,js.friday_end,js.saturday_start,js.saturday_end,js.sunday_start,js.sunday_end FROM jobs j INNER JOIN job_schedule js ON j.job_id = js.job_id;",
  down: "DROP VIEW IF EXISTS `job_schedule_view`;",
};
