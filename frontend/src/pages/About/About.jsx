import { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import LinkIcon from "@mui/icons-material/Link";

import { useAbout } from "../../hooks/useAbout";
import { useAuth } from "../../hooks/useAuth";
import SkillChip from "../../components/sections/SkillChip/SkillChip";
import { formatDate } from "../../utils/helpers";
import "./About.css";

const SKILL_LEVELS = [1, 2, 3, 4, 5];

export default function About() {
  const { isAdmin } = useAuth();
  const {
    about,
    skills,
    certifications,
    loading,
    error,
    saveAbout,
    addSkill,
    editSkill,
    removeSkill,
    addCertification,
    editCertification,
    removeCertification,
  } = useAbout();

  // ── Inline edit state (bio/title/location) ──────────────────────────────────
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    bio: "",
    title: "",
    location: "",
    photo_url: "",
  });

  const startEditingProfile = () => {
    setProfileForm({
      bio: about?.bio || "",
      title: about?.title || "",
      location: about?.location || "",
      photo_url: about?.photo_url || "",
    });
    setEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    const ok = await saveAbout(profileForm);
    if (ok) setEditingProfile(false);
  };

  // ── Skill dialog state ───────────────────────────────────────────────────────
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [skillForm, setSkillForm] = useState({
    name: "",
    category: "",
    level: 3,
  });

  const openAddSkill = () => {
    setEditingSkill(null);
    setSkillForm({ name: "", category: "", level: 3 });
    setSkillDialogOpen(true);
  };

  const openEditSkill = (skill) => {
    setEditingSkill(skill);
    setSkillForm({
      name: skill.name,
      category: skill.category,
      level: skill.level,
    });
    setSkillDialogOpen(true);
  };

  const handleSaveSkill = async () => {
    const ok = editingSkill
      ? await editSkill(editingSkill.id, skillForm)
      : await addSkill(skillForm);
    if (ok) setSkillDialogOpen(false);
  };

  // ── Certification dialog state ───────────────────────────────────────────────
  const [certDialogOpen, setCertDialogOpen] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [certForm, setCertForm] = useState({
    name: "",
    issuer: "",
    issue_date: "",
    credential_url: "",
  });

  const openAddCert = () => {
    setEditingCert(null);
    setCertForm({ name: "", issuer: "", issue_date: "", credential_url: "" });
    setCertDialogOpen(true);
  };

  const openEditCert = (cert) => {
    setEditingCert(cert);
    setCertForm({
      name: cert.name,
      issuer: cert.issuer,
      issue_date: cert.issue_date,
      credential_url: cert.credential_url || "",
    });
    setCertDialogOpen(true);
  };

  const handleSaveCert = async () => {
    const payload = {
      ...certForm,
      credential_url: certForm.credential_url || null,
    };
    const ok = editingCert
      ? await editCertification(editingCert.id, payload)
      : await addCertification(payload);
    if (ok) setCertDialogOpen(false);
  };

  // ── Group skills by category ──────────────────────────────────────────────────
  const skillsByCategory = skills.reduce((acc, skill) => {
    acc[skill.category] = acc[skill.category] || [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  // ── Loading state ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Box className="about-loading">
        <CircularProgress />
      </Box>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────────
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography color="error" textAlign="center">
          {error}
        </Typography>
      </Container>
    );
  }

  // ── Empty state ───────────────────────────────────────────────────────────────
  if (!about && !isAdmin) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Profile coming soon.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" className="about-page">
      {/* ── Profile section ───────────────────────────────────────────── */}
      <Box className="about-profile">
        <Avatar
          src={about?.photo_url || undefined}
          alt={about?.title || "Profile photo"}
          sx={{ width: 120, height: 120 }}
        />

        <Box sx={{ flex: 1 }}>
          {editingProfile ? (
            <Stack spacing={2}>
              <TextField
                label="Title"
                fullWidth
                value={profileForm.title}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, title: e.target.value }))
                }
              />
              <TextField
                label="Location"
                fullWidth
                value={profileForm.location}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, location: e.target.value }))
                }
              />
              <TextField
                label="Photo URL"
                fullWidth
                value={profileForm.photo_url}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, photo_url: e.target.value }))
                }
              />
              <TextField
                label="Bio"
                fullWidth
                multiline
                minRows={4}
                value={profileForm.bio}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, bio: e.target.value }))
                }
              />
              <Stack direction="row" spacing={1}>
                <Button variant="contained" onClick={handleSaveProfile}>
                  Save
                </Button>
                <Button onClick={() => setEditingProfile(false)}>Cancel</Button>
              </Stack>
            </Stack>
          ) : (
            <>
              <Typography variant="h4" fontWeight={700}>
                {about?.title || "Add your title"}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1.5 }}
              >
                {about?.location || "Add your location"}
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                {about?.bio || "Add your bio"}
              </Typography>
              {isAdmin && (
                <Button
                  size="small"
                  startIcon={<EditIcon fontSize="small" />}
                  onClick={startEditingProfile}
                  sx={{ mt: 1.5 }}
                >
                  Edit Profile
                </Button>
              )}
            </>
          )}
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* ── Skills section ────────────────────────────────────────────── */}
      <Box className="about-section-header">
        <Typography variant="h5" fontWeight={600}>
          Skills
        </Typography>
        {isAdmin && (
          <Button size="small" startIcon={<AddIcon />} onClick={openAddSkill}>
            Add Skill
          </Button>
        )}
      </Box>

      {Object.keys(skillsByCategory).length === 0 ? (
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          No skills added yet.
        </Typography>
      ) : (
        Object.entries(skillsByCategory).map(([category, items]) => (
          <Box key={category} sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 1, textTransform: "uppercase", letterSpacing: 0.5 }}
            >
              {category}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {items.map((skill) => (
                <SkillChip
                  key={skill.id}
                  skill={skill}
                  onEdit={isAdmin ? openEditSkill : undefined}
                  onDelete={isAdmin ? removeSkill : undefined}
                />
              ))}
            </Stack>
          </Box>
        ))
      )}

      <Divider sx={{ my: 4 }} />

      {/* ── Certifications section ────────────────────────────────────── */}
      <Box className="about-section-header">
        <Typography variant="h5" fontWeight={600}>
          Certifications
        </Typography>
        {isAdmin && (
          <Button size="small" startIcon={<AddIcon />} onClick={openAddCert}>
            Add Certification
          </Button>
        )}
      </Box>

      {certifications.length === 0 ? (
        <Typography color="text.secondary">
          No certifications added yet.
        </Typography>
      ) : (
        <Stack spacing={1.5}>
          {certifications.map((cert) => (
            <Card key={cert.id} variant="outlined" sx={{ minHeight: 88 }}>
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1.5,
                }}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {cert.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {cert.issuer} · {formatDate(cert.issue_date)}
                  </Typography>
                  {cert.credential_url && (
                    <Button
                      size="small"
                      startIcon={<LinkIcon fontSize="small" />}
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ mt: 0.5, pl: 0 }}
                    >
                      View credential
                    </Button>
                  )}
                </Box>
                {isAdmin && (
                  <Stack direction="row" spacing={0.5}>
                    <IconButton size="small" onClick={() => openEditCert(cert)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => removeCertification(cert.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* ── Skill dialog ──────────────────────────────────────────────── */}
      <Dialog
        open={skillDialogOpen}
        onClose={() => setSkillDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>{editingSkill ? "Edit Skill" : "Add Skill"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              fullWidth
              value={skillForm.name}
              onChange={(e) =>
                setSkillForm((f) => ({ ...f, name: e.target.value }))
              }
            />
            <TextField
              label="Category"
              fullWidth
              value={skillForm.category}
              onChange={(e) =>
                setSkillForm((f) => ({ ...f, category: e.target.value }))
              }
            />
            <TextField
              select
              label="Level"
              fullWidth
              value={skillForm.level}
              onChange={(e) =>
                setSkillForm((f) => ({ ...f, level: Number(e.target.value) }))
              }
            >
              {SKILL_LEVELS.map((lvl) => (
                <MenuItem key={lvl} value={lvl}>
                  {lvl}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSkillDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveSkill}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Certification dialog ──────────────────────────────────────── */}
      <Dialog
        open={certDialogOpen}
        onClose={() => setCertDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          {editingCert ? "Edit Certification" : "Add Certification"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              fullWidth
              value={certForm.name}
              onChange={(e) =>
                setCertForm((f) => ({ ...f, name: e.target.value }))
              }
            />
            <TextField
              label="Issuer"
              fullWidth
              value={certForm.issuer}
              onChange={(e) =>
                setCertForm((f) => ({ ...f, issuer: e.target.value }))
              }
            />
            <TextField
              label="Issue Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={certForm.issue_date}
              onChange={(e) =>
                setCertForm((f) => ({ ...f, issue_date: e.target.value }))
              }
            />
            <TextField
              label="Credential URL (optional)"
              fullWidth
              value={certForm.credential_url}
              onChange={(e) =>
                setCertForm((f) => ({ ...f, credential_url: e.target.value }))
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCertDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveCert}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
