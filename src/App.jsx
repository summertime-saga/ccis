import { forwardRef, useState } from 'react';
import SportsEsportsRoundedIcon from '@mui/icons-material/SportsEsportsRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {
  AppBar,
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

function App() {
  const primaryCta = games[0];
  const [openGame, setOpenGame] = useState(null);
  const isDialogOpen = Boolean(openGame);
  const handleClose = () => setOpenGame(null);
  const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

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
                  <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
                    <CardActionArea
                      onClick={() => setOpenGame(game)}
                      sx={{ height: '100%', alignItems: 'stretch', display: 'flex' }}
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
                        sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, height: '100%', position: 'relative' }}
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

                    <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
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
                      <Button
                        component="a"
                        href={game.path}
                        target="_blank"
                        rel="noreferrer"
                        color="inherit"
                        endIcon={<LaunchRoundedIcon />}
                        sx={{ fontWeight: 700 }}
                      >
                        New tab
                      </Button>
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
            onClose={handleClose}
            TransitionComponent={Transition}
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
                <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
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
          <Typography variant="body2">Project of CCIS students</Typography>
          <Divider flexItem sx={{ flexBasis: 60, borderColor: 'rgba(255,255,255,0.08)' }} />
        </Box>
      </Container>
    </Box>
  );
}

export default App;
