package com.infosys.realestate.repository;

import com.infosys.realestate.entity.PropertyTaxHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyTaxHistoryRepository extends JpaRepository<PropertyTaxHistory, Long> {

    List<PropertyTaxHistory> findByProperty_PropertyId(Long propertyId);

}