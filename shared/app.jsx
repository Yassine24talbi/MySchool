import React, { useEffect, useState, useContext } from "react";
import { createRoot } from "react-dom/client";
import CosmicCheckbox from "./CosmicCheckbox.jsx";
import "./styles.css";

const role = __ROLE__;
const API = import.meta.env.VITE_API_URL || "https://api.moviex.buzz/api";
const LanguageContext = React.createContext("en");
const french = {
  Home: "Accueil",
  Classes: "Classes",
  Quizzes: "Quiz",
  Results: "Résultats",
  Students: "Élèves",
  Teachers: "Enseignants",
  Subjects: "Matières",
  "Welcome back": "Bon retour",
  "Sign in to continue to your school workspace.":
    "Connectez-vous pour accéder à votre espace scolaire.",
  Username: "Nom d’utilisateur",
  Password: "Mot de passe",
  "Enter your password": "Saisissez votre mot de passe",
  "Signing in…": "Connexion…",
  "Sign in": "Se connecter",
  "Demo account:": "Compte démo :",
  WORKSPACE: "ESPACE DE TRAVAIL",
  "Learning, made simple.": "Apprendre en toute simplicité.",
  "Your school day, in one place.": "Votre journée scolaire, au même endroit.",
  Notifications: "Notifications",
  "Take your quiz": "Répondez au quiz",
  "Take your time and do your best.":
    "Prenez votre temps et faites de votre mieux.",
  "Here is what is happening at your school today.":
    "Voici ce qui se passe dans votre établissement aujourd’hui.",
  "YOUR SCHOOL OVERVIEW": "APERÇU DE VOTRE ÉTABLISSEMENT",
  "Ready for a great day of learning?":
    "Prêt à passer une belle journée d’apprentissage ?",
  "Your classes are ready for you.": "Vos classes vous attendent.",
  "Your school at a glance.": "Votre établissement en un coup d’œil.",
  "Pick up where you left off and keep your progress moving.":
    "Reprenez là où vous en étiez et poursuivez vos progrès.",
  "Keep your classes moving forward with a clear view of your work.":
    "Suivez facilement le travail de vos classes.",
  "Keep your school running smoothly from one workspace.":
    "Gérez votre établissement depuis un seul espace.",
  "Available quizzes": "Quiz disponibles",
  "My classes": "Mes classes",
  Completed: "Terminés",
  "My quizzes": "Mes quiz",
  Submissions: "Réponses reçues",
  "Published quizzes": "Quiz publiés",
  "Recent quizzes": "Quiz récents",
  "School activity": "Activité de l’établissement",
  "Your next learning steps": "Vos prochaines étapes d’apprentissage",
  "Your latest updates": "Vos dernières mises à jour",
  "View all →": "Tout afficher →",
  "My results": "Mes résultats",
  "Your classes": "Vos classes",
  "A quick look at your progress": "Un aperçu de votre progression",
  "Nothing here yet": "Rien à afficher pour le moment",
  "Published quizzes for your class will appear here.":
    "Les quiz publiés pour votre classe apparaîtront ici.",
  "Create your first quiz to get started.":
    "Créez votre premier quiz pour commencer.",
  "Your results start here": "Vos résultats apparaîtront ici",
  "Complete a quiz and your score will show up here.":
    "Terminez un quiz pour voir votre score ici.",
  "School class": "Classe scolaire",
  "Assigned class": "Classe attribuée",
  "No classes assigned": "Aucune classe attribuée",
  "Classes will appear here when they are available.":
    "Les classes disponibles apparaîtront ici.",
  "Start →": "Commencer →",
  "No classes to show": "Aucune classe à afficher",
  "Your assigned classes will appear here.":
    "Vos classes attribuées apparaîtront ici.",
  "Choose a class to view its students.":
    "Choisissez une classe pour voir ses élèves.",
  "View students →": "Voir les élèves →",
  "Add class": "Ajouter une classe",
  "Create a class for your school.":
    "Créez une classe pour votre établissement.",
  "Class name": "Nom de la classe",
  "e.g. Grade 9A": "Ex. : 3e A",
  "Add class →": "Ajouter la classe →",
  "Students in": "Élèves de",
  "Class roster": "Liste de la classe",
  STUDENT: "ÉLÈVE",
  "STUDENT CODE": "CODE ÉLÈVE",
  "No students in this class": "Aucun élève dans cette classe",
  "Assign a student to this class from the Students section.":
    "Attribuez un élève à cette classe depuis la section Élèves.",
  "Take quiz": "Répondre au quiz",
  "Quizzes for you": "Vos quiz",
  "Choose a quiz to begin.": "Choisissez un quiz pour commencer.",
  "Quiz library": "Bibliothèque de quiz",
  "Manage your quizzes and publishing status.":
    "Gérez vos quiz et leur publication.",
  Publish: "Publier",
  Unpublish: "Dépublier",
  Rename: "Renommer",
  "No quizzes yet": "Aucun quiz pour le moment",
  "Your teacher has not published a quiz for your class yet.":
    "Votre enseignant n’a pas encore publié de quiz pour votre classe.",
  "Create a quiz for one of your classes.":
    "Créez un quiz pour l’une de vos classes.",
  "Create a quiz": "Créer un quiz",
  "Add as many multiple choice or written answer questions as you need.":
    "Ajoutez autant de questions à choix multiples ou à réponse écrite que nécessaire.",
  "Quiz title": "Titre du quiz",
  "e.g. Fractions review": "Ex. : Révision des fractions",
  Class: "Classe",
  Subject: "Matière",
  "Choose subject": "Choisir une matière",
  "Question type": "Type de question",
  "Multiple choice": "Choix multiples",
  "Written answer": "Réponse écrite",
  "Write your question": "Saisissez votre question",
  "Correct answer": "Réponse correcte",
  "Expected answer": "Réponse attendue",
  "Correct option": "Option correcte",
  "Remove question": "Supprimer la question",
  "+ Add question": "+ Ajouter une question",
  "Create draft →": "Créer un brouillon →",
  "Type your answer": "Saisissez votre réponse",
  "This quiz has no questions yet.":
    "Ce quiz ne contient pas encore de questions.",
  "Submit answers →": "Envoyer les réponses →",
  "Quiz results": "Résultats des quiz",
  "Scores from submitted quizzes.": "Scores des quiz envoyés.",
  QUIZ: "QUIZ",
  DATE: "DATE",
  SUBMITTED: "ENVOYÉ LE",
  SCORE: "SCORE",
  "No results yet": "Aucun résultat",
  "Submitted quiz scores will appear here.":
    "Les scores des quiz envoyés apparaîtront ici.",
  "Manage student accounts and their class memberships.":
    "Gérez les comptes élèves et leur classe.",
  "Manage teacher accounts.": "Gérez les comptes enseignants.",
  "Filter by name": "Filtrer par nom",
  "Search student names": "Rechercher un élève",
  "Filter by class": "Filtrer par classe",
  "All classes": "Toutes les classes",
  "No class": "Aucune classe",
  NAME: "NOM",
  USERNAME: "IDENTIFIANT",
  CODE: "CODE",
  CLASSES: "CLASSES",
  SUBJECTS: "MATIÈRES",
  CLASS: "CLASSE",
  "No matching students": "Aucun élève correspondant",
  "Try changing the name or class filters.":
    "Modifiez le filtre de nom ou de classe.",
  "Add student": "Ajouter un élève",
  "Add teacher": "Ajouter un enseignant",
  "New accounts receive a starter password.":
    "Les nouveaux comptes reçoivent un mot de passe initial.",
  "Update account details and class assignments.":
    "Modifiez le compte et les classes attribuées.",
  "Full name": "Nom complet",
  "Student code": "Code élève",
  Phone: "Téléphone",
  Optional: "Facultatif",
  "Assign class": "Attribuer une classe",
  "Assign classes (select all this teacher teaches)":
    "Attribuer les classes enseignées",
  "Assign one subject": "Attribuer une matière",
  "Cancel edit": "Annuler",
  "Save changes": "Enregistrer les modifications",
  "Give the new account holder their username and this password.":
    "Transmettez son identifiant et ce mot de passe au nouveau titulaire.",
  "Subjects offered by your school.":
    "Matières proposées par votre établissement.",
  "Teachers: None assigned": "Enseignants : aucun",
  "Add subject": "Ajouter une matière",
  "Create a new school subject.": "Créez une nouvelle matière.",
  "Subject name": "Nom de la matière",
  "e.g. English": "Ex. : anglais",
  Color: "Couleur",
  "Add subject →": "Ajouter la matière →",
  "Academic subject": "Matière scolaire",
  "Good morning": "Bonjour",
  "Good afternoon": "Bonjour",
  morning: "matin",
  afternoon: "après-midi",
  "Manage and review your students in one place.":
    "Gérez et suivez vos élèves au même endroit.",
  "Manage and review your teachers in one place.":
    "Gérez et suivez vos enseignants au même endroit.",
  "Manage and review your classes in one place.":
    "Gérez et suivez vos classes au même endroit.",
  "Manage and review your subjects in one place.":
    "Gérez et suivez vos matières au même endroit.",
  "Manage and review your quizzes in one place.":
    "Gérez et consultez vos quiz au même endroit.",
  "Manage and review your results in one place.":
    "Gérez et consultez vos résultats au même endroit.",
  "MySchool workspace": "Espace MySchool",
  "teacher workspace": "Espace enseignant",
  "student workspace": "Espace élève",
  "admin workspace": "Espace administrateur",
  "teacher account · Sign out": "Compte enseignant · Déconnexion",
  "student account · Sign out": "Compte élève · Déconnexion",
  "admin account · Sign out": "Compte administrateur · Déconnexion",
  "Switch language to French": "Passer le site en français",
  "Switch language to English": "Switch the site to English",
};
const extraFrench = {
  "School class": "Classe scolaire",
  "Choose a class to view its students.":
    "Choisissez une classe pour voir ses eleves.",
  "View students ->": "Voir les eleves ->",
  "Add class": "Ajouter une classe",
  "Create a class for your school.":
    "Creez une classe pour votre etablissement.",
  "Class name": "Nom de la classe",
  Color: "Couleur",
  "Students in": "Eleves de",
  "STUDENT CODE": "CODE ELEVE",
  "Filter by name": "Filtrer par nom",
  "Search student names": "Rechercher un eleve",
  "Filter by class": "Filtrer par classe",
  "All classes": "Toutes les classes",
  "No class": "Aucune classe",
  "No matching students": "Aucun eleve correspondant",
  "Try changing the name or class filters.":
    "Modifiez le filtre de nom ou de classe.",
  "Add student": "Ajouter un eleve",
  "Add teacher": "Ajouter un enseignant",
  "Edit student": "Modifier l'eleve",
  "Edit teacher": "Modifier l'enseignant",
  "New accounts receive a starter password.":
    "Les nouveaux comptes recoivent un mot de passe initial.",
  "Full name": "Nom complet",
  Phone: "Telephone",
  Optional: "Facultatif",
  "Assign class": "Attribuer une classe",
  "Assign classes (select all this teacher teaches)":
    "Attribuer les classes enseignees",
  "Assign one subject": "Attribuer une matiere",
  "Save changes": "Enregistrer les modifications",
  "Cancel edit": "Annuler",
  "Give the new account holder their username and this password.":
    "Transmettez son identifiant et ce mot de passe au nouveau titulaire.",
  "Export XLSX": "Exporter XLSX",
  "Import XLSX": "Importer XLSX",
  "Download template": "Telecharger le modele",
  "No students yet": "Aucun eleve",
  "No teachers yet": "Aucun enseignant",
  "Subjects offered by your school.":
    "Matieres proposees par votre etablissement.",
  "Teachers:": "Enseignants :",
  "None assigned": "Aucun enseignant attribue",
  "Add subject": "Ajouter une matiere",
  "Create a new school subject.": "Creez une nouvelle matiere scolaire.",
  "Subject name": "Nom de la matiere",
  "Academic subject": "Matiere scolaire",
  "Quiz results": "Resultats des quiz",
  "Scores from submitted quizzes.": "Scores des quiz envoyes.",
  "No results yet": "Aucun resultat",
  "Submitted quiz scores will appear here.":
    "Les scores des quiz envoyes apparaitront ici.",
  "Take your time and do your best.":
    "Prenez votre temps et faites de votre mieux.",
  "Your teacher has not published a quiz for your class yet.":
    "Votre enseignant n'a pas encore publie de quiz pour votre classe.",
  "This quiz has no questions yet.":
    "Ce quiz ne contient pas encore de questions.",
  "Submit answers ->": "Envoyer les reponses ->",
  "Type your answer": "Saisissez votre reponse",
  "Multiple choice": "Choix multiples",
  "Written answer": "Reponse redigee",
  "Question type": "Type de question",
  "Correct answer": "Reponse correcte",
  "Expected answer": "Reponse attendue",
  "Correct option": "Option correcte",
  "Remove question": "Supprimer la question",
  "+ Add question": "+ Ajouter une question",
  "Manage and review your students in one place.":
    "Gerez et suivez vos eleves au meme endroit.",
  "Manage and review your teachers in one place.":
    "Gerez et suivez vos enseignants au meme endroit.",
  "Manage and review your classes in one place.":
    "Gerez et suivez vos classes au meme endroit.",
  "Manage and review your subjects in one place.":
    "Gerez et suivez vos matieres au meme endroit.",
  "Manage and review your quizzes in one place.":
    "Gerez et suivez vos quiz au meme endroit.",
  "Manage and review your results in one place.":
    "Gerez et suivez vos resultats au meme endroit.",
  "Fran\u00e7ais": "Fran\u00e7ais",
  "Switch language to English": "Passer le site en anglais",
  "Switch language to French": "Passer le site en fran\u00e7ais",
  "No classes to show": "Aucune classe a afficher",
  "Your assigned classes will appear here.":
    "Vos classes attribuees apparaitront ici.",
  "No students in this class": "Aucun eleve dans cette classe",
  "Assign a student to this class from the Students section.":
    "Attribuez un eleve a cette classe depuis la section Eleves.",
  "Create a password for this account": "Creez un mot de passe pour ce compte",
  "Optional password reset": "Reinitialisation facultative du mot de passe",
  "New password (leave blank to keep current)":
    "Nouveau mot de passe (laisser vide pour conserver l'actuel)",
  "Set password": "Definir le mot de passe",
  "Assign at least one class and exactly one subject to this teacher.":
    "Attribuez au moins une classe et une seule matiere a cet enseignant.",
  "Manage student accounts and their class memberships.":
    "Gerez les comptes eleves et leur classe.",
  "Manage teacher accounts.": "Gerez les comptes enseignants.",
  "No matching teachers": "Aucun enseignant correspondant",
  "No class yet": "Aucune classe pour le moment",
  Students: "Eleves",
  Teachers: "Enseignants",
  Subjects: "Matieres",
  "Create a quiz": "Creer un quiz",
  "Quiz library": "Bibliotheque de quiz",
  "Create a quiz for one of your classes.":
    "Creez un quiz pour l'une de vos classes.",
  "Add as many multiple choice or written answer questions as you need.":
    "Ajoutez autant de questions a choix multiples ou a reponse redigee que necessaire.",
  "Write your question": "Saisissez votre question",
  "No subjects yet": "Aucune matiere",
  "No quizzes yet": "Aucun quiz pour le moment",
  "YOUR SCHOOL OVERVIEW": "APERÇU DE VOTRE ETABLISSEMENT",
  "A quick look at your progress": "Un apercu de votre progression",
  "Welcome back": "Bon retour",
  "Sign in to continue to your school workspace.":
    "Connectez-vous pour acceder a votre espace scolaire.",
  "Simple. Smart. For better learning.":
    "Simple. Intelligent. Pour mieux apprendre.",
  "Class roster ·": "Liste de la classe ·",
  student: "eleve",
  students: "eleves",
};
for (const [source, translation] of Object.entries(extraFrench)) {
  if (!french[source]) french[source] = translation;
}
french["Switch language to English"] = "Passer le site en anglais";
french["Switch language to French"] = "Passer le site en fran\u00e7ais";
french["Switch to light mode"] = "Passer au mode clair";
french["Switch to dark mode"] = "Passer au mode sombre";
french["Sign out"] = "Déconnexion";
french["SUBJECT"] = "MATIÈRE";
french["Filter by quiz name"] = "Filtrer par nom du quiz";
french["Filter by class"] = "Filtrer par classe";
french["Filter by teacher"] = "Filtrer par enseignant";
french["No options available."] = "Aucune option disponible.";
french["STUDENT CODE"] = "CODE ÉLÈVE";
french["STATUS"] = "STATUT";
french["Completed"] = "Terminé";
french["Not taken"] = "Non répondu";
french["No matching quiz"] = "Aucun quiz correspondant";
french["Select at least one class"] = "Sélectionnez au moins une classe";
french[
  "Use the class checkboxes above to see each student’s quiz status and scores."
] =
  "Cochez une ou plusieurs classes pour voir le statut et les résultats des élèves.";
