package com.faldren.service;

import com.faldren.entity.Conversation;
import com.faldren.entity.User;

import java.util.List;

public interface ConversationService {

    Conversation getOrCreateSupportConversation(
            User client
    );

    List<Conversation> getAllSupportConversations();

    Conversation getConversation(
            Long conversationId
    );

}