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
  { id: "logement",        nom: "Logement",            emoji: "🏠", actuel: 1400, fixe: true },
  { id: "courses",         nom: "Courses",             emoji: "🛒", actuel: 680 },
  { id: "enfants",         nom: "Enfants (crèche, école)", emoji: "👶", actuel: 420 },
  { id: "loisirs",         nom: "Loisirs & sorties",   emoji: "🎬", actuel: 580 },
  { id: "vacances",        nom: "Vacances (lissé)",    emoji: "✈️", actuel: 250 },
  { id: "epargne_enfants", nom: "Épargne enfants",     emoji: "💰", actuel: 200 },
  { id: "courant",         nom: "Reste à vivre",       emoji: "🍽️", actuel: 170 },
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
  const maxMensualite = Math.max(0, totalRev * 0.35 - u.charges);

  const tiers: { key: Scenario["key"]; name: string; tag: string; pct: number; adjustments: Record<string, number>; impactLine: string }[] = [
    {
      key: "sereine",
      name: "Sereine",
      tag: "On garde notre rythme de vie",
      pct: 0.27,
      adjustments: {},
      impactLine: "Vous gardez ~95 % de votre rythme actuel. Pas de gros arbitrage.",
    },
    {
      key: "cible",
      name: "Cible",
      tag: "Le bon équilibre",
      pct: 0.33,
      adjustments: { loisirs: 300, vacances: 150 },
      impactLine: "Vous réduisez Loisirs (−280 €) et Vacances (−100 €) par mois.",
    },
    {
      key: "ambitieux",
      name: "Ambitieux",
      tag: "Au plafond légal (35 %)",
      pct: 0.35,
      adjustments: { loisirs: 250, vacances: 120, epargne_enfants: 80 },
      impactLine: "Loisirs, vacances et épargne enfants réduits. Confort minimum.",
    },
  ];

  return tiers.map((t) => {
    const targetMensualite = Math.round(totalRev * t.pct);
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
      title: "Un 3ᵉ enfant",
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

  const scenario = scenarios.find((s) => s.key === scenarioKey)!;
  const totalRevenue = computeTotalRevenue(user);

  const goNext = () => setStep((s) => (Math.min(s + 1, 5) as Step));
  const goPrev = () => setStep((s) => (Math.max(s - 1, 0) as Step));

  const progress = ((step + 1) / 6) * 100;

  // Compute the new budget for the selected scenario, with optional
  // user overrides (customBudget takes priority over scenario suggestion).
  const newBudget = useMemo(() => {
    return CATEGORIES.map((cat) => {
      let nouveau: number;
      if (cat.id === "logement") {
        nouveau = scenario.mensualite;
      } else if (customBudget[cat.id] != null) {
        nouveau = customBudget[cat.id];
      } else if (scenario.budgetAdjustments[cat.id] != null) {
        nouveau = scenario.budgetAdjustments[cat.id];
      } else {
        nouveau = cat.actuel;
      }
      return { ...cat, nouveau };
    });
  }, [scenario, customBudget]);
  const hasCustomEdits = Object.keys(customBudget).length > 0;

  const soldeActuel = totalRevenue - CATEGORIES.reduce((sum, c) => sum + c.actuel, 0);
  const soldeNouveau =
    totalRevenue - newBudget.reduce((sum, c) => sum + c.nouveau, 0);

  const stressOptions = useMemo(() => buildStressOptions(user), [user]);
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
              Vous y pensez ? <em>On regarde ensemble si c'est faisable.</em>
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

            <div className={styles.scenarios}>
              {scenarios.map((s) => {
                const isSelected = s.key === scenarioKey;
                const isRecommended = s.key === "cible";
                const soldeProj =
                  totalRevenue -
                  CATEGORIES.reduce((sum, c) => {
                    if (c.id === "logement") return sum + s.mensualite;
                    return sum + (s.budgetAdjustments[c.id] ?? c.actuel);
                  }, 0);
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
                💡 <strong>Vos arbitrages, votre choix.</strong> Cliquez sur un montant
                pour ajuster vos dépenses futures. Logement = mensualité (verrouillé).
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
              {newBudget.map((c) => {
                const diff = c.nouveau - c.actuel;
                const cls = diff > 0 ? styles.up : diff < 0 ? styles.down : styles.flat;
                const isLocked = c.id === "logement";
                return (
                  <div key={c.id} className={styles.budgetRow}>
                    <div className={styles.budgetCat}>
                      <span>{c.emoji}</span>
                      <span>{c.nom}</span>
                    </div>
                    <div className={styles.budgetVal}>{formatEUR(c.actuel)}</div>
                    <div className={`${styles.budgetValDiff} ${cls}`}>
                      {isLocked ? (
                        <span>{formatEUR(c.nouveau)}</span>
                      ) : (
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
                      )}
                      {!isLocked && <span>€</span>}
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

        {step === 4 && (
          <div className={styles.mainNarrow}>
            <span className={styles.eyebrow}>Stress-test</span>
            <h1 className={styles.title}>
              Et si <em>la vie change</em> en cours de route ?
            </h1>
            <p className={styles.lead}>
              C'est la peur qu'on entend le plus chez les jeunes propriétaires.
              Vérifions que votre projet tient le coup dans les vrais scénarios de vie.
            </p>

            <div className={styles.stressGrid}>
              {stressOptions.map((opt) => {
                const active = activeStresses.has(opt.id);
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
                          <span className={styles.stressImpact}>Impact : {formatEUR(opt.monthlyImpact)} / mois</span>
                          <span className={styles.stressOk}>✓ {opt.mitigation}</span>
                        </>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {activeStresses.size === 0 ? (
              <div className={styles.stressSummary}>
                <strong>Aucun stress-test activé.</strong> Cliquez les scénarios
                qui vous inquiètent — l'app vous montre l'impact et comment l'absorber.
              </div>
            ) : (
              <div className={`${styles.stressSummary} ${styles.stressSummaryClean}`}>
                <strong>Tous les scénarios testés sont absorbables.</strong> Votre
                épargne de précaution, l'assurance emprunteur et le coussin sur
                la mensualité couvrent ces aléas. Votre projet est résilient.
              </div>
            )}

            <div className={styles.actions}>
              <button type="button" className={styles.btnGhost} onClick={goPrev}>← Retour</button>
              <button type="button" className={styles.btnPrimary} onClick={goNext}>
                Voir ma roadmap →
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className={styles.mainWide}>
            {isReady ? (
              <>
                <div className={styles.verdict}>
                  <span className={styles.verdictTag}>✓ Vous êtes prêts</span>
                  <h2>
                    {user.prenom}{user.enCouple ? ` & ${user.conjoint}` : ""}, votre scénario {scenario.name.toLowerCase()} est solide.
                  </h2>
                  <p>
                    Un bien jusqu'à <strong>{formatEUR(scenario.prixMax)}</strong>, mensualité
                    {" "}<strong>{formatEUR(scenario.mensualite)}</strong>, taux d'endettement
                    {" "}<strong>{scenario.endettementPct} %</strong>. Votre dossier est rassurant
                    pour une banque : 2 CDI stables, taux d'épargne 24 %, primo-accédants éligibles PTZ.
                  </p>
                </div>

                <h3 style={{ margin: "0 0 16px", fontSize: 20, fontWeight: 900 }}>
                  La suite, comme vous préférez
                </h3>
                <div className={styles.options}>
                  <a href="#" className={styles.optionCard}>
                    <span className={styles.optionEmoji}>🤝</span>
                    <h4>Faire négocier par Pretto</h4>
                    <p>
                      Notre partenaire courtier négocie votre dossier avec 100+ banques.
                      Gratuit pour vous, vous gardez la main, vous n'êtes pas engagés.
                    </p>
                    <span className={styles.optionCta}>Démarrer avec Pretto →</span>
                  </a>
                  <a href="#" className={styles.optionCard}>
                    <span className={styles.optionEmoji}>🏛️</span>
                    <h4>Voir les courtiers à {user.ville}</h4>
                    <p>
                      3 courtiers locaux indépendants. Rendez-vous en agence ou
                      visio, vous choisissez.
                    </p>
                    <span className={styles.optionCta}>Voir les courtiers →</span>
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
        <div className={styles.editComputed}>
          <span>Épargne disponible totale</span>
          <strong>{formatEUR(draft.epargneDispo)}</strong>
        </div>
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
