import { getLogger, LoggerType } from "./sleepingLogger";
import { Settings } from "./sleepingSettings";

type DiscordContent = {
  content: null;
  embeds: {
    title: string;
    color: number;
  }[];
  username: string;
  avatar_url: string;
};

export class SleepingDiscord {
  logger: LoggerType;
  settings: Settings;

  constructor(settings: Settings) {
    this.settings = settings;
    this.logger = getLogger();
  }

  private sendMessage = async (content: DiscordContent, woke: boolean) => {
    if (woke) {
      this.logger.info(`[Discord] Sending waking up message`);
    } else {
      this.logger.info(`[Discord] Sending closing server message`);
    }

    if (this.settings.discordWebhookUrl) {
      const response = await fetch(this.settings.discordWebhookUrl, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(content),
      });

      this.logger.info("[Discord] response: ", await response.text());
    }
  };

  onPlayerLogging = async (playerName: string) => {
    const message = this.settings.discordWebhookWokeUpMessage || "woke up the server !";
    const content = {
      content: null,
      embeds: [
        {
          title: `${playerName} ${message}`,
          color: 25344,
        },
      ],
      username: this.settings.discordWebhookName || "SleepingServerStarter",
      avatar_url:
        this.settings.discordWebhookAvatar ||
        "https://raw.githubusercontent.com/vincss/mcsleepingserverstarter/feature/discord_notification/docs/sleepingLogo.png",
    };
    await this.sendMessage(content, true);
  };

  onServerStop = async () => {
    const message = this.settings.discordWebhookStopMessage || "💤 Server has shut down.";

    const content = {
      content: null,
      embeds: [
        {
          title: "💤 Server has shut down.",
          color: 25344,
        },
      ],
      username: this.settings.discordWebhookName || "SleepingServerStarter",
      avatar_url:
        this.settings.discordWebhookAvatar ||
        "https://raw.githubusercontent.com/vincss/mcsleepingserverstarter/feature/discord_notification/docs/sleepingLogo.png",
    };
    await this.sendMessage(content, false);
  };
}
