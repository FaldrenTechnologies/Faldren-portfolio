package com.faldren.service;

import com.faldren.dto.AdminCreateModuleRequest;
import com.faldren.dto.AdminModuleResponse;

import com.faldren.entity.Project;
import com.faldren.entity.ProjectModule;
import com.faldren.entity.Role;
import com.faldren.entity.User;

import com.faldren.repository.ProjectModuleRepository;
import com.faldren.repository.ProjectRepository;
import com.faldren.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
public class AdminProjectModuleService {

    private final ProjectModuleRepository
            projectModuleRepository;

    private final ProjectRepository
            projectRepository;

    private final UserRepository
            userRepository;

    private final NotificationEmailService
            notificationEmailService;


    public AdminProjectModuleService(
            ProjectModuleRepository projectModuleRepository,
            ProjectRepository projectRepository,
            UserRepository userRepository,
            NotificationEmailService notificationEmailService
    ) {

        this.projectModuleRepository =
                projectModuleRepository;

        this.projectRepository =
                projectRepository;

        this.userRepository =
                userRepository;

        this.notificationEmailService =
                notificationEmailService;
    }


    // ==========================================
    // CREATE MODULE
    // ==========================================

    @Transactional
    public AdminModuleResponse createModule(
            AdminCreateModuleRequest request
    ) {

        // ======================================
        // PROJECT ID
        // ======================================

        if (request.getProjectId() == null) {

            throw new IllegalArgumentException(
                    "Project is required."
            );
        }


        // ======================================
        // DEVELOPER ID
        // ======================================

        if (request.getDeveloperId() == null) {

            throw new IllegalArgumentException(
                    "Developer is required."
            );
        }


        // ======================================
        // MODULE NAME
        // ======================================

        if (
                request.getModuleName() == null ||
                request.getModuleName()
                        .trim()
                        .isEmpty()
        ) {

            throw new IllegalArgumentException(
                    "Module name is required."
            );
        }


        // ======================================
        // BRANCH NAME
        // ======================================

        if (
                request.getBranchName() == null ||
                request.getBranchName()
                        .trim()
                        .isEmpty()
        ) {

            throw new IllegalArgumentException(
                    "Git branch name is required."
            );
        }


        // ======================================
        // FIND PROJECT
        // ======================================

        Project project =
                projectRepository
                        .findById(
                                request.getProjectId()
                        )
                        .orElseThrow(
                                () ->
                                        new IllegalArgumentException(
                                                "Project not found."
                                        )
                        );


        // ======================================
        // FIND DEVELOPER
        // ======================================

        User developer =
                userRepository
                        .findById(
                                request.getDeveloperId()
                        )
                        .orElseThrow(
                                () ->
                                        new IllegalArgumentException(
                                                "Developer not found."
                                        )
                        );


        // ======================================
        // ROLE CHECK
        // ======================================

        if (
                developer.getRole()
                        != Role.DEVELOPER
        ) {

            throw new IllegalArgumentException(
                    "Selected user is not a developer."
            );
        }


        // ======================================
        // ACTIVE CHECK
        // ======================================

        if (!developer.isActive()) {

            throw new IllegalArgumentException(
                    "Selected developer account is inactive."
            );
        }


        // ======================================
        // CREATE MODULE
        // ======================================

        ProjectModule module =
                new ProjectModule();


        module.setProject(
                project
        );


        module.setAssignedDeveloper(
                developer
        );


        module.setModuleName(
                request
                        .getModuleName()
                        .trim()
        );


        module.setDescription(
                normalize(
                        request.getDescription()
                )
        );


        module.setAcceptanceCriteria(
                normalize(
                        request.getAcceptanceCriteria()
                )
        );


        module.setRepoUrl(
                normalize(
                        request.getRepoUrl()
                )
        );


        // ======================================
        // BASE BRANCH
        // ======================================

        String baseBranch =
                normalize(
                        request.getBaseBranch()
                );


        module.setBaseBranch(
                baseBranch == null
                        ? "develop"
                        : baseBranch
        );


        module.setBranchName(
                request
                        .getBranchName()
                        .trim()
        );


        // ======================================
        // PRIORITY
        // ======================================

        String priority =
                normalize(
                        request.getPriority()
                );


        module.setPriority(
                priority == null
                        ? "MEDIUM"
                        : priority.toUpperCase()
        );


        // ======================================
        // DEADLINE
        // ======================================

        module.setDeadline(
                request.getDeadline()
        );


        // ======================================
        // SAVE MODULE
        // ======================================

        ProjectModule savedModule =
                projectModuleRepository
                        .save(module);


        // ======================================
        // SEND TASK EMAIL TO DEVELOPER
        // ======================================

        try {

            notificationEmailService
                    .sendTaskAssignmentNotification(

                            developer.getFullName(),

                            developer.getEmail(),

                            project.getTitle(),

                            savedModule.getModuleName(),

                            savedModule.getDescription(),

                            savedModule.getBranchName(),

                            savedModule.getPriority(),

                            savedModule.getDeadline() == null
                                    ? null
                                    : savedModule
                                            .getDeadline()
                                            .toString(),

                            savedModule.getRepoUrl()
                    );

        } catch (Exception exception) {

            // Task should still be created
            // even if email notification fails.

            System.err.println(

                    "Task assignment email failed: "
                            + exception.getMessage()

            );

        }


        return toResponse(
                savedModule
        );
    }


    // ==========================================
    // GET MODULES BY PROJECT
    // ==========================================

    @Transactional(readOnly = true)
    public List<AdminModuleResponse>
    getModulesByProject(
            Long projectId
    ) {

        Project project =
                projectRepository
                        .findById(
                                projectId
                        )
                        .orElseThrow(
                                () ->
                                        new IllegalArgumentException(
                                                "Project not found."
                                        )
                        );


        return projectModuleRepository
                .findByProjectOrderByCreatedAtDesc(
                        project
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }


    // ==========================================
    // RESPONSE
    // ==========================================

    private AdminModuleResponse toResponse(
            ProjectModule module
    ) {

        return new AdminModuleResponse(

                module.getId(),

                module
                        .getProject()
                        .getId(),

                module
                        .getProject()
                        .getTitle(),

                module
                        .getAssignedDeveloper()
                        .getId(),

                module
                        .getAssignedDeveloper()
                        .getFullName(),

                module
                        .getAssignedDeveloper()
                        .getEmail(),

                module.getModuleName(),

                module.getDescription(),

                module.getAcceptanceCriteria(),

                module.getRepoUrl(),

                module.getBaseBranch(),

                module.getBranchName(),

                module.getPriority(),

                module.getDeadline(),

                module
                        .getStatus()
                        .name(),

                module.getPullRequestUrl(),

                module.getReviewNotes(),

                module.getCreatedAt(),

                module.getUpdatedAt()
        );
    }


    // ==========================================
    // STRING CLEANUP
    // ==========================================

    private String normalize(
            String value
    ) {

        if (
                value == null ||
                value.trim().isEmpty()
        ) {

            return null;
        }


        return value.trim();
    }
}