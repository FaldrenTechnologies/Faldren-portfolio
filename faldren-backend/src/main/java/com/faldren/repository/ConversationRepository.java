package com.faldren.repository;

import com.faldren.entity.Conversation;
import com.faldren.entity.ConversationType;
import com.faldren.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository
        extends JpaRepository<Conversation, Long> {

    Optional<Conversation> findByClientAndType(
            User client,
            ConversationType type
    );

    Optional<Conversation> findById(
            Long id
    );

    List<Conversation> findAllByOrderByUpdatedAtDesc();

}