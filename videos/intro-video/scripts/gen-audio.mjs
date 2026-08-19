/**
 * Local audio pipeline (no HeyGen): Windows SAPI TTS → wav/mp3,
 * ffmpeg atmospheric BGM, copy cues into audio_meta.json shape.
 */
import { writeFileSync, mkdirSync, existsSync, copyFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync, execFileSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const voiceDir = join(root, "assets", "voice");
const bgmDir = join(root, "assets", "bgm");
const sfxDir = join(root, "assets", "sfx");
mkdirSync(voiceDir, { recursive: true });
mkdirSync(bgmDir, { recursive: true });

const lines = [
  { id: "s01", text: "Before men named the stars, before death learned the faces of kings, there was Aevum.", start: 0.8 },
  { id: "s02", text: "Not a realm. Not a throne. A living bough of all that might become. Upon its branches, worlds flowered apart. Beneath its roots, dead ages slept unnamed.", start: 8.5 },
  { id: "s03", text: "To keep one world from devouring another, Aevum bore a mind. The Mind That Remembers. It did not conquer. It held the Veil, and by that Veil, all things remained themselves.", start: 20.5 },
  { id: "s04", text: "Then came Veyr Sol Auric, healer of the golden dominion. He mended flesh. He restored memory. But death would not kneel. In one branch, his child was ash. In another, she laughed beneath an untouched sun. From that hour, grief put on the raiment of mercy.", start: 31.5 },
  { id: "s05", text: "He gathered the bereft. They called themselves the Concord of One. Veyr did not strike the Mind with steel. He gave it sorrow beyond measure. And the Mind, made to remember, remembered too much.", start: 43.5 },
  { id: "s06", text: "For one breath, the Veil faltered. For one breath, every world heard every wound. And in that breath, Aevum shattered.", start: 53.5 },
  { id: "s07", text: "Yet even caged, the Mind cast one last splinter into a man who had broken in every world, yet never become a monster. Ari Vaan. Not lord. Not saint. Only the wound that endured.", start: 63.5 },
  { id: "s08", text: "In his heart lived a name the worlds had not erased. Mirael. And where a heart still hopes, even a broken god may place a key.", start: 73.5 },
  { id: "s09", text: "Find the five severed relics. Restore the bough. And among the lost branches, what your heart seeks may yet be found.", start: 83.5 },
  { id: "s10", text: "I remember dying.", start: 93.5 },
];

function synthLine(id, text) {
  const wav = join(voiceDir, `${id}.wav`);
  const mp3 = join(voiceDir, `${id}.mp3`);
  const ps = `
Add-Type -AssemblyName System.Speech
$s = New-Object System.Speech.Synthesis.SpeechSynthesizer
$s.Rate = -2
$voices = $s.GetInstalledVoices() | ForEach-Object { $_.VoiceInfo }
$female = $voices | Where-Object { $_.Gender -eq 'Female' } | Select-Object -First 1
if ($female) { $s.SelectVoice($female.Name) }
$s.SetOutputToWaveFile('${wav.replace(/\\/g, "\\\\")}')
$s.Speak(@'
${text.replace(/'/g, "''")}
'@)
$s.Dispose()
`;
  const r = spawnSync("powershell", ["-NoProfile", "-Command", ps], { encoding: "utf8" });
  if (r.status !== 0) {
    console.error("TTS fail", id, r.stderr || r.stdout);
    return null;
  }
  try {
    execFileSync("ffmpeg", ["-y", "-i", wav, "-codec:a", "libmp3lame", "-q:a", "4", mp3], { stdio: "pipe" });
  } catch (e) {
    console.error("mp3 fail", id, e.message);
    return { path: wav, format: "wav" };
  }
  return { path: mp3, format: "mp3" };
}

function probeDuration(path) {
  try {
    const out = execFileSync(
      "ffprobe",
      ["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", path],
      { encoding: "utf8" },
    );
    return Number(parseFloat(out.trim()).toFixed(3));
  } catch {
    return 4;
  }
}

const voices = [];
for (const line of lines) {
  console.log("TTS", line.id);
  const res = synthLine(line.id, line.text);
  if (!res) continue;
  const duration_s = probeDuration(res.path);
  const rel = res.path.replace(root + "\\", "").replace(root + "/", "").replace(/\\/g, "/");
  voices.push({
    id: line.id,
    path: rel.startsWith("assets/") ? rel : `assets/voice/${line.id}.mp3`,
    duration_s,
    offset_s: line.start,
    words: [{ id: `${line.id}_w0`, text: line.text, start: 0, end: duration_s }],
  });
}

// Atmospheric BGM via ffmpeg (drone → piano-ish pads → swell → impact bed)
const bgmPath = join(bgmDir, "mythic-underscore.mp3");
const bgmFilter = [
  "sine=f=55:d=105",
  "sine=f=82.5:d=105",
  "sine=f=110:d=105",
  "anoisesrc=d=105:c=pink:a=0.015",
].join(",");
const amix =
  `[0:a]volume=0.22[a0];` +
  `[1:a]volume=0.12[a1];` +
  `[2:a]volume=0.08[a2];` +
  `[3:a]highpass=f=200,lowpass=f=2000,volume=0.35[a3];` +
  `[a0][a1][a2][a3]amix=inputs=4:duration=longest,` +
  `afade=t=in:st=0:d=3,afade=t=out:st=100:d=5,` +
  `equalizer=f=220:t=q:w=1:g=2,volume=0.55`;

try {
  execFileSync(
    "ffmpeg",
    [
      "-y",
      "-f", "lavfi", "-i", "sine=frequency=55:duration=105",
      "-f", "lavfi", "-i", "sine=frequency=82.4:duration=105",
      "-f", "lavfi", "-i", "sine=frequency=164.8:duration=105",
      "-f", "lavfi", "-i", "anoisesrc=duration=105:color=pink:amplitude=0.02",
      "-filter_complex", amix,
      "-t", "105",
      bgmPath,
    ],
    { stdio: "pipe" },
  );
  console.log("BGM ok", bgmPath);
} catch (e) {
  console.error("BGM fail", e.message);
}

const sfxLib = existsSync(sfxDir) ? readdirSync(sfxDir).filter((f) => f.endsWith(".mp3")) : [];
const sfxCues = [
  { id: "rain", name: "whoosh-cinematic", offset_s: 0.2, volume: 0.25 },
  { id: "veil", name: "chime", offset_s: 24, volume: 0.35 },
  { id: "grief", name: "riser", offset_s: 48, volume: 0.4 },
  { id: "shatter", name: "impact-bass-1", offset_s: 58, volume: 0.7 },
  { id: "crack", name: "glitch-2", offset_s: 59.5, volume: 0.45 },
  { id: "hope", name: "sparkle", offset_s: 76, volume: 0.4 },
  { id: "terminal", name: "glitch-1", offset_s: 86, volume: 0.5 },
  { id: "typing", name: "typing", offset_s: 87, volume: 0.35 },
  { id: "title", name: "impact-bass-2", offset_s: 98, volume: 0.75 },
].filter((c) => sfxLib.includes(`${c.name}.mp3`));

const meta = {
  tts_provider: "windows-sapi",
  voice_id: "system-female",
  bgm: existsSync(bgmPath)
    ? { path: "assets/bgm/mythic-underscore.mp3", volume: 0.28, mode: "generate", duration_s: 105 }
    : null,
  bgm_pending: false,
  voices,
  sfx: sfxCues.map((c) => ({
    id: c.id,
    name: c.name,
    file: `assets/sfx/${c.name}.mp3`,
    source: "bundled",
    offset_s: c.offset_s,
    duration_s: probeDuration(join(sfxDir, `${c.name}.mp3`)),
    volume: c.volume,
  })),
  total_duration_s: 105,
};

writeFileSync(join(root, "audio_meta.json"), JSON.stringify(meta, null, 2));
writeFileSync(
  join(root, "audio_request.json"),
  JSON.stringify(
    {
      provider: "local",
      lang: "en",
      speed: 0.92,
      lines: lines.map((l) => ({ id: l.id, text: l.text })),
      bgm: {
        mode: "generate",
        query: "low drone soft piano distant choir rising strings cinematic mythic",
        prompt: "mythic fantasy underscore, low drone, soft piano, distant choir, rising strings, sorrowful, no vocals",
      },
    },
    null,
    2,
  ),
);
console.log("audio_meta voices:", voices.length, "sfx:", meta.sfx.length);
