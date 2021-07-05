// see https://github.com/vercel/next.js/issues/5416
jest.mock("next/dynamic", () => () => () => null);

// https://github.com/vercel/next.js/discussions/11818
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    query: { "mocked-router": "true" },
  }),
}));

// Icons make it difficult to debug because it makes the HTML output really long
jest.mock("../src/components/IconButton", () => ({
  __esModule: true,
  default: () => "Mocked IconButton",
}));
