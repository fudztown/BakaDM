# Payment & Account User Flow

> **Subscription tiers, billing, usage limits, and account management.**

---

## Flow Overview

```
[Account Menu] → [Subscription] → [Upgrade/Downgrade]
    → [Billing History] → [Payment Method]
    → [Usage Dashboard]
    → [Account Settings]
```

---

## Subscription Tiers

### Tier Comparison

| Feature | Free | Adventurer ($5/mo) | Hero ($12/mo) | Legend ($25/mo) |
|---------|------|-------------------|---------------|-----------------|
| **Campaigns** | 1 active | 3 active | 10 active | Unlimited |
| **Players/Campaign** | 3 | 5 | 8 | 12 |
| **Voice Hours/Month** | 2 hrs | 10 hrs | 30 hrs | 100 hrs |
| **AI Messages/Month** | 100 | 500 | 2,000 | 10,000 |
| **Map Storage** | 100 MB | 1 GB | 5 GB | 20 GB |
| **Custom Voices** | — | 2 | 10 | Unlimited |
| **Priority Support** | — | — | ✅ | ✅ |
| **Early Access** | — | — | — | ✅ |

### Tier Selection Screen

```
+--------------------------------------------------+
|  Choose Your Plan                                 |
|  Flexible plans for every adventurer              |
|                                                   |
|  [Monthly]  [Yearly - Save 20%]                   |
|                                                   |
|  +----------------+ +----------------+ +----------------+ |
|  | FREE           | | ADVENTURER     | | HERO           | |
|  | $0/mo          | | $5/mo          | | $12/mo         | |
|  |                | |                | | MOST POPULAR   | |
|  | • 1 campaign   | | • 3 campaigns  | | • 10 campaigns | |
|  | • 3 players    | | • 5 players    | | • 8 players    | |
|  | • 2 hrs voice  | | • 10 hrs voice | | • 30 hrs voice | |
|  | • 100 messages | | • 500 messages | | • 2K messages  | |
|  |                | |                | | • Priority sup | |
|  | [Current Plan] | | [Upgrade]      | | [Upgrade]      | |
|  +----------------+ +----------------+ +----------------+ |
|                                                   |
|  +----------------+                               |
|  | LEGEND         |                               |
|  | $25/mo         |                               |
|  | • Unlimited    |                               |
|  | • 12 players   |                               |
|  | • 100 hrs      |                               |
|  | • 10K messages |                               |
|  | • Early access |                               |
|  | [Upgrade]      |                               |
|  +----------------+                               |
+--------------------------------------------------+
```

**Design Notes:**
- "Hero" tier highlighted as "Most Popular" with primary border
- Current tier shows "Current Plan" badge, disabled button
- Yearly toggle updates prices with "Save X%" callout
- Each tier card: Hover lift, feature list with checkmarks

---

## Upgrade Flow

**Trigger:** User clicks "Upgrade" on a tier.

```
User clicks "Upgrade"
    → "Confirm Upgrade" modal:
        - Current: Free
        - New: Adventurer ($5/mo)
        - Prorated charge: $2.50 (mid-cycle)
        - Next billing date: July 1
    → [Confirm] → Discord Premium Apps checkout
    → Success: "Welcome to Adventurer!"
    → Features unlocked immediately
```

**Confirmation Modal:**
```
+--------------------------------------------------+
|  Confirm Upgrade                                  |
|                                                   |
|  Current Plan: Free                               |
|  New Plan: Adventurer                             |
|                                                   |
|  Billing:                                         |
|  • Monthly: $5.00                                 |
|  • Prorated today: $2.50                          |
|  • Next bill: July 1, 2026                        |
|                                                   |
|  [Cancel]              [Confirm & Pay]            |
+--------------------------------------------------+
```

---

## Usage Dashboard

**Trigger:** User clicks "Usage" in account menu.

