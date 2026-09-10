package com.faldren.service;

import com.faldren.dto.CreateProjectRequestRequest;
import com.faldren.dto.ProjectRequestResponse;
import com.faldren.dto.ProjectResponse;

import com.faldren.entity.Project;
import com.faldren.entity.ProjectRequest;
import com.faldren.entity.ProjectRequestStatus;
import com.faldren.entity.ProjectStatus;
import com.faldren.entity.Role;
import com.faldren.entity.User;

import com.faldren.repository.ProjectRepository;
import com.faldren.repository.ProjectRequestRepository;
import com.faldren.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;


@Service
public class ProjectRequestService {

    private final UserRepository userRepository;

    private final ProjectRequestRepository
            projectRequestRepository;

    private final ProjectRepository
            projectRepository;


    public ProjectRequestService(
            UserRepository userRepository,
            ProjectRequestRepository projectRequestRepository,
            ProjectRepository projectRepository
    ) {

        this.userRepository =
                userRepository;

        this.projectRequestRepository =
                projectRequestRepository;

        this.projectRepository =
                projectRepository;
    }



    // ==========================================
    // CLIENT - CREATE REQUEST
    // ==========================================

    @Transactional
    public ProjectRequestResponse createRequest(
            String authenticatedEmail,
            CreateProjectRequestRequest request
    ) {

        User client =
                getClient(
                        authenticatedEmail
                );


        ProjectRequest projectRequest =
                new ProjectRequest();


        projectRequest.setClient(client);

        projectRequest.setProjectName(
                request.projectName().trim()
        );

        projectRequest.setServiceType(
                request.serviceType().trim()
        );

        projectRequest.setDescription(
                request.description().trim()
        );

        projectRequest.setRequirements(
                request.requirements().trim()
        );

        projectRequest.setBusinessGoal(
                request.businessGoal().trim()
        );

        projectRequest.setBudgetRange(
                request.budgetRange().trim()
        );

        projectRequest.setExpectedDeadline(
                request.expectedDeadline()
        );

        projectRequest.setReferenceLinks(
                cleanOptional(
                        request.referenceLinks()
                )
        );

        projectRequest.setAdditionalNotes(
                cleanOptional(
                        request.additionalNotes()
                )
        );

        projectRequest.setStatus(
                ProjectRequestStatus.PENDING
        );


        ProjectRequest saved =
                projectRequestRepository.save(
                        projectRequest
                );


        return toRequestResponse(saved);
    }



    // ==========================================
    // CLIENT - GET OWN REQUESTS
    // ==========================================

    @Transactional(readOnly = true)
    public List<ProjectRequestResponse>
            getClientRequests(
                    String authenticatedEmail
            ) {

        User client =
                getClient(
                        authenticatedEmail
                );


        return projectRequestRepository
                .findByClientOrderByCreatedAtDesc(
                        client
                )
                .stream()
                .map(this::toRequestResponse)
                .toList();
    }



    // ==========================================
    // CLIENT - GET ACCEPTED PROJECTS
    // ==========================================

    @Transactional(readOnly = true)
    public List<ProjectResponse>
            getClientProjects(
                    String authenticatedEmail
            ) {

        User client =
                getClient(
                        authenticatedEmail
                );


        return projectRepository
                .findByClientOrderByCreatedAtDesc(
                        client
                )
                .stream()
                .map(this::toProjectResponse)
                .toList();
    }



    // ==========================================
    // ADMIN - GET ALL REQUESTS
    // ==========================================

