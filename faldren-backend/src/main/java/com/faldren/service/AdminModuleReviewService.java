package com.faldren.service;

import com.faldren.dto.AdminRequestChangesRequest;
import com.faldren.dto.AdminReviewModuleResponse;

import com.faldren.entity.ModuleStatus;
import com.faldren.entity.ProjectModule;

import com.faldren.repository.ProjectModuleRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
public class AdminModuleReviewService {

    private final ProjectModuleRepository
            projectModuleRepository;


    public AdminModuleReviewService(
            ProjectModuleRepository projectModuleRepository
    ) {

        this.projectModuleRepository =
                projectModuleRepository;

    }


    // ==========================================
    // REVIEW QUEUE
    // ==========================================

    @Transactional(readOnly = true)
    public List<AdminReviewModuleResponse>
    getReviewQueue() {

        return projectModuleRepository
                .findByStatusOrderByUpdatedAtDesc(
                        ModuleStatus.IN_REVIEW
                )
                .stream()
                .map(this::toResponse)
                .toList();

    }


    // ==========================================
    // APPROVE MODULE
    // IN_REVIEW -> APPROVED
    // ==========================================

    @Transactional
    public AdminReviewModuleResponse approveModule(
            Long moduleId
    ) {

        ProjectModule module =
                getModule(
                        moduleId
                );


        if (
                module.getStatus()
                        != ModuleStatus.IN_REVIEW
        ) {

            throw new RuntimeException(
                    "Only modules in review can be approved."
            );

        }


        module.setStatus(
                ModuleStatus.APPROVED
        );


        module.setReviewNotes(
                null
        );


        ProjectModule saved =
                projectModuleRepository
                        .save(module);


        return toResponse(
                saved
        );

    }


    // ==========================================
    // REQUEST CHANGES
    // IN_REVIEW -> CHANGES_REQUESTED
    // ==========================================

    @Transactional
    public AdminReviewModuleResponse requestChanges(
            Long moduleId,
            AdminRequestChangesRequest request
    ) {

        ProjectModule module =
                getModule(
                        moduleId
                );


        if (
                module.getStatus()
                        != ModuleStatus.IN_REVIEW
        ) {

            throw new RuntimeException(
                    "Changes can only be requested for modules in review."
            );

        }


        if (
                request == null ||
                request.reviewNotes() == null ||
                request.reviewNotes()
                        .trim()
                        .isEmpty()
        ) {

            throw new RuntimeException(
                    "Review notes are required."
            );

        }


        module.setReviewNotes(
                request.reviewNotes()
                        .trim()
        );


        module.setStatus(
                ModuleStatus.CHANGES_REQUESTED
        );


        ProjectModule saved =
                projectModuleRepository
                        .save(module);


        return toResponse(
                saved
        );

    }


    // ==========================================
    // GET MODULE
    // ==========================================

    private ProjectModule getModule(
            Long moduleId
    ) {

        return projectModuleRepository
                .findById(
                        moduleId
                )
                .orElseThrow(
                        () ->
                                new RuntimeException(
                                        "Module not found."
                                )
                );

    }


    // ==========================================
    // RESPONSE
    // ==========================================

    private AdminReviewModuleResponse toResponse(
            ProjectModule module
    ) {

        return new AdminReviewModuleResponse(

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

                module.getSubmissionSummary(),

                module.getTestingNotes(),

                module.getReviewNotes(),

                module.getUpdatedAt()

        );

    }

}