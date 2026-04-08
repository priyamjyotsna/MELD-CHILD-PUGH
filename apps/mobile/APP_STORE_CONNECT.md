# App Store Connect — submission reference (iOS)

Guide for **MELD family scores** (`com.livertracker.easy-liver-tools`) after TestFlight validation. Use this for **screenshots**, optional marketing copy, and a final checklist. **Always confirm pixel sizes inside App Store Connect** — Apple occasionally updates required display sizes. Authoritative tables: [Screenshot specifications](https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications) (Apple Developer).

---

## 1. App identity (from project)

| Field | Value |
|--------|--------|
| **App name** (30 chars max) | `MELD family scores` |
| **Bundle ID** | `com.livertracker.easy-liver-tools` |
| **SKU** | (your internal SKU; not shown on store) |
| **Marketing version** | `1.0.0` (`app.json` → `expo.version`) |
| **Build number** | `1` (`app.json` → `expo.ios.buildNumber`; bump per upload) |
| **Primary language** | English (U.S.) or your primary locale |

Privacy: `ITSAppUsesNonExemptEncryption` is **false** in `app.json` (standard declaration for apps that only use HTTPS).

---

## 2. Screenshot requirements (iPhone + iPad)

Your app sets **`supportsTablet: true`**, so treat **iPhone and iPad** screenshot slots as required for the store listing (Connect will show which sizes are mandatory for your app).

### 2.1 Typical required sizes (verify in Connect)

Capture in **PNG or JPEG**, **RGB**, no transparency, **no rounded-corner mask** (Apple applies device frame). **Portrait** matches your app (`orientation: portrait`).

**iPhone — 6.7″ display (most common “main” set today)**  
Use a **6.7″** simulator or device (e.g. iPhone 15 Pro Max / 16 Pro Max class). Connect usually expects one of:

- **1290 × 2796** px, or  
- **1260 × 2736** px  

*(Pick the size Connect shows for your chosen “6.7-inch Display” slot.)*

**iPhone — other slots**  
If Connect asks for **6.5″** or **5.5″**, duplicate your 6.7″ art **centered on a matching canvas** or re-export from the same simulator family — **do not stretch**; use the exact pixel dimensions Connect lists.

**iPad**  
If an **iPad Pro (12.9″)** (or current equivalent) slot appears, common target is **2048 × 2732** px portrait — **confirm in Connect**.

### 2.2 How to capture (recommended)

1. **Xcode Simulator** → choose **iPhone 15 Pro Max** (or the 6.7″ device that matches Connect’s listed resolution).  
2. Run the **release or TestFlight build** (or `expo start` + dev client) with **same UI** you ship.  
3. **Simulator → File → Save Screen** (or **⌘S**) for PNG.  
4. For iPad, repeat on **iPad Pro 12.9″** simulator (or the size Connect specifies).  
5. **Status bar**: use a **clean** time (e.g. 9:41), full battery, real carrier or “Carrier” — avoid debug banners; hide developer overlays.  
6. **No personal health data**: use **demo / fictional** labs only (see suggested values below).

### 2.3 Suggested screenshot storyboard (order + intent)

Use **3–10** screenshots per localization; the first 1–3 matter most for conversion.

| # | Screen to show | Suggested focus |
|---|----------------|-----------------|
| **1** | **Home** (`index.tsx`) — hero + first cards | Tagline *“Liver Health Assessment. Simplified.”* and tool grid (*MELD · Child-Pugh · FibroScan · Enzymes*). Shows scope at a glance. |
| **2** | **MELD** — input | All three variants (MELD / MELD-Na / MELD 3.0) visible in UI if possible. |
| **3** | **MELD — result** | Score, interpretation, disclaimer-adjacent UI (no alarming “diagnosis” language in your overlay text if you add marketing captions outside the app). |
| **4** | **Child-Pugh** — input or result | Class **A / B / C** visible on result. |
| **5** | **FibroScan** — result | Stiffness **kPa** + **F0–F4** / optional **CAP** / **S0–S3**. |
| **6** | **Liver enzymes** — result | Traffic-light style + pattern (hepatocellular / cholestatic / mixed) if visible. |
| **7** | **About & references** | Citations / credibility (OSF DOIs, free tool + engine on GitHub) — builds trust for clinicians. |
| **8** (optional) | **Disclaimer** (short scroll top) | Shows seriousness and compliance-minded design — use only if it reads well visually. |

**Demo inputs** (fictional, for consistent screenshots):

- MELD-Na example: bilirubin **2.0**, creatinine **1.2**, INR **1.4**, sodium **132**, not on dialysis.  
- Child-Pugh: values that yield a clear **Class B** or **C** (clear typography in screenshot).  
- FibroScan: stiffness **10.2** kPa, CAP **280** dB/m (if CAP UI appears).  
- Enzymes: ALT **120**, AST **90**, ALP **200**, GGT **65**, bilirubin **1.0** mg/dL.

