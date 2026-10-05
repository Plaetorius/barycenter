# Verification: Holtec International / Holtec Nuclear Corp (`holtec-international`)

Status: **verified**, verifier-agent (Claude Opus 5.5), 2026-10-05.

## Issues found
DOE loan recorded as $1,450,241,177 new_money from USAspending. The DOE project page and the S-1/A both describe a facility of up to $1.52B (FFB loan, DOE guarantee). The S-1/A states the amounts actually drawn.

## Fixes made
Facility event set to $1.52B `up_to`, `ceiling`; USAspending loan value kept as an evidence item only. New event `holtec-doe-palisades-loan-advances-to-2026h1`: about $1.0B of FFB advances received by 2026-06-30 (S-1/A dated 2026-09-08; $677.3M by 2025-12-31). Federal Financing Bank added as lender.

## Residual doubts
The borrower is Holtec Palisades, LLC (a subsidiary project company). It is treated as group funding because the S-1/A consolidates it and says 'we received'. USAspending's $1.45B differs from $1.52B (possibly principal excluding capitalized interest). The $300M Michigan grant is not recorded.
