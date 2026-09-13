package com.infosys.realestate.service;

import com.infosys.realestate.entity.PropertyTaxHistory;
import com.infosys.realestate.repository.PropertyTaxHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PropertyTaxHistoryService {

    @Autowired
    private PropertyTaxHistoryRepository propertyTaxHistoryRepository;

    // Save Property Tax History
    public PropertyTaxHistory savePropertyTaxHistory(PropertyTaxHistory propertyTaxHistory) {
        return propertyTaxHistoryRepository.save(propertyTaxHistory);
    }

    // Get all Property Tax History
    public List<PropertyTaxHistory> getAllPropertyTaxHistory() {
        return propertyTaxHistoryRepository.findAll();
    }

    // Get Property Tax History by ID
    public Optional<PropertyTaxHistory> getPropertyTaxHistoryById(Long id) {
        return propertyTaxHistoryRepository.findById(id);
    }
    public List<PropertyTaxHistory> getTaxHistoryByPropertyId(Long propertyId) {
        return propertyTaxHistoryRepository.findByProperty_PropertyId(propertyId);
    }

    // Delete Property Tax History
    public void deletePropertyTaxHistory(Long id) {
        propertyTaxHistoryRepository.deleteById(id);
    }
}