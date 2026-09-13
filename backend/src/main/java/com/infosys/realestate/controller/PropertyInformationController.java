package com.infosys.realestate.controller;

import com.infosys.realestate.dto.PropertyInformationResponse;
import com.infosys.realestate.service.PropertyInformationAggregationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/property-information")
@CrossOrigin(origins = "*")
public class PropertyInformationController {

    @Autowired
    private PropertyInformationAggregationService aggregationService;

    @GetMapping("/{propertyId}")
    public PropertyInformationResponse getPropertyInformation(@PathVariable Long propertyId) {
        return aggregationService.getAggregatedPropertyInformation(propertyId);
    }
}
