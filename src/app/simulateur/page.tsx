"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./simulateur.module.css";

/* ──────────────────────────────────────────────────────────────────────
   MOCK USER DATA — would come from the Bankin' app in production.
   For this case study, it represents 12+ months of real transaction
   history that the simulator pre-fills automatically (the core
   differentiator: no form, the app already knows). */

type Contrat = "CDI" | "CDD" | "AE";
type Structure = "micro" | "eurl" | "sasu" | "sas" | "sarl";
type Annees = "lt1" | "1to3" | "3plus";
type Situation = "locataire" | "proprietaire";
type TypeBien = "neuf" | "ancien";

interface PersonAE {
  structure: Structure;
  annees: Annees;
  caMensuel: number;
  chargesProMensuel: number;
}

interface UserData {
  prenom: string;
  conjoint: string;
  enCouple: boolean;
  enfants: number;
  situation: Situation;
  primoAccedant: boolean;

  contrat1: Contrat;
  revenu1: number;          // €/mois — salaire net (CDI/CDD)
  ae1: PersonAE;            // utilisé si contrat1 === "AE"

  contrat2: Contrat;
  revenu2: number;
  ae2: PersonAE;

  revenusStable: number;
  charges: number;          // crédits en cours
  loyerActuel: number;
  depensesTotales: number;
  epargneMensuelle: number;
  epargneDispo: number;

  // Projet
  typeBien: TypeBien;
  travaux: number;
  duree: number;            // années (10-25)
  apportProjet: number;     // € mobilisés (≤ épargneDispo)

  ville: string;
}

const DEFAULT_AE: PersonAE = {
  structure: "micro",
  annees: "3plus",
  caMensuel: 4000,
  chargesProMensuel: 1000,
};

const INITIAL_USER: UserData = {
  prenom: "Sophie",
  conjoint: "Thomas",
  enCouple: true,
  enfants: 2,
  situation: "locataire",
  primoAccedant: true,

  contrat1: "CDI",
  revenu1: 2500,
  ae1: DEFAULT_AE,

  contrat2: "CDI",
  revenu2: 2000,
  ae2: DEFAULT_AE,

  revenusStable: 26,
  charges: 0,
  loyerActuel: 1400,
  depensesTotales: 3700,
  epargneMensuelle: 800,
  epargneDispo: 22000,

  typeBien: "neuf",
  travaux: 0,
  duree: 25,
  apportProjet: 20000,

  ville: "Lyon",
};

/* Revenue actually counted by banks. Indépendants : 70 % du bénéfice
   net (CA - charges pro). CDD : 85 %. CDI : 100 %. */
function personRevenue(contrat: Contrat, revenu: number, ae: PersonAE): number {
  if (contrat === "AE") {
    const benefice = Math.max(0, ae.caMensuel - ae.chargesProMensuel);
    return benefice * 0.7;
  }
  if (contrat === "CDD") return revenu * 0.85;
  return revenu;
}

function computeTotalRevenue(u: UserData): number {
  let total = personRevenue(u.contrat1, u.revenu1, u.ae1);
  if (u.enCouple) total += personRevenue(u.contrat2, u.revenu2, u.ae2);
  return Math.round(total);
}

function describeContrats(u: UserData): string {
  const left = u.contrat1 === "AE" ? "AE" : u.contrat1;
  if (!u.enCouple) return left;
  const right = u.contrat2 === "AE" ? "AE" : u.contrat2;
  return `${left} + ${right}`;
}

interface CatBudget {
  id: string;
  nom: string;
  emoji: string;
  actuel: number;
  fixe?: boolean;
}

const CATEGORIES: CatBudget[] = [
  { id: "logement",        nom: "Logement",                emoji: "🏠", actuel: 1400, fixe: true },
  { id: "courses",         nom: "Courses",                 emoji: "🛒", actuel: 680 },
  { id: "enfants",         nom: "Enfants (crèche, école)", emoji: "👶", actuel: 420 },
  { id: "loisirs",         nom: "Loisirs & sorties",       emoji: "🎬", actuel: 580 },
  { id: "vacances",        nom: "Vacances (lissé)",        emoji: "✈️", actuel: 250 },
  { id: "epargne_enfants", nom: "Épargne enfants",         emoji: "💰", actuel: 200 },
  { id: "essence",         nom: "Essence & transport",     emoji: "⛽", actuel: 150 },
  { id: "courant",         nom: "Dépenses non prévues",    emoji: "🛠️", actuel: 170 },
  { id: "epargne",         nom: "Épargne mensuelle",       emoji: "💵", actuel: 800 },
];

/* ── Helpers ─────────────────────────────────────────────────────── */

function formatEUR(n: number, opts?: { withSign?: boolean }): string {
  const sign = opts?.withSign && n > 0 ? "+ " : "";
  return `${sign}${Math.round(n).toLocaleString("fr-FR")} €`;
}

function capacityFromMonthly(mensualite: number, dureeAns: number, tauxAnnuel: number): number {
  const r = tauxAnnuel / 100 / 12;
  const n = dureeAns * 12;
  return Math.floor((mensualite * (1 - Math.pow(1 + r, -n))) / r);
}

function ptzFromKids(kids: number): number {
  const table = [0, 12000, 15000, 18000];
  return table[Math.min(Math.max(kids, 0), 3)];
}

/* ── Scenarios ───────────────────────────────────────────────────── */

interface Scenario {
  key: "sereine" | "cible" | "ambitieux";
  name: string;
  tag: string;
  mensualite: number;       // € total monthly payment toward the loan
  capital: number;          // € amount borrowed
  apport: number;
  ptz: number;
  prixMax: number;          // € max property price
  duree: number;            // years
  taux: number;             // %
  endettementPct: number;   // %
  budgetAdjustments: Record<string, number>; // category id → new amount
  impactLine: string;
}

function buildScenarios(u: UserData): Scenario[] {
  // Taux selon la durée (grille indicative octobre 2026)
  const tauxParDuree: Record<number, number> = { 10: 3.3, 15: 3.45, 20: 3.6, 25: 3.75 };
  const taux = tauxParDuree[u.duree] ?? 3.75;
  const duree = u.duree;
  const apport = u.apportProjet;
  const ptz = u.primoAccedant && u.situation === "locataire" ? ptzFromKids(u.enfants) : 0;
  const totalRev = computeTotalRevenue(u);
  // Plafond réglementaire HCSF : 35 % d'endettement TOUTES dettes confondues.
  // La mensualité disponible pour le prêt = (totalRev × 35 %) − charges crédits en cours.
  const maxMensualite = Math.max(0, totalRev * 0.35 - u.charges);

  const tiers: { key: Scenario["key"]; name: string; tag: string; pct: number; adjustments: Record<string, number>; impactLine: string }[] = [
    {
      key: "sereine",
      name: "Sereine",
      tag: "On garde notre rythme de vie",
      pct: 0.27,
      adjustments: {},
      impactLine: "Mensualité < loyer actuel. Marge qui grimpe, aucun arbitrage nécessaire.",
    },
    {
      key: "cible",
      name: "Cible",
      tag: "Le bon équilibre",
      pct: 0.33,
      adjustments: { loisirs: 300, vacances: 150 },
      impactLine: "+85 €/mois sur le logement. Suggestion : couper Loisirs et Vacances pour préserver la marge.",
    },
    {
      key: "ambitieux",
      name: "Ambitieux",
      tag: "Au plafond légal (35 %)",
      pct: 0.35,
      adjustments: { loisirs: 250, vacances: 120, epargne_enfants: 80 },
      impactLine: "+175 €/mois sur le logement. Marge tendue, plusieurs arbitrages nécessaires.",
    },
  ];

  return tiers.map((t) => {
    // Le pct est un taux d'endettement TOTAL (mensualité + crédits en cours).
    // Ce qui reste pour la mensualité du prêt = totalRev × pct − charges.
    // Si on ne soustrait pas les charges, tous les scénarios s'écrasent
    // sur le plafond 35 % dès que les charges montent ou que les revenus
    // sont élevés — chaque tier perd sa différenciation.
    const targetMensualite = Math.max(0, Math.round(totalRev * t.pct - u.charges));
    const mensualite = Math.min(targetMensualite, Math.round(maxMensualite));
    const capital = capacityFromMonthly(mensualite, duree, taux);
    const prixMax = capital + apport + ptz;
    return {
      key: t.key,
      name: t.name,
      tag: t.tag,
      mensualite,
      capital,
      apport,
      ptz,
      prixMax,
      duree,
      taux,
      endettementPct: Math.round(t.pct * 100),
      budgetAdjustments: t.adjustments,
      impactLine: t.impactLine,
    };
  });
}

/* ── Stress tests ────────────────────────────────────────────────── */

