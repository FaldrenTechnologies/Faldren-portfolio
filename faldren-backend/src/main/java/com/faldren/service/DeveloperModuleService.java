package com.faldren.service;

import com.faldren.dto.DeveloperModuleResponse;

import com.faldren.entity.ModuleStatus;
import com.faldren.entity.ProjectModule;
import com.faldren.entity.Role;
import com.faldren.entity.User;

import com.faldren.repository.ProjectModuleRepository;
import com.faldren.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
public class DeveloperModuleService {

    private final ProjectModuleRepository
            projectModuleRepository;

    private final UserRepository
            userRepository;


    public DeveloperModuleService(
            ProjectModuleRepository projectModuleRepository,
            UserRepository userRepository
    ) {

        this.projectModuleRepository =
                projectModuleRepository;

        this.userRepository =
                userRepository;
    }


    // ==========================================
    // GET MY MODULES
    // ==========================================

    @Transactional(readOnly = true)
    public List<DeveloperModuleResponse>
    getMyModules(
            String authenticatedEmail
    ) {

        User developer =
                getDeveloper(
                        authenticatedEmail
                );


        return projectModuleRepository
                .findByAssignedDeveloperOrderByCreatedAtDesc(
                        developer
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }


    // ==========================================
    // START WORK
    // ASSIGNED -> IN_PROGRESS
    // ==========================================

    @Transactional
    public DeveloperModuleResponse startWork(
            Long moduleId,
            String authenticatedEmail
    ) {

        User developer =
                getDeveloper(
                        authenticatedEmail
                );


        ProjectModule module =
                projectModuleRepository
                        .findById(moduleId)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Module not found."
                                        )
                        );


        // Developer can update only own module

        if (
                !module
                        .getAssignedDeveloper()
                        .getId()
                        .equals(
                                developer.getId()
                        )
        ) {

            throw new RuntimeException(
                    "You cannot access this module."
            );
        }


        // Already started

        if (
                module.getStatus()
                        == ModuleStatus.IN_PROGRESS
        ) {

            return toResponse(
                    module
            );
        }


        // Only ASSIGNED module can start

        if (
                module.getStatus()
                        != ModuleStatus.ASSIGNED
        ) {

            throw new RuntimeException(
                    "This module cannot be started from its current status."
            );
        }


        module.setStatus(
                ModuleStatus.IN_PROGRESS
        );


        ProjectModule saved =
                projectModuleRepository
                        .save(module);


        return toResponse(
                saved
        );
    }

// ==========================================
// SUBMIT FOR REVIEW
// IN_PROGRESS -> IN_REVIEW
// ==========================================

@Transactional
public DeveloperModuleResponse submitForReview(
        Long moduleId,
        String authenticatedEmail,
        com.faldren.dto.DeveloperSubmitReviewRequest request
) {

    User developer =
            getDeveloper(
                    authenticatedEmail
            );


    ProjectModule module =
            projectModuleRepository
                    .findById(moduleId)
                    .orElseThrow(
                            () ->
                                    new RuntimeException(
                                            "Module not found."
                                    )
                    );


    if (
            !module
                    .getAssignedDeveloper()
                    .getId()
                    .equals(
                            developer.getId()
                    )
    ) {

        throw new RuntimeException(
                "You cannot access this module."
        );
    }


    if (
            module.getStatus()
                    != ModuleStatus.IN_PROGRESS &&
            module.getStatus()
                    != ModuleStatus.CHANGES_REQUESTED
    ) {

        throw new RuntimeException(
                "This module cannot be submitted for review."
        );
    }


    if (
            request.pullRequestUrl() == null ||
            request.pullRequestUrl()
                    .trim()
                    .isEmpty()
    ) {

        throw new RuntimeException(
                "Pull request URL is required."
        );
    }


    if (
            request.submissionSummary() == null ||
            request.submissionSummary()
                    .trim()
                    .isEmpty()
    ) {

        throw new RuntimeException(
                "Work summary is required."
        );
    }


    module.setPullRequestUrl(
            request.pullRequestUrl()
                    .trim()
    );


    module.setSubmissionSummary(
            request.submissionSummary()
                    .trim()
    );


    module.setTestingNotes(
            cleanOptional(
                    request.testingNotes()
            )
    );


    // Clear previous admin feedback
    // when developer resubmits changes

    module.setReviewNotes(
            null
    );


    module.setStatus(
            ModuleStatus.IN_REVIEW
    );


    ProjectModule saved =
            projectModuleRepository
                    .save(module);


    return toResponse(
            saved
    );
}


// ==========================================
// OPTIONAL STRING
// ==========================================

private String cleanOptional(
        String value
) {

    if (value == null) {
        return null;
    }


    String cleaned =
            value.trim();


    return cleaned.isEmpty()
            ? null
            : cleaned;
}

    // ==========================================
    // GET DEVELOPER
    // ==========================================

    private User getDeveloper(
            String email
    ) {

        User developer =
                userRepository
                        .findByEmail(
                                email
                                        .trim()
                                        .toLowerCase()
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Developer account not found."
                                        )
                        );


        if (
                developer.getRole()
                        != Role.DEVELOPER
        ) {

            throw new RuntimeException(
                    "Developer access denied."
            );
        }


        if (!developer.isActive()) {

            throw new RuntimeException(
                    "Developer account is disabled."
            );
        }


        if (
                developer
                        .isMustChangePassword()
        ) {

            throw new RuntimeException(
                    "Password change required."
            );
        }


        return developer;
    }


    // ==========================================
    // RESPONSE
    // ==========================================

    private DeveloperModuleResponse
    toResponse(
            ProjectModule module
    ) {

        return new DeveloperModuleResponse(

                module.getId(),

                module
                        .getProject()
                        .getId(),

                module
                        .getProject()
                        .getTitle(),

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
}