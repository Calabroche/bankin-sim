import Link from "next/link";
import styles from "./landing.module.css";

export const metadata = {
  title: "Bankin' — L'app tout-en-1 pour mieux gérer son argent",
  description:
    "Calculez votre capacité d'emprunt en 2 minutes et comparez les meilleurs taux du marché. Tous vos comptes, 1 seule app, 0 stress.",
};

export default function LandingPage() {
  return (
    <div className={styles.page}>
      {/* ══════════════════════════════════════════════════════════
          HERO — sky-blue gradient with clouds (Bankin' identity)
          ══════════════════════════════════════════════════════════ */}
      <section className={styles.hero}>
        {/* Cloud decorations */}
        <div className={`${styles.cloud} ${styles.cloud1}`} />
        <div className={`${styles.cloud} ${styles.cloud2}`} />
        <div className={`${styles.cloud} ${styles.cloud3}`} />
        <div className={`${styles.cloud} ${styles.cloud4}`} />

        {/* Top nav */}
        <div className={styles.container}>
          <header className={styles.topbar}>
            <div className={styles.topbarInner}>
              <Link href="/" className={styles.brand}>Bankin'</Link>
              <nav className={styles.nav}>
                <a href="#features">À propos</a>
                <a href="#how">Nos offres et services B2B</a>
              </nav>
              <div className={styles.topRight}>
                <a href="#" className={styles.topSupport}>Support</a>
                <Link href="/simulateur" className={styles.topCta}>
                  Me connecter
                </Link>
              </div>
            </div>
          </header>

          {/* Phone mockups + headline */}
          <div className={styles.heroCenter}>
            <div className={styles.phoneStage}>
              <div className={styles.phoneBase} />

              {/* Phone 1 — Accounts (back) */}
              <div className={`${styles.phone} ${styles.phoneBack}`} aria-hidden="true">
                <div className={styles.phoneScreen}>
                  <div className={styles.phStatus}>
                    <span>16:19</span>
                    <span>📶 🔋</span>
                  </div>
                  <div className={styles.phAmount}>
                    20 405,16 €
                    <small>Solde total</small>
                  </div>
                  <div className={styles.phTabs}>
                    <span className={styles.active}>Tous</span>
                    <span>Courant</span>
                    <span>Épargne</span>
                    <span>Crédits</span>
                  </div>
                  <div className={styles.phCard}>
                    <div className={styles.phCardHead}>BOURSOBANK</div>
                    <div className={styles.phRow}>
                      <span>Compte courant</span>
                      <strong>2 153,98 €</strong>
                    </div>
                    <div className={styles.phRow}>
                      <span>Compte joint</span>
                      <strong style={{ color: "#FF5957" }}>- 32,12 €</strong>
                    </div>
                  </div>
                  <div className={styles.phCard}>
                    <div className={`${styles.phCardHead} ${styles.green}`}>BNP</div>
                    <div className={styles.phRow}>
                      <span>Compte courant</span>
                      <strong>256,87 €</strong>
                    </div>
                    <div className={styles.phRow}>
                      <span>Livret A</span>
                      <strong>12 245,25 €</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone 2 — Analyse (front) */}
              <div className={`${styles.phone} ${styles.phoneFront}`} aria-hidden="true">
                <div className={styles.phoneScreen}>
                  <div className={styles.phStatus}>
                    <span>9:41</span>
                    <span>📶 🔋</span>
                  </div>
                  <div className={styles.phHeader}>Analyse</div>
                  <div className={styles.phPills}>
                    <span>Entrées</span>
                    <span className={styles.active}>Sorties</span>
                    <span>Récurrents</span>
                  </div>
                  <div className={styles.phDonut}>
                    <div className={styles.phDonutCenter}>
                      <strong>1 625,72 €</strong>
                      <small>SORTIES D'ARGENT</small>
                    </div>
                  </div>
                  <div className={styles.phBudget}>
                    <div className={styles.phBudgetTop}>
                      <span>Budget mois</span>
                      <strong>2 803,56 € / 3 000 €</strong>
                    </div>
                    <div className={styles.phBudgetBar} />
                    <div className={styles.phBudgetSub}>87 %</div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.heroText}>
              <h1 className={styles.heroH1}>
                Votre capacité d'emprunt
                <br />
                <em>en 2 minutes</em>
              </h1>
              <p className={styles.heroSub}>
                Tous vos comptes, 1 seule app, 0 stress
              </p>
            </div>

            {/* Download CTA card */}
            <div className={styles.dlCard}>
              <div className={styles.dlQr} aria-hidden="true" />
              <div className={styles.dlInfo}>
                <strong>Démarrez votre simulation</strong>
                <div className={styles.dlButtons}>
                  <Link href="/simulateur" className={`${styles.dlBtn} ${styles.dlBtnPrimary}`}>
                    Simuler maintenant →
                  </Link>
                  <a href="#how" className={styles.dlBtn}>
                    <span>Comment <small>ça marche</small></span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <a href="#" className={styles.heroFootnote}>
          Installer l'extension <span className={styles.chromeIcon} />
        </a>
      </section>

      {/* ══════════════════════════════════════════════════════════
          STATS
          ══════════════════════════════════════════════════════════ */}
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

      {/* ══════════════════════════════════════════════════════════
          FEATURES
          ══════════════════════════════════════════════════════════ */}
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
              <div className={`${styles.featureIcon} ${styles.purple}`}>🔒</div>
              <h3>100 % confidentiel</h3>
              <p>
                Vos données restent dans votre navigateur. Aucune transmission à
                un courtier ou à une banque sans votre accord explicite.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={`${styles.featureIcon} ${styles.green}`}>📈</div>
              <h3>Meilleurs taux du marché</h3>
              <p>
                Comparez instantanément les offres de Pretto, Meilleurtaux et de
                nos 15 banques partenaires pour obtenir le meilleur taux.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          HOW IT WORKS
          ══════════════════════════════════════════════════════════ */}
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

      {/* ══════════════════════════════════════════════════════════
          BANK PARTNERS
          ══════════════════════════════════════════════════════════ */}
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

      {/* ══════════════════════════════════════════════════════════
          TESTIMONIALS
          ══════════════════════════════════════════════════════════ */}
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

      {/* ══════════════════════════════════════════════════════════
          FINAL CTA (sky blue with clouds)
          ══════════════════════════════════════════════════════════ */}
      <section className={styles.finalCta}>
        <div className={styles.container}>
          <h2>Prêt à devenir propriétaire ?</h2>
          <p>Découvrez en 2 minutes combien vous pouvez emprunter.</p>
          <Link href="/simulateur">Démarrer la simulation →</Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════════════════════ */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div className={styles.footerCol}>
              <div className={styles.footerLogo}>Bankin'</div>
              <p>
                L'app tout-en-1 pour mieux gérer son argent. Le partenaire de
                votre projet immobilier depuis 2011. Plus de 50 000 simulations
                en 2026.
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
