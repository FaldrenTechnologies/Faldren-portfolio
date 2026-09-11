package com.faldren.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;


public class AdminModuleResponse {

    private Long id;

    private Long projectId;

    private String projectTitle;

    private Long developerId;

    private String developerName;

    private String developerEmail;

    private String moduleName;

    private String description;

    private String acceptanceCriteria;

    private String repoUrl;

    private String baseBranch;

    private String branchName;

    private String priority;

    private LocalDate deadline;

    private String status;

    private String pullRequestUrl;

    private String reviewNotes;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;


    public AdminModuleResponse() {
    }


    public AdminModuleResponse(
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
            String reviewNotes,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {

        this.id = id;
        this.projectId = projectId;
        this.projectTitle = projectTitle;

        this.developerId = developerId;
        this.developerName = developerName;
        this.developerEmail = developerEmail;

        this.moduleName = moduleName;
        this.description = description;

        this.acceptanceCriteria =
                acceptanceCriteria;

        this.repoUrl = repoUrl;
        this.baseBranch = baseBranch;
        this.branchName = branchName;

        this.priority = priority;
        this.deadline = deadline;

        this.status = status;

        this.pullRequestUrl =
                pullRequestUrl;

        this.reviewNotes =
                reviewNotes;

        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }


    public Long getId() {
        return id;
    }


    public Long getProjectId() {
        return projectId;
    }


    public String getProjectTitle() {
        return projectTitle;
    }


    public Long getDeveloperId() {
        return developerId;
    }


    public String getDeveloperName() {
        return developerName;
    }


    public String getDeveloperEmail() {
        return developerEmail;
    }


    public String getModuleName() {
        return moduleName;
    }


    public String getDescription() {
        return description;
    }


    public String getAcceptanceCriteria() {
        return acceptanceCriteria;
    }


    public String getRepoUrl() {
        return repoUrl;
    }


    public String getBaseBranch() {
        return baseBranch;
    }


    public String getBranchName() {
        return branchName;
    }


    public String getPriority() {
        return priority;
    }


    public LocalDate getDeadline() {
        return deadline;
    }


    public String getStatus() {
        return status;
    }


    public String getPullRequestUrl() {
        return pullRequestUrl;
    }


    public String getReviewNotes() {
        return reviewNotes;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }


    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}