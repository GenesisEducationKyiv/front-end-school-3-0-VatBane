# Security audit report

Date: 16-06-2025

## Dependency audit

 | Dependency       | Version  | Vulnerabilities   |
|------------------|----------|-------------------|
| react            | ^19.0.0  | ---               |
| react-dom        | ^19.0.0  | ---               |
| react-router-dom | ^7.5.2   | ---               |
| zustand          | ^5.0.3   | ---               |
| @mobily/ts-belt  | ^3.13.1  | ---               |
| neverthrow       | ^8.2.0   | ---               |
| zod              | ^3.25.42 | Supply chain risk |

## Improvements
- Change version of `zod` to `3.25.66` because it doesn't have `Supply chain risk` vulnerability

## Services used
- `npm audit`
- [Snyk](https://snyk.io/adviso)
- [Socket dev](https://socket.dev/)

## Conclusion
Application mostly meets security requirements except 1 not critical vulnerability. 
Need to update `zod` package.