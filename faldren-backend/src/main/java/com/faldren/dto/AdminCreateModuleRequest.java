package com.faldren.dto;

import java.time.LocalDate;


public class AdminCreateModuleRequest {

    private Long projectId;

    private Long developerId;

    private String moduleName;

    private String description;

    private String acceptanceCriteria;

    private String repoUrl;

    private String baseBranch;

    private String branchName;

    private String priority;

    private LocalDate deadline;


    public AdminCreateModuleRequest() {
    }


    public Long getProjectId() {
        return projectId;
    }


    public void setProjectId(
            Long projectId
    ) {
        this.projectId = projectId;
    }


    public Long getDeveloperId() {
        return developerId;
    }


    public void setDeveloperId(
            Long developerId
    ) {
        this.developerId = developerId;
    }


    public String getModuleName() {
        return moduleName;
    }


    public void setModuleName(
            String moduleName
    ) {
        this.moduleName = moduleName;
    }


    public String getDescription() {
        return description;
    }


    public void setDescription(
            String description
    ) {
        this.description = description;
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
        this.repoUrl = repoUrl;
    }


    public String getBaseBranch() {
        return baseBranch;
    }


    public void setBaseBranch(
            String baseBranch
    ) {
        this.baseBranch = baseBranch;
    }


    public String getBranchName() {
        return branchName;
    }


    public void setBranchName(
            String branchName
    ) {
        this.branchName = branchName;
    }


    public String getPriority() {
        return priority;
    }


    public void setPriority(
            String priority
    ) {
        this.priority = priority;
    }


    public LocalDate getDeadline() {
        return deadline;
    }


    public void setDeadline(
            LocalDate deadline
    ) {
        this.deadline = deadline;
    }
}