french["No students in these classes"] = "Aucun élève dans ces classes";
french["There are no students assigned to the selected classes."] =
  "Aucun élève n’est affecté aux classes sélectionnées.";
french["No results match the selected quizzes."] =
  "Aucun résultat ne correspond aux quiz sélectionnés.";
function translatedText(text, language) {
  if (language !== "fr") return text;
  const trimmed = text.trim();
  let translated = french[trimmed];
  const greeting = trimmed.match(/^Good (morning|afternoon), (.+)$/);
  if (greeting) translated = `Bonjour, ${greeting[2]}`;
  const count = trimmed.match(/^Class roster · (\d+) student(s?)$/);
  if (count)
    translated = `Liste de la classe · ${count[1]} élève${Number(count[1]) > 1 ? "s" : ""}`;
  const option = trimmed.match(/^Option ([A-D])$/);
  if (option) translated = `Option ${option[1]}`;
  const role = {
    STUDENT: "ÉLÈVE",
    TEACHER: "ENSEIGNANT",
    ADMIN: "ADMINISTRATEUR",
  }[trimmed];
  if (role) translated = role;
  if (!translated) return text;
  const leading = text.match(/^\s*/)?.[0] || "";
  const trailing = text.match(/\s*$/)?.[0] || "";
  return `${leading}${translated}${trailing}`;
}
function localizeChildren(children, language) {
  return React.Children.map(children, (child) => {
    if (typeof child === "string") return translatedText(child, language);
    if (!React.isValidElement(child)) return child;
    if (typeof child.type === "function") return child;
    const props = {};
    for (const key of ["placeholder", "aria-label", "title", "alt"]) {
      if (typeof child.props[key] === "string")
        props[key] = translatedText(child.props[key], language);
    }
    return React.cloneElement(
      child,
      props,
      localizeChildren(child.props.children, language),
    );
  });
}
function Localized({ children }) {
  const language = useContext(LanguageContext);
  return <>{localizeChildren(children, language)}</>;
}
const icons = {
  Home: "⌂",
  Classes: "▦",
  Quizzes: "▤",
  Results: "◷",
  Students: "♙",
  Teachers: "♧",
  Subjects: "◇",
  Settings: "⚙",
};
function App() {
  const [language, setLanguage] = useState(() =>
    localStorage.getItem("myschool-language") === "fr" ? "fr" : "en",
  );
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("myschool-theme") === "dark",
  );
  function toggleLanguage() {
    const next = language === "en" ? "fr" : "en";
    localStorage.setItem("myschool-language", next);
    setLanguage(next);
  }
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    localStorage.setItem("myschool-theme", darkMode ? "dark" : "light");
  }, [darkMode]);
  function toggleTheme() {
    setDarkMode((current) => !current);
  }
  const [token, setToken] = useState(
    localStorage.getItem("myschool-token") || "",
  );
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("myschool-user"));
    } catch {
      return null;
    }
  });
  const [page, setPage] = useState("Home"),
    [data, setData] = useState(null),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [quiz, setQuiz] = useState(null),
    [quizLoading, setQuizLoading] = useState(false);
  async function api(path, options = {}) {
    const response = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });
    if (!response.ok) {
      let body = {};
      try {
        body = await response.json();
      } catch {}
      throw Error(body.error || `Request failed (${response.status}).`);
    }
    return response.status === 204 ? null : response.json();
  }
  useEffect(() => {
    if (!token) return;
    api("/dashboard")
      .then(setData)
      .catch((e) => {
        setError(e.message);
        if (e.message.includes("sign in")) logout();
      });
  }, [token]);
  const nav =
    role === "student"
      ? ["Home", "Classes", "Quizzes", "Results"]
      : role === "teacher"
        ? ["Home", "Classes", "Quizzes", "Results"]
        : ["Home", "Students", "Teachers", "Subjects", "Classes", "Results"];
  function logout() {
    localStorage.removeItem("myschool-token");
    localStorage.removeItem("myschool-user");
    setToken("");
    setUser(null);
    setData(null);
  }
  async function login(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    try {
      const r = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: f.get("username"),
          password: f.get("password"),
          role,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error);
      localStorage.setItem("myschool-token", d.token);
      localStorage.setItem("myschool-user", JSON.stringify(d.user));
      setToken(d.token);
      setUser(d.user);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function reload() {
    setError("");
    try {
      setData(await api("/dashboard"));
    } catch (e) {
      setError(e.message);
    }
  }
  async function openQuiz(id) {
    setQuizLoading(true);
    try {
      setQuiz(await api(`/quizzes/${id}`));
    } catch (e) {
      setError(e.message);
    } finally {
      setQuizLoading(false);
    }
  }
  async function submitQuiz(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget),
      answers = {};
    for (const [k, v] of form.entries()) answers[k] = v;
    try {
      await api(`/quizzes/${quiz.id}/submit`, {
        method: "POST",
        body: JSON.stringify({ answers }),
      });
      setNotice("");
      setQuiz(null);
      setPage("Results");
      await reload();
    } catch (e) {
      setError(e.message);
    }
  }
  async function createRecord(e, kind) {
    e.preventDefault();
    const formElement = e.currentTarget,
      form = new FormData(formElement);
    const body = Object.fromEntries(form.entries());
    if (formElement.elements.namedItem("class_ids"))
      body.class_ids = form.getAll("class_ids").map(Number);
    if (formElement.elements.namedItem("subject_id"))
      body.subject_id = Number(form.get("subject_id"));
    try {
      if (kind === "user") {
        body.role = body.kind;
        delete body.kind;
      }
      await api(kind === "user" ? "/users" : `/${kind}`, {
        method: "POST",
        body: JSON.stringify(body),
      });
      setNotice(
        kind === "user"
          ? `Account created. Login: ${body.username} / ${body.password}. Share these credentials with the new ${body.role}.`
          : `${kind.slice(0, -1)} created.`,
      );
      formElement.reset();
      await reload();
    } catch (e) {
      setError(e.message);
    }
  }
  async function createQuiz(e) {
    e.preventDefault();
    const formElement = e.currentTarget,
      f = new FormData(formElement);
    const indexes = [
      ...new Set(
        [...f.keys()]
          .map((key) => key.match(/^q(\d+)text$/)?.[1])
          .filter((x) => x !== undefined),
      ),
    ];
    const questions = indexes.map((i) => {
      const type = f.get(`q${i}type`);
      return {
        question_text: f.get(`q${i}text`),
        question_type: type,
        options:
          type === "choice"
            ? ["a", "b", "c", "d"].map((x) => f.get(`q${i}${x}`))
            : [],
        correct_index: type === "choice" ? Number(f.get(`q${i}correct`)) : 0,
        correct_answer: type === "text" ? f.get(`q${i}answer`) : "",
      };
    });
    try {
      await api("/quizzes", {
        method: "POST",
        body: JSON.stringify({
          title: f.get("title"),
          class_id: Number(f.get("class_id")),
          subject_id: Number(f.get("subject_id")),
          questions,
        }),
      });
      setNotice("Quiz created as a draft. Publish it when it is ready.");
      formElement.reset();
      await reload();
    } catch (e) {
      setError(e.message);
    }
  }
  async function quizAction(id, status) {
    try {
      await api(`/quizzes/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setNotice(
        status === "published" ? "Quiz published." : "Quiz saved as a draft.",
      );
      await reload();
    } catch (e) {
      setError(e.message);
    }
  }
  async function deleteItem(path, label) {
    if (!window.confirm(`Delete this ${label}?`)) return;
    try {
      await api(path, { method: "DELETE" });
      setNotice(`${label} deleted.`);
      await reload();
    } catch (e) {
      setError(e.message);
    }
  }
  if (!token)
    return (
      <LanguageContext.Provider value={language}>
        <Localized>
          <main className="login-wrap">
            <section className="login-card">
              <button
                type="button"
                className="language-toggle"
                aria-label={
                  language === "en"
                    ? "Switch language to French"
                    : "Switch language to English"
                }
                onClick={toggleLanguage}
              >
                {language === "en" ? "Français" : "English"}
              </button>
              <button
                type="button"
                className="theme-toggle login-theme-toggle"
                aria-label={
                  darkMode ? "Switch to light mode" : "Switch to dark mode"
                }
                onClick={toggleTheme}
              >
                {darkMode ? "☀" : "☾"}
              </button>
              <div className="brand-mark">
                M<span>+</span>
              </div>
              <p className="eyebrow">MY SCHOOL PORTAL · {role.toUpperCase()}</p>
              <h1>Welcome back</h1>
              <p className="muted">
                Sign in to continue to your school workspace.
              </p>
              <form onSubmit={login} className="stack">
                <label>
                  Username
                  <input
                    name="username"
                    required
                    autoComplete="username"
                    placeholder={
                      role === "student"
                        ? "alex"
                        : role === "teacher"
                          ? "maya"
                          : "admin"
                    }
                  />
                </label>
                <label>
                  Password
                  <input
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                  />
                </label>
                {error && <p className="error">{error}</p>}
                <button className="primary wide" disabled={busy}>
                  {busy ? "Signing in…" : "Sign in"} <span>→</span>
                </button>
              </form>
              <div className="demo-hint">
                Demo account:{" "}
                <b>
                  {role === "student"
                    ? "alex / student123"
                    : role === "teacher"
                      ? "maya / teacher123"
                      : "admin / admin123"}
                </b>
              </div>
            </section>
          </main>
        </Localized>
      </LanguageContext.Provider>
    );
  return (
    <LanguageContext.Provider value={language}>
      <Localized>
        <div className="shell">
          <aside className="sidebar">
            <div className="mobile-brand-row">
              <a className="brand" href="#">
                <span className="brand-mark small">
                  M<span>+</span>
                </span>
                <span>
                  MySchool<small>{role} workspace</small>
                </span>
              </a>
              <div className="mobile-tools">
                <button
                  type="button"
                  className="language-toggle"
                  aria-label={
                    language === "en"
                      ? "Switch language to French"
                      : "Switch language to English"
                  }
                  onClick={toggleLanguage}
                >
                  {language === "en" ? "FranÃ§ais" : "English"}
                </button>
                <button
                  type="button"
                  className="theme-toggle"
                  aria-label={
                    darkMode ? "Switch to light mode" : "Switch to dark mode"
                  }
                  onClick={toggleTheme}
                >
                  {darkMode ? "â˜€" : "â˜¾"}
                </button>
                <button
                  type="button"
                  className="mobile-logout"
                  aria-label="Sign out"
                  onClick={logout}
                >
                  Sign out
                </button>
              </div>
            </div>
            <div className="side-label">WORKSPACE</div>
            <nav>
              {nav.map((n) => (
                <button
                  className={page === n ? "nav-item active" : "nav-item"}
                  onClick={() => {
                    setPage(n);
                    setQuiz(null);
                  }}
                  key={n}
                >
                  <span className="nav-icon">{icons[n]}</span>
                  {n}
                  {n === "Quizzes" &&
                    role === "student" &&
                    data?.counts?.quizzes > 0 && (
                      <i className="nav-count">{data.counts.quizzes}</i>
                    )}
                </button>
              ))}
            </nav>
            <div className="side-bottom">
              <div className="help-card">
                <span>✦</span>
                <b>Learning, made simple.</b>
                <small>Your school day, in one place.</small>
              </div>
              <button className="profile" onClick={logout}>
                <span className="avatar">{user?.name?.[0] || "M"}</span>
                <span>
                  <b>{user?.name}</b>
                  <small>{role} account · Sign out</small>
                </span>
                <span className="dots">•••</span>
              </button>
            </div>
          </aside>
          <main className="main">
            <header className="topbar">
              <div>
                <span className="breadcrumb">
                  MySchool <span>/</span> {page}
                </span>
                <h1>
                  {quiz
                    ? "Take your quiz"
                    : page === "Home"
                      ? `Good ${new Date().getHours() < 12 ? "morning" : "afternoon"}, ${user?.name?.split(" ")[0] || "there"}`
                      : page}
                </h1>
                <p className="muted">
                  {quiz
                    ? "Take your time and do your best."
                    : page === "Home"
                      ? "Here is what is happening at your school today."
                      : `Manage and review your ${page.toLowerCase()} in one place.`}
                </p>
              </div>
              <div className="top-actions">
                <span className="today">
                  {new Intl.DateTimeFormat(
                    language === "fr" ? "fr-FR" : "en-US",
                    {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    },
                  ).format(new Date())}
                </span>
                <button
                  type="button"
                  className="language-toggle"
                  aria-label={
                    language === "en"
                      ? "Switch language to French"
                      : "Switch language to English"
                  }
                  onClick={toggleLanguage}
                >
                  {language === "en" ? "Français" : "English"}
                </button>
                <button
                  type="button"
                  className="theme-toggle"
                  aria-label={
                    darkMode ? "Switch to light mode" : "Switch to dark mode"
                  }
                  onClick={toggleTheme}
                >
                  {darkMode ? "☀" : "☾"}
                </button>
                <button
                  type="button"
                  className="mobile-logout"
                  aria-label="Sign out"
                  onClick={logout}
                >
                  ♧<i />
                </button>
                <span className="avatar">{user?.name?.[0] || "M"}</span>
              </div>
            </header>
            {error && (
              <div className="alert error">
                {error}
                <button onClick={() => setError("")}>×</button>
              </div>
            )}
            {notice && (
              <div className="alert success">
                {notice}
                <button onClick={() => setNotice("")}>×</button>
              </div>
            )}
            {quiz ? (
              <QuizView
                quiz={quiz}
                onSubmit={submitQuiz}
                onCancel={() => setQuiz(null)}
              />
            ) : quizLoading ? (
              <QuizSkeleton />
            ) : (
              <>
                {page === "Home" && (
                  <Dashboard
                    role={role}
                    data={data}
                    loading={!data && !error}
                    setPage={setPage}
                    openQuiz={openQuiz}
                  />
                )}
                {page === "Classes" && (
                  <Classes
                    api={api}
                    role={role}
                    reload={reload}
                    setError={setError}
                    setNotice={setNotice}
                  />
                )}
                {page === "Quizzes" && (
                  <Quizzes
                    api={api}
                    role={role}
                    data={data}
                    openQuiz={openQuiz}
                    action={quizAction}
                    create={createQuiz}
                    deleteItem={deleteItem}
                    reload={reload}
                  />
                )}
                {page === "Results" && <Results api={api} />}
                {page === "Students" && (
                  <Directory
                    api={api}
                    role="student"
                    create={createRecord}
                    reload={reload}
                    deleteItem={deleteItem}
                    setError={setError}
                    setNotice={setNotice}
                  />
                )}
                {page === "Teachers" && (
                  <Directory
                    api={api}
                    role="teacher"
                    create={createRecord}
                    reload={reload}
                    deleteItem={deleteItem}
                    setError={setError}
                    setNotice={setNotice}
                  />
                )}
                {page === "Subjects" && (
                  <Subjects
                    api={api}
                    create={createRecord}
                    deleteItem={deleteItem}
                  />
                )}
              </>
            )}
            <footer>
              MySchool <span>·</span> Simple. Smart. For better learning.
            </footer>
          </main>
        </div>
      </Localized>
    </LanguageContext.Provider>
  );
}
function SkeletonPiece({ className = "" }) {
  return <span className={`skeleton-piece ${className}`} aria-hidden="true" />;
}
function Dashboard({ role, data, loading, setPage, openQuiz }) {
  const c = data?.counts || {};
  const language = useContext(LanguageContext);
  return (
    <Localized>
      <>
        <section className="welcome-strip">
          <div>
            <span className="eyebrow">YOUR SCHOOL OVERVIEW</span>
            <h2>
              {role === "student"
                ? "Ready for a great day of learning?"
                : role === "teacher"
                  ? "Your classes are ready for you."
                  : "Your school at a glance."}
            </h2>
            <p>
              {role === "student"
                ? "Pick up where you left off and keep your progress moving."
                : role === "teacher"
                  ? "Keep your classes moving forward with a clear view of your work."
                  : "Keep your school running smoothly from one workspace."}
            </p>
          </div>
          <div className="welcome-illo">
            <span>✦</span>
            <b>{role === "student" ? "✎" : role === "teacher" ? "▤" : "⌂"}</b>
            <i>✦</i>
          </div>
        </section>
        <section className="stats-grid">
          {loading
            ? Array.from({ length: role === "admin" ? 4 : 3 }, (_, index) => (
                <article
                  className="stat-card skeleton-stat"
                  key={`stat-${index}`}
                >
                  <SkeletonPiece className="skeleton-stat-icon" />
                  <div className="skeleton-stat-copy">
                    <SkeletonPiece className="skeleton-label" />
                    <SkeletonPiece className="skeleton-value" />
                  </div>
                </article>
              ))
            : (role === "student"
                ? [
                    ["Available quizzes", c.quizzes || 0, "▤", "lavender"],
                    ["My classes", data?.classes?.length || 0, "▦", "mint"],
                    ["Completed", data?.results?.length || 0, "✓", "peach"],
                  ]
                : role === "teacher"
                  ? [
                      [
                        "My classes",
                        data?.classes?.length || 0,
                        "▦",
                        "lavender",
                      ],
                      ["My quizzes", data?.quizzes?.length || 0, "▤", "mint"],
                      ["Submissions", data?.results?.length || 0, "◷", "peach"],
                    ]
                  : [
                      ["Students", c.students || 0, "♙", "lavender"],
                      ["Teachers", c.teachers || 0, "♧", "mint"],
                      ["Classes", c.classes || 0, "▦", "peach"],
                      ["Published quizzes", c.quizzes || 0, "▤", "blue"],
                    ]
              ).map(([label, value, icon, color]) => (
                <article className="stat-card" key={label}>
                  <span className={`stat-icon ${color}`}>{icon}</span>
                  <div>
                    <small>{label}</small>
                    <strong>{value}</strong>
                  </div>
                  <span className="stat-arrow">↗</span>
                </article>
              ))}
        </section>
        <div className="content-grid">
          <section className="panel">
            <div className="panel-head">
              <div>
                <h3>
                  {role === "student"
                    ? "Available quizzes"
                    : role === "teacher"
                      ? "Recent quizzes"
                      : "School activity"}
                </h3>
                <p className="muted">
                  {role === "student"
                    ? "Your next learning steps"
                    : "Your latest updates"}
                </p>
              </div>
              <button
                className="text-button"
                onClick={() =>
                  setPage(role === "admin" ? "Classes" : "Quizzes")
                }
              >
                View all →
              </button>
            </div>
            {loading ? (
              <div className="dashboard-quiz-skeleton" aria-hidden="true">
                {Array.from({ length: 4 }, (_, index) => (
                  <div className="quiz-row skeleton-quiz-row" key={index}>
                    <SkeletonPiece className="skeleton-row-icon" />
                    <span className="row-main">
                      <SkeletonPiece className="skeleton-title" />
                      <SkeletonPiece className="skeleton-subtitle" />
                    </span>
                    <SkeletonPiece className="skeleton-pill" />
                  </div>
                ))}
              </div>
            ) : data?.quizzes?.length ? (
              data.quizzes.slice(0, 4).map((q) => (
                <div className="quiz-row" key={q.id}>
                  <span className="list-icon violet">▤</span>
                  <span className="row-main">
                    <b>{q.title}</b>
                    <small>
                      {q.subject || "General"}{" "}
                      {q.class_name ? `· ${q.class_name}` : ""}
                    </small>
                  </span>
                  <span
                    className={`pill ${q.status === "published" ? "green" : "amber"}`}
                  >
                    {q.status}
                  </span>
                  {role === "student" ? (
                    <button
                      className="small-button"
                      onClick={() => openQuiz(q.id)}
                    >
                      Start →
                    </button>
                  ) : null}
                </div>
              ))
            ) : (
              <Empty
                title="Nothing here yet"
                text={
                  role === "student"
                    ? "Published quizzes for your class will appear here."
                    : "Create your first quiz to get started."
                }
              />
            )}
          </section>
          <section className="panel">
            <div className="panel-head">
              <div>
                <h3>{role === "student" ? "My results" : "Your classes"}</h3>
                <p className="muted">A quick look at your progress</p>
              </div>
            </div>
            {loading ? (
              <div className="dashboard-side-skeleton" aria-hidden="true">
                {Array.from({ length: 4 }, (_, index) => (
                  <div
                    className={
                      role === "student"
                        ? "result-row skeleton-result-row"
                        : "class-row skeleton-class-row"
                    }
                    key={index}
                  >
                    <SkeletonPiece
                      className={
                        role === "student"
                          ? "skeleton-result-dot"
                          : "skeleton-class-swatch"
                      }
                    />
                    <span className="row-main">
                      <SkeletonPiece className="skeleton-title" />
                      <SkeletonPiece className="skeleton-subtitle" />
                    </span>
                    <SkeletonPiece className="skeleton-score" />
                  </div>
                ))}
              </div>
            ) : role === "student" ? (
              data?.results?.length ? (
                data.results.slice(0, 4).map((r) => (
                  <div className="result-row" key={r.id}>
                    <span className="result-dot">✓</span>
                    <span className="row-main">
                      <b>{r.quiz}</b>
                      <small>
                        {r.submitted_at?.slice(0, 10) || "Completed"}
                      </small>
                    </span>
                    <strong className="score">{r.score}%</strong>
                  </div>
                ))
              ) : (
                <Empty
                  title="Your results start here"
                  text="Complete a quiz and your score will show up here."
                />
              )
            ) : data?.classes?.length ? (
              data.classes.map((c) => (
                <div className="class-row" key={c.id}>
                  <span
                    className="class-swatch"
                    style={{ background: c.color }}
                  ></span>
                  <span className="row-main">
                    <b>{c.title}</b>
                    <small>
                      {role === "admin" ? "School class" : "Assigned class"}
                    </small>
                  </span>
                  <span>›</span>
                </div>
              ))
            ) : (
              <Empty
                title="No classes assigned"
                text="Classes will appear here when they are available."
              />
            )}
          </section>
        </div>
      </>
    </Localized>
  );
}
function Empty({ title, text }) {
  return (
    <Localized>
      <div className="empty">
        <span>✦</span>
        <b>{title}</b>
        <small>{text}</small>
      </div>
    </Localized>
  );
}
function QuizSkeleton() {
  return (
    <section className="panel quiz-paper quiz-skeleton" aria-hidden="true">
      <SkeletonPiece className="skeleton-quiz-heading" />
      {Array.from({ length: 4 }, (_, index) => (
        <fieldset className="question quiz-question-skeleton" key={index}>
          <SkeletonPiece className="skeleton-question" />
          {Array.from({ length: 3 }, (_, option) => (
            <SkeletonPiece className="skeleton-answer" key={option} />
          ))}
        </fieldset>
      ))}
      <SkeletonPiece className="skeleton-submit" />
    </section>
  );
}
function QuizView({ quiz, onSubmit, onCancel }) {
  return (
    <Localized>
      <form className="panel quiz-paper" onSubmit={onSubmit}>
        <div className="panel-head">
          <div>
            <span className="eyebrow">
              {quiz.subject || "QUIZ"} · {quiz.class_name || "MY SCHOOL"}
            </span>
            <h2>{quiz.title}</h2>
          </div>
          <button type="button" className="ghost" onClick={onCancel}>
            Back
          </button>
        </div>
        {quiz.questions?.length ? (
          quiz.questions.map((q, i) => (
            <fieldset className="question" key={q.id}>
              <legend>
                {i + 1}. {q.question_text}
              </legend>
              {q.question_type === "text" ? (
                <input name={q.id} required placeholder="Type your answer" />
              ) : (
                q.options.map((o, j) => (
                  <label className="option" key={j}>
                    <input type="radio" name={q.id} value={j} required />
                    {o}
                  </label>
                ))
              )}
            </fieldset>
          ))
        ) : (
          <p>This quiz has no questions yet.</p>
        )}
        <button className="primary">Submit answers →</button>
      </form>
    </Localized>
  );
}
function Classes({ api, role, reload, setError, setNotice }) {
  const [items, setItems] = useState([]),
    [selectedClass, setSelectedClass] = useState(null),
    [students, setStudents] = useState([]),
    [loading, setLoading] = useState(true),
    [rosterLoading, setRosterLoading] = useState(true);
  async function load() {
    setLoading(true);
    try {
      const classes = await api("/classes");
      setItems(classes);
      if (!classes.some((item) => item.id === Number(selectedClass)))
        setSelectedClass(classes[0]?.id || null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    if (!selectedClass) {
      setStudents([]);
      setRosterLoading(false);
      return;
    }
    setRosterLoading(true);
    api(`/classes/${selectedClass}/students`)
      .then(setStudents)
      .catch((e) => setError(e.message))
      .finally(() => setRosterLoading(false));
  }, [selectedClass]);
  async function add(e) {
    e.preventDefault();
    const formElement = e.currentTarget;
    const form = new FormData(formElement);
    try {
      await api("/classes", {
        method: "POST",
        body: JSON.stringify({
          title: form.get("title"),
          color: form.get("color"),
        }),
      });
      formElement.reset();
      await load();
      await reload();
      setNotice("Class created.");
    } catch (e) {
      setError(e.message);
    }
  }
  async function remove(id) {
    if (!window.confirm("Delete this class?")) return;
    try {
      await api(`/classes/${id}`, { method: "DELETE" });
      if (selectedClass === id) setSelectedClass(null);
      await load();
      await reload();
      setNotice("Class deleted.");
    } catch (e) {
      setError(e.message);
    }
  }
  const selected = items.find((item) => item.id === Number(selectedClass));
  return (
    <Localized>
      <div className="content-grid">
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>
                {role === "student"
                  ? "My classes"
                  : role === "teacher"
                    ? "My classes"
                    : "Classes"}
              </h3>
              <p className="muted">Choose a class to view its students.</p>
            </div>
          </div>
          <div className="cards-grid">
            {loading
              ? Array.from({ length: 4 }, (_, index) => (
                  <article
                    className="class-card skeleton-class-card"
                    key={`class-${index}`}
                  >
                    <SkeletonPiece className="skeleton-class-swatch" />
                    <SkeletonPiece className="skeleton-title" />
                    <SkeletonPiece className="skeleton-subtitle" />
                    <div className="card-foot">
                      <SkeletonPiece className="skeleton-button" />
                    </div>
                  </article>
                ))
              : items.map((c) => (
                  <article
                    className={`class-card ${selectedClass === c.id ? "selected-class" : ""}`}
                    key={c.id}
                  >
                    <span
                      className="class-swatch"
                      style={{ background: c.color }}
                    ></span>
                    <h3>{c.title}</h3>
                    <p>School class</p>
                    <div className="card-foot">
                      <button
                        type="button"
                        className="text-button"
                        onClick={() => setSelectedClass(c.id)}
                      >
                        View students →
                      </button>
                      {role === "admin" && (
                        <button
                          className="icon-button"
                          onClick={() => remove(c.id)}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </article>
                ))}
          </div>
          {!loading && !items.length && (
            <Empty
              title="No classes to show"
              text="Your assigned classes will appear here."
            />
          )}
        </section>
        {role === "admin" && (
          <section className="panel">
            <div className="panel-head">
              <div>
                <h3>Add class</h3>
                <p className="muted">Create a class for your school.</p>
              </div>
            </div>
            <form className="stack compact" onSubmit={add}>
              <label>
                Class name
                <input name="title" required placeholder="e.g. Grade 9A" />
              </label>
              <label>
                Color
                <input name="color" type="color" defaultValue="#6878ff" />
              </label>
              <button className="primary">Add class →</button>
            </form>
          </section>
        )}
        {selected && (
          <section className="panel roster-panel">
            <div className="panel-head">
              <div>
                <h3>Students in {selected.title}</h3>
                <p className="muted">
                  Class roster · {students.length} student
                  {students.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>
            {rosterLoading ? (
              <div className="roster-skeleton" aria-hidden="true">
                <div className="roster-skeleton-head">
                  <SkeletonPiece />
                  <SkeletonPiece />
                </div>
                {Array.from({ length: 5 }, (_, index) => (
                  <div className="roster-skeleton-row" key={index}>
                    <SkeletonPiece className="skeleton-avatar" />
                    <SkeletonPiece className="skeleton-title" />
                    <SkeletonPiece className="skeleton-code" />
                  </div>
                ))}
              </div>
            ) : students.length ? (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>STUDENT</th>
                      <th>STUDENT CODE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td>
                          <span className="avatar tiny">{student.name[0]}</span>
                          <b>{student.name}</b>
                        </td>
                        <td>
                          {student.school_code || student.student_code || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <Empty
                title="No students in this class"
                text="Assign a student to this class from the Students section."
              />
            )}
          </section>
        )}
      </div>
    </Localized>
  );
}
function Quizzes({
  api,
  role,
  data,
  openQuiz,
  action,
  create,
  deleteItem,
  reload,
}) {
  const [items, setItems] = useState([]),
    [classes, setClasses] = useState([]),
    [subjects, setSubjects] = useState([]),
    [loading, setLoading] = useState(true),
    [questionCount, setQuestionCount] = useState(1),
    [questionTypes, setQuestionTypes] = useState({ 0: "choice" });
  async function load() {
    setLoading(true);
    try {
      setItems(await api("/quizzes"));
    } catch {
    } finally {
      setLoading(false);
    }
  }
  async function renameQuiz(item) {
    const title = window.prompt("Quiz title", item.title);
    if (!title?.trim() || title.trim() === item.title) return;
    try {
      await api(`/quizzes/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ title: title.trim() }),
      });
      await load();
      await reload();
    } catch {}
  }
  async function changeStatus(id, status) {
    await action(id, status);
    await load();
  }
  useEffect(() => {
    load();
    api("/classes")
      .then(setClasses)
      .catch(() => {});
    api("/subjects")
      .then(setSubjects)
      .catch(() => {});
  }, []);
  return (
    <Localized>
      <div className="content-grid">
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>{role === "student" ? "Quizzes for you" : "Quiz library"}</h3>
              <p className="muted">
                {role === "student"
                  ? "Choose a quiz to begin."
                  : "Manage your quizzes and publishing status."}
              </p>
            </div>
          </div>
          {loading ? (
            <div className="quiz-list-skeleton" aria-hidden="true">
              {Array.from({ length: 5 }, (_, index) => (
                <div className="quiz-row skeleton-quiz-row" key={index}>
                  <SkeletonPiece className="skeleton-row-icon" />
                  <span className="row-main">
                    <SkeletonPiece className="skeleton-title" />
                    <SkeletonPiece className="skeleton-subtitle" />
                  </span>
                  <SkeletonPiece className="skeleton-pill" />
                  <SkeletonPiece className="skeleton-button" />
                </div>
              ))}
            </div>
          ) : items.length ? (
            items.map((q) => (
              <div className="quiz-row" key={q.id}>
                <span className="list-icon violet">▤</span>
                <span className="row-main">
                  <b>{q.title}</b>
                  <small>
                    {q.subject || "General"} · {q.class_name}
                  </small>
                </span>
                <span
                  className={`pill ${q.status === "published" ? "green" : "amber"}`}
                >
                  {q.status}
                </span>
                {role === "student" ? (
                  <button
                    className="small-button"
                    onClick={() => openQuiz(q.id)}
                  >
                    Take quiz
                  </button>
                ) : q.status === "draft" ? (
                  <div className="inline-actions">
                    <button
                      className="small-button"
                      onClick={() => changeStatus(q.id, "published")}
                    >
                      Publish
                    </button>
                    <button className="ghost" onClick={() => renameQuiz(q)}>
                      Rename
                    </button>
                  </div>
                ) : (
                  <div className="inline-actions">
                    <button
                      className="ghost"
                      onClick={() => changeStatus(q.id, "draft")}
                    >
                      Unpublish
                    </button>
                    <button className="ghost" onClick={() => renameQuiz(q)}>
                      Rename
                    </button>
                    <button
                      className="icon-button"
                      aria-label={`Delete ${q.title}`}
                      onClick={async () => {
                        await deleteItem(`/quizzes/${q.id}`, "quiz");
                        load();
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}
                {role !== "student" && q.status === "draft" && (
                  <button
                    className="icon-button"
                    aria-label={`Delete ${q.title}`}
                    onClick={async () => {
                      await deleteItem(`/quizzes/${q.id}`, "quiz");
                      load();
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))
          ) : (
            <Empty
              title="No quizzes yet"
              text={
                role === "student"
                  ? "Your teacher has not published a quiz for your class yet."
                  : "Create a quiz for one of your classes."
              }
            />
          )}
        </section>
        {role !== "student" && (
          <section className="panel">
            <div className="panel-head">
              <div>
                <h3>Create a quiz</h3>
                <p className="muted">
                  Add as many multiple choice or written answer questions as you
                  need.
                </p>
              </div>
            </div>
            <form
              className="stack compact"
              onSubmit={async (e) => {
                await create(e);
                await load();
              }}
            >
              <label>
                Quiz title
                <input
                  name="title"
                  required
                  placeholder="e.g. Fractions review"
                />
              </label>
              <label>
                Class
                <select name="class_id" required>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Subject
                <select name="subject_id" required>
                  <option value="" disabled>
                    Choose subject
                  </option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </label>
              {Array.from({ length: questionCount }, (_, i) => (
                <details key={i} open className="question-builder">
                  <summary>Question {i + 1}</summary>
                  <label>
                    Question type
                    <select
                      name={`q${i}type`}
                      value={questionTypes[i] || "choice"}
                      onChange={(e) =>
                        setQuestionTypes((old) => ({
                          ...old,
                          [i]: e.target.value,
                        }))
                      }
                    >
                      <option value="choice">Multiple choice</option>
                      <option value="text">Written answer</option>
                    </select>
                  </label>
                  <input
                    name={`q${i}text`}
                    required
                    placeholder="Write your question"
                  />
                  {questionTypes[i] === "text" ? (
                    <label>
                      Correct answer
                      <input
                        name={`q${i}answer`}
                        required
                        placeholder="Expected answer"
                      />
                    </label>
                  ) : (
                    <>
                      {["a", "b", "c", "d"].map((x) => (
                        <input
                          key={x}
                          name={`q${i}${x}`}
                          required
                          placeholder={`Option ${x.toUpperCase()}`}
                        />
                      ))}
                      <label>
                        Correct option
                        <select name={`q${i}correct`}>
                          {["A", "B", "C", "D"].map((x, j) => (
                            <option key={x} value={j}>
                              {x}
                            </option>
                          ))}
                        </select>
                      </label>
                    </>
                  )}
                  {questionCount > 1 && (
                    <button
                      type="button"
                      className="ghost"
                      onClick={() => {
                        setQuestionCount((count) => count - 1);
                        setQuestionTypes((old) =>
                          Object.fromEntries(
                            Object.entries(old)
                              .filter(([index]) => Number(index) !== i)
                              .map(([index, value]) => [
                                Number(index) > i
                                  ? Number(index) - 1
                                  : Number(index),
                                value,
                              ]),
                          ),
                        );
                      }}
                    >
                      Remove question
                    </button>
                  )}
                </details>
              ))}
              <button
                type="button"
                className="ghost"
                onClick={() => setQuestionCount((count) => count + 1)}
              >
                + Add question
              </button>
              <button className="primary">Create draft →</button>
            </form>
          </section>
        )}
      </div>
    </Localized>
  );
}
function ResultsCheckboxFilter({
  title,
  options,
  selected,
  onToggle,
  idPrefix,
}) {
  return (
    <Localized>
      <fieldset className="results-filter">
        <legend>{title}</legend>
        {options.length ? (
          <div className="results-filter-options">
            {options.map((option) => {
              const id = `${idPrefix}-${option.id}`;
              return (
                <div className="results-check" key={option.id}>
                  <CosmicCheckbox
                    id={id}
                    label={option.label}
                    checked={selected.includes(String(option.id))}
                    onChange={() => onToggle(String(option.id))}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <small className="muted">No options available.</small>
        )}
      </fieldset>
    </Localized>
  );
}
function Results({ api }) {
  const [items, setItems] = useState([]),
    [overview, setOverview] = useState(null),
    [loading, setLoading] = useState(true),
    [selectedClasses, setSelectedClasses] = useState([]),
    [selectedTeachers, setSelectedTeachers] = useState([]),
    [selectedQuizzes, setSelectedQuizzes] = useState([]);
  useEffect(() => {
    api(role === "student" ? "/results" : "/results/overview")
      .then((data) => (role === "student" ? setItems(data) : setOverview(data)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  function toggleSelection(setter, value) {
    setter((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  }
  const attemptsByStudentQuiz = new Map(
    (overview?.attempts || []).map((attempt) => [
      `${attempt.student_id}:${attempt.quiz_id}`,
      attempt,
    ]),
  );
  const studentQuizOptions = [
    ...new Map(
      items.map((item) => [
        item.quiz_id,
        { id: item.quiz_id, label: item.quiz },
      ]),
    ).values(),
  ];
  const teacherQuizOptions = (overview?.quizzes || [])
    .filter(
      (quiz) =>
        !selectedClasses.length ||
        selectedClasses.includes(String(quiz.class_id)),
    )
    .map((quiz) => ({
      id: quiz.id,
      label: `${quiz.title} · ${quiz.class_name}`,
    }));
  const adminQuizOptions = (overview?.quizzes || [])
    .filter(
      (quiz) =>
        (!selectedClasses.length ||
          selectedClasses.includes(String(quiz.class_id))) &&
        (!selectedTeachers.length ||
          selectedTeachers.includes(String(quiz.teacher_id))),
    )
    .map((quiz) => ({
      id: quiz.id,
      label: `${quiz.title} · ${quiz.class_name}`,
    }));
  const selectedQuizOptions =
    role === "admin" ? adminQuizOptions : teacherQuizOptions;
  const selectedTeacherOptions = (overview?.teachers || []).map((teacher) => ({
    id: teacher.id,
    label: teacher.name,
  }));
  const resultQuizzes = (overview?.quizzes || []).filter(
    (quiz) =>
      selectedClasses.includes(String(quiz.class_id)) &&
      (role !== "admin" ||
        !selectedTeachers.length ||
        selectedTeachers.includes(String(quiz.teacher_id))) &&
      (!selectedQuizzes.length || selectedQuizzes.includes(String(quiz.id))),
  );
  const resultRows =
    selectedClasses.length && overview
      ? overview.students
          .filter((student) =>
            selectedClasses.includes(String(student.class_id)),
          )
          .flatMap((student) => {
            const classQuizzes = resultQuizzes.filter(
              (quiz) => Number(quiz.class_id) === Number(student.class_id),
            );
            if (!classQuizzes.length)
              return [{ student, quiz: null, attempt: null }];
            return classQuizzes.map((quiz) => ({
              student,
              quiz,
              attempt:
                attemptsByStudentQuiz.get(`${student.student_id}:${quiz.id}`) ||
                null,
            }));
          })
      : [];
  const selectedStudentItems = selectedQuizzes.length
    ? items.filter((item) => selectedQuizzes.includes(String(item.quiz_id)))
    : items;
  return (
    <Localized>
      <section className="panel results-panel">
        <div className="panel-head">
          <div>
            <h3>Quiz results</h3>
            <p className="muted">Scores from submitted quizzes.</p>
          </div>
        </div>
        {!loading && role === "student" && (
          <div className="results-filter-bar student-results-filters">
            <ResultsCheckboxFilter
              title="Filter by quiz name"
              options={studentQuizOptions}
              selected={selectedQuizzes}
              onToggle={(value) => toggleSelection(setSelectedQuizzes, value)}
              idPrefix="student-quiz-filter"
            />
          </div>
        )}
        {!loading && role !== "student" && overview && (
          <div className="results-filter-bar">
            <ResultsCheckboxFilter
              title="Filter by class"
              options={overview.classes.map((item) => ({
                id: item.id,
                label: item.title,
              }))}
              selected={selectedClasses}
              onToggle={(value) => {
                toggleSelection(setSelectedClasses, value);
                setSelectedQuizzes([]);
              }}
              idPrefix="result-class-filter"
            />
            {role === "admin" && (
              <ResultsCheckboxFilter
                title="Filter by teacher"
                options={selectedTeacherOptions}
                selected={selectedTeachers}
                onToggle={(value) => {
                  toggleSelection(setSelectedTeachers, value);
                  setSelectedQuizzes([]);
                }}
                idPrefix="result-teacher-filter"
              />
            )}
            <ResultsCheckboxFilter
              title="Filter by quiz name"
              options={selectedQuizOptions}
              selected={selectedQuizzes}
              onToggle={(value) => toggleSelection(setSelectedQuizzes, value)}
              idPrefix="result-quiz-filter"
            />
          </div>
        )}
        {loading ? (
          <div
            className={`results-skeleton results-skeleton-${role}`}
            aria-hidden="true"
          >
            <div className="results-skeleton-header">
              {Array.from(
                { length: role === "admin" ? 8 : role === "teacher" ? 7 : 4 },
                (_, index) => (
                  <SkeletonPiece key={index} />
                ),
              )}
            </div>
            {Array.from({ length: 6 }, (_, row) => (
              <div className="results-skeleton-row" key={row}>
                {Array.from(
                  { length: role === "admin" ? 8 : role === "teacher" ? 7 : 4 },
                  (_, col) => (
                    <SkeletonPiece
                      className={col === 0 ? "skeleton-title" : ""}
                      key={col}
                    />
                  ),
                )}
              </div>
            ))}
          </div>
        ) : role === "student" ? (
          selectedStudentItems.length ? (
            <div className="table-wrap">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>QUIZ</th>
                    <th>SUBJECT</th>
                    <th>SUBMITTED</th>
                    <th>SCORE</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedStudentItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <b>{item.quiz}</b>
                      </td>
                      <td>{item.subject || "—"}</td>
                      <td>{item.submitted_at?.slice(0, 10)}</td>
                      <td>
                        <span className="score">{item.score}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty
              title="No results yet"
              text={
                items.length
                  ? "No results match the selected quizzes."
                  : "Submitted quiz scores will appear here."
              }
            />
          )
        ) : selectedClasses.length ? (
          resultRows.length ? (
            <div className="table-wrap">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>STUDENT</th>
                    <th>STUDENT CODE</th>
                    <th>CLASS</th>
                    <th>QUIZ</th>
                    {role === "admin" && <th>TEACHER</th>}
                    <th>STATUS</th>
                    <th>SCORE</th>
                    <th>SUBMITTED</th>
                  </tr>
                </thead>
                <tbody>
                  {resultRows.map(({ student, quiz, attempt }, index) => (
                    <tr
                      key={`${student.student_id}-${quiz?.id || "none"}-${index}`}
                    >
                      <td>
                        <b>{student.student}</b>
                      </td>
                      <td>{student.student_code || "—"}</td>
                      <td>{student.class_name}</td>
                      <td>{quiz?.title || "No matching quiz"}</td>
                      {role === "admin" && <td>{quiz?.teacher || "—"}</td>}
                      <td>
                        <span className={`pill ${attempt ? "green" : "amber"}`}>
                          {attempt
                            ? "Completed"
                            : quiz
                              ? "Not taken"
                              : "No matching quiz"}
                        </span>
                      </td>
                      <td>
                        {attempt ? (
                          <span className="score">{attempt.score}%</span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>{attempt?.submitted_at?.slice(0, 10) || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty
              title="No students in these classes"
              text="There are no students assigned to the selected classes."
            />
          )
        ) : (
          <div className="results-instruction">
            <b>Select at least one class</b>
            <small>
              Use the class checkboxes above to see each student’s quiz status
              and scores.
            </small>
          </div>
        )}
      </section>
    </Localized>
  );
}
function Directory({
  api,
  role,
  create,
  reload,
  deleteItem,
  setError,
  setNotice,
}) {
  const [items, setItems] = useState([]),
    [classes, setClasses] = useState([]),
    [subjects, setSubjects] = useState([]),
    [nameFilter, setNameFilter] = useState(""),
    [classFilter, setClassFilter] = useState(""),
    [editing, setEditing] = useState(null),
    [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    try {
      setItems(await api(`/users?role=${role}`));
    } catch {
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
    api("/classes")
      .then(setClasses)
      .catch(() => {});
    if (role === "teacher")
      api("/subjects")
        .then(setSubjects)
        .catch(() => {});
  }, []);
  const visibleItems = items.filter(
    (u) =>
      (!nameFilter ||
        u.name.toLocaleLowerCase().includes(nameFilter.toLocaleLowerCase())) &&
      (!classFilter ||
        String(u.class_ids || "")
          .split(",")
          .includes(String(classFilter))),
  );
  async function exportExcel() {
    const XLSX = await import("xlsx");
    const sheet = XLSX.utils.json_to_sheet(
      items.map((u) => ({
        Name: u.name,
        Username: u.username,
        Code: u.school_code || "",
        Phone: u.phone || "",
        Classes: u.class_names || "",
      })),
    );
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Students");
    XLSX.writeFile(book, "myschool-students.xlsx");
  }
  async function importExcel(file) {
    try {
      const XLSX = await import("xlsx");
      const bytes = await file.arrayBuffer();
      const book = XLSX.read(bytes, { type: "array" });
      const rowsFromSheet = XLSX.utils.sheet_to_json(
        book.Sheets[book.SheetNames[0]],
        { defval: "" },
      );
      let imported = 0;
      for (const row of rowsFromSheet) {
        const name = row.Name ?? row.name ?? row.Student ?? "";
        const username = row.Username ?? row.username ?? "";
        const password = row.Password ?? row.password ?? "";
        if (
          !String(name).trim() ||
          !String(username).trim() ||
          !String(password)
        )
          continue;
        const classValue = row.Class ?? row.Classes ?? row.class ?? "";
        const classIds = String(classValue)
          .split(",")
          .map(
            (name) =>
              classes.find(
                (c) =>
                  c.title.toLocaleLowerCase() ===
                  name.trim().toLocaleLowerCase(),
              )?.id,
          )
          .filter(Boolean);
        await api("/users", {
          method: "POST",
          body: JSON.stringify({
            role: "student",
            name: String(name).trim(),
            username: String(username).trim(),
            password: String(password),
            school_code: `R-${row.Code}` ?? row["Student code"] ?? "",
            phone: row.Phone ?? "",
            class_ids: classIds,
          }),
        });
        imported++;
      }
      await load();
      await reload();
      setNotice(
        `${imported} student${imported === 1 ? "" : "s"} imported. Include Name, Username, and Password columns in the sheet.`,
      );
    } catch (e) {
      setError(e.message);
    }
  }
  return (
    <Localized>
      <div className="content-grid">
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>{role === "student" ? "Students" : "Teachers"}</h3>
              <p className="muted">
                {role === "student"
                  ? "Manage student accounts and their class memberships."
                  : "Manage teacher accounts."}
              </p>
            </div>
            {role === "student" && (
              <div className="inline-actions">
                <button type="button" className="ghost" onClick={exportExcel}>
                  Export XLSX
                </button>
                <label className="small-button upload-button">
                  Import XLSX
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) =>
                      e.target.files?.[0] && importExcel(e.target.files[0])
                    }
                    hidden
                  />
                </label>
              </div>
            )}
          </div>
          {role === "student" && (
            <div className="filter-row">
              <label>
                Filter by name
                <input
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  placeholder="Search student names"
                />
              </label>
              <label>
                Filter by class
                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                >
                  <option value="">All classes</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
          {loading ? (
            <div
              className={`directory-skeleton ${role === "student" ? "student-directory-skeleton" : "teacher-directory-skeleton"}`}
              aria-hidden="true"
            >
              <div className="directory-head-skeleton">
                {Array.from(
                  { length: role === "student" ? 5 : 5 },
                  (_, index) => (
                    <SkeletonPiece key={index} />
                  ),
                )}
              </div>
              {Array.from({ length: 6 }, (_, row) => (
                <div className="directory-row-skeleton" key={row}>
                  {Array.from(
                    { length: role === "student" ? 5 : 5 },
                    (_, col) => (
                      <SkeletonPiece
                        className={col === 0 ? "skeleton-title" : ""}
                        key={col}
                      />
                    ),
                  )}
                </div>
              ))}
            </div>
          ) : visibleItems.length ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>NAME</th>
                    <th>USERNAME</th>
                    {role === "student" ? (
                      <th>CODE</th>
                    ) : (
                      <>
                        <th>CLASSES</th>
                        <th>SUBJECTS</th>
                      </>
                    )}
                    {role === "student" && <th>CLASS</th>}
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {visibleItems.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <span className="avatar tiny">{u.name[0]}</span>
                        <b>{u.name}</b>
                      </td>
                      <td>{u.username}</td>
                      {role === "student" ? (
                        <td>{u.school_code || "—"}</td>
                      ) : (
                        <>
                          <td>{u.class_names || "—"}</td>
                          <td>{u.subject_names || "—"}</td>
                        </>
                      )}
                      {role === "student" && (
                        <td>
                          <select
                            aria-label={`Class for ${u.name}`}
                            value={
                              String(u.class_ids || "").split(",")[0] || ""
                            }
                            onChange={async (e) => {
                              const class_ids = e.target.value
                                ? [Number(e.target.value)]
                                : [];
                              try {
                                await api(`/users/${u.id}/classes`, {
                                  method: "PUT",
                                  body: JSON.stringify({ class_ids }),
                                });
                                await load();
                                await reload();
                                setNotice(
                                  `Class assignments updated for ${u.name}.`,
                                );
                              } catch (error) {
                                setError(error.message);
                              }
                            }}
                          >
                            <option value="">No class</option>
                            {classes.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.title}
                              </option>
                            ))}
                          </select>
                        </td>
                      )}
                      <td>
                        <button
                          className="small-button"
                          onClick={() => setEditing(u)}
                        >
                          Edit
                        </button>
                        <button
                          className="icon-button"
                          onClick={async () => {
                            await deleteItem(`/users/${u.id}`, role);
                            load();
                          }}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty
              title={items.length ? "No matching students" : `No ${role}s yet`}
              text={
                items.length
                  ? "Try changing the name or class filters."
                  : `Add your first ${role} account.`
              }
            />
          )}
        </section>
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>{editing ? `Edit ${role}` : `Add ${role}`}</h3>
              <p className="muted">
                {editing
                  ? "Update account details and class assignments."
                  : "New accounts receive a starter password."}
              </p>
            </div>
          </div>
          <form
            key={editing?.id || "new-account"}
            className="stack compact"
            onSubmit={async (e) => {
              if (!editing) {
                await create(e, "user");
                await load();
                return;
              }
              e.preventDefault();
              const form = new FormData(e.currentTarget);
              const body = Object.fromEntries(form.entries());
              const classIds =
                role === "teacher"
                  ? form.getAll("class_ids").map(Number)
                  : form.get("class_id")
                    ? [Number(form.get("class_id"))]
                    : [];
              const subjectId = Number(form.get("subject_id"));
              if (role === "teacher" && (!classIds.length || !subjectId)) {
                setError(
                  "Assign at least one class and exactly one subject to this teacher.",
                );
                return;
              }
              try {
                await api(`/users/${editing.id}`, {
                  method: "PATCH",
                  body: JSON.stringify(body),
                });
                await api(`/users/${editing.id}/classes`, {
                  method: "PUT",
                  body: JSON.stringify({ class_ids: classIds }),
                });
                if (role === "teacher")
                  await api(`/users/${editing.id}/subjects`, {
                    method: "PUT",
                    body: JSON.stringify({ subject_id: subjectId }),
                  });
                setEditing(null);
                setNotice(
                  `${role === "student" ? "Student" : "Teacher"} updated.${body.password ? ` New password: ${body.password}` : ""}`,
                );
                await load();
                await reload();
              } catch (error) {
                setError(error.message);
              }
            }}
          >
            <label>
              Full name
              <input
                name="name"
                required
                placeholder="Full name"
                defaultValue={editing?.name || ""}
              />
            </label>
            <label>
              Username
              <input
                name="username"
                required
                placeholder="username"
                defaultValue={editing?.username || ""}
              />
            </label>
            {role === "student" && (
              <label>
                Student code
                <input
                  name="school_code"
                  placeholder="STU-1002"
                  defaultValue={editing?.school_code || ""}
                />
              </label>
            )}
            <label>
              Phone
              <input
                name="phone"
                placeholder="Optional"
                defaultValue={editing?.phone || ""}
              />
            </label>
            <label>
              {editing
                ? "New password (leave blank to keep current)"
                : "Set password"}
              <input
                name="password"
                type="password"
                required={!editing}
                minLength={6}
                autoComplete="new-password"
                placeholder={
                  editing
                    ? "Optional password reset"
                    : "Create a password for this account"
                }
              />
            </label>
            {role === "student" ? (
              <label>
                Assign class
                <select
                  name="class_id"
                  defaultValue={
                    editing
                      ? String(editing.class_ids || "").split(",")[0] || ""
                      : ""
                  }
                >
                  <option value="">No class yet</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <>
                <fieldset className="assignment-field">
                  <legend>
                    Assign classes (select all this teacher teaches)
                  </legend>
                  <div className="check-grid">
                    {classes.map((c) => (
                      <div className="class-option" key={c.id}>
                        <input
                          id={`teacher-class-${c.id}`}
                          className="class-toggle-input"
                          type="checkbox"
                          name="class_ids"
                          value={c.id}
                          defaultChecked={
                            editing
                              ? String(editing.class_ids || "")
                                  .split(",")
                                  .includes(String(c.id))
                              : false
                          }
                        />
                        <label
                          htmlFor={`teacher-class-${c.id}`}
                          className="check"
                        >
                          <svg
                            width="18px"
                            height="18px"
                            viewBox="0 0 18 18"
                            aria-hidden="true"
                          >
                            <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z" />
                            <polyline points="1 9 7 14 15 4" />
                          </svg>
                        </label>
                        <label
                          htmlFor={`teacher-class-${c.id}`}
                          className="class-option-label"
                        >
                          {c.title}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
                <label>
                  Assign one subject
                  <select
                    name="subject_id"
                    required
                    defaultValue={
                      editing
                        ? String(editing.subject_ids || "").split(",")[0] || ""
                        : ""
                    }
                  >
                    <option value="" disabled>
                      Choose subject
                    </option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            )}
            {!editing && <input type="hidden" name="kind" value={role} />}
            <button className="primary">
              {editing ? "Save changes" : `Add ${role} →`}
            </button>
            {editing ? (
              <button
                type="button"
                className="ghost"
                onClick={() => setEditing(null)}
              >
                Cancel edit
              </button>
            ) : (
              <small className="muted">
                Give the new account holder their username and this password.
              </small>
            )}
          </form>
        </section>
      </div>
    </Localized>
  );
}
function Subjects({ api, create, deleteItem }) {
  const [items, setItems] = useState([]),
    [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    try {
      setItems(await api("/subjects"));
    } catch {
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);
  return (
    <Localized>
      <div className="content-grid">
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>Subjects</h3>
              <p className="muted">Subjects offered by your school.</p>
            </div>
          </div>
          {loading ? (
            <div className="subjects-skeleton" aria-hidden="true">
              {Array.from({ length: 5 }, (_, index) => (
                <div className="class-row subject-skeleton-row" key={index}>
                  <SkeletonPiece className="skeleton-class-swatch" />
                  <span className="row-main">
                    <SkeletonPiece className="skeleton-title" />
                    <SkeletonPiece className="skeleton-subtitle" />
                  </span>
                  <SkeletonPiece className="skeleton-delete" />
                </div>
              ))}
            </div>
          ) : (
            items.map((s) => (
              <div className="class-row" key={s.id}>
                <span
                  className="class-swatch"
                  style={{ background: s.color }}
                ></span>
                <span className="row-main">
                  <b>{s.title}</b>
                  <small>Teachers: {s.teacher_names || "None assigned"}</small>
                </span>
                <button
                  className="icon-button"
                  onClick={async () => {
                    await deleteItem(`/subjects/${s.id}`, "subject");
                    load();
                  }}
                >
                  ×
                </button>
              </div>
            ))
          )}
          {!loading && !items.length && (
            <Empty
              title="No subjects yet"
              text="Add a subject to organize classes and quizzes."
            />
          )}
        </section>
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>Add subject</h3>
              <p className="muted">Create a new school subject.</p>
            </div>
          </div>
          <form
            className="stack compact"
            onSubmit={async (e) => {
              await create(e, "subjects");
              load();
            }}
          >
            <label>
              Subject name
              <input name="title" required placeholder="e.g. English" />
            </label>
            <label>
              Color
              <input name="color" type="color" defaultValue="#35c8a0" />
            </label>
            <button className="primary">Add subject →</button>
          </form>
        </section>
      </div>
    </Localized>
  );
}
createRoot(document.getElementById("root")).render(<App />);
