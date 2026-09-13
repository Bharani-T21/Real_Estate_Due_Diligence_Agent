package com.infosys.realestate.repository;

import com.infosys.realestate.entity.Zoning;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ZoningRepository extends JpaRepository<Zoning, Long> {

    Optional<Zoning> findByProperty_PropertyId(Long propertyId);
}