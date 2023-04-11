import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const acl = require("../config/acl.json");

export function aclAuth(role) {
  return function (req, res, next) {
    const method = req.method;
    const resource = req.originalUrl.replace(req.path, req.route.path);
    const permission = `${method}:${resource}`;
    const allowed = acl[role].permissions.includes(permission);
    if (allowed) {
      next();
    } else {
      res.status(403).send("Forbidden");
    }
  };
}
