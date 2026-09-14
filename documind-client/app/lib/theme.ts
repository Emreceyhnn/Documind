import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    statusReady: Palette["success"];
    statusProcessing: Palette["warning"];
    statusError: Palette["error"];
    surfaceSubtle: string;
    surfaceHover: string;
    borderStrong: string;
  }
  interface PaletteOptions {
    statusReady?: PaletteOptions["success"];
    statusProcessing?: PaletteOptions["warning"];
    statusError?: PaletteOptions["error"];
    surfaceSubtle?: string;
    surfaceHover?: string;
    borderStrong?: string;
  }
}

const lightPalette = {
  primary: {
    main: "#4F46E5",
    dark: "#3730A3",
    light: "#6366F1",
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#E0E7FF",
    contrastText: "#3730A3",
  },
  background: {
    default: "#F8F9FC",
    paper: "#FFFFFF",
  },
  text: {
    primary: "#0F1222",
    secondary: "#5B5F73",
    disabled: "#9498AA",
  },
  divider: "#E5E7F0",
  surfaceSubtle: "#F5F6FA",
  surfaceHover: "#EEF0FE",
  borderStrong: "#C7CADC",
  statusReady: {
    main: "#059669",
    light: "#DCFCE7",
    dark: "#047857",
    contrastText: "#065F46",
  },
  statusProcessing: {
    main: "#D97706",
    light: "#FEF3C7",
    dark: "#B45309",
    contrastText: "#92400E",
  },
  statusError: {
    main: "#DC2626",
    light: "#FEE2E2",
    dark: "#B91C1C",
    contrastText: "#991B1B",
  },
};

const darkPalette = {
  primary: {
    main: "#818CF8",
    dark: "#6366F1",
    light: "#A5B4FC",
    contrastText: "#131427",
  },
  secondary: {
    main: "#312E6B",
    contrastText: "#C7D2FE",
  },
  background: {
    default: "#0B0D17",
    paper: "#131524",
  },
  text: {
    primary: "#EEF0FA",
    secondary: "#9DA1BE",
    disabled: "#5F6384",
  },
  divider: "#252843",
  surfaceSubtle: "#161829",
  surfaceHover: "#1F2238",
  borderStrong: "#34385B",
  statusReady: {
    main: "#34D399",
    light: "#0B2E23",
    dark: "#6EE7B7",
    contrastText: "#A7F3D0",
  },
  statusProcessing: {
    main: "#FBBF24",
    light: "#2E2410",
    dark: "#FCD34D",
    contrastText: "#FDE68A",
  },
  statusError: {
    main: "#F87171",
    light: "#2E1616",
    dark: "#FCA5A5",
    contrastText: "#FECACA",
  },
};

export const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data",
  },
  colorSchemes: {
    light: { palette: lightPalette },
    dark: { palette: darkPalette },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: "var(--font-ibm-plex-sans), system-ui, sans-serif",
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.01em",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
        },
        contained: ({ theme }) => ({
          "&.MuiButton-colorPrimary": {
            backgroundColor: theme.vars.palette.primary.main,
            boxShadow: `0 2px 8px rgba(79,70,229,0.24)`,
            [theme.getColorSchemeSelector("dark")]: {
              boxShadow: `0 2px 8px rgba(0,0,0,0.5)`,
            },
            "&:hover": {
              backgroundColor: theme.vars.palette.primary.dark,
              boxShadow: `0 6px 18px rgba(55,48,163,0.32)`,
              [theme.getColorSchemeSelector("dark")]: {
                boxShadow: `0 6px 18px rgba(0,0,0,0.6)`,
              },
            },
          },
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.vars.palette.surfaceSubtle,
          borderRadius: 8,
        }),
        notchedOutline: ({ theme }) => ({
          borderColor: theme.vars.palette.divider,
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});
