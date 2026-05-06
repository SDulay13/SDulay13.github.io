# Roam: A Constraint-First Travel Discovery Interface

## Need and Approach

**Need thesis:** Travelers in the early stage of trip planning know their constraints (budget, time, vibe) but have no good tool to translate those constraints into a realistic shortlist of destinations, so they end up doing that work manually across multiple fragmented tabs.

**Approach thesis:** Roam addresses this by inverting the standard destination-first search flow. Instead of asking users to name a place, it collects constraints upfront and runs a scoring algorithm that filters and ranks destinations by fit, then surfaces that ranking with visible explanations so users can make a decision quickly and move directly to booking.

---

## What the System Is

Roam is a single-page React app with five screens: landing, explore, detail, plan, and saved. It is fully client-side with no backend. Price estimates are precomputed regional approximations, not live fares. The destination catalog is hand-curated and fixed.

On the landing screen, users enter budget, trip length, departure airport, a domestic/national/international scope toggle, and vibe chips (beach, tropical, city, nature, food, adventure, historical, nightlife, luxury, quiet, family-friendly). Submitting that runs filterDestinations(), which scores every destination in the catalog and returns a ranked, filtered list.

The explore screen shows that list. Each card surfaces rank, estimated total cost, vibe tags, and a one-sentence fit reason before the user clicks anything. Cards can be expanded, dismissed, or opened into a full detail view. Dismissing a card does not re-sort the list. The ranking is fixed from the moment results return.

