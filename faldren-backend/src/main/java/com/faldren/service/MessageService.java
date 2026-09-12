package com.faldren.service;

import com.faldren.dto.ConversationResponse;
import com.faldren.dto.MessageResponse;

import com.faldren.entity.Conversation;
import com.faldren.entity.ConversationType;
import com.faldren.entity.Message;
import com.faldren.entity.MessageType;
import com.faldren.entity.Role;
import com.faldren.entity.User;

import com.faldren.repository.ConversationRepository;
import com.faldren.repository.MessageRepository;
import com.faldren.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
public class MessageService {

    private final UserRepository userRepository;
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;

    public MessageService(
            UserRepository userRepository,
            ConversationRepository conversationRepository,
            MessageRepository messageRepository
    ) {
        this.userRepository = userRepository;
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
    }

    // ==========================================
    // CLIENT - SEND MESSAGE
    // ==========================================

    @Transactional
    public MessageResponse sendClientMessage(
            String authenticatedEmail,
            String text
    ) {
        User client = getClient(authenticatedEmail);
        Conversation conversation = getOrCreateConversation(client);

        Message message = createMessage(
                conversation,
                client,
                text
        );

        Message saved = messageRepository.save(message);

        return toMessageResponse(saved);
    }

    // ==========================================
    // CLIENT - GET OWN MESSAGES
    // ==========================================

    @Transactional(readOnly = true)
    public List<MessageResponse> getClientMessages(
            String authenticatedEmail
    ) {
        User client = getClient(authenticatedEmail);

        Conversation conversation = conversationRepository
                .findByClientAndType(
                        client,
                        ConversationType.CLIENT_SUPPORT
                )
                .orElse(null);

        if (conversation == null) {
            return List.of();
        }

        return messageRepository
                .findByConversationOrderByCreatedAtAsc(conversation)
                .stream()
                .filter(message -> !message.isDeleted())
                .map(this::toMessageResponse)
                .toList();
    }

    // ==========================================
    // ADMIN - GET ALL CLIENT CONVERSATIONS
    // ==========================================

    @Transactional(readOnly = true)
    public List<ConversationResponse> getAllConversations(
            String authenticatedEmail
    ) {
        getAdmin(authenticatedEmail);

        return conversationRepository
                .findAllByOrderByUpdatedAtDesc()
                .stream()
                .filter(conversation ->
                        conversation.getType()
                                == ConversationType.CLIENT_SUPPORT
                )
                .map(this::toConversationResponse)
                .sorted(
                        Comparator.comparing(
                                ConversationResponse::getLastMessageTime,
                                Comparator.nullsLast(
                                        Comparator.reverseOrder()
                                )
                        )
                )
                .toList();
    }

    // ==========================================
    // ADMIN - GET ONE CONVERSATION MESSAGES
    // ==========================================

    @Transactional(readOnly = true)
    public List<MessageResponse> getConversationMessages(
            String authenticatedEmail,
            Long conversationId
    ) {
        getAdmin(authenticatedEmail);
        Conversation conversation = getSupportConversation(conversationId);

        return messageRepository
                .findByConversationOrderByCreatedAtAsc(conversation)
                .stream()
                .filter(message -> !message.isDeleted())
                .map(this::toMessageResponse)
                .toList();
    }

    // ==========================================
    // ADMIN - SEND MESSAGE
    // ==========================================

    @Transactional
    public MessageResponse sendAdminMessage(
            String authenticatedEmail,
            Long conversationId,
            String text
    ) {
        User admin = getAdmin(authenticatedEmail);
        Conversation conversation = getSupportConversation(conversationId);

        Message message = createMessage(
                conversation,
                admin,
                text
        );

        Message saved = messageRepository.save(message);

        return toMessageResponse(saved);
    }

    // ==========================================
    // HELPERS - CLIENT
    // ==========================================

    private User getClient(String email) {
        User user = getUserByEmail(email);

        if (!user.isActive()) {
            throw new RuntimeException(
                    "Client account is disabled."
            );
        }

        if (user.getRole() != Role.CLIENT) {
            throw new RuntimeException(
                    "Client access denied."
            );
        }

        return user;
    }

