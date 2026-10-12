const express = require("express");
const jwt = require("jsonwebtoken");
const { timingSafeEqual } = require("node:crypto");
const path = require("node:path");
const { db } = require("./db");
const app = express();
const PORT = process.env.PORT || 3000;
const SECRET =
  process.env.JWT_SECRET || "replace-this-secret-before-deployment";
app.use(express.json({ limit: "1mb" }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  );
  req.method === "OPTIONS" ? res.sendStatus(204) : next();
});
const safeUser = ({ id, role, name, username }) => ({
  id,
  role,
  name,
  username,
});
function verify(stored, password) {
  if (!stored) return false;
  const [salt, digest] = stored.split(":");
  const actual = require("node:crypto").scryptSync(password, salt, 64);
  const expected = Buffer.from(digest, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
function auth(req, res, next) {
  try {
    const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Please sign in to continue." });
  }
}
const allow =
  (...roles) =>
  (req, res, next) =>
    roles.includes(req.user.role)
      ? next()
      : res
          .status(403)
          .json({ error: "You do not have access to this action." });
const fail = (res, err) =>
  res.status(400).json({ error: err.message || "Invalid request." });
const rows = (sql, ...args) => {
  if (args.length === 1 && Array.isArray(args[0])) args = args[0];
  const count = (sql.match(/\?/g) || []).length;
  return db.prepare(sql).all(...args.slice(0, count));
};
const one = (sql, ...args) => db.prepare(sql).get(...args);
function choiceIndex(answer, optionCount) {
  if (answer === undefined || answer === null) return -1;
  const value = String(answer).trim();
  if (!/^(0|[1-9]\d*)$/.test(value)) return -1;
  const index = Number(value);
  return Number.isSafeInteger(index) && index < optionCount ? index : -1;
}
function isCorrectAnswer(question, answer) {
  if (answer === undefined || answer === null) return false;
  if (question.question_type === "text") {
    const normalize = (value) => String(value).normalize("NFC").trim().toLocaleLowerCase();
    const submitted = normalize(answer);
    const expected = normalize(question.correct_answer || "");
    return submitted.length > 0 && expected.length > 0 && submitted === expected;
  }
  let optionCount = 0;
  try { optionCount = JSON.parse(question.options || "[]").length; } catch {}
  const selected = choiceIndex(answer, optionCount);
  return selected >= 0 && selected === Number(question.correct_index);
}
app.get("/api/health", (req, res) =>
  res.json({ status: "ok", app: "MySchool API" }),
);
app.post("/api/auth/login", (req, res) => {
  const { username, password, role } = req.body || {};
  const user = one(
    "SELECT * FROM users WHERE username=?",
    String(username || "").trim(),
  );
  if (
    !user ||
    !verify(user.password_hash, String(password || "")) ||
    (role && role !== user.role)
  )
    return res
      .status(401)
      .json({ error: "Check your role, username, and password." });
  const profile = safeUser(user);
  res.json({
    token: jwt.sign(profile, SECRET, { expiresIn: "12h" }),
    user: profile,
  });
});
app.get("/api/auth/me", auth, (req, res) =>
  res.json({
    user: safeUser(one("SELECT * FROM users WHERE id=?", req.user.id)),
  }),
);
app.get("/api/dashboard", auth, (req, res) => {
  const user = req.user;
  const counts = {
    students: one("SELECT COUNT(*) n FROM users WHERE role='student'").n,
    teachers: one("SELECT COUNT(*) n FROM users WHERE role='teacher'").n,
    classes: one("SELECT COUNT(*) n FROM classes").n,
    quizzes: one("SELECT COUNT(*) n FROM quizzes WHERE status='published'").n,
  };
  if (user.role === "student") {
    counts.quizzes = one(
      "SELECT COUNT(*) n FROM quizzes q JOIN student_classes sc ON sc.class_id=q.class_id WHERE sc.student_id=? AND q.status='published' AND NOT EXISTS(SELECT 1 FROM attempts a WHERE a.quiz_id=q.id AND a.student_id=? AND a.submitted_at IS NOT NULL)",
      user.id,
      user.id,
    ).n;
  }
  const quizzes =
    user.role === "student"
      ? rows(
          "SELECT q.id,q.title,q.status,s.title subject,c.title class_name,u.name teacher FROM quizzes q LEFT JOIN subjects s ON s.id=q.subject_id LEFT JOIN classes c ON c.id=q.class_id LEFT JOIN users u ON u.id=q.teacher_id JOIN student_classes sc ON sc.class_id=q.class_id WHERE sc.student_id=? AND q.status='published' AND NOT EXISTS(SELECT 1 FROM attempts a WHERE a.quiz_id=q.id AND a.student_id=? AND a.submitted_at IS NOT NULL) ORDER BY q.id DESC",
          user.id,
          user.id,
        )
      : user.role === "teacher"
        ? rows(
            "SELECT q.id,q.title,q.status,s.title subject,c.title class_name FROM quizzes q LEFT JOIN subjects s ON s.id=q.subject_id LEFT JOIN classes c ON c.id=q.class_id WHERE q.teacher_id=? ORDER BY q.id DESC",
            user.id,
          )
        : rows(
            "SELECT q.id,q.title,q.status,s.title subject,c.title class_name,u.name teacher FROM quizzes q LEFT JOIN subjects s ON s.id=q.subject_id LEFT JOIN classes c ON c.id=q.class_id LEFT JOIN users u ON u.id=q.teacher_id ORDER BY q.id DESC LIMIT 8",
          );
  const classes =
    user.role === "teacher"
      ? rows(
          "SELECT c.id,c.title,c.color FROM classes c JOIN teacher_classes tc ON tc.class_id=c.id WHERE tc.teacher_id=?",
          user.id,
        )
      : user.role === "student"
        ? rows(
            "SELECT c.id,c.title,c.color FROM classes c JOIN student_classes sc ON sc.class_id=c.id WHERE sc.student_id=?",
            user.id,
          )
        : rows("SELECT * FROM classes ORDER BY title");
  res.json({
    counts,
    quizzes,
    classes,
    results: rows(
      user.role === "student"
        ? "SELECT a.id,a.score,a.submitted_at,q.title quiz FROM attempts a JOIN quizzes q ON q.id=a.quiz_id WHERE a.student_id=? AND a.submitted_at IS NOT NULL ORDER BY a.id DESC"
        : "SELECT a.id,a.score,a.submitted_at,q.title quiz,u.name student FROM attempts a JOIN quizzes q ON q.id=a.quiz_id JOIN users u ON u.id=a.student_id WHERE a.submitted_at IS NOT NULL ORDER BY a.id DESC LIMIT 12",
      user.id,
    ),
  });
});
app.get("/api/classes", auth, (req, res) => {
  const sql =
    req.user.role === "teacher"
      ? "SELECT c.* FROM classes c JOIN teacher_classes t ON c.id=t.class_id WHERE t.teacher_id=?"
      : req.user.role === "student"
        ? "SELECT c.* FROM classes c JOIN student_classes s ON c.id=s.class_id WHERE s.student_id=?"
        : "SELECT * FROM classes ORDER BY title";
  res.json(rows(sql, ...(req.user.role === "admin" ? [] : [req.user.id])));
});
app.post("/api/classes", auth, allow("admin"), (req, res) => {
  try {
    const r = db
      .prepare("INSERT INTO classes(title,color) VALUES(?,?)")
      .run(req.body.title, req.body.color || "#6f7cff");
    res
      .status(201)
      .json(one("SELECT * FROM classes WHERE id=?", Number(r.lastInsertRowid)));
  } catch (e) {
    fail(res, e);
  }
});
app.patch("/api/classes/:id", auth, allow("admin"), (req, res) => {
  try {
    db.prepare("UPDATE classes SET title=?,color=? WHERE id=?").run(
      req.body.title,
      req.body.color || "#6f7cff",
      req.params.id,
    );
    res.json(one("SELECT * FROM classes WHERE id=?", req.params.id));
  } catch (e) {
    fail(res, e);
  }
});
app.delete("/api/classes/:id", auth, allow("admin"), (req, res) => {
  db.prepare("DELETE FROM classes WHERE id=?").run(req.params.id);
  res.sendStatus(204);
});
app.get("/api/classes/:id/students", auth, (req, res) => {
  const classId = Number(req.params.id);
  if (!one("SELECT 1 FROM classes WHERE id=?", classId)) return res.sendStatus(404);
  if (req.user.role === "teacher" && !one("SELECT 1 FROM teacher_classes WHERE teacher_id=? AND class_id=?", req.user.id, classId))
    return res.sendStatus(403);
  if (req.user.role === "student" && !one("SELECT 1 FROM student_classes WHERE student_id=? AND class_id=?", req.user.id, classId))
    return res.sendStatus(403);
  res.json(rows("SELECT u.id,u.name,u.school_code,u.school_code AS student_code FROM users u JOIN student_classes sc ON sc.student_id=u.id WHERE sc.class_id=? AND u.role='student' ORDER BY u.name", classId));
});
app.get("/api/subjects", auth, (req, res) =>
  res.json(
    req.user.role === "teacher"
      ? rows(
          "SELECT s.* FROM subjects s JOIN teacher_subjects t ON s.id=t.subject_id WHERE t.teacher_id=?",
          req.user.id,
        )
      : req.user.role === "student"
        ? rows(
            "SELECT DISTINCT s.* FROM subjects s JOIN quizzes q ON q.subject_id=s.id JOIN student_classes sc ON sc.class_id=q.class_id WHERE sc.student_id=? AND q.status='published'",
            req.user.id,
          )
        : rows("SELECT s.*,COALESCE(GROUP_CONCAT(DISTINCT u.name), '') teacher_names FROM subjects s LEFT JOIN teacher_subjects ts ON ts.subject_id=s.id LEFT JOIN users u ON u.id=ts.teacher_id GROUP BY s.id ORDER BY s.title"),
  ),
);
app.post("/api/subjects", auth, allow("admin"), (req, res) => {
  try {
    const r = db
      .prepare("INSERT INTO subjects(title,color) VALUES(?,?)")
      .run(req.body.title, req.body.color || "#35c8a0");
    res
      .status(201)
      .json(
        one("SELECT * FROM subjects WHERE id=?", Number(r.lastInsertRowid)),
      );
  } catch (e) {
    fail(res, e);
  }
});
app.patch("/api/subjects/:id", auth, allow("admin"), (req, res) => {
  try {
    db.prepare("UPDATE subjects SET title=?,color=? WHERE id=?").run(
      req.body.title,
      req.body.color || "#35c8a0",
      req.params.id,
    );
    res.json(one("SELECT * FROM subjects WHERE id=?", req.params.id));
  } catch (e) {
    fail(res, e);
  }
});
app.delete("/api/subjects/:id", auth, allow("admin"), (req, res) => {
  db.prepare("DELETE FROM subjects WHERE id=?").run(req.params.id);
  res.sendStatus(204);
});
app.get("/api/users", auth, allow("admin"), (req, res) => {
  const role = req.query.role || "student";
  if (!["student", "teacher"].includes(role))
    return res.status(400).json({ error: "Choose students or teachers." });
  res.json(
    rows(
      role === "student"
        ? "SELECT u.id,u.role,u.name,u.username,u.school_code,u.phone,COALESCE(GROUP_CONCAT(DISTINCT c.id), '') class_ids,COALESCE(GROUP_CONCAT(DISTINCT c.title), '') class_names FROM users u LEFT JOIN student_classes sc ON sc.student_id=u.id LEFT JOIN classes c ON c.id=sc.class_id WHERE u.role=? GROUP BY u.id ORDER BY u.name"
        : "SELECT u.id,u.role,u.name,u.username,u.school_code,u.phone,COALESCE(GROUP_CONCAT(DISTINCT c.id), '') class_ids,COALESCE(GROUP_CONCAT(DISTINCT c.title), '') class_names,COALESCE(GROUP_CONCAT(DISTINCT s.id), '') subject_ids,COALESCE(GROUP_CONCAT(DISTINCT s.title), '') subject_names FROM users u LEFT JOIN teacher_classes tc ON tc.teacher_id=u.id LEFT JOIN classes c ON c.id=tc.class_id LEFT JOIN teacher_subjects ts ON ts.teacher_id=u.id LEFT JOIN subjects s ON s.id=ts.subject_id WHERE u.role=? GROUP BY u.id ORDER BY u.name",
      role,
    ),
  );
});
app.post("/api/users", auth, allow("admin"), (req, res) => {
  try {
    const { role, name, username, password, class_id, class_ids, school_code, phone } =
      req.body;
    if (!["teacher", "student"].includes(role))
      throw Error("Choose teacher or student.");
    if (String(password || "").length < 6)
      throw Error("Set a password with at least 6 characters.");
    const assignments = Array.isArray(class_ids) ? class_ids : (class_id ? [class_id] : []);
    const subjects = req.body.subject_id ? [Number(req.body.subject_id)] : (Array.isArray(req.body.subject_ids) ? [...new Set(req.body.subject_ids.map(Number))] : []);
    if (role === "teacher" && subjects.length !== 1)
      throw Error("Assign exactly one subject to this teacher.");
    if (role === "teacher" && assignments.length === 0)
      throw Error("Assign at least one class to this teacher.");
    if (role === "student" && assignments.length > 1)
      throw Error("A student can be assigned to one class only.");
    if (assignments.some((id) => !one("SELECT 1 FROM classes WHERE id=?", Number(id))))
      throw Error("Choose a valid class for every assignment.");
    if (role === "teacher" && subjects.some((id) => !one("SELECT 1 FROM subjects WHERE id=?", id)))
      throw Error("Choose valid subjects for this teacher.");
    db.exec("BEGIN");
    const r = db.prepare(
      "INSERT INTO users(role,name,username,password_hash,school_code,phone) VALUES(?,?,?,?,?,?)",
    ).run(role, name, username, require("./db").hash(password), school_code || null, phone || null);
    const id = Number(r.lastInsertRowid);
    if (assignments.length) {
      const table = role === "student" ? "student_classes" : "teacher_classes";
      const key = role === "student" ? "student_id" : "teacher_id";
      const insert = db.prepare(`INSERT OR IGNORE INTO ${table}(${key},class_id) VALUES(?,?)`);
      assignments.forEach((classId) => insert.run(id, Number(classId)));
    }
    if (role === "teacher") {
      const insertSubject = db.prepare("INSERT OR IGNORE INTO teacher_subjects(teacher_id,subject_id) VALUES(?,?)");
      subjects.forEach((subjectId) => insertSubject.run(id, subjectId));
    }
    db.exec("COMMIT");
    res.status(201).json(safeUser(one("SELECT * FROM users WHERE id=?", id)));
  } catch (e) {
    try { db.exec("ROLLBACK"); } catch {}
    fail(res, e);
  }
});
app.put("/api/users/:id/classes", auth, allow("admin"), (req, res) => {
  const account = one("SELECT id,role FROM users WHERE id=? AND role IN ('student','teacher')", req.params.id);
  if (!account) return res.status(404).json({ error: "Account not found." });
  const classIds = [...new Set((req.body.class_ids || []).map(Number).filter(Number.isInteger))];
  if (account.role === "student" && classIds.length > 1)
    return res.status(400).json({ error: "A student can be assigned to one class only." });
  if (account.role === "teacher" && classIds.length === 0)
    return res.status(400).json({ error: "Assign at least one class to this teacher." });
  if (classIds.some((id) => !one("SELECT 1 FROM classes WHERE id=?", id)))
    return res.status(400).json({ error: "Choose valid classes." });
  const table = account.role === "student" ? "student_classes" : "teacher_classes";
  const key = account.role === "student" ? "student_id" : "teacher_id";
  try {
    db.exec("BEGIN");
    db.prepare(`DELETE FROM ${table} WHERE ${key}=?`).run(account.id);
    const add = db.prepare(`INSERT OR IGNORE INTO ${table}(${key},class_id) SELECT ?,? WHERE EXISTS(SELECT 1 FROM classes WHERE id=?)`);
    classIds.forEach((id) => add.run(account.id, id, id));
    db.exec("COMMIT");
    res.json({ ok: true });
  } catch (e) {
    try { db.exec("ROLLBACK"); } catch {}
    fail(res, e);
  }
});
app.put("/api/users/:id/subjects", auth, allow("admin"), (req, res) => {
  const teacher = one("SELECT id FROM users WHERE id=? AND role='teacher'", req.params.id);
  if (!teacher) return res.status(404).json({ error: "Teacher not found." });
  const subjectIds = req.body.subject_id ? [Number(req.body.subject_id)] : [...new Set((req.body.subject_ids || []).map(Number).filter(Number.isInteger))];
  if (subjectIds.length !== 1) return res.status(400).json({ error: "Assign exactly one subject to this teacher." });
  if (subjectIds.some((id) => !one("SELECT 1 FROM subjects WHERE id=?", id)))
    return res.status(400).json({ error: "Choose valid subjects." });
  try {
    db.exec("BEGIN");
    db.prepare("DELETE FROM teacher_subjects WHERE teacher_id=?").run(teacher.id);
    const add = db.prepare("INSERT OR IGNORE INTO teacher_subjects(teacher_id,subject_id) VALUES(?,?)");
    subjectIds.forEach((id) => add.run(teacher.id, id));
    db.exec("COMMIT");
    res.json({ ok: true });
  } catch (e) {
    try { db.exec("ROLLBACK"); } catch {}
    fail(res, e);
  }
});
app.patch("/api/users/:id", auth, allow("admin"), (req, res) => {
  try {
    const u = one("SELECT * FROM users WHERE id=?", req.params.id);
    if (!u) return res.sendStatus(404);
    const values = [req.body.name || u.name, req.body.username || u.username, req.body.school_code ?? u.school_code, req.body.phone ?? u.phone];
    let query = "UPDATE users SET name=?,username=?,school_code=?,phone=?";
    if (req.body.password) {
      query += ",password_hash=?";
      values.push(require("./db").hash(String(req.body.password)));
    }
    query += " WHERE id=?";
    values.push(req.params.id);
    db.prepare(query).run(...values);
    res.json(safeUser(one("SELECT * FROM users WHERE id=?", req.params.id)));
  } catch (e) {
    fail(res, e);
  }
});
app.delete("/api/users/:id", auth, allow("admin"), (req, res) => {
  if (Number(req.params.id) === req.user.id)
    return res
      .status(400)
      .json({ error: "You cannot delete your signed-in account." });
  const target = one("SELECT id,role FROM users WHERE id=?", req.params.id);
  if (!target) return res.sendStatus(204);
  try {
    db.exec("BEGIN");
    if (target.role === "teacher") {
      db.prepare("DELETE FROM answers WHERE attempt_id IN (SELECT a.id FROM attempts a JOIN quizzes q ON q.id=a.quiz_id WHERE q.teacher_id=?)").run(target.id);
      db.prepare("DELETE FROM attempts WHERE quiz_id IN (SELECT id FROM quizzes WHERE teacher_id=?)").run(target.id);
      db.prepare("DELETE FROM quizzes WHERE teacher_id=?").run(target.id);
    } else if (target.role === "student") {
      db.prepare("DELETE FROM answers WHERE attempt_id IN (SELECT id FROM attempts WHERE student_id=?)").run(target.id);
      db.prepare("DELETE FROM attempts WHERE student_id=?").run(target.id);
    }
    db.prepare("DELETE FROM users WHERE id=?").run(target.id);
    db.exec("COMMIT");
    res.sendStatus(204);
  } catch (e) {
    try { db.exec("ROLLBACK"); } catch {}
    fail(res, e);
  }
});
app.get("/api/quizzes", auth, (req, res) => {
  const q =
    req.user.role === "student"
      ? "SELECT q.*,s.title subject,c.title class_name,u.name teacher FROM quizzes q LEFT JOIN subjects s ON s.id=q.subject_id LEFT JOIN classes c ON c.id=q.class_id LEFT JOIN users u ON u.id=q.teacher_id JOIN student_classes sc ON sc.class_id=q.class_id WHERE sc.student_id=? AND q.status='published' AND NOT EXISTS(SELECT 1 FROM attempts a WHERE a.quiz_id=q.id AND a.student_id=? AND a.submitted_at IS NOT NULL)"
      : req.user.role === "teacher"
        ? "SELECT q.*,s.title subject,c.title class_name FROM quizzes q LEFT JOIN subjects s ON s.id=q.subject_id LEFT JOIN classes c ON c.id=q.class_id WHERE q.teacher_id=?"
        : "SELECT q.*,s.title subject,c.title class_name,u.name teacher FROM quizzes q LEFT JOIN subjects s ON s.id=q.subject_id LEFT JOIN classes c ON c.id=q.class_id LEFT JOIN users u ON u.id=q.teacher_id";
  res.json(rows(q, req.user.role === "admin" ? [] : req.user.role === "student" ? [req.user.id, req.user.id] : [req.user.id]));
});
app.post("/api/quizzes", auth, allow("teacher"), (req, res) => {
  try {
    const { title, subject_id, class_id, questions = [] } = req.body;
    if (
      req.user.role === "teacher" &&
      !one(
        "SELECT 1 FROM teacher_classes WHERE teacher_id=? AND class_id=?",
        req.user.id,
        class_id,
      )
    )
      return res
        .status(403)
        .json({ error: "You can only create quizzes for an assigned class." });
    if (
      req.user.role === "teacher" &&
      subject_id &&
      !one(
        "SELECT 1 FROM teacher_subjects WHERE teacher_id=? AND subject_id=?",
        req.user.id,
        subject_id,
      )
    )
      return res
        .status(403)
        .json({ error: "You can only use an assigned subject." });
    const tx = db
      .prepare(
        "INSERT INTO quizzes(title,teacher_id,subject_id,class_id,status) VALUES(?,?,?,?,?)",
      )
      .run(title, req.user.id, subject_id || null, class_id || null, "draft");
    const id = Number(tx.lastInsertRowid);
    const insert = db.prepare(
      "INSERT INTO questions(quiz_id,question_text,options,correct_index,order_index,question_type,correct_answer) VALUES(?,?,?,?,?,?,?)",
    );
    questions.forEach((x, i) =>
      insert.run(
        id,
        x.question_text,
        JSON.stringify(x.options || []),
        Number(x.correct_index) || 0,
        i,
        x.question_type === "text" ? "text" : "choice",
        String(x.correct_answer || ""),
      ),
    );
    res.status(201).json(one("SELECT * FROM quizzes WHERE id=?", id));
  } catch (e) {
    fail(res, e);
  }
});
app.patch("/api/quizzes/:id", auth, allow("teacher"), (req, res) => {
  const q = one("SELECT * FROM quizzes WHERE id=?", req.params.id);
  if (!q) return res.sendStatus(404);
  if (req.user.role === "teacher" && q.teacher_id !== req.user.id)
    return res.sendStatus(403);
  const classId = req.body.class_id || q.class_id,
    subjectId = req.body.subject_id || q.subject_id;
  if (
    req.user.role === "teacher" &&
    !one(
      "SELECT 1 FROM teacher_classes WHERE teacher_id=? AND class_id=?",
      req.user.id,
      classId,
    )
  )
    return res
      .status(403)
      .json({ error: "You can only use an assigned class." });
  if (
    req.user.role === "teacher" &&
    subjectId &&
    !one(
      "SELECT 1 FROM teacher_subjects WHERE teacher_id=? AND subject_id=?",
      req.user.id,
      subjectId,
    )
  )
    return res
      .status(403)
      .json({ error: "You can only use an assigned subject." });
  db.prepare(
    "UPDATE quizzes SET title=?,status=?,subject_id=?,class_id=? WHERE id=?",
  ).run(
    req.body.title || q.title,
    req.body.status || q.status,
    subjectId,
    classId,
    q.id,
  );
  res.json(one("SELECT * FROM quizzes WHERE id=?", q.id));
});
app.delete("/api/quizzes/:id", auth, allow("teacher"), (req, res) => {
  const q = one("SELECT * FROM quizzes WHERE id=?", req.params.id);
  if (q && req.user.role === "teacher" && q.teacher_id !== req.user.id)
    return res.sendStatus(403);
  db.prepare("DELETE FROM quizzes WHERE id=?").run(req.params.id);
  res.sendStatus(204);
});
app.get("/api/quizzes/:id", auth, (req, res) => {
  const quiz = one(
    "SELECT q.*,s.title subject,c.title class_name FROM quizzes q LEFT JOIN subjects s ON s.id=q.subject_id LEFT JOIN classes c ON c.id=q.class_id WHERE q.id=?",
    req.params.id,
  );
  if (!quiz) return res.sendStatus(404);
  if (req.user.role === "teacher" && quiz.teacher_id !== req.user.id)
    return res.sendStatus(403);
  if (
    req.user.role === "student" &&
    (quiz.status !== "published" ||
      !one(
        "SELECT 1 FROM student_classes WHERE student_id=? AND class_id=?",
        req.user.id,
        quiz.class_id,
      ) || one("SELECT 1 FROM attempts WHERE quiz_id=? AND student_id=? AND submitted_at IS NOT NULL", quiz.id, req.user.id))
  )
    return res.sendStatus(404);
  const questions = rows(
    req.user.role === "teacher"
      ? "SELECT id,question_text,options,order_index,question_type,correct_answer FROM questions WHERE quiz_id=? ORDER BY order_index"
      : "SELECT id,question_text,options,order_index,question_type FROM questions WHERE quiz_id=? ORDER BY order_index",
    quiz.id,
  ).map((q) => ({ ...q, options: JSON.parse(q.options) }));
  res.json({ ...quiz, questions });
});
app.post("/api/quizzes/:id/submit", auth, allow("student"), (req, res) => {
  try {
    const quiz = one(
      "SELECT * FROM quizzes WHERE id=? AND status='published'",
      req.params.id,
    );
    if (
      !quiz ||
      !one(
        "SELECT 1 FROM student_classes WHERE student_id=? AND class_id=?",
        req.user.id,
        quiz.class_id,
      )
    )
      return res.sendStatus(404);
    if (one("SELECT 1 FROM attempts WHERE quiz_id=? AND student_id=? AND submitted_at IS NOT NULL", quiz.id, req.user.id))
      return res.status(409).json({ error: "You have already submitted this quiz." });
    const questions = rows(
      "SELECT id,options,correct_index,question_type,correct_answer FROM questions WHERE quiz_id=?",
      quiz.id,
    );
    if (!questions.length)
      return res.status(400).json({ error: "This quiz has no questions to score." });
    const answers = req.body.answers || {};
    const scoredQuestions = questions.map((question) => ({
      question,
      isCorrect: isCorrectAnswer(question, answers[question.id]),
    }));
    const score = scoredQuestions.filter(({ isCorrect }) => isCorrect).length;
    const ratio = Math.round((score / questions.length) * 100);
    const attemptId = Number(
      db.prepare("INSERT INTO attempts(quiz_id,student_id,submitted_at,score) VALUES(?,?,CURRENT_TIMESTAMP,?)")
        .run(quiz.id, req.user.id, ratio).lastInsertRowid,
    );
    const ins = db.prepare(
      "INSERT INTO answers(attempt_id,question_id,selected_index,is_correct) VALUES(?,?,?,?)",
    );
    scoredQuestions.forEach(({ question: q, isCorrect }) =>
      ins.run(
        attemptId,
        q.id,
        q.question_type === "text" ? -1 : choiceIndex(answers[q.id], JSON.parse(q.options || "[]").length),
        Number(isCorrect),
      ),
    );
    res.json({ score: ratio, correct: score, total: questions.length });
  } catch (e) {
    fail(res, e);
  }
});
app.get("/api/results", auth, (req, res) => {
  const sql =
    req.user.role === "student"
      ? "SELECT a.id,a.quiz_id,a.score,a.submitted_at,q.title quiz,s.title subject FROM attempts a JOIN quizzes q ON q.id=a.quiz_id LEFT JOIN subjects s ON s.id=q.subject_id WHERE a.student_id=? AND a.submitted_at IS NOT NULL ORDER BY a.submitted_at DESC"
      : req.user.role === "teacher"
        ? "SELECT a.id,a.score,a.submitted_at,q.title quiz,u.name student,t.name teacher FROM attempts a JOIN quizzes q ON q.id=a.quiz_id JOIN users u ON u.id=a.student_id LEFT JOIN users t ON t.id=q.teacher_id WHERE q.teacher_id=? AND a.submitted_at IS NOT NULL ORDER BY a.submitted_at DESC"
        : "SELECT a.id,a.score,a.submitted_at,q.title quiz,u.name student,t.name teacher FROM attempts a JOIN quizzes q ON q.id=a.quiz_id JOIN users u ON u.id=a.student_id LEFT JOIN users t ON t.id=q.teacher_id WHERE a.submitted_at IS NOT NULL ORDER BY a.submitted_at DESC";
  res.json(rows(sql, req.user.role === "admin" ? [] : [req.user.id]));
});
app.get("/api/results/overview", auth, allow("teacher", "admin"), (req, res) => {
  const teacherView = req.user.role === "teacher";
  const classes = teacherView
    ? rows("SELECT c.id,c.title FROM classes c JOIN teacher_classes tc ON tc.class_id=c.id WHERE tc.teacher_id=? ORDER BY c.title", req.user.id)
    : rows("SELECT id,title FROM classes ORDER BY title");
  const students = teacherView
    ? rows("SELECT u.id student_id,u.name student,u.school_code student_code,c.id class_id,c.title class_name FROM users u JOIN student_classes sc ON sc.student_id=u.id JOIN classes c ON c.id=sc.class_id JOIN teacher_classes tc ON tc.class_id=c.id WHERE u.role='student' AND tc.teacher_id=? ORDER BY c.title,u.name", req.user.id)
    : rows("SELECT u.id student_id,u.name student,u.school_code student_code,c.id class_id,c.title class_name FROM users u JOIN student_classes sc ON sc.student_id=u.id JOIN classes c ON c.id=sc.class_id WHERE u.role='student' ORDER BY c.title,u.name");
  const quizSql = "SELECT q.id,q.title,q.class_id,q.teacher_id,c.title class_name,s.title subject,t.name teacher FROM quizzes q JOIN classes c ON c.id=q.class_id LEFT JOIN subjects s ON s.id=q.subject_id LEFT JOIN users t ON t.id=q.teacher_id WHERE (q.status='published' OR EXISTS(SELECT 1 FROM attempts a WHERE a.quiz_id=q.id AND a.submitted_at IS NOT NULL))";
  const quizzes = teacherView
    ? rows(`${quizSql} AND q.teacher_id=? ORDER BY q.title`, req.user.id)
    : rows(`${quizSql} ORDER BY q.title`);
  const attempts = teacherView
    ? rows("SELECT a.id,a.quiz_id,a.student_id,a.score,a.submitted_at FROM attempts a JOIN quizzes q ON q.id=a.quiz_id WHERE a.submitted_at IS NOT NULL AND q.teacher_id=? ORDER BY a.submitted_at DESC", req.user.id)
    : rows("SELECT a.id,a.quiz_id,a.student_id,a.score,a.submitted_at FROM attempts a JOIN quizzes q ON q.id=a.quiz_id WHERE a.submitted_at IS NOT NULL ORDER BY a.submitted_at DESC");
  const teachers = teacherView ? [] : rows("SELECT id,name FROM users WHERE role='teacher' ORDER BY name");
  res.json({ classes, students, quizzes, attempts, teachers });
});
const frontend = (name) => path.join(__dirname, "..", "apps", name, "dist");
app.use("/teacher", express.static(frontend("teacher")));
app.get(/^\/teacher(?:\/.*)?$/, (_req, res) =>
  res.sendFile(path.join(frontend("teacher"), "index.html")),
);
app.use("/admin", express.static(frontend("admin")));
app.get(/^\/admin(?:\/.*)?$/, (_req, res) =>
  res.sendFile(path.join(frontend("admin"), "index.html")),
);
app.use(express.static(frontend("student")));
app.get(/^\/(?!api(?:\/|$)).*/, (_req, res) =>
  res.sendFile(path.join(frontend("student"), "index.html")),
);
app.listen(PORT, () =>
  console.log(`MySchool API listening on http://localhost:${PORT}`),
);
