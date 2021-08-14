import "@testing-library/jest-dom";

// https://github.com/vercel/next.js/discussions/11818
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    query: { "mocked-router": "true" },
  }),
}));

jest.mock("phosphor-react", () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual("phosphor-react");
  const mockIcon = () => "";

  return {
    __esModule: true,
    ...originalModule,
    Clipboard: mockIcon,
    FilePlus: mockIcon,
    Sliders: mockIcon,
    ArticleNyTimes: mockIcon,
    Drop: mockIcon,
    FrameCorners: mockIcon,
    PuzzlePiece: mockIcon,
  };
});
