package com.infosys.realestate.repository;

import com.infosys.realestate.entity.Permit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PermitRepository extends JpaRepository<Permit, Long> {

    List<Permit> findByPropertyPropertyId(Long propertyId);
}