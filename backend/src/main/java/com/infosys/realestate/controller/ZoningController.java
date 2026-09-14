package com.infosys.realestate.controller;

import com.infosys.realestate.dto.ZoningRequest;
import com.infosys.realestate.dto.ZoningResponse;
import com.infosys.realestate.service.ZoningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/zoning")
@CrossOrigin(origins = "*")
public class ZoningController {

    @Autowired
    private ZoningService zoningService;

    // Get zoning information for a property
    @GetMapping("/{propertyId}")
    @PreAuthorize("isAuthenticated()")
    public ZoningResponse getZoning(
            @PathVariable Long propertyId) {

        return zoningService.getZoningByPropertyId(propertyId);
    }

    // Create zoning information
    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ZoningResponse createZoning(
            @RequestBody ZoningRequest request) {

        return zoningService.createZoning(request);
    }

    // Update zoning information
    @PutMapping("/{propertyId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ZoningResponse updateZoning(
            @PathVariable Long propertyId,
            @RequestBody ZoningRequest request) {

        return zoningService.updateZoning(
                propertyId,
                request
        );
    }
}
