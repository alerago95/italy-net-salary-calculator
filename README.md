# Italy Net Salary Calculator

Prototype created for the Jet HR Product Builder task.

## Goal

Estimate annual and average monthly net salary from a gross annual salary (RAL), while making the main employee-side deductions visible.

## Product choices

The prototype intentionally focuses on one standard scenario:

- employee with an indefinite employment contract
- private-sector employee
- resident in Milan
- no personal tax benefits or special exemptions
- annual estimate, with average monthly net calculated as annual net / 12

The calculator is client-side only: there is no backend, no API, and no personal data storage.

## Calculation flow

`RAL → employee social contributions → taxable income → gross IRPEF → employee-work deduction → net IRPEF → regional surcharge → municipal surcharge → estimated net salary`

The calculation engine is deliberately isolated in `tax-rules.js` and `calculator.js` so assumptions can be inspected and changed without touching the UI.

## 2026 assumptions used in the prototype

- Employee contribution rate: 9.19% (simplified standard private-sector assumption).
- IRPEF brackets: 23% up to €28,000; 33% from €28,001 to €50,000; 43% above €50,000.
- Employee-work deduction: simplified annual formula implemented in `tax-rules.js`.
- Lombardia regional surcharge: simplified prototype assumption of 1.73%.
- Milan municipal surcharge: simplified prototype assumption of 0.80%.

These rules are intentionally not a substitute for payroll processing. Local surcharges, contribution ceilings/rates, deductions, tax credits, 13th salary treatment, benefits, bonuses and year-end adjustments can materially change an actual payslip.

## Why these simplifications

The task explicitly asks for a functioning prototype in a simple and standard case rather than a complete payroll engine. The objective is therefore transparency: every assumption is visible in code and the user can understand the path from gross to net.

## Validation

`tests.js` contains browser-console sanity checks covering positive net salary, gross/net ordering, contribution presence and monotonicity across representative RAL values.

## Sources to verify before production use

For a production-grade implementation, rules should be versioned against primary Italian sources and updated by tax year:

- Agenzia delle Entrate — IRPEF and employee tax guidance
- INPS — employee social-security contribution rules
- Regione Lombardia — regional IRPEF surcharge
- Comune di Milano — municipal IRPEF surcharge

This prototype uses simplified assumptions to keep the scope aligned with the interview task.
