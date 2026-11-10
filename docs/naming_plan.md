# Naming-Plan: CMS-Felder und Komponenten

Новий сайт: 6aee063a46605b708b3cf7a4. Стан на 10.11.2026.

## Правила

1. **Назва поля або пропса:** `English (Deutsch)`. Приклад: `Preview Image (Vorschaubild)`.
2. **Однакове слово в обох мовах пишемо один раз:** `Name`, `Slug`, `Logo`, `Icon`, `Text`, `Link`, `Position`, `Trustpilot TrustScore`. Тому `Icon (Icon)` стає `Icon`.
3. **Німецькі складені слова пишемо через дефіс:** `Button-Titel`, `Button-Link`.
4. **Хелп-тексти** (CMS) і **тултіпи** (пропси компонентів) пишемо німецькою, до 255 символів.
5. **Slug полів і колекцій не змінюємо**, бо від них залежать URL і прив'язки. Змінюємо лише видиму назву, а Webflow прив'язує поля за ID, тож нічого не зламається.
6. **Позначки в таблицях:** `✓` — назва вже правильна. `—` — хелп-текст не потрібен.

---

## CMS

### Logos (`logos`)

| Було | Стане | Хелп-текст (DE) |
|---|---|---|
| Logo | Logo ✓ | Einfarbige Version des Logos für den Logo-Slider (SVG oder transparentes PNG). |
| Logo farbig | Logo Color (Logo farbig) | Farbige Version des Logos (SVG oder transparentes PNG). |
| Order | Order (Reihenfolge) | Position im Logo-Slider – kleinere Zahl wird zuerst angezeigt. |
| Video link | Video Link (Videolink) | Optional: Link zu einem Video der Marke. |
| Display on the institute's page [logo banner] | Show in Logo Banner (Im Logo-Banner anzeigen) | An: Das Logo erscheint im Logo-Banner. Aus: Das Logo wird dort ausgeblendet. |
| Name | Name ✓ | Name der Marke (wird auch als Alt-Text genutzt). |

### Case Categories (`kategorie`)

Назва колекції: `Case Categories (Case-Kategorien)`, одн.: `Case Category (Case-Kategorie)`.

| Було | Стане | Хелп-текст (DE) |
|---|---|---|
| Name | Name ✓ | Name der Kategorie, z. B. Fashion. |

### Case Studies (`case-studies`)

| Було | Стане | Хелп-текст (DE) |
|---|---|---|
| Headline (Überschrift) | ✓ | Überschrift der Case Study (Karte und Detailseite). |
| Description (Beschreibung) | ✓ | Kurzer Text für die Karte (1–2 Sätze). |
| Content (Beschreibung) | Content (Inhalt) | Ausführlicher Text der Case Study. |
| Customer Name (Kundenname) | ✓ | Vor- und Nachname der Person. |
| Position | ✓ | Rolle der Person, z. B. Gründer & CEO. |
| Client Logo (Kundenlogo) | ✓ | Logo des Kunden (SVG oder transparentes PNG). |
| Preview Image (Vorschaubild) | ✓ | Bild auf der Karte und Vorschaubild des Videos. |
| Vimeo Video ID (Vimeo Video-ID) | ✓ | Nur die Zahl aus dem Vimeo-Link, z. B. 1056575566. Der komplette Link funktioniert auch. |
| Video Title (Videotitel) | ✓ | Kurzer Titel des Videos – wird für Screenreader genutzt. |
| Statistic 1 Value (Statistik 1 Wert) | ✓ | Kennzahl, z. B. 350k. |
| Statistic 1 Label (Statistik 1 Bezeichnung) | ✓ | Beschriftung der Kennzahl, z. B. Umsatz. |
| Statistic 2 Value (Statistik 2 Wert) | ✓ | Kennzahl, z. B. +40 %. |
| Statistic 2 Label (Statistik 2 Bezeichnung) | ✓ | Beschriftung der Kennzahl. |
| Statistic 3 Value (Statistik 3 Wert) | ✓ | Kennzahl. |
| Statistic 3 Label (Statistik 3 Bezeichnung) | ✓ | Beschriftung der Kennzahl. |
| Categories (Kategories) | Category (Kategorie) | Kategorie der Case Study (ein Eintrag aus „Case Categories“). |
| Name | Name ✓ | Interner Name (wird nicht angezeigt). |

