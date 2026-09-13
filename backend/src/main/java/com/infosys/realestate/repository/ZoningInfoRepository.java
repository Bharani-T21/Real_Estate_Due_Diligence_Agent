package com.infosys.realestate.repository;

import com.infosys.realestate.entity.ZoningInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ZoningInfoRepository extends JpaRepository<ZoningInfo, Long> {
    Optional<ZoningInfo> findByPropertyId(String propertyId);
}
