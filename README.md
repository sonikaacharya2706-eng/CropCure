# CropCure
# 🌾Crop Disease Detection for Small Farmers

> Offline, voice-enabled crop disease detection. Snap a photo, get a diagnosis, severity, and low-cost treatment advice in your own language, with honest confidence levels.
---

## 📌 Problem Statement

Small farmers often have no quick access to agricultural experts. A spotted leaf or wilting patch is easy to misread, and by the time it is identified, the disease may have spread. Many villages also have weak or no internet, and advice is rarely in the farmer's own language.

Farmers need to know:
- What is wrong with the plant?
- How serious is it?
- What should I do, with what's available and affordable nearby?

**Who it's for:** Smallholder farmers, extension workers, farmer cooperatives, and NGOs.

---

## 💡 Our Solution

A mobile-friendly app where a farmer photographs a sick plant and receives a likely diagnosis, a severity indication, and practical treatment advice with clear safety warnings. It is built for low-end phones, local languages, low-literacy users (voice and icons), and offline use.

---

## ✨ Key Features

### 1. Guided "Ask Before You Guess" Diagnosis
Asks 2-3 icon-based follow-up questions (e.g., "Spots on the underside too?") when the image model is unsure, then combines image and answers for a better result.
- **How:** Image model runs first. If confidence is low, questions split the top 2-3 candidate diseases, then results are re-scored with Bayesian weighting.

### 2. Honest Confidence Meter + "Ask an Expert" Handoff
Traffic-light result (green / yellow / red). If unsure, the app says **"Not sure, ask an expert"** and shares the photo, location, and answers via WhatsApp/SMS in one tap.
- **How:** Calibrated confidence (temperature scaling) and an out-of-distribution check to reject non-plant or blurry photos.

### 3. Local-Availability Treatment Planner
Recommends cheap options first (neem spray, removing infected leaves, crop spacing), then a pesticide by generic name, with doses in local units (cap, spoon, litre) and safety icons (gloves, harvest wait days, keep away from children).
- **How:** Curated JSON knowledge base mapped to diseases and tagged with cost and safety. An LLM is used only for translation and simplification, never to invent doses.

### 4. Voice-First, Offline Village Mode
Speaks in the local language, accepts voice input, and works fully offline. Cases sync when signal returns, and nearby confirmed cases create outbreak alerts (e.g., "Leaf blight reported 3 km away").
- **How:** On-device TFLite model, offline TTS or pre-recorded audio, and Bluetooth/QR sharing as a fallback.

### ➕ Additional Features
| Feature | Description |
|---|---|
| "Is It Worth Treating?" Calculator | Compares treatment cost with expected yield loss: treat now, remove infected plants only, or not worth spraying |
| Walk-Through Field Scan | Film a row of crops; sampled frames give a field-level health score |
| Pesticide Packet Scanner | OCR checks the packet matches the recommendation and is safe for the crop |
| Disease vs Nutrient vs Water Stress | Separates diseases from deficiencies to avoid wrong pesticide advice |
| Expert-Corrected Learning Loop | Expert labels become new training data to improve the model |

### 🎁 Bonus Ideas
- Zero-install WhatsApp bot with voice-note replies
- Pictorial, comic-style treatment steps for non-readers
- Voice-capture of local dialect disease names
- Bottle-cap dosing visuals ("1 cap per litre")

---

## ✅ Hackathon Criteria Coverage

| Judging Criteria | How We Address It |
|---|---|
| Field-Ready Testing | Trained and tested on field-style photos with heavy augmentation (blur, shadow, soil background) |
| Honest Confidence Levels | Traffic-light meter, calibration, OOD rejection, expert handoff |
| Localization | Regional language support with voice and icons |
| Practical Advice | Low-cost remedies first, safety icons, local-unit doses |
| Low-Bandwidth Resilience | On-device model, offline queue and sync, QR/Bluetooth sharing |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Model | MobileNetV3 / EfficientNet-Lite (PyTorch / TensorFlow → TFLite, under 10 MB) |
| Datasets | PlantVillage, PlantDoc, PlantWild (field-style images) |
| App | Flutter or React Native / PWA with service worker |
| Local Storage | SQLite / IndexedDB |
| Voice | Android offline TTS, Whisper-tiny / Vosk |
| OCR | Google ML Kit |
| Backend | FastAPI, Firebase / Supabase (sync and alerts) |
| Localization | i18n JSON files (Hindi / Kannada / [your language]) |

---

## 🏗️ System Flow

```
Photo → Quality & OOD Check → TFLite Model → Confidence Check
        │                                         │
        │                        High ───────────►│──► Diagnosis + Severity
        │                        Low  ──► Follow-up Questions ──► Re-score
        │                                         │
        └──────────────► Still unsure ──► "Ask an Expert" (WhatsApp/SMS)
                                                  │
Diagnosis ──► Treatment Planner ──► Cost vs Loss ──► Voice + Icon Output
```

---

## 🗺️ Roadmap

| Phase | Goal | Deliverables |
|---|---|---|
| 1 | Core model | 20 diseases on 6-7 crops, evaluated on field photos |
| 2 | App skeleton | Camera, result screen, severity, icon UI |
| 3 | Honesty layer | Confidence meter, follow-up questions, expert share |
| 4 | Treatment + safety | Knowledge base, safety icons, local-unit doses |
| 5 | Localization + voice | One regional language, voice input and output |
| 6 | Offline + sync | On-device model, queue and sync, outbreak alerts |
| 7 | Polish and demo | Real field testing, demo video, slides |

---

## 📊 Expected Impact

- **User benefit:** Clear diagnosis and treatment without needing an expert
- **Time / cost reduction:** Early detection and cost-vs-loss checks avoid unnecessary spraying
- **Efficiency:** Diagnosis in seconds instead of days
- **Accuracy:** Follow-up questions and confidence checks reduce wrong diagnoses
- **Accessibility:** Local language, voice, icons, and offline use on low-end phones
- **Safety:** Safer pesticide use through warnings and packet scanning

---


## ⚠️ Disclaimer

This tool provides guidance only and is not a substitute for professional agricultural advice. When the app is unsure, always consult a local extension worker. Follow pesticide label instructions and safety precautions.

---
>>>>>>> cf61c155757ef4a78296cb85f00d2b4f111f5afa