### Testimonials (`testimonials`)

| Було | Стане | Хелп-текст (DE) |
|---|---|---|
| User Photo (Benutzerfoto) | ✓ | Porträtfoto, quadratisch. |
| Short Description (Kurzbeschreibung) | ✓ | Rolle oder Firma, z. B. Gründerin von XY. |
| Vimeo Video ID (Vimeo Video-ID) | ✓ | Nur die Zahl aus dem Vimeo-Link. Der komplette Link funktioniert auch. |
| Video Title (Videotitel) | ✓ | Kurzer Titel des Videos – wird für Screenreader genutzt. |
| Name | Name ✓ | Name der Person. |

### Resource Items (`resource-items`)

| Було | Стане | Хелп-текст (DE) |
|---|---|---|
| Item Title (Element-Titel) | ✓ | Titel des Elements. |
| Description (Beschreibung) | ✓ | Kurzer Beschreibungstext. |
| Icon (Icon) | Icon | Kleines Icon (SVG oder transparentes PNG). |
| Image (Bild) | ✓ | Bild des Elements. |
| Page URL (Seiten-URL) | ✓ | Ziel-Link, wenn das Element auf eine Seite verweist. |
| File (Datei) | ✓ | Datei zum Download, z. B. PDF. |
| Vimeo Video ID (Vimeo Video-ID) | ✓ | Nur die Zahl aus dem Vimeo-Link. |
| Video Title (Videotitel) | ✓ | Kurzer Titel des Videos – wird für Screenreader genutzt. |

### Resources (`resources`)

| Було | Стане | Хелп-текст (DE) |
|---|---|---|
| Main Image (Hauptbild) | ✓ | Bild der Ressourcen-Karte. |
| Description (Kurzbeschreibung) | Short Description (Kurzbeschreibung) | Kurzer Text für die Karte. |
| Body Text (Haupttext) | ✓ | Ausführlicher Text der Detailseite. |
| Author (Autor) | ✓ | Person aus „Team Members“. |
| Date (Datum) | ✓ | Veröffentlichungsdatum. |
| YouTube Video Link (YouTube-Videolink) | ✓ | Kompletter YouTube-Link. Wenn ausgefüllt, hat YouTube Vorrang vor Vimeo. |
| YouTube Placeholder Image (YouTube-Vorschaubild) | ✓ | Vorschaubild, das bis zum Klick angezeigt wird. |
| Vimeo Video ID (Vimeo Video-ID) | ✓ | Nur die Zahl aus dem Vimeo-Link. |
| Video Title (Videotitel) | ✓ | Kurzer Titel des Videos – wird für Screenreader genutzt. |
| Resource Items (Ressourcen-Elemente) | ✓ | Elemente aus „Resource Items“, die zu dieser Ressource gehören. |
| Categories | Category (Kategorie) | Kategorie aus „Resource Categories“. |
| CTA Text | CTA Text (CTA-Text) | Beschriftung des Buttons, z. B. Jetzt sichern. |
| CTA Link | CTA Link (CTA-Link) | Ziel des Buttons. |

### Team Members (`team-members`)

| Було | Стане | Хелп-текст (DE) |
|---|---|---|
| Specialty (Spezialisierung) | ✓ | Fachgebiet oder Rolle im Team. |
| Photo (Foto) | ✓ | Porträtfoto, gleiches Format für alle Personen. |
| Sort Order (Sortierung) | ✓ | Reihenfolge im Slider – kleinere Zahl zuerst. |
| Badge Title | Badge Title (Badge-Titel) | z. B. ehemals CEO ✓ (bleibt) |
| Badge Text | Badge Text (Badge-Text) | z. B. 7-figure ecom Brand ✓ (bleibt) |
| Badge Logo | Badge Logo (Badge-Logo) | Logo der Brand (hell, transparent) ✓ (bleibt) |
| Reihe | Row (Reihe) | In welcher Reihe des Team-Sliders die Person erscheint. Oben = hervorgehobene Reihe (Karte in der Mitte wird größer). ✓ (bleibt) |

### FAQs (`faq`)

| Було | Стане | Хелп-текст (DE) |
|---|---|---|
| Question (Frage) | ✓ | Frage, wie sie auf der Seite erscheint. |
| Answer (Antwort) | ✓ | Antwort auf die Frage. |
| Sort Order (Sortierung) | ✓ | Reihenfolge – kleinere Zahl zuerst. |

