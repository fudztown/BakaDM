# Payment & Subscription Wireframe

> **Subscription tiers, checkout, billing history, and usage limits.**

---

## Subscription Tiers

```
+--------------------------------------------------------------------------+
| HEADER                                                                   |
| [🎮 BakaDM]                          Subscription      [← Back]      |
+--------------------------------------------------------------------------+
|                                                                          |
|  Choose Your Plan                                                        |
|  Flexible plans for every adventurer                                     |
|                                                                          |
|  [Monthly]  [Yearly — Save 20%]                                         |
|                                                                          |
|  +----------------+ +----------------+ +----------------+ +----------------+
|  | FREE           | | ADVENTURER     | | HERO           | | LEGEND         |
|  |                | |                | | ★ MOST POPULAR | |                |
|  | $0/mo          | | $5/mo          | | $12/mo         | | $25/mo         |
|  | $0/yr          | | $48/yr         | | $115/yr        | | $240/yr        |
|  |                | |                | |                | |                |
|  | • 1 campaign   | | • 3 campaigns  | | • 10 campaigns | | • Unlimited    |
|  | • 3 players    | | • 5 players    | | • 8 players    | | • 12 players   |
|  | • 2 hrs voice  | | • 10 hrs voice | | • 30 hrs voice | | • 100 hrs voice|
|  | • 100 messages | | • 500 messages | | • 2K messages  | | • 10K messages |
|  | • Basic support| | • Basic support| | • Priority sup | | • Priority sup |
|  |                | |                | |                | | • Early access |
|  |                | |                | |                | |                |
|  | [Current Plan] | | [Upgrade]      | | [Upgrade]      | | [Upgrade]      |
|  +----------------+ +----------------+ +----------------+ +----------------+
|                                                                          |
|  All plans include: D&D 5e SRD, basic voices, community support          |
|                                                                          |
+--------------------------------------------------------------------------+
```

**Tier Card States:**
- Default: Elevated card, feature list
- Hover: Lift + shadow increase
- Popular: Primary border, "MOST POPULAR" badge
- Current: "Current Plan" badge, disabled button

---

## Checkout Flow

### Step 1: Confirm Plan

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
|  Payment Method:                                  |
|  Discord Premium Apps (****1234)        [Change]  |
|                                                   |
|  [Cancel]              [Confirm & Pay]            |
+--------------------------------------------------+
```

### Step 2: Processing

```
+--------------------------------------------------+
|  Processing Payment...                            |
|                                                   |
|  [○ ○ ○]                                        |
|                                                   |
|  Please wait while we process your payment.       |
+--------------------------------------------------+
```

### Step 3: Success

```
+--------------------------------------------------+
|  ✅ Welcome to Adventurer!                        |
|                                                   |
|  Your subscription is now active.                 |
|                                                   |
|  You now have access to:                          |
|  • 3 active campaigns                            |
|  • 10 hours of voice per month                    |
|  • 500 AI messages per month                      |
|                                                   |
|  [Start a Campaign]  [View Usage]                 |
+--------------------------------------------------+
```

---

## Usage Dashboard

```
+--------------------------------------------------+
|  Usage This Month                                 |
|  Plan: Adventurer (resets July 1)                 |
|                                                   |
|  Voice Hours                                      |
|  [==========>        ]  6.2 / 10 hrs             |
|  62% used                                         |
|  ~3.8 hrs remaining                               |
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
- Normal (<80%): Green/blue bar
- Warning (80-95%): Yellow bar + "Approaching limit"
- Critical (>95%): Red bar + "Limit nearly reached" + upgrade CTA

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
|  | Date       | Plan       | Amount | Status|    |
|  |------------|------------|--------|-------|    |
|  | Jun 1, 2026| Adventurer | $5.00  | Paid  |    |
|  | May 1, 2026| Adventurer | $5.00  | Paid  |    |
|  | Apr 1, 2026| Free       | $0.00  | —    |    |
|  +------------------------------------------+    |
|                                                   |
|  [Download All]                                   |
+--------------------------------------------------+
```

---

## Cancellation Flow

```
+--------------------------------------------------+
|  Cancel Subscription                              |
|                                                   |
|  We're sorry to see you go!                       |
|                                                   |
|  Why are you leaving? (optional)                  |
|  [○] Too expensive                               |
|  [○] Not using enough                            |
|  [○] Missing features                            |
|  [○] Technical issues                            |
|  [○] Other                                       |
|                                                   |
|  You'll keep access until: July 1, 2026           |
|                                                   |
|  [Keep Subscription]  [Confirm Cancel]            |
+--------------------------------------------------+
```

---

*Last updated: June 2026*
