# Probe: US state programmes (card: docs/sources/us-states.yaml)

Reduced scope: web search budget was exhausted mid-session, so discovery was by direct URL and WebFetch only.

| State | What was verified | Evidence |
|---|---|---|
| Texas | HB 14 (89th Legislature, enrolled text) creates **Texas Advanced Nuclear Energy Office** inside the governor's office (Gov. Code ch. 483, sunset Sept 1, 2035) and the **Texas advanced nuclear development fund**, a dedicated general-revenue account used for reimbursement-based grants to eligible advanced nuclear projects; office may not accept gifts/loans from grant applicants. The bill text states no dollar appropriation (the oft-quoted $350M is not in the statute text I archived: unverified). No award list found. | https://capitol.texas.gov/tlodocs/89R/billtext/html/HB00014F.htm (`c15f94dd4182`); bill history page blocked by robots (tool respected); `gov.texas.gov` guessed URLs 404 (`eb8b618ff2e3`); WebFetch of gov.texas.gov/business found no nuclear office page |
| Utah | Operation Gigawatt (energy-capacity initiative, `9ae5b7504d23`); Nuclear Lifecycle Innovation Campus bid in Tooele County to host a DOE campus: "competing against 26 other states", "$10B+ potential investment", "2027 initial operations target" (`03f79bd4a00e`). No per-company award data. | https://nlic.utah.gov/ , https://energy.utah.gov/homepage/about-us/operation-gigawatt/ |
| Virginia | energy.virginia.gov homepage archived (`6c092cff69ea`), not analysed | |
Not probed: New York (NYPA), Tennessee nuclear fund, Wyoming, Indiana, Washington, Idaho.

Sampled companies: no state award found for any of the ten. No quantified link to any sampled company was found.

Verdict: tier B, low priority now, revisit once TANEO issues grants (likely a small list of announced grants per press release). Adapter: watch-list of 5 state URLs, monthly fetch, LLM extraction of grant announcements into candidate agreements; manual review. Effort: 1 day, low yield.