### Bewertungens (`bewertungen`)

Назва колекції: `Bewertungens` → `Reviews (Bewertungen)`, одн.: `Bewertungen` → `Review (Bewertung)`.

| Було | Стане | Хелп-текст (DE) |
|---|---|---|
| Review Image (Bewertungsbild) | ✓ | Screenshot der Bewertung (Handy-Format) für die untere Reihe. |
| Reviewer Name (Name der bewertenden Person) | ✓ | Vor- und Nachname. |
| Review Text (Bewertungstext) | ✓ | Text der Bewertung. Ab 10 Zeilen erscheint „Weiterlesen“. |
| Review Date (Bewertungsdatum) | ✓ | Datum der Bewertung. |

### Resource Categories (`resource-category`), Blog Categories (`blog-categories`)

| Колекція | Стане |
|---|---|
| Resource Categories | Resource Categories (Ressourcen-Kategorien) |
| Blog Categories | Blog Categories (Blog-Kategorien) |

### Blog Posts (`blog`)

| Було | Стане | Хелп-текст (DE) |
|---|---|---|
| Headline (Überschrift) | ✓ | Überschrift des Artikels. |
| Description (Beschreibung) | ✓ | Kurzer Text für die Blog-Karte. |
| Preview Image (Vorschaubild) | ✓ | Bild der Blog-Karte. |
| Categories (Kategories) | Category (Kategorie) | Kategorie aus „Blog Categories“. |
| Headline Description | Headline Description (Unterzeile) | Text unter der Überschrift auf der Artikelseite. |
| Main Image | Main Image (Hauptbild) | Großes Bild oben im Artikel. |
| Author | Author (Autor) | Autor aus „Authors“. |
| Summary | Summary (Zusammenfassung) | Kurze Zusammenfassung des Artikels. |
| Open Grapgh Image (SEO) | Open Graph Image (Social-Media-Bild) | Empfohlene Bildgröße: 1200 × 630 px (Seitenverhältnis 1,91:1). Bitte JPG oder PNG verwenden und wichtige Inhalte mittig platzieren. ✓ (bleibt) |
| Body Text | Body Text (Haupttext) | Inhalt des Artikels. |

### Authors (`author`)

| Було | Стане | Хелп-текст (DE) |
|---|---|---|
| Author Image | Author Image (Autorenbild) | Porträtfoto, quadratisch. |
| Author Position | Author Position (Position) | Rolle, z. B. Head of Growth. |

### Profit-Systems (`profit-system`)

| Було | Стане | Хелп-текст (DE) |
|---|---|---|
| Nummer | Number (Nummer) | Reihenfolge 1–5 (Tab + Slider) ✓ (bleibt) |
| Icon | Icon ✓ | Glas-Icon (transparentes PNG) für den Tab ✓ (bleibt) |
| Beschreibung | Description (Beschreibung) | Einleitungstext der Karte (1–2 Sätze). |
| Punkte | Bullet Points (Aufzählung) | Aufzählung; Fettgedrucktes = Stichwort ✓ (bleibt) |
| Grafik | Image (Grafik) | Grafik rechts in der Karte ✓ (bleibt) |
| Button text | Button Text (Button-Text) | Nur bei aktivem „Show CTA Button“: Beschriftung des CTA-Buttons. |
| Button Link | Button Link (Button-Link) | Nur bei aktivem „Show CTA Button“: Ziel des CTA-Buttons. |
| Show CTA Button *(новий тогл)* | Show CTA Button (CTA-Button anzeigen) | An: Die Karte zeigt den CTA-Button (Text und Link aus „Button Text“ / „Button Link“). Aus: Die Karte zeigt den Button „Nächste Säule“, der zur nächsten Karte wechselt. |

### CTA Buttons (`cta-button`)

