/* eslint-disable */
// Auto-generated from the original index.html simulator.
// Body HTML and inline JS are kept as raw strings to preserve the existing behaviour.

export const simulatorBody: string = `
<div class="hdr">
  <div class="hdr-badge">Simulateur Capacité d'Emprunt · Bankin'</div>
  <h1>Simulateur Capacité d'Emprunt</h1>
  <p>Concept Product — <strong style="color:#a099ff">Florian Calabrese</strong></p>
  <button class="toggle-view-btn" onclick="toggleView()">📱 Vue téléphone / 🖥 Vue ordinateur</button>
</div>

<!-- STEP INDICATORS -->
<div class="steps" id="step-dots">
  <div class="st active" id="dot0" onclick="go(0)"><div class="dot">🏠</div><div class="lbl">Accueil</div></div>
  <div class="st-line" id="line01"></div>
  <div class="st active" id="dot1" onclick="go(1)"><div class="dot">1</div><div class="lbl">Profil</div></div>
  <div class="st-line" id="line12"></div>
  <div class="st" id="dot2" onclick="go(2)"><div class="dot">2</div><div class="lbl">Revenus</div></div>
  <div class="st-line" id="line23"></div>
  <div class="st" id="dot3" onclick="go(3)"><div class="dot">3</div><div class="lbl">Projet</div></div>
  <div class="st-line" id="line34"></div>
  <div class="st" id="dot4" onclick="go(4)"><div class="dot">4</div><div class="lbl">Résultat</div></div>
</div>

<div class="phone-wrap">
<div class="phone">
  <div class="status"><span id="clock">18:41</span><div class="status-icons">▲▲ 📶 🔋16</div></div>

  <!-- ══════════════════════════════════════════
       SCREEN 0 — HOME
  ══════════════════════════════════════════ -->
  <div id="s0" class="screen active">
    <div class="topbar" style="position:relative;">
      <div style="display:flex;gap:6px;">
        <div class="topbar-icon">👤</div>
        <div class="topbar-icon">👥<div class="notif-dot"></div></div>
      </div>
      <div class="topbar-center" style="position:absolute;left:50%;transform:translateX(-50%);">
        <div class="topbar-amount">3 240,00 €</div>
        <div class="topbar-label">Solde total</div>
      </div>
      <div class="topbar-icon">🔍</div>
    </div>
    <div class="pill-tabs">
      <div class="pill-tab active">Tous</div>
      <div class="pill-tab">Courant</div>
      <div class="pill-tab">Épargne</div>
      <div class="pill-tab">Crédit</div>
    </div>
    <div class="home-scroll">
      <!-- BANNER ENHANCED — BEFORE bank card -->
      <div class="banner-wrap">
        <div class="banner" id="home-banner" onclick="go(1)">
          <button onclick="dismissBanner(event)" style="position:absolute;top:8px;right:10px;background:rgba(255,255,255,.2);color:#fff;border:none;border-radius:50%;width:22px;height:22px;font-size:14px;cursor:pointer;line-height:22px;text-align:center;z-index:10;">×</button>
          <div class="b-tag2">✨ Nouveau</div>
          <div class="b-h">Envie de devenir propriétaire ?</div>
          <div class="b-p">Calculez votre capacité d'emprunt en 2 min — CDI, CDD ou indépendant.</div>
          <div class="b-cta">Simuler maintenant →</div>
        </div>
        <div class="tap-label"><span class="tap-arrow">👆</span> Cliquer ici pour démarrer</div>
      </div>
      <!-- CARTE COMPTES BANCAIRES -->
      <div class="bank-card">
        <div class="bank-card-hdr">
          <div class="bank-logo-sq">B</div>
          <div class="bank-card-name">BANKIN'</div>
        </div>
        <div class="bank-acc-row">
          <div>
            <div class="bank-acc-name">Compte courant</div>
            <div class="bank-acc-sub">46 heures pour débloquer</div>
          </div>
          <div>
            <div class="bank-acc-amt">260 €</div>
            <div class="bank-acc-status">en attente</div>
          </div>
        </div>
        <div class="bank-acc-row">
          <div class="bank-acc-name">Compte épargne</div>
          <div class="bank-acc-amt">15 €</div>
        </div>
        <div class="ae-row" style="margin-top:8px;">
          <div class="ae-btn">⊕ Ajouter</div>
          <div class="ae-btn">✎ Éditer</div>
        </div>
      </div>
      <div class="sec-title">Outils</div>
      <div class="outils-grid">
        <div class="outil-card add">
          <div class="outil-add-title">Ajouter des outils</div>
          <div class="outil-add-sub">+10 outils pour suivre vos comptes</div>
          <div class="outil-add-btn">Ajouter +</div>
        </div>
      </div>
    </div>
    <div class="bottom-nav">
      <div class="nav-item"><div class="nav-icon">🏠</div><div class="nav-label active-nav">Comptes</div></div>
      <div class="nav-item"><div class="nav-icon">📊</div><div class="nav-label">Analyse</div><div class="nav-badge">1</div></div>
      <div class="nav-item"><div class="nav-icon">🔭</div><div class="nav-label">Opportunités</div></div>
      <div class="nav-item"><div class="nav-icon">📋</div><div class="nav-label">Activités</div></div>
      <div class="nav-item"><div class="nav-icon">🛍️</div><div class="nav-label">Achats</div></div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════
       SCREEN 1 — PROFIL
  ══════════════════════════════════════════ -->
  <div id="s1" class="screen">
    <div class="page-hdr">
      <div class="back-circle" onclick="go(0)">←</div>
      <div class="page-hdr-title">Mon projet immobilier</div>
    </div>
    <div class="progress-bar"><div class="progress-fill" style="width:25%"></div></div>
    <div class="progress-lbl">Étape 1 sur 4</div>
    <div class="scroll">
      <div class="form-sec">
        <div class="form-lbl">J'emprunte</div>
        <div class="seg-ctrl">
          <div class="seg-btn" id="sb-s" onclick="setEmprunt('s')">Seul(e)</div>
          <div class="seg-btn active" id="sb-c" onclick="setEmprunt('c')">À deux</div>
        </div>
      </div>
      <div class="form-sec">
        <div class="form-lbl">Ma situation actuelle</div>
        <div class="seg-ctrl">
          <div class="seg-btn active" id="sit-l" onclick="setSit('l')">🏠 Locataire</div>
          <div class="seg-btn" id="sit-p" onclick="setSit('p')">🏡 Propriétaire</div>
        </div>
      </div>
      <div class="form-sec">
        <div class="form-lbl">Enfants à charge</div>
        <div class="chip-row">
          <div class="chip" id="k0" onclick="setKids(0)">— Aucun</div>
          <div class="chip" id="k1" onclick="setKids(1)">👶 1</div>
          <div class="chip active" id="k2" onclick="setKids(2)">👶👶 2</div>
          <div class="chip" id="k3" onclick="setKids(3)">👨‍👩‍👧‍👦 3+</div>
        </div>
      </div>

      <!-- STATUT P1 -->
      <div class="person-label">
        <div class="person-dot" style="background:var(--purple)">V</div>
        <div class="person-name" id="p1-lbl">Votre statut professionnel</div>
      </div>
      <div class="form-sec">
        <div class="ct-row">
          <div class="ct-chip active" id="ct1-cdi" onclick="setContract(1,'cdi')">💼 CDI</div>
          <div class="ct-chip" id="ct1-cdd" onclick="setContract(1,'cdd')">📋 CDD</div>
          <div class="ct-chip" id="ct1-ae" onclick="setContract(1,'ae')">🔧 Indépendant</div>
        </div>
      </div>

      <!-- STATUT P2 (couple only) -->
      <div id="p2-section">
        <div class="person-label">
          <div class="person-dot" style="background:#8B7FFF">C</div>
          <div class="person-name">Statut de votre conjoint(e)</div>
        </div>
        <div class="form-sec">
          <div class="ct-row">
            <div class="ct-chip active" id="ct2-cdi" onclick="setContract(2,'cdi')">💼 CDI</div>
            <div class="ct-chip" id="ct2-cdd" onclick="setContract(2,'cdd')">📋 CDD</div>
            <div class="ct-chip" id="ct2-ae" onclick="setContract(2,'ae')">🔧 Indépendant</div>
          </div>
        </div>
      </div>

      <div class="info-b" id="profil-info">
        <div style="font-weight:700;margin-bottom:5px;font-size:10px;">💡 Bon à savoir</div>
        <p style="margin-bottom:3px;">✅ CDI : profil le plus favorable pour les banques. Accès au crédit optimal.</p>
      </div>

      <!-- MENTIONS LÉGALES ACCORDÉON -->
      <div class="legal-accordion" style="margin:0 16px 10px;">
        <div class="legal-toggle" onclick="toggleLegal()" style="display:flex;justify-content:space-between;align-items:center;background:var(--purp-lt);border-radius:10px;padding:9px 12px;cursor:pointer;font-size:11px;font-weight:700;color:var(--purple);">
          <span>📋 Mentions légales</span><span id="legal-arrow">▼</span>
        </div>
        <div id="legal-content" style="display:none;background:var(--purp-lt);border-radius:0 0 10px 10px;padding:8px 12px;font-size:9.5px;color:var(--txt2);line-height:1.5;border-top:1px solid var(--purp-md);">
          <p style="margin-bottom:4px;">Ce simulateur est un outil d'estimation à titre strictement indicatif. Les résultats obtenus ne constituent pas une offre de prêt ni un engagement de financement.</p>
          <p style="margin-bottom:4px;">Les calculs sont basés sur des hypothèses simplifiées (taux d'endettement à 35 %, taux d'assurance à 0,30 %). La capacité réelle d'emprunt dépend de votre situation complète (revenus, charges, historique bancaire, scoring).</p>
          <p>Consulter un conseiller bancaire ou un courtier pour une analyse personnalisée. Bankin' ne saurait être tenu responsable des décisions prises sur la base de ces estimations.</p>
        </div>
      </div>

      <button class="cta-purple" onclick="go(2)">Continuer →</button>
    </div>
  </div>

  <!-- ══════════════════════════════════════════
       SCREEN 2 — REVENUS
  ══════════════════════════════════════════ -->
  <div id="s2" class="screen">
    <div class="page-hdr">
      <div class="back-circle" onclick="go(1)">←</div>
      <div class="page-hdr-title">Revenus & situation pro</div>
    </div>
    <div class="progress-bar"><div class="progress-fill" style="width:50%"></div></div>
    <div class="progress-lbl">Étape 2 sur 4</div>
    <div class="scroll">
      <div class="pre-b">🔗 <strong>Données pré-remplies depuis Bankin'</strong> — vérifiez et ajustez si besoin.</div>

      <!-- PERSON 1 FIELDS -->
      <div class="person-label" style="margin-bottom:4px;">
        <div class="person-dot" style="background:var(--purple)">V</div>
        <div class="person-name" id="p1-rev-lbl">Vous — <span id="p1-contract-badge">CDI</span></div>
      </div>
      <!-- CDI/CDD fields P1 -->
      <div id="p1-salary-fields" class="form-sec">
        <div class="input-row">
          <div class="input-grp">
            <div class="input-sublbl">Salaire net mensuel</div>
            <div class="input-box"><input type="number" id="sal1-val" class="val-input" value="2500" oninput="S.salary1=+this.value||0;updateNetCalc()"><span class="unit">€/mois</span></div>
          </div>
        </div>
      </div>
      <!-- AE fields P1 -->
      <div id="p1-ae-fields" class="form-sec" style="display:none;">
        <div class="form-lbl">Structure juridique</div>
        <div class="struct-row" style="margin-bottom:8px;">
          <div class="struct-chip active" id="str1-micro" onclick="setStruct(1,'micro')">Micro-entr.</div>
          <div class="struct-chip" id="str1-eurl" onclick="setStruct(1,'eurl')">EURL</div>
          <div class="struct-chip" id="str1-sasu" onclick="setStruct(1,'sasu')">SASU</div>
          <div class="struct-chip" id="str1-sas" onclick="setStruct(1,'sas')">SAS</div>
          <div class="struct-chip" id="str1-sarl" onclick="setStruct(1,'sarl')">SARL</div>
        </div>
        <div class="form-lbl">Années d'activité</div>
        <div class="years-row" style="margin-bottom:8px;">
          <div class="year-chip" id="yr1-lt1" onclick="setYears(1,'<1')">< 1 an</div>
          <div class="year-chip" id="yr1-1-3" onclick="setYears(1,'1-3')">1–3 ans</div>
          <div class="year-chip active" id="yr1-3p" onclick="setYears(1,'3+')">3+ ans ✓</div>
        </div>
        <div class="period-row">
          <div class="input-sublbl" style="margin:0">Chiffre d'affaires</div>
          <div class="toggle-period">
            <div class="tp-btn active" id="ca1-m" onclick="setPeriod('ca1','m')">Mois</div>
            <div class="tp-btn" id="ca1-a" onclick="setPeriod('ca1','a')">An</div>
          </div>
        </div>
        <div class="input-row" style="margin-bottom:6px;">
          <div class="input-grp">
            <div class="input-box"><input type="number" id="ca1-val" class="val-input" value="4000" oninput="S.ca1=+this.value||0;updateNetCalc()"><span class="unit" id="ca1-unit">€/mois</span></div>
          </div>
        </div>
        <div class="period-row">
          <div class="input-sublbl" style="margin:0">Charges professionnelles</div>
          <div class="toggle-period">
            <div class="tp-btn active" id="fr1-m" onclick="setPeriod('fr1','m')">Mois</div>
            <div class="tp-btn" id="fr1-a" onclick="setPeriod('fr1','a')">An</div>
          </div>
        </div>
        <div class="input-row">
          <div class="input-grp">
            <div class="input-box"><input type="number" id="fr1-val" class="val-input" value="1000" oninput="S.fr1=+this.value||0;updateNetCalc()"><span class="unit" id="fr1-unit">€/mois</span></div>
          </div>
        </div>
        <div class="sum-row" style="margin:4px 0 0;">
          <div class="sum-lbl">Revenu net estimé (banques)</div>
          <div class="sum-val" id="net1-val">2 100 €/mois</div>
        </div>
      </div>

      <!-- PERSON 2 FIELDS (couple) -->
      <div id="p2-rev-section">
        <div class="person-label" style="margin-bottom:4px;">
          <div class="person-dot" style="background:#8B7FFF">C</div>
          <div class="person-name">Conjoint(e) — <span id="p2-contract-badge">CDI</span></div>
        </div>
        <!-- CDI/CDD fields P2 -->
        <div id="p2-salary-fields" class="form-sec">
          <div class="input-row">
            <div class="input-grp">
              <div class="input-sublbl">Salaire net mensuel</div>
              <div class="input-box"><input type="number" id="sal2-val" class="val-input" value="2200" oninput="S.salary2=+this.value||0;updateNetCalc()"><span class="unit">€/mois</span></div>
            </div>
          </div>
        </div>
        <!-- AE fields P2 -->
        <div id="p2-ae-fields" class="form-sec" style="display:none;">
          <div class="form-lbl">Structure juridique</div>
          <div class="struct-row" style="margin-bottom:8px;">
            <div class="struct-chip active" id="str2-micro" onclick="setStruct(2,'micro')">Micro-entr.</div>
            <div class="struct-chip" id="str2-eurl" onclick="setStruct(2,'eurl')">EURL</div>
            <div class="struct-chip" id="str2-sasu" onclick="setStruct(2,'sasu')">SASU</div>
            <div class="struct-chip" id="str2-sas" onclick="setStruct(2,'sas')">SAS</div>
            <div class="struct-chip" id="str2-sarl" onclick="setStruct(2,'sarl')">SARL</div>
          </div>
          <div class="form-lbl">Années d'activité</div>
          <div class="years-row" style="margin-bottom:8px;">
            <div class="year-chip" id="yr2-lt1" onclick="setYears(2,'<1')">< 1 an</div>
            <div class="year-chip" id="yr2-1-3" onclick="setYears(2,'1-3')">1–3 ans</div>
            <div class="year-chip active" id="yr2-3p" onclick="setYears(2,'3+')">3+ ans ✓</div>
          </div>
          <div class="period-row">
            <div class="input-sublbl" style="margin:0">Chiffre d'affaires</div>
            <div class="toggle-period">
              <div class="tp-btn active" id="ca2-m" onclick="setPeriod('ca2','m')">Mois</div>
              <div class="tp-btn" id="ca2-a" onclick="setPeriod('ca2','a')">An</div>
            </div>
          </div>
          <div class="input-row" style="margin-bottom:6px;">
            <div class="input-grp">
              <div class="input-box"><input type="number" id="ca2-val" class="val-input" value="3000" oninput="S.ca2=+this.value||0;updateNetCalc()"><span class="unit" id="ca2-unit">€/mois</span></div>
            </div>
          </div>
          <div class="period-row">
            <div class="input-sublbl" style="margin:0">Charges professionnelles</div>
            <div class="toggle-period">
              <div class="tp-btn active" id="fr2-m" onclick="setPeriod('fr2','m')">Mois</div>
              <div class="tp-btn" id="fr2-a" onclick="setPeriod('fr2','a')">An</div>
            </div>
          </div>
          <div class="input-row">
            <div class="input-grp">
              <div class="input-box"><input type="number" id="fr2-val" class="val-input" value="800" oninput="S.fr2=+this.value||0;updateNetCalc()"><span class="unit" id="fr2-unit">€/mois</span></div>
            </div>
          </div>
          <div class="sum-row" style="margin:4px 0 0;">
            <div class="sum-lbl">Revenu net estimé (banques)</div>
            <div class="sum-val" id="net2-val">1 540 €/mois</div>
          </div>
        </div>
      </div>

      <!-- CHARGES -->
      <div class="form-sec" style="margin-top:4px;">
        <div class="form-lbl">Charges mensuelles du foyer</div>
        <div class="input-box"><input type="number" id="charges-val" class="val-input" value="500" oninput="S.charges=+this.value||0"><span class="unit">€/mois</span></div>
      </div>
      <button class="cta-purple" onclick="go(3)" style="margin-top:6px;margin-bottom:16px;">Continuer →</button>
    </div>
  </div>

  <!-- ══════════════════════════════════════════
       SCREEN 3 — PROJET
  ══════════════════════════════════════════ -->
  <div id="s3" class="screen">
    <div class="page-hdr">
      <div class="back-circle" onclick="go(2)">←</div>
      <div class="page-hdr-title">Mon projet</div>
    </div>
    <div class="progress-bar"><div class="progress-fill" style="width:75%"></div></div>
    <div class="progress-lbl">Étape 3 sur 4</div>
    <div class="scroll">
      <div class="form-sec">
        <div class="form-lbl">Type de bien</div>
        <div class="seg-ctrl">
          <div class="seg-btn active" id="tp-p" onclick="setType('p')">🏗️ Neuf</div>
          <div class="seg-btn" id="tp-s" onclick="setType('s')">🏚️ Ancien</div>
        </div>
      </div>

      <!-- TRAVAUX SECTION (visible si Ancien) -->
      <div id="travaux-section" style="display:none;">
        <div class="form-sec">
          <div class="form-lbl">Travaux prévus ?</div>
          <div class="seg-ctrl">
            <div class="seg-btn active" id="trav-non" onclick="setTravaux(false)">Non</div>
            <div class="seg-btn" id="trav-oui" onclick="setTravaux(true)">Oui</div>
          </div>
        </div>
        <div id="travaux-montant-section" style="display:none;">
          <div class="form-sec">
            <div class="form-lbl">Montant estimé des travaux</div>
            <div class="input-box"><input type="number" id="travaux-val" class="val-input" value="0" oninput="S.travaux=+this.value||0"><span class="unit">€</span></div>
          </div>
        </div>
      </div>

      <div class="form-sec">
        <div class="form-lbl">C'est</div>
        <div class="seg-ctrl">
          <div class="seg-btn active" id="ac-p" onclick="setAchat('p')">Ma 1ère acquisition</div>
          <div class="seg-btn" id="ac-s" onclick="setAchat('s')">Un 2ème achat</div>
        </div>
      </div>
      <div class="slider-wrap">
        <div class="slider-label">
          <span>Durée du prêt</span>
          <strong id="duree-lbl">20 ans</strong>
        </div>
        <input type="range" min="10" max="25" value="20" step="5" id="duree-slider" oninput="setDuree(this.value)">
        <div style="display:flex;justify-content:space-between;margin-top:3px;">
          <span style="font-size:10px;color:var(--txt3)">10 ans</span>
          <span style="font-size:10px;color:var(--txt3)">25 ans</span>
        </div>
      </div>
      <div class="form-sec">
        <div class="form-lbl">Apport personnel</div>
        <div class="input-box"><input type="number" id="apport-val" class="val-input" value="20000" oninput="S.apport=+this.value||0"><span class="unit">€</span></div>
      </div>
      <div class="sum-row" style="margin:0 16px 8px;">
        <div class="sum-lbl">Revenus pris en compte</div>
        <div class="sum-val" id="total-rev-lbl">4 700 €/mois</div>
      </div>
      <button class="cta-purple" onclick="openLeadModal()" style="margin-bottom:16px;">Calculer ma capacité →</button>
    </div>
  </div>

  <!-- ══════════════════════════════════════════
       SCREEN 4 — RÉSULTATS
  ══════════════════════════════════════════ -->
  <div id="s4" class="screen">
    <div class="result-wrap">
      <div class="result-back">
        <div class="result-back-btn" onclick="go(3)">←</div>
        <div class="result-title">Capacité d'emprunt estimée</div>
      </div>
      <div class="result-amount" id="rAmt">182 000 €</div>
      <div class="result-sub" id="rSub">Sur 20 ans · Taux estimé 3,60 %</div>
      <div id="rate-disclaimer" style="font-size:9.5px;color:rgba(255,255,255,.6);margin-top:4px;margin-bottom:8px;font-style:italic;">* Taux à titre indicatif — susceptible d'évoluer selon votre dossier final</div>
      <div class="metric-row">
        <div class="metric-chip"><div class="mv" id="rMens">1 645 €</div><div class="ml">Mensualité max</div></div>
        <div class="metric-chip"><div class="mv" id="rPrix">202 k€</div><div class="ml">Prix achat max</div></div>
        <div class="metric-chip"><div class="mv" id="rPtz">+ 15 k€</div><div class="ml">PTZ estimé</div></div>
      </div>
    </div>
    <div class="scroll" style="padding-top:0;">
      <!-- STABILITY BADGE -->
      <div class="stability-card">
        <div class="stab-row">
          <div style="font-size:20px" id="stab-icon">✅</div>
          <div class="stab-bar-wrap">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
              <div class="stab-label" id="stab-label">Profil Excellent</div>
              <div style="font-size:10px;font-weight:700;" id="stab-score-txt">3/3</div>
            </div>
            <div class="stab-bar-bg">
              <div class="stab-bar-fill" id="stab-bar" style="width:100%;background:var(--green)"></div>
            </div>
          </div>
        </div>
        <div class="stab-sub" id="stab-msg">CDI + CDI — accès au crédit optimal, taux préférentiel possible</div>
      </div>
      <!-- AE YELLOW INFO BOX -->
      <div class="ae-info-b" id="ae-info-box">
        <div class="ae-info-title" id="ae-info-title">⚠️ Bon à savoir — Dossier indépendant</div>
        <div id="ae-info-body"></div>
      </div>
      <div class="d-card">
        <div class="d-hdr">Détail du financement</div>
        <div class="d-row"><span>Prix d'achat max.</span><span class="v" id="dPrix">202 000 €</span></div>
        <div class="d-row"><span>Apport personnel</span><span class="v" id="dApport">20 000 €</span></div>
        <div class="d-row"><span>Frais de notaires <span style="font-size:9px;color:var(--txt2)" id="notaire-pct">(3 %)</span></span><span class="r" id="dNotaire">6 060 €</span></div>
        <div class="d-row"><span>PTZ estimé <span style="font-size:9px;color:var(--txt2)">(selon foyer)</span></span><span class="g" id="dPtz">+ 15 000 €</span></div>
        <div class="d-row"><span>Revenus retenus/mois</span><span class="v" id="dRev">4 700 €</span></div>
        <div class="d-row"><span>Taux assurance</span><span class="v">0,30 %</span></div>
      </div>
      <div class="broker-card">
        <div class="broker-hdr">Obtenir le meilleur taux</div>
        <div class="broker-row" style="cursor:pointer;" onclick="showContact('Pretto')">
          <div class="broker-left"><div class="broker-icon">🏦</div>
            <div><div class="broker-name">Pretto</div><div class="broker-sub">Réponse en 24h</div></div></div>
          <div class="broker-rate" id="rate1">3,52 %</div>
        </div>
        <div class="broker-row" style="cursor:pointer;" onclick="showContact('Meilleurtaux')">
          <div class="broker-left"><div class="broker-icon">🏛️</div>
            <div><div class="broker-name">Meilleurtaux</div><div class="broker-sub">+100 banques</div></div></div>
          <div class="broker-rate" id="rate2">3,55 %</div>
        </div>
      </div>
      <div class="broker-card" style="margin-bottom:0;">
        <div class="broker-hdr">Banques partenaires</div>
        <div class="broker-row" style="cursor:pointer;" onclick="showContact('Crédit Agricole')">
          <div class="broker-left">
            <div class="broker-icon" style="background:#00965E;color:#fff;font-size:9px;font-weight:800;">CA</div>
            <div><div class="broker-name">Crédit Agricole</div><div class="broker-sub">Primo-accédants · Offre verte</div></div>
          </div>
          <div class="broker-rate">3,45 %</div>
        </div>
        <div class="broker-row" style="cursor:pointer;" onclick="showContact('BNP Paribas')">
          <div class="broker-left">
            <div class="broker-icon" style="background:#009E3B;color:#fff;font-size:8px;font-weight:800;">BNP</div>
            <div><div class="broker-name">BNP Paribas</div><div class="broker-sub">+200 agences · PTZ inclus</div></div>
          </div>
          <div class="broker-rate">3,50 %</div>
        </div>
        <div class="broker-row" style="cursor:pointer;" onclick="showContact('Société Générale')">
          <div class="broker-left">
            <div class="broker-icon" style="background:#E30613;color:#fff;font-size:8px;font-weight:800;">SG</div>
            <div><div class="broker-name">Société Générale</div><div class="broker-sub">Simulation en ligne · Réponse 48h</div></div>
          </div>
          <div class="broker-rate">3,52 %</div>
        </div>
      </div>
      <button class="cta-main" onclick="showContact('votre courtier')">Être mis en relation →</button>
      <div class="share-row" style="margin-bottom:16px;">
        <div class="share-btn" onclick="alert('Sauvegardé !')">💾 Sauvegarder</div>
        <div class="share-btn" onclick="go(1)">🔄 Recommencer</div>
      </div>
    </div>
  </div>

  <!-- LEAD CAPTURE MODAL — inside phone -->
  <div id="lead-modal" style="display:none;position:absolute;inset:0;z-index:200;align-items:center;justify-content:center;">
    <div onclick="closeLead()" style="position:absolute;inset:0;background:rgba(10,8,38,.6);backdrop-filter:blur(4px);"></div>
    <div style="position:relative;background:#fff;border-radius:20px;padding:22px 18px;width:calc(100% - 32px);max-width:310px;box-shadow:0 20px 60px rgba(0,0,0,.35);margin:0 16px;">
      <div style="font-size:16px;font-weight:800;color:var(--txt);margin-bottom:5px;">🏠 Votre estimation personnalisée</div>
      <div style="font-size:11px;color:var(--txt2);margin-bottom:14px;line-height:1.5;">Pour accéder à votre capacité d'emprunt détaillée, renseignez vos coordonnées. Nous ne partageons pas vos données.</div>
      <div id="lead-nom-wrap" style="margin-bottom:8px;">
        <input id="lead-nom" type="text" placeholder="Nom *" style="width:100%;border:1.5px solid var(--border);border-radius:10px;padding:9px 11px;font-size:13px;font-family:inherit;outline:none;">
      </div>
      <div id="lead-prenom-wrap" style="margin-bottom:8px;">
        <input id="lead-prenom" type="text" placeholder="Prénom *" style="width:100%;border:1.5px solid var(--border);border-radius:10px;padding:9px 11px;font-size:13px;font-family:inherit;outline:none;">
      </div>
      <div id="lead-email-wrap" style="margin-bottom:10px;">
        <input id="lead-email" type="email" placeholder="Email *" style="width:100%;border:1.5px solid var(--border);border-radius:10px;padding:9px 11px;font-size:13px;font-family:inherit;outline:none;">
      </div>
      <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:10px;">
        <input type="checkbox" id="lead-rgpd" style="margin-top:2px;flex-shrink:0;">
        <label for="lead-rgpd" style="font-size:10px;color:var(--txt2);line-height:1.4;cursor:pointer;">J'accepte que mes informations soient utilisées pour recevoir mon estimation et être éventuellement contacté(e) par Bankin'. Conformément au RGPD, vous pouvez retirer votre consentement à tout moment.</label>
      </div>
      <div id="lead-error" style="display:none;background:#FFF0F0;border:1px solid #FFCACA;border-radius:8px;padding:8px 10px;font-size:11px;color:#CC0000;margin-bottom:10px;"></div>
      <button onclick="submitLead()" style="width:100%;background:var(--purple);color:#fff;border:none;border-radius:14px;padding:12px;font-size:13px;font-weight:800;cursor:pointer;">Voir mes résultats →</button>
      <button onclick="closeLead()" style="width:100%;background:transparent;border:none;color:var(--txt2);font-size:12px;padding:7px;cursor:pointer;margin-top:3px;">Annuler</button>
    </div>
  </div>

  <!-- CONTACT MODAL — inside phone -->
  <div id="contact-modal" style="display:none;position:absolute;inset:0;z-index:200;align-items:center;justify-content:center;">
    <div onclick="closeContact()" style="position:absolute;inset:0;background:rgba(10,8,38,.6);backdrop-filter:blur(4px);"></div>
    <div style="position:relative;background:#fff;border-radius:20px;padding:24px 20px;width:calc(100% - 32px);max-width:300px;box-shadow:0 20px 60px rgba(0,0,0,.35);text-align:center;margin:0 16px;">
      <div style="font-size:32px;margin-bottom:10px;">🤝</div>
      <div style="font-size:16px;font-weight:800;color:var(--txt);margin-bottom:8px;" id="contact-title">Mise en relation</div>
      <div style="font-size:12px;color:var(--txt2);line-height:1.5;margin-bottom:18px;" id="contact-msg">Votre demande a bien été transmise. Un conseiller vous contactera dans les 24h.</div>
      <button onclick="closeContact()" style="background:var(--purple);color:#fff;border:none;border-radius:12px;padding:11px 28px;font-size:13px;font-weight:800;cursor:pointer;">Parfait !</button>
    </div>
  </div>

</div><!-- /phone -->
</div><!-- /phone-wrap -->

<div class="hint">Cliquez les étapes · Naviguez dans l'app · <kbd>←</kbd> <kbd>→</kbd> clavier</div>

`;

