// see https://github.com/vercel/next.js/issues/5416
jest.mock("next/dynamic", () => () => (_props) => null);

// https://github.com/vercel/next.js/discussions/11818
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    query: { "mocked-router": "true" },
  }),
}));
