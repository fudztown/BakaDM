# 🎨 BakaDM Design Documentation

> **UI/UX design system, user flows, wireframes, and visual specifications for the BakaDM Discord-native D&D AI Dungeon Master.**

This directory contains all design documentation intended for developers, product owners, and stakeholders. Every screen, interaction, and visual decision is documented here so implementation can proceed without ambiguity.

---

## 📁 Documentation Index

### Design System
| Document | Description |
|----------|-------------|
| [Design System](design-system.md) | Colors, typography, spacing, iconography, tokens, and component primitives |
| [Component Library](component-library.md) | Reusable React component specs with props, states, and usage guidelines |

### User Flows
| Document | Description |
|----------|-------------|
| [Onboarding Flow](user-flows/onboarding.md) | New user signup → Discord auth → first campaign creation |
| [Campaign Lifecycle](user-flows/campaign-lifecycle.md) | Create, join, resume, archive, and delete campaigns |
| [Combat Flow](user-flows/combat-flow.md) | Initiative → turns → actions → resolution → end combat |
| [Payment & Account](user-flows/payment-account.md) | Subscription tiers, billing, usage limits, account management |

### Wireframes & Screen Specs
| Document | Description |
|----------|-------------|
| [Game UI Overview](wireframes/game-ui-overview.md) | Main game screen layout (map + sidebars + bottom panel) |
| [Lobby / Dashboard](wireframes/lobby-dashboard.md) | Campaign selection, create/join, recent sessions |
| [Combat Screen](wireframes/combat-screen.md) | Initiative tracker, turn order, HP/conditions, actions |
| [Character Sheet](wireframes/character-sheet.md) | Stats, inventory, spells, abilities |
| [Settings & Preferences](wireframes/settings.md) | Audio, UI, notifications, accessibility |
| [Payment & Subscription](wireframes/payment.md) | Tier selection, checkout, billing history |
| [Mobile / PiP Mode](wireframes/mobile-pip.md) | Responsive breakpoints, picture-in-picture minimal UI |

### Assets
| Directory | Contents |
|-----------|----------|
| `../images/` | Architecture diagrams, reference screenshots |
| `wireframes/` | ASCII/text-based wireframe layouts (developer-ready) |

---

## 🎯 Design Principles

1. **Discord-Native** — The UI must feel like a natural extension of Discord, not a separate app
2. **Dark Mode First** — All designs assume Discord's dark theme; light mode is a future consideration
3. **Voice-First** — Players are often speaking, not typing. UI must work with minimal clicks
4. **Mobile-Ready** — Discord Activities run on mobile; every screen must be usable on small viewports
5. **Low Bandwidth** — Real-time sync should be lightweight; avoid heavy animations
6. **Accessibility** — WCAG 2.1 AA compliance: keyboard navigation, screen reader support, color contrast

---

## 🖼️ Reference: CR Campaign Simulator

The existing `cr-campaign-simulator` project provides the visual baseline. Key elements to preserve:

- **Three-column layout**: Left sidebar (tools + reference), Center (interactive map), Right sidebar (narrative log)
- **Bottom panel**: Combat state, turn management, chat input
- **Color accents**: Orange/amber (primary), purple (AI), red (combat), green (health/positive)
- **Token-based map**: Circular character portraits, square player tokens, colored enemy tokens
- **Narrative log**: Cream/yellow player messages, dark brown DM messages

BakaDM adapts this for Discord's constraints (iframe, mobile, PiP) and adds:
- Campaign lobby / dashboard
- User account & subscription management
- Onboarding tutorial
- Mobile-responsive grid layouts

---

## 🔄 Keeping This Documentation Current

Update these docs when:

1. **New screens are added** — Create a new wireframe doc in `wireframes/`
2. **Visual styles change** — Update `design-system.md` and `component-library.md`
3. **User flows are modified** — Update the relevant flow doc in `user-flows/`
4. **Accessibility requirements change** — Update `design-system.md` a11y section
5. **Mobile breakpoints change** — Update `wireframes/mobile-pip.md`

---

*Last updated: June 2026*
