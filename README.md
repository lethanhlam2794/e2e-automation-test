# E2E Automation

Playwright end-to-end automation suite for multiple projects.

## Install

```bash
yarn install
yarn playwright install
```

## Run Tests

```bash
# Run happy cases for one project
yarn test:project-a
yarn test:project-b

# Run happy cases for all projects
yarn test:happy

# Run all tests
yarn test

# Typecheck
yarn typecheck

# Open report
yarn report
```

## Before Contributing

Read `RULES.md` for the required structure, locator, data, tag, and PR checklist rules.

## Multi-Project Flow

```text
spec.ts
  -> e2e/fixtures/base.fixture.ts reads testInfo.project.name
     -> projectConfig from e2e/utils/projectConfig.ts
     -> registerData from e2e/fixtures/test-data/<project>/
     -> RegisterPage shared across projects
  -> e2e/flows/RegisterFlowFactory.ts chooses StandardRegisterFlow or OtpRegisterFlow
```
# e2e-automation-test
