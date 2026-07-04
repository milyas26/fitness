import { hermesRepository } from './hermes.repository.js';
import type { HermesConversationPayload } from '@fitness/shared';

export const hermesConversationService = {
  async save(data: HermesConversationPayload) {
    return hermesRepository.createConversation({
      raw_text: data.raw_text,
      source: data.source,
      message_id: data.message_id || null,
      chat_id: data.chat_id || null,
    });
  },
};
