package com.infosys.realestate.controller;

import com.infosys.realestate.dto.FloodZoneResponse;
import com.infosys.realestate.service.FloodZoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.infosys.realestate.entity.FloodZone;
import com.infosys.realestate.repository.FloodZoneRepository;
import com.infosys.realestate.repository.PropertyRepository;
import com.infosys.realestate.dto.FloodZoneRequest;
import com.infosys.realestate.entity.Property;

@RestController
@RequestMapping("/api/flood-zone")
@CrossOrigin(origins = "*")
public class FloodZoneController {

    @Autowired
    private FloodZoneService floodZoneService;
    @Autowired
    private FloodZoneRepository floodZoneRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @GetMapping("/{propertyId}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public FloodZoneResponse getFloodZone(
            @PathVariable Long propertyId) {

        return floodZoneService.getFloodZoneByPropertyId(propertyId);
    }
    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public FloodZoneResponse createFloodZone(
            @RequestBody FloodZoneRequest request) {

        Property property = propertyRepository
                .findById(request.getPropertyId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Property not found with id: "
                                        + request.getPropertyId()
                        ));

        if (floodZoneRepository
                .findByPropertyPropertyId(request.getPropertyId())
                .isPresent()) {

            throw new RuntimeException(
                    "Flood zone already exists for property id: "
                            + request.getPropertyId()
            );
        }

        FloodZone floodZone = new FloodZone();

        floodZone.setProperty(property);
        floodZone.setZone(request.getZone());
        floodZone.setBaseFloodElevation(
                request.getBaseFloodElevation()
        );
        floodZone.setInsuranceRequired(
                request.getInsuranceRequired()
        );
        floodZone.setNearestWaterBody(
                request.getNearestWaterBody()
        );
        floodZone.setDistanceToWaterBody(
                request.getDistanceToWaterBody()
        );
        floodZone.setFemaPanel(
                request.getFemaPanel()
        );

        FloodZone saved = floodZoneRepository.save(floodZone);

        FloodZoneResponse response = new FloodZoneResponse();

        response.setPropertyId(
                saved.getProperty().getPropertyId()
        );
        response.setZone(saved.getZone());
        response.setBaseFloodElevation(
                saved.getBaseFloodElevation()
        );
        response.setInsuranceRequired(
                saved.getInsuranceRequired()
        );
        response.setNearestWaterBody(
                saved.getNearestWaterBody()
        );
        response.setDistanceToWaterBody(
                saved.getDistanceToWaterBody()
        );
        response.setFemaPanel(
                saved.getFemaPanel()
        );

        return response;
    }
}