    // ==========================================
    // HELPERS - ADMIN
    // ==========================================

    private User getAdmin(String email) {
        User user = getUserByEmail(email);

        if (!user.isActive()) {
            throw new RuntimeException(
                    "Admin account is disabled."
            );
        }

        if (user.getRole() != Role.ADMIN) {
            throw new RuntimeException(
                    "Admin access denied."
            );
        }

        return user;
    }

    // ==========================================
    // HELPERS - USER BY EMAIL
    // ==========================================

    private User getUserByEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new RuntimeException(
                    "Authenticated user not found."
            );
        }

        return userRepository
                .findByEmail(
                        email.trim().toLowerCase()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "User account not found."
                        )
                );
    }

    // ==========================================
    // HELPERS - GET OR CREATE CLIENT CHAT
    // ==========================================

    private Conversation getOrCreateConversation(
            User client
    ) {
        return conversationRepository
                .findByClientAndType(
                        client,
                        ConversationType.CLIENT_SUPPORT
                )
                .orElseGet(() -> {
                    Conversation conversation =
                            new Conversation();

                    conversation.setClient(client);
                    conversation.setType(
                            ConversationType.CLIENT_SUPPORT
                    );

                    return conversationRepository
                            .save(conversation);
                });
    }

    // ==========================================
    // HELPERS - GET SUPPORT CONVERSATION
    // ==========================================

    private Conversation getSupportConversation(
            Long conversationId
    ) {
        if (conversationId == null) {
            throw new RuntimeException(
                    "Conversation id is required."
            );
        }

        Conversation conversation = conversationRepository
                .findById(conversationId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Conversation not found."
                        )
                );

        if (conversation.getType()
                != ConversationType.CLIENT_SUPPORT) {
            throw new RuntimeException(
                    "Invalid support conversation."
            );
        }

        if (conversation.getClient() == null) {
            throw new RuntimeException(
                    "Conversation client not found."
            );
        }

        return conversation;
    }

    // ==========================================
    // HELPERS - CREATE MESSAGE
    // ==========================================

    private Message createMessage(
            Conversation conversation,
            User sender,
            String text
    ) {
        String cleanedMessage = cleanMessage(text);

        Message message = new Message();

        message.setConversation(conversation);
        message.setSender(sender);
        message.setType(MessageType.TEXT);
        message.setMessage(cleanedMessage);
        message.setDeleted(false);

        return message;
    }

    // ==========================================
    // HELPERS - VALIDATE MESSAGE
    // ==========================================

    private String cleanMessage(String text) {
        if (text == null) {
            throw new RuntimeException(
                    "Message cannot be empty."
            );
        }

        String cleaned = text.trim();

        if (cleaned.isEmpty()) {
            throw new RuntimeException(
                    "Message cannot be empty."
            );
        }

        if (cleaned.length() > 5000) {
            throw new RuntimeException(
                    "Message is too long."
            );
        }

        return cleaned;
    }

    // ==========================================
    // DTO - MESSAGE RESPONSE
    // ==========================================

    private MessageResponse toMessageResponse(
            Message message
    ) {
        User sender = message.getSender();

        return new MessageResponse(
                message.getId(),
                sender.getId(),
                sender.getFullName(),
                sender.getRole().name(),
                message.getMessage(),
                message.getType().name(),
                message.getCreatedAt()
        );
    }

    // ==========================================
    // DTO - CONVERSATION RESPONSE
    // ==========================================

    private ConversationResponse toConversationResponse(
            Conversation conversation
    ) {
        User client = conversation.getClient();

        List<Message> messages = messageRepository
                .findByConversationOrderByCreatedAtAsc(conversation)
                .stream()
                .filter(message -> !message.isDeleted())
                .toList();

        String lastMessage = null;
        LocalDateTime lastMessageTime = null;

        if (!messages.isEmpty()) {
            Message latest = messages.get(
                    messages.size() - 1
            );

            lastMessage = latest.getMessage();
            lastMessageTime = latest.getCreatedAt();
        }

        return new ConversationResponse(
                conversation.getId(),
                client.getId(),
                client.getFullName(),
                client.getCompanyName(),
                lastMessage,
                lastMessageTime
        );
    }
}
