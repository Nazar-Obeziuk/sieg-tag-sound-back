import axios from "axios";

const baseURL =
  "https://api.telegram.org/bot7322476709:AAGmEvb_bHnLyj2USx43tJjkrHQgMljDN14/";

export const sendMessage = async (message) => {
  const chatId = "-4202253447";

  const sendTextMessage = async () => {
    try {
      const response = await axios.post(`${baseURL}sendMessage`, {
        chat_id: chatId,
        text: message,
      });

      if (response.status !== 200) {
        throw new Error("Не вдалося надіслати повідомлення");
      }
    } catch (error) {
      console.error("Помилка при надсиланні повідомлення:", error);
      throw new Error(
        error.message || "Щось пішло не так при відправленні повідомлення..."
      );
    }
  };

  try {
    await sendTextMessage();
  } catch (error) {
    console.error("Помилка при надсиланні повідомлення:", error);
  }
};
