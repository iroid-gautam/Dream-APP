import GodWhisper from "../model/godWhisper";
import logger from "../src/common/logger";

const godWhisperLogger = logger.withLabel("GOD_WHISPER_SEED");

const defaultGodWhispers = [
  { message: "You were chosen for this chapter, not by accident.", sortOrder: 1 },
  { message: "Small obedience today creates big freedom tomorrow.", sortOrder: 2 },
  { message: "The step you avoid is often the door you prayed for.", sortOrder: 3 },
  { message: "Peace grows where discipline stays.", sortOrder: 4 },
  { message: "Your future is built in quiet consistency.", sortOrder: 5 },
  { message: "Do not measure progress only by speed; measure it by faithfulness.", sortOrder: 6 },
  { message: "Hard days do not cancel holy purpose.", sortOrder: 7 },
  { message: "Courage is repeating the right choice when no one sees.", sortOrder: 8 },
  { message: "Grace is not an excuse to quit; it is strength to continue.", sortOrder: 9 },
  { message: "Your calling is stronger than your comfort zone.", sortOrder: 10 },
  { message: "One honest hour can change an entire season.", sortOrder: 11 },
  { message: "You are not behind when you are being prepared.", sortOrder: 12 },
  { message: "Guard your mornings and your life will follow.", sortOrder: 13 },
  { message: "The discipline you resist now becomes the joy you enjoy later.", sortOrder: 14 },
  { message: "Do not let noise decide your direction.", sortOrder: 15 },
  { message: "Truth over mood, mission over fear.", sortOrder: 16 },
  { message: "Faithfulness in private shapes authority in public.", sortOrder: 17 },
  { message: "Your limits are not your identity.", sortOrder: 18 },
  { message: "You can start again without starting from zero.", sortOrder: 19 },
  { message: "When you choose peace, clarity follows.", sortOrder: 20 },
  { message: "Delay is not denial; keep walking.", sortOrder: 21 },
  { message: "Strength is built by kept promises to yourself.", sortOrder: 22 },
  { message: "The next right action is enough for today.", sortOrder: 23 },
  { message: "What you water daily will define your harvest.", sortOrder: 24 },
  { message: "You are not stuck; you are one decision away from movement.", sortOrder: 25 },
  { message: "The pain of growth is cleaner than the pain of regret.", sortOrder: 26 },
  { message: "Stop negotiating with the habits that steal your peace.", sortOrder: 27 },
  { message: "Your voice matters, so speak life over your day.", sortOrder: 28 },
  { message: "Focus is spiritual warfare against distraction.", sortOrder: 29 },
  { message: "Do not shrink to fit places you outgrew.", sortOrder: 30 },
  { message: "Wisdom often sounds like a simple next step.", sortOrder: 31 },
  { message: "A surrendered heart can carry a heavy assignment.", sortOrder: 32 },
  { message: "You were not made to carry yesterday into today.", sortOrder: 33 },
  { message: "Consistency is louder than motivation.", sortOrder: 34 },
  { message: "Choose the long road of integrity.", sortOrder: 35 },
  { message: "Your tears are not weakness; they are evidence you still care.", sortOrder: 36 },
  { message: "There is grace for this exact moment.", sortOrder: 37 },
  { message: "What is holy is often hidden before it is seen.", sortOrder: 38 },
  { message: "Refuse hurry; choose depth.", sortOrder: 39 },
  { message: "You do not need to force what God can form.", sortOrder: 40 },
  { message: "Discipline protects dreams from becoming wishes.", sortOrder: 41 },
  { message: "Keep your heart soft and your standards strong.", sortOrder: 42 },
  { message: "Your assignment is too important for half effort.", sortOrder: 43 },
  { message: "Healing is progress, not performance.", sortOrder: 44 },
  { message: "Do not trade peace for approval.", sortOrder: 45 },
  { message: "The right path may be slower, but it is safer.", sortOrder: 46 },
  { message: "You have permission to rest, not to quit.", sortOrder: 47 },
  { message: "The seed of obedience always has a harvest.", sortOrder: 48 },
  { message: "Bravery is often quiet and repetitive.", sortOrder: 49 },
  { message: "Guard what enters your mind; it becomes what leaves your life.", sortOrder: 50 },
  { message: "You are being refined, not rejected.", sortOrder: 51 },
  { message: "The breakthrough often begins with honesty.", sortOrder: 52 },
  { message: "A clear no can protect a sacred yes.", sortOrder: 53 },
  { message: "You are not too late for what is truly yours.", sortOrder: 54 },
  { message: "Let gratitude reset your perspective.", sortOrder: 55 },
  { message: "What you repeat becomes who you become.", sortOrder: 56 },
  { message: "Hold the line; your future self will thank you.", sortOrder: 57 },
  { message: "Be rooted, not rushed.", sortOrder: 58 },
  { message: "Where wisdom leads, peace confirms.", sortOrder: 59 },
  { message: "The cost of compromise is always higher than it first appears.", sortOrder: 60 },
  { message: "Faith grows when comfort shrinks.", sortOrder: 61 },
  { message: "You can be gentle and still be strong.", sortOrder: 62 },
  { message: "What feels hidden is still holy work.", sortOrder: 63 },
  { message: "Stop rehearsing fear; rehearse truth.", sortOrder: 64 },
  { message: "The next faithful act is your momentum.", sortOrder: 65 },
  { message: "Your story is not disqualified by struggle.", sortOrder: 66 },
  { message: "Boundaries are not walls; they are wisdom.", sortOrder: 67 },
  { message: "Clarity comes to the moving, not only the waiting.", sortOrder: 68 },
  { message: "Your purpose does not need perfect conditions.", sortOrder: 69 },
  { message: "What you practice in secret shapes what you carry in public.", sortOrder: 70 },
  { message: "Let conviction be louder than convenience.", sortOrder: 71 },
  { message: "The long way with peace beats the shortcut with chaos.", sortOrder: 72 },
  { message: "There is power in showing up again.", sortOrder: 73 },
  { message: "Do not despise ordinary days; they build extraordinary lives.", sortOrder: 74 },
  { message: "Your surrender is not loss; it is alignment.", sortOrder: 75 },
  { message: "Keep your pace with peace, not pressure.", sortOrder: 76 },
  { message: "Your obedience today can bless generations tomorrow.", sortOrder: 77 },
  { message: "Truth heals what pretending prolongs.", sortOrder: 78 },
  { message: "The assignment survives the storm when your foundation is right.", sortOrder: 79 },
  { message: "You are allowed to grow beyond old labels.", sortOrder: 80 },
  { message: "Your mind needs feeding, not flooding.", sortOrder: 81 },
  { message: "Choose what is right, even when it is not easy.", sortOrder: 82 },
  { message: "The right people will honor your becoming.", sortOrder: 83 },
  { message: "Your next season is shaped by today's discipline.", sortOrder: 84 },
  { message: "Faith is forward motion with limited visibility.", sortOrder: 85 },
  { message: "Protect your calling from constant comparison.", sortOrder: 86 },
  { message: "The burden feels lighter when shared with God first.", sortOrder: 87 },
  { message: "Let your yes be whole, not hesitant.", sortOrder: 88 },
  { message: "You are stronger than the habit you are breaking.", sortOrder: 89 },
  { message: "Do not confuse delay with defeat.", sortOrder: 90 },
  { message: "Learn to celebrate quiet progress.", sortOrder: 91 },
  { message: "What you honor grows in your life.", sortOrder: 92 },
  { message: "Your discipline today is a gift to tomorrow's you.", sortOrder: 93 },
  { message: "Grace teaches you to stand, not settle.", sortOrder: 94 },
  { message: "Do the hard right thing and trust the process.", sortOrder: 95 },
  { message: "You are not powerless in this moment.", sortOrder: 96 },
  { message: "The promise is still valid; keep preparing.", sortOrder: 97 },
  { message: "Quiet trust outlasts loud anxiety.", sortOrder: 98 },
  { message: "Choose alignment over applause.", sortOrder: 99 },
  { message: "You were built to finish what you started.", sortOrder: 100 },
];

