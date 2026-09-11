package com.faldren.repository;

import com.faldren.entity.ModuleStatus;
import com.faldren.entity.Project;
import com.faldren.entity.ProjectModule;
import com.faldren.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface ProjectModuleRepository
        extends JpaRepository<ProjectModule, Long> {


    List<ProjectModule>
    findByProjectOrderByCreatedAtDesc(
            Project project
    );


    List<ProjectModule>
    findByAssignedDeveloperOrderByCreatedAtDesc(
            User assignedDeveloper
    );


    List<ProjectModule>
    findByStatusOrderByUpdatedAtDesc(
            ModuleStatus status
    );

}