export const simulatorScript: string = `const MAX_SCREEN = 4;
let cur = 0;
const S = {
  emprunt:'c', sit:'l', kids:2, type:'p', achat:'p', duree:20, apport:20000,
  contract1:'cdi', contract2:'cdi',
  struct1:'micro', struct2:'micro',
  years1:'3+', years2:'3+',
  ca1:4000, ca1_period:'m', fr1:1000, fr1_period:'m',
  ca2:3000, ca2_period:'m', fr2:800, fr2_period:'m',
  salary1:2500, salary2:2200, charges:500,
  travaux:0, travauxOui:false,
};

function updTime(){
  const n=new Date();
  document.getElementById('clock').textContent=n.getHours()+':'+String(n.getMinutes()).padStart(2,'0');
}
updTime(); setInterval(updTime,30000);

function toggleView(){
  document.body.classList.toggle('desktop');
}

function dismissBanner(e){
  e.stopPropagation();
  const banner = document.getElementById('home-banner');
  if(banner) banner.parentElement.style.display='none';
}

function toggleLegal(){
  const c=document.getElementById('legal-content');
  const a=document.getElementById('legal-arrow');
  c.style.display=c.style.display==='none'?'block':'none';
  a.textContent=c.style.display==='none'?'▼':'▲';
}

function go(n){
  document.getElementById('s'+cur).classList.remove('active');
  document.getElementById('s'+n).classList.add('active');
  cur=n;
  updateDots();
  if(n===1) updateProfilInfo();
  if(n===2) updateRevScreen();
  if(n===3) updateProjScreen();
  if(n===4) calcResults();
}

function updateDots(){
  for(let i=0;i<=4;i++){
    const d=document.getElementById('dot'+i);
    if(!d) continue;
    d.classList.remove('active','done');
    if(i<cur) d.classList.add('done');
    else if(i===cur) d.classList.add('active');
  }
  for(let i=0;i<=3;i++){
    const l=document.getElementById('line'+i+(i+1));
    if(l) l.classList.toggle('done', i<cur);
  }
}

// ── PROFILE SCREEN ──────────────────────────────────────────────────────
function setEmprunt(v){
  S.emprunt=v;
  document.getElementById('sb-s').classList.toggle('active',v==='s');
  document.getElementById('sb-c').classList.toggle('active',v==='c');
  document.getElementById('p2-section').style.display=v==='c'?'':'none';
  document.getElementById('p1-lbl').textContent = v==='c' ? 'Votre statut professionnel' : 'Mon statut professionnel';
  updateProfilInfo();
}

function setSit(v){
  S.sit=v;
  document.getElementById('sit-l').classList.toggle('active',v==='l');
  document.getElementById('sit-p').classList.toggle('active',v==='p');
  updateProfilInfo();
}

function setKids(n){
  S.kids=n;
  ['k0','k1','k2','k3'].forEach((id,i)=>document.getElementById(id).classList.toggle('active',i===n));
}

function setContract(person, val){
  const key = 'contract'+person;
  S[key]=val;
  ['cdi','cdd','ae'].forEach(t=>{
    const el = document.getElementById('ct'+person+'-'+t);
    if(!el) return;
    el.classList.remove('active','active-cdd','active-ae');
    if(t===val){
      if(val==='cdi') el.classList.add('active');
      else if(val==='cdd') el.classList.add('active-cdd');
      else el.classList.add('active-ae');
    }
  });
  updateProfilInfo();
}

function updateProfilInfo(){
  const c1 = S.contract1;
  const c2 = (S.emprunt === 'c') ? S.contract2 : null;
  const bothCDI = c1==='cdi' && (!c2 || c2==='cdi');
  const hasAE = c1==='ae' || (c2 && c2==='ae');
  const hasCDD = c1==='cdd' || (c2 && c2==='cdd');
  const AE_and_CDD = (c1==='ae'&&c2==='cdd') || (c1==='cdd'&&c2==='ae');
  const bothAE = c1==='ae' && c2==='ae';
  const bothCDD = c1==='cdd' && c2==='cdd';

  let lines = [];
  if (bothCDI) {
    lines.push('✅ CDI : profil le plus favorable pour les banques. Accès au crédit optimal.');
    if (S.sit==='l') lines.push('• Locataire depuis 2+ ans sans avoir été propriétaire → éligible au PTZ selon revenus (RFR).');
  } else if (bothAE) {
    lines.push('🔴 Deux profils indépendants : dossier très complexe à valider.');
    lines.push('• Les banques exigent <strong>au minimum 3 ans d\'activité</strong> pour chacun.');
    lines.push('• Un apport de 20 à 30 % est fortement recommandé.');
    lines.push('• Une analyse approfondie de votre dossier sera indispensable avant toute démarche.');
  } else if (AE_and_CDD) {
    lines.push('🔴 Profil risqué : indépendant + CDD. Les banques seront très prudentes.');
    lines.push('• L\'indépendant doit justifier <strong>3 ans d\'activité minimum</strong>.');
    lines.push('• Apport important (30 %+) généralement requis.');
  } else if (hasAE) {
    lines.push('⚠️ Un profil indépendant dans le dossier nécessite <strong>minimum 3 ans d\'activité</strong> pour être pris en compte par les banques.');
    lines.push('• Les revenus d\'un indépendant sont généralement pris à 70 % du bénéfice net.');
    lines.push('• Un apport est conseillé pour renforcer le dossier.');
    if (S.sit==='l') lines.push('• PTZ : éligible si locataire depuis 2+ ans selon vos revenus (RFR).');
  } else if (bothCDD) {
    lines.push('🔴 Double CDD : prêt très difficile à obtenir.');
    lines.push('• Apport de 30 %+ généralement requis. La période d\'essai doit être passée pour les deux.');
  } else if (hasCDD) {
    lines.push('• CDD : prêt possible si la période d\'essai est terminée. Revenus pris à 85 %.');
    lines.push('• Le CDI de l\'autre personne rassure les banques.');
    if (S.sit==='l') lines.push('• PTZ : éligible si locataire depuis 2+ ans selon vos revenus (RFR).');
  }

  const title = '💡 Bon à savoir';
  document.getElementById('profil-info').innerHTML = '<div style="font-weight:700;margin-bottom:5px;font-size:10px;">' + title + '</div>' + lines.map(l => '<p style="margin-bottom:3px;">'+l+'</p>').join('');
}

// ── REVENUE SCREEN ───────────────────────────────────────────────────────
function updateRevScreen(){
  const c1=S.contract1, c2=S.contract2, isCpl=S.emprunt==='c';

  document.getElementById('p1-contract-badge').textContent = contractLabel(c1);
  document.getElementById('p1-salary-fields').style.display = (c1!=='ae')?'':'none';
  document.getElementById('p1-ae-fields').style.display = (c1==='ae')?'':'none';

  document.getElementById('p2-rev-section').style.display = isCpl?'':'none';
  if(isCpl){
    document.getElementById('p2-contract-badge').textContent = contractLabel(c2);
    document.getElementById('p2-salary-fields').style.display = (c2!=='ae')?'':'none';
    document.getElementById('p2-ae-fields').style.display = (c2==='ae')?'':'none';
  }
  updateNetCalc();
}

function contractLabel(c){
  return c==='cdi'?'💼 CDI':c==='cdd'?'📋 CDD':'🔧 Indépendant';
}

function setStruct(person, val){
  S['struct'+person]=val;
  ['micro','eurl','sasu','sas','sarl'].forEach(s=>{
    const el=document.getElementById('str'+person+'-'+s);
    if(el){ el.classList.remove('active'); if(s===val) el.classList.add('active'); }
  });
}

function setYears(person, val){
  S['years'+person]=val;
  const map={'<1':'lt1','1-3':'1-3','3+':'3p'};
  ['<1','1-3','3+'].forEach(y=>{
    const el=document.getElementById('yr'+person+'-'+map[y]);
    if(el){ el.classList.remove('active'); if(y===val) el.classList.add('active'); }
  });
  updateNetCalc();
}

function setPeriod(field, val){
  S[field+'_period']=val;
  document.getElementById(field+'-m').classList.toggle('active',val==='m');
  document.getElementById(field+'-a').classList.toggle('active',val==='a');
  const unit = document.getElementById(field+'-unit');
  if(unit) unit.textContent = val==='m'?'€/mois':'€/an';
  updateNetCalc();
}

function getNetMonthly(person){
  const c=S['contract'+person];
  if(c==='cdi') return S['salary'+person];
  if(c==='cdd') return S['salary'+person]*0.85;
  // AE / indépendant
  const ca = S['ca'+person], ca_p = S['ca'+person+'_period'];
  const fr = S['fr'+person], fr_p = S['fr'+person+'_period'];
  const caM = ca_p==='a'?ca/12:ca;
  const frM = fr_p==='a'?fr/12:fr;
  const net = caM - frM;
  const years = S['years'+person];
  const coeff = years==='3+'?0.70:years==='1-3'?0.50:0.30;
  return Math.max(0, net*coeff);
}

function updateNetCalc(){
  const n1=getNetMonthly(1);
  const el1=document.getElementById('net1-val');
  if(el1) el1.textContent=Math.round(n1).toLocaleString('fr-FR')+' €/mois';
  if(S.emprunt==='c'){
    const n2=getNetMonthly(2);
    const el2=document.getElementById('net2-val');
    if(el2) el2.textContent=Math.round(n2).toLocaleString('fr-FR')+' €/mois';
  }
}

// ── PROJECT SCREEN ───────────────────────────────────────────────────────
function updateProjScreen(){
  const rev = getTotalRev();
  document.getElementById('total-rev-lbl').textContent=Math.round(rev).toLocaleString('fr-FR')+' €/mois';
}

function getTotalRev(){
  let r = getNetMonthly(1);
  if(S.emprunt==='c') r += getNetMonthly(2);
  return r;
}

function setType(v){
  S.type=v;
  document.getElementById('tp-p').classList.toggle('active',v==='p');
  document.getElementById('tp-s').classList.toggle('active',v==='s');
  document.getElementById('travaux-section').style.display = v==='s' ? '' : 'none';
}

function setTravaux(oui){
  S.travauxOui = oui;
  document.getElementById('trav-non').classList.toggle('active', !oui);
  document.getElementById('trav-oui').classList.toggle('active', oui);
  document.getElementById('travaux-montant-section').style.display = oui ? '' : 'none';
}

function setAchat(v){
  S.achat=v;
  document.getElementById('ac-p').classList.toggle('active',v==='p');
  document.getElementById('ac-s').classList.toggle('active',v==='s');
}

function setDuree(v){
  S.duree=parseInt(v);
  document.getElementById('duree-lbl').textContent=v+' ans';
}

// ── LEAD MODAL ────────────────────────────────────────────────────────────
function openLeadModal(){
  document.getElementById('lead-modal').style.display='flex';
}
function closeLead(){
  document.getElementById('lead-modal').style.display='none';
}
function submitLead(){
  const nom = document.getElementById('lead-nom').value.trim();
  const prenom = document.getElementById('lead-prenom').value.trim();
  const email = document.getElementById('lead-email').value.trim();
  const rgpd = document.getElementById('lead-rgpd').checked;

  let errors = [];
  ['lead-nom','lead-prenom','lead-email'].forEach(id => {
    document.getElementById(id).style.borderColor='var(--border)';
  });

  if(!nom){ document.getElementById('lead-nom').style.borderColor='#FF4136'; errors.push('Nom requis'); }
  if(!prenom){ document.getElementById('lead-prenom').style.borderColor='#FF4136'; errors.push('Prénom requis'); }
  if(!email||!email.includes('@')){ document.getElementById('lead-email').style.borderColor='#FF4136'; errors.push('Email valide requis'); }
  if(!rgpd){ errors.push('Veuillez accepter les conditions RGPD pour continuer.'); }

  if(errors.length>0){
    const errDiv = document.getElementById('lead-error');
    errDiv.style.display='block';
    errDiv.innerHTML = errors.join('<br>');
    return;
  }

  closeLead();
  calcAndGo();
}

// ── CONTACT MODAL ─────────────────────────────────────────────────────────
function showContact(name){
  document.getElementById('contact-title').textContent='Mise en relation avec '+name+' enregistré';
  document.getElementById('contact-msg').textContent='Votre demande a bien été transmise à '+name+'. Un conseiller spécialisé vous contactera dans les 24 à 48 heures pour analyser votre projet.';
  document.getElementById('contact-modal').style.display='flex';
}
function closeContact(){
  document.getElementById('contact-modal').style.display='none';
}

// ── STABILITY ────────────────────────────────────────────────────────────
function getStability(){
  const c1=S.contract1, c2=S.emprunt==='c'?S.contract2:null;
  const hasAE = c1==='ae'||(c2&&c2==='ae');
  const hasCDD = c1==='cdd'||(c2&&c2==='cdd');

  if(c1==='cdi'&&(!c2||c2==='cdi'))
    return{score:3,pct:100,color:'#00C48C',icon:'✅',label:'Profil Excellent',msg:'CDI — accès au crédit optimal, taux préférentiel possible'};
  if((c1==='cdi'&&c2==='cdd')||(c1==='cdd'&&c2==='cdi'))
    return{score:2.5,pct:83,color:'#00C48C',icon:'✅',label:'Profil Solide',msg:'CDI + CDD — le CDI rassure les banques, le CDD pris à 85 %'};
  if((c1==='cdi'&&c2==='ae')||(c1==='ae'&&c2==='cdi'))
    return{score:2,pct:67,color:'#FF8C00',icon:'⚡',label:'Profil Mixte',msg:'CDI + Indépendant — revenus indépendant pris à 70 % par les banques, apport conseillé'};
  if(c1==='cdd'&&!c2)
    return{score:1.5,pct:50,color:'#FF8C00',icon:'⚠️',label:'Profil Fragile',msg:'CDD seul — prêt possible mais fin de période d\'essai requise'};
  if(c1==='ae'&&!c2){
    const y=S.years1;
    if(y==='<1') return{score:0.5,pct:17,color:'#FF4136',icon:'🔴',label:'Très difficile',msg:'Indépendant < 1 an — banques refusent généralement, attendez 3 ans d\'activité'};
    if(y==='1-3') return{score:1,pct:33,color:'#FF8C00',icon:'⚠️',label:'Difficile',msg:'Indépendant 1–3 ans — revenus pris à 50 %, apport important recommandé'};
    return{score:1.5,pct:50,color:'#FF8C00',icon:'⚡',label:'Complexe',msg:'Indépendant 3+ ans — revenus pris à 70 % du bénéfice net, dossier exigeant'};
  }
  if(c1==='cdd'&&c2==='cdd')
    return{score:1,pct:33,color:'#FF4136',icon:'🔴',label:'Profil Fragile',msg:'Double CDD — très difficile, apport important requis (30 %+)'};
  if((c1==='ae'&&c2==='cdd')||(c1==='cdd'&&c2==='ae'))
    return{score:1,pct:33,color:'#FF4136',icon:'🔴',label:'Profil Fragile',msg:'CDD + Indépendant — profil instable, apport conséquent conseillé'};
  if(c1==='ae'&&c2==='ae')
    return{score:0.5,pct:17,color:'#FF4136',icon:'🔴',label:'Très Complexe',msg:'Double indépendant — 3 ans requis pour chacun, apport 30 %+ recommandé'};
  return{score:2,pct:67,color:'#FF8C00',icon:'⚡',label:'Profil Mixte',msg:'Profil standard'};
}

// ── CALCULATE RESULTS ────────────────────────────────────────────────────
function calcAndGo(){ calcResults(); go(4); }

function calcResults(){
  const rates={10:3.30,15:3.45,20:3.60,25:3.75};
  const rate=rates[S.duree]||3.60;
  const totalRev=getTotalRev();
  const maxM=Math.max(0, totalRev*0.35 - S.charges);
  const r=rate/100/12, n=S.duree*12;
  const cap=Math.floor(maxM*(1-Math.pow(1+r,-n))/r);
  const ptz=(S.sit==='l'&&S.achat==='p'&&S.kids>=1)?[0,12000,15000,18000][Math.min(S.kids,3)]:0;
  const prix=cap+S.apport+ptz;

  // Frais de notaires
  const notaireRate = S.type==='p' ? 0.03 : 0.08;
  const fraisNotaire = Math.round(prix * notaireRate);
  document.getElementById('dNotaire').textContent = fraisNotaire.toLocaleString('fr-FR')+' €';
  document.getElementById('notaire-pct').textContent = '('+(notaireRate*100).toFixed(0)+' % — '+(S.type==='p'?'neuf':'ancien')+')';

  document.getElementById('rAmt').textContent=cap.toLocaleString('fr-FR')+' €';
  document.getElementById('rSub').textContent='Sur '+S.duree+' ans · Taux estimé '+rate.toFixed(2).replace('.',',')+' %';
  document.getElementById('rMens').textContent=Math.round(maxM).toLocaleString('fr-FR')+' €';
  document.getElementById('rPrix').textContent=Math.floor(prix/1000)+' k€';
  document.getElementById('rPtz').textContent=ptz>0?'+ '+Math.floor(ptz/1000)+' k€':'0 €';
  document.getElementById('dPrix').textContent=prix.toLocaleString('fr-FR')+' €';
  document.getElementById('dApport').textContent=S.apport.toLocaleString('fr-FR')+' €';
  document.getElementById('dPtz').textContent=ptz>0?'+ '+ptz.toLocaleString('fr-FR')+' €':'0 €';
  document.getElementById('dPtz').className=ptz>0?'g':'v';
  document.getElementById('dRev').textContent=Math.round(totalRev).toLocaleString('fr-FR')+' €';
  document.getElementById('rate1').textContent=(rate-.08).toFixed(2).replace('.',',')+' %';
  document.getElementById('rate2').textContent=(rate-.05).toFixed(2).replace('.',',')+' %';

  // Stability
  const st=getStability();
  document.getElementById('stab-icon').textContent=st.icon;
  document.getElementById('stab-label').textContent=st.label;
  document.getElementById('stab-score-txt').textContent=st.score+'/3';
  document.getElementById('stab-bar').style.width=st.pct+'%';
  document.getElementById('stab-bar').style.background=st.color;
  document.getElementById('stab-label').style.color=st.color;
  document.getElementById('stab-msg').textContent=st.msg;

  // AE yellow info box logic
  const hasAE = S.contract1==='ae'||(S.emprunt==='c'&&S.contract2==='ae');
  const doubleAE = S.emprunt==='c' && S.contract1==='ae' && S.contract2==='ae';
  const aeBox = document.getElementById('ae-info-box');
  const aeTitle = document.getElementById('ae-info-title');
  const aeBody = document.getElementById('ae-info-body');

  if(hasAE){
    const ca1M = S.contract1==='ae' ? (S.ca1_period==='a'?S.ca1/12:S.ca1) : 0;
    const ca2M = (S.emprunt==='c'&&S.contract2==='ae') ? (S.ca2_period==='a'?S.ca2/12:S.ca2) : 0;
    const totalCA = ca1M + ca2M;
    const highCA = totalCA >= 8000;

    if(doubleAE && highCA){
      document.getElementById('stab-icon').textContent='⚡';
      document.getElementById('stab-label').textContent='Théoriquement viable';
      document.getElementById('stab-label').style.color='#E07800';
      document.getElementById('stab-score-txt').textContent='2/3';
      document.getElementById('stab-bar').style.width='67%';
      document.getElementById('stab-bar').style.background='#E07800';
      document.getElementById('stab-msg').textContent='Double indépendant avec CA solide ('+Math.round(totalCA).toLocaleString('fr-FR')+' €/mois cumulé) — projet recevable mais dossier très scruté';

      aeTitle.textContent='💡 Bon à savoir — Deux profils indépendants';
      aeBody.innerHTML=\`Votre projet est <strong>théoriquement viable</strong> au regard de vos revenus. Cependant, vos deux profils étant indépendants, ce type de dossier nécessite une analyse bien plus approfondie qu'un dossier classique. Nous vous recommandons de <strong>prendre rendez-vous avec un conseiller spécialisé</strong> pour étudier votre situation en détail avant de démarcher les banques.\`;
      aeBox.style.display='';
    } else if(doubleAE && !highCA){
      aeTitle.textContent='💡 Bon à savoir — Deux profils indépendants';
      aeBody.innerHTML=\`Votre projet est <strong>théoriquement viable</strong> au regard de vos revenus. Cependant, vos deux profils étant indépendants, ce type de dossier nécessite une analyse bien plus approfondie qu'un dossier classique. Nous vous recommandons de <strong>prendre rendez-vous avec un conseiller spécialisé</strong> pour étudier votre situation en détail avant de démarcher les banques.\`;
      aeBox.style.display='';
    } else if(!doubleAE && hasAE){
      const singleCA = ca1M || ca2M;
      if(singleCA >= 4000){
        if(parseFloat(document.getElementById('stab-score-txt').textContent)<1.5){
          document.getElementById('stab-icon').textContent='⚡';
          document.getElementById('stab-label').textContent='Profil mixte — recevable';
          document.getElementById('stab-label').style.color='#E07800';
          document.getElementById('stab-score-txt').textContent='1,5/3';
          document.getElementById('stab-bar').style.width='50%';
          document.getElementById('stab-bar').style.background='#E07800';
        }
      }
      aeTitle.textContent='💡 Bon à savoir — Un profil indépendant';
      aeBody.innerHTML=\`Votre projet est <strong>théoriquement viable</strong> au regard de vos revenus. Cependant, votre dossier incluant un profil indépendant, il nécessite une analyse plus approfondie qu'un dossier purement salarié. Nous vous recommandons de <strong>prendre rendez-vous avec un conseiller spécialisé</strong> pour étudier votre situation en détail avant de démarcher les banques.\`;
      aeBox.style.display='';
    }
  } else {
    aeBox.style.display='none';
  }
}

// ── KEYBOARD NAV ─────────────────────────────────────────────────────────
document.addEventListener('keydown',e=>{
  if(e.key==='ArrowRight'&&cur<4) go(cur+1);
  if(e.key==='ArrowLeft'&&cur>0) go(cur-1);
});

// Init
setEmprunt('c');
updateDots();
updateProfilInfo();
`;
