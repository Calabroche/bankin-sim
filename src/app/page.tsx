import Link from "next/link";
import styles from "./landing.module.css";

export const metadata = {
  title: "Bankin' — Crédit immobilier · Capacité d'emprunt en 2 minutes",
  description:
    "Calculez gratuitement votre capacité d'emprunt et comparez les meilleurs taux du marché — CDI, CDD ou indépendant. Sans engagement, 100 % en ligne.",
};

export default function LandingPage() {
  return (
    <div className={styles.page}>
      {/* ── Top nav ─────────────────────────────────────────────── */}
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <Link href="/" className={styles.brand}>
            <span className={styles.brandMark}>B</span>
            <span>Bankin'</span>
          </Link>
          <nav className={styles.nav}>
            <a href="#features">Crédit immobilier</a>
            <a href="#how">Comment ça marche</a>
            <a href="#banks">Partenaires</a>
            <a href="#testimonials">Témoignages</a>
          </nav>
          <div className={styles.topRight}>
            <a href="#" className={styles.topLogin}>Connexion</a>
            <Link href="/simulateur" className={styles.topCta}>
              Simuler maintenant
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div>
              <span className={styles.eyebrow}>Crédit immobilier · Octobre 2026</span>
              <h1 className={styles.heroH1}>
                Votre capacité d'emprunt <em>en 2 minutes</em>
              </h1>
              <p className={styles.heroLead}>
                Calculez gratuitement combien vous pouvez emprunter pour votre projet
                immobilier. Réponse immédiate, comparaison parmi 15 banques partenaires,
                sans engagement.
              </p>
              <div className={styles.heroCtas}>
                <Link href="/simulateur" className={styles.primary}>
                  Démarrer la simulation →
                </Link>
                <a href="#how" className={styles.secondary}>Comment ça marche</a>
              </div>
              <div className={styles.trust}>
                <span>Gratuit</span>
                <span>Sans engagement</span>
                <span>100 % en ligne</span>
                <span>Résultat instantané</span>
              </div>
            </div>

            <div className={styles.preview} aria-hidden="true">
              <div className={styles.previewBadge}>Aperçu de votre résultat</div>
              <div className={styles.previewLabel}>Capacité d'emprunt estimée</div>
              <div className={styles.previewAmount}>325 000 €</div>
              <div className={styles.previewSub}>
                Sur 25 ans · Taux estimé 3,75 % · Profil CDI
              </div>
              <div className={styles.previewChips}>
                <div>
                  <strong>1 580 €</strong>
                  Mensualité max
                </div>
                <div>
                  <strong>380 k€</strong>
                  Prix achat max
                </div>
                <div>
                  <strong>+ 18 k€</strong>
                  PTZ estimé
                </div>
              </div>
              <div className={styles.previewProfilLabel}>
                <span>✅ Profil Excellent</span>
                <small>3 / 3</small>
              </div>
              <div className={styles.previewBar}>
                <div />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────────────── */}
      <section className={styles.stats}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            <div>
              <strong>50 000+</strong>
              <span>simulations en 2026</span>
            </div>
            <div>
              <strong>15</strong>
              <span>banques partenaires</span>
            </div>
            <div>
              <strong>2 min</strong>
              <span>temps moyen</span>
            </div>
            <div>
              <strong>0 €</strong>
              <span>frais cachés</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────── */}
      <section id="features" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2>Pourquoi calculer avec Bankin' ?</h2>
            <p>
              Une estimation précise, transparente et adaptée à votre profil —
              salarié, contrat précaire ou indépendant.
            </p>
          </div>
          <div className={styles.features}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎯</div>
              <h3>Estimation précise</h3>
              <p>
                Calcul basé sur les taux actuels du marché (octobre 2026) et le
                taux d'endettement légal de 35 % imposé par le HCSF.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔒</div>
              <h3>100 % confidentiel</h3>
              <p>
                Vos données restent dans votre navigateur. Aucune transmission à
                un courtier ou à une banque sans votre accord explicite.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📈</div>
              <h3>Meilleurs taux du marché</h3>
              <p>
                Comparez instantanément les offres de Pretto, Meilleurtaux et de
                nos 15 banques partenaires pour obtenir le meilleur taux.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────── */}
      <section id="how" className={styles.sectionDark}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2>Votre simulation en 4 étapes</h2>
            <p>Moins de 2 minutes pour découvrir votre capacité d'emprunt.</p>
          </div>
          <div className={styles.steps}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>1</div>
              <h3>Profil</h3>
              <p>Votre situation pro et familiale (CDI, indépendant, enfants).</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>2</div>
              <h3>Revenus</h3>
              <p>Salaires nets et charges mensuelles de votre foyer.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>3</div>
              <h3>Projet</h3>
              <p>Type de bien, durée du prêt et apport personnel.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>4</div>
              <h3>Résultat</h3>
              <p>Votre capacité d'emprunt + les meilleurs taux du marché.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bank partners ───────────────────────────────────────── */}
      <section id="banks" className={styles.banks}>
        <div className={styles.container}>
          <div className={styles.banksLabel}>
            Comparaison parmi 15+ banques et courtiers partenaires
          </div>
          <div className={styles.banksGrid}>
            <span className={styles.bankLogo}>
              <span className={styles.dot} style={{ background: "#0E7C3A" }}>CA</span>
              Crédit Agricole
            </span>
            <span className={styles.bankLogo}>
              <span className={styles.dot} style={{ background: "#009639" }}>BNP</span>
              BNP Paribas
            </span>
            <span className={styles.bankLogo}>
              <span className={styles.dot} style={{ background: "#E60028" }}>SG</span>
              Société Générale
            </span>
            <span className={styles.bankLogo}>
              <span className={styles.dot} style={{ background: "#FFE800", color: "#1B1A3B" }}>LCL</span>
              LCL
            </span>
            <span className={styles.bankLogo}>
              <span className={styles.dot} style={{ background: "#9F2842" }}>CE</span>
              Caisse d'Épargne
            </span>
            <span className={styles.bankLogo}>
              <span className={styles.dot} style={{ background: "#FF5957" }}>Bo</span>
              BoursoBank
            </span>
            <span className={styles.bankLogo}>
              <span className={styles.dot} style={{ background: "#5C50E8" }}>P</span>
              Pretto
            </span>
            <span className={styles.bankLogo}>
              <span className={styles.dot} style={{ background: "#003366" }}>M</span>
              Meilleurtaux
            </span>
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────── */}
      <section id="testimonials" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2>Ils ont concrétisé leur projet</h2>
            <p>Plus de 50 000 personnes nous font confiance pour leur crédit immobilier.</p>
          </div>
          <div className={styles.testimonials}>
            <div className={styles.testimonial}>
              <div className={styles.stars}>★★★★★</div>
              <p>
                « Estimation très précise, à 2 % près de l'offre finale. Le
                partenaire Pretto m'a sortie une proposition en 24 h pour mon
                achat à Lyon. »
              </p>
              <div className={styles.author}>
                <div className={styles.avatar}>S</div>
                <div>
                  <strong>Sophie M.</strong>
                  <small>Primo-accédante · Lyon</small>
                </div>
              </div>
            </div>
            <div className={styles.testimonial}>
              <div className={styles.stars}>★★★★★</div>
              <p>
                « J'ai obtenu mon prêt à 3,42 % au lieu des 3,75 % proposés par
                ma banque. Économie de 18 000 € sur 25 ans grâce à la
                comparaison. »
              </p>
              <div className={styles.author}>
                <div className={styles.avatar}>T</div>
                <div>
                  <strong>Thomas R.</strong>
                  <small>2ème achat · Paris</small>
                </div>
              </div>
            </div>
            <div className={styles.testimonial}>
              <div className={styles.stars}>★★★★★</div>
              <p>
                « Enfin un outil qui gère bien le profil indépendant — calcul à
                70 % du BIC, exigence de 3 ans d'activité. Très transparent. »
              </p>
              <div className={styles.author}>
                <div className={styles.avatar}>A</div>
                <div>
                  <strong>Amélie D.</strong>
                  <small>Indépendante · Bordeaux</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────── */}
      <section className={styles.finalCta}>
        <div className={styles.container}>
          <h2>Prêt à devenir propriétaire ?</h2>
          <p>Découvrez en 2 minutes combien vous pouvez emprunter.</p>
          <Link href="/simulateur" className={styles.primary}>
            Démarrer la simulation →
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div className={styles.footerCol}>
              <div className={styles.footerLogo}>
                <span className={styles.brandMark}>B</span>
                <span>Bankin'</span>
              </div>
              <p>
                Le partenaire de votre projet immobilier depuis 2011. Plus de
                50 000 simulations en 2026, et 15 banques partenaires pour
                obtenir le meilleur taux.
              </p>
            </div>
            <div className={styles.footerCol}>
              <h4>Crédit immobilier</h4>
              <ul>
                <li><Link href="/simulateur">Simulateur de capacité</Link></li>
                <li><a href="#">Calculateur de mensualités</a></li>
                <li><a href="#">Comparateur de taux</a></li>
                <li><a href="#">Guide du primo-accédant</a></li>
              </ul>
            </div>
            <div className={styles.footerCol}>
              <h4>Bankin'</h4>
              <ul>
                <li><a href="#">À propos</a></li>
                <li><a href="#">Nos engagements</a></li>
                <li><a href="#">Carrières</a></li>
                <li><a href="#">Presse</a></li>
              </ul>
            </div>
            <div className={styles.footerCol}>
              <h4>Légal</h4>
              <ul>
                <li><a href="#">Mentions légales</a></li>
                <li><a href="#">CGU</a></li>
                <li><a href="#">Confidentialité</a></li>
                <li><a href="#">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <span>© 2026 Bankin' — Concept produit · Florian Calabrese</span>
            <span>ACPR n° 14-058 · ORIAS n° 21 003 542</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