interface StressOption {
  id: string;
  emoji: string;
  title: string;
  description: string;
  monthlyImpact: number; // € change on solde fin de mois (negative = worse)
  mitigation: string;
}

function buildStressOptions(u: UserData): StressOption[] {
  return [
    {
      id: "conge_parental",
      emoji: "👶",
      title: `${u.prenom} passe à 80 %`,
      description: "Congé parental ou temps partiel pendant 12 mois.",
      monthlyImpact: -450,
      mitigation: "Votre épargne de précaution (4 200 €) couvre la baisse pendant 9 mois.",
    },
    {
      id: "troisieme_enfant",
      emoji: "🍼",
      title: u.enfants === 0 ? "Un premier enfant" : "Un nouvel enfant",
      description: "Crèche + temps partiel pendant les premiers mois.",
      monthlyImpact: -680,
      mitigation: "Ajustement budget Loisirs + activation épargne projet pour 18 mois.",
    },
    {
      id: "taux_up",
      emoji: "📈",
      title: "Taux remonte à 4,5 %",
      description: "Renégociation impossible avant 2 ans.",
      monthlyImpact: -180,
      mitigation: "Impact absorbé sans ajustement de votre rythme actuel.",
    },
    {
      id: "chomage",
      emoji: "💼",
      title: "6 mois de chômage",
      description: u.enCouple
        ? `${u.conjoint} traverse une période sans emploi.`
        : "Vous traversez une période sans emploi.",
      monthlyImpact: -820,
      mitigation: "Allocation chômage + assurance prêt = solde tenu pendant 8 mois.",
    },
  ];
}

/* ── Page component ──────────────────────────────────────────────── */

type Step = 0 | 1 | 2 | 3 | 4 | 5;
type Moment = "bebe" | "loyer" | "espace" | "projet";

const STEP_LABELS = [
  "Votre moment",
  "Votre point de départ",
  "Vos 3 scénarios",
  "Impact sur votre quotidien",
  "Et si… ?",
  "Et maintenant ?",
];

const MOMENT_OPTIONS: { id: Moment; emoji: string; title: string; desc: string }[] = [
  {
    id: "bebe",
    emoji: "🍼",
    title: "Un bébé arrive (ou est arrivé)",
    desc: "On veut un vrai chez-soi pour la famille avant l'école.",
  },
  {
    id: "loyer",
    emoji: "💸",
    title: "Marre de payer un loyer",
    desc: "On donne 1 400 € par mois à quelqu'un d'autre — autant rembourser le nôtre.",
  },
  {
    id: "espace",
    emoji: "🌳",
    title: "Besoin de plus d'espace",
    desc: "L'appart devient trop petit pour la famille qui grandit.",
  },
  {
    id: "projet",
    emoji: "🎯",
    title: "Projet à 2-3 ans",
    desc: "On se renseigne sereinement, sans s'engager dans rien.",
  },
];

