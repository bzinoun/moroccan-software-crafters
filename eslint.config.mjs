import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const NO_MOCK_MESSAGE =
  "No mocks or stubs in tests. Put the side effect behind a port (src/lib/ports/) or pass the value as a parameter, then use an in-memory adapter from src/test/.";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
  // Tests use ports and plain parameters, never mocks or stubs.
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "src/test/**"],
    rules: {
      "no-restricted-properties": [
        "error",
        ...[
          "mock",
          "doMock",
          "fn",
          "spyOn",
          "stubGlobal",
          "stubEnv",
          "hoisted",
          "mocked",
          "importActual",
          "importMock",
          "restoreAllMocks",
          "clearAllMocks",
          "resetAllMocks",
          "unstubAllGlobals",
          "unstubAllEnvs",
        ].map((property) => ({
          object: "vi",
          property,
          message: NO_MOCK_MESSAGE,
        })),
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "VariableDeclarator[init.name='vi']",
          message: `${NO_MOCK_MESSAGE} Do not alias or destructure vi.`,
        },
        {
          selector: "ImportSpecifier[imported.name='vi'][local.name!='vi']",
          message: `${NO_MOCK_MESSAGE} Do not rename the vi import.`,
        },
        {
          selector:
            "AssignmentExpression[left.type='MemberExpression'][left.object.name=/^(window|globalThis|global|self|console|document|navigator)$/]",
          message: `${NO_MOCK_MESSAGE} Do not assign a global by hand.`,
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
