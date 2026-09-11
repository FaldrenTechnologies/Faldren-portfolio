package com.faldren.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record DeveloperModuleResponse(

        Long id,

        Long projectId,
        String projectTitle,

        String moduleName,
        String description,
        String acceptanceCriteria,

        String repoUrl,
        String baseBranch,
        String branchName,

        String priority,
        LocalDate deadline,

        String status,

        String pullRequestUrl,
        String reviewNotes,

        LocalDateTime createdAt,
        LocalDateTime updatedAt

) {
}