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

          {/* 2-column hero: content left, phones right.  Everything
              fits in the viewport — no scroll required to hit the
              simulator CTA. */}
          <div className={styles.heroBody}>
            <div className={styles.heroLeft}>
              <div className={styles.heroText}>
                <div className={styles.heroEyebrow}>
                  <span className={styles.newBadge}>Nouveau dans Bankin'</span>
                </div>
                <h1 className={styles.heroH1}>
                  Être propriétaire ? Vous y pensez…<br />
                  <em>On regarde si c'est faisable.</em>
                </h1>
                <p className={styles.heroSub}>
                  Bankin' connaît déjà vos revenus, vos charges et votre rythme
                  d'épargne. On vous montre <strong>3 scénarios et l'impact réel sur votre quotidien</strong> —
                  pas un score bancaire.
                </p>
                <div className={styles.heroCtas}>
                  <Link href="/simulateur" className={styles.heroCta}>
                    Voir si c'est faisable →
                  </Link>
                </div>
                <div className={styles.heroTrust}>
                  <span>Pré-rempli depuis vos comptes</span>
                  <span>2 minutes, sans engagement</span>
                  <span>Pas de mise en relation forcée</span>
                </div>
              </div>
            </div>

            <div className={styles.heroRight}>
              <div className={styles.phoneStage}>
                <div className={styles.phoneBase} />

                {/* Laptop — back, showing the 3 scénarios view */}
                <div className={styles.laptop} aria-hidden="true">
                  <div className={styles.laptopScreen}>
                    <span className={styles.lapEyebrow}>PAS UN CHIFFRE — UN ÉVENTAIL</span>
                    <h3 className={styles.lapTitle}>
                      3 scénarios pour <em>vous projeter</em>
                    </h3>
                    <div className={styles.lapScenarios}>
                      <div className={styles.lapCard}>
                        <div className={styles.lapCardName}>SEREINE</div>
                        <div className={styles.lapCardSub}>Rythme actuel</div>
                        <div className={styles.lapCardPrice}>271 k€</div>
                        <div className={styles.lapCardPriceLbl}>Bien jusqu'à</div>
                        <div className={styles.lapCardRow}>
                          <span>Mensualité</span>
                          <strong>1 215 €</strong>
                        </div>
                        <div className={styles.lapCardSolde}>+ 985 €/mois</div>
                        <div className={styles.lapCardImpact}>
                          <strong>Impact :</strong> ~95 % de votre rythme actuel. Pas de gros arbitrage.
                        </div>
                        <div className={styles.lapCardCta}>Choisir ce scénario</div>
                      </div>
                      <div className={`${styles.lapCard} ${styles.lapCardActive}`}>
                        <div className={styles.lapCardName}>CIBLE</div>
                        <div className={styles.lapCardSub}>Bon équilibre</div>
                        <div className={styles.lapCardPrice}>324 k€</div>
                        <div className={styles.lapCardPriceLbl}>Bien jusqu'à</div>
                        <div className={styles.lapCardRow}>
                          <span>Mensualité</span>
                          <strong>1 485 €</strong>
                        </div>
                        <div className={styles.lapCardSolde}>+ 1 095 €/mois</div>
                        <div className={styles.lapCardImpact}>
                          <strong>Impact :</strong> Loisirs −280 € et Vacances −100 € par mois.
                        </div>
                        <div className={styles.lapCardCta}>✓ Scénario choisi</div>
                      </div>
                      <div className={styles.lapCard}>
                        <div className={styles.lapCardName}>AMBITIEUX</div>
                        <div className={styles.lapCardSub}>Plafond 35 %</div>
                        <div className={styles.lapCardPrice}>341 k€</div>
                        <div className={styles.lapCardPriceLbl}>Bien jusqu'à</div>
                        <div className={styles.lapCardRow}>
                          <span>Mensualité</span>
                          <strong>1 575 €</strong>
                        </div>
                        <div className={styles.lapCardSolde}>+ 1 205 €/mois</div>
                        <div className={styles.lapCardImpact}>
                          <strong>Impact :</strong> Loisirs, vacances et épargne enfants réduits.
                        </div>
                        <div className={styles.lapCardCta}>Choisir ce scénario</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.laptopBase} />
                </div>

                {/* Phone — 3 scénarios stackés en vue mobile */}
                <div className={`${styles.phone} ${styles.phoneFront}`} aria-hidden="true">
                  <div className={styles.phoneScreen}>
                    <div className={styles.phScenHero}>
                      <div className={styles.phScenNewTag}>✨ NOUVEAU</div>
                      <div className={styles.phScenTitle}>3 scénarios pour vous projeter</div>
                    </div>
                    <div className={styles.phScenList}>
                      <div className={styles.phScenCard}>
                        <div className={styles.phScenCardHead}>
                          <span className={styles.phScenCardName}>Sereine</span>
                          <span className={styles.phScenCardPrice}>271 k€</span>
                        </div>
                        <div className={styles.phScenCardRow}>
                          <span>Mensualité 1 215 €</span>
                          <strong>27 % endett.</strong>
                        </div>
                        <div className={styles.phScenCardSolde}>+ 985 €/mois</div>
                        <div className={styles.phScenCardImpact}>
                          <strong>Impact :</strong> ~95 % de votre rythme actuel.
                        </div>
                        <div className={styles.phScenCardCta}>Choisir ce scénario</div>
                      </div>
                      <div className={`${styles.phScenCard} ${styles.phScenCardActive}`}>
                        <div className={styles.phScenCardHead}>
                          <span className={styles.phScenCardName}>Cible</span>
                          <span className={styles.phScenCardPrice}>324 k€</span>
                        </div>
                        <div className={styles.phScenCardRow}>
                          <span>Mensualité 1 485 €</span>
                          <strong>33 % endett.</strong>
                        </div>
                        <div className={styles.phScenCardSolde}>+ 1 095 €/mois</div>
                        <div className={styles.phScenCardImpact}>
                          <strong>Impact :</strong> Loisirs −280 € et Vacances −100 €/mois.
                        </div>
                        <div className={styles.phScenCardCta}>✓ Scénario choisi</div>
                      </div>
                      <div className={styles.phScenCard}>
                        <div className={styles.phScenCardHead}>
                          <span className={styles.phScenCardName}>Ambitieux</span>
                          <span className={styles.phScenCardPrice}>341 k€</span>
                        </div>
                        <div className={styles.phScenCardRow}>
                          <span>Mensualité 1 575 €</span>
                          <strong>35 % endett.</strong>
                        </div>
                        <div className={styles.phScenCardSolde}>+ 1 205 €/mois</div>
                        <div className={styles.phScenCardImpact}>
                          <strong>Impact :</strong> Loisirs, vacances, épargne enfants.
                        </div>
                        <div className={styles.phScenCardCta}>Choisir ce scénario</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Partner strip — fills the bottom of the hero */}
        <div className={styles.container}>
          <div className={styles.heroPartners}>
            <div className={styles.heroPartnersInner}>
              <span className={styles.heroPartnersLabel}>Comparé parmi</span>
              <span className={styles.heroPartner}>
                <span className={styles.dot} style={{ background: "#0E7C3A" }}>CA</span>
                Crédit Agricole
              </span>
              <span className={styles.heroPartner}>
                <span className={styles.dot} style={{ background: "#009639" }}>BNP</span>
                BNP Paribas
              </span>
              <span className={styles.heroPartner}>
                <span className={styles.dot} style={{ background: "#E60028" }}>SG</span>
                Société Générale
              </span>
              <span className={styles.heroPartner}>
                <span className={styles.dot} style={{ background: "#FFE800", color: "#1B1A3B" }}>LCL</span>
                LCL
              </span>
              <span className={styles.heroPartner}>
                <span className={styles.dot} style={{ background: "#5C50E8" }}>P</span>
                Pretto
              </span>
              <span className={styles.heroPartner}>
                <span className={styles.dot} style={{ background: "#003366" }}>M</span>
                Meilleurtaux
              </span>
              <a href="#" className={styles.heroFootnote}>
                <span className={styles.chromeIcon} /> Installer l'extension
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TRUST BAR — 6M users (Bankin' brand signal)
          ══════════════════════════════════════════════════════════ */}
      <section className={styles.trustBar}>
        <div className={styles.container}>
          <div className={styles.trustBarInner}>
            <span><strong>6 millions</strong> d'utilisateurs nous font confiance</span>
            <span className={styles.sep}>·</span>
            <span>Indépendant de toute institution financière</span>
            <span className={styles.sep}>·</span>
            <span>★★★★★ <strong>4,6</strong> sur l'App&nbsp;Store</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SPOTLIGHT — the NEW credit immo simulator (HERO #2)
          ══════════════════════════════════════════════════════════ */}
      <section className={styles.spotlight}>
        <div className={styles.container}>
          <div className={styles.spotlightGrid}>
            <div>
              <span className={styles.newBadge}>Nouveauté · Octobre 2026</span>
              <h2>
                Simulez votre prêt immo,<br />
                <em>découvrez votre capacité</em>
              </h2>
              <p className={styles.spotlightLead}>
                La toute nouvelle feature Bankin' qui calcule votre capacité
                d'emprunt en 2 minutes et compare automatiquement les meilleurs
                taux parmi nos 15 banques partenaires.
              </p>
              <ul className={styles.spotlightList}>
                <li>Adapté à tous les profils — CDI, CDD, indépendant ou couple mixte</li>
                <li>Inclut le PTZ, les frais de notaire et le taux d'assurance</li>
                <li>Comparaison Pretto, Meilleurtaux et 15 banques partenaires</li>
                <li>Vos données restent confidentielles — aucun partage sans accord</li>
              </ul>
              <Link href="/simulateur" className={styles.spotlightCta}>
                Lancer la simulation →
              </Link>
            </div>

            <div className={styles.spotlightMockup} aria-hidden="true">
              <span className={styles.spotlightMockupBadge}>RÉSULTAT DE SIMULATION</span>
              <h3>Capacité d'emprunt estimée</h3>
              <div className={styles.spotlightAmount}>325 000 €</div>
              <div className={styles.spotlightInfo}>
                Sur 25 ans · Taux estimé 3,75 % · Profil CDI
              </div>
              <div className={styles.spotlightMockupChips}>
                <div><strong>1 580 €</strong>Mensualité max</div>
                <div><strong>380 k€</strong>Prix achat max</div>
                <div><strong>+ 18 k€</strong>PTZ estimé</div>
              </div>
              <div className={styles.spotlightStab}>
                <div className={styles.spotlightStabHead}>
                  <span>✅ Profil Excellent</span>
                  <strong>3 / 3</strong>
                </div>
                <div className={styles.spotlightStabBar}>
                  <div />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          STATS
          ══════════════════════════════════════════════════════════ */}
      <section className={styles.stats}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            <div>
              <strong>6 M+</strong>
              <span>utilisateurs en France</span>
            </div>
            <div>
              <strong>15</strong>
              <span>banques partenaires</span>
            </div>
            <div>
              <strong>2 min</strong>
              <span>temps de simulation</span>
            </div>
            <div>
              <strong>0 €</strong>
              <span>frais cachés</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FEATURES — Bankin's 4 core features
          ══════════════════════════════════════════════════════════ */}
      <section id="features" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2>L'app tout-en-1 pour mieux gérer son argent</h2>
            <p>
              Pilotez vos dépenses, anticipez votre solde de fin de mois,
              gagnez de l'argent avec le cashback — et simulez votre prêt
              immobilier en 2 minutes.
            </p>
          </div>
          <div className={styles.features}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💰</div>
              <h3>Budget automatique</h3>
              <p>
                Un budget personnalisé, simple et évolutif, basé sur la moyenne
                de vos dépenses des 3 derniers mois. Modifiable à tout moment.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={`${styles.featureIcon} ${styles.green}`}>📊</div>
              <h3>Solde fin de mois anticipé</h3>
              <p>
                Projection mise à jour en temps réel — vos transactions
                récurrentes et opérations à venir sont prises en compte.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={`${styles.featureIcon} ${styles.purple}`}>🛍️</div>
              <h3>Cashback intégré</h3>
              <p>
                Gagnez de l'argent quand vous en dépensez chez nos enseignes
                partenaires. Crédité directement sur votre compte Bankin'.
              </p>
            </div>
            <div className={styles.featureCard} style={{ borderColor: "#5C50E8", boxShadow: "0 8px 32px rgba(92,80,232,0.18)" }}>
              <div className={styles.featureIcon} style={{ background: "linear-gradient(135deg,#5C50E8,#8B7FFF)" }}>🏠</div>
              <h3>
                Prêt immobilier
                <span style={{ display: "inline-block", marginLeft: 8, background: "linear-gradient(135deg,#5C50E8,#8B7FFF)", color: "#fff", fontSize: 9, fontWeight: 900, padding: "3px 8px", borderRadius: 8, letterSpacing: 0.8, verticalAlign: "middle" }}>NOUVEAU</span>
              </h3>
              <p>
                Calculez votre capacité d'emprunt en 2 minutes et comparez
                instantanément les meilleurs taux parmi 15 banques partenaires.
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
            <h2>Pourquoi 6 millions de Français nous font confiance</h2>
            <p>Plus qu'une app — votre allié pour mieux décider de votre argent.</p>
          </div>
          <div className={styles.steps}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>🎯</div>
              <h3>Vision claire</h3>
              <p>Tous vos comptes au même endroit. Solde fin de mois anticipé en temps réel.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>🛡</div>
              <h3>Indépendance totale</h3>
              <p>Aucune banque actionnaire. Pas de conflit d'intérêt, pas de produit caché.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>🚀</div>
              <h3>Toujours en avance</h3>
              <p>Cashback, projection budget, IA — on construit le futur de l'argent avec vous.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>🔒</div>
              <h3>Sécurité maximale</h3>
              <p>Agrément ACPR, chiffrement bancaire, données jamais revendues à un tiers.</p>
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
          INDEPENDENCE — trust signal
          ══════════════════════════════════════════════════════════ */}
      <section className={styles.indep}>
        <div className={styles.container}>
          <h2>Indépendants de toute institution financière</h2>
          <p>
            Bankin' n'appartient à aucune banque. C'est cette indépendance qui
            nous permet de vous accompagner sans conflit d'intérêt, de comparer
            objectivement les taux et de toujours défendre votre intérêt.
          </p>
          <div className={styles.indepPills}>
            <span className={styles.indepPill}>Aucune commission cachée</span>
            <span className={styles.indepPill}>Comparaison objective</span>
            <span className={styles.indepPill}>Vos données restent les vôtres</span>
            <span className={styles.indepPill}>Agréé ACPR</span>
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
