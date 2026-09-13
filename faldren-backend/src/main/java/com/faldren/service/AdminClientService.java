package com.faldren.service;

import com.faldren.dto.AdminClientResponse;

import com.faldren.entity.Conversation;
import com.faldren.entity.Message;
import com.faldren.entity.Project;
import com.faldren.entity.ProjectModule;
import com.faldren.entity.ProjectRequest;
import com.faldren.entity.Role;
import com.faldren.entity.User;

import com.faldren.repository.ConversationRepository;
import com.faldren.repository.MessageRepository;
import com.faldren.repository.ProjectModuleRepository;
import com.faldren.repository.ProjectRepository;
import com.faldren.repository.ProjectRequestRepository;
import com.faldren.repository.UserRepository;

import jakarta.persistence.EntityManager;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;


@Service
public class AdminClientService {

    private final UserRepository userRepository;

    private final ProjectRepository
            projectRepository;

    private final ProjectRequestRepository
            projectRequestRepository;

    private final ProjectModuleRepository
            projectModuleRepository;

    private final ConversationRepository
            conversationRepository;

    private final MessageRepository
            messageRepository;

    private final EntityManager
            entityManager;


    public AdminClientService(
            UserRepository userRepository,
            ProjectRepository projectRepository,
            ProjectRequestRepository projectRequestRepository,
            ProjectModuleRepository projectModuleRepository,
            ConversationRepository conversationRepository,
            MessageRepository messageRepository,
            EntityManager entityManager
    ) {

        this.userRepository =
                userRepository;

        this.projectRepository =
                projectRepository;

        this.projectRequestRepository =
                projectRequestRepository;

        this.projectModuleRepository =
                projectModuleRepository;

        this.conversationRepository =
                conversationRepository;

        this.messageRepository =
                messageRepository;

        this.entityManager =
                entityManager;
    }


    // ==========================================
    // GET ALL CLIENTS
    // ==========================================

    @Transactional(readOnly = true)
    public List<AdminClientResponse>
    getAllClients() {

        return userRepository
                .findByRole(Role.CLIENT)
                .stream()
                .map(this::toResponse)
                .toList();
    }


    // ==========================================
    // DELETE CLIENT
    // ==========================================

    @Transactional
    public void deleteClient(
            Long clientId
    ) {

        User client =
                userRepository
                        .findById(clientId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Client not found."
                                )
                        );


        if (
                client.getRole()
                        != Role.CLIENT
        ) {

            throw new RuntimeException(
                    "Only client accounts can be deleted."
            );
        }


        // ======================================
        // 1. DELETE CLIENT MESSAGES
        // ======================================

        List<Conversation> conversations =
                conversationRepository
                        .findByClient(client);


        if (!conversations.isEmpty()) {

            List<Message> messages =
                    new ArrayList<>();


            for (
                    Conversation conversation
                    : conversations
            ) {

                messages.addAll(
                        messageRepository
                                .findByConversationOrderByCreatedAtAsc(
                                        conversation
                                )
                );
            }


            if (!messages.isEmpty()) {

                messageRepository
                        .deleteAllInBatch(
                                messages
                        );
            }


            conversationRepository
                    .deleteAllInBatch(
                            conversations
                    );
        }


        // ======================================
        // 2. GET CLIENT PROJECTS
        // ======================================

        List<Project> projects =
                projectRepository
                        .findByClientOrderByCreatedAtDesc(
                                client
                        );


        // ======================================
        // 3. DELETE PROJECT MODULES
        // ======================================

        List<ProjectModule> modules =
                new ArrayList<>();


        for (
                Project project
                : projects
        ) {

            modules.addAll(
                    projectModuleRepository
                            .findByProjectOrderByCreatedAtDesc(
                                    project
                            )
            );
        }


        if (!modules.isEmpty()) {

            projectModuleRepository
                    .deleteAllInBatch(
                            modules
                    );
        }


        // ======================================
        // 4. DELETE PROJECTS
        // ======================================

        if (!projects.isEmpty()) {

            projectRepository
                    .deleteAllInBatch(
                            projects
                    );
        }


        // ======================================
        // 5. DELETE PROJECT REQUESTS
        // ======================================

        List<ProjectRequest> requests =
                projectRequestRepository
                        .findByClientOrderByCreatedAtDesc(
                                client
                        );


        if (!requests.isEmpty()) {

            projectRequestRepository
                    .deleteAllInBatch(
                            requests
                    );
        }


        // ======================================
        // 6. CLEAR HIBERNATE PERSISTENCE CONTEXT
        // ======================================

        /*
         * deleteAllInBatch() directly deletes rows
         * from the database.
         *
         * But Hibernate can still keep old
         * ProjectRequest / Project / Conversation
         * objects in its persistence context.
         *
         * Clear them before deleting the client.
         */

        entityManager.clear();


        // ======================================
        // 7. FETCH CLIENT AGAIN
        // ======================================

        User freshClient =
                userRepository
                        .findById(clientId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Client account not found."
                                )
                        );


        if (
                freshClient.getRole()
                        != Role.CLIENT
        ) {

            throw new RuntimeException(
                    "Only client accounts can be deleted."
            );
        }


        // ======================================
        // 8. DELETE CLIENT ACCOUNT
        // ======================================

        userRepository.delete(
                freshClient
        );

        userRepository.flush();
    }


    // ==========================================
    // RESPONSE
    // ==========================================

    private AdminClientResponse toResponse(
            User user
    ) {

        return new AdminClientResponse(

                user.getId(),

                user.getFullName(),

                user.getCompanyName(),

                user.getEmail(),

                user.getPhone(),

                user.getCreatedAt()
        );
    }
}