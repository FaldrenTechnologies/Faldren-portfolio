

package com.faldren.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;


public record AdminReviewModuleResponse(

        Long id,

        Long projectId,
        String projectTitle,

        Long developerId,
        String developerName,
        String developerEmail,

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

        String submissionSummary,
        String testingNotes,

        String reviewNotes,

        LocalDateTime updatedAt

) {
}