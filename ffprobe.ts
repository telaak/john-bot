import { exec } from "child_process";
import { writeFile } from "fs/promises";
import { readdirSync } from "fs";
import { promisify } from "util";
const asyncExec = promisify(exec);

export const johnVideos = readdirSync("./videos/").filter(
  (f) => f.endsWith(".webm") || f.endsWith(".mp4") || f.endsWith(".mkv")
);

export function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const getRandomJohnVideo = () => {
  const randomVideo = johnVideos[getRandomIntInclusive(0, johnVideos.length)];
  return randomVideo;
};

export const durationProbe = async (filePath: string) => {
  const ffprobe = await asyncExec(
    `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`
  );
  return Number(ffprobe.stdout);
};

export const writeSubsFile = async (text: string, fileName: string) => {
  let srtFile = "1\n00:00:00,000 --> 99:99:99,999\n";
  srtFile += text;
  return writeFile(`${fileName}.srt`, srtFile);
};

export const getRandomFrame = async (
  videoLength: number,
  filePath: string,
  uuid: string
) => {
  const frameTime = Math.random() * videoLength;
  const randomFrame = await asyncExec(
    `ffmpeg -ss ${frameTime} -i "./videos/${filePath}" -vf "subtitles=${uuid}.srt:force_style='Fontsize=26'" -frames:v 1 -c:v png -f image2 -`,
    { encoding: "buffer", maxBuffer: 1024 * 1024 * 8 }
  );
  return randomFrame.stdout;
};
