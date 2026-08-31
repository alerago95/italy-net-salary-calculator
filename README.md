# Italy Net Salary Calculator

Prototype created for the Jet HR Product Builder task.

## Goal

Estimate annual and average monthly net salary from a gross annual salary (RAL), while making the main employee-side deductions visible.

## Product choices

The prototype intentionally focuses on one standard scenario:

- employee with an indefinite employment contract
- private-sector employee
- resident in Milan
- full-year employment
- no dependants, other income, special tax regimes or individual benefits
- average monthly net = annual net / 12

The calculator is client-side only: there is no backend, no API, and no personal data storage.

## Calculation flow

`RAL → employee social contributions → taxable income → gross IRPEF → employee-work deductions → net IRPEF → regional surcharge → municipal surcharge → estimated net salary`

For the low-income tax-wedge measure, the non-taxable amount is treated as a cash benefit and therefore added to the final net result rather than being shown as a withholding.

The calculation engine is deliberately isolated in `tax-rules.js` and `calculator.js` so assumptions can be inspected and changed without touching the UI.

## 2026 rules and assumptions

- Employee contribution rate: **9.19%**, used as an explicit simplified standard private-sector assumption. Actual contribution rates can vary by sector, category and other circumstances.
- IRPEF: **23% up to €28,000; 33% from €28,001 to €50,000; 43% above €50,000**. The 33% second bracket is the 2026 rule introduced by the 2026 Budget Law.
- Employee-work deduction: annual full-year formula based on taxable/overall income.
- Additional employee deduction: €1,000 for taxable/overall income above €20,000 and up to €32,000, then progressively reduced to zero at €40,000.
- €65 increase to the employee-work deduction for taxable/overall income above €25,000 and up to €35,000.
- Tax-wedge payment for employment income up to €20,000: 7.1%, 5.3% or 4.8% depending on the employment-income band; it is non-taxable and is therefore added to net cash.
- Lombardia regional surcharge: progressive 2026 rates of 1.23%, 1.58%, 1.72% and 1.73% across the applicable income bands.
- Milan municipal surcharge: **0.8%**, with exemption for taxable income up to **€23,000**.

## Important scope decision

This is a **prototype, not a payroll engine**. The 9.19% employee contribution rate is intentionally a modelling assumption. The prototype also excludes contribution ceilings, sector-specific rates, treatment-integrative edge cases, 13th-salary timing, welfare/fringe benefits, bonuses, dependants, personal deductions, multiple employments, other income and year-end payroll adjustments.

This makes the model explainable during an interview: every simplification is explicit and can be replaced by a versioned rule set in a production implementation.

## Validation

`tests.js` contains browser-console checks for:

- positive and bounded net results;
- progressive net-income behaviour;
- taxable income below gross income;
- annual/monthly reconciliation;
- low-income tax-wedge treatment;
- municipal-tax boundary behaviour.

## Primary sources used for validation

- **Normattiva — Legge 30 dicembre 2025, n. 199**, 2026 Budget Law: 2026 IRPEF second bracket changed to 33%.
- **Normattiva — Legge 30 dicembre 2024, n. 207**, including the employee deduction and tax-wedge framework.
- **Agenzia delle Entrate — Dichiarazione precompilata**, guidance on the tax-wedge percentages and additional employee deduction.
- **Dipartimento delle Finanze — Fiscalità locale**, Lombardia 2026 regional IRPEF rates.
- **Comune di Milano**, municipal IRPEF rate and €23,000 exemption.
- **Decreto legislativo 19 giugno 2026, n. 117**, current consolidated income-tax framework effective from 4 July 2026.

For production use, these rules should be versioned by tax year and maintained against official primary sources.
