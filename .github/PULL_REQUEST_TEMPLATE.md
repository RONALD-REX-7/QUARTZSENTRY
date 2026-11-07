## Description
<!-- Brief 1-2 sentence description of the change and its engineering purpose -->

## Technical Scope
- [ ] Synthetic precursor telemetry generator (Core Temp, EIS, AE, VOC)
- [ ] Thermal runaway state machine & safety interlock logic
- [ ] Frontend dashboard & visual waveform rendering
- [ ] Static analysis & Oxlint / TypeScript build
- [ ] Documentation & sensor specifications

## Seven-Stage Project Status Lifecycle Alignment
- [ ] Stage 1: Planned (Concept or telemetry waveform model)
- [ ] Stage 2: Implemented in software (Demonstrator logic written and compiles)
- [ ] Stage 3: Software tested (Frontend assertion & build verification)

## Verification Checklist
- [ ] **Synthetic Telemetry Transparency**: Confirmed that all telemetry curves and signals are explicitly documented as synthetic models.
- [ ] **Build & Lint Gate**: Oxlint (`npm run lint`) and TypeScript build (`npm run build`) passed with 0 errors.
- [ ] **Zero Credential Exposure**: Confirmed no secrets, tokens, or private details exist in this PR.
- [ ] **Safety Disclaimer Preserved**: Educational prototype disclaimers remain intact.
