import { StudentMessage } from '../types';

const MESSAGES_KEY = 'mattejakten_messages';

export function sendStudentMessage(
  studentId: string,
  studentName: string,
  studentAvatar: number,
  message: string,
): StudentMessage {
  const msg: StudentMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    studentId,
    studentName,
    studentAvatar,
    message: message.trim(),
    sentAt: new Date().toISOString(),
    read: false,
  };
  const messages = getStudentMessages();
  messages.push(msg);
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  return msg;
}

export function getStudentMessages(): StudentMessage[] {
  try {
    const stored = localStorage.getItem(MESSAGES_KEY);
    if (stored) return JSON.parse(stored) as StudentMessage[];
  } catch {
    // ignore parse errors
  }
  return [];
}

export function markMessageAsRead(messageId: string): void {
  const messages = getStudentMessages();
  const msg = messages.find(m => m.id === messageId);
  if (msg) {
    msg.read = true;
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  }
}

export function markAllMessagesAsRead(): void {
  const messages = getStudentMessages();
  messages.forEach(m => (m.read = true));
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}

export function deleteMessage(messageId: string): void {
  const messages = getStudentMessages().filter(m => m.id !== messageId);
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}

export function getUnreadMessageCount(): number {
  return getStudentMessages().filter(m => !m.read).length;
}
