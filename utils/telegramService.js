import axios from "axios";

const baseURL =
  "https://api.telegram.org/bot7322476709:AAGmEvb_bHnLyj2USx43tJjkrHQgMljDN14/";

export const sendMessage = async (message, files) => {
  const chatId = "-4202253447";

  const sendFile = async (file) => {
    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("caption", message);
    formData.append("document", file);

    try {
      const response = await axios.post(`${baseURL}sendDocument`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status !== 200) {
        throw new Error("Не вдалося надіслати документ");
      }
    } catch (error) {
      console.error("Помилка при надсиланні документа:", error);
      throw new Error(
        error.message || "Щось пішло не так при відправленні документа..."
      );
    }
  };

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

  const promises =
    files.length > 0
      ? files.map((file) => sendFile(file))
      : [sendTextMessage()];

  try {
    await Promise.all(promises);
  } catch (error) {
    console.error("Помилка при надсиланні повідомлень або документів:", error);
  }
};
