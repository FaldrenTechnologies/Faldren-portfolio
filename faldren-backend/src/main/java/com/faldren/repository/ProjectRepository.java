package com.faldren.repository;

import com.faldren.entity.Project;
import com.faldren.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface ProjectRepository
        extends JpaRepository<Project, Long> {

    List<Project>
    findByClientOrderByCreatedAtDesc(
            User client
    );


    List<Project>
    findAllByOrderByCreatedAtDesc();


    Optional<Project>
    findBySourceRequest_Id(
            Long requestId
    );


    boolean existsBySourceRequest_Id(
            Long requestId
    );
}