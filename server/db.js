const { DatabaseSync } = require("node:sqlite");
const { randomBytes, scryptSync } = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const dataDir = path.join(__dirname, "data");
fs.mkdirSync(dataDir, { recursive: true });
const db = new DatabaseSync(path.join(dataDir, "myschool.sqlite"));
db.exec("PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;");
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY, role TEXT NOT NULL CHECK(role IN ('admin','teacher','student')),
  name TEXT NOT NULL, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL,
  school_code TEXT, phone TEXT
);
CREATE TABLE IF NOT EXISTS classes (id INTEGER PRIMARY KEY, title TEXT NOT NULL, color TEXT DEFAULT '#6f7cff');
CREATE TABLE IF NOT EXISTS subjects (id INTEGER PRIMARY KEY, title TEXT NOT NULL, color TEXT DEFAULT '#35c8a0');
CREATE TABLE IF NOT EXISTS teacher_classes (teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE, class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE, PRIMARY KEY(teacher_id,class_id));
CREATE TABLE IF NOT EXISTS teacher_subjects (teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE, subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE, PRIMARY KEY(teacher_id,subject_id));
CREATE TABLE IF NOT EXISTS student_classes (student_id INTEGER REFERENCES users(id) ON DELETE CASCADE, class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS quizzes (id INTEGER PRIMARY KEY, title TEXT NOT NULL, teacher_id INTEGER REFERENCES users(id), subject_id INTEGER REFERENCES subjects(id), class_id INTEGER REFERENCES classes(id), status TEXT NOT NULL DEFAULT 'draft', created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS questions (id INTEGER PRIMARY KEY, quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE, question_text TEXT NOT NULL, options TEXT NOT NULL, correct_index INTEGER NOT NULL, order_index INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS attempts (id INTEGER PRIMARY KEY, quiz_id INTEGER REFERENCES quizzes(id), student_id INTEGER REFERENCES users(id), started_at TEXT DEFAULT CURRENT_TIMESTAMP, submitted_at TEXT, score REAL DEFAULT 0, UNIQUE(quiz_id,student_id));
CREATE TABLE IF NOT EXISTS answers (id INTEGER PRIMARY KEY, attempt_id INTEGER REFERENCES attempts(id) ON DELETE CASCADE, question_id INTEGER REFERENCES questions(id), selected_index INTEGER NOT NULL, is_correct INTEGER NOT NULL);
`);
// Additive migrations keep existing school databases usable after upgrades.
const questionColumns = db.prepare("PRAGMA table_info(questions)").all().map((c) => c.name);
if (!questionColumns.includes("question_type"))
  db.exec("ALTER TABLE questions ADD COLUMN question_type TEXT NOT NULL DEFAULT 'choice'");
if (!questionColumns.includes("correct_answer"))
  db.exec("ALTER TABLE questions ADD COLUMN correct_answer TEXT NOT NULL DEFAULT ''");
db.exec("DROP INDEX IF EXISTS student_classes_unique");
db.exec("DELETE FROM student_classes WHERE rowid NOT IN (SELECT MIN(rowid) FROM student_classes GROUP BY student_id)");
db.exec("CREATE UNIQUE INDEX IF NOT EXISTS student_classes_unique ON student_classes(student_id)");
db.exec("DELETE FROM teacher_subjects WHERE rowid NOT IN (SELECT MIN(rowid) FROM teacher_subjects GROUP BY teacher_id)");
db.exec("CREATE UNIQUE INDEX IF NOT EXISTS teacher_subjects_one_subject ON teacher_subjects(teacher_id)");
function hash(password, salt = randomBytes(16).toString("hex")) {
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}
function addUser(role, name, username, password, extras = {}) {
  db.prepare(
    "INSERT OR IGNORE INTO users(role,name,username,password_hash,school_code,phone) VALUES(?,?,?,?,?,?)",
  ).run(
    role,
    name,
    username,
    hash(password),
    extras.school_code || null,
    extras.phone || null,
  );
}
addUser("admin", "School Administrator", "admin", "admin123");
addUser("teacher", "Maya Johnson", "maya", "teacher123");
addUser("student", "Alex Morgan", "alex", "student123", {
  school_code: "STU-1001",
});
if (db.prepare("SELECT COUNT(*) AS n FROM classes").get().n === 0) {
  db.prepare("INSERT INTO classes(title,color) VALUES(?,?)").run(
    "Grade 7A",
    "#6878ff",
  );
  db.prepare("INSERT INTO classes(title,color) VALUES(?,?)").run(
    "Grade 8B",
    "#25b98e",
  );
  db.prepare("INSERT INTO subjects(title,color) VALUES(?,?)").run(
    "Mathematics",
    "#f2ad35",
  );
  db.prepare("INSERT INTO subjects(title,color) VALUES(?,?)").run(
    "Science",
    "#39a9ff",
  );
  const teacherId = db
    .prepare("SELECT id FROM users WHERE username=?")
    .get("maya").id;
  const studentId = db
    .prepare("SELECT id FROM users WHERE username=?")
    .get("alex").id;
  db.prepare("INSERT INTO teacher_classes VALUES(?,?)").run(teacherId, 1);
  db.prepare("INSERT INTO teacher_subjects VALUES(?,?)").run(teacherId, 1);
  db.prepare("INSERT INTO student_classes VALUES(?,?)").run(studentId, 1);
}
module.exports = { db, hash };
