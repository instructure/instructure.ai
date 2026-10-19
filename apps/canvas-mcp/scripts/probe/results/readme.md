# Probe observations

No vendor-client runs are recorded yet. The automated harness tests use synthetic requests and do not establish vendor compatibility.

Run one versioned scenario at a time against the loopback server; capture sanitized JSON lines here only after reviewing them. Name files `<client>-<version>-<public|private-post|private-basic|dcr>.jsonl`. Record the client version, scenario, date, tested configuration and limitations in the associated facts evidence. A successful public run does not establish private-key support; attempting DCR does not establish that static credentials are unsupported.

Only normalized observations may be committed. Never include raw headers, request bodies, authorization codes, state, code verifiers, secrets or tokens. Do not use real Canvas credentials. Update the relevant curated module by hand after reviewing the result; this directory never automatically rewrites facts or commits changes.