### 2.4 Optional: App Preview (video)

15–30s screen recording in the same device size; show **home → one calculator → result**. No music required; keep in-app disclaimer context visible if you show results.

---

## 3. Copy you can paste (if a field is still empty)

Tune to your voice; limits are Apple’s.

### Subtitle — max **30 characters**

```
MELD, Child-Pugh & liver tools
```
*(28 characters — adjust if you prefer “FibroScan” in the subtitle.)*

Alternative:
```
Transplant & cirrhosis scores
```

### Promotional text — max **170 characters** (editable without new build)

```
Four free tools in one app: MELD (incl. MELD-Na & MELD 3.0), Child-Pugh, FibroScan kPa/CAP interpretation, and liver enzyme pattern checks—with references. Educational only; not medical advice.
```

### Description — long form (starter draft)

```
MELD family scores brings trusted liver assessment calculators into one focused iOS experience for clinicians, trainees, and researchers.

TOOLS
• MELD, MELD-Na, and MELD 3.0 — standardized severity scoring for end-stage liver disease pathways.
• Child-Pugh — cirrhosis severity classes A–C for quick risk framing.
• FibroScan interpreter — liver stiffness (kPa) mapped to fibrosis staging guidance; optional CAP for steatosis bands where available.
• Liver enzyme checker — ALT, AST, GGT, ALP, and bilirubin with pattern cues and plain-language context.

TRANSPARENCY
Formulas and literature references are documented in-app. The clinical calculation engine is open source (MIT) on GitHub for reproducibility. LiverTracker.com is the full-featured LiverTracker platform (web and mobile)—this free app is a companion calculator bundle, not the whole platform.

IMPORTANT
This app is for education and clinical decision support only. It does not replace professional judgment, institutional protocols, or direct patient care decisions. Not a medical device.

Developed by Dr. Jyotsna Priyam • LiverTracker
```

### Keywords — max **100 characters** (comma-separated, no spaces after commas)

```
meld,meld-na,meld3,child-pugh,liver,cirrhosis,fibroscan,hepatology,transplant,enzyme,alt,ast
```
*(Count characters in Connect before submitting.)*

### What’s New (version 1.0.0)

```
Initial App Store release: MELD (incl. MELD-Na & MELD 3.0), Child-Pugh, FibroScan interpreter, and liver enzyme checker with references and disclaimers.
```

### URLs (placeholders — use your live pages)

| Field | Example |
|--------|---------|
| **Support URL** | `https://livertracker.com` (or a /support page) |
| **Marketing URL** (optional) | `https://livertracker.com` |
| **Privacy Policy URL** | Required — must be a **public** page |

### Copyright

```
2026 Dr. Jyotsna Priyam
```
*(Or your legal entity name.)*

---

## 4 Age rating & categories

- **Primary category**: Medical (or Health & Fitness if you prefer positioning; **Medical** matches clinical calculators).  
- **Age rating questionnaire**: honestly declare **medical/treatment information** as **informational, not diagnostic**; no user-generated social; no gambling; etc.  
- **“Unrestricted Web Access”**: only if in-app browser opens arbitrary URLs; align with actual `Linking.openURL` usage in **About**.

---

## 5. App Privacy questionnaire (summary)

Align answers with what the app **actually** collects:

- If **no** accounts, **no** analytics SDKs, and **no** personal data leaves the device except normal crash/OS services, you can declare **minimal** collection.  
- If you only use **HTTPS** links (GitHub, OSF, DOI), that is not “tracking” in the usual ATT sense — still answer Privacy questions literally.  
- Export compliance: **encryption** declaration already set to standard HTTPS only (`ITSAppUsesNonExemptEncryption: false` where applicable).

---

## 6. Pre-submit checklist

- [ ] **Screenshots** uploaded for **each required** iPhone size Connect lists.  
- [ ] **iPad** screenshots uploaded if iPad is supported.  
- [ ] **Description**, **keywords**, **support URL**, **privacy policy URL** complete.  
- [ ] **Copyright**, **age rating**, **encryption** / export answers reviewed.  
- [ ] **App Review notes** (if needed): explain **demo account** *not* required; calculators use local/demo inputs; link to **disclaimer** in app.  
- [ ] **Build** selected for release; **version** matches `1.0.0`.  
- [ ] **Phased release** (optional) decided.  

---

## 7. After release

- Update **screenshots** when UI changes materially.  
- Bump **`expo.version`** / **iOS `buildNumber`** for each store submission.  
- Keep **Privacy Policy** URL valid and aligned with any new SDKs or analytics.

---

*Derived from `apps/mobile/app.json` and in-app navigation as of the current repo. For Apple’s authoritative size table, see App Store Connect → your app → **App Store** → **Preview and screenshots** (device-specific requirements).*
