package com.faldren.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "conversation_id",
            nullable = false
    )
    private Conversation conversation;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "sender_id",
            nullable = false
    )
    private User sender;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MessageType type = MessageType.TEXT;


    @Column(
            columnDefinition = "TEXT",
            nullable = false
    )
    private String message;


    @Column(
            name = "is_deleted",
            nullable = false
    )
    private boolean deleted = false;


    @Column(
            name = "created_at",
            nullable = false
    )
    private LocalDateTime createdAt;


    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
    }


    public Long getId() {
        return id;
    }

    public Conversation getConversation() {
        return conversation;
    }

    public void setConversation(
            Conversation conversation
    ) {
        this.conversation = conversation;
    }

    public User getSender() {
        return sender;
    }

    public void setSender(
            User sender
    ) {
        this.sender = sender;
    }

    public MessageType getType() {
        return type;
    }

    public void setType(
            MessageType type
    ) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(
            String message
    ) {
        this.message = message;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(
            boolean deleted
    ) {
        this.deleted = deleted;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}