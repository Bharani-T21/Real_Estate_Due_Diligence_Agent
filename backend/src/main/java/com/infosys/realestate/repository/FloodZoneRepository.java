package com.infosys.realestate.repository;

import com.infosys.realestate.entity.FloodZone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FloodZoneRepository extends JpaRepository<FloodZone, Long> {

    Optional<FloodZone> findByPropertyPropertyId(Long propertyId);
}