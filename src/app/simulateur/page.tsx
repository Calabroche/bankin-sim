"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./simulateur.module.css";

/* ──────────────────────────────────────────────────────────────────────
   MOCK USER DATA — would come from the Bankin' app in production.
   For this case study, it represents 12+ months of real transaction
   history that the simulator pre-fills automatically (the core
   differentiator: no form, the app already knows). */

const USER = {
  prenom: "Sophie",
  conjoint: "Thomas",
  enfants: 2,
  enfantsAges: [4, 7],
  primoAccedant: true,
  contrat1: "CDI" as const,
  contrat2: "CDI" as const,
  revenusNet: 4500,         // €/mois (couple)
  revenusStable: 26,        // mois sans variation
  loyerActuel: 1100,        // €/mois
  depensesTotales: 3400,    // €/mois (hors loyer? non, tout inclus)
  epargneMensuelle: 1100,   // €/mois (auto-épargne Bankin')
  epargneDispo: 22000,      // € disponibles pour apport
  ville: "Lyon",
};

interface CatBudget {
  id: string;
  nom: string;
  emoji: string;
  actuel: number;
  fixe?: boolean;
}

const CATEGORIES: CatBudget[] = [
  { id: "logement",        nom: "Logement",            emoji: "🏠", actuel: 1100, fixe: true },
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

function buildScenarios(): Scenario[] {
  const taux = 3.75;
  const duree = 25;
  const apport = USER.epargneDispo;
  const ptz = USER.primoAccedant ? ptzFromKids(USER.enfants) : 0;

  // Three monthly-payment targets as % of net income
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
    const mensualite = Math.round(USER.revenusNet * t.pct);
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

const STRESS_OPTIONS: StressOption[] = [
  {
    id: "conge_parental",
    emoji: "👶",
    title: `${USER.prenom} passe à 80 %`,
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
    description: `${USER.conjoint} traverse une période sans emploi.`,
    monthlyImpact: -820,
    mitigation: "Allocation chômage + assurance prêt = solde tenu pendant 8 mois.",
  },
];

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
    desc: "On donne 1 100 € par mois à quelqu'un d'autre — autant rembourser le nôtre.",
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
  const scenarios = useMemo(() => buildScenarios(), []);
  const [scenarioKey, setScenarioKey] = useState<Scenario["key"]>("cible");
  const [activeStresses, setActiveStresses] = useState<Set<string>>(new Set());

  const scenario = scenarios.find((s) => s.key === scenarioKey)!;

  const goNext = () => setStep((s) => (Math.min(s + 1, 5) as Step));
  const goPrev = () => setStep((s) => (Math.max(s - 1, 0) as Step));

  const progress = ((step + 1) / 6) * 100;

  // Compute the new budget for the selected scenario
  const newBudget = useMemo(() => {
    return CATEGORIES.map((cat) => {
      if (cat.id === "logement") {
        return { ...cat, nouveau: scenario.mensualite };
      }
      if (scenario.budgetAdjustments[cat.id] != null) {
        return { ...cat, nouveau: scenario.budgetAdjustments[cat.id] };
      }
      return { ...cat, nouveau: cat.actuel };
    });
  }, [scenario]);

  const soldeActuel = USER.revenusNet - CATEGORIES.reduce((sum, c) => sum + c.actuel, 0);
  const soldeNouveau =
    USER.revenusNet - newBudget.reduce((sum, c) => sum + c.nouveau, 0);

  const isReady = USER.epargneDispo >= 15000 && scenario.endettementPct <= 33;

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark}>B</span>
          <span>Bankin'</span>
        </Link>
        <Link href="/" className={styles.back}>← Retour à l'accueil</Link>
      </header>

      <div className={styles.progressBar}>
        <div className={styles.progressInner}>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <div className={styles.progressMeta}>
            <strong>Étape {step + 1} / 6</strong> — {STEP_LABELS[step]}
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
              {USER.prenom} & {USER.conjoint}, <em>voici votre point de départ.</em>
            </h1>
            <p className={styles.lead}>
              Pas de saisie : on a tout pris dans votre app. Vous pourrez ajuster
              avant les scénarios si quelque chose a changé.
            </p>

            <div className={styles.departGrid}>
              <div className={`${styles.dataCard} ${styles.highlight}`}>
                <div className={styles.dataLabel}>Revenus nets du foyer</div>
                <div className={styles.dataValue}>{formatEUR(USER.revenusNet)}</div>
                <div className={`${styles.dataSub} ${styles.dataSubGood}`}>
                  Stables depuis {USER.revenusStable} mois (2 CDI)
                </div>
              </div>

              <div className={styles.dataCard}>
                <div className={styles.dataLabel}>Dépenses moyennes / mois</div>
                <div className={styles.dataValue}>{formatEUR(USER.depensesTotales)}</div>
                <div className={styles.dataSub}>
                  Sur 12 mois · 7 catégories suivies
                </div>
                <div className={styles.dataDonut} />
              </div>

              <div className={styles.dataCard}>
                <div className={styles.dataLabel}>Épargne mensuelle</div>
                <div className={styles.dataValue}>{formatEUR(USER.epargneMensuelle)}</div>
                <div className={`${styles.dataSub} ${styles.dataSubGood}`}>
                  Taux d'épargne 24 % · Bien au-dessus de la moyenne FR
                </div>
              </div>

              <div className={styles.dataCard}>
                <div className={styles.dataLabel}>Épargne disponible</div>
                <div className={styles.dataValue}>{formatEUR(USER.epargneDispo)}</div>
                <div className={styles.dataSub}>
                  Sur vos comptes épargne · Mobilisable pour apport
                </div>
              </div>
            </div>

            <button type="button" className={styles.editToggle}>
              Ces chiffres ne sont plus à jour ? Ajuster manuellement →
            </button>

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
                  USER.revenusNet -
                  CATEGORIES.reduce((sum, c) => {
                    if (c.id === "logement") return sum + s.mensualite;
                    return sum + (s.budgetAdjustments[c.id] ?? c.actuel);
                  }, 0);
                return (
                  <button
                    key={s.key}
                    type="button"
                    className={`${styles.scenarioCard} ${isSelected ? styles.selected : ""} ${isRecommended ? styles.recommended : ""}`}
                    onClick={() => setScenarioKey(s.key)}
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
                return (
                  <div key={c.id} className={styles.budgetRow}>
                    <div className={styles.budgetCat}>
                      <span>{c.emoji}</span>
                      <span>{c.nom}</span>
                    </div>
                    <div className={styles.budgetVal}>{formatEUR(c.actuel)}</div>
                    <div className={`${styles.budgetValDiff} ${cls}`}>
                      {formatEUR(c.nouveau)}
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
              {STRESS_OPTIONS.map((opt) => {
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
                    {USER.prenom} & {USER.conjoint}, votre scénario {scenario.name.toLowerCase()} est solide.
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
                    <h4>Voir les courtiers à {USER.ville}</h4>
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
