package com.infosys.realestate.controller;

import com.infosys.realestate.entity.PropertyTaxHistory;
import com.infosys.realestate.service.PropertyTaxHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/property-tax-history")
public class PropertyTaxHistoryController {

    @Autowired
    private PropertyTaxHistoryService propertyTaxHistoryService;

    // Create Property Tax History
    @PostMapping
    public PropertyTaxHistory createPropertyTaxHistory(@RequestBody PropertyTaxHistory propertyTaxHistory) {
        return propertyTaxHistoryService.savePropertyTaxHistory(propertyTaxHistory);
    }
    @GetMapping("/property/{propertyId}")
    public List<PropertyTaxHistory> getTaxHistoryByPropertyId(
            @PathVariable Long propertyId) {

        return propertyTaxHistoryService.getTaxHistoryByPropertyId(propertyId);
    }
        // Get Property Tax History by ID
    @GetMapping("/{id}")
    public Optional<PropertyTaxHistory> getPropertyTaxHistoryById(@PathVariable Long id) {
        return propertyTaxHistoryService.getPropertyTaxHistoryById(id);
    }

    // Delete Property Tax History
    @DeleteMapping("/{id}")
    public void deletePropertyTaxHistory(@PathVariable Long id) {
        propertyTaxHistoryService.deletePropertyTaxHistory(id);
    }
    @GetMapping("/test")
public String test() {
    return "Property Tax History Controller is Working";
}
}