The detail screen has booking buttons: Kayak (deep-linked with the user's airport and trip dates) and Booking.com. The plan screen is a lightweight budgeting workspace that prefills from the destination's estimated costs and persists edits across screen navigation within the session.

---

## Design Argument

The obstacle is specific: early-stage trip planning is cognitively heavy in a way that existing tools ignore. Tools like Google Flights and Kayak are genuinely useful but assume the user already has a destination. If you don't, you open flights to check reachability, hotels in another tab, reviews somewhere else, and then mentally hold all those numbers together to see if any of it fits. The matching work falls entirely on the user.

Google Explore comes closest to addressing this, letting you browse destinations from a flexible-date view. But it still leads with the destination. It doesn't score by fit, doesn't account for hotel cost or daily spend or trip length, and doesn't explain why a place appeared. The specific gap Roam is filling is the constraint-to-shortlist translation that happens before a user has a destination in mind.

**P/S:** The user knows their constraints but has no tool for translating constraints into a plausible destination list.

**G:** Produce a ranked shortlist where users can decide and move to booking in one place.

**O(1):** Let users express all constraints in one flow without instructions.
**O(2):** Rank results by fit so the list feels credible, not arbitrary.
**O(3):** Surface enough information per card that users can judge options without clicking into everything.
**O(4):** Hand off to real booking tools without making users retype their search.

**C:** No backend, so estimates are regional approximations. No live API means Kayak is required for real prices. Catalog is fixed. State is session-only.

The mapping from constraints to objectives matters. O(2) requires budget estimates, but the no-backend constraint means estimates are approximations, which means O(3) requires being transparent about what "estimated $900" actually includes (regional flight cost plus hotel per night times nights plus daily spend times days). If the card implied a real price, users would trust it as such. The design choice is to call them estimates and link out to Kayak, which creates a visible gap between estimate and real fare but is honest about what the system can actually know.

---

## HCI Theory

**Gulf of Execution (Ch. 18)**

The gulf of execution is the cognitive gap between a user's intended goal and the actions the system makes available. Chapter 18 frames it as the challenge of "knowing what to do to bring about a desired state change." When the gap is wide, users have to translate their real goal into system-compatible operations, which takes effort and creates errors. When it's narrow, the system accepts what the user already knows.

In travel tools, the gulf is as wide as it can be at the worst moment. The user's goal is "find me a beach trip I can afford from Boston for a long weekend" and the system asks for a destination. That requires the user to answer their own question before the tool helps them. The gulf is maximal at exactly the point where help is most needed.

**Design implication:** Accept the user's real starting point as the first input. That's the direct reason the landing screen starts with budget, trip length, scope, airport, and vibe chips rather than a search box. The form accepts constraints, which is what users actually have.

**Prediction:** If the gulf is genuinely closed, users should be able to start searching without instructions and without confusion about what to do first.

**What I observed:** In CSO walkthroughs, no participant asked where to type a destination. Everyone landed on the form and started filling it in. The status quo condition (normal destination-first search) was described as "annoying" by several participants who had to hold cost, vibe, and trip length mentally across different tabs. That's the gulf of execution showing up directly in behavior: the translation burden made the status quo slower and more effortful.

**Tradeoff:** By starting from constraints, Roam gives up destination specificity. If you already know you want to go to Lisbon, this isn't the right tool. That's intentional but it's a real scope limitation.

The airport picker connects to a related concept in Ch. 18: recognition versus recall. Typing an IATA code from memory is a recall task most people can't complete without looking it up. The custom combobox does typeahead filtering so you can type "Boston" and see BOS, which converts the task to recognition. It also supports full keyboard navigation (ArrowUp, ArrowDown, Enter, Escape) so it's not mouse-dependent.

**Gulf of Evaluation (Ch. 18)**

The gulf of evaluation is the gap between the system's output and the user's ability to interpret whether they're making progress. It's the other side of the same problem: even if users can act on the system, if they can't read the results, they can't tell if the action worked.

**Design implication:** Results need to communicate not just what destinations appear but why. A ranked list with no explanation is low-evaluation: users can see the output but can't tell if the ranking reflects their goal.

**Design choice:** Every card in the explore screen shows an explicit fit reason sentence ("matches all your vibes, within budget") and a score. This is directly attempting to close the gulf of evaluation by making the system's reasoning visible. Users shouldn't have to guess why something appeared.

**Prediction:** If evaluation is easy, users should be able to judge results at a glance without opening detail views for everything.

**What I observed:** In the CSO, Variant 2 (which showed a shorter list with explicit fit explanations) produced faster decisions and higher confidence than Variant 1 (the full explore view). Participants described the one-line fit explanations as making them "trust the suggestions more." That's consistent with closing the gulf of evaluation: when users can read why a result is there, they make decisions faster.

**Information Scent (Ch. 21)**

Information foraging theory treats users as rational searchers following cues that predict whether the next click will pay off. The book calls these cues information scent. Strong scent means you can evaluate an option before committing to it. Weak scent means you have to click into everything just to find out if it's relevant, which defeats the purpose of a ranked list.

**Design implication:** Put the scent cues on the card surface, not inside the detail view. Rank, cost, vibe tags, and fit reason should all be visible before any click.

**Design choice:** Every explore card shows all of these upfront. The operational principle is that a well-matched destination should signal that at a glance.

**Prediction:** High-scent cards should reduce the number of detail views users need to open before reaching a decision.

**What I observed:** This mostly held. CSO participants in Variant 2 (stronger scent via explicit explanations) reached decisions faster and opened fewer detail views than in Variant 1. But there was also a finding that didn't line up cleanly with the theory: some participants said Variant 2 felt "less exciting to browse" and wanted more freedom to explore. Information scent optimizes for efficient foraging, but travel planning has an exploratory dimension that pure scent optimization works against. People sometimes want to scan a broader option space even if it takes longer. The theory predicts efficient behavior but doesn't account for the pleasure of browsing, which appears to be part of what makes early-stage travel planning enjoyable rather than just a task to complete.

The dismiss button connects to scent stability. Dismissing a card doesn't re-sort the list. The ranking is computed once at search time and stays fixed. That means the second card is always genuinely the second-best result, not whatever the system chose to show next. That stability matters because if the ranking shifted on every dismissal users could never be confident they'd seen all the good options.

**Satisficing (Ch. 21)**

Chapter 21 defines satisficing as selecting a good-enough option rather than exhaustively searching for the optimal one. It's rational behavior under real constraints of time and attention. The design implication is that the system should do the search space reduction work upfront so users can satisfice on a high-quality shortlist rather than giving up early on an overwhelming one.

**Design choice:** filterDestinations() runs fitScore() on every destination, drops anything below a score of 20, and sorts the rest. The user never sees destinations that scored zero. The hard gates in fitScore() handle cases where a destination provably can't work (wrong scope, no vibe overlap, more than 170% of budget). The soft score ranks within the plausible set.

**Prediction:** Showing a pre-filtered, ranked shortlist should produce faster decisions than showing an unfiltered list of options.

**What I observed:** The status quo condition directly confirmed this. Participants doing manual search across standard travel sites were slower and expressed more frustration about having to hold multiple factors in their head simultaneously. But the CSO also revealed a limit: Variant 1 (full explore view with 10-15 destinations) felt "a little too much at once" for several participants, even though all those results were already filtered and ranked. That suggests satisficing benefits from a shorter display set even within an already-filtered list. The system reduces the search space once, but the results view needs to reduce it further by foregrounding the top candidates. That's what Variant 2 did and why it performed better.

**User Initiative (Ch. 18)**

User-initiative dialogue means the user drives the conversation and the system responds rather than the system guiding through a predetermined flow. Roam's explore screen is designed around user initiative: users decide which card to expand, which to dismiss, when to open a detail view, and when to save. The system doesn't push users toward a next step. The operational principle is that after constraints are entered, control shifts entirely to the user.

**Design implication:** Features like dismiss (hide this option), show all (reveal everything again), and the save flow all support user-driven navigation through the result set. The system holds a stable, ordered list and lets users work through it however they want.

---

## Code Walkthrough

**fitScore() in data.ts**

State: TripConstraints (budget, tripLength, scope, homeCity, airportCode, vibes[]) and a Destination object (region, country, vibes[], flightCostByRegion, hotelPerNight, dailySpend, flightHours, optional driveFromRegion).

Action: Compute a fit score from 0 to 100.

Operational principle: Two stages. Hard gates return 0 for any destination that provably can't work. Soft score ranks within the plausible set.

Hard gates: scope must match (domestic = US only, national = US plus Caribbean and Americas, international = non-US). At least one selected vibe must match the destination's vibe list. If any selected vibe is an anchor vibe (beach, nature, historical, nightlife, adventure, quiet, tropical, luxury), at least one anchor vibe must match. Budget ceiling: estimated cost above 170% of budget returns 0.

The anchor vibe logic is doing intent modeling. ANCHOR_VIBES is a constant list of high-intent vibes. If you selected beach, that's assumed to be the core reason for the search. A destination that only matches your secondary vibes (like food or family-friendly) should not appear. vibeHits() also has a tropical special case: selecting tropical satisfies either tropical or beach tagged destinations, because they're semantically close enough that separating them produced wrong results in testing.

Soft score components: budget score 0-25 points, peaking around 70-90% of budget utilization (trips far under budget also score lower, because a $200 trip on a $1,200 budget usually isn't what the user wants). Vibe score 0-57 points, weighted most heavily because Roam's core claim is that trip type matters more than pure cheapness. Travel time score 0-15 points, scaled by trip length so a 19-hour flight tanks a weekend result but is fine for a 10-day trip.

**Airport region system**

airportRegion() in airports.ts does a linear scan of the US_AIRPORTS array and returns one of six macro-regions: northeast, southeast, midwest, south, mountain, west. Each destination has a flightCostByRegion map with representative one-way fares from each region. tripBudget() assembles round-trip flight cost from the user's region plus hotel per night times nights plus daily spend times days. If the destination has a driveFromRegion field matching the user's region, it substitutes RENTAL_CAR_PER_DAY times tripLength instead of flight cost. That's how Sedona (no direct flight) or Cape Cod get handled correctly.

**Landing screen: budgetEdit pattern**

Formatted numbers in controlled React inputs have a classic conflict: rendering "1,200" means the user can't reliably backspace through the comma because cursor position shifts. The fix is a separate budgetEdit string that exists only while the input is focused. On focus the value switches to raw digits. On blur it parses, clamps, and reformats. Small but matters for not losing users on the first screen.

**Explore screen state**

State: Set of dismissed destination IDs, boolean for show-all. Three memoized arrays: all (full filtered and sorted), available (all minus dismissed), displayed (available sliced to 8 unless show-all). Operational principle: stable ranked queue where sort order is fixed at search time and dismissals are visibility toggles over that fixed order.

**Plan screen**

Three parallel arrays: BudgetRow[], PlanActivity[], boolean[] for checked states. effectiveSpend() returns the user-entered actual value if valid, otherwise falls back to the estimate. Changes persist upward to App.tsx through a debounced callback. Saved trips are deduplicated by composite key of destination ID plus budget plus trip length.

---

## Evidence: CSO Study

I ran a CSO study comparing three conditions. Variant 1 was the current Roam interface. Variant 2 was a simplified version that highlighted a shorter list (top 3-5 results) with brief fit explanations per card. The status quo condition was normal destination-first search across standard travel sites.

Task for participants: "You have a budget of $1,200, five days, flying from Boston. You want a city or beach trip. Find one destination you would seriously consider booking."

Variant 1 felt exploratory and visually engaging. Participants liked being able to browse multiple destinations at once and the process felt open-ended. The tension was that several participants said it showed too much at once and the screen could feel busy.

Variant 2 was easier to use for most participants. They got to a decision faster and said they felt more confident. The fit explanations (short phrases like "fits your budget" or "strong city vibe") were named specifically as making suggestions feel more trustworthy. The tradeoff was that a few participants wanted more browsing freedom and felt the shorter list was slightly restrictive.

The status quo was the slowest and most frustrating. Participants had to do the comparison work themselves across different tabs and several said it was "annoying" to track budget, vibe, and trip length mentally at once. That's the gulf of execution showing up directly in observed behavior.

Themes across the study: constraint-first structure consistently made the task feel more manageable. Fit explanations meaningfully improved decision confidence. There was a real tension between exploration (wanting to browse) and clarity (wanting a shorter, clearer list). That tension wasn't fully predicted by the theory. Information foraging predicts that strong scent produces efficient decisions, which held, but it doesn't account for the fact that exploration itself is part of what makes early travel planning enjoyable rather than just a cognitive task. Optimizing for efficient foraging can work against the browsing experience that makes the product feel good to use.

The main finding that contradicted my initial predictions is that Variant 1 (the fuller, more exploratory interface) didn't perform as well as I expected. The information scent framing led me to think high-scent cards in a full-explore view would produce efficient decisions, and it did produce efficient decisions compared to the status quo, but Variant 2 outperformed Variant 1 on decision speed and confidence. The lesson is that scent on individual cards doesn't substitute for also reducing the number of cards in the default view. Both dimensions matter.

Based on the CSO, the final design proposal retains the constraint-first structure but simplifies the results view to foreground a shorter set of strong candidates with explicit fit explanations. The broader explore view becomes secondary, available on demand rather than default. The planning step also needs to feel more like the beginning of trip planning rather than the end of the app, which means the handoff from destination selection into the plan screen should be more prominent.

---

## Limitations and What's Left

Session-only persistence is a real limitation for a planning tool. Saved trips and plan edits clear on reload, which is fine for a demo but would be a problem in real use.

The catalog is fixed. Destinations not in the dataset don't exist to the system. Coverage trades off against transparency and control, but it means unusual destinations are invisible.

Very low budgets (under $400 for a weekend) produce thin results because most destinations genuinely don't fit. The system is being honest, but the interface doesn't explain why the list is short. An empty-state message that surfaces the constraint mismatch would help.

The price estimate gap is still a real UX problem. Users see an estimated cost on the card and a potentially different number on Kayak and have to reconcile them. Better signposting about what the estimate includes would reduce confusion.

---

## AI Use

I used Claude for brainstorming, debugging, and editing throughout development and for writing this paper. The ranking logic, scoring weights, data model, and design decisions are my own and came from iteration and testing. When I used AI for code debugging I was describing errors and asking for explanations, not pasting in generated code. The fitScore() function and its weights reflect actual testing and adjustment rather than generated output.
