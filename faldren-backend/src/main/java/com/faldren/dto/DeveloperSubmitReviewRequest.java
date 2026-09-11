package com.faldren.dto;

public record DeveloperSubmitReviewRequest(

        String pullRequestUrl,
        String submissionSummary,
        String testingNotes

) {
}