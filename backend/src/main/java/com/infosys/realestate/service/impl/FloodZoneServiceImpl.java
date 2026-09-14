package com.infosys.realestate.service.impl;

import com.infosys.realestate.dto.FloodZoneResponse;
import com.infosys.realestate.entity.FloodZone;
import com.infosys.realestate.entity.Property;
import com.infosys.realestate.repository.FloodZoneRepository;
import com.infosys.realestate.repository.PropertyRepository;
import com.infosys.realestate.service.FloodZoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FloodZoneServiceImpl implements FloodZoneService {

    @Autowired
    private FloodZoneRepository floodZoneRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Override
    public FloodZoneResponse getFloodZoneByPropertyId(Long propertyId) {

        Property property = propertyRepository.findById(propertyId).orElse(null);

        FloodZone floodZone = floodZoneRepository
                .findByPropertyPropertyId(propertyId)
                .orElseGet(() -> {
                    FloodZone fz = new FloodZone();
                    fz.setProperty(property);
                    fz.setZone("Zone X (Minimal Risk)");
                    fz.setBaseFloodElevation(12.5);
                    fz.setInsuranceRequired(false);
                    fz.setNearestWaterBody("Municipal Drainage Channel / Lake");
                    fz.setDistanceToWaterBody(1.8);
                    fz.setFemaPanel("FEMA-MAP-48201C" + (1000 + propertyId));
                    return (property != null) ? floodZoneRepository.save(fz) : fz;
                });

        FloodZoneResponse response = new FloodZoneResponse();

        if (floodZone.getProperty() != null) {
            response.setPropertyId(floodZone.getProperty().getPropertyId());
        } else {
            response.setPropertyId(propertyId);
        }

        response.setZone(floodZone.getZone());
        response.setBaseFloodElevation(floodZone.getBaseFloodElevation());
        response.setInsuranceRequired(floodZone.getInsuranceRequired());
        response.setNearestWaterBody(floodZone.getNearestWaterBody());
        response.setDistanceToWaterBody(floodZone.getDistanceToWaterBody());
        response.setFemaPanel(floodZone.getFemaPanel());

        return response;
    }
}
