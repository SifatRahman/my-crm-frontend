# AML Sanctions CRM Frontend

React/Vite frontend for CRM001–CRM012 Spring Boot endpoints.

## Run

```bash
npm install
cp .env.example .env
npm run dev
```

Default API URL: `http://localhost:8080/api`

## Endpoint mapping

- CRM001 `GET /test/{str1}/{str2}` — Jaro-Winkler
- CRM002 `POST /upload/sanction/xml-file` — UN XML preview
- CRM003 `POST /save/sanction-data` — XML + BD PDF import
- CRM004 `GET /create/individual-customer` — individual creation
- CRM005 `GET /view/{id}/individual-customer` — individual view
- CRM006 `POST /compare/individual/sanction-data` — individual screening
- CRM007 `GET /verify/aml/{id}/saved/individual-customer` — individual AML verification
- CRM008 `POST /save/configuration/sanction-data` — AML configuration
- CRM009 `POST /upload/bd-sanction/pdf-file` — BD PDF preview
- CRM010 `POST /create/entity-customer` — entity creation
- CRM011 `GET /verify/aml/{id}/saved/entity-customer` — entity AML verification
- CRM012 `POST /compare/entity/sanction-data` — entity screening

## DTO note

The controller signatures do not contain the actual fields of `CreateIndividualCustomerDTO`, `CreateEntityCustomerDTO`, `IndividualCustomerCompareInDTO`, `EntityCustomerCompareInDTO`, or `CreateSanctionConfigDataDTO`. Those screens therefore use a JSON editor with starter fields. Supplying the DTO classes or Swagger/OpenAPI document is enough to replace them with exact field-level forms and validation.

CRM004 is preserved exactly as supplied. For production, change its backend method to `POST`; a request body on `GET` is a poor HTTP contract for browsers/proxies.

## Production hardening

Configure HTTPS, Spring CORS, environment-specific API URLs, backend authentication/authorization, secure token handling, upload limits, and automated tests. TanStack Query handles server-state lifecycle and Axios centralizes authentication/error handling.
