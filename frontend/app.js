const e = React.createElement;
const {
  AppBar,
  Toolbar,
  Typography,
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Link,
  CssBaseline,
  Alert,
  LinearProgress,
  ThemeProvider,
  createTheme,
  Box,
} = MaterialUI;

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#424242" },
  },
});

function SearchBar({ query, onChange, onSubmit, loading }) {
  return e(
    Box,
    { component: "form", onSubmit, sx: { display: "flex", gap: 2 } },
    e(TextField, {
      label: "Buscar artículos",
      value: query,
      onChange: (ev) => onChange(ev.target.value),
      fullWidth: true,
    }),
    e(
      Button,
      { type: "submit", variant: "contained", disabled: loading },
      "Buscar"
    )
  );
}

function ResultCard({ result }) {
  return e(
    Card,
    { sx: { mb: 2 } },
    e(
      CardContent,
      null,
      e(Typography, { variant: "h6", gutterBottom: true }, result.title),
      result.authors &&
        result.authors.length > 0 &&
        e(
          Typography,
          { variant: "body2", color: "text.secondary" },
          result.authors.join(", ")
        ),
      result.year &&
        e(
          Typography,
          { variant: "body2", color: "text.secondary" },
          result.year
        )
    ),
    e(
      CardActions,
      null,
      result.url &&
        e(
          Button,
          {
            size: "small",
            component: Link,
            href: result.url,
            target: "_blank",
            rel: "noopener",
          },
          "Ver DOI"
        )
    )
  );
}

function ResultsList({ results }) {
  return e(
    Box,
    { sx: { mt: 2 } },
    results.map((r) => e(ResultCard, { key: r.doi || r.title, result: r }))
  );
}

function App() {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const abortRef = React.useRef(null);

  async function search(ev) {
    ev.preventDefault();
    if (!query.trim()) return;
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError("");
    try {
      const resp = await fetch(`/api/search?query=${encodeURIComponent(query)}`, {
        signal: controller.signal,
      });
      if (!resp.ok) throw new Error("Search request failed");
      const data = await resp.json();
      setResults(data.results || []);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return e(
    ThemeProvider,
    { theme },
    e(CssBaseline),
    e(
      AppBar,
      { position: "static" },
      e(
        Toolbar,
        null,
        e(Typography, { variant: "h6", component: "div" }, "OpenLitMap")
      )
    ),
    loading && e(LinearProgress),
    e(
      Container,
      { sx: { mt: 4 } },
      e(SearchBar, { query, onChange: setQuery, onSubmit: search, loading }),
      error && e(Alert, { severity: "error", sx: { mt: 2 } }, error),
      e(ResultsList, { results })
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(e(App));

