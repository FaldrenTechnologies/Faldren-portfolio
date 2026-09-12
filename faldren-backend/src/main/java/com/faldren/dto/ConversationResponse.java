package com.faldren.dto;

import java.time.LocalDateTime;

public class ConversationResponse {

    private Long conversationId;
    private Long clientId;
    private String clientName;
    private String companyName;
    private String lastMessage;
    private LocalDateTime lastMessageTime;

    public ConversationResponse() {
    }

    public ConversationResponse(
            Long conversationId,
            Long clientId,
            String clientName,
            String companyName,
            String lastMessage,
            LocalDateTime lastMessageTime
    ) {
        this.conversationId = conversationId;
        this.clientId = clientId;
        this.clientName = clientName;
        this.companyName = companyName;
        this.lastMessage = lastMessage;
        this.lastMessageTime = lastMessageTime;
    }

    public Long getConversationId() {
        return conversationId;
    }

    public void setConversationId(Long conversationId) {
        this.conversationId = conversationId;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }

    public LocalDateTime getLastMessageTime() {
        return lastMessageTime;
    }

    public void setLastMessageTime(LocalDateTime lastMessageTime) {
        this.lastMessageTime = lastMessageTime;
    }
}