package com.faldren.service;

import com.faldren.entity.Project;
import com.faldren.entity.ProjectModule;

import com.faldren.repository.ProjectModuleRepository;
import com.faldren.repository.ProjectRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
public class AdminProjectDeleteService {

    private final ProjectRepository
            projectRepository;

    private final ProjectModuleRepository
            projectModuleRepository;


    public AdminProjectDeleteService(
            ProjectRepository projectRepository,
            ProjectModuleRepository projectModuleRepository
    ) {

        this.projectRepository =
                projectRepository;

        this.projectModuleRepository =
                projectModuleRepository;
    }


    // ==========================================
    // DELETE PROJECT
    // ==========================================

    @Transactional
    public void deleteProject(
            Long projectId
    ) {

        if (projectId == null) {

            throw new IllegalArgumentException(
                    "Project id is required."
            );
        }


        // ======================================
        // FIND PROJECT
        // ======================================

        Project project =
                projectRepository
                        .findById(projectId)
                        .orElseThrow(
                                () ->
                                        new IllegalArgumentException(
                                                "Project not found."
                                        )
                        );


        // ======================================
        // DELETE PROJECT MODULES / TASKS
        // ======================================

        List<ProjectModule> modules =
                projectModuleRepository
                        .findByProjectOrderByCreatedAtDesc(
                                project
                        );


        if (!modules.isEmpty()) {

            projectModuleRepository
                    .deleteAll(modules);

            projectModuleRepository
                    .flush();
        }


        // ======================================
        // DELETE PROJECT
        // ======================================

        projectRepository.delete(
                project
        );


        projectRepository.flush();
    }
}