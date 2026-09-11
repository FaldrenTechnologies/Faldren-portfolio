package com.faldren.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Entity
@Table(name = "project_modules")
public class ProjectModule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // ==========================================
    // PROJECT
    // ==========================================

    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "project_id",
            nullable = false
    )
    private Project project;


    // ==========================================
    // ASSIGNED DEVELOPER
    // ==========================================

    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "developer_id",
            nullable = false
    )
    private User assignedDeveloper;


    // ==========================================
    // MODULE DETAILS
    // ==========================================

    @Column(
            name = "module_name",
            nullable = false,
            length = 160
    )
    private String moduleName;


    @Column(
            columnDefinition = "TEXT"
    )
    private String description;


    @Column(
            name = "acceptance_criteria",
            columnDefinition = "TEXT"
    )
    private String acceptanceCriteria;


    // ==========================================
    // GIT DETAILS
    // ==========================================

    @Column(
            name = "repo_url",
            length = 500
    )
    private String repoUrl;


    @Column(
            name = "base_branch",
            nullable = false,
            length = 100
    )
    private String baseBranch;


    @Column(
            name = "branch_name",
            nullable = false,
            length = 180
    )
    private String branchName;


    @Column(
            name = "pull_request_url",
            length = 500
    )
    private String pullRequestUrl;


    // ==========================================
    // WORK DETAILS
    // ==========================================

    @Column(
            nullable = false,
            length = 20
    )
    private String priority;


    @Column
    private LocalDate deadline;


    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 30
    )
    private ModuleStatus status;


    // ==========================================
    // REVIEW DETAILS
    // ==========================================

    @Column(
            name = "submission_summary",
            columnDefinition = "TEXT"
    )
    private String submissionSummary;


    @Column(
            name = "testing_notes",
            columnDefinition = "TEXT"
    )
    private String testingNotes;


    @Column(
            name = "review_notes",
            columnDefinition = "TEXT"
    )
    private String reviewNotes;


    // ==========================================
    // TIMESTAMPS
    // ==========================================

    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private LocalDateTime createdAt;


    @Column(
            name = "updated_at",
            nullable = false
    )
    private LocalDateTime updatedAt;


    // ==========================================
    // CREATE
    // ==========================================

    @PrePersist
    public void onCreate() {

        LocalDateTime now =
                LocalDateTime.now();

        createdAt = now;
        updatedAt = now;


        if (status == null) {

            status =
                    ModuleStatus.ASSIGNED;

        }


        if (
                priority == null ||
                priority.isBlank()
        ) {

            priority =
                    "MEDIUM";

        }


        if (
                baseBranch == null ||
                baseBranch.isBlank()
        ) {

            baseBranch =
                    "develop";

        }
    }


    // ==========================================
    // UPDATE
    // ==========================================

    @PreUpdate
    public void onUpdate() {

        updatedAt =
                LocalDateTime.now();

    }


    // ==========================================
    // GETTERS / SETTERS
    // ==========================================

    public Long getId() {

        return id;

    }


    public Project getProject() {

        return project;

    }


    public void setProject(
            Project project
    ) {

        this.project =
                project;

    }


    public User getAssignedDeveloper() {

        return assignedDeveloper;

    }


    public void setAssignedDeveloper(
            User assignedDeveloper
    ) {

        this.assignedDeveloper =
                assignedDeveloper;

    }


    public String getModuleName() {

        return moduleName;

    }


    public void setModuleName(
            String moduleName
    ) {

        this.moduleName =
                moduleName;

    }


    public String getDescription() {

        return description;

    }


    public void setDescription(
            String description
    ) {

        this.description =
                description;

    }


    public String getAcceptanceCriteria() {

        return acceptanceCriteria;

    }


    public void setAcceptanceCriteria(
            String acceptanceCriteria
    ) {

        this.acceptanceCriteria =
                acceptanceCriteria;

    }


    public String getRepoUrl() {

        return repoUrl;

    }


    public void setRepoUrl(
            String repoUrl
    ) {

        this.repoUrl =
                repoUrl;

    }


    public String getBaseBranch() {

        return baseBranch;

    }


    public void setBaseBranch(
            String baseBranch
    ) {

        this.baseBranch =
                baseBranch;

    }


    public String getBranchName() {

        return branchName;

    }


    public void setBranchName(
            String branchName
    ) {

        this.branchName =
                branchName;

    }


    public String getPullRequestUrl() {

        return pullRequestUrl;

    }


    public void setPullRequestUrl(
            String pullRequestUrl
    ) {

        this.pullRequestUrl =
                pullRequestUrl;

    }


    public String getPriority() {

        return priority;

    }


    public void setPriority(
            String priority
    ) {

        this.priority =
                priority;

    }


    public LocalDate getDeadline() {

        return deadline;

    }


    public void setDeadline(
            LocalDate deadline
    ) {

        this.deadline =
                deadline;

    }


    public ModuleStatus getStatus() {

        return status;

    }


    public void setStatus(
            ModuleStatus status
    ) {

        this.status =
                status;

    }


    public String getSubmissionSummary() {

        return submissionSummary;

    }


    public void setSubmissionSummary(
            String submissionSummary
    ) {

        this.submissionSummary =
                submissionSummary;

    }


    public String getTestingNotes() {

        return testingNotes;

    }


    public void setTestingNotes(
            String testingNotes
    ) {

        this.testingNotes =
                testingNotes;

    }


    public String getReviewNotes() {

        return reviewNotes;

    }


    public void setReviewNotes(
            String reviewNotes
    ) {

        this.reviewNotes =
                reviewNotes;

    }


    public LocalDateTime getCreatedAt() {

        return createdAt;

    }


    public LocalDateTime getUpdatedAt() {

        return updatedAt;

    }
}