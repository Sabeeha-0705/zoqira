# ZOQIRA UI / UX Kit — Design Guidelines (Cross-platform)

This design kit outlines branding, tokens, assets, components and instructions for using the ZOQIRA UI on both the web (React + Vite) and mobile (Expo React Native) clients.

---

## 1. Brand identity

- Brand name: ZOQIRA
- Tagline: "Let’s Start Your IT Career 🚀"
- Slogan: "Learn | Practice | Grow"
- Primary colors: gradient blue (295BFF → 4A8CFF)
- Accent color: #05b5ff
- Header background / dark surfaces: #000000
- Page background: #ffffff
- Imagery: friendly, highly-polished minimal illustrations, student/professional, strong lighting, soft glow.

Assets are available in `/design/` and also copied into the corresponding client `assets/` folders.

---

## 2. Logo & assets

Files created:

- `/design/ZOQIRA-logo.svg` — scalable source with gradient, glow, and mark + wordmark.
- `/design/zoqira_logo_1024.png` — PNG export for high resolution.
- `/web-client/src/assets/zoqira_logo.png` — web asset (default import path used by web components).
- `/app-client/assets/zoqira_logo.png` — mobile asset (default require path used by RN screens).
- `/design/hero_illustration.svg` and client copies — placeholder hero illustration matching the brand.

Export rules:

- Use the SVG for high-resolution and responsive use (web & design tools).
- Use PNG or the app icon (square) for mobile app icons and store uploads.

App icon requirement:

- Create a square 1024 × 1024 PNG with transparent background for app store / Expo, scalers will generate smaller sizes.

---

## 3. Tokens & theme

Use these tokens across platforms.

Colors (core)

- --zq-blue-500: #295BFF
- --zq-blue-600: #4A8CFF
- --zq-accent: #05b5ff
- --zq-black: #000000
- --zq-white: #ffffff
- --zq-card-bg: #f5faff

CSS Gradient

- linear-gradient(135deg, #295BFF, #4A8CFF)

Shadows & corner radius

- Border-radius: 10–14px
- Soft shadows: 0 6px 18px rgba(10,38,80,0.08)

Typography (suggested)

- Primary: System sans (Inter or Roboto). Heavy weight for brand titles (700–900), balanced weights for body copy (400–600).
- Size examples: H1 40–48px (desktop), H2 22–28px (mobile), Body 16px.

---

## 4. Components — Web (examples)

The following components were added in `web-client/src/components/UI/`:

- `Button.jsx` + `Button.css` — primary (gradient) and secondary styles.
- `Card.jsx` + `Card.css` — rounded card with soft shadows.
- `Input.jsx` + `Input.css` — single-line input with icon support, soft border and shadow.
- `Checkbox.jsx` + `Checkbox.css` — rounded checkbox matching brand gradients.

Utility classes: `.zq-primary`, `.zq-secondary`, `.zq-card`, `.zq-container`

Example usage (React):

```jsx
import Button from "./components/UI/Button";
import Card from "./components/UI/Card";

function Hero() {
  return (
    <section className="zq-container" style={{ textAlign: "center" }}>
      <img
        src="/src/assets/zoqira_logo.png"
        alt="ZOQIRA logo"
        style={{ height: 84 }}
      />
      <h1>ZOQIRA — Learn Smarter</h1>
      <p>Lets Start Your IT Career 🚀</p>
      <Button>Login</Button>
      <Button variant="secondary">Create Account</Button>
    </section>
  );
}
```

---

## 5. Components — Mobile (React Native)

Added `app-client/src/components/UI/Button.js` and `Card.js`.

Form elements (mobile):

- `Input.js` — TextInput wrapper with clean border and focused state.
- `Checkbox.js` — tappable checkbox wrapper used with forms.

Example usage (React Native):

```js
import Button from '../components/UI/Button'
import Card from '../components/UI/Card'

// in a screen
<Button title="Go to Dashboard" onPress={() => navigation.navigate('Dashboard')} />
<Card>
  <Text>Welcome back</Text>
</Card>
```

---

## 6. Pages & layout recommendations

- Landing / Home should be bright, centered, with logo + title + two primary actions.
- Login page should use a split layout on desktop (left: form, right: image) and stack on mobile.
- Dashboard should have a welcoming header and large feature cards (Aptitude, Communication, Programming).
- Keep maximum width containers (600–1200px) to maintain readable line lengths on wide screens.

---

## 7. Export & usage for designers

- Use the SVG for UI kits, export PNG at 2× and 4× for high-density screens.
- Keep separate SVG for icon-only/mark-only if you need adaptive layouts.
- Provide 1024×1024 app icon for stores and square PNGs for Expo.

---

## 8. Next steps (optional)

- Generate icon set (iOS/Android sizes) from `ZOQIRA-logo.svg`.
- Produce a Figma kit using these tokens (I can provide a Figma starter JSON / recommend Figma conversion steps if you want).
- Create more components (Navbars, Inputs, Form elements, Toasts, Alert modals) and integrate into the app and web.

---

If you'd like, I can now:

- Produce a downloadable ZIP of the `/design` folder with multi-size PNGs.
- Generate high-resolution app icons and replace the placeholder app icon in `app-client`.
- Add more UI components to the kit (Inputs, Avatar, Nav items).

Tell me which of these you'd like next.