| Було | Стане | Хелп-текст (DE) |
|---|---|---|
| Button Titel | Button Title (Button-Titel) | Beschriftung des Buttons. |
| Button Titel kurz | Button Title Short (Button-Titel kurz) | Kurze Version für Mobil ✓ (bleibt) |
| Button Bild 1 | Avatar Image 1 (Avatarbild 1) | Kleines rundes Kundenfoto unter dem Button. |
| Button Bild 2 | Avatar Image 2 (Avatarbild 2) | Kleines rundes Kundenfoto unter dem Button. |
| Button Bild 3 | Avatar Image 3 (Avatarbild 3) | Kleines rundes Kundenfoto unter dem Button. |
| Button Bild 4 | Avatar Image 4 (Avatarbild 4) | Kleines rundes Kundenfoto unter dem Button. |
| Button Link | Button Link (Button-Link) | Ziel des Buttons. |
| Trustpilot TrustScore | ✓ | z. B. 4.6 ✓ (bleibt) |
| Trustpilot Bewertungen | Trustpilot Reviews (Trustpilot-Bewertungen) | z. B. 65 ✓ (bleibt) |
| Button Subline Brands | Button Subline (Button-Unterzeile) | Beispiel: Über 550+ Brands profitabler gemacht. Fett markierter Teil wird hervorgehoben (weiß). ✓ (bleibt) |
| Brands Anzahl | Brands Count (Anzahl Brands) | Nur die Zahl, z. B. 550+ (wird in Überschriften verwendet: „von 550+ Brands“) ✓ (bleibt) |

---

## Пропси компонентів

Назви самих компонентів лишаються англійськими (так їх видно в панелі Components). Змінюємо лише `review_card` на `Review Card`. Тултіпи німецькою. `—` означає, що тултіп не потрібен.

