import { forwardRef, useEffect, useRef, useState } from 'react';
import SportsEsportsRoundedIcon from '@mui/icons-material/SportsEsportsRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {
  AppBar,
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Toolbar,
  Typography,
  Slide
} from '@mui/material';
import games from './games';

const heroGradient = 'linear-gradient(160deg, rgba(15, 60, 120, 0.5), rgba(5, 9, 20, 0.92))';
const accentBorder = '1px solid rgba(244, 176, 0, 0.35)';
const monokaiCodeStyles = {
  m: 0,
  p: 2,
  borderRadius: 2,
  bgcolor: '#272822',
  color: '#f8f8f2',
  fontSize: 12,
  lineHeight: 1.6,
  overflowX: 'auto',
  whiteSpace: 'pre',
  border: '1px solid rgba(255,255,255,0.08)',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  '& .token.comment': { color: '#75715e' },
  '& .token.keyword': { color: '#f92672' },
  '& .token.string': { color: '#e6db74' },
  '& .token.number': { color: '#ae81ff' },
  '& .token.function': { color: '#a6e22e' },
  '& .token.operator': { color: '#f8f8f2' },
  '& .token.tag': { color: '#f92672' },
  '& .token.attr-name': { color: '#a6e22e' },
  '& .token.attr-value': { color: '#e6db74' },
  '& .token.selector': { color: '#a6e22e' },
  '& .token.property': { color: '#66d9ef' },
  '& .token.punctuation': { color: '#f8f8f2' }
};

const trimBlock = (value) => value.replace(/^\n+/, '').replace(/\n+$/, '');
const stripTag = (value, tag) => value.replace(new RegExp(`^<${tag}[^>]*>`, 'i'), '').replace(new RegExp(`</${tag}>\\s*$`, 'i'), '');
const escapeHtml = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const describeFunction = (name, code) => {
  const lower = name.toLowerCase();
  if (lower.includes('reset')) return 'Resets the game state so a new round can begin.';
  if (lower.includes('update')) return 'Advances the game simulation for this frame (movement, collisions, scoring).';
  if (lower.includes('draw') || lower.includes('render')) return 'Draws the current game state to the screen.';
  if (lower.includes('loop') || lower.includes('tick')) return 'Runs the main animation loop and schedules the next frame.';
  if (lower.includes('init') || lower.includes('setup')) return 'Initializes game state and sets up the scene.';
  if (lower.includes('spawn')) return 'Creates new entities or obstacles as the game runs.';
  if (lower.includes('handle') || lower.startsWith('on')) return 'Handles player input or UI events.';
  if (lower.includes('clamp') || lower.includes('limit')) return 'Utility helper to keep values within bounds.';
  if (/requestAnimationFrame/.test(code)) return 'Runs a frame loop using requestAnimationFrame.';
  if (/addEventListener/.test(code)) return 'Handles input events and updates game state.';
  return 'Encapsulates a focused piece of the game logic.';
};

const buildSectionNotes = (code) => {
  const notes = [];
  if (/addEventListener/.test(code)) notes.push('Wires up input listeners for controls.');
  if (/requestAnimationFrame/.test(code)) notes.push('Schedules the next frame with requestAnimationFrame.');
  if (/setInterval|setTimeout/.test(code)) notes.push('Uses timers for pacing or effects.');
  if (/Math\.random/.test(code)) notes.push('Applies randomness for variety.');
  if (/collision|intersect|hit/.test(code)) notes.push('Performs collision checks between objects.');
  if (/fillRect|arc|drawImage|stroke/.test(code)) notes.push('Draws shapes or sprites to the canvas.');
  if (/localStorage/.test(code)) notes.push('Persists state in localStorage.');
  return notes.slice(0, 3);
};

const highlightTokens = (value, patterns) => {
  const placeholders = [];
  let output = value;
  patterns.forEach(({ regex, replace }) => {
    output = output.replace(regex, (match, ...args) => {
      const token = `___CODE_TOKEN_${placeholders.length}___`;
      const rendered = typeof replace === 'function' ? replace(match, ...args) : `<span class="token ${replace}">${match}</span>`;
      placeholders.push(rendered);
      return token;
    });
  });
  placeholders.forEach((replacement, index) => {
    output = output.replace(new RegExp(`___CODE_TOKEN_${index}___`, 'g'), replacement);
  });
  return output;
};