    @Transactional(readOnly = true)
    public List<ProjectRequestResponse>
            getAllRequests() {

        return projectRequestRepository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toRequestResponse)
                .toList();
    }



    // ==========================================
    // ADMIN - ACCEPT
    // ==========================================

    @Transactional
    public ProjectResponse acceptRequest(
            Long requestId
    ) {

        ProjectRequest request =
                getRequest(requestId);


        if (
                request.getStatus()
                        == ProjectRequestStatus.REJECTED
        ) {

            throw new RuntimeException(
                    "Rejected request cannot be accepted."
            );
        }


        if (
                request.getStatus()
                        == ProjectRequestStatus.ACCEPTED
        ) {

            return projectRepository
                    .findBySourceRequest_Id(
                            requestId
                    )
                    .map(this::toProjectResponse)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Project record not found."
                            )
                    );
        }


        request.setStatus(
                ProjectRequestStatus.ACCEPTED
        );

        projectRequestRepository.save(
                request
        );


        Project project =
                new Project();


        project.setClient(
                request.getClient()
        );

        project.setSourceRequest(
                request
        );

        project.setTitle(
                request.getProjectName()
        );

        project.setServiceType(
                request.getServiceType()
        );

        project.setDescription(
                request.getDescription()
        );

        project.setStatus(
                ProjectStatus.PLANNING
        );

        project.setProgress(0);

        project.setStartDate(
                LocalDate.now()
        );

        project.setDueDate(
                request.getExpectedDeadline()
        );


        Project savedProject =
                projectRepository.save(
                        project
                );


        return toProjectResponse(
                savedProject
        );
    }



    // ==========================================
    // ADMIN - REJECT
    // ==========================================

    @Transactional
    public ProjectRequestResponse rejectRequest(
            Long requestId
    ) {

        ProjectRequest request =
                getRequest(requestId);


        if (
                request.getStatus()
                        == ProjectRequestStatus.ACCEPTED
        ) {

            throw new RuntimeException(
                    "Accepted request cannot be rejected."
            );
        }


        request.setStatus(
                ProjectRequestStatus.REJECTED
        );


        ProjectRequest saved =
                projectRequestRepository.save(
                        request
                );


        return toRequestResponse(saved);
    }

// ==========================================
// ADMIN - GET ALL PROJECTS
// ==========================================

@Transactional(readOnly = true)
public List<ProjectResponse> getAllProjects() {

    return projectRepository
            .findAllByOrderByCreatedAtDesc()
            .stream()
            .map(this::toProjectResponse)
            .toList();
}

    // ==========================================
    // HELPERS
    // ==========================================

    private User getClient(
            String email
    ) {

        User user =
                userRepository
                        .findByEmail(
                                email
                                        .trim()
                                        .toLowerCase()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Client account not found."
                                )
                        );


        if (user.getRole() != Role.CLIENT) {

            throw new RuntimeException(
                    "Client access denied."
            );
        }


        return user;
    }


    private ProjectRequest getRequest(
            Long requestId
    ) {

        return projectRequestRepository
                .findById(requestId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Project request not found."
                        )
                );
    }


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


    private ProjectRequestResponse
            toRequestResponse(
                    ProjectRequest request
            ) {

        User client =
                request.getClient();


        return new ProjectRequestResponse(

                request.getId(),

                client.getId(),

                client.getFullName(),

                client.getEmail(),

                client.getCompanyName(),

                client.getPhone(),

                request.getProjectName(),

                request.getServiceType(),

                request.getDescription(),

                request.getRequirements(),

                request.getBusinessGoal(),

                request.getBudgetRange(),

                request.getExpectedDeadline(),

                request.getReferenceLinks(),

                request.getAdditionalNotes(),

                request.getStatus().name(),

                request.getCreatedAt()

        );
    }


    private ProjectResponse
            toProjectResponse(
                    Project project
            ) {

        User client =
                project.getClient();


        return new ProjectResponse(

                project.getId(),

                client.getId(),

                client.getFullName(),

                client.getCompanyName(),

                project.getTitle(),

                project.getServiceType(),

                project.getDescription(),

                project.getStatus().name(),

                project.getProgress(),

                project.getStartDate(),

                project.getDueDate(),

                project.getCreatedAt()

        );
    }
}