const normalizeWhisperMessage = (message = "") => message.trim().toLowerCase();

const seedGodWhispers = async () => {
  const existingWhispers = await GodWhisper.findAll({
    attributes: ["id", "message", "isActive", "sortOrder"],
  });

  const existingWhisperMap = new Map(
    existingWhispers.map((whisper) => [
      normalizeWhisperMessage(whisper.message),
      whisper,
    ])
  );

  for (const whisper of defaultGodWhispers) {
    const normalizedMessage = normalizeWhisperMessage(whisper.message);
    const existingWhisper = existingWhisperMap.get(normalizedMessage);

    if (!existingWhisper) {
      await GodWhisper.create({
        message: whisper.message,
        sortOrder: whisper.sortOrder,
        isActive: true,
      });
      continue;
    }

    if (
      existingWhisper.sortOrder !== whisper.sortOrder ||
      existingWhisper.isActive !== true
    ) {
      existingWhisper.sortOrder = whisper.sortOrder;
      existingWhisper.isActive = true;
      await existingWhisper.save();
    }
  }

  godWhisperLogger.info("God whisper seed completed successfully.", {
    totalDefaultWhispers: defaultGodWhispers.length,
  });
};

const runSeeders = async () => {
  await seedGodWhispers();
};

export { defaultGodWhispers, seedGodWhispers, runSeeders };