const highlightHtml = (code) => {
  const escaped = escapeHtml(code);
  return highlightTokens(escaped, [
    { regex: /&lt;!--[\s\S]*?--&gt;/g, replace: 'comment' },
    {
      regex: /&lt;\/?[^&]*?&gt;/g,
      replace: (match) => {
        let tagged = match;
        tagged = tagged.replace(/^(&lt;\/?)([A-Za-z0-9:-]+)/, (_full, prefix, name) => {
          return `<span class="token punctuation">${prefix}</span><span class="token tag">${name}</span>`;
        });
        tagged = tagged.replace(/([A-Za-z0-9:-]+)(=)("[^"]*"|'[^']*')/g, (_full, attr, eq, val) => {
          return `<span class="token attr-name">${attr}</span>${eq}<span class="token attr-value">${val}</span>`;
        });
        tagged = tagged.replace(/&gt;$/, '<span class="token punctuation">&gt;</span>');
        return tagged;
      }
    }
  ]);
};

const highlightCss = (code) => {
  const escaped = escapeHtml(code);
  return highlightTokens(escaped, [
    { regex: /\/\*[\s\S]*?\*\//g, replace: 'comment' },
    { regex: /(["'])(?:\\.|(?!\1)[^\\])*\1/g, replace: 'string' },
    { regex: /#[0-9a-fA-F]{3,8}\b/g, replace: 'number' },
    { regex: /\b\d+(\.\d+)?(px|%|em|rem|vh|vw|s|ms)?\b/g, replace: 'number' },
    { regex: /[.#][A-Za-z0-9_-]+/g, replace: 'selector' },
    { regex: /([a-z-]+)(?=\s*:)/gi, replace: 'property' }
  ]);
};

const highlightJs = (code) => {
  const escaped = escapeHtml(code);
  return highlightTokens(escaped, [
    { regex: /\/\/[^\n]*/g, replace: 'comment' },
    { regex: /\/\*[\s\S]*?\*\//g, replace: 'comment' },
    { regex: /(['"`])(?:\\.|(?!\1)[^\\])*\1/g, replace: 'string' },
    {
      regex: /\b(?:const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|class|new|this|import|from|export|default|async|await)\b/g,
      replace: 'keyword'
    },
    { regex: /\b(?:true|false|null|undefined)\b/g, replace: 'keyword' },
    { regex: /\b\d+(\.\d+)?\b/g, replace: 'number' },
    { regex: /\b([A-Za-z_$][\w$]*)(?=\s*\()/g, replace: 'function' }
  ]);
};

const highlightCode = (code, language) => {
  if (language === 'html') return highlightHtml(code);
  if (language === 'css') return highlightCss(code);
  if (language === 'js') return highlightJs(code);
  return escapeHtml(code);
};

const findMatchingBrace = (code, startIndex) => {
  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let inLineComment = false;
  let inBlockComment = false;
  let escape = false;

  for (let i = startIndex; i < code.length; i++) {
    const char = code[i];
    const next = code[i + 1];

    if (inLineComment) {
      if (char === '\n') inLineComment = false;
      continue;
    }
    if (inBlockComment) {
      if (char === '*' && next === '/') {
        inBlockComment = false;
        i += 1;
      }
      continue;
    }
    if (inSingle) {
      if (!escape && char === "'") inSingle = false;
      escape = char === '\\' && !escape;
      continue;
    }
    if (inDouble) {
      if (!escape && char === '"') inDouble = false;
      escape = char === '\\' && !escape;
      continue;
    }
    if (inTemplate) {
      if (!escape && char === '`') inTemplate = false;
      escape = char === '\\' && !escape;
      continue;
    }

    if (char === '/' && next === '/') {
      inLineComment = true;
      i += 1;
      continue;
    }
    if (char === '/' && next === '*') {
      inBlockComment = true;
      i += 1;
      continue;
    }
    if (char === "'") {
      inSingle = true;
      escape = false;
      continue;
    }
    if (char === '"') {
      inDouble = true;
      escape = false;
      continue;
    }
    if (char === '`') {
      inTemplate = true;
      escape = false;
      continue;
    }

    if (char === '{') depth += 1;
    if (char === '}') depth -= 1;

    if (depth === 0 && i > startIndex) return i + 1;
  }

  return -1;
};

const findTopLevelFunctions = (code) => {
  const functions = [];
  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let inLineComment = false;
  let inBlockComment = false;
  let escape = false;
  let lineStart = true;

  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    const next = code[i + 1];

    if (lineStart) {
      let j = i;
      while (code[j] === ' ' || code[j] === '\t') j += 1;
      if (depth === 0 && !inLineComment && !inBlockComment && !inSingle && !inDouble && !inTemplate) {
        const slice = code.slice(j);
        const match = slice.match(
          /^(?:function\s+([A-Za-z0-9_$]+)\s*\(|(?:const|let|var)\s+([A-Za-z0-9_$]+)\s*=\s*(?:async\s*)?(?:function\s*\(|\(?[^\)]*\)?\s*=>))/
        );
        if (match) {
          functions.push({ start: j, name: match[1] || match[2] || 'anonymous' });
        }
      }
      lineStart = false;
    }

    if (inLineComment) {
      if (char === '\n') {
        inLineComment = false;
        lineStart = true;
      }
      continue;
    }
    if (inBlockComment) {
      if (char === '*' && next === '/') {
        inBlockComment = false;
        i += 1;
      }
      if (char === '\n') lineStart = true;
      continue;
    }
    if (inSingle) {
      if (!escape && char === "'") inSingle = false;
      escape = char === '\\' && !escape;
      if (char === '\n') lineStart = true;
      continue;
    }
    if (inDouble) {
      if (!escape && char === '"') inDouble = false;
      escape = char === '\\' && !escape;
      if (char === '\n') lineStart = true;
      continue;
    }
    if (inTemplate) {
      if (!escape && char === '`') inTemplate = false;
      escape = char === '\\' && !escape;
      if (char === '\n') lineStart = true;
      continue;
    }

    if (char === '/' && next === '/') {
      inLineComment = true;
      i += 1;
      continue;
    }
    if (char === '/' && next === '*') {
      inBlockComment = true;
      i += 1;
      continue;
    }
    if (char === "'") {
      inSingle = true;
      escape = false;
      continue;
    }
    if (char === '"') {
      inDouble = true;
      escape = false;
      continue;
    }
    if (char === '`') {
      inTemplate = true;
      escape = false;
      continue;
    }

    if (char === '{') depth += 1;
    if (char === '}') depth = Math.max(0, depth - 1);
    if (char === '\n') lineStart = true;
  }

  return functions;
};

const buildJsSections = (code) => {
  const cleaned = trimBlock(code);
  if (!cleaned) return [];

  const functions = findTopLevelFunctions(cleaned);
  if (!functions.length) {
    return [
      {
        id: 'js-main',
        title: 'Script logic',
        description: 'Core game loop, input handling, collisions, and rendering updates.',
        code: cleaned,
        notes: buildSectionNotes(cleaned)
      }
    ];
  }

  const sections = [];
  let cursor = 0;

  functions.forEach((entry, index) => {
    const start = entry.start;
    const nextStart = functions[index + 1]?.start ?? cleaned.length;

    if (start > cursor) {
      const setupCode = trimBlock(cleaned.slice(cursor, start));
      if (setupCode) {
        sections.push({
          id: `js-setup-${index}`,
          title: index === 0 ? 'Setup and state' : 'Setup',
          description: 'Global state, DOM references, and event wiring.',
          code: setupCode,
          notes: buildSectionNotes(setupCode)
        });
      }
    }

    let end = -1;
    const braceIndex = cleaned.indexOf('{', start);
    if (braceIndex !== -1 && braceIndex < nextStart) {
      end = findMatchingBrace(cleaned, braceIndex);
    }
    if (end === -1 || end > nextStart) {
      const semicolon = cleaned.indexOf(';', start);
      if (semicolon !== -1 && semicolon < nextStart) end = semicolon + 1;
      else {
        const newline = cleaned.indexOf('\n', start);
        end = newline !== -1 && newline < nextStart ? newline + 1 : nextStart;
      }
    }

    const fnCode = trimBlock(cleaned.slice(start, end));
    if (fnCode) {
      sections.push({
        id: `js-fn-${index}`,
        title: `Function: ${entry.name}`,
        description: describeFunction(entry.name, fnCode),
        code: fnCode,
        notes: buildSectionNotes(fnCode)
      });
    }
    cursor = Math.max(cursor, end);
  });

  if (cursor < cleaned.length) {
    const tail = trimBlock(cleaned.slice(cursor));
    if (tail) {
      sections.push({
        id: 'js-runtime',
        title: 'Runtime start',
        description: 'Bootstraps the first render or kicks off the main loop.',
        code: tail,
        notes: buildSectionNotes(tail)
      });
    }
  }

  return sections;
};

const buildCodeBlocks = (html, game) => {
  const styleRegex = /<style[^>]*>[\s\S]*?<\/style>/gi;
  const scriptRegex = /<script[^>]*>[\s\S]*?<\/script>/gi;
  const styles = html.match(styleRegex) || [];
  const scripts = html.match(scriptRegex) || [];
  const htmlOnly = trimBlock(html.replace(styleRegex, '').replace(scriptRegex, ''));
  const blocks = [];

  if (htmlOnly) {
    blocks.push({
      id: 'html',
      title: 'HTML structure',
      description: `Markup for the game layout, canvas, and info panel for ${game.title}.`,
      language: 'html',
      code: htmlOnly
    });
  }

  styles.forEach((style, index) => {
    const styleContent = trimBlock(stripTag(style, 'style'));
    blocks.push({
      id: `css-${index}`,
      title: styles.length > 1 ? `CSS styles ${index + 1}` : 'CSS styles',
      description: 'Layout, typography, colors, and visual states for the game screen.',
      language: 'css',
      code: styleContent
    });
  });

  scripts.forEach((script, index) => {
    const scriptContent = trimBlock(stripTag(script, 'script'));
    blocks.push({
      id: `js-${index}`,
      title: scripts.length > 1 ? `JavaScript logic ${index + 1}` : 'JavaScript game logic',
      description: 'Core game loop, input handling, collisions, and rendering updates.',
      highlights: game.codeHighlights || [],
      language: 'js',
      code: scriptContent,
      sections: buildJsSections(scriptContent)
    });
  });

  return blocks;
};

function App() {
  const primaryCta = games[0];
  const [openGame, setOpenGame] = useState(null);
  const [openCodeGame, setOpenCodeGame] = useState(null);
  const [codeBlocks, setCodeBlocks] = useState([]);
  const [codeLoading, setCodeLoading] = useState(false);
  const [codeError, setCodeError] = useState('');
  const iframeRef = useRef(null);
  const isDialogOpen = Boolean(openGame);
  const isCodeDialogOpen = Boolean(openCodeGame);
  const handleCloseGame = () => setOpenGame(null);
  const handleCloseCode = () => setOpenCodeGame(null);
  const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  const focusGameFrame = () => {
    if (iframeRef.current) {
      iframeRef.current.focus();
    }
  };

  useEffect(() => {
    if (!openCodeGame) {
      setCodeBlocks([]);
      setCodeLoading(false);
      setCodeError('');
      return;
    }
    let isActive = true;
    setCodeLoading(true);
    setCodeError('');
    setCodeBlocks([]);

    fetch(openCodeGame.path)
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load code (${response.status}).`);
        return response.text();
      })
      .then((text) => {
        if (!isActive) return;
        setCodeBlocks(buildCodeBlocks(text, openCodeGame));
      })
      .catch((error) => {
        if (!isActive) return;
        setCodeError(error.message || 'Unable to load code.');
      })
      .finally(() => {
        if (!isActive) return;
        setCodeLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [openCodeGame]);

  useEffect(() => {
    if (!openGame) return;
    const focusSoon = () => focusGameFrame();
    const timer = setTimeout(focusSoon, 200);
    requestAnimationFrame(focusSoon);
    return () => clearTimeout(timer);
  }, [openGame]);

  return (
    <Box sx={{ minHeight: '100vh', pb: 8, position: 'relative', overflowX: 'hidden' }}>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          '&::before': {
            content: '""',
            position: 'absolute',
            width: 420,
            height: 420,
            background: 'radial-gradient(circle at 30% 30%, rgba(244,176,0,0.16), transparent 55%)',
            top: -80,
            left: -60,
            filter: 'blur(2px)'
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            width: 420,
            height: 420,
            background: 'radial-gradient(circle at 70% 60%, rgba(15,60,120,0.25), transparent 60%)',
            bottom: -120,
            right: -160,
            filter: 'blur(2px)'
          }
        }}
      />

      <AppBar
        position="fixed"
        color="transparent"
        elevation={0}
        sx={{
          top: 0,
          width: '100%',
          zIndex: (theme) => theme.zIndex.appBar + 1,
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}
      >
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" justifyContent="space-between" py={1.5} spacing={2}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar
                src="/ccis-logo.png"
                alt="CCIS"
                sx={{
                  width: 56,
                  height: 56,
                  border: '2px solid rgba(244,176,0,0.45)',
                  bgcolor: 'primary.main',
                  fontWeight: 800,
                  letterSpacing: 1
                }}
              >
                CC
              </Avatar>
              <Box>
                <Typography variant="subtitle2" color="secondary.main" sx={{ letterSpacing: 1, fontWeight: 700 }}>
                  University of Antique
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                  College of Computing and Information Sciences
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Student-built interactive experiences
                </Typography>
              </Box>
            </Stack>
            <Chip
              label={`${games.length} games`}
              color="secondary"
              icon={<BoltRoundedIcon />}
              sx={{ fontWeight: 800, px: 1.2 }}
            />
          </Stack>
        </Container>
      </AppBar>

      <Box sx={{ height: { xs: 80, sm: 92 } }} />

      <Container maxWidth="lg" sx={{ pt: 6, pb: 6, position: 'relative' }}>
        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2.2,
                background: heroGradient,
                border: accentBorder
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <SportsEsportsRoundedIcon color="secondary" fontSize="large" />
                <Typography
                  variant="h4"
                  sx={{ fontFamily: 'Playfair Display, Georgia, serif', letterSpacing: 0.4, fontWeight: 700 }}
                >
                  Play. Learn. Build.
                </Typography>
              </Stack>

              <Typography variant="body1" color="text.secondary">
                A curated showcase of CCIS student mini-games, built with React + Vite and wrapped in a cohesive
                Material UI experience. Jump into any title instantly and explore mechanics that range from arcade to
                logic to memory challenges.
              </Typography>

              <Divider flexItem sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label="CCIS Makers" variant="outlined" color="secondary" />
                <Chip label="Keyboard & Mouse" variant="outlined" color="secondary" />
                <Chip label="React + Vite" variant="outlined" color="secondary" />
                <Chip label="Material UI" variant="outlined" color="secondary" />
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center">
                <Button
                  component="a"
                  href={primaryCta.path}
                  target="_blank"
                  rel="noreferrer"
                  variant="contained"
                  color="secondary"
                  size="large"
                  startIcon={<PlayArrowRoundedIcon />}
                  sx={{ px: 2.6, fontWeight: 800 }}
                >
                  Play {primaryCta.title}
                </Button>
                <Button
                  href="#games"
                  variant="outlined"
                  color="inherit"
                  size="large"
                  endIcon={<LaunchRoundedIcon />}
                >
                  View all games
                </Button>
              </Stack>
            </Paper>
          </Grid>

          <Grid
            item
            xs={12}
            md={7}
            id="games"
            sx={{ scrollMarginTop: { xs: 16, sm: 24 } }}
          >
            <Grid container spacing={2.5}>
              {games.map((game) => (
                <Grid item xs={12} sm={6} key={game.title}>
                  <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <CardActionArea
                      onClick={() => setOpenGame(game)}
                      sx={{ alignItems: 'stretch', display: 'flex', flexGrow: 1 }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          opacity: 0.18,
                          background: 'radial-gradient(circle at 20% 20%, rgba(244,176,0,0.2), transparent 40%)'
                        }}
                      />
                      <CardContent
                        sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flexGrow: 1, position: 'relative' }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1.2}>
                          <Avatar
                            alt={`${game.title} icon`}
                            sx={{
                              width: 44,
                              height: 44,
                              bgcolor: 'rgba(244,176,0,0.1)',
                              color: 'secondary.main',
                              border: '1px solid rgba(244,176,0,0.35)',
                              fontSize: 22,
                              fontWeight: 800,
                              backdropFilter: 'blur(8px)',
                              boxShadow: '0 8px 18px rgba(0,0,0,0.35)'
                            }}
                          >
                            {game.icon || game.title.charAt(0)}
                          </Avatar>
                          <Typography variant="h6" sx={{ fontWeight: 800, flex: 1 }}>
                            {game.title}
                          </Typography>
                        </Stack>

                        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                          {game.description}
                        </Typography>

                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {game.tags.map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              variant="outlined"
                              color="secondary"
                              sx={{ fontWeight: 700 }}
                            />
                          ))}
                        </Stack>
                      </CardContent>
                    </CardActionArea>

                    <CardActions sx={{ pt: 0, px: 2, pb: 2, flexDirection: 'column', alignItems: 'stretch', gap: 1 }}>
                      <Button
                        onClick={() => setOpenGame(game)}
                        variant="contained"
                        color="secondary"
                        fullWidth
                        startIcon={<PlayArrowRoundedIcon />}
                        sx={{ fontWeight: 800 }}
                      >
                        Play in modal
                      </Button>
                      <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                        <Button
                          component="a"
                          href={game.path}
                          target="_blank"
                          rel="noreferrer"
                          color="inherit"
                          endIcon={<LaunchRoundedIcon />}
                          sx={{ fontWeight: 700, flex: 1 }}
                        >
                          New tab
                        </Button>
                        <Button
                          onClick={() => setOpenCodeGame(game)}
                          color="secondary"
                          startIcon={<CodeRoundedIcon />}
                          sx={{ fontWeight: 700, flex: 1 }}
                        >
                          View code
                        </Button>
                      </Stack>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        {isDialogOpen && (
          <Dialog
            fullScreen
            open={isDialogOpen}
            onClose={handleCloseGame}
            TransitionComponent={Transition}
            TransitionProps={{ onEntered: focusGameFrame }}
            keepMounted={false}
            ModalProps={{ disableScrollLock: true }}
            PaperProps={{
              sx: {
                backgroundColor: 'rgba(5,9,20,0.96)',
                backdropFilter: 'blur(12px)'
              }
            }}
          >
            <AppBar
              position="relative"
              color="transparent"
              elevation={0}
              sx={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(5,9,20,0.9)' }}
            >
            <Toolbar>
              <Stack direction="column" spacing={0.3} sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2" color="secondary.main" sx={{ letterSpacing: 1, fontWeight: 800 }}>
                  {openGame?.tags?.join(' · ') || 'Game'}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {openGame?.title || 'Loading game'}
                </Typography>
              </Stack>
                {openGame && (
                  <Button
                    component="a"
                    href={openGame.path}
                    target="_blank"
                    rel="noreferrer"
                    color="secondary"
                    endIcon={<LaunchRoundedIcon />}
                    sx={{ mr: 1.5, fontWeight: 800 }}
                  >
                    Open in new tab
                  </Button>
                )}
                <IconButton edge="end" color="inherit" onClick={handleCloseGame} aria-label="close">
                  <CloseRoundedIcon />
                </IconButton>
              </Toolbar>
            </AppBar>
            <DialogContent sx={{ p: 0, bgcolor: 'black' }}>
              {openGame && (
                <Box
                  component="iframe"
                  src={openGame.path}
                  title={openGame.title}
                  allowFullScreen
                  loading="lazy"
                  tabIndex={0}
                  ref={iframeRef}
                  onLoad={focusGameFrame}
                  sx={{
                    border: 0,
                    width: '100%',
                    height: 'calc(100vh - 72px)'
                  }}
                />
              )}
            </DialogContent>
          </Dialog>
        )}

        {isCodeDialogOpen && (
          <Dialog
            open={isCodeDialogOpen}
            onClose={handleCloseCode}
            TransitionComponent={Transition}
            keepMounted={false}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                backgroundColor: 'rgba(8,12,24,0.96)',
                border: '1px solid rgba(244,176,0,0.2)'
              }
            }}
          >
            <DialogTitle sx={{ px: 3, py: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2" color="secondary.main" sx={{ letterSpacing: 1, fontWeight: 800 }}>
                    Code walkthrough
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {openCodeGame?.title || 'Game code'}
                  </Typography>
                </Box>
                <IconButton edge="end" color="inherit" onClick={handleCloseCode} aria-label="close">
                  <CloseRoundedIcon />
                </IconButton>
              </Stack>
            </DialogTitle>
            <DialogContent sx={{ px: 3, pb: 3 }}>
              {openCodeGame && (
                <Stack spacing={2.5}>
                  <Typography variant="body2" color="text.secondary">
                    {openCodeGame.codeOverview}
                  </Typography>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
                  {codeLoading && (
                    <Typography variant="body2" color="text.secondary">
                      Loading code blocks...
                    </Typography>
                  )}
                  {codeError && <Alert severity="error">{codeError}</Alert>}
                  {!codeLoading && !codeError && codeBlocks.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No code blocks were found for this game.
                    </Typography>
                  )}
                  {!codeLoading && !codeError && codeBlocks.length > 0 && (
                    <Stack spacing={3}>
                      {codeBlocks.map((block) => (
                        <Stack key={block.id} spacing={1.6}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                            {block.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {block.description}
                          </Typography>
                          {block.highlights?.length > 0 && (
                            <Stack spacing={1}>
                              <Typography variant="overline" color="secondary.main" sx={{ letterSpacing: 1, fontWeight: 800 }}>
                                Highlights
                              </Typography>
                              {block.highlights.map((item) => (
                                <Stack key={item} direction="row" spacing={1.5} alignItems="flex-start">
                                  <Box
                                    sx={{
                                      width: 8,
                                      height: 8,
                                      borderRadius: '50%',
                                      bgcolor: 'secondary.main',
                                      mt: '6px',
                                      flexShrink: 0
                                    }}
                                  />
                                  <Typography variant="body2">{item}</Typography>
                                </Stack>
                              ))}
                            </Stack>
                          )}
                          {block.sections?.length > 0 ? (
                            <Stack spacing={2.5}>
                              {block.sections.map((section) => (
                                <Stack key={section.id} spacing={1.3}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                    {section.title}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {section.description}
                                  </Typography>
                                  {section.notes?.length > 0 && (
                                    <Stack spacing={1}>
                                      <Typography variant="overline" color="secondary.main" sx={{ letterSpacing: 1, fontWeight: 800 }}>
                                        Inline annotations
                                      </Typography>
                                      {section.notes.map((note) => (
                                        <Stack key={note} direction="row" spacing={1.5} alignItems="flex-start">
                                          <Box
                                            sx={{
                                              width: 8,
                                              height: 8,
                                              borderRadius: '50%',
                                              bgcolor: 'secondary.main',
                                              mt: '6px',
                                              flexShrink: 0
                                            }}
                                          />
                                          <Typography variant="body2">{note}</Typography>
                                        </Stack>
                                      ))}
                                    </Stack>
                                  )}
                                  <Box
                                    component="pre"
                                    sx={monokaiCodeStyles}
                                    dangerouslySetInnerHTML={{
                                      __html: highlightCode(section.code, block.language)
                                    }}
                                  />
                                </Stack>
                              ))}
                            </Stack>
                          ) : (
                            <Box
                              component="pre"
                              sx={monokaiCodeStyles}
                              dangerouslySetInnerHTML={{
                                __html: highlightCode(block.code, block.language)
                              }}
                            />
                          )}
                        </Stack>
                      ))}
                    </Stack>
                  )}
                </Stack>
              )}
            </DialogContent>
          </Dialog>
        )}

        <Box
          component="footer"
          sx={{
            mt: 5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            color: 'text.secondary'
          }}
        >
          <Divider flexItem sx={{ flexBasis: 60, borderColor: 'rgba(255,255,255,0.08)' }} />
          <Typography variant="body2">Copyright 2025 ROLEN L. EGUALAN</Typography>
          <Divider flexItem sx={{ flexBasis: 60, borderColor: 'rgba(255,255,255,0.08)' }} />
        </Box>
      </Container>
    </Box>
  );
}

export default App;