export default function SimulateurPage() {
  const [step, setStep] = useState<Step>(0);
  const [moment, setMoment] = useState<Moment | null>(null);
  const [user, setUser] = useState<UserData>(INITIAL_USER);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const scenarios = useMemo(() => buildScenarios(user), [user]);
  const [scenarioKey, setScenarioKey] = useState<Scenario["key"]>("cible");
  const [activeStresses, setActiveStresses] = useState<Set<string>>(new Set());
  /* customBudget : overrides utilisateur sur la colonne "Avec ce projet".
     Reset à chaque changement de scénario pour repartir des suggestions. */
  const [customBudget, setCustomBudget] = useState<Record<string, number>>({});
  /* customActualBudget : overrides utilisateur sur la colonne "Aujourd'hui".
     Persiste tant que l'utilisateur ne reset pas — c'est SES dépenses
     réelles, pas une suggestion liée à un scénario. */
  const [customActualBudget, setCustomActualBudget] = useState<Record<string, number>>({});

  const scenario = scenarios.find((s) => s.key === scenarioKey)!;
  const totalRevenue = computeTotalRevenue(user);

  const goNext = () => setStep((s) => (Math.min(s + 1, 5) as Step));
  const goPrev = () => setStep((s) => (Math.max(s - 1, 0) as Step));

  const progress = ((step + 1) / 6) * 100;

  /* Catégories actives selon le profil : on cache les lignes "enfants" et
     "épargne enfants" si l'utilisateur a déclaré 0 enfant. Pas pertinent
     dans son budget réel, et ça pollue la décision.
     Les lignes logement et épargne reçoivent leur défaut depuis le profil
     utilisateur (user.loyerActuel, user.epargneMensuelle) pour rester
     synchro avec ce qui est déclaré dans le panneau d'édition. */
  const activeCategories = useMemo(
    () => CATEGORIES
      .filter((c) =>
        user.enfants > 0 ? true : c.id !== "enfants" && c.id !== "epargne_enfants"
      )
      .map((c) => {
        if (c.id === "logement") return { ...c, actuel: user.loyerActuel };
        if (c.id === "epargne") return { ...c, actuel: user.epargneMensuelle };
        return c;
      }),
    [user.enfants, user.epargneMensuelle, user.loyerActuel],
  );

  // Compute the new budget for the selected scenario, with optional
  // user overrides (customBudget takes priority over scenario suggestion).
  // Idem pour la colonne "Aujourd'hui" : l'utilisateur peut corriger
  // les montants par défaut si son budget réel diffère.
  const newBudget = useMemo(() => {
    return activeCategories.map((cat) => {
      const actuel = customActualBudget[cat.id] != null ? customActualBudget[cat.id] : cat.actuel;
      let nouveau: number;
      if (customBudget[cat.id] != null) {
        /* Override utilisateur prioritaire sur tout, y compris pour
           le logement. Cas d'usage : un seul des deux conjoints
           contracte le prêt, donc la mensualité dans le budget du foyer
           est inférieure à la projection mécanique du scénario. */
        nouveau = customBudget[cat.id];
      } else if (cat.id === "logement") {
        nouveau = scenario.mensualite;
      } else if (scenario.budgetAdjustments[cat.id] != null) {
        /* L'arbitrage suggéré est un PLAFOND : si l'utilisateur dépense
           déjà moins que la suggestion, on garde son montant. Sinon on
           lui imposerait une hausse en prétendant l'aider à couper. */
        nouveau = Math.min(actuel, scenario.budgetAdjustments[cat.id]);
      } else {
        nouveau = actuel;
      }
      return { ...cat, actuel, nouveau };
    });
  }, [scenario, customBudget, customActualBudget, activeCategories]);
  const hasCustomEdits = Object.keys(customBudget).length > 0;

  /* Solde = revenus − charges crédits − dépenses budget.
     Les charges crédits sont des prélèvements automatiques fixes
     pour des crédits en cours (auto, perso, etc.), à part des
     catégories de dépenses quotidiennes. */
  const soldeActuel =
    totalRevenue - user.charges - newBudget.reduce((sum, c) => sum + c.actuel, 0);
  const soldeNouveau =
    totalRevenue - user.charges - newBudget.reduce((sum, c) => sum + c.nouveau, 0);

  const stressOptions = useMemo(() => buildStressOptions(user), [user]);

  /* Deux concepts à ne pas confondre :
     - precautionRecommandee : norme finance perso = 3 mois de revenus,
       l'épargne de précaution que la banque (et le bon sens) recommande
       AVANT et APRÈS l'achat pour faire face aux aléas.
     - liquideApresApport : ce qu'il reste réellement de liquide une fois
       l'apport mobilisé. C'est le vrai matelas disponible pour absorber
       un choc — souvent bien inférieur à la précaution recommandée. */
  const precautionRecommandee = Math.round(totalRevenue * 3);
  const liquideApresApport = Math.max(0, user.epargneDispo - user.apportProjet);
  /* Pour le calcul des stress-tests on utilise le liquide réel
     (c'est ce qu'on peut effectivement dépenser), pas la recommandation. */
  const cushionAfterApport = liquideApresApport;

  /* Verdict dynamique à partir des chiffres réels (au lieu d'un
     texte rassurant hardcodé). Combine le solde de base déjà projeté
     pour le scénario sélectionné avec l'impact des stress activés —
     c'est ce que ressentirait vraiment l'utilisateur. */
  function evaluateStress(combinedMonthlyImpact: number) {
    const soldeApres = soldeNouveau + combinedMonthlyImpact; // impact est ≤ 0
    const drainMensuel = Math.max(0, -soldeApres);
    if (drainMensuel === 0) {
      return {
        tone: "good" as const,
        soldeApres,
        months: Infinity,
        text: "Absorbé sans toucher à votre épargne — votre solde reste à l'équilibre ou positif.",
      };
    }
    if (cushionAfterApport === 0) {
      return {
        tone: "bad" as const,
        soldeApres,
        months: 0,
        text: `Non absorbable : ${formatEUR(drainMensuel)} / mois à trouver, et aucun liquide restant après l'apport.`,
      };
    }
    const months = Math.floor(cushionAfterApport / drainMensuel);
    if (months >= 24) {
      return {
        tone: "good" as const,
        soldeApres,
        months,
        text: `Couvert ${months}+ mois par votre matelas après apport (${formatEUR(cushionAfterApport)}). Vous avez largement le temps de vous adapter.`,
      };
    }
    if (months >= 12) {
      return {
        tone: "okay" as const,
        soldeApres,
        months,
        text: `Tient ~${months} mois sur votre matelas après apport (${formatEUR(cushionAfterApport)}). Le temps d'ajuster vos dépenses.`,
      };
    }
    if (months >= 6) {
      return {
        tone: "warn" as const,
        soldeApres,
        months,
        text: `Tendu : votre matelas après apport (${formatEUR(cushionAfterApport)}) ne tient que ${months} mois. Prévoyez un plan B.`,
      };
    }
    if (months >= 1) {
      return {
        tone: "bad" as const,
        soldeApres,
        months,
        text: `Risqué : matelas épuisé en ${months} mois. Le projet ne survit pas sans rebond rapide.`,
      };
    }
    return {
      tone: "bad" as const,
      soldeApres,
      months: 0,
      text: `Non absorbable : ${formatEUR(drainMensuel)} / mois à trouver, votre matelas (${formatEUR(cushionAfterApport)}) part en moins d'un mois.`,
    };
  }
  const isReady = user.epargneDispo >= 15000 && scenario.endettementPct <= 33;

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark}>B</span>
          <span>Bankin'</span>
        </Link>
        <Link href="/" className={styles.back}>
          <span>←</span>
          <span className={styles.backLong}>&nbsp;Retour à l'accueil</span>
          <span className={styles.backShort}>&nbsp;Accueil</span>
        </Link>
      </header>

      <div className={styles.progressBar}>
        <div className={styles.progressInner}>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <div className={styles.progressMeta}>
            <strong>Étape {step + 1} / 6</strong>
            <span className={styles.progressLabel}> — {STEP_LABELS[step]}</span>
          </div>
        </div>
      </div>

      <main className={styles.main}>
        {step === 0 && (
          <div className={styles.mainNarrow}>
            <span className={styles.eyebrow}>Sans engagement · 2 min</span>
            <h1 className={styles.title}>
              Être propriétaire ? Vous y pensez…<br />
              <em>On regarde ensemble si c'est faisable.</em>
            </h1>
            <p className={styles.lead}>
              On adapte le calcul à votre situation — pas à un dossier bancaire.
              Pourquoi ce projet aujourd'hui ?
            </p>
            <div className={styles.momentGrid}>
              {MOMENT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`${styles.momentCard} ${moment === opt.id ? styles.selected : ""}`}
                  onClick={() => setMoment(opt.id)}
                >
                  <span className={styles.momentEmoji}>{opt.emoji}</span>
                  <span className={styles.momentBody}>
                    <h3>{opt.title}</h3>
                    <p>{opt.desc}</p>
                  </span>
                </button>
              ))}
            </div>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={goNext}
                disabled={!moment}
                style={{ opacity: moment ? 1 : 0.4, pointerEvents: moment ? "auto" : "none" }}
              >
                Continuer →
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className={styles.mainNarrow}>
            <span className={styles.eyebrow}>D'après vos comptes Bankin'</span>
            <h1 className={styles.title}>
              {user.prenom}{user.enCouple ? ` & ${user.conjoint}` : ""}, <em>voici votre point de départ.</em>
            </h1>
            <p className={styles.lead}>
              Pas de saisie : on a tout pris dans votre app. Vous pourrez ajuster
              avant les scénarios si quelque chose a changé.
            </p>

            <div className={styles.departGrid}>
              <div className={`${styles.dataCard} ${styles.highlight}`}>
                <div className={styles.dataLabel}>Revenus nets du foyer</div>
                <div className={styles.dataValue}>{formatEUR(totalRevenue)}</div>
                <div className={`${styles.dataSub} ${styles.dataSubGood}`}>
                  Stables depuis {user.revenusStable} mois ({describeContrats(user)})
                </div>
                {user.charges > 0 && (
                  <div
                    className={styles.dataSub}
                    style={{ marginTop: 8, color: "#FFC966", fontWeight: 700 }}
                  >
                    ⚠️ − {formatEUR(user.charges)} / mois en charges crédits
                  </div>
                )}
              </div>

              <div className={styles.dataCard}>
                <div className={styles.dataLabel}>Dépenses moyennes / mois</div>
                <div className={styles.dataValue}>{formatEUR(user.depensesTotales)}</div>
                <div className={styles.dataSub}>
                  Sur 12 mois · 7 catégories suivies
                </div>
                <div className={styles.dataDonut} />
              </div>

              <div className={styles.dataCard}>
                <div className={styles.dataLabel}>Épargne mensuelle</div>
                <div className={styles.dataValue}>{formatEUR(user.epargneMensuelle)}</div>
                <div className={`${styles.dataSub} ${styles.dataSubGood}`}>
                  Taux d'épargne {Math.round((user.epargneMensuelle / totalRevenue) * 100)} % · Bien au-dessus de la moyenne FR
                </div>
              </div>

              <div className={styles.dataCard}>
                <div className={styles.dataLabel}>Épargne disponible</div>
                <div className={styles.dataValue}>{formatEUR(user.epargneDispo)}</div>
                <div className={styles.dataSub}>
                  Sur vos comptes épargne · Mobilisable pour apport
                </div>
              </div>
            </div>

            {!editingUser ? (
              <button
                type="button"
                className={styles.editToggle}
                onClick={() => setEditingUser({ ...user })}
              >
                Ces chiffres ne sont plus à jour ? Ajuster manuellement →
              </button>
            ) : (
              <EditPanel
                draft={editingUser}
                onChange={setEditingUser}
                onSave={() => {
                  setUser(editingUser);
                  setEditingUser(null);
                }}
                onCancel={() => setEditingUser(null)}
              />
            )}

            <div className={styles.actions}>
              <button type="button" className={styles.btnGhost} onClick={goPrev}>← Retour</button>
              <button type="button" className={styles.btnPrimary} onClick={goNext}>
                Voir mes 3 scénarios →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={styles.mainWide}>
            <span className={styles.eyebrow}>Pas un chiffre — un éventail</span>
            <h1 className={styles.title}>
              3 scénarios pour <em>vous projeter</em>.
            </h1>
            <p className={styles.lead}>
              Chacun avec un impact différent sur votre quotidien. Vous choisissez,
              vous changez d'avis — le bon scénario, c'est le vôtre.
            </p>

            {/* Garde-fou pédago : explique pourquoi un crédit en cours
                ne change pas le solde mais réduit le prix max. */}
            {user.charges > 0 && (
              <div
                className={styles.scenarioNote}
                style={{
                  margin: "0 auto 24px",
                  maxWidth: 820,
                  padding: "12px 16px",
                  background: "#FFF6E5",
                  border: "1px solid #FFE0AC",
                  borderRadius: 12,
                  color: "#7A4400",
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                💡 <strong>Vos {formatEUR(user.charges)} de crédits en cours</strong> n'apparaissent
                pas dans le solde : ils sont absorbés par la mensualité, qui baisse pour que le total
                d'endettement reste à 27 / 33 / 35 %. Conséquence : un crédit en cours{" "}
                <strong>ne réduit pas votre reste à vivre, il réduit le prix du bien que vous pouvez acheter.</strong>
              </div>
            )}

            <div className={styles.scenarios}>
              {scenarios.map((s) => {
                const isSelected = s.key === scenarioKey;
                const isRecommended = s.key === "cible";
                /* Solde aujourd'hui : référence stable, mêmes dépenses
                   actuelles pour les trois cards. */
                const sumActuel = activeCategories.reduce((sum, c) => {
                  const baseActuel = customActualBudget[c.id] != null ? customActualBudget[c.id] : c.actuel;
                  return sum + baseActuel;
                }, 0);
                /* Solde projeté : MÊME formule qu'à l'étape Impact —
                   logement → mensualité du scénario, autres lignes =
                   arbitrages suggérés si présents, sinon valeurs
                   actuelles. Sinon la card promet un solde différent
                   de ce que l'utilisateur verra en cliquant "Choisir". */
                const sumProj = activeCategories.reduce((sum, c) => {
                  if (c.id === "logement") return sum + s.mensualite;
                  const baseActuel = customActualBudget[c.id] != null ? customActualBudget[c.id] : c.actuel;
                  /* L'arbitrage suggéré est un PLAFOND, pas un remplacement.
                     Si l'utilisateur dépense déjà moins, on garde sa valeur —
                     sinon on lui "imposerait" une hausse en disant l'inverse. */
                  if (s.budgetAdjustments[c.id] != null) {
                    return sum + Math.min(baseActuel, s.budgetAdjustments[c.id]);
                  }
                  return sum + baseActuel;
                }, 0);
                const soldeAujourdhui = totalRevenue - user.charges - sumActuel;
                const soldeProj = totalRevenue - user.charges - sumProj;
                const soldeDelta = soldeProj - soldeAujourdhui;
                /* Pour le breakdown : on sépare 'vie + épargne actuelle'
                   (somme exacte du tableau de l'étape Impact, colonne
                   Aujourd'hui) et 'économies' (savings réels apportés
                   par les arbitrages suggérés du scénario). Sinon la
                   ligne 'Vie + épargne' du breakdown ne matche pas le
                   tableau et l'utilisateur ne peut pas vérifier. */
                const sumActuelOther = sumActuel - (
                  customActualBudget["logement"] != null
                    ? customActualBudget["logement"]
                    : (activeCategories.find((c) => c.id === "logement")?.actuel ?? 0)
                );
                const economiesScenario = sumActuelOther - (sumProj - s.mensualite);
                return (
                  <button
                    key={s.key}
                    type="button"
                    className={`${styles.scenarioCard} ${isSelected ? styles.selected : ""} ${isRecommended ? styles.recommended : ""}`}
                    onClick={() => {
                      setScenarioKey(s.key);
                      setCustomBudget({});
                    }}
                  >
                    <div className={styles.scenarioName}>{s.name}</div>
                    <div className={styles.scenarioTag}>{s.tag}</div>
                    <div className={styles.scenarioPrice}>{formatEUR(s.prixMax)}</div>
                    <div className={styles.scenarioPriceLbl}>Bien jusqu'à</div>

                    <div className={styles.scenarioBody}>
                      <div className={styles.scenarioRow}>
                        <span>Mensualité</span>
                        <strong>{formatEUR(s.mensualite)}</strong>
                      </div>
                      <div className={styles.scenarioRow}>
                        <span>Sur {s.duree} ans · taux {s.taux.toString().replace(".", ",")} %</span>
                        <strong>{s.endettementPct} % endett.</strong>
                      </div>
                      <div className={`${styles.scenarioRow} ${styles.solde} ${soldeProj < 0 ? styles.bad : ""}`}>
                        <span>Solde fin de mois</span>
                        <strong>{formatEUR(soldeProj, { withSign: true })}</strong>
                      </div>
                      <div
                        className={styles.scenarioRow}
                        style={{ opacity: 0.7, fontSize: 13, marginTop: -4 }}
                      >
                        <span>
                          Aujourd'hui : {formatEUR(soldeAujourdhui, { withSign: true })}
                        </span>
                        <strong style={{ color: soldeDelta >= 0 ? "#1F9D7A" : "#D14545" }}>
                          {soldeDelta >= 0 ? "+ " : "− "}{formatEUR(Math.abs(soldeDelta))}
                        </strong>
                      </div>
                    </div>

                    {/* Composition du solde — rend la math explicite
                        pour que le chiffre +X soit toujours vérifiable
                        à la main par l'utilisateur. */}
                    <div
                      style={{
                        marginTop: 6,
                        padding: "8px 10px",
                        background: "rgba(125, 90, 255, 0.05)",
                        borderRadius: 8,
                        fontSize: 12.5,
                        lineHeight: 1.35,
                        textAlign: "left",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: 0.4,
                          color: "#6E6A95",
                          marginBottom: 4,
                        }}
                      >
                        Comment ce solde se calcule
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", rowGap: 1, columnGap: 10 }}>
                        <span>Revenus du foyer</span>
                        <strong style={{ color: "#1F9D7A" }}>+ {formatEUR(totalRevenue)}</strong>
                        {user.charges > 0 && (
                          <>
                            <span>Crédits en cours</span>
                            <strong style={{ color: "#E07800" }}>− {formatEUR(user.charges)}</strong>
                          </>
                        )}
                        <span>Mensualité prêt</span>
                        <strong>− {formatEUR(s.mensualite)}</strong>
                        <span>Vie + épargne (actuelle)</span>
                        <strong>− {formatEUR(sumActuelOther)}</strong>
                        {economiesScenario > 0 && (
                          <>
                            <span>Économies du scénario</span>
                            <strong style={{ color: "#1F9D7A" }}>
                              + {formatEUR(economiesScenario)}
                            </strong>
                          </>
                        )}
                        <span
                          style={{
                            borderTop: "1px dashed rgba(110, 106, 149, 0.3)",
                            marginTop: 4,
                            paddingTop: 4,
                            fontWeight: 700,
                          }}
                        >
                          = Solde
                        </span>
                        <strong
                          style={{
                            borderTop: "1px dashed rgba(110, 106, 149, 0.3)",
                            marginTop: 4,
                            paddingTop: 4,
                            color: soldeProj < 0 ? "#D14545" : "#1F9D7A",
                          }}
                        >
                          {formatEUR(soldeProj, { withSign: true })}
                        </strong>
                      </div>
                    </div>

                    <div className={styles.scenarioImpact}>
                      <strong>Impact :</strong> {s.impactLine}
                    </div>

                    <div className={styles.scenarioCta}>
                      {isSelected ? "✓ Scénario choisi" : "Choisir ce scénario"}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className={styles.actions}>
              <button type="button" className={styles.btnGhost} onClick={goPrev}>← Retour</button>
              <button type="button" className={styles.btnPrimary} onClick={goNext}>
                Voir l'impact sur votre quotidien →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className={styles.mainWide}>
            <span className={styles.eyebrow}>Le vrai test : votre vie de tous les jours</span>
            <h1 className={styles.title}>
              Votre quotidien <em>avec ce projet.</em>
            </h1>
            <p className={styles.lead}>
              Pas un score bancaire — vos vraies catégories Bankin', avant / après.
              Les arbitrages sont visibles et négociables.
            </p>

            <div className={styles.impactHeader}>
              <div className="left">
                <small>Scénario sélectionné</small>
                <h2>{scenario.name} · {formatEUR(scenario.prixMax)}</h2>
                <p>Mensualité {formatEUR(scenario.mensualite)} sur {scenario.duree} ans</p>
              </div>
              <div className="right">
                <strong>{scenario.endettementPct} %</strong>
                <span>Taux d'endettement</span>
                <button type="button" className={styles.impactChangeBtn} onClick={() => setStep(2)}>
                  Changer de scénario
                </button>
              </div>
            </div>

            <div className={styles.budgetHint}>
              <span>
                💡 <strong>Vos arbitrages, votre choix.</strong> Cliquez sur n'importe
                quel montant pour l'ajuster, y compris le loyer actuel et la mensualité.
                Utile par exemple si un seul des deux contracte le prêt.
              </span>
              {hasCustomEdits && (
                <button type="button" className={styles.budgetReset} onClick={() => setCustomBudget({})}>
                  ↺ Réinitialiser
                </button>
              )}
            </div>

            <div className={styles.budget}>
              <div className={styles.budgetHead}>
                <span>Catégorie</span>
                <span>Aujourd'hui</span>
                <span>Avec ce projet</span>
                <span style={{ textAlign: "right" }}>Δ</span>
              </div>

              {/* Revenu row — info read-only en haut du tableau */}
              <div className={styles.budgetRow} style={{ background: "#F7F8FF" }}>
                <div className={styles.budgetCat}>
                  <span>💼</span>
                  <span>Revenus du foyer</span>
                </div>
                <div className={styles.budgetVal} style={{ color: "#00C48C" }}>
                  + {formatEUR(totalRevenue)}
                </div>
                <div className={styles.budgetValDiff} style={{ color: "#00C48C" }}>
                  <span className={styles.budgetValLocked}>+ {formatEUR(totalRevenue)}</span>
                </div>
                <div className={styles.budgetDelta}>—</div>
              </div>

              {/* Charges crédits row — affichée uniquement si > 0 */}
              {user.charges > 0 && (
                <div className={styles.budgetRow} style={{ background: "#FFF6E5" }}>
                  <div className={styles.budgetCat}>
                    <span>💳</span>
                    <span>Charges crédits en cours</span>
                  </div>
                  <div className={styles.budgetVal} style={{ color: "#E07800" }}>
                    − {formatEUR(user.charges)}
                  </div>
                  <div className={styles.budgetValDiff} style={{ color: "#E07800" }}>
                    <span className={styles.budgetValLocked}>− {formatEUR(user.charges)}</span>
                  </div>
                  <div className={styles.budgetDelta}>—</div>
                </div>
              )}

              {newBudget.map((c) => {
                const diff = c.nouveau - c.actuel;
                const cls = diff > 0 ? styles.up : diff < 0 ? styles.down : styles.flat;
                /* Tout est éditable, y compris le logement. Cas d'usage
                   logement aujourd'hui : Bankin connait le loyer via les
                   prélèvements mais l'utilisateur peut vouloir corriger.
                   Cas d'usage logement avec ce projet : un seul des deux
                   contracte le prêt, donc la mensualité réellement payée
                   par le foyer est inférieure à la projection du scénario. */
                return (
                  <div key={c.id} className={styles.budgetRow}>
                    <div className={styles.budgetCat}>
                      <span>{c.emoji}</span>
                      <span>{c.nom}</span>
                    </div>
                    <div className={styles.budgetVal}>
                      <label className={styles.budgetEditWrap}>
                        <input
                          type="number"
                          className={styles.budgetEdit}
                          value={c.actuel}
                          onChange={(e) =>
                            setCustomActualBudget((prev) => ({
                              ...prev,
                              [c.id]: Math.max(0, Number(e.target.value) || 0),
                            }))
                          }
                          min={0}
                          step={10}
                          aria-label={`Montant ${c.nom} aujourd'hui`}
                        />
                        <span className={styles.budgetEditUnit}>€</span>
                      </label>
                    </div>
                    <div className={`${styles.budgetValDiff} ${cls}`}>
                      <label className={styles.budgetEditWrap}>
                        <input
                          type="number"
                          className={styles.budgetEdit}
                          value={c.nouveau}
                          onChange={(e) =>
                            setCustomBudget((prev) => ({
                              ...prev,
                              [c.id]: Math.max(0, Number(e.target.value) || 0),
                            }))
                          }
                          min={0}
                          step={10}
                          aria-label={`Montant ${c.nom} avec ce projet`}
                        />
                        <span className={styles.budgetEditUnit}>€</span>
                      </label>
                      {diff > 0 && <span>↑</span>}
                      {diff < 0 && <span>↓</span>}
                    </div>
                    <div className={`${styles.budgetDelta} ${cls}`}>
                      {diff === 0 ? "—" : formatEUR(diff, { withSign: true })}
                    </div>
                  </div>
                );
              })}
              <div className={styles.budgetFoot}>
                <span className="label">Solde fin de mois</span>
                <span className="val">{formatEUR(soldeActuel, { withSign: true })}</span>
                <span className={`valDiff ${soldeNouveau < 0 ? "bad" : ""}`}>
                  {formatEUR(soldeNouveau, { withSign: true })}
                </span>
                <span style={{ textAlign: "right", color: "#6E6A95" }}>
                  {formatEUR(soldeNouveau - soldeActuel, { withSign: true })}
                </span>
              </div>
            </div>

            <div className={styles.actions}>
              <button type="button" className={styles.btnGhost} onClick={goPrev}>← Retour</button>
              <button type="button" className={styles.btnPrimary} onClick={goNext}>
                Maintenant, et si… ? →
              </button>
            </div>
          </div>
        )}

        {step === 4 && (() => {
          /* Baseline = solde projeté avec le scénario sélectionné,
             sans aucun stress. C'est le contexte de départ que la
             page doit honnêtement reconnaître. */
          const baselineVerdict = evaluateStress(0);
          const baselineSousTension = soldeNouveau < 0;

          const activeImpactSum = stressOptions
            .filter((opt) => activeStresses.has(opt.id))
            .reduce((sum, opt) => sum + opt.monthlyImpact, 0);
          const combinedVerdict = evaluateStress(activeImpactSum);

          const toneBg: Record<"good" | "okay" | "warn" | "bad", string> = {
            good: "#E8F8EF",
            okay: "#FFF6E5",
            warn: "#FFEAD2",
            bad: "#FFE1DD",
          };
          const toneBorder: Record<"good" | "okay" | "warn" | "bad", string> = {
            good: "#9FDDB8",
            okay: "#FFE0AC",
            warn: "#FFC78A",
            bad: "#F5A39A",
          };
          const toneText: Record<"good" | "okay" | "warn" | "bad", string> = {
            good: "#1B6A38",
            okay: "#7A4400",
            warn: "#9B4D00",
            bad: "#8C1F12",
          };

          return (
          <div className={styles.mainNarrow}>
            <span className={styles.eyebrow}>Stress-test</span>
            <h1 className={styles.title}>
              Et si <em>la vie change</em> en cours de route ?
            </h1>
            <p className={styles.lead}>
              C'est la peur qu'on entend le plus chez les jeunes propriétaires.
              Vérifions que votre projet tient le coup dans les vrais scénarios de vie.
            </p>

            {/* Baseline : si le solde projeté est déjà négatif AVANT
                tout aléa, on doit le dire — sinon la suite est un
                mensonge. On expose aussi la précaution recommandée
                (3 mois de revenus) face au liquide réel restant après
                apport pour que l'utilisateur voie le gap. */}
            {(() => {
              const precautionSousNorme = liquideApresApport < precautionRecommandee;
              const niveau = baselineSousTension ? "alert" : precautionSousNorme ? "warn" : "info";
              const bg = niveau === "alert" ? "#FFEAD2" : niveau === "warn" ? "#FFF6E5" : "#EEF7FF";
              const border = niveau === "alert" ? "#FFC78A" : niveau === "warn" ? "#FFE0AC" : "#CFE3FB";
              const color = niveau === "alert" ? "#7A4400" : niveau === "warn" ? "#7A4400" : "#1B3A6B";
              return (
                <div
                  style={{
                    background: bg,
                    border: `1px solid ${border}`,
                    borderRadius: 14,
                    padding: "14px 18px",
                    marginBottom: 20,
                    fontSize: 14,
                    lineHeight: 1.5,
                    color,
                  }}
                >
                  <strong style={{ display: "block", marginBottom: 4 }}>
                    {baselineSousTension
                      ? `⚠️ Votre projet ${scenario.name} démarre déjà sous tension`
                      : precautionSousNorme
                      ? `Point de départ : votre projet ${scenario.name} — matelas faible`
                      : `Point de départ : votre projet ${scenario.name}`}
                  </strong>
                  Solde projeté <strong>{formatEUR(soldeNouveau, { withSign: true })} / mois</strong>{" "}
                  · Liquide restant après apport{" "}
                  <strong>{formatEUR(liquideApresApport)}</strong>{" "}
                  (précaution recommandée : <strong>{formatEUR(precautionRecommandee)}</strong>, soit 3 mois de revenus).
                  {baselineSousTension && (
                    <>
                      {" "}Avant même tout aléa, il manque{" "}
                      <strong>{formatEUR(-soldeNouveau)} / mois</strong> à votre budget.
                      Les stress-tests ci-dessous viennent <em>en plus</em>.
                    </>
                  )}
                  {!baselineSousTension && precautionSousNorme && (
                    <>
                      {" "}Il vous manque{" "}
                      <strong>{formatEUR(precautionRecommandee - liquideApresApport)}</strong>{" "}
                      pour atteindre la précaution recommandée — à reconstituer dans les mois
                      qui suivent l'achat avant que la vie ne change.
                    </>
                  )}
                </div>
              );
            })()}

            <div className={styles.stressGrid}>
              {stressOptions.map((opt) => {
                const active = activeStresses.has(opt.id);
                const optVerdict = evaluateStress(opt.monthlyImpact);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`${styles.stressCard} ${active ? styles.active : ""}`}
                    onClick={() => {
                      setActiveStresses((prev) => {
                        const next = new Set(prev);
                        if (next.has(opt.id)) next.delete(opt.id);
                        else next.add(opt.id);
                        return next;
                      });
                    }}
                  >
                    <span className={styles.stressEmoji}>{opt.emoji}</span>
                    <div className={styles.stressBody}>
                      <h4>{opt.title}</h4>
                      <p>{opt.description}</p>
                      {active && (
                        <>
                          <span className={styles.stressImpact}>
                            Impact : {formatEUR(opt.monthlyImpact)} / mois · solde après stress{" "}
                            {formatEUR(optVerdict.soldeApres, { withSign: true })} / mois
                          </span>
                          <span
                            style={{
                              display: "block",
                              marginTop: 8,
                              padding: "8px 12px",
                              borderRadius: 10,
                              background: toneBg[optVerdict.tone],
                              border: `1px solid ${toneBorder[optVerdict.tone]}`,
                              color: toneText[optVerdict.tone],
                              fontSize: 13,
                              fontWeight: 600,
                              lineHeight: 1.45,
                            }}
                          >
                            {optVerdict.tone === "good" ? "✓ " : optVerdict.tone === "okay" ? "● " : "⚠️ "}
                            {optVerdict.text}
                          </span>
                        </>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Verdict combiné : dynamique, basé sur les vrais chiffres. */}
            {activeStresses.size === 0 ? (
              <div
                style={{
                  background: baselineSousTension ? "#FFE1DD" : "#F4F0FF",
                  border: `1px solid ${baselineSousTension ? "#F5A39A" : "#D6CCFF"}`,
                  borderRadius: 14,
                  padding: "14px 18px",
                  color: baselineSousTension ? "#8C1F12" : "#4A4680",
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                {baselineSousTension ? (
                  <>
                    <strong>Aucun aléa testé — et déjà dans le rouge.</strong>{" "}
                    Avant d'aller plus loin, revenez à la step Impact et coupez des
                    dépenses, ou choisissez un scénario moins endetté.
                  </>
                ) : (
                  <>
                    <strong>Aucun stress-test activé.</strong> Cliquez les scénarios
                    qui vous inquiètent — l'app calcule combien de mois votre matelas
                    après apport ({formatEUR(cushionAfterApport)}) absorbe le choc.
                  </>
                )}
              </div>
            ) : (
              <div
                style={{
                  background: toneBg[combinedVerdict.tone],
                  border: `1px solid ${toneBorder[combinedVerdict.tone]}`,
                  borderRadius: 14,
                  padding: "14px 18px",
                  color: toneText[combinedVerdict.tone],
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                <strong style={{ display: "block", marginBottom: 4 }}>
                  {combinedVerdict.tone === "good" && "✓ Combinés, ces aléas sont absorbables."}
                  {combinedVerdict.tone === "okay" && "● Combinés, ces aléas sont absorbables — mais sur un temps limité."}
                  {combinedVerdict.tone === "warn" && "⚠️ Combinés, ces aléas mettent le projet sous tension."}
                  {combinedVerdict.tone === "bad" && "✗ Combinés, ces aléas ne sont pas absorbables avec votre épargne actuelle."}
                </strong>
                Solde projeté avec ces {activeStresses.size} aléa{activeStresses.size > 1 ? "s" : ""}{" "}
                : <strong>{formatEUR(combinedVerdict.soldeApres, { withSign: true })} / mois</strong>.{" "}
                {combinedVerdict.text}
              </div>
            )}

            <div className={styles.actions}>
              <button type="button" className={styles.btnGhost} onClick={goPrev}>← Retour</button>
              <button type="button" className={styles.btnPrimary} onClick={goNext}>
                Voir ma roadmap →
              </button>
            </div>
          </div>
          );
        })()}

        {step === 5 && (
          <div className={styles.mainWide}>
            {isReady ? (
              <>
                <div className={styles.verdict}>
                  <span className={styles.verdictTag}>✓ Vous êtes prêts</span>
                  <h2>
                    {user.prenom}{user.enCouple ? ` & ${user.conjoint}` : ""}, votre scénario {scenario.name.toLowerCase()} est solide.
                  </h2>

                  {/* Les 3 chiffres clés en gros — c'est la conclusion
                      du simulateur, on veut qu'ils sautent aux yeux
                      avant le texte rassurant. */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: 18,
                      margin: "20px 0 16px",
                      position: "relative",
                    }}
                  >
                    {[
                      { label: "Bien jusqu'à", value: formatEUR(scenario.prixMax) },
                      { label: "Mensualité", value: formatEUR(scenario.mensualite) + " / mois" },
                      { label: "Taux d'endettement", value: `${scenario.endettementPct} %` },
                    ].map((stat, i) => (
                      <div
                        key={stat.label}
                        style={{
                          background: "rgba(255, 255, 255, 0.12)",
                          border: "1px solid rgba(255, 255, 255, 0.18)",
                          borderRadius: 14,
                          padding: "14px 18px",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 800,
                            letterSpacing: 1.2,
                            textTransform: "uppercase",
                            color: "rgba(255, 255, 255, 0.75)",
                            marginBottom: 6,
                          }}
                        >
                          {stat.label}
                        </div>
                        <div
                          style={{
                            fontSize: i === 0 ? 28 : 24,
                            fontWeight: 900,
                            letterSpacing: -0.8,
                            lineHeight: 1.05,
                            color: "#fff",
                          }}
                        >
                          {stat.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <p>
                    Votre dossier est rassurant pour une banque : {describeContrats(user).toLowerCase().includes("cdi") ? "contrats stables" : "revenus solides"}
                    {user.primoAccedant ? ", primo-accédants éligibles PTZ" : ""}.
                  </p>
                </div>

                {/* Récap profil — pour que l'utilisateur ait sous les yeux
                    tout ce qui a été pris en compte avant de cliquer sur
                    une action (courtier, banque, suivi). */}
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #E4ECFB",
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: 1.2,
                      textTransform: "uppercase",
                      color: "#6E6A95",
                      marginBottom: 14,
                    }}
                  >
                    Votre profil en bref
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: 16,
                    }}
                  >
                    {[
                      {
                        icon: "👨‍👩‍👧‍👦",
                        label: "Foyer",
                        value: `${user.prenom}${user.enCouple ? ` & ${user.conjoint}` : ""}${user.enfants > 0 ? ` · ${user.enfants} enfant${user.enfants > 1 ? "s" : ""}` : ""}`,
                      },
                      {
                        icon: "💼",
                        label: "Revenus",
                        value: `${formatEUR(totalRevenue)} / mois · ${describeContrats(user)}`,
                      },
                      {
                        icon: "🏠",
                        label: "Statut",
                        value: `${user.situation === "locataire" ? "Locataire" : "Propriétaire"}${user.primoAccedant ? " · primo-accédant" : ""}`,
                      },
                      {
                        icon: "💵",
                        label: "Épargne",
                        value: `${formatEUR(user.epargneDispo)} dispo · ${formatEUR(user.epargneMensuelle)} / mois`,
                      },
                      {
                        icon: "🎯",
                        label: "Projet",
                        value: `Bien ${user.typeBien === "neuf" ? "neuf" : "ancien"} à ${user.ville} · ${user.duree} ans`,
                      },
                      {
                        icon: "💰",
                        label: "Apport mobilisé",
                        value: `${formatEUR(user.apportProjet)}${scenario.ptz > 0 ? ` + PTZ ${formatEUR(scenario.ptz)}` : ""}`,
                      },
                    ].map((item) => (
                      <div key={item.label} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{item.icon}</span>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#6E6A95", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 2 }}>
                            {item.label}
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#1B1A3B", lineHeight: 1.35 }}>
                            {item.value}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <h3 style={{ margin: "0 0 16px", fontSize: 20, fontWeight: 900 }}>
                  La suite, comme vous préférez
                </h3>
                <div className={styles.options}>
                  <a href="#" className={styles.optionCard}>
                    <span className={styles.optionEmoji}>🤝</span>
                    <h4>Faire négocier par un courtier</h4>
                    <p>
                      Un courtier — Pretto (en ligne, 100+ banques) ou un courtier
                      local à {user.ville} — défend votre dossier. Gratuit pour
                      vous, vous gardez la main, vous n'êtes pas engagés.
                    </p>
                    <span className={styles.optionCta}>Comparer les courtiers →</span>
                  </a>
                  <a href="#" className={styles.optionCard}>
                    <span className={styles.optionEmoji}>🏦</span>
                    <h4>Aller voir votre banque actuelle</h4>
                    <p>
                      On vous prépare la checklist du dossier (bulletins, contrats,
                      relevés, projet). Votre conseiller voit le rapport Bankin'
                      et a un point de comparaison clair.
                    </p>
                    <span className={styles.optionCta}>Préparer mon dossier →</span>
                  </a>
                  <a href="#" className={styles.optionCard}>
                    <span className={styles.optionEmoji}>📌</span>
                    <h4>Garder ce projet en mémoire</h4>
                    <p>
                      On suit l'évolution de vos comptes. Si votre situation
                      change favorablement, on vous le dit.
                    </p>
                    <span className={styles.optionCta}>Enregistrer mon projet →</span>
                  </a>
                </div>
              </>
            ) : (
              <>
                <div className={`${styles.verdict} ${styles.notReady}`}>
                  <span className={styles.verdictTag}>Encore un peu de chemin</span>
                  <h2>Vous y êtes presque — voici comment accélérer.</h2>
                  <p>
                    Avec votre rythme actuel d'épargne, le scénario {scenario.name.toLowerCase()}
                    {" "}reste atteignable. On vous propose 3 leviers, choisissez celui
                    qui rentre dans votre vie.
                  </p>
                </div>

                <div className={styles.roadmap}>
                  <h3>Votre roadmap pour atteindre {formatEUR(scenario.prixMax)}</h3>
                  <p className="sub">
                    Il vous manque environ <strong>9 600 €</strong> d'apport. Voici 3 chemins.
                  </p>

                  <div className={styles.roadmapList}>
                    <button type="button" className={`${styles.roadmapItem} ${styles.recommended}`}>
                      <div className="left">
                        <h5>Activer l'épargne immo automatique · 150 €/mois</h5>
                        <p>Bloqué avant que ça ne soit dépensé. Vous y êtes dans 8 mois.</p>
                      </div>
                      <div className="right">
                        <strong>8 mois</strong>
                        <span>Recommandé</span>
                      </div>
                    </button>

                    <button type="button" className={styles.roadmapItem}>
                      <div className="left">
                        <h5>Garder votre rythme actuel · 930 €/mois</h5>
                        <p>Sans rien changer à vos habitudes. Vous y êtes dans 10 mois.</p>
                      </div>
                      <div className="right">
                        <strong>10 mois</strong>
                        <span>Sans effort</span>
                      </div>
                    </button>

                    <button type="button" className={styles.roadmapItem}>
                      <div className="left">
                        <h5>Réduire Loisirs de 80 €/mois (vous y passez 580 €)</h5>
                        <p>Petit ajustement, vous gardez 86 % du budget actuel. Vous y êtes dans 9 mois.</p>
                      </div>
                      <div className="right">
                        <strong>9 mois</strong>
                        <span>Discret</span>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className={styles.actions}>
              <button type="button" className={styles.btnGhost} onClick={goPrev}>← Retour</button>
              <Link href="/" className={styles.btnPrimary}>Terminer →</Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   EDIT PANEL — Manual override of the Bankin'-derived data
   ────────────────────────────────────────────────────────────────── */

interface EditPanelProps {
  draft: UserData;
  onChange: (next: UserData) => void;
  onSave: () => void;
  onCancel: () => void;
}

function EditPanel({ draft, onChange, onSave, onCancel }: EditPanelProps) {
  const update = (patch: Partial<UserData>) => onChange({ ...draft, ...patch });
  const updateAE = (which: 1 | 2, patch: Partial<PersonAE>) => {
    if (which === 1) update({ ae1: { ...draft.ae1, ...patch } });
    else update({ ae2: { ...draft.ae2, ...patch } });
  };
  const contrats: Contrat[] = ["CDI", "CDD", "AE"];
  const contratLabel = (c: Contrat) => (c === "AE" ? "Indépendant" : c);

  const structures: { id: Structure; label: string }[] = [
    { id: "micro", label: "Micro-entr." },
    { id: "eurl", label: "EURL" },
    { id: "sasu", label: "SASU" },
    { id: "sas", label: "SAS" },
    { id: "sarl", label: "SARL" },
  ];
  const anneesOpts: { id: Annees; label: string }[] = [
    { id: "lt1", label: "< 1 an" },
    { id: "1to3", label: "1–3 ans" },
    { id: "3plus", label: "3+ ans ✓" },
  ];

  const renderPersonAE = (which: 1 | 2, ae: PersonAE) => (
    <>
      <div className={styles.editGroup}>
        <label className={styles.editLabel}>Structure juridique</label>
        <div className={styles.editSubChips}>
          {structures.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`${styles.editSubChip} ${ae.structure === s.id ? styles.editSubChipActive : ""}`}
              onClick={() => updateAE(which, { structure: s.id })}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.editGroup}>
        <label className={styles.editLabel}>Années d'activité</label>
        <div className={styles.editSubChips}>
          {anneesOpts.map((a) => (
            <button
              key={a.id}
              type="button"
              className={`${styles.editSubChip} ${ae.annees === a.id ? styles.editSubChipActive : ""}`}
              onClick={() => updateAE(which, { annees: a.id })}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.editGroup}>
        <label className={styles.editLabel}>Chiffre d'affaires mensuel net</label>
        <div className={styles.editInputWrap}>
          <input
            type="number"
            className={styles.editInput}
            value={ae.caMensuel}
            onChange={(e) => updateAE(which, { caMensuel: Number(e.target.value) || 0 })}
            min={0}
            step={100}
          />
          <span className={styles.editUnit}>€ / mois</span>
        </div>
      </div>
      <div className={styles.editGroup} style={{ marginBottom: 0 }}>
        <label className={styles.editLabel}>Charges professionnelles mensuelles</label>
        <div className={styles.editInputWrap}>
          <input
            type="number"
            className={styles.editInput}
            value={ae.chargesProMensuel}
            onChange={(e) => updateAE(which, { chargesProMensuel: Number(e.target.value) || 0 })}
            min={0}
            step={50}
          />
          <span className={styles.editUnit}>€ / mois</span>
        </div>
        <div className={styles.editComputed}>
          <span>Revenu net estimé (banques, 70 % du bénéfice)</span>
          <strong>{formatEUR(Math.max(0, ae.caMensuel - ae.chargesProMensuel) * 0.7)} /&nbsp;mois</strong>
        </div>
      </div>
    </>
  );

  const renderPersonSalarie = (which: 1 | 2) => {
    const revenu = which === 1 ? draft.revenu1 : draft.revenu2;
    const setRevenu = (v: number) =>
      which === 1 ? update({ revenu1: v }) : update({ revenu2: v });
    return (
      <div className={styles.editGroup} style={{ marginBottom: 0 }}>
        <label className={styles.editLabel}>Salaire net mensuel</label>
        <div className={styles.editInputWrap}>
          <input
            type="number"
            className={styles.editInput}
            value={revenu}
            onChange={(e) => setRevenu(Number(e.target.value) || 0)}
            min={0}
            step={50}
          />
          <span className={styles.editUnit}>€ / mois</span>
        </div>
      </div>
    );
  };

  // ── Contextual "Bon à savoir" hint based on contract combo
  const c1 = draft.contrat1;
  const c2 = draft.enCouple ? draft.contrat2 : null;
  const hasAE = c1 === "AE" || c2 === "AE";
  const bothAE = c1 === "AE" && c2 === "AE";
  const hasCDD = c1 === "CDD" || c2 === "CDD";
  const bothCDI = c1 === "CDI" && (c2 === null || c2 === "CDI");

  let infoTone: "green" | "orange" | "yellow" = "yellow";
  let infoTitle = "💡 Bon à savoir";
  let infoBody: React.ReactNode = null;

  if (bothCDI) {
    infoTone = "green";
    infoBody = (
      <>
        ✅ <strong>CDI{draft.enCouple ? " + CDI" : ""}</strong> : profil le plus
        favorable pour les banques. Accès au crédit optimal.{" "}
        {draft.situation === "locataire" && (
          <>Locataire depuis 2+ ans sans avoir été propriétaire → éligible au <strong>PTZ</strong>{draft.enfants > 0 ? ` (jusqu'à ${ptzFromKids(draft.enfants).toLocaleString("fr-FR")} €)` : ""}.</>
        )}
      </>
    );
  } else if (bothAE) {
    infoTone = "orange";
    infoBody = (
      <>
        🔴 <strong>Deux profils indépendants</strong> : dossier très complexe.
        Les banques exigent <strong>au minimum 3 ans d'activité</strong> pour
        chacun, et un apport de 20 à 30 % est fortement recommandé.
      </>
    );
  } else if (hasAE) {
    infoTone = "orange";
    infoBody = (
      <>
        ⚠️ <strong>Profil indépendant</strong> : minimum 3 ans d'activité
        nécessaires. Les revenus sont pris à <strong>70 % du bénéfice net</strong>{" "}
        (CA − charges pro). Un apport renforce le dossier.
      </>
    );
  } else if (hasCDD) {
    infoTone = "yellow";
    infoBody = (
      <>
        📋 <strong>CDD</strong> : prêt possible si la période d'essai est
        terminée. Les revenus sont pris à <strong>85 %</strong> par les
        banques.{c2 && (c2 === "CDI" || c1 === "CDI") ? " Le CDI de l'autre personne rassure les banques." : ""}
      </>
    );
  }

  return (
    <div className={styles.editPanel}>
      <div className={styles.editPanelHead}>
        <h3>Ajuster vos informations</h3>
        <button type="button" className={styles.editPanelClose} onClick={onCancel}>
          Fermer ✕
        </button>
      </div>

      {/* ── FOYER ─────────────────────────────────────────────────── */}
      <div className={styles.editSectionTitle}>Foyer</div>

      <div className={styles.editGroup}>
        <label className={styles.editLabel}>Vous empruntez…</label>
        <div className={styles.editSeg}>
          <button
            type="button"
            className={`${styles.editSegBtn} ${!draft.enCouple ? styles.editSegActive : ""}`}
            onClick={() => update({ enCouple: false })}
          >
            Seul(e)
          </button>
          <button
            type="button"
            className={`${styles.editSegBtn} ${draft.enCouple ? styles.editSegActive : ""}`}
            onClick={() => update({ enCouple: true })}
          >
            À deux
          </button>
        </div>
      </div>

      <div className={styles.editGroup}>
        <label className={styles.editLabel}>Situation actuelle</label>
        <div className={styles.editSeg}>
          <button
            type="button"
            className={`${styles.editSegBtn} ${draft.situation === "locataire" ? styles.editSegActive : ""}`}
            onClick={() => update({ situation: "locataire" })}
          >
            🏠 Locataire
          </button>
          <button
            type="button"
            className={`${styles.editSegBtn} ${draft.situation === "proprietaire" ? styles.editSegActive : ""}`}
            onClick={() => update({ situation: "proprietaire" })}
          >
            🏡 Propriétaire
          </button>
        </div>
      </div>

      <div className={styles.editGroup}>
        <label className={styles.editLabel}>Enfants à charge</label>
        <div className={styles.editChips}>
          {[0, 1, 2, 3].map((n) => (
            <button
              key={n}
              type="button"
              className={`${styles.editChip} ${draft.enfants === n ? styles.editChipActive : ""}`}
              onClick={() => update({ enfants: n })}
            >
              {n === 0 ? "Aucun" : n === 3 ? "3+" : String(n)}
            </button>
          ))}
        </div>
      </div>

      {/* ── PERSONNE 1 ────────────────────────────────────────────── */}
      <div className={styles.editPerson}>
        <div className={styles.editPersonHead}>
          <span className={styles.editPersonDot}>V</span>
          <span>Vous — {contratLabel(draft.contrat1)}</span>
        </div>
        <div className={styles.editGroup}>
          <label className={styles.editLabel}>Statut professionnel</label>
          <div className={styles.editSeg}>
            {contrats.map((c) => (
              <button
                key={c}
                type="button"
                className={`${styles.editSegBtn} ${draft.contrat1 === c ? styles.editSegActive : ""}`}
                onClick={() => update({ contrat1: c })}
              >
                {contratLabel(c)}
              </button>
            ))}
          </div>
        </div>
        {draft.contrat1 === "AE" ? renderPersonAE(1, draft.ae1) : renderPersonSalarie(1)}
      </div>

      {/* ── PERSONNE 2 (si couple) ────────────────────────────────── */}
      {draft.enCouple && (
        <div className={styles.editPerson}>
          <div className={styles.editPersonHead}>
            <span className={`${styles.editPersonDot} ${styles.dotC}`}>C</span>
            <span>Conjoint(e) — {contratLabel(draft.contrat2)}</span>
          </div>
          <div className={styles.editGroup}>
            <label className={styles.editLabel}>Statut professionnel</label>
            <div className={styles.editSeg}>
              {contrats.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`${styles.editSegBtn} ${draft.contrat2 === c ? styles.editSegActive : ""}`}
                  onClick={() => update({ contrat2: c })}
                >
                  {contratLabel(c)}
                </button>
              ))}
            </div>
          </div>
          {draft.contrat2 === "AE" ? renderPersonAE(2, draft.ae2) : renderPersonSalarie(2)}
        </div>
      )}

      <div className={styles.editGroup}>
        <label className={styles.editLabel}>Charges mensuelles du foyer (crédits en cours)</label>
        <div className={styles.editInputWrap}>
          <input
            type="number"
            className={styles.editInput}
            value={draft.charges}
            onChange={(e) => update({ charges: Number(e.target.value) || 0 })}
            min={0}
            step={50}
          />
          <span className={styles.editUnit}>€ / mois</span>
        </div>
      </div>

      {/* Bon à savoir contextuel */}
      {infoBody && (
        <div
          className={`${styles.editInfoBox} ${
            infoTone === "green"
              ? styles.editInfoBoxGreen
              : infoTone === "orange"
              ? styles.editInfoBoxOrange
              : ""
          }`}
        >
          <div className={styles.infoTitle}>{infoTitle}</div>
          <div>{infoBody}</div>
        </div>
      )}

      {/* ── ÉPARGNE ───────────────────────────────────────────────── */}
      <div className={styles.editSectionTitle}>Épargne</div>

      <div className={styles.editTwoCol}>
        <div className={styles.editGroup} style={{ marginBottom: 0 }}>
          <label className={styles.editLabel}>Épargne disponible totale</label>
          <div className={styles.editInputWrap}>
            <input
              type="number"
              className={styles.editInput}
              value={draft.epargneDispo}
              onChange={(e) => update({ epargneDispo: Number(e.target.value) || 0 })}
              min={0}
              step={500}
            />
            <span className={styles.editUnit}>€</span>
          </div>
        </div>
        <div className={styles.editGroup} style={{ marginBottom: 0 }}>
          <label className={styles.editLabel}>Épargne mensuelle</label>
          <div className={styles.editInputWrap}>
            <input
              type="number"
              className={styles.editInput}
              value={draft.epargneMensuelle}
              onChange={(e) => update({ epargneMensuelle: Number(e.target.value) || 0 })}
              min={0}
              step={50}
            />
            <span className={styles.editUnit}>€ / mois</span>
          </div>
        </div>
      </div>

      {/* ── PROJET ────────────────────────────────────────────────── */}
      <div className={styles.editSectionTitle}>Projet immobilier</div>

      <div className={styles.editGroup}>
        <label className={styles.editLabel}>Type de bien</label>
        <div className={styles.editSeg}>
          <button
            type="button"
            className={`${styles.editSegBtn} ${draft.typeBien === "neuf" ? styles.editSegActive : ""}`}
            onClick={() => update({ typeBien: "neuf" })}
          >
            🏗️ Neuf
          </button>
          <button
            type="button"
            className={`${styles.editSegBtn} ${draft.typeBien === "ancien" ? styles.editSegActive : ""}`}
            onClick={() => update({ typeBien: "ancien" })}
          >
            🏚️ Ancien
          </button>
        </div>
      </div>

      <div className={styles.editGroup}>
        <label className={styles.editLabel}>Travaux prévus ?</label>
        <div className={styles.editSeg}>
          <button
            type="button"
            className={`${styles.editSegBtn} ${draft.travaux === 0 ? styles.editSegActive : ""}`}
            onClick={() => update({ travaux: 0 })}
          >
            Non
          </button>
          <button
            type="button"
            className={`${styles.editSegBtn} ${draft.travaux > 0 ? styles.editSegActive : ""}`}
            onClick={() => update({ travaux: draft.travaux > 0 ? draft.travaux : 15000 })}
          >
            Oui
          </button>
        </div>
        {draft.travaux > 0 && (
          <div className={styles.editInputWrap} style={{ marginTop: 10 }}>
            <input
              type="number"
              className={styles.editInput}
              value={draft.travaux}
              onChange={(e) => update({ travaux: Number(e.target.value) || 0 })}
              min={0}
              step={1000}
            />
            <span className={styles.editUnit}>€ (montant estimé)</span>
          </div>
        )}
      </div>

      <div className={styles.editGroup}>
        <label className={styles.editLabel}>C'est…</label>
        <div className={styles.editSeg}>
          <button
            type="button"
            className={`${styles.editSegBtn} ${draft.primoAccedant ? styles.editSegActive : ""}`}
            onClick={() => update({ primoAccedant: true })}
          >
            Ma 1ère acquisition
          </button>
          <button
            type="button"
            className={`${styles.editSegBtn} ${!draft.primoAccedant ? styles.editSegActive : ""}`}
            onClick={() => update({ primoAccedant: false })}
          >
            Un 2ème achat
          </button>
        </div>
      </div>

      <div className={styles.editSliderWrap}>
        <div className={styles.editSliderRow}>
          <label className={styles.editLabel}>Durée du prêt</label>
          <strong>{draft.duree} ans</strong>
        </div>
        <input
          type="range"
          className={styles.editSlider}
          min={10}
          max={25}
          step={5}
          value={draft.duree}
          onChange={(e) => update({ duree: Number(e.target.value) })}
        />
        <div className={styles.editSliderBounds}>
          <span>10 ans</span>
          <span>15 ans</span>
          <span>20 ans</span>
          <span>25 ans</span>
        </div>
      </div>

      <div className={styles.editGroup} style={{ marginTop: 18, marginBottom: 0 }}>
        <label className={styles.editLabel}>Apport personnel</label>
        <div className={styles.editInputWrap}>
          <input
            type="number"
            className={styles.editInput}
            value={draft.apportProjet}
            onChange={(e) => update({ apportProjet: Number(e.target.value) || 0 })}
            min={0}
            step={1000}
          />
          <span className={styles.editUnit}>€ (mobilisé pour ce projet)</span>
        </div>
        {draft.apportProjet > draft.epargneDispo && (
          <div className={styles.editComputed} style={{ background: "#FFF6E5", color: "#7A4400" }}>
            <span>⚠️ L'apport dépasse l'épargne disponible totale ({formatEUR(draft.epargneDispo)}).</span>
          </div>
        )}
      </div>

      <div className={styles.editActions}>
        <button type="button" className={styles.editBtnSave} onClick={onSave}>
          Enregistrer mes ajustements
        </button>
        <button type="button" className={styles.editBtnCancel} onClick={onCancel}>
          Annuler
        </button>
      </div>
    </div>
  );
}
