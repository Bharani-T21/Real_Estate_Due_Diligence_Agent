package com.infosys.realestate.service.impl;

import com.infosys.realestate.dto.FloodZoneResponse;
import com.infosys.realestate.entity.FloodZone;
import com.infosys.realestate.exception.ResourceNotFoundException;
import com.infosys.realestate.repository.FloodZoneRepository;
import com.infosys.realestate.service.FloodZoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FloodZoneServiceImpl implements FloodZoneService {

    @Autowired
    private FloodZoneRepository floodZoneRepository;

    @Override
    public FloodZoneResponse getFloodZoneByPropertyId(Long propertyId) {

        FloodZone floodZone = floodZoneRepository
                .findByPropertyPropertyId(propertyId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Flood zone information not found for property id: " + propertyId
                        )
                );

        FloodZoneResponse response = new FloodZoneResponse();

        response.setPropertyId(
                floodZone.getProperty().getPropertyId()
        );

        response.setZone(
                floodZone.getZone()
        );

        response.setBaseFloodElevation(
                floodZone.getBaseFloodElevation()
        );

        response.setInsuranceRequired(
                floodZone.getInsuranceRequired()
        );

        response.setNearestWaterBody(
                floodZone.getNearestWaterBody()
        );

        response.setDistanceToWaterBody(
                floodZone.getDistanceToWaterBody()
        );

        response.setFemaPanel(
                floodZone.getFemaPanel()
        );

        return response;
    }
}