| Компонент | Було | Стане | Тултіп (DE) |
|---|---|---|---|
| Navbar | Variant | Variant (Variante) | — |
| Button | Variant | Variant (Variante) | — |
| Button | Link / Text | ✓ | — |
| Button New | Variant | Variant (Variante) | — |
| Button New | Show Icon | Show Icon (Icon anzeigen) | Pfeil-Icon im Button ein-/ausblenden |
| Title | Content | Content (Inhalt) | — |
| Layout card | Number | Number (Nummer) | — |
| Layout card | Title | Title (Titel) | — |
| Layout card | Image | Image (Bild) | — |
| Content Card | Title / Image | Title (Titel) / Image (Bild) | — |
| Case Card | Image | Image (Bild) | — |
| Case Card | Title | Title (Titel) | — |
| Case Card | Kategorie | Category (Kategorie) | — |
| Case Card | 1. Stat value … 3. Stat value | Statistic 1 Value (Statistik 1 Wert) … 3 | z. B. 350k |
| Case Card | 1. Stat label … 3. Stat label | Statistic 1 Label (Statistik 1 Bezeichnung) … 3 | z. B. Umsatz |
| Case Card | Video Id | Vimeo Video ID (Vimeo Video-ID) | Nur die Zahl aus dem Vimeo-Link |
| Case Card | Video title | Video Title (Videotitel) | Für Screenreader |
| Counting Item | Prefix | Prefix (Präfix) | Zeichen vor der Zahl, z. B. + |
| Counting Item | Number | Number (Zahl) | — |
| Counting Item | Sufix | Suffix | Zeichen nach der Zahl, z. B. % oder k |
| Counting Item | Label | Label (Bezeichnung) | — |
| CTA | Title | Title (Titel) | — |
| CTA | Image | Image (Bild) | — |
| CTA | Link *(група Button)* | Button Link (Button-Link) | — |
| CTA | Text *(група Button)* | Button Text (Button-Text) | — |
| CTA with image | Variant | Variant (Variante) | — |
| CTA with image | Content | Content (Inhalt) | — |
| CTA with image | Image | Image (Bild) | — |
| CTA with image | Content *(група Title)* | Title (Titel) | — |
| Video Block | Variant | Variant (Variante) | — |
| Video Block | Image | Image (Bild) | Vorschaubild bis zum Klick |
| Video Block | Vimeo Id | Vimeo Video ID (Vimeo Video-ID) | Nur die Zahl aus dem Vimeo-Link |
| Video Block | Video title | Video Title (Videotitel) | Für Screenreader |
| Video Block | Youtube link | YouTube Video Link (YouTube-Videolink) | Hat Vorrang vor Vimeo |
| Video Block | Fetch priority | Fetch Priority (Ladepriorität) | high nur für Videos im sichtbaren Bereich beim Laden, sonst low |
| Resource card **і** Resource Card | Main Image (Hauptbild) | ✓ | — |
| Resource card і Resource Card | Vimeo Video ID / Video Title / YouTube Video Link | ✓ | — |
| Resource card і Resource Card | Categories - Name | Category (Kategorie) | — |
| Resource card і Resource Card | Description (Kurzbeschreibung) | Short Description (Kurzbeschreibung) | — |
| Resource card | Link / Text | Button Link (Button-Link) / Button Text (Button-Text) | — |
| Resource Card | CTA Link / CTA Text | CTA Link (CTA-Link) / CTA Text (CTA-Text) | — |
| review_card | *(назва компонента)* | Review Card | — |
| review_card | 4 пропси | ✓ (вже подвійні) | — |
| Review Popup | Text | Source (Quelle) | Plattform der Bewertung, z. B. Trustpilot |
| Review Popup | інші пропси | ✓ | — |
| FAQ Section | Text | Tagline (Überzeile) | — |
| FAQ Section | Content *(група Title)* | Title (Titel) | — |
| FAQ Section new | Title | Title (Titel) | — |
| FAQ Section new | Variant / Link / Text *(група Button)* | Button Variant (Button-Variante) / Button Link (Button-Link) / Button Text (Button-Text) | — |
| Blog Card | Image | Image (Bild) | — |
| Blog Card | Kategorie | Category (Kategorie) | — |
| Blog Card | Title | Title (Titel) | — |
| Blog Card | Description | Description (Beschreibung) | — |
| Blog Card | Variant / Link / Text *(група Button)* | Button Variant (Button-Variante) / Button Link (Button-Link) / Button Text (Button-Text) | — |
| CTA Links | Variant | Variant (Variante) | — |
| CTA Links | Button Link | Button Link (Button-Link) | — |
| CTA Links | Button Titel | Button Title (Button-Titel) | — |
| CTA Links | Image 1 … Image 4 | Avatar Image 1 (Avatarbild 1) … 4 | Kleines rundes Kundenfoto |
| CTA Links | Button Subline Brands | Button Subline (Button-Unterzeile) | Fett markierter Teil wird weiß hervorgehoben |
| CTA Links | Trustpilot TrustScore | ✓ | z. B. 4.6 |
| CTA Links | Trustpilot Bewertungen | Trustpilot Reviews (Trustpilot-Bewertungen) | z. B. 65 |
| CTA Links | Show Trustpilot | Show Trustpilot (Trustpilot anzeigen) | — |
| CTA Links | Show Button | Show Button (Button anzeigen) | — |
| CTA Links | Brands Anzahl | Brands Count (Anzahl Brands) | Nur die Zahl, z. B. 550+ |
| CTA Links | Show Proof | Show Proof (Social Proof anzeigen) | Avatare + Subline (+ Trustpilot) unter dem Button ein-/ausblenden ✓ (bleibt) |
| CTA Links | Variant *(група Button)* | Button Variant (Button-Variante) | — |
| CTA Audit | Title Select | Title Highlight (Titel hervorgehoben) | Hervorgehobener Teil der Überschrift, z. B. Kostenloses |
| CTA Audit | Title / Text / List / Image | Title (Titel) / Text / List (Liste) / Image (Bild) | — |
| CTA Audit | пропси групи CTA Links | так само, як у CTA Links вище | — |
| Team Card | Photo (Foto) / Specialty (Spezialisierung) | ✓ | — |
| Team Card | Badge Title / Badge Text / Badge Logo | Badge Title (Badge-Titel) / Badge Text (Badge-Text) / Badge Logo (Badge-Logo) | — |
| Team Card | Visibility | Visibility (Sichtbarkeit) | — |
| Statistics Card | Value | Value (Wert) | — |
| Tag, Statistics Card | Text | ✓ | — |

---

## Не входить у перейменування, але варто перевірити

- **Компоненти, схожі на дублікати:** `Resource card` / `Resource Card`, `Button` / `Button New`, `FAQ Section` / `FAQ Section new`. Варто перевірити, які з них реально використовуються.
- **Дефолтне значення з помилкою:** у Counting Item стоїть `Neueröffung`, правильно `Neueröffnung`.
- **Тексти-заглушки за замовчуванням** у пропсах (`This is some text inside of a div block.`). Вони видимі лише в Designer, на сайт не впливають.