```
+--------------------------------------------------+
|  Usage This Month                                 |
|  Plan: Adventurer (resets July 1)                 |
|                                                   |
|  Voice Hours                                      |
|  [==========>        ]  6.2 / 10 hrs             |
|  62% used                                         |
|                                                   |
|  AI Messages                                      |
|  [================>  ]  342 / 500                 |
|  68% used                                         |
|                                                   |
|  Campaigns                                        |
|  [====>              ]  1 / 3 active             |
|  33% used                                         |
|                                                   |
|  Map Storage                                      |
|  [>                  ]  45 MB / 1 GB              |
|  4% used                                          |
|                                                   |
|  [View Detailed Breakdown]                        |
+--------------------------------------------------+
```

**Warning States:**
- >80% usage: Yellow bar + "Approaching limit" warning
- >95% usage: Red bar + "Limit nearly reached" + upgrade prompt
- 100% usage: Red bar + "Limit reached" + feature disabled

---

## Billing History

```
+--------------------------------------------------+
|  Billing History                                  |
|                                                   |
|  Payment Method:                                  |
|  Discord Premium Apps (****1234)        [Change]  |
|                                                   |
|  Invoices:                                        |
|  +------------------------------------------+    |
|  | Jun 1, 2026 | Adventurer | $5.00 | [PDF] |    |
|  | May 1, 2026 | Adventurer | $5.00 | [PDF] |    |
|  | Apr 1, 2026 | Free       | $0.00 |       |    |
|  +------------------------------------------+    |
|                                                   |
|  [Download All]                                   |
+--------------------------------------------------+
```

---

## Account Settings

```
+--------------------------------------------------+
|  Account Settings                                 |
|                                                   |
|  Profile                                          |
|  Display Name: [________________]                 |
|  Avatar: [Upload]                                 |
|                                                   |
|  Preferences                                      |
|  [✓] Auto-join voice on session start            |
|  [✓] Show dice roll animations                   |
|  [ ] Reduced motion (accessibility)               |
|  [✓] Sound effects                               |
|                                                   |
|  Voice Settings                                   |
|  Input Device: [▼] Default Microphone             |
|  Output Device: [▼] Default Speakers              |
|  Push-to-talk key: [None]                         |
|                                                   |
|  Notifications                                    |
|  [✓] Session start alerts                        |
|  [✓] Turn reminders                              |
|  [ ] Marketing emails                             |
|                                                   |
|  Danger Zone                                      |
|  [Delete Account]                                 |
+--------------------------------------------------+
```

---

## Free Trial / Promo

**New User Promo:**
- 7-day free trial of Hero tier on signup
- No payment method required
- Auto-downgrades to Free if not converted
- Email reminder 2 days before trial ends

**Trial Banner:**
```
+--------------------------------------------------+
|  ⭐ Hero Trial: 5 days remaining                   |
|  Enjoy unlimited campaigns, 30 hrs voice, and     |
|  priority support. Upgrade anytime to keep access.|
|  [Upgrade Now]  [Maybe Later]                     |
+--------------------------------------------------+
```

---

## Cancellation Flow

**Trigger:** User clicks "Cancel Subscription".

```
User clicks "Cancel"
    → "We're sorry to see you go" modal
    → "Why are you leaving?" (optional feedback)
        - Too expensive
        - Not using enough
        - Missing features
        - Technical issues
        - Other
    → "You'll keep access until July 1"
    → [Keep Subscription] [Confirm Cancel]
    → Success: "Subscription cancelled"
```

---

## Error States

| Scenario | Message | Action |
|----------|---------|--------|
| Payment failed | "Payment failed. Update payment method?" | Retry / Update |
| Discord billing unavailable | "Discord Premium Apps unavailable in your region." | Contact support |
| Usage limit reached | "Voice limit reached. Upgrade for more hours." | Upgrade / Wait |
| Concurrent sessions | "You have an active session in another campaign." | End other session |

---

*Last updated: June 